# 使用 Granular Access Token 发布 modernx

## 🛠️ 解决 2FA 发布问题

由于 npm 现在要求 2FA，我们需要使用 Granular Access Token 来发布包。

## 📋 步骤

### 1. 创建 Granular Access Token

1. 访问: https://www.npmjs.com/settings/perlinson/tokens/create
2. 选择 **Granular Access Token**
3. 设置名称: `modernx-publish`
4. 设置过期时间: 90 天
5. 权限设置:
   - **Packages**: 选择 `modernx`
   - **Access**: Read and write
   - **Scope**: 选择你的包范围
6. 点击 **Create Token**
7. **复制 token**（只显示一次）

### 2. 使用 Token 发布

#### 方法 A: 设置环境变量
```bash
export NPM_TOKEN="your_granular_token_here"
npm publish --prefix ./lib
```

#### 方法 B: 使用 .npmrc
```bash
# 在项目根目录创建 .npmrc
echo "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}" > .npmrc

# 设置环境变量
export NPM_TOKEN="your_granular_token_here"
npm publish --prefix ./lib
```

#### 方法 C: 直接在命令中使用
```bash
npm publish --prefix ./lib --//registry.npmjs.org/:_authToken="your_granular_token_here"
```

### 3. 更新发布脚本

修改 `scripts/simple-publish.js`，添加 token 支持：

```javascript
// 在发布前设置 token
const npmToken = process.env.NPM_TOKEN;
if (npmToken) {
  process.env.NPM_CONFIG_AUTH_TOKEN = npmToken;
}
```

### 4. 自动化发布

#### 使用 GitHub Actions
```yaml
name: Publish to npm
on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --prefix ./lib
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🚀 快速发布命令

```bash
# 1. 设置 token
export NPM_TOKEN="your_granular_token_here"

# 2. 发布
pnpm run publish
```

## 🔒 安全提示

- 不要在代码中硬编码 token
- 使用环境变量或 CI/CD secrets
- 定期轮换 token
- 限制 token 权限范围

## 📞 如果仍有问题

1. 确认 token 权限正确
2. 检查包名是否已被占用
3. 确认 npm 账户状态
4. 查看 npm 日志: `npm login --verbose`
