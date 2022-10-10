---
title: 2022-10-10-部署 - jenkinsfile
description: jenkinsfile
categories:
 - jenkinsfile
tags:
 - jenkinsfile
---
**这里对语法进行简单介绍**

**Example**

```javascript
stages
pipeline {
   agent any
   stages {
       stage('Example') {
           steps {
               echo 'Hello World'
           }
       }
   }
}
```

**agent**

在任何可用的agent 上执行Pipeline或stage。例如：agent any

还有其他的agent后面可跟的参数，例如：none，label，node，docker

**none**

当在pipeline块的顶层使用none时，将不会为整个Pipeline运行分配全局agent ，每个stage部分将需要包含其自己的agent部分。

**label**

使用提供的label标签，在Jenkins环境中可用的代理上执行Pipeline或stage。例如：agent { label 'my-defined-label' }

**node**

agent { node { label 'labelName' } }，等同于 agent { label 'labelName' }，但node允许其他选项（如customWorkspace）。

**docker**

定义此参数时，执行Pipeline或stage时会动态供应一个docker节点去接受Docker-based的Pipelines。docker还可以接受一个args，直接传递给docker run调用。例如：agent { docker 'maven:3-alpine' }

**stages**

包含一个或多个stage的序列，Pipeline的大部分工作在此执行。建议stages至少包含至少一个stage指令，用于连接各个交付过程，如构建，测试和部署等。

**steps**

steps包含一个或多个在stage块中执行的step序列。

**总结：**

1、Pipeline最基本的部分是“step”。基本上，step告诉Jenkins 要做什么，并且作为Declarative Pipeline和Scripted Pipeline语法的基本构建块。 

2、Pipeline支持两种语法：Declarative Pipeline（在Pipeline 2.5中引入，结构化方式）和Scripted Pipeline，两者都支持建立连续输送的Pipeline。

3、所有有效的Declarative Pipeline必须包含在一个pipeline块内，例如：

pipeline { /* insert Declarative Pipeline here */ }

4、Declarative Pipeline中的基本语句和表达式遵循与Groovy语法相同的规则 ，但有以下例外：

​    a.Pipeline的顶层必须是块，具体来说是：pipeline { }

​    b.没有分号作为语句分隔符。每个声明必须在自己的一行

​    c.块只能包含Sections, Directives, Steps或赋值语句。



[CICD是什么](https://www.redhat.com/zh/topics/devops/what-is-ci-cd)

## CI 是什么？CI 和 CD 有什么区别？

缩略词 CI / CD 具有几个不同的含义。CI/CD 中的“CI”始终指持续集成，它属于开发人员的自动化流程。成功的 CI 意味着应用代码的新更改会定期构建、测试并合并到共享存储库中。该解决方案可以解决在一次开发中有太多应用分支，从而导致相互冲突的问题。

CI/CD 中的“CD”指的是持续交付和/或持续部署，这些相关概念有时会交叉使用。两者都事关管道后续阶段的自动化，但它们有时也会单独使用，用于说明自动化程度。

持续*交付*通常是指开发人员对应用的更改会自动进行错误测试并上传到存储库（如 [GitHub](https://redhatofficial.github.io/#!/main) 或容器注册表），然后由运维团队将其部署到实时生产环境中。这旨在解决开发和运维团队之间可见性及沟通较差的问题。因此，持续交付的目的就是确保尽可能减少部署新代码时所需的工作量。

持续*部署*（另一种“CD”）指的是自动将开发人员的更改从存储库发布到生产环境，以供客户使用。它主要为了解决因手动流程降低应用交付速度，从而使运维团队超负荷的问题。持续部署以持续交付的优势为根基，实现了管道后续阶段的自动化。

![CI/CD 流程](https://www.redhat.com/cms/managed-files/ci-cd-flow-desktop_edited.png)

CI/CD 既可能仅指持续集成和持续交付构成的关联环节，也可以指持续集成、持续交付和持续部署这三项构成的关联环节。更为复杂的是，有时“持续交付”也包含了持续部署流程。

归根结底，我们没必要纠结于这些语义，您只需记得 CI/CD 其实就是一个流程（通常形象地表述为管道），用于实现应用开发中的高度持续自动化和持续监控。因案例而异，该术语的具体含义取决于 CI/CD 管道的自动化程度。许多企业最开始先添加 CI，然后逐步实现交付和部署的自动化（例如作为[云原生应用](https://www.redhat.com/zh/topics/cloud-native-apps)的一部分）。