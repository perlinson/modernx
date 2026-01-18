# 测试

ModernX 提供了完整的测试支持，包括单元测试、集成测试和端到端测试。

## 测试工具

### Jest
推荐使用 Jest 进行单元测试：

```javascript
// setupTests.js
import 'jest-dom/extend-expect';

// Mock ModernX store
jest.mock('modernx', () => ({
  createApp: jest.fn(),
  connect: jest.fn()
}));
```

### React Testing Library
用于组件测试：

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createApp } from 'modernx';
import MyComponent from './MyComponent';

const app = createApp({
  models: [
    {
      namespace: 'counter',
      state: { count: 0 },
      reducers: {
        increment: (state) => ({ count: state.count + 1 })
      }
    }
  ]
});

const store = app._store;

test('should increment counter', () => {
  render(
    <Provider store={store}>
      <MyComponent />
    </Provider>
  );
  
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

## 测试 Model

### 测试 Reducer
```javascript
// models/counter.test.js
import counterModel from './counter';

describe('counterModel reducers', () => {
  it('should handle increment', () => {
    const state = { count: 0 };
    const action = { type: 'counter/increment', payload: 1 };
    const newState = counterModel.reducers.increment(state, action);
    
    expect(newState.count).toBe(1);
  });
  
  it('should handle decrement', () => {
    const state = { count: 1 };
    const action = { type: 'counter/decrement', payload: 1 };
    const newState = counterModel.reducers.decrement(state, action);
    
    expect(newState.count).toBe(0);
  });
});
```

### 测试 Effect
```javascript
// models/user.test.js
import userModel from './user';

describe('userModel effects', () => {
  let gen, put, call;
  
  beforeEach(() => {
    put = jest.fn();
    call = jest.fn();
  });
  
  it('should handle login effect', async () => {
    const mockUser = { id: 1, name: 'John' };
    call.mockResolvedValue(mockUser);
    
    gen = userModel.effects.login(
      { payload: { username: 'john', password: '123456' } },
      { put, call }
    );
    
    expect(gen.next().value).toEqual(
      put({ type: 'user/setLoading', payload: true })
    );
    
    expect(call).toHaveBeenCalledWith(api.login, {
      username: 'john',
      password: '123456'
    });
    
    const result = gen.next(mockUser).value;
    expect(result).toEqual(
      put({ type: 'user/setUser', payload: mockUser })
    );
    
    expect(gen.next().value).toEqual(
      put({ type: 'user/setLoading', payload: false })
    );
    
    expect(gen.next().done).toBe(true);
  });
});
```

## 测试组件

### 测试 Connected 组件
```javascript
// components/Counter.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createApp } from 'modernx';
import Counter from './Counter';

const createTestStore = (initialState = {}) => {
  const app = createApp({
    models: [
      {
        namespace: 'counter',
        state: { count: 0, ...initialState },
        reducers: {
          increment: (state) => ({ count: state.count + 1 }),
          decrement: (state) => ({ count: state.count - 1 })
        }
      }
    ]
  });
  return app._store;
};

test('should render counter with initial state', () => {
  const store = createTestStore({ count: 5 });
  
  render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );
  
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});

test('should dispatch increment action', () => {
  const store = createTestStore();
  
  render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );
  
  fireEvent.click(screen.getByText('+'));
  expect(store.getState().counter.count).toBe(1);
});
```

### 测试 Hooks
```javascript
// hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createApp } from 'modernx';
import useCounter from './useCounter';

const wrapper = ({ children }) => {
  const app = createApp({
    models: [
      {
        namespace: 'counter',
        state: { count: 0 },
        reducers: {
          increment: (state) => ({ count: state.count + 1 })
        }
      }
    ]
  });
  
  return <Provider store={app._store}>{children}</Provider>;
};

test('should use counter hook', () => {
  const { result } = renderHook(() => useCounter(), { wrapper });
  
  expect(result.current.count).toBe(0);
  
  act(() => {
    result.current.increment();
  });
  
  expect(result.current.count).toBe(1);
});
```

## 集成测试

### 测试完整流程
```javascript
// integration/app.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createApp } from 'modernx';
import App from '../App';

const createTestApp = () => {
  const app = createApp({
    models: [
      {
        namespace: 'todos',
        state: { items: [], loading: false },
        reducers: {
          setTodos: (state, { payload }) => ({ ...state, items: payload }),
          setLoading: (state, { payload }) => ({ ...state, loading: payload })
        },
        effects: {
          *fetchTodos({ payload }, { put, call }) {
            yield put({ type: 'todos/setLoading', payload: true });
            
            try {
              const todos = yield call(api.fetchTodos, payload);
              yield put({ type: 'todos/setTodos', payload: todos });
            } finally {
              yield put({ type: 'todos/setLoading', payload: false });
            }
          }
        }
      }
    ]
  });
  
  return app._store;
};

test('should fetch and display todos', async () => {
  const mockTodos = [
    { id: 1, text: 'Learn ModernX', completed: false },
    { id: 2, text: 'Build amazing apps', completed: false }
  ];
  
  jest.spyOn(api, 'fetchTodos').mockResolvedValue(mockTodos);
  
  const store = createTestApp();
  
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  
  // 初始状态
  expect(screen.getByText('Loading...')).toBeInTheDocument();
  
  // 等待数据加载
  await waitFor(() => {
    expect(screen.getByText('Learn ModernX')).toBeInTheDocument();
    expect(screen.getByText('Build amazing apps')).toBeInTheDocument();
  });
  
  // 验证 API 被调用
  expect(api.fetchTodos).toHaveBeenCalledTimes(1);
});
```

## Mock 和 Stub

### Mock API
```javascript
// __mocks__/api.js
export const fetchTodos = jest.fn(() =>
  Promise.resolve([
    { id: 1, text: 'Mock todo', completed: false }
  ])
);

export const createTodo = jest.fn((todo) =>
  Promise.resolve({ ...todo, id: Date.now() })
);
```

### Mock Store
```javascript
// utils/testStore.js
import { createStore } from 'redux';
import rootReducer from '../reducers';

export const createMockStore = (initialState = {}) => {
  return createStore(rootReducer, initialState);
};
```

## 测试配置

### Jest 配置
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 测试脚本
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

## 最佳实践

1. **测试隔离** - 每个测试应该独立运行
2. **描述性命名** - 测试名称应该清楚描述测试内容
3. **测试覆盖率** - 保持高测试覆盖率
4. **Mock 外部依赖** - 隔离外部 API 和服务
5. **测试用户行为** - 测试用户实际使用场景
