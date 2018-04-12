---
layout: category
category: markdown
---

# WebPack为何物

## 什么是Webpack

WebPack可以看做是模块打包机：它做的事情是，分析你的项目结构，找到JavaScript模块以及其它的一些浏览器不能直接运行的拓展语言（Scss，TypeScript等），并将其打包为合适的格式以供浏览器使用。

## 为什要使用WebPack
现今的很多网页其实可以看做是功能丰富的应用，它们拥有着复杂的JavaScript代码和一大堆依赖包。为了简化开发的复杂度，前端社区涌现出了很多好的实践方法

> 模块化，让我们可以把复杂的程序细化为小的文件; <br/>
> 类似于TypeScript这种在JavaScript基础上拓展的开发语言：使我们能够实现目前版本的JavaScript不能直接使用的特性，并且之后还能能装换为JavaScript文件使浏览器可以识别；<br/>
> Scss，less等CSS预处理器…

这些改进确实大大的提高了我们的开发效率，但是利用它们开发的文件往往需要进行额外的处理才能让浏览器识别,而手动处理又是非常反锁的，这就为WebPack类的工具的出现提供了需求。

## WebPack和Grunt以及Gulp相比有什么特性
其实Webpack和另外两个并没有太多的可比性，Gulp/Grunt是一种能够优化前端的开发流程的工具，而WebPack是一种模块化的解决方案，不过Webpack的优点使得Webpack可以替代Gulp/Grunt类的工具。

Grunt和Gulp的工作方式是：在一个配置文件中，指明对某些文件进行类似编译，组合，压缩等任务的具体步骤，这个工具之后可以自动替你完成这些任务。 

<img src="../assets/gulp-flow.png" height="300px" width="600px"/>

Webpack的工作方式是：把你的项目当做一个整体，通过一个给定的主文件（如：index.js），Webpack将从这个文件开始找到你的项目的所有依赖文件，使用loaders处理它们，最后打包为一个浏览器可识别的JavaScript文件。 

<img src="../assets/webpack-flow.png" height="300px" width="600px"/>

# 资源引入规则
http://blog.csdn.net/HeliumLau/article/details/72727176
> 相对路径，比如 ./assets/logo.png会被解析成模块依赖。它们会被一个基于你Webpack输出配置的自动生成URL替代。
> 没有前缀的路径，比如assets/logo.png，同相对路径，转义成./assets/logo.png
> 有~前缀的路径。 ~被认为是一个模块请求，同require('some-module/image.png')。
> 根路径，比如/assets/log.png


