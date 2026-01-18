# 首次发布到 NPM 指南

## 🚨 当前问题

发布失败，错误信息：
```
npm notice Access token expired or revoked. Please try logging in again.
npm error code E404
npm error 404 Not Found - PUT https://registry.npmjs.org/modernx-core - Not found
```

## 🔍 问题分析

1. **404 Not Found**: 包名在 NPM 上不存在（首次发布）
2. **Token 过期**: Access Token 可能已过期或被撤销
3. **权限问题**: Token 可能没有发布权限

## 🔧 解决步骤

### 步骤 1: 重新生成 NPM Access Token

1. 登录 [NPM](https://www.npmjs.com)
2. 点击右上角头像 → **Account Settings**
3. 左侧菜单点击 **Access Tokens**
4. **删除所有旧 Token**（如果有的话）
5. 点击 **Generate New Token**
6. 选择 **Automation** 类型
7. 输入 Token 名称：`modernx-github-actions`
8. 点击 **Generate Token**
9. **立即复制新 Token**

### 步骤 2: 更新 GitHub Secret

1. 访问 https://github.com/perlinson/modernx/settings/secrets/actions
2. 找到 `NPM_TOKEN` secret
3. 点击 **Update**
4. 粘贴新的 Token
5. 点击 **Save**

### 步骤 3: 手动首次发布（推荐）

由于是首次发布，建议手动发布一次：

```bash
# 登录 NPM
npm login

# 发布 modernx-core
cd packages/modernx-core
npm publish --access public

# 发布 modernx-immer
cd ../modernx-immer
npm publish --access public

# 发布 modernx-loading
cd ../modernx-loading
npm publish --access public

# 发布 modernx
cd ../modernx
npm publish --access public
```

### 步骤 4: 验证发布

```bash
# 检查包是否存在
npm view modernx-core
npm view modernx-immer
npm view modernx-loading
npm view modernx
```

### 步骤 5: 测试自动发布

手动发布成功后，测试自动发布：

```bash
# 删除测试标签
git tag -d v1.0.3-test
git push origin :v1.0.3-test

# 创建新标签
git tag v1.0.3-test
git push origin v1.0.3-test
```

## 📋 首次发布注意事项

### 包名检查
确保包名在 NPM 上是唯一的：
- modernx
- modernx-core
- modernx-immer
- modernx-loading

### 权限检查
确认你有以下权限：
- 发布新包的权限
- 更新现有包的权限

### 版本检查
确认版本号正确：
- 首次发布必须是有效版本号（如 1.0.2）
- 不能是 0.0.0 或无效版本

## 🚀 发布成功后

首次发布成功后：

1. **自动发布生效**: 后续版本可以自动发布
2. **GitHub Actions**: 不再需要手动干预
3. **版本管理**: 可以使用 `npm run release:patch` 等

## 🆘 故障排除

### Token 仍然无效
- 检查 Token 类型是否为 Automation
- 确认 Token 没有过期
- 重新生成新的 Token

### 包名冲突
- 访问 https://www.npmjs.com/search?q=modernx-core
- 如果包名被占用，需要更改包名

### 权限不足
- 联系 NPM 支持团队
- 检查账号状态

---

完成首次发布后，自动发布就会正常工作了！🎉
