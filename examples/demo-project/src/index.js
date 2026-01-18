// 简化版本测试应用
import modernx from 'modernx';

console.log('🚀 启动 ModernX 测试应用...');

// 创建简单的用户模型
const userModel = {
  namespace: 'user',
  state: {
    currentUser: null,
    loading: false,
    loginHistory: []
  },
  
  effects: {
    *login({ payload }, { put }) {
      yield put({ type: 'setLoading', payload: true });
      
      // 模拟登录
      yield new Promise(resolve => setTimeout(resolve, 1000));
      
      if (payload.username === 'admin' && payload.password === '123456') {
        const user = {
          id: 1,
          name: '管理员',
          email: 'admin@example.com',
          role: 'admin'
        };
        yield put({ type: 'setUser', payload: user });
        yield put({ type: 'addToHistory', payload: { action: 'login', timestamp: Date.now() } });
      } else {
        yield put({ type: 'setError', payload: '登录失败' });
      }
      
      yield put({ type: 'setLoading', payload: false });
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
    },
    addToHistory(state, { payload }) {
      return { ...state, loginHistory: [...state.loginHistory, payload].slice(-5) };
    }
  }
};

// 创建计数器模型
const counterModel = {
  namespace: 'counter',
  state: {
    count: 0,
    history: []
  },
  
  effects: {
    *incrementAsync({ payload }, { put, select }) {
      const currentCount = yield select(state => state.counter.count);
      yield put({ type: 'increment', payload: payload || 1 });
      yield put({ type: 'addToHistory', payload: { action: 'increment', value: currentCount + 1, timestamp: Date.now() } });
    }
  },
  
  reducers: {
    increment(state, { payload = 1 }) {
      return { ...state, count: state.count + payload };
    },
    decrement(state, { payload = 1 }) {
      return { ...state, count: state.count - payload };
    },
    addToHistory(state, { payload }) {
      return { ...state, history: [...state.history, payload].slice(-10) };
    }
  }
};

// 创建应用
const app = modernx({
  models: [userModel, counterModel],
  
  initialState: {
    app: {
      name: 'ModernX GUI 测试应用',
      version: '1.0.0',
      startTime: new Date().toISOString()
    }
  }
});

const store = app._store;

// 模拟操作
async function simulateActions() {
  console.log('🎭 开始模拟操作...');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 计数器操作
  console.log('📊 计数器操作...');
  store.dispatch({ type: 'counter/increment', payload: 5 });
  await new Promise(resolve => setTimeout(resolve, 500));
  store.dispatch({ type: 'counter/incrementAsync', payload: 3 });
  await new Promise(resolve => setTimeout(resolve, 500));
  store.dispatch({ type: 'counter/decrement', payload: 2 });
  
  // 用户登录
  console.log('� 用户登录...');
  store.dispatch({ type: 'user/login', payload: { username: 'admin', password: '123456' } });
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 更多计数器操作
  console.log('🔢 更多计数器操作...');
  for (let i = 0; i < 3; i++) {
    store.dispatch({ type: 'counter/incrementAsync' });
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log('✅ 操作完成！');
  console.log('📊 最终状态:');
  console.log(JSON.stringify(store.getState(), null, 2));
}

// 启动模拟
simulateActions();

// 定期更新
setInterval(() => {
  if (Math.random() > 0.8) {
    store.dispatch({ type: 'counter/increment', payload: 1 });
  }
}, 2000);

console.log('🚀 测试应用已启动！');
console.log('💡 在另一个终端运行 GUI 查看状态:');
console.log('   node ../bin/modernx-gui-simple');

export default app;