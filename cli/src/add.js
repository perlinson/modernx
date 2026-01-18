/**
 * modernx add 命令
 * 为当前项目添加功能模块
 */

const { join } = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');

const AVAILABLE_FEATURES = {
  router: {
    name: 'React Router',
    description: 'Add React Router v6 support',
    files: ['src/router.js', 'src/routes/'],
    dependencies: ['react-router-dom']
  },
  immer: {
    name: 'Immer',
    description: 'Add Immer for immutable state updates',
    files: ['src/utils/immer.js'],
    dependencies: ['immer']
  },
  loading: {
    name: 'Loading State',
    description: 'Add loading state management',
    files: ['src/models/loading.js'],
    dependencies: []
  },
  concurrent: {
    name: 'React 18 Concurrent',
    description: 'Add React 18 concurrent features',
    files: ['src/components/ConcurrentExamples.js'],
    dependencies: []
  },
  typescript: {
    name: 'TypeScript',
    description: 'Add TypeScript support',
    files: ['tsconfig.json', 'src/types/'],
    dependencies: ['typescript', '@types/react', '@types/react-dom']
  },
  testing: {
    name: 'Testing',
    description: 'Add testing setup with Jest and React Testing Library',
    files: ['test/', 'jest.config.js'],
    dependencies: ['jest', '@testing-library/react', '@testing-library/jest-dom']
  }
};

async function add(feature, options) {
  const { force } = options;
  
  console.log(chalk.blue.bold('\n🚀 Adding feature to project...'));
  console.log(chalk.gray(`Feature: ${feature}`));
  
  // 检查当前目录是否为 modernx 项目
  if (!isModernXProject()) {
    console.log(chalk.red('❌ Current directory is not a modernx project!'));
    console.log(chalk.gray('Please run this command in a project directory created with modernx.'));
    process.exit(1);
  }
  
  // 检查功能是否可用
  if (!AVAILABLE_FEATURES[feature]) {
    console.log(chalk.red(`❌ Feature "${feature}" not found!`));
    console.log(chalk.blue.bold('\nAvailable features:'));
    Object.entries(AVAILABLE_FEATURES).forEach(([key, value]) => {
      console.log(chalk.gray(`  ${key} - ${value.description}`));
    });
    process.exit(1);
  }
  
  const featureInfo = AVAILABLE_FEATURES[feature];
  
  // 检查功能是否已存在
  if (!force && isFeatureInstalled(feature)) {
    console.log(chalk.yellow(`⚠️  Feature "${feature}" is already installed!`));
    console.log(chalk.gray('Use --force to reinstall.'));
    process.exit(1);
  }
  
  const spinner = ora(`Adding ${featureInfo.name}...`).start();
  
  try {
    // 添加功能文件
    await addFeatureFiles(feature, featureInfo);
    
    // 更新依赖
    await updateDependencies(feature, featureInfo);
    
    // 更新配置文件
    await updateConfigFiles(feature, featureInfo);
    
    spinner.succeed(`${featureInfo.name} added successfully!`);
    
    // 显示完成信息
    showFeatureInfo(feature, featureInfo);
    
  } catch (error) {
    spinner.fail(`Failed to add ${featureInfo.name}`);
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function isModernXProject() {
  const packageJsonPath = join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }
  
  try {
    const packageJson = fs.readJsonSync(packageJsonPath);
    return packageJson.dependencies && (
      packageJson.dependencies['modernx'] ||
      packageJson.dependencies.modernx
    );
  } catch (error) {
    return false;
  }
}

function isFeatureInstalled(feature) {
  const featureInfo = AVAILABLE_FEATURES[feature];
  
  return featureInfo.files.some(file => {
    const filePath = join(process.cwd(), file);
    return fs.existsSync(filePath);
  });
}

async function addFeatureFiles(feature, featureInfo) {
  const templatesDir = join(__dirname, '../templates/features');
  const featureDir = join(templatesDir, feature);
  
  if (!fs.existsSync(featureDir)) {
    throw new Error(`Feature template for "${feature}" not found`);
  }
  
  // 复制功能模板文件
  await fs.copy(featureDir, process.cwd());
}

async function updateDependencies(feature, featureInfo) {
  if (featureInfo.dependencies && featureInfo.dependencies.length > 0) {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    
    // 添加依赖到 package.json
    featureInfo.dependencies.forEach(dep => {
      if (!packageJson.dependencies[dep]) {
        packageJson.dependencies[dep] = 'latest';
      }
    });
    
    // 保存更新后的 package.json
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });
  }
}

async function updateConfigFiles(feature, featureInfo) {
  // 根据功能更新配置文件
  switch (feature) {
    case 'typescript':
      await updateTypeScriptConfig();
      break;
    case 'testing':
      await updateTestingConfig();
      break;
    case 'router':
      await updateRouterConfig();
      break;
  }
}

async function updateTypeScriptConfig() {
  const tsconfigPath = join(process.cwd(), 'tsconfig.json');
  
  const tsconfig = {
    "compilerOptions": {
      "target": "ES2020",
      "lib": ["DOM", "DOM.Iterable", "ES6"],
      "allowJs": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "module": "ESNext",
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx"
    },
    "include": [
      "src"
    ]
  };
  
  fs.writeJsonSync(tsconfigPath, tsconfig, { spaces: 2 });
}

async function updateTestingConfig() {
  const jestConfigPath = join(process.cwd(), 'jest.config.js');
  
  const jestConfig = `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  moduleNameMapping: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\\\.(gif|ttf|eot|svg)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/**/*.d.ts'
  ]
};`;
  
  fs.writeFileSync(jestConfigPath, jestConfig);
}

async function updateRouterConfig() {
  const routerConfigPath = join(process.cwd(), 'src/router.config.js');
  
  const routerConfig = `import { createBrowserHistory } from 'history';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { createApp } from 'modernx';

const history = createBrowserHistory();
const app = createApp({
  initialReducer: {
    router: connectRouter(history),
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware().concat(routerMiddleware(history)),
});

export { app, history };
export default app;`;
  
  fs.writeFileSync(routerConfigPath, routerConfig);
}

function showFeatureInfo(feature, featureInfo) {
  console.log(chalk.green.bold(`\n🎉 ${featureInfo.name} added successfully!`));
  
  console.log(chalk.blue.bold('\n📁 Files created:'));
  featureInfo.files.forEach(file => {
    console.log(chalk.gray(`  ✓ ${file}`));
  });
  
  if (featureInfo.dependencies && featureInfo.dependencies.length > 0) {
    console.log(chalk.blue.bold('\n📦 Dependencies added:'));
    featureInfo.dependencies.forEach(dep => {
      console.log(chalk.gray(`  ✓ ${dep}`));
    });
  }
  
  console.log(chalk.blue.bold('\n🚀 Next Steps:'));
  console.log(chalk.gray('  npm install'));
  console.log(chalk.gray('  npm run dev'));
  
  console.log(chalk.blue.bold('\n📚 Learn More:'));
  console.log(chalk.gray(`  Feature: ${featureInfo.description}`));
  console.log(chalk.gray('  Documentation: https://github.com/perlinson/modernx'));
}

module.exports = add;
