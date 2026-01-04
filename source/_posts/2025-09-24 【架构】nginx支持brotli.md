---
title: 2025-09-24 【架构】nginx支持brotli
description:
categories:
  - 架构设计
tags:
  - vite
  - RUM
---

针对 **Nginx/1.18.0**（这是 Ubuntu 20.04 等系统的默认版本），由于官方二进制包不含 Brotli，最简单的办法是**通过动态模块注入**。

以下是针对主流 Linux 系统（Ubuntu/Debian）最稳妥的两种实现方案：

---

### 方案一：通过 PPA 安装（最推荐，简单快速）

如果你不想手动编译，可以使用社区维护好的动态模块包。

1. **添加仓库并安装 Brotli 模块**：

```bash
sudo add-apt-repository ppa:ondrej/nginx
sudo apt update
sudo apt install libnginx-mod-http-brotli

```

2. **验证模块是否加载**：
   查看 `/etc/nginx/modules-enabled/` 目录下是否有 `50-mod-http-brotli.conf`。如果有，Nginx 会自动加载。
3. **测试配置并重启**：

```bash
sudo nginx -t
sudo systemctl restart nginx

```

---

### 方案二：手动编译动态模块（不改变现有 Nginx 版本）

如果你不能更换软件源，可以只编译 `.so` 模块文件。

#### 1. 准备环境

查看当前 Nginx 编译参数（非常重要，版本和参数必须一致）：

```bash
nginx -V

```

记录下输出的 `--configure-args=...` 后面的内容。

#### 2. 下载源码

```bash
# 下载同版本 Nginx 源码
wget http://nginx.org/download/nginx-1.18.0.tar.gz
tar -xzvf nginx-1.18.0.tar.gz

# 下载 Brotli 模块源码
git clone https://github.com/google/ngx_brotli.git
cd ngx_brotli && git submodule update --init && cd ..

```

#### 3. 编译模块

```bash
cd nginx-1.18.0
# 使用 nginx -V 得到的参数，并在最后加上 --add-dynamic-module=../ngx_brotli
./configure [这里粘贴你记录的参数] --add-dynamic-module=../ngx_brotli

# 仅编译模块，不安装
make modules

```

> 编译可能报错，请先安装编译所需依赖后重新；`sudo make modules`；具体报错可能如下：

```
/usr/bin/ld: cannot find -lbrotlienc
/usr/bin/ld: cannot find -lbrotlicommon
collect2: error: ld returned 1 exit status
make[1]: *** [objs/Makefile:1506: objs/ngx_http_brotli_filter_module.so] Error 1
make[1]: Leaving directory '/workspace/git/nginx-1.18.0'
make: *** [Makefile:14: modules] Error 2
```

这个错误非常明确：链接器（`ld`）在指定的路径中找不到 Brotli 的库文件（`-lbrotlienc` 和 `-lbrotlicommon`）。

这是因为 `ngx_brotli` 模块依赖的 Google Brotli 核心库**没有被编译成静态库/动态库**，或者**存放的位置与 Nginx 期望的不符**。

---

##### 🛠️ 解决方案：手动编译并安置 Brotli 依赖库

我们需要手动进入子模块目录，把那些缺失的 `.a` (静态库) 或 `.so` (动态库) 编译出来。

###### 1. 安装编译工具

确保你的系统有 `cmake`：

```bash
sudo apt update && sudo apt install -y cmake

```

###### 2. 编译 Brotli 核心库

```bash
# 进入 brotli 源码目录
cd /workspace/git/ngx_brotli/deps/brotli

# 创建编译目录
mkdir -p out && cd out

# 执行 cmake (关键：强制开启 fPIC，否则 Nginx 加载时会报错)
cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF -DCMAKE_C_FLAGS="-fPIC" ..

# 编译生成库文件
make -j$(nproc)

```

编译完成后，在该 `out` 目录下，你应该能看到 `libbrotlienc.a`、`libbrotlicommon.a` 和 `libbrotlidec.a`。

---

###### 3. 再次回到 Nginx 目录编译模块

现在库文件已经存在于 `/workspace/git/ngx_brotli/deps/brotli/out` 了，Nginx 的 `configure` 脚本应该能找到它们。

```bash
cd /workspace/git/nginx-1.18.0

# 建议先执行一次清理，确保链接路径更新
sudo make clean

# 重新执行你之前的 configure 命令
# 确保包含 --add-dynamic-module=../ngx_brotli
sudo ./configure [粘贴你的参数] --add-dynamic-module=../ngx_brotli

# 开始编译模块
sudo make modules

```

---

然后再去执行 `sudo make modules`。

---

###### 4. 拷贝并加载模块

编译完成后，模块文件在 `objs` 目录下。

```bash
# 创建模块存放目录（如果没有）
sudo mkdir -p /etc/nginx/modules
# 拷贝 .so 文件
sudo cp objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/
sudo cp objs/ngx_http_brotli_static_module.so /etc/nginx/modules/

```

###### 5. 修改 Nginx 配置

在 `/etc/nginx/nginx.conf` 的**最顶部**添加：

```nginx
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;

http {
    # 这里的 brotli 配置才会生效
    brotli on;
    brotli_static on;
    # ... 其他配置
}

```

---

### 方案三：如果你使用的是 Docker

如果是 Docker 环境，建议直接更换镜像标签：
使用 `fholzer/nginx-brotli` 或自定义构建镜像，因为在容器内编译模块非常麻烦。

---

### 验证是否成功

配置完成后，使用以下命令测试你的网站：

```bash
curl -I -H "Accept-Encoding: br" https://你的域名

```

**看响应头：**

- 如果看到 `Content-Encoding: br`，恭喜你，成功了！
- 如果看到 `Content-Encoding: gzip`，说明浏览器支持 br 但 Nginx 没配置对或没找到 `.br` 文件。

### ⚠️ 注意事项

- **HTTPS 必须开启**：绝大多数浏览器只在 HTTPS 连接下才支持 Brotli。
- **优先级**：Nginx 开启 `brotli_static on;` 后，会优先寻找 `.br` 文件，找不到才会寻找 `.gz`。
