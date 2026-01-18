# Effects

Effects 是 ModernX 中处理异步操作和副作用的机制，基于 Redux-Saga 实现。

## 语法

```javascript
effects: {
  *effectName({ payload }, { put, call, select, take, race, fork, cancel }) {
    // 异步操作逻辑
  }
}
```

## 参数

### 第一个参数 - Action Object

| 属性 | 类型 | 描述 |
|------|------|------|
| type | String | Action 类型 |
| payload | Any | 携带的数据 |

### 第二个参数 - Effects Helpers

| Helper | 描述 |
|--------|------|
| put | 分发 action |
| call | 调用函数 |
| select | 选择状态 |
| take | 等待 action |
| race | 竞争执行 |
| fork | 非阻塞调用 |
| cancel | 取消任务 |
| all | 并行执行 |

## 基础用法

### 1. 调用 API
```javascript
{
  effects: {
    *fetchUser({ payload }, { put, call }) {
      try {
        const user = yield call(api.fetchUser, payload);
        yield put({ type: 'setUser', payload: user });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
      }
    }
  }
}
```

### 2. 选择状态
```javascript
{
  effects: {
    *updateUser({ payload }, { put, select }) {
      const currentUser = yield select(state => state.user.currentUser);
      
      if (!currentUser) {
        return;
      }
      
      const updatedUser = { ...currentUser, ...payload };
      yield put({ type: 'setUser', payload: updatedUser });
    }
  }
}
```

### 3. 等待 Action
```javascript
{
  effects: {
    *watchUserAction() {
      while (true) {
        const action = yield take('user/submit');
        yield put({ type: 'processUser', payload: action.payload });
      }
    }
  }
}
```

## 高级用法

### 1. 并行执行
```javascript
{
  effects: {
    *fetchMultipleData({ payload }, { put, all }) {
      const [users, posts, comments] = yield all([
        call(api.fetchUsers),
        call(api.fetchPosts),
        call(api.fetchComments)
      ]);
      
      yield put({ type: 'setData', payload: { users, posts, comments }});
    }
  }
}
```

### 2. 竞争执行
```javascript
{
  effects: {
    *fetchWithTimeout({ payload }, { put, race, call }) {
      const { data, timeout } = yield race({
        data: call(api.fetchData, payload),
        timeout: call(delay, 5000)
      });
      
      if (data) {
        yield put({ type: 'setData', payload: data });
      } else {
        yield put({ type: 'setError', payload: 'Request timeout' });
      }
    }
  }
}
```

### 3. 非阻塞调用
```javascript
{
  effects: {
    *startBackgroundTask({ payload }, { fork }) {
      yield fork(backgroundTask, payload);
      yield put({ type: 'taskStarted', payload });
    }
  }
}
```

### 4. 取消任务
```javascript
{
  effects: {
    *watchRequest() {
      let task;
      
      while (true) {
        const action = yield take('FETCH_DATA');
        
        if (task) {
          yield cancel(task);
        }
        
        task = yield fork(fetchData, action.payload);
      }
    }
  }
}
```

## 实际示例

### 1. 用户登录流程
```javascript
{
  effects: {
    *login({ payload }, { put, call, select }) {
      const { username, password } = payload;
      
      // 设置加载状态
      yield put({ type: 'setLoading', payload: true });
      
      try {
        // 调用登录 API
        const response = yield call(api.login, { username, password });
        
        // 检查登录结果
        if (response.success) {
          // 保存用户信息
          yield put({ type: 'setUser', payload: response.user });
          
          // 保存 token
          yield put({ type: 'setToken', payload: response.token });
          
          // 记录登录历史
          yield put({ type: 'addToHistory', payload: {
            action: 'login',
            timestamp: Date.now(),
            success: true
          }});
          
          // 跳转到首页
          yield put({ type: 'router/push', payload: '/' });
        } else {
          // 登录失败
          yield put({ type: 'setError', payload: response.message });
        }
      } catch (error) {
        // 网络错误
        yield put({ type: 'setError', payload: 'Network error' });
        
        // 记录失败历史
        yield put({ type: 'addToHistory', payload: {
          action: 'login',
          timestamp: Date.now(),
          success: false,
          error: error.message
        }});
      } finally {
        // 清除加载状态
        yield put({ type: 'setLoading', payload: false });
      }
    }
  }
}
```

### 2. 数据同步
```javascript
{
  effects: {
    *syncData({ payload }, { put, call, select, race, take }) {
      const { syncId } = payload;
      
      // 开始同步
      yield put({ type: 'setSyncStatus', payload: { syncId, status: 'syncing' }});
      
      try {
        // 竞争：同步完成 vs 用户取消
        const { result, cancelled } = yield race({
          result: call(api.syncData, payload),
          cancelled: take('sync/cancel')
        });
        
        if (cancelled) {
          // 用户取消同步
          yield put({ type: 'setSyncStatus', payload: { syncId, status: 'cancelled' }});
        } else if (result) {
          // 同步成功
          yield put({ type: 'updateData', payload: result.data });
          yield put({ type: 'setSyncStatus', payload: { syncId, status: 'completed' }});
        }
      } catch (error) {
        // 同步失败
        yield put({ type: 'setSyncStatus', payload: { 
          syncId, 
          status: 'failed',
          error: error.message 
        }});
      }
    }
  }
}
```

### 3. 实时数据订阅
```javascript
{
  effects: {
    *subscribeToUpdates({ payload }, { put, call, fork, cancel }) {
      const { channelId } = payload;
      
      // 创建 WebSocket 连接
      const socket = yield call(createWebSocket, channelId);
      
      // 监听消息
      const messageTask = yield fork(function* () {
        while (true) {
          const message = yield take(socket, 'message');
          yield put({ type: 'updateData', payload: message.data });
        }
      });
      
      // 监听断开连接
      const disconnectTask = yield fork(function* () {
        yield take(socket, 'disconnect');
        yield put({ type: 'setConnectionStatus', payload: 'disconnected' });
      });
      
      // 等待取消订阅
      yield take('unsubscribe');
      
      // 清理任务
      yield cancel(messageTask);
      yield cancel(disconnectTask);
      
      // 关闭连接
      socket.close();
    }
  }
}
```

## 错误处理

### 1. 全局错误处理
```javascript
{
  effects: {
    *handleApiCall({ payload }, { put, call }) {
      try {
        const result = yield call(api.call, payload);
        yield put({ type: 'setSuccess', payload: result });
      } catch (error) {
        // 记录错误
        console.error('API call failed:', error);
        
        // 分发错误 action
        yield put({ type: 'setError', payload: error.message });
        
        // 显示用户友好的错误信息
        yield put({ type: 'showNotification', payload: {
          type: 'error',
          message: '操作失败，请稍后重试'
        }});
      }
    }
  }
}
```

### 2. 重试机制
```javascript
function* retryApiCall(apiCall, payload, maxRetries = 3) {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const result = yield call(apiCall, payload);
      return result;
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        throw error;
      }
      
      // 指数退避
      const delay = Math.pow(2, retries) * 1000;
      yield call(delay, delay);
    }
  }
}

{
  effects: {
    *fetchWithRetry({ payload }, { put, call }) {
      try {
        const result = yield call(retryApiCall, api.fetchData, payload);
        yield put({ type: 'setData', payload: result });
      } catch (error) {
        yield put({ type: 'setError', payload: 'Failed after retries' });
      }
    }
  }
}
```

## 最佳实践

1. **错误处理** - 始终包含 try-catch 块
2. **加载状态** - 在异步操作中管理加载状态
3. **取消机制** - 提供取消长时间运行任务的能力
4. **类型安全** - 使用 TypeScript 提供类型检查
5. **测试友好** - 编写可测试的 effects

## 注意事项

1. **Generator 函数** - Effects 必须是 generator 函数
2. **纯函数** - Effects 不应该是纯函数，它们处理副作用
3. **错误传播** - 未捕获的错误会中断 effect 执行
4. **性能考虑** - 避免在 effects 中进行阻塞操作
