---
title: 2023-11-13-【架构】Ubuntu 下 Nginx 迁移至 Caddy实践
date: 2023-11-13 23:11:39
description:
categories:
  - 架构
tags:
  - Caddy
---

# Ubuntu 环境下 Nginx 迁移 Caddy

Ubuntu 的包管理系统对 Caddy 支持良好，且其 `systemd` 集成非常完善。

以下是针对 Ubuntu 系统的完整迁移实践方案：

---

## 1. 彻底清理与环境准备

在安装 Caddy 之前，必须确保 Nginx 释放 80 和 443 端口。

```bash
# 停止 Nginx 服务
sudo systemctl stop nginx

# (可选) 禁用 Nginx 自启动，防止重启后冲突
sudo systemctl disable nginx

# 检查端口占用情况，确保没有其他程序占用 80/443
sudo lsof -i :80
sudo lsof -i :443

```

---

## 2. 在 Ubuntu 上安装 Caddy

官方建议通过专用存储库安装，以确保获得最新的稳定版（v2.x）。

```bash
# 安装必要的辅助包
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl

# 添加 Caddy 官方 GPG 密钥
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg

# 添加 Caddy 官方存储库
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list

# 更新源并安装
sudo apt update
sudo apt install caddy

```

---

## 3. 编写 Caddyfile 核心实践

Ubuntu 下 Caddy 的配置文件默认位于 `/etc/caddy/Caddyfile`。

### 常用配置迁移模板

```caddy
{
    # 全局设置：建议填写邮箱，证书快过期或申请失败会收到警告
    email your-email@example.com
}

# 场景 1：反向代理（如代理一个 Node.js 或 Python 应用）
app.yourdomain.com {
    reverse_proxy localhost:3000

    # 开启 Gzip 和 Zstd 压缩
    encode zstd gzip
}

# 场景 2：静态前端项目（Vue/React/Next.js 导出）
www.yourdomain.com {
    # 静态文件根目录
    root * /var/www/my-vue-app/dist

    # 启用文件服务器
    file_server

    # 模拟 Nginx 的 try_files，支持 SPA 路由
    try_files {path} /index.html
}

# 场景 3：重定向（从 HTTP 强跳或域名跳转）
old-domain.com {
    redir https://new-domain.com{uri}
}

```

---

## 4. 权限与路径安全

Caddy 在 Ubuntu 上以 `caddy` 用户运行，因此它必须有权访问你的网页目录。

```bash
# 确保 /var/www 目录的所有权（如果使用静态文件服务）
sudo chown -R caddy:caddy /var/www/my-vue-app

# 检查 Caddy 的配置目录权限（确保证书持久化存储）
# 默认路径：/var/lib/caddy 和 /etc/caddy

```

---

## 5. 启动与验证

```bash
# 验证 Caddyfile 语法是否正确
caddy validate --config /etc/caddy/Caddyfile

# 重启 Caddy 以应用新配置
sudo systemctl restart caddy

# 检查运行状态
sudo systemctl status caddy

```

### 关键：观察日志确认证书申请情况

Caddy 的核心价值在于自动申请 SSL。在刚启动时，通过以下命令确认申请流程：

```bash
# 实时滚动查看日志
sudo journalctl -u caddy -f

```

**如果看到 `certificate obtained successfully`，说明你的域名已经成功开启了 HTTPS。**

---

## 6. 进阶：如何处理 PHP (替代 Nginx + PHP-FPM)

如果你的 Ubuntu 上运行着 WordPress 或 PHP 应用，Caddy 的写法比 Nginx 简单得多：

```caddy
example.com {
    root * /var/www/wordpress
    php_fastcgi unix//run/php/php8.1-fpm.sock
    file_server
}

```

---

## 💡 方案总结

| 步骤           | 操作要点                                                                     |
| -------------- | ---------------------------------------------------------------------------- |
| **端口释放**   | 必须 `systemctl stop nginx`。                                                |
| **证书持久化** | 默认在 `/var/lib/caddy`，**不要手动删除**此目录。                            |
| **防火墙**     | 确保 `ufw allow 80/tcp` 和 `ufw allow 443/tcp`（及 443/udp 以支持 HTTP/3）。 |
| **日志**       | 遇到报错第一时间看 `journalctl -u caddy`。                                   |

===========

这份针对 Ubuntu 系统的快速实践方案，旨在通过最简步骤完成从 Nginx 到 Caddy 的无缝切换。

---

## 1. 停机准备：释放端口

在安装 Caddy 前，必须确保 Nginx 不再占用 80 和 443 端口。

```bash
# 停止 Nginx
sudo systemctl stop nginx

# 禁用自启动（防止重启冲突）
sudo systemctl disable nginx

# 确认端口已释放（应无输出）
sudo lsof -i :80,443

```

---

## 2. 快速安装 Caddy

使用官方维护的 Ubuntu 存储库，确保获得 v2 稳定版及其 `systemd` 配置。

```bash
# 安装基础组件
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl

# 添加密钥与源
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list

# 安装 Caddy
sudo apt update
sudo apt install caddy

```

---

## 3. 核心配置：从 Nginx 转换到 Caddyfile

编辑配置文件：`sudo nano /etc/caddy/Caddyfile`

### 常见转换模板对比

- **场景 A：反向代理（最常用）**

```caddy
# Caddy 会自动处理域名 HTTPS
app.example.com {
    reverse_proxy localhost:8080
    encode zstd gzip  # 开启压缩
}

```

- **场景 B：静态项目（Vue/React）**

```caddy
static.example.com {
    root * /var/www/my-project/dist
    file_server
    try_files {path} /index.html  # 解决前端路由 404
}

```

---

## 4. 权限与防火墙（关键）

Caddy 默认以 `caddy` 用户运行，必须确保它有权访问相关目录，且防火墙放行 UDP 流量以支持 HTTP/3。

```bash
# 修改文件所有权
sudo chown -R caddy:caddy /var/www/my-project

# 放行防火墙 (80, 443/tcp, 443/udp)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp

```

---

## 5. 启动与验证

```bash
# 验证配置文件语法
caddy validate --config /etc/caddy/Caddyfile

# 重启并查看状态
sudo systemctl restart caddy
sudo systemctl status caddy

# 实时观察证书申请日志
sudo journalctl -u caddy -f

```

---

## 6. 迁移风险避坑指南

| 风险点           | 表现              | 解决方法                                                            |
| ---------------- | ----------------- | ------------------------------------------------------------------- |
| **证书频率限制** | `Rate Limit` 错误 | 确保 DNS 已生效再启动 Caddy；持久化存储 `/var/lib/caddy` 目录。     |
| **HTTP/3 降级**  | 加载慢或连接重置  | 确保云服务商安全组已放行 **443/UDP**。                              |
| **路径匹配**     | 404 错误          | Nginx 默认是前缀匹配，Caddy 建议在匹配路径后加 `*`（如 `/api/*`）。 |

---

### 💡 总结建议

由于你是在**新加坡/香港服务器**上操作，海外网络环境对 Caddy 默认开启的 **HTTP/3 (QUIC)** 支持极佳，这将显著降低你跨境访问时的握手延迟（从 3-RTT 降至 0-1 RTT）。
