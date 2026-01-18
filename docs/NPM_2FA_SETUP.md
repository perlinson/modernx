# NPM 双因素认证 (2FA) 设置指南

## 🚨 当前问题

GitHub Actions 发布时遇到 2FA 错误：
```
npm error code EOTP
npm error This operation requires a one-time password from your authenticator.
```

## 🔧 解决方案

### 方法一：使用 NPM Access Token（推荐）

#### 1. 创建 NPM Access Token

1. 登录 [NPM](https://www.npmjs.com)
2. 点击右上角头像 → **Account Settings**
3. 左侧菜单点击 **Access Tokens**
4. 点击 **Generate New Token**
5. 选择 **Automation** 类型
6. 输入 Token 名称（如：modernx-github-actions）
7. 点击 **Generate Token**
8. **立即复制 Token**（只显示一次）

#### 2. 设置 GitHub Secret

1. 访问你的 GitHub 仓库：https://github.com/perlinson/modernx
2. 点击 **Settings** 标签
3. 左侧菜单点击 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**
5. **Name**: `NPM_TOKEN`
6. **Value**: 粘贴刚才复制的 NPM Access Token
7. 点击 **Add secret**

#### 3. 验证设置

Token 设置完成后，GitHub Actions 会自动使用这个 Token 进行发布，无需 OTP。

### 方法二：禁用 2FA（不推荐）

如果不想使用 2FA：

1. 登录 [NPM](https://www.npmjs.com)
2. 进入 **Account Settings**
3. 找到 **Two-factor authentication**
4. 选择 **Disable**（不推荐，降低安全性）

### 方法三：使用 OTP 参数（仅适用于手动发布）

```bash
# 手动发布时使用 OTP
npm publish --otp=123456
```

## 🎯 设置完成后

设置 NPM_TOKEN 后：

1. **重新触发发布**:
   ```bash
   git tag v1.0.3-test
   git push origin v1.0.3-test
   ```

2. **监控发布状态**:
   - 访问 https://github.com/perlinson/modernx/actions
   - 查看 NPM Publish 工作流
   - 应该不再出现 OTP 错误

## 📋 检查清单

- [ ] 已创建 NPM Access Token
- [ ] 已设置 GitHub Secret `NPM_TOKEN`
- [ ] Token 有发布权限
- [ ] 重新触发发布工作流
- [ ] 监控发布状态

## 🔍 故障排除

### Token 无效
- 检查 Token 是否过期
- 确认 Token 类型是 Automation
- 重新生成新的 Token

### 权限不足
- 确认 Token 有发布权限
- 检查是否是包的维护者
- 联系包所有者添加权限

### 工作流仍然失败
- 检查 Secret 名称是否正确（必须是 `NPM_TOKEN`）
- 查看 Actions 日志中的详细错误信息
- 确认 Token 没有过期

## 🚀 发布成功后

发布成功后，你可以：

1. **验证包**: 访问 https://www.npmjs.com/package/modernx-core
2. **测试安装**: `npm install modernx-core@1.0.2`
3. **正式发布**: 使用 `npm run release:patch`

---

设置完成后，自动发布就会正常工作了！🎉
