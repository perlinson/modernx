# modernx-logger

ModernX 的日志插件，提供完整的 Redux 日志记录和状态追踪功能。

## 🎯 特性

- 📝 **Redux 日志记录** - 完整记录所有 Redux actions
- 🔍 **状态变化追踪** - 详细的状态前后对比
- ⚡ **性能监控** - action 执行时间和性能分析
- 🎨 **可配置输出** - 支持多种日志格式和级别
- 📊 **统计信息** - action 类型和频率统计
- 🔌 **GUI 集成** - 与 modernx-gui 完美集成

## 🚀 快速开始

### 安装
```bash
npm install modernx-logger
```

### 基础使用
```javascript
import { createApp } from 'modernx';
import logger from 'modernx-logger';

const app = createApp({
  models: [
    // 你的模型
  ],
  plugins: [
    logger()  // 启用日志插件
  ]
});

app.start();
```

### 高级配置
```javascript
import logger from 'modernx-logger';

const app = createApp({
  plugins: [
    logger({
      collapsed: true,        // 折叠日志
      duration: true,         // 显示执行时间
      timestamp: true,        // 显示时间戳
      level: 'info',          // 日志级别
      colors: true,           // 彩色输出
      diff: true,             // 显示状态差异
      predicate: (action, state) => {
        // 过滤条件
        return action.type !== 'EFFECT_TRIGGERED';
      }
    })
  ]
});
```

## 📋 配置选项

### 基础配置
```javascript
logger({
  // 是否折叠日志
  collapsed: true,
  
  // 是否显示执行时间
  duration: true,
  
  // 是否显示时间戳
  timestamp: true,
  
  // 日志级别: 'log' | 'console' | 'warn' | 'error' | 'info'
  level: 'log',
  
  // 是否使用颜色
  colors: true,
  
  // 是否显示状态差异
  diff: true,
  
  // 日志标题
  title: action => action.type,
  
  // 状态转换器
  stateTransformer: state => state.toJS ? state.toJS() : state,
  
  // action 转换器
  actionTransformer: action => action,
  
  // 错误转换器
  errorTransformer: error => error,
})
```

### 过滤配置
```javascript
logger({
  // 只记录特定类型的 action
  predicate: (action, state) => {
    return action.type.startsWith('user/') ||
           action.type.startsWith('counter/');
  },
  
  // 过滤状态字段
  stateFilter: (state, action) => {
    const { loading, ...filteredState } = state;
    return filteredState;
  },
  
  // 过滤 action 字段
  actionFilter: (action, state) => {
    const { type, payload } = action;
    return { type, payload };
  }
})
```

### 格式化配置
```javascript
logger({
  // 自定义格式化函数
  formatter: (action, time, took) => {
    return `${action.type} @ ${time} (took ${took}ms)`;
  },
  
  // 自定义状态格式化
  stateFormatter: (state, action) => {
    return JSON.stringify(state, null, 2);
  },
  
  // 自定义颜色
  colors: {
    title: () => '#03A9F4',
    prevState: () => '#9E9E9E',
    action: () => '#03A9F4',
    nextState: () => '#4CAF50',
    error: () => '#F20404',
  }
})
```

## 📊 日志输出示例

### 基础日志
```
action counter/increment @ 10:30:45.123 (took 2ms)
  prev state: { count: 0 }
  action     : { type: "counter/increment", payload: 1 }
  next state: { count: 1 }
```

### 折叠日志
```
▶ counter/increment (took 2ms)
```

### 带差异的日志
```
action user/login @ 10:30:45.123 (took 1000ms)
  prev state: { currentUser: null, loading: false }
  action     : { type: "user/login", payload: { username: "admin" } }
  next state: { 
    currentUser: { id: 1, name: "Admin" },
    loading: false 
  }
  diff:
    - currentUser: null
    + currentUser: { id: 1, name: "Admin" }
```

## 🔌 GUI 集成

### 与 modernx-gui 集成
```javascript
import { createApp } from 'modernx';
import logger from 'modernx-logger';

// 创建 WebSocket 连接
const ws = new WebSocket('ws://localhost:3000');

const app = createApp({
  plugins: [
    logger({
      // 自定义日志处理
      onLog: (log) => {
        // 发送日志到 GUI
        if (ws && ws.readyState === 1) {
          ws.send(JSON.stringify({
            type: 'logger',
            level: log.level,
            message: log.message,
            data: log.data
          }));
        }
      }
    })
  ]
});
```

### GUI 日志显示
GUI 会自动显示以下日志信息：
- 📝 **Action 日志** - 所有 Redux actions
- 🔍 **状态变化** - 状态前后对比
- ⏱️ **性能数据** - 执行时间和频率
- 📊 **统计信息** - action 类型和频率

## 🎯 使用场景

### 1. 开发调试
```javascript
// 开发环境启用详细日志
if (process.env.NODE_ENV === 'development') {
  const app = createApp({
    plugins: [
      logger({
        collapsed: false,
        duration: true,
        timestamp: true,
        diff: true
      })
    ]
  });
}
```

### 2. 性能分析
```javascript
// 监控性能瓶颈
const app = createApp({
  plugins: [
    logger({
      duration: true,
      predicate: (action) => {
        // 只记录耗时较长的 action
        return action.type.includes('fetch') || 
               action.type.includes('save');
      }
    })
  ]
});
```

### 3. 错误追踪
```javascript
// 记录错误和警告
const app = createApp({
  plugins: [
    logger({
      level: 'error',
      predicate: (action, state) => {
        return action.type.includes('error') || 
               action.type.includes('fail');
      }
    })
  ]
});
```

### 4. 生产监控
```javascript
// 生产环境的轻量日志
const app = createApp({
  plugins: [
    logger({
      collapsed: true,
      duration: false,
      timestamp: true,
      level: 'warn',
      predicate: (action) => {
        // 只记录重要操作
        return action.type.includes('login') ||
               action.type.includes('logout') ||
               action.type.includes('error');
      }
    })
  ]
});
```

## 🔧 高级功能

### 自定义日志处理器
```javascript
const app = createApp({
  plugins: [
    logger({
      // 自定义日志处理
      onLog: (log) => {
        // 发送到远程日志服务
        fetch('/api/logs', {
          method: 'POST',
          body: JSON.stringify(log)
        });
        
        // 保存到本地存储
        localStorage.setItem('logs', JSON.stringify([...logs, log]));
      }
    })
  ]
});
```

### 日志统计
```javascript
// 获取日志统计
const loggerPlugin = logger({
  onLog: (log) => {
    // 统计 action 类型
    const stats = loggerPlugin.getStats();
    console.log('Action 统计:', stats);
  }
});

// 获取统计信息
const stats = loggerPlugin.getStats();
/*
{
  total: 150,
  types: {
    'counter/increment': 45,
    'user/login': 5,
    'todos/add': 30,
    // ...
  },
  averageDuration: 2.5,
  errors: 2
}
*/
```

### 日志导出
```javascript
// 导出日志
const exportLogs = () => {
  const logs = loggerPlugin.getLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
```

## 🎨 最佳实践

### 1. 环境配置
```javascript
// 根据环境配置日志
const loggerConfig = process.env.NODE_ENV === 'production' 
  ? { collapsed: true, level: 'warn' }
  : { collapsed: false, level: 'log', diff: true };

const app = createApp({
  plugins: [logger(loggerConfig)]
});
```

### 2. 性能优化
```javascript
// 使用 diff 只记录必要的状态变化
const app = createApp({
  plugins: [
    logger({
      diff: true,
      stateFilter: (state) => {
        // 只记录关键状态
        const { user, counter } = state;
        return { user, counter };
      }
    })
  ]
});
```

### 3. 错误处理
```javascript
// 记录错误堆栈
const app = createApp({
  plugins: [
    logger({
      errorTransformer: (error) => ({
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      })
    })
  ]
});
```

## 🚀 版本历史

- **v1.1.1** - 修复类型定义问题
- **v1.1.0** - 添加 GUI 集成功能
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](https://github.com/perlinson/modernx)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**📝 让 ModernX 开发更加透明！**
