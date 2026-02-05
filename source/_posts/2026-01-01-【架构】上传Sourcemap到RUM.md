---
title: 2026-01-01-【架构】上传Sourcemap到RUM
categories:
  - 架构
tags:
  - RUM
  - sourcemap
---

### 准备工作

- 配置准备：RUM 应用 ID、腾讯云子账号（密钥 id、密钥 key）

### nodejs 上传脚本

- 1. 依赖安装
     `pnpm install tencentcloud-sdk-nodejs cos-nodejs-sdk-v5 glob`
  ```package.json
    "tencentcloud-sdk-nodejs": "^4.0.3",
    "cos-nodejs-sdk-v5": "^2.12.6",
    "glob": "^10.3.10"
  ```
- 2. 脚本编写
     > scripts/upload-sourcemap-to-rum.js

- cjs 版本

```cjs
// RUM SourceMap上传脚本
// 参考：https://cloud.tencent.com/document/product/1464/107491

// 使用说明：
// 1. 默认在上传成功后删除本地sourcemap文件
// 2. 如需保留本地文件，请设置环境变量 RUM_DELETE_AFTER_UPLOAD=false
// 3. 删除的文件无法恢复，请确保已经成功上传

// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
// 需要引入相关 npm 包
const tencentcloud = require("tencentcloud-sdk-nodejs");
const COS = require("cos-nodejs-sdk-v5");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const globPkg = require("glob");
const { glob } = globPkg;

// 读取package.json文件
function readPackageJson() {
  try {
    const packageJsonPath = path.resolve(__dirname, "../package.json");
    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    return JSON.parse(packageJsonContent);
  } catch (error) {
    console.error("读取package.json失败:", error);
    return { version: "1.0.0" };
  }
}

// 配置信息 - 请根据实际情况修改
const config = {
  // RUM项目ID（数字ID，不是上报key）
  projectID: 147543,

  // 版本号，通常使用package.json中的版本号
  version: readPackageJson().version,

  // 腾讯云子账号密钥
  secretId: "子账号密钥id",
  secretKey: "子账号密钥key",

  // 构建输出目录
  distDir: path.resolve(__dirname, "../dist"),

  // 要上传的sourcemap文件模式
  sourcemapPattern: "**/*.js.map",

  // 是否在上传成功后删除本地sourcemap文件（默认为true）
  deleteAfterUpload: true,
};

// 校验配置
function validateConfig() {
  if (config.projectID === 0) {
    console.error("错误: 请设置RUM项目ID (projectID)");
    console.error("可以通过环境变量 RUM_PROJECT_ID 设置");
    process.exit(1);
  }

  if (
    config.secretId === "子账号密钥id" ||
    config.secretKey === "子账号密钥key"
  ) {
    console.error("错误: 请设置腾讯云子账号密钥");
    console.error("可以通过环境变量 RUM_SECRET_ID 和 RUM_SECRET_KEY 设置");
    process.exit(1);
  }
}

// 初始化RUM客户端
const RumClient = tencentcloud.rum.v20210622.Client;
const clientConfig = {
  credential: {
    secretId: config.secretId,
    secretKey: config.secretKey,
  },
  region: "",
  profile: {
    httpProfile: {
      endpoint: "rum.tencentcloudapi.com",
    },
  },
};
const client = new RumClient(clientConfig);
const params = {};

// 初始化COS客户端
const cos = new COS({
  getAuthorization: (options, callback) => {
    client
      .DescribeReleaseFileSign(params)
      .then(
        (data) => {
          callback({
            TmpSecretId: data.SecretID,
            TmpSecretKey: data.SecretKey,
            SecurityToken: data.SessionToken,
            ExpiredTime: data.ExpiredTime,
          });
        },
        (err) => {
          console.error("获取COS签名错误:", err);
          process.exit(1);
        }
      )
      .catch((err) => {
        console.error("获取COS签名异常:", err);
        process.exit(1);
      });
  },
});

// 计算文件MD5
function calculateFileHash(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return crypto.createHash("md5").update(content).digest("hex");
}

// 上传单个sourcemap文件到RUM
async function uploadSourceMapFile(filePath) {
  const fileName = path.basename(filePath);
  const timestamp = +new Date();
  const fileKey = `${config.projectID}-${config.version}-${timestamp}-${fileName}`;

  try {
    // 1. 读取文件内容
    const fileContent = fs.readFileSync(filePath, "utf8");

    // 2. 计算文件hash
    const fileHash = calculateFileHash(filePath);

    console.log(`开始上传: ${fileName} (${filePath})`);

    // 3. 上传到COS
    const cosResult = await cos.putObject({
      Bucket: "rumprod-1258344699", // 固定值
      Region: "ap-guangzhou", // 固定值
      Key: fileKey,
      Body: fileContent,
    });

    console.log(`COS上传成功: ${fileName}`);

    // 4. 创建RUM文件记录
    const rumResult = await client.CreateReleaseFile({
      ProjectID: config.projectID,
      Files: [
        {
          Version: config.version,
          FileKey: fileKey,
          FileName: fileName,
          FileHash: fileHash,
        },
      ],
    });

    console.log(`RUM文件记录创建成功: ${fileName}`);

    // 5. 上传成功后删除本地文件（根据配置）
    if (config.deleteAfterUpload) {
      try {
        fs.unlinkSync(filePath);
        console.log(`已删除本地文件: ${filePath}`);
      } catch (deleteError) {
        // 文件删除失败只记录警告，不影响整体上传结果
        console.warn(
          `警告：删除本地文件失败，但上传已成功: ${filePath}`,
          deleteError.message
        );
      }
    } else {
      console.log(
        `保留本地文件: ${filePath} (RUM_DELETE_AFTER_UPLOAD设置为false)`
      );
    }

    return {
      fileName,
      fileKey,
      fileHash,
      cosResult,
      rumResult,
    };
  } catch (error) {
    console.error(`上传失败: ${fileName}`, error);
    throw error;
  }
}

// 查找所有的sourcemap文件
function findSourceMapFiles() {
  const pattern = path.join(config.distDir, config.sourcemapPattern);
  return glob.sync(pattern, { nodir: true });
}

// 查询已上传的sourcemap文件列表
async function listUploadedFiles() {
  try {
    const result = await client.DescribeReleaseFiles({
      ProjectID: config.projectID,
    });

    console.log("已上传的sourcemap文件列表:");
    if (result.Response && result.Response.Files) {
      result.Response.Files.forEach((file) => {
        console.log(
          `  - ${file.FileName} (版本: ${file.Version}, 上传时间: ${file.CreateTime})`
        );
      });
    } else {
      console.log("  暂无文件");
    }

    return result;
  } catch (error) {
    console.error("查询已上传文件列表失败:", error);
    throw error;
  }
}

// 主函数
async function main() {
  console.log("=== RUM SourceMap上传脚本 ===");
  console.log(`项目ID: ${config.projectID}`);
  console.log(`版本号: ${config.version}`);
  console.log(`构建目录: ${config.distDir}`);
  console.log(
    `删除策略: ${
      config.deleteAfterUpload
        ? "上传成功后删除本地文件"
        : "保留本地文件 (可通过设置环境变量RUM_DELETE_AFTER_UPLOAD=false禁用删除)"
    }`
  );

  // 校验配置
  validateConfig();

  // 查找sourcemap文件
  const sourceMapFiles = findSourceMapFiles();

  if (sourceMapFiles.length === 0) {
    console.log("未找到sourcemap文件，请确认:");
    console.log("  1. 是否已运行构建命令（如：npm run build:release）");
    console.log("  2. Vite配置中sourcemap是否已启用");
    console.log(`  3. 文件是否存在于: ${config.distDir}`);
    process.exit(1);
  }

  console.log(`找到 ${sourceMapFiles.length} 个sourcemap文件:`);
  sourceMapFiles.forEach((file) => {
    console.log(`  - ${path.relative(config.distDir, file)}`);
  });

  // 上传所有文件
  const results = [];
  for (const file of sourceMapFiles) {
    try {
      const result = await uploadSourceMapFile(file);
      results.push(result);
    } catch (error) {
      console.error(`文件上传失败，跳过: ${file}`);
    }
  }

  console.log(
    `\n上传完成: ${results.length}/${sourceMapFiles.length} 个文件上传成功`
  );

  // 查询已上传文件列表
  if (results.length > 0) {
    console.log("\n查询已上传文件列表...");
    await listUploadedFiles();
  }

  console.log("\n=== 上传完成 ===");
}

// 执行主函数
main().catch((error) => {
  console.error("脚本执行失败:", error);
  process.exit(1);
});
```

- 3. 添加脚本

```json
"scripts": {
  "rum:upload-sourcemap": "node scripts/upload-sourcemap-to-rum.js"
}
```

### RUM 上报代码参考

- 待优化，尽量上传包含堆栈信息

```ts
import Aegis from 'aegis-web-sdk';
import packageJson from '../../package.json';

if (window.STATIC_ENV_CONFIG.hasOwnProperty('VUE_APP_RUM_ID') && window.STATIC_ENV_CONFIG.VUE_APP_ENV !== 'dev') {
  const aegis = new Aegis({
    id: window.STATIC_ENV_CONFIG.VUE_APP_RUM_ID, // 上报id
    uin: window.STATIC_ENV_CONFIG.VUE_APP_USER_ID || '', // 用户标识
    version: packageJson.version, // 应用版本号

    // 基础监控配置
    spa: true, // SPA应用开启页面跳转PV计算
    speedSample: false, // 测速不抽样，api监控数据来源

    // 接口监控
    reportApiSpeed: true, // 接口测速
    api: {
      apiDetail: true, // 接口详情
    },

    // 资源监控
    reportAssetSpeed: true, // 静态资源测速
    staticResource: true, // 静态资源错误监控

    // 页面性能监控
    pagePerformance: true, // 页面性能监控

    // 错误监控（捕获所有类型错误）
    onError: true, // JS执行错误监控
    aid: false, // 关闭aid避免冲突

    // 白屏检测
    whiteScreen: true, // 开启白屏检测
    whiteBoxElements: ['html', 'body', '#app'], // 白屏检测元素

    // 离线日志
    offlineLog: true, // 开启离线日志
    offlineLogExp: 7, // 离线日志过期时间7天

    // 设备信息
    device: true, // 开启设备信息采集

    // 页面事件
    pageEvent: true, // 开启页面事件监控

    // Promise错误捕获（通过全局错误处理器）
    // 资源加载错误（通过staticResource配置）
    // Vue错误（通过下面的Vue.config.errorHandler）
  });
  // vue错误上报
  Vue.config.errorHandler = (err, vm, info) => {
    console.log(`Error: ${err.toString()}\nInfo: ${info}`);
    aegis.error(`Error: ${err.toString()}\nInfo: ${info}`);
  };

  // 全局错误处理器：捕获Promise未捕获的rejection和其他未处理错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise rejection:', event.reason);
    aegis.error(`Unhandled Promise rejection: ${event.reason}`);
  });

  window.addEventListener('error', (event) => {
    // 过滤掉资源加载错误（已经由staticResource配置处理）
    if (event.target && (event.target.src || event.target.href)) {
      return;
    }
    console.error('Global error:', event.error);
    aegis.error(`Global error: ${event.error}`);
  });
```

### vite/webpack 插件 rum-sourcemap-plugin

- 已整理为插件
  > [rum-sourcemap-plugin 插件](https://www.npmjs.com/package/rum-sourcemap-plugin)

### 问题

1. npm 包版本兼容问题可添加忽略配置跳过

- .npmrc 添加 nodejs 版本兼容配置

```
# 配置pnpm/npm忽略引擎版本检查
# 解决@achrinza/node-ipc与Node.js 20.x的兼容性问题
engine-strict=false
```

- yarnrc 添加 nodejs 版本兼容配置

```
ignore-engines true
```

### 参考文献

- [RUM 自动上传 sourcemap 文件](https://cloud.tencent.com/document/product/248/97909)
