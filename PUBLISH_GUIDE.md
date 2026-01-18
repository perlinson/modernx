# 🚀 modernx 发布指南

## 📋 发布前准备

### 1. 修改 package.json 信息
```json
{
  "name": "modernx",  // 改为你的包名
  "version": "2.0.0-react18",
  "description": "React 18 enhanced modernx framework",
  "repository": {
    "type": "git",
    "url": "https://github.com/perlinson/modernx.git"  // 改为你的仓库
  },
  "author": "YOUR_NAME <YOUR_EMAIL>",  // 改为你的信息
  "homepage": "https://github.com/perlinson/modernx#readme"
}
```

### 2. 登录 npm
```bash
npm login
```

### 3. 检查 npm registry
```bash
npm config get registry
# 应该输出: https://registry.npmjs.org/
```

## 🔧 发布步骤

### 方案 1: 单包发布 (推荐)

#### 1. 构建项目
```bash
npm run build
```

#### 2. 发布到 npm
```bash
npm publish
```

### 方案 2: Lerna 多包发布

#### 1. 更新版本
```bash
npm run release
```

## 📦 在项目中使用

### 安装你的包
```bash
npm install modernx
```

### 使用方式
```javascript
// 方式 1: 直接导入
import { createApp } from 'modernx';

// 方式 2: 别名导入 (如果想保持原有 API)
import modernx from 'modernx';
const { createApp } = modernx;

// 使用 React 18 新特性
import { useModernXTransition } from 'modernx/react18-utils';
```

## 🔄 替代方案

### 方案 3: 使用 npm scope (推荐企业用户)

```json
{
  "name": "@yourname/modernx",
  "publishConfig": {
    "registry": "https://registry.npmjs.org/"
  }
}
```

### 方案 4: 私有 registry

```bash
# 发布到私有 registry
npm publish --registry http://your-private-registry.com

# 安装时指定 registry
npm install @yourname/modernx --registry http://your-private-registry.com
```

## 📝 版本管理

### 语义化版本
- `2.0.0-react18`: 首次发布
- `1.0.0`: 补丁更新
- `2.1.0-react18`: 小版本更新
- `3.0.0-react18`: 大版本更新

### 发布命令
```bash
# 补丁版本
npm version patch
npm publish

# 小版本
npm version minor
npm publish

# 大版本
npm version major
npm publish
```

## ⚠️ 注意事项

1. **包名唯一性**: 确保包名在 npm 上未被占用
2. **许可证**: 保持 MIT 许可证兼容性
3. **依赖版本**: 确保 peer dependencies 正确设置
4. **构建产物**: 确保 lib、es、dist 目录正确生成

## 🛠️ 故障排除

### 常见错误

#### 1. 包名已存在
```
npm ERR! 403 403 Package name already exists
```
**解决**: 更换包名或联系原作者

#### 2. 权限错误
```
npm ERR! 403 403 You do not have permission to publish "package-name"
```
**解决**: 检查包名所有权，使用不同的包名

#### 3. Registry 错误
```
npm ERR! 404 Not Found - GET https://registry.npmjs.org/package-name
```
**解决**: 检查 npm registry 设置

### 验证发布
```bash
# 检查包是否存在
npm view modernx

# 安装测试
npm install modernx
```

## 📞 社区支持

- 创建 GitHub 仓库用于问题反馈
- 在 README 中提供联系方式
- 考虑添加 Discord/Slack 社区

---

**🎉 恭喜！你的 modernx 现在可以发布到 npm 并在项目中使用了！**
