# nginx
## 打镜像
```
docker build -t zyx-nginx . -f ./devops/dockerfile.nginx
```
## 运行镜像
``` js
docker run --name zyx-nginx-ct -d -p 8088:80 zyx-nginx
```

# openresty
## 打镜像
```
docker build -t zyx-openresty . -f ./devops/dockerfile.openresty
```
## 运行镜像
``` js
docker run --name zyx-openresty-ct -d -p 8089:80 zyx-openresty
```