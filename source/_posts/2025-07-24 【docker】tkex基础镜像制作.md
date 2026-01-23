---
title: 2025-07-24 【docker】tkex基础镜像制作
description:
categories:
  - 工程化
tags:
  - nginx
  - docker
  - tlinux
---

# 一、背景

由于原有前端 web 基础镜像由外部 cenos+openresty 制作而来，不符合 tkex 业务上云标准规范，现需使用基于腾讯云内部系统 tlinux 系统重新制作 web 基础镜像。

# 二、web 基础镜像制作

[项目地址 nginx_fed](https://git.xxx/nginx_fed)

## 2.1 dockerfile 方式创建

> dockerfile 说明：
> 基于 tlinux2.2-bridge-tcloud-underlay-mini 系统镜像
> 安装 nginx-1.20.1-10.el7
> 安装 logrotate-3.8.6-14.tl2 用于 nginx 日志分割

```
FROM csighub.tencentyun.com/tkex/tlinux2.2-bridge-tcloud-underlay-mini:latest

LABEL maintainer="yxuanzhang@tencent.com"

# 注意使用&来减少镜像的层级
RUN mkdir -p /data/conf && \
    mkdir -p /data/logs && \
    echo "set encoding=utf-8" >> ~/.vimrc && \
    echo "set fileencodings=utf-8,gb2312,gbk,gb18030" >> ~/.vimrc && \
    echo "set termencoding=utf-8" >> ~/.vimrc

ADD ./tkex_start.sh /etc/kickStart.d/
ADD ./conf/nginx/nginx.conf /data/conf/
ADD ./conf/logrotate/nginx.logrotate /data/conf/

RUN chmod u+x /etc/kickStart.d/tkex_start.sh && \
    yum install -y nginx-1.20.1-10.el7 && \
    yum install -y logrotate-3.8.6-14.tl2

# http
EXPOSE 80
EXPOSE 8080

# https
EXPOSE 443

# 注意 不要使用 CMD/ENTRYPOINT 命令设置自己的 Docker 启动命令，因为tlinux基础镜像启动需要CMD ["/usr/sbin/initStart"]，即systemd作为1号守护进程。
# 用户再写 CMD/ENTRYPOINT 会导致原CMD命令覆盖，导致 systemd 无法启动。导致相关依赖 agent 无法启动。
# 另外，由于织云安装脚本默认有来源IP限制，因此需要在 IDC 环境构建镜像。建议通过Coding、蓝盾、OCI 等平台构建
```

> tLinux 织云包 mini 镜像组成说明（非必读）
> tlinux Base 镜像来源于 tLinux 提供的 mini 镜像，由 TKEx-CSIG 和 腾讯会议团队共同维护，大小仅为 259.0 MB，基础环境安装包含：
>
> - 网管 agent 、洋葱 onion、 sng 初始化(参考 iaas)、铁将军安装、织云包安装；
> - 常见系统软件包：wget、gcc、gcc-c++、make、strace、iputils、initscripts 等
> - 修改 systemd init 执行方式，目的是为保存 1 号进程环境变量含用户自定义环境变量;
> - 设定开机启动脚本/etc/rc.d/rc.config:

    - 导入 1 号进程环境变量
    - iptables 初始化
    - 启动网管 agent
    - 统一扫描拉起织云包服务
    - 修改tsc配置为当前机器 ip /usr/local/TsysAgent/etc/proxy_ctrl.conf
    - 为用户设定自定义启动脚本的目录 /etc/kickStart.d，该目录下的所有 .sh 脚本都会执行，启动日志输出到 /etc/kickStart.d/startApp.log

##### 注：tLinux 织云包 mini 镜像包含以下运维工具

- netstat
- vmstat
- telnet
- top
- iostat

## 2.2 nginx 配置（nginx.conf）

```
user nginx;
worker_processes auto;
worker_rlimit_nofile 65535;
error_log /data/logs/error.log;
pid /run/nginx.pid;
daemon off;

events {
    worker_connections 2048;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for" "$http_referer"';

    access_log  /data/logs/access.log  main;
    client_max_body_size    100m;
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss application/javascript text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon;

    proxy_connect_timeout 300s;
    proxy_send_timeout 300s;
    proxy_read_timeout 300s;
    send_timeout 300s;
    fastcgi_connect_timeout 300;
    fastcgi_send_timeout 300;
    fastcgi_read_timeout 300;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    # include servers/*.conf;
    # include /etc/nginx/conf.d/*.conf;
    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;
    }
    # 自定义脚本可通过 /data/conf 目录挂载到容器中
}
```

> 注：该配置仅包含 nginx 基础配置，其他 server 配置请前往七彩石配置，并挂载至/data/conf 路径中。

## 2.3 logrotate 配置

```
/data/logs/*log {
    su root root
    create 0777 root root
    daily
    rotate 10
    missingok
    notifempty
    compress
    sharedscripts
    postrotate
        /usr/sbin/nginx -s reload -c /data/conf/nginx.conf
    endscript
}
```

## 2.4 镜像制作&上传

> 建议在 devCloud 中制作镜像

1. build
   `docker build -t nginx_fed:v1.0.0 --network=host  -f ./Dockerfile .`

2. tag
   `docker tag nginx_fed:v1.0.0 csighub.tencentyun.com/wpe/nginx_fed:latest`

3. login
   `docker login csighub.tencentyun.com`

4. push
   `docker push csighub.tencentyun.com/wpe/nginx_fed:latest`
