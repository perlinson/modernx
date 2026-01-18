#!/usr/bin/env node

/**
 * ModernX GUI 使用演示
 * 展示如何在实际项目中使用 modernx-gui
 */

const path = require('path');
const fs = require('fs');

console.log('🎨 ModernX GUI 使用演示\n');

// 创建一个示例 ModernX 项目结构
function createDemoProject() {
  console.log('📁 创建示例 ModernX 项目...');
  
  const demoDir = path.join(__dirname, 'demo-project');
  
  // 创建项目目录结构
  const dirs = [
    'demo-project/src',
    'demo-project/src/models',
    'demo-project/src/components',
    'demo-project/src/services'
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`  ✅ 创建目录: ${dir}`);
    }
  });
  
  // 创建 package.json
  const packageJson = {
    name: 'demo-modernx-app',
    version: '1.0.0',
    description: 'Demo ModernX application for GUI testing',
    main: 'src/index.js',
    scripts: {
      start: 'node src/index.js',
      dev: 'nodemon src/index.js'
    },
    dependencies: {
      modernx: '^1.0.0',
      'modernx-gui': '^1.0.0'
    },
    devDependencies: {
      nodemon: '^2.0.0'
    }
  };
  
  fs.writeFileSync(
    path.join(demoDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('  ✅ 创建 package.json');
  
  // 创建示例模型文件
  const userModel = `
// User model
export default {
  namespace: 'user',
  state: {
    currentUser: null,
    loading: false,
    error: null
  },
  effects: {
    *login({ payload }, { put, call }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        // 模拟 API 调用
        const response = yield call(mockLogin, payload);
        yield put({ type: 'setUser', payload: response });
        yield put({ type: 'setLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
        yield put({ type: 'setLoading', payload: false });
      }
    }
  },
  reducers: {
    setUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setError(state, { payload }) {
      return { ...state, error: payload };
    }
  }
};

function mockLogin(credentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        token: 'mock-jwt-token'
      });
    }, 1000);
  });
}
`;
  
  fs.writeFileSync(
    path.join(demoDir, 'src/models/user.js'),
    userModel.trim()
  );
  console.log('  ✅ 创建 user.js 模型');
  
  // 创建计数器模型
  const counterModel = `
// Counter model
export default {
  namespace: 'counter',
  state: {
    count: 0,
    history: []
  },
  effects: {
    *incrementAsync({ payload }, { put, select }) {
      const currentCount = yield select(state => state.counter.count);
      yield put({ type: 'increment', payload });
      yield put({ 
        type: 'addToHistory', 
        payload: { 
          action: 'increment', 
          value: currentCount + 1,
          timestamp: Date.now()
        } 
      });
    }
  },
  reducers: {
    increment(state, { payload = 1 }) {
      return { 
        ...state, 
        count: state.count + payload 
      };
    },
    decrement(state, { payload = 1 }) {
      return { 
        ...state, 
        count: state.count - payload 
      };
    },
    reset(state) {
      return { 
        ...state, 
        count: 0,
        history: []
      };
    },
    addToHistory(state, { payload }) {
      return {
        ...state,
        history: [...state.history, payload].slice(-10) // 保留最近10条记录
      };
    }
  }
};
`;
  
  fs.writeFileSync(
    path.join(demoDir, 'src/models/counter.js'),
    counterModel.trim()
  );
  console.log('  ✅ 创建 counter.js 模型');
  
  // 创建应用入口文件
  const appEntry = `
import modernx from 'modernx';
import gui from 'modernx-gui';
import user from './models/user';
import counter from './models/counter';

// 创建 ModernX 应用
const app = modernx({
  models: [user, counter],
  plugins: [
    gui({
      port: 3000,
      autoOpen: true,
      websocket: true
    })
  ]
});

// 模拟一些用户操作来演示 GUI 功能
setTimeout(() => {
  console.log('🔄 模拟用户登录...');
  app._store.dispatch({ type: 'user/login', payload: { username: 'alice', password: '123456' } });
}, 2000);

setTimeout(() => {
  console.log('🔄 模拟计数器操作...');
  app._store.dispatch({ type: 'counter/increment' });
}, 3000);

setTimeout(() => {
  console.log('🔄 模拟更多计数器操作...');
  app._store.dispatch({ type: 'counter/increment' });
  app._store.dispatch({ type: 'counter/increment' });
}, 4000);

setTimeout(() => {
  console.log('🔄 模拟用户登出...');
  app._store.dispatch({ type: 'user/setUser', payload: null });
}, 5000);

console.log('🚀 Demo 应用已启动，GUI 应该已在浏览器中打开');
console.log('📊 可以在 GUI 中查看实时状态变化和动作历史');

export default app;
`;
  
  fs.writeFileSync(
    path.join(demoDir, 'src/index.js'),
    appEntry.trim()
  );
  console.log('  ✅ 创建 index.js 入口文件');
  
  console.log(`✅ 示例项目创建完成: ${demoDir}`);
  return demoDir;
}

// 演示 GUI 功能特性
function demonstrateGUIFeatures() {
  console.log('\n🎯 ModernX GUI 功能特性演示:');
  console.log('');
  
  console.log('1. 📊 实时状态监控');
  console.log('   - 查看当前应用状态');
  console.log('   - 树形结构显示嵌套状态');
  console.log('   - 状态变化高亮显示');
  console.log('');
  
  console.log('2. ⚡ 动作历史追踪');
  console.log('   - 按时间顺序显示所有动作');
  console.log('   - 显示动作载荷 (payload)');
  console.log('   - 动作执行时间戳');
  console.log('');
  
  console.log('3. 🏗️ 项目结构分析');
  console.log('   - 自动检测 ModernX 模型');
  console.log('   - 显示项目配置信息');
  console.log('   - 模型文件列表');
  console.log('');
  
  console.log('4. 🔄 WebSocket 实时通信');
  console.log('   - 实时状态同步');
  console.log('   - 双向通信支持');
  console.log('   - 连接状态指示');
  console.log('');
  
  console.log('5. 🔧 开发者工具');
  console.log('   - 状态快照导出');
  console.log('   - 动作回放功能');
  console.log('   - 性能监控');
}

// 显示集成指南
function showIntegrationGuide() {
  console.log('\n📖 ModernX GUI 集成指南:');
  console.log('');
  
  console.log('🚀 方式一: CLI 启动 (推荐用于调试)');
  console.log('```bash');
  console.log('# 在 ModernX 项目根目录');
  console.log('npx modernx-gui');
  console.log('# 或者');
  console.log('node_modules/.bin/modernx-gui');
  console.log('```');
  console.log('');
  
  console.log('🔧 方式二: 程序化集成');
  console.log('```javascript');
  console.log('import modernx from "modernx";');
  console.log('import gui from "modernx-gui";');
  console.log('');
  console.log('const app = modernx({');
  console.log('  models: [/* 你的模型 */],');
  console.log('  plugins: [');
  console.log('    gui({');
  console.log('      port: 3000,        // GUI 端口');
  console.log('      autoOpen: true,     // 自动打开浏览器');
  console.log('      websocket: true,    // 启用 WebSocket');
  console.log('      host: "localhost"   // 服务器主机');
  console.log('    })');
  console.log('  ]');
  console.log('});');
  console.log('```');
  console.log('');
  
  console.log('⚙️ 方式三: 配置选项');
  console.log('```javascript');
  console.log('gui({');
  console.log('  port: 3001,              // 自定义端口');
  console.log('  autoOpen: false,         // 不自动打开浏览器');
  console.log('  websocket: true,          // 启用实时通信');
  console.log('  host: "0.0.0.0",        // 允许远程访问');
  console.log('  // 高级选项');
  console.log('  theme: "dark",           // 主题设置');
  console.log('  maxHistory: 1000,        // 最大历史记录数');
  console.log('  refreshInterval: 1000    // 刷新间隔 (ms)');
  console.log('})');
  console.log('```');
}

// 主函数
function main() {
  console.log('🎨 欢迎使用 ModernX GUI！');
  console.log('这是 ModernX 的官方开发调试工具，提供实时状态监控和可视化界面。');
  console.log('');
  
  // 创建演示项目
  const demoProject = createDemoProject();
  
  // 演示功能特性
  demonstrateGUIFeatures();
  
  // 显示集成指南
  showIntegrationGuide();
  
  console.log('\n🎯 下一步操作:');
  console.log(`1. 进入演示项目: cd ${demoProject}`);
  console.log('2. 安装依赖: npm install');
  console.log('3. 启动应用: npm start');
  console.log('4. 在另一个终端启动 GUI: npx modernx-gui');
  console.log('5. 在浏览器中查看: http://localhost:3000');
  console.log('');
  console.log('💡 提示: GUI 会自动检测 ModernX 项目并显示实时状态！');
  console.log('');
  console.log('🔗 相关链接:');
  console.log('- 文档: https://github.com/perlinson/modernx');
  console.log('- 问题反馈: https://github.com/perlinson/modernx/issues');
  console.log('');
  console.log('🎉 享受 ModernX 开发体验！');
}

// 运行演示
main();
