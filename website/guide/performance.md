# 性能优化

ModernX 提供了多种性能优化策略，确保应用的高效运行。

## 状态优化

### 1. 状态结构设计
```javascript
// ✅ 好的做法 - 扁平化状态
const state = {
  users: {
    byId: {},
    allIds: []
  },
  posts: {
    byId: {},
    allIds: []
  }
};

// ❌ 避免的做法 - 深度嵌套
const state = {
  data: {
    users: {
      list: [],
      details: {}
    },
    posts: {
      list: [],
      details: {}
    }
  }
};
```

### 2. 使用 Reselect 进行记忆化
```javascript
import { createSelector } from 'reselect';

const selectUsers = state => state.users.byId;
const selectUserIds = state => state.users.allIds;

const selectUsersList = createSelector(
  [selectUsers, selectUserIds],
  (users, ids) => ids.map(id => users[id])
);

const selectActiveUsers = createSelector(
  [selectUsersList],
  users => users.filter(user => user.active)
);
```

### 3. 避免不必要的对象创建
```javascript
// ✅ 好的做法
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.id]: action.payload
        }
      };
    default:
      return state;
  }
};

// ❌ 避免的做法
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          [action.payload.id]: action.payload
        })
      });
    default:
      return state;
  }
};
```

## 组件优化

### 1. 使用 React.memo
```javascript
import React from 'react';
import { connect } from 'modernx';

const UserList = ({ users }) => {
  return (
    <div>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  users: selectUsersList(state)
});

export default connect(mapStateToProps)(React.memo(UserList));
```

### 2. 优化 connect 的选择器
```javascript
import { createSelector } from 'reselect';

const makeMapStateToProps = () => {
  const selectUserById = createSelector(
    [state => state.users.byId, (state, userId) => userId],
    (users, userId) => users[userId]
  );
  
  return (state, ownProps) => ({
    user: selectUserById(state, ownProps.userId)
  });
};

export default connect(makeMapStateToProps)(UserComponent);
```

### 3. 使用 useCallback 和 useMemo
```javascript
import React, { useCallback, useMemo } from 'react';
import { connect } from 'modernx';

const TodoList = ({ todos, dispatch }) => {
  const handleToggle = useCallback((id) => {
    dispatch({ type: 'todos/toggle', payload: id });
  }, [dispatch]);
  
  const handleDelete = useCallback((id) => {
    dispatch({ type: 'todos/delete', payload: id });
  }, [dispatch]);
  
  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => a.createdAt - b.createdAt);
  }, [todos]);
  
  return (
    <div>
      {sortedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default connect(({ todos }) => ({ todos }))(TodoList);
```

## Effect 优化

### 1. 避免重复的异步调用
```javascript
// ✅ 好的做法 - 使用 takeLatest
function* watchFetchUser() {
  yield takeLatest('FETCH_USER', fetchUser);
}

// ✅ 好的做法 - 使用 takeLeading
function* watchCreateUser() {
  yield takeLeading('CREATE_USER', createUser);
}

// ❌ 避免的做法 - 重复调用
function* fetchUser({ payload }, { call, put }) {
  // 没有防重复机制
  const user = yield call(api.fetchUser, payload);
  yield put({ type: 'SET_USER', payload: user });
}
```

### 2. 使用缓存
```javascript
const cache = new Map();

function* fetchUserWithCache({ payload }, { call, put }) {
  const cacheKey = `user_${payload}`;
  
  if (cache.has(cacheKey)) {
    yield put({ type: 'SET_USER', payload: cache.get(cacheKey) });
    return;
  }
  
  try {
    const user = yield call(api.fetchUser, payload);
    cache.set(cacheKey, user);
    yield put({ type: 'SET_USER', payload: user });
  } catch (error) {
    yield put({ type: 'FETCH_ERROR', payload: error });
  }
}
```

### 3. 批量操作
```javascript
function* fetchMultipleUsers({ payload }, { call, put, all }) {
  yield put({ type: 'SET_LOADING', payload: true });
  
  try {
    const [users, posts, comments] = yield all([
      call(api.fetchUsers, payload.userIds),
      call(api.fetchPosts, payload.postIds),
      call(api.fetchComments, payload.commentIds)
    ]);
    
    yield put({ type: 'SET_DATA', payload: { users, posts, comments } });
  } finally {
    yield put({ type: 'SET_LOADING', payload: false });
  }
}
```

## 渲染优化

### 1. 虚拟化长列表
```javascript
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UserItem user={items[index]} />
    </div>
  );
  
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
    >
      {Row}
    </List>
  );
};
```

### 2. 懒加载组件
```javascript
import React, { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyComponent />
  </Suspense>
);
```

### 3. 使用 React 18 并发特性
```javascript
import { useTransition, useDeferredValue } from 'react';

function SearchComponent() {
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const handleSearch = (value) => {
    startTransition(() => {
      setSearchTerm(value);
    });
  };
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <div>Searching...</div>}
      <SearchResults query={deferredSearchTerm} />
    </div>
  );
}
```

## 内存优化

### 1. 清理订阅
```javascript
function* watchData() {
  let channel;
  
  try {
    channel = yield call(createWebSocketChannel);
    
    while (true) {
      const data = yield take(channel);
      yield put({ type: 'DATA_RECEIVED', payload: data });
    }
  } finally {
    if (channel) {
      channel.close();
    }
  }
}
```

### 2. 避免内存泄漏
```javascript
useEffect(() => {
  const subscription = store.subscribe(handleStateChange);
  
  return () => {
    subscription.unsubscribe();
  };
}, []);
```

### 3. 使用 WeakMap
```javascript
const weakCache = new WeakMap();

function getCachedData(key) {
  if (weakCache.has(key)) {
    return weakCache.get(key);
  }
  
  const data = expensiveCalculation(key);
  weakCache.set(key, data);
  return data;
}
```

## 监控和分析

### 1. 性能监控
```javascript
const performancePlugin = {
  onAction: (action, state) => {
    const start = performance.now();
    
    return (next) => (nextAction) => {
      const result = next(nextAction);
      const end = performance.now();
      
      console.log(`Action ${action.type} took ${end - start}ms`);
      return result;
    };
  }
};
```

### 2. React DevTools Profiler
```javascript
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log(`${id} ${phase} took ${actualDuration}ms`);
};

const App = () => (
  <Profiler id="App" onRender={onRenderCallback}>
    <MyComponent />
  </Profiler>
);
```

### 3. Bundle 分析
```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    })
  ]
};
```

## 最佳实践

1. **测量性能** - 先测量再优化
2. **避免过早优化** - 在性能瓶颈出现时再优化
3. **使用工具** - 利用 React DevTools 和性能分析工具
4. **保持简单** - 简单的代码通常性能更好
5. **定期审查** - 定期检查和优化性能
