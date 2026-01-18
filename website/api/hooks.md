# Hooks

ModernX 提供了多个 React Hooks 来简化状态管理和组件开发。

## useModernX

获取 ModernX store 和 dispatch 函数。

```javascript
import { useModernX } from 'modernx';

function MyComponent() {
  const { store, dispatch } = useModernX();
  
  const handleClick = () => {
    dispatch({ type: 'increment', payload: 1 });
  };
  
  return (
    <div>
      <p>Count: {store.getState().counter}</p>
      <button onClick={handleClick}>+</button>
    </div>
  );
}
```

## useModernXSelector

选择器 Hook，用于订阅状态的一部分。

```javascript
import { useModernXSelector } from 'modernx';

function UserComponent() {
  const user = useModernXSelector(state => state.user.currentUser);
  const loading = useModernXSelector(state => state.user.loading);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Welcome, {user.name}!</div>;
}
```

## useModernXDispatch

获取 dispatch 函数的 Hook。

```javascript
import { useModernXDispatch } from 'modernx';

function ActionButtons() {
  const dispatch = useModernXDispatch();
  
  const handleLogin = () => {
    dispatch({ type: 'user/login', payload: { username: 'admin' }});
  };
  
  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
  };
  
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## useModernXTransition

React 18 的 useTransition Hook 集成。

```javascript
import { useModernXTransition } from 'modernx/react18';

function SearchComponent() {
  const [isPending, startTransition] = useModernXTransition();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (value) => {
    startTransition(() => {
      setSearchTerm(value);
      dispatch({ type: 'search', payload: value });
    });
  };
  
  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <div>Searching...</div>}
    </div>
  );
}
```

## useModernXDeferredValue

React 18 的 useDeferredValue Hook 集成。

```javascript
import { useModernXDeferredValue } from 'modernx/react18';

function ExpensiveList({ items }) {
  const deferredItems = useModernXDeferredValue(items);
  
  return (
    <div>
      {deferredItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## 自定义 Hooks 示例

### useModel
创建一个 Hook 来访问特定模型的状态。

```javascript
import { useModernXSelector } from 'modernx';

export function useModel(namespace) {
  const modelState = useModernXSelector(state => state[namespace]);
  const dispatch = useModernXDispatch();
  
  return {
    ...modelState,
    dispatch
  };
}

// 使用
function UserComponent() {
  const { currentUser, loading, dispatch } = useModel('user');
  
  const handleLogin = (credentials) => {
    dispatch({ type: 'user/login', payload: credentials });
  };
  
  return (
    <div>
      {loading ? 'Loading...' : `Welcome, ${currentUser?.name}`}
      <button onClick={() => handleLogin({ username: 'admin' })}>
        Login
      </button>
    </div>
  );
}
```

### useAsyncAction
创建一个 Hook 来处理异步操作。

```javascript
import { useState, useCallback } from 'react';
import { useModernXDispatch } from 'modernx';

export function useAsyncAction(actionType) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useModernXDispatch();
  
  const execute = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    
    try {
      await dispatch({ type: actionType, payload });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [actionType, dispatch]);
  
  return { execute, loading, error };
}

// 使用
function LoginComponent() {
  const { execute: login, loading, error } = useAsyncAction('user/login');
  
  const handleSubmit = async (credentials) => {
    await login(credentials);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### useLocalStorage
创建一个 Hook 来同步状态到 localStorage。

```javascript
import { useEffect, useState } from 'react';
import { useModernXSelector, useModernXDispatch } from 'modernx';

export function useLocalStorage(key, namespace, defaultValue = null) {
  const state = useModernXSelector(state => state[namespace]);
  const dispatch = useModernXDispatch();
  
  // 从 localStorage 读取初始值
  const [localValue, setLocalValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return defaultValue;
    }
  });
  
  // 同步到 localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }, [key, state]);
  
  // 从 localStorage 恢复状态
  useEffect(() => {
    if (localValue !== null) {
      dispatch({ type: `${namespace}/setState`, payload: localValue });
    }
  }, []);
  
  return state;
}

// 使用
function SettingsComponent() {
  const settings = useLocalStorage('app-settings', 'settings', {
    theme: 'light',
    language: 'en'
  });
  
  const dispatch = useModernXDispatch();
  
  const updateTheme = (theme) => {
    dispatch({ type: 'settings/setTheme', payload: theme });
  };
  
  return (
    <div>
      <select 
        value={settings.theme} 
        onChange={(e) => updateTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

## Hooks 最佳实践

### 1. 选择器优化
```javascript
// ✅ 好的做法 - 使用 createSelector
import { createSelector } from 'reselect';

const selectActiveUsers = createSelector(
  [state => state.users.byId, state => state.users.activeIds],
  (users, activeIds) => activeIds.map(id => users[id])
);

function ActiveUsersList() {
  const activeUsers = useModernXSelector(selectActiveUsers);
  return <div>{activeUsers.map(user => user.name)}</div>;
}

// ❌ 避免的做法 - 每次都创建新函数
function UsersList() {
  const users = useModernXSelector(state => 
    state.users.activeIds.map(id => state.users.byId[id])
  );
  return <div>{users.map(user => user.name)}</div>;
}
```

### 2. 避免过度订阅
```javascript
// ✅ 好的做法 - 只订阅需要的状态
function UserAvatar() {
  const avatar = useModernXSelector(state => state.user.currentUser.avatar);
  return <img src={avatar} alt="User avatar" />;
}

// ❌ 避免的做法 - 订阅整个状态
function UserAvatar() {
  const user = useModernXSelector(state => state.user);
  return <img src={user.currentUser.avatar} alt="User avatar" />;
}
```

### 3. 使用 useCallback 优化
```javascript
// ✅ 好的做法
function UserActions() {
  const dispatch = useModernXDispatch();
  
  const handleLogin = useCallback((credentials) => {
    dispatch({ type: 'user/login', payload: credentials });
  }, [dispatch]);
  
  const handleLogout = useCallback(() => {
    dispatch({ type: 'user/logout' });
  }, [dispatch]);
  
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

## TypeScript 支持

```typescript
import { useModernXSelector, useModernXDispatch } from 'modernx';

interface RootState {
  user: {
    currentUser: User | null;
    loading: boolean;
  };
  counter: number;
}

// 类型安全的选择器
function useTypedSelector<T>(selector: (state: RootState) => T): T {
  return useModernXSelector(selector);
}

// 使用
function UserComponent() {
  const user = useTypedSelector(state => state.user.currentUser);
  const loading = useTypedSelector(state => state.user.loading);
  
  return (
    <div>
      {loading ? 'Loading...' : `Hello, ${user?.name}`}
    </div>
  );
}
```

## 注意事项

1. **性能考虑** - 避免在 render 中创建新的选择器函数
2. **订阅优化** - 只订阅需要的状态片段
3. **内存泄漏** - 确保正确清理副作用
4. **类型安全** - 使用 TypeScript 提供类型检查
5. **测试友好** - 编写可测试的自定义 Hooks
