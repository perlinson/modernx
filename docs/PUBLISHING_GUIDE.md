#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('📦 创建新的 ModernX 包...\n');

// 获取包名
const packageName = process.argv[2];
if (!packageName) {
  console.error('❌ 请提供包名: node scripts/create-package.js <package-name>');
  console.log('示例: node scripts/create-package.js modernx-utils');
  process.exit(1);
}

// 验证包名格式
if (!packageName.startsWith('modernx-')) {
  console.error('❌ 包名必须以 "modernx-" 开头');
  process.exit(1);
}

const packageDir = path.join(__dirname, '..', 'packages', packageName);

// 检查包是否已存在
if (fs.existsSync(packageDir)) {
  console.error(`❌ 包 ${packageName} 已存在`);
  process.exit(1);
}

// 创建目录结构
console.log(`📁 创建包目录: ${packageName}`);
fs.mkdirSync(packageDir, { recursive: true });
fs.mkdirSync(path.join(packageDir, 'src'), { recursive: true });
fs.mkdirSync(path.join(packageDir, 'test'), { recursive: true });

// 创建 package.json
const packageJson = {
  name: packageName,
  version: "1.0.0",
  description: `ModernX ${packageName.replace('modernx-', '')} plugin`,
  main: "dist/index.js",
  module: "dist/index.esm.js",
  types: "index.d.ts",
  sideEffects: false,
  files: [
    "dist",
    "src",
    "index.d.ts"
  ],
  repository: {
    type: "git",
    url: "https://github.com/perlinson/modernx",
    directory: `packages/${packageName}`
  },
  homepage: "https://github.com/perlinson/modernx",
  keywords: [
    "modernx",
    "modernx-plugin",
    packageName.replace('modernx-', '')
  ],
  author: "perlinson <perlinson2024@gmail.com>",
  license: "MIT",
  dependencies: {
    "@babel/runtime": "^7.20.0"
  },
  peerDependencies: {
    "modernx": "^1.0.0"
  },
  devDependencies: {
    "modernx": "*"
  },
  scripts: {
    "build": "father-build",
    "test": "jest",
    "lint": "eslint src"
  }
};

fs.writeFileSync(
  path.join(packageDir, 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
);

// 创建主入口文件
const indexContent = `/**
 * ${packageName}
 * ModernX ${packageName.replace('modernx-', '')} plugin
 */

export default function ${packageName.replace('modernx', '').replace(/^-/, '').charAt(0).toUpperCase() + packageName.replace('modernx-', '').slice(1)}(options = {}) {
  return {
    name: '${packageName}',
    ...options
  };
};

export * from './src';
`;

fs.writeFileSync(path.join(packageDir, 'index.js'), indexContent);

// 创建源文件
const srcContent = `/**
 * ${packageName} source code
 */

export const hello = () => {
  console.log('Hello from ${packageName}!');
};

export default hello;
`;

fs.writeFileSync(path.join(packageDir, 'src', 'index.js'), srcContent);

// 创建测试文件
const testContent = `import { hello } from '../src';

describe('${packageName}', () => {
  test('should export hello function', () => {
    expect(typeof hello).toBe('function');
  });

  test('should log hello message', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    hello();
    expect(consoleSpy).toHaveBeenCalledWith('Hello from ${packageName}!');
    consoleSpy.mockRestore();
  });
});
`;

fs.writeFileSync(path.join(packageDir, 'test', 'index.test.js'), testContent);

// 创建 README
const readmeContent = `# ${packageName}

ModernX ${packageName.replace('modernx-', '')} plugin.

## Installation

\`\`\`bash
npm install ${packageName}
\`\`\`

## Usage

\`\`\`javascript
import ${packageName.replace('modernx', '').replace(/^-/, '').charAt(0).toUpperCase() + packageName.replace('modernx-', '').slice(1)} from '${packageName}';

const app = createApp({
  plugins: [
    ${packageName.replace('modernx', '').replace(/^-/, '').charAt(0).toUpperCase() + packageName.replace('modernx-', '').slice(1)}()
  ]
});
\`\`\`

## API

### ${packageName.replace('modernx', '').replace(/^-/, '').charAt(0).toUpperCase() + packageName.replace('modernx-', '').slice(1)}(options)

创建 ${packageName.replace('modernx-', '')} 插件实例。

#### Options

- \`options\` (Object): 配置选项

## License

MIT
`;

fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);

// 创建 TypeScript 定义文件
const typesContent = `declare module '${packageName}' {
  export interface Options {
    [key: string]: any;
  }

  export default function ${packageName.replace('modernx', '').replace(/^-/, '').charAt(0).toUpperCase() + packageName.replace('modernx-', '').slice(1)}(options?: Options): any;
  
  export * from './src';
}
`;

fs.writeFileSync(path.join(packageDir, 'index.d.ts'), typesContent);

console.log(`✅ 包 ${packageName} 创建成功!`);
console.log('\n📁 创建的文件:');
console.log(`  - packages/${packageName}/package.json`);
console.log(`  - packages/${packageName}/index.js`);
console.log(`  - packages/${packageName}/src/index.js`);
console.log(`  - packages/${packageName}/test/index.test.js`);
console.log(`  - packages/${packageName}/README.md`);
console.log(`  - packages/${packageName}/index.d.ts`);

console.log('\n🚀 下一步:');
console.log(`  1. 编辑 packages/${packageName}/src/index.js 实现功能`);
console.log(`  2. 添加测试到 packages/${packageName}/test/`);
console.log(`  3. 更新文档 packages/${packageName}/README.md`);
console.log(`  4. 运行 npm run workspaces:link 链接依赖`);
console.log(`  5. 运行 npm test 测试新包`);
