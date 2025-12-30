---
title: 2023-11-13-【架构】Ubuntu 下 Nginx自动申请ssl证书方案
date: 2023-11-13 23:11:39
description:
categories:
  - 架构
tags:
  - SSL证书
---

既然你倾向于留在 Nginx 方案，我为你推荐 **acme.sh**。它是目前 Linux 环境下自动化程度最高、对原有 Nginx 配置侵入性最小的方案。

以下是针对你 `blowsysun.top` 域名的全自动申请与续期实战步骤：

---

### 第一步：安装 acme.sh

执行以下命令安装脚本（将邮箱换成你自己的，用于接收证书过期提醒）：

```bash
curl https://get.acme.sh | sh -s email=my@example.com
# 安装后需要刷新一下环境变量
source ~/.bashrc

```

---

### 第二步：申请 SSL 证书

使用 `nginx` 模式进行申请。这种模式最智能：它会自动扫描你的 Nginx 配置，找到 `server_name` 对应的 `root` 目录，并自动完成验证，**不需要**手动停止 Nginx。

```bash
acme.sh --issue -d blowsysun.top --nginx

```

_注：如果这一步报错，通常是因为 Nginx 配置路径非标准，你可以使用 `--webroot /usr/share/nginx/html` 指定静态目录。_

---

### 第三步：安装并关联 Nginx（关键）

**千万不要**直接在 Nginx 配置里引用 `.acme.sh` 文件夹下的文件。必须使用 `install-cert` 命令将证书复制到你的业务目录，并设置自动重启命令：

```bash
acme.sh --install-cert -d blowsysun.top \
--key-file       /usr/local/etc/blowsysun.top/blowsysun.top.key  \
--fullchain-file /usr/local/etc/blowsysun.top/blowsysun.top_bundle.pem \
--reloadcmd     "systemctl reload nginx"

```

**这一步做了什么？**

1. 将最新的证书和私钥拷贝到你现有的 `/usr/local/etc/...` 路径下。
2. 记住这个路径，以后**每 60 天**证书更新后，它会自动把新证书覆盖过去。
3. 覆盖后自动执行 `systemctl reload nginx`，让新证书立即生效。

---

### 第四步：Nginx 配置微调

现在你可以精简 Nginx 配置了。由于使用了自动管理，你只需要保持原有的路径正确：

```nginx
server {
    listen 443 ssl http2;
    server_name blowsysun.top;

    # 引用刚才 install-cert 指定的路径
    ssl_certificate /usr/local/etc/blowsysun.top/blowsysun.top_bundle.pem;
    ssl_certificate_key /usr/local/etc/blowsysun.top/blowsysun.top.key;

    # 建议开启 TLS 1.3
    ssl_protocols TLSv1.2 TLSv1.3;

    # ... 其他 location 配置保持不变 ...
}

```

---

### 💡 为什么这个方案最适合你？

1. **零风险**：它不改动你的反向代理、WebSocket 转发和 `sub_filter` 逻辑。
2. **完全自动化**：安装时 acme.sh 已自动在你的 `crontab` 里添加了定时任务。你可以通过 `crontab -l` 查看，它每天会检查一次证书状态。
3. **支持 ECC 证书**：如果你想更先进，可以申请 ECC 证书（性能更高、体积更小），只需在命令后加 `--ecc`。

### 🧪 如何验证自动续期是否工作？

你可以强制执行一次续期命令，观察 Nginx 是否成功重启：

```bash
acme.sh --renew -d blowsysun.top --force

```

---

acme.sh --issue -d blowsysun.top -w /usr/share/nginx/html --force

> 可能以上操作会报错；可能原因如下：问题的原因在于你的 `80` 端口配置了 **强制 301 重定向**。

当 `acme.sh` 尝试进行 HTTP 验证时，CA 访问 `http://blowsysun.top/.well-known/...` 会被你的配置强制跳转到 `https`。如果此时你的 `https` 证书已经过期或失效，验证请求就会因为 SSL 握手失败而中断。

### 修改方案：为验证路径添加例外

你需要修改第一个 `server` 块（80 端口），让验证请求不走重定向，而是直接访问本地目录。

#### 1. 修改 Nginx 配置

将你的第一个 `server` 块修改为如下内容：

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name blowsysun.top;

    # 优先处理 acme 验证请求，不进行重定向
    location /.well-known/acme-challenge/ {
        root /usr/share/nginx/html; # 确保这个目录存在且 acme.sh 有权写入
        allow all;
    }

    # 其他所有请求继续执行 301 跳转
    location / {
        return 301 https://$host$request_uri;
    }
}

```

修改完成后，记得测试并重载 Nginx：

```bash
nginx -t
systemctl reload nginx

```

---

### 2. 执行 acme.sh 续期命令

现在配置好了路径，使用 `--webroot` 模式重新申请或续期。注意这里的 `-w` 参数路径必须和上面 Nginx 配置中的 `root` 路径一致：

```bash
acme.sh --issue -d blowsysun.top \
--webroot /usr/share/nginx/html \
--force

```

---

### 3. 配置自动安装（非常重要）

为了让以后续期成功后，新证书能自动替换到 `/usr/local/etc/blowsysun.top/` 并重启 Nginx，请执行以下命令安装证书逻辑：

```bash
acme.sh --install-cert -d blowsysun.top \
--key-file       /usr/local/etc/blowsysun.top/blowsysun.top.key \
--fullchain-file /usr/local/etc/blowsysun.top/blowsysun.top_bundle.pem \
--reloadcmd     "systemctl reload nginx"

```

### 为什么这样做更好？

1. **稳定性**：即使证书完全过期导致网站打不开，80 端口的验证依然可以通过。
2. **自动化**：`--reloadcmd` 保证了你以后再也不用手动去 `cp` 证书或重启 Nginx。
3. **兼容性**：保留了全局 HTTPS 跳转，只对验证路径开了个“小窗”。

**执行完这些后，你可以尝试运行 `acme.sh --renew -d blowsysun.top --force` 看看是否成功**
