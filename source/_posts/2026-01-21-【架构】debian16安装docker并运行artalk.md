---
title: 2026-01-21-【架构】debian16安装docker并运行artalk
categories:
  - 架构
tags:
  - artalk
---

在 Debian 16 (Trixie/Testing) 上安装 Docker 并运行 Artalk（一款自托管的评论系统）是一个非常高效的选择。由于 Debian 16 属于较新的版本，建议使用 Docker 官方的存储库以获取最稳定的版本。

---

## 第一阶段：安装 Docker

### 1. 更新系统并安装依赖

首先确保你的系统软件包是最新的：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install ca-certificates curl gnupg lsb-release -y

```

### 2. 添加 Docker 官方 GPG 密钥

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

```

### 3. 设置存储库

注意：如果 Debian 16 的官方路径尚未完全同步，可以使用 `bookworm` 代替，或者使用变量自动获取：

```bash
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/etc/sources.list.d/docker.list > /dev/null

```

### 4. 安装 Docker 引擎

```bash
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

```

---

## 第二阶段：部署 Artalk

使用 Docker Compose 是管理 Artalk 最简单的方式，它会自动处理程序和数据库（可选）的关系。

### 1. 创建工作目录

```bash
mkdir -p ~/artalk && cd ~/artalk

```

### 2. 编写 `docker-compose.yml`

创建一个配置文件：`nano docker-compose.yml`。

如果你想使用 **SQLite**（轻量，适合个人博客），配置如下：

```yaml
services:
  artalk:
    image: artalk/artalk-go
    container_name: artalk
    restart: always
    ports:
      - "8080:23366"
    volumes:
      - ./data:/data
    environment:
      - AT_DEBUG=false
```

### 3. 启动容器

```bash
sudo docker compose up -d

```

---

## 第三阶段：初始化与访问

### 1. 创建管理员账户

容器启动后，你需要手动创建一个管理员账号：

```bash
sudo docker exec -it artalk artalk admin

```

按照提示输入**用户名**、**邮箱**和**密码**。

### 2. 访问后台

在浏览器访问：`http://你的服务器IP:8080`。

---

## 第四阶段：常见问题排查

- **端口冲突**：如果 8080 被占用，在 `docker-compose.yml` 的 `ports` 部分修改左侧数字，例如 `"9000:8080"`。
- **权限问题**：如果数据无法写入，执行 `sudo chown -R 1000:1000 ./data`。

## 无法访问问题

- 1. caddy 配置修改，添加反向代理

```
xxx.top {
    root * /workspace/www/study-web-tool

    # 1. 强制补全斜杠，防止匹配失效
    redir /artalk /artalk/

    # 2. 使用 handle_path 剥离前缀
    # 外部访问 /artalk/admin -> 转发给后端变成 /admin
    handle_path /artalk/* {
        reverse_proxy localhost:8080 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    file_server
}
```

- 2. 添加 `environment - AT_BASE_PATH=/artalk` 配置

```yaml
services:
  artalk:
    image: artalk/artalk-go
    container_name: artalk
    restart: always
    ports:
      - "8080:23366"
    volumes:
      - ./data:/data
    environment:
      - AT_DEBUG=false
      - AT_BASE_PATH=/artalk
```

- 重启 caddy `sudo systemctl reload caddy`
- 重启 docker，stop`docker stop artalk`,启动`docker compose up -d`

## 第五阶段：artalk 添加应用

- 添加应用+url `https://xxx.top/artalk/sidebar/#/sites`

## 参考文献

- https://artalk.js.org/zh/guide/frontend/config.html
