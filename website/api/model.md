# Model

Model 是 ModernX 的核心概念，包含了应用的状态、 reducers、effects 和 subscriptions。

## 结构

```javascript
const model = {
  namespace: 'string',      // 命名空间
  state: {},               // 初始状态
  reducers: {},            // 同步 reducers
  effects: {},             // 异步 effects
  subscriptions: {}        // 订阅
};
```

## 属性详解

### namespace (String, 必需)

模型的命名空间，用于在全局状态中隔离数据。

```javascript
{
  namespace: 'user'
}
```

### state (Any, 必需)

模型的初始状态。

```javascript
{
  state: {
    currentUser: null,
    loading: false,
    error: null
  }
}
```

### reducers (Object, 可选)

同步状态更新函数，必须是纯函数。

```javascript
{
  reducers: {
    setUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    }
  }
}
```

### effects (Object, 可选)

异步操作和副作用处理函数，使用 generator 函数。

```javascript
{
  effects: {
    *login({ payload }, { put, call, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const user = yield call(api.login, payload);
        yield put({ type: 'setUser', payload: user });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    }
  }
}
```

### subscriptions (Object, 可选)

数据订阅，用于监听外部数据源。

```javascript
{
  subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由变化
      return history.listen(({ pathname }) => {
        dispatch({ type: 'route/change', payload: pathname });
      });
    },
    keyboard({ dispatch }) {
      // 监听键盘事件
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          dispatch({ type: 'submit' });
        }
      };
      
      window.addEventListener('keypress', handleKeyPress);
      
      return () => {
        window.removeEventListener('keypress', handleKeyPress);
      };
    }
  }
}
```

## 完整示例

```javascript
const userModel = {
  namespace: 'user',
  
  state: {
    currentUser: null,
    loading: false,
    error: null,
    loginHistory: []
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
      return {
        ...state,
        loginHistory: [...state.loginHistory, payload].slice(-10)
      };
    }
  },
  
  effects: {
    *login({ payload }, { put, call, select }) {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const user = yield call(api.login, payload);
        yield put({ type: 'setUser', payload: user });
        yield put({ type: 'addToHistory', payload: { action: 'login', timestamp: Date.now() }});
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *logout({ payload }, { put }) {
      yield put({ type: 'setUser', payload: null });
      yield put({ type: 'addToHistory', payload: { action: 'logout', timestamp: Date.now() }});
    },
    
    *updateProfile({ payload }, { put, call, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      
      if (!currentUser) {
        return;
      }
      
      try {
        const updatedUser = yield call(api.updateProfile, {
          ...currentUser,
          ...payload
        });
        
        yield put({ type: 'setUser', payload: updatedUser });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      }
    }
  },
  
  subscriptions: {
    setup({ dispatch, history }) {
      // 监听路由变化
      return history.listen(({ pathname }) => {
        if (pathname === '/profile') {
          dispatch({ type: 'loadProfile' });
        }
      });
    },
    
    websocket({ dispatch }) {
      const ws = new WebSocket('ws://localhost:3000');
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        dispatch({ type: 'websocket/message', payload: data });
      };
      
      return () => {
        ws.close();
      };
    }
  }
};
```

## 最佳实践

### 1. 命名规范
```javascript
// ✅ 好的做法
{
  namespace: 'user',
  reducers: {
    setUser: 'user/setUser',
    setLoading: 'user/setLoading'
  }
}

// ❌ 避免的做法
{
  namespace: 'user',
  reducers: {
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING'
  }
}
```

### 2. 状态结构
```javascript
// ✅ 好的做法 - 扁平化
{
  state: {
    currentUser: null,
    loading: false,
    error: null
  }
}

// ❌ 避免的做法 - 深度嵌套
{
  state: {
    data: {
      user: {
        current: null,
        loading: false,
        error: null
      }
    }
  }
}
```

### 3. Reducer 纯函数
```javascript
// ✅ 好的做法
setUser(state, { payload }) {
  return { ...state, currentUser: payload };
}

// ❌ 避免的做法
setUser(state, { payload }) {
  state.currentUser = payload; // 直接修改状态
  return state;
}
```

### 4. Effect 错误处理
```javascript
// ✅ 好的做法
*fetchData({ payload }, { put, call }) {
  try {
    const data = yield call(api.fetchData, payload);
    yield put({ type: 'setData', payload: data });
  } catch (error) {
    yield put({ type: 'setError', payload: error.message });
  }
}

// ❌ 避免的做法
*fetchData({ payload }, { put, call }) {
  const data = yield call(api.fetchData, payload);
  yield put({ type: 'setData', payload: data });
  // 没有错误处理
}
```

## 注意事项

1. **namespace 唯一性** - 确保每个模型的 namespace 在应用中唯一
2. **Reducer 纯函数** - Reducer 必须是纯函数，不能有副作用
3. **Effect 异步处理** - 使用 generator 函数处理异步操作
4. **订阅清理** - subscriptions 必须返回清理函数
5. **状态不可变** - 始终返回新的状态对象，不要修改原状态
