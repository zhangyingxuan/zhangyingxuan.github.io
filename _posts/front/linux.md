---
layout: category
category: linux
---

# 域名解析

# 防火墙关闭
https://jingyan.baidu.com/article/4d58d54137d2a19dd5e9c050.html

# linux无法访问外网，连接超时
原因：
上行网络策略未开通。无法访问外网服务。

# 下行网络访问不同问题
```
# 关闭防火墙
/etc/init.d/iptables stop
# 或者
service iptables stop
# 重启
/etc/init.d/iptables restart

# 关闭自动启动的iptables
chkconfig
chkconfig iptables off
```