---
layout: post
title:  "Welcome to Jekyll!"
date:   2014-11-17 13:31:01 +0800
categories: jekyll
tag: jekyll
---

* content
{:toc}

# vue开发环境安装

> 开发工具
> 
> 1、编辑器： [webstorm](http://www.jetbrains.com/webstorm/) 
>
> 2、版本管理：git
>
> 3、运行环境：node.js
>
> 4、构建环境：webpack
>
> 5、 vue-cli安装
>
> 6、项目编译与运行

## 一、编辑器安装

* 进入[webstorm](http://www.jetbrains.com/webstorm/) 官网，下载最新版本并安装。
* 破解方法请百度搜索

## 二、git安装

* 1、下载最新版本[git客户端](https://git-scm.com/downloads)
* 2、设置git配置
```
$ git config user.email "yyy@xxx.com"
$ git config user.name yyy
$ git config --global credential.helper store
$ git config --global core.autocrlf false
```

* 若报错`SSL certificate problem: unable to get local issuer certificate` 则执行
```
git config --global http.sslVerify false
```
* PS: 若需要代理设置
```$xslt
git config --global https.proxy http://127.0.0.1:1080
git config --global https.proxy https://127.0.0.1:1080
// 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

# 三、node.js安装
* 下载最新 node.js [官网地址](https://nodejs.org/zh-cn/download/) 并安装
* 代理设置
```
npm config set proxy=http://172.17.18.80:8080
cnpm config set proxy=http://172.17.18.80:8080
npm config set http-proxy=http://127.0.0.1:8087
npm config set https-proxy=http://127.0.0.1:8087
// 取消代理
npm config delete proxy
cnpm config delete proxy
```
* 按照 [cnpm设置教程](http://npm.taobao.org/) 设置淘宝镜像
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

# 四、webpack安装
```
npm install -g webpack
```

# 五、vue-cli安装
* 执行`npm install vue-cli -g `全局安装

# 六、项目编译与运行
1、项目启动步骤
 将分支clone下来过后，进入1ETripWebApp4Vue 这一层目录
前言：公司网络下请添加代理设置
npm config set proxy=http://172.17.18.80:8080

第一步、先执行
npm install
可能存在的报错：
> 错误 1、
>> 解决办法
>> 执行
 npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver 
>
> 错误 2、
>> 原因看node-gyp的安装需求，https://github.com/nodejs/node-gyp， 部分剪切如下，可以请求的看到需要安装python2.7（其实2.6也行）python3不行
>>  
>> `npm rebuild node-sass --force`
>
> 错误 3、 重新编译过程中可能存在报错，如下： 
>> ```
>> gyp verb check python checking for Python executable "python2" in the PATH
>> gyp verb `which` failed Error: not found: python2
>> ```
>
> 原因在于为安装 python，且必须未python2版本，所以需要官网下载[Python 2.7版本](https://www.python.org/downloads/windows/)
> error MSB3411: 未能加载 Visual C++ 组件“VCBuild.exe”。如果
未安装该组件，请执行下列操作之一: 1) 安装 Microsoft Windows SDK for W
indows Server 2008 和 .NET Framework 3.5；或 2) 安装 Microsoft Visual Studio 2008。
>> 下载并安装 [Micros oft Windows SDK for Windows Server 2008](https://www.microsoft.com/en-us/download/confirmation.aspx?id=11310) 解决该问题
>
> 错误 4、依然存在错误 3
>> npm install error： MSBUILD : error MSB3428: 未能加载 Visual C++ 组件“VCBuild.exe”
>> 
>> 执行以下代码
>> ```
>> npm install --global --production windows-build-tools
>> ```
>> 最终问题解决，`npm install -g node-gyp`


第二步
* 启动项目
```
npm run dev 
```
应该就可以启起来了