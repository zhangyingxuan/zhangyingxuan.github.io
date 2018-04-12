---
layout: category
category: weixin
---

# 微信账号绑定

## 实现思路
1、开通网页授权

2、项目中获取用户信息并存入项目数据库中

## 实现步骤

> 1、微信公众平台网页授权设置
>> a、 进入微信公众平台，选择左侧菜单 开发->接口设置， 找到右侧表格中找到网页授权项，点击“设置”

<!-- ![](../assets/openpermission1.png  '权限设置位置') -->

 <img src="../assets/openpermission1.png" width = "1000" height = "260" alt="图片名称" align=center />

> 2、分别设置业务域名、JS接口安全域名、网页授权域名

 <img src="../assets/openpermission2.png" width = "1000" height = "260" alt="图片名称" align=center />

> 3、填写网页授权域名

 <img src="../assets/openpermission3.png" width = "500" height = "600" alt="图片名称" align=center />

>> a, 按提示，将文件下载，并将文件拷贝至应用发布路径下，可访问的位置

>> b，通过 域名+MP_verify_ZXgAAByleUsXc6c3.txt 的方式访问结果如下

```
ZXgAAByleUsXc6c3
```