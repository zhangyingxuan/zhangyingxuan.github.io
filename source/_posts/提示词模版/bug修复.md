# 前端开发提示词模板

## 一、基本信息区

- **角色**：中级前端工程师
- **项目名称**：vue3-admin-dashboard
- **技术栈**：Vue3.3.4 + TypeScript 5.2 + Vite 5.1 + Pinia 2.1 + Element Plus 2.4
- **环境信息**：
  - 浏览器：Chrome 120.0.6099.199
  - 设备：MacBook Pro M1 (16GB)
  - 构建工具：Vite 5.1.4

## 二、场景描述区

### 场景分类

- [x] Bug 修复

### 详细描述（Bug 修复）

- **问题描述**：点击用户列表“批量删除”按钮后，选中项未被删除，控制台无报错
- **复现步骤**：
  1. 打开页面 http://localhost:5173/user/list
  2. 勾选表格前 2 行的复选框（选中 2 条数据）
  3. 点击顶部“批量删除”按钮
- **预期结果**：选中项从列表中移除，提示“成功删除 2 条数据”
- **实际结果**：列表无变化，无提示
- **相关代码**：
  ```typescript
  // src/views/UserList.vue
  const handleBatchDelete = async () => {
    const ids = selectedRows.value.map((row) => row.id);
    await deleteUsers(ids); // 调用 API
    fetchUserList(); // 重新拉取列表（未执行？）
  };
  ```
