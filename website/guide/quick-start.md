# 快速开始

## 🎮 创建第一个 ModernX 应用

### 1. 项目初始化

```bash
# 使用 Create React App
npx create-react-app my-modernx-app --template typescript
cd my-modernx-app

# 安装 ModernX
npm install modernx
```

### 2. 创建 Model

在 `src/models/` 目录下创建 `count.ts`：

```typescript
// src/models/count.ts
export default {
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1; },
    minus(state) { return state - 1; }
  },
  effects: {
    *asyncAdd({ payload }, { put }) {
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield put({ type: 'add', payload });
    }
  }
};
```

### 3. 创建应用

在 `src/` 目录下创建 `app.ts`：

```typescript
// src/app.ts
import { createApp } from 'modernx';
import countModel from './models/count';

const app = createApp({
  models: [countModel]
});

export default app;
```

### 4. 启动应用

修改 `src/index.tsx`：

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import app from './app';

// 启动应用
app.start('#root');

// 渲染根组件
const Root = () => (
  <div>
    <h1>Hello ModernX!</h1>
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Root />);
```

### 5. 连接组件

创建 `src/components/Counter.tsx`：

```typescript
// src/components/Counter.tsx
import React from 'react';
import { connect } from 'modernx';

interface CounterProps {
  count: number;
  add: () => void;
  minus: () => void;
  asyncAdd: () => void;
}

const Counter: React.FC<CounterProps> = ({ count, add, minus, asyncAdd }) => (
  <div>
    <h2>计数器: {count}</h2>
    <button onClick={add}>+</button>
    <button onClick={minus}>-</button>
    <button onClick={asyncAdd}>异步 +1</button>
  </div>
);

export default connect(
  ({ count }) => ({ count }),
  ({ add, minus, asyncAdd }) => ({ add, minus, asyncAdd })
)(Counter);
```

修改 `src/index.tsx`：

```typescript
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import app from './app';
import Counter from './components/Counter';

// 启动应用
app.start('#root');

// 渲染根组件
const Root = () => (
  <div style={{ padding: '20px' }}>
    <h1>Hello ModernX!</h1>
    <Counter />
  </div>
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<Root />);
```

### 6. 运行应用

```bash
# 启动开发服务器
npm start

# 访问 http://localhost:3000
```

## 🎯 核心概念

### Model 结构

Model 是 ModernX 的核心概念，包含：

```typescript
{
  namespace: 'namespace',    // 命名空间，避免命名冲突
  state: initialState,        // 初始状态
  reducers: {                 // 同步操作
    add(state) { return state + 1; }
  },
  effects: {                  // 异步操作
    *asyncAdd({ payload }, { put }) {
      // 异步逻辑
      yield put({ type: 'add', payload });
    }
  },
  subscriptions: {            // 订阅外部数据源
    setup({ dispatch }) {
      // 订阅逻辑
    }
  }
}
```

### Connect 组件

使用 `connect` 连接组件和 Model：

```typescript
// 方式一：对象形式
connect(
  ({ count }) => ({ count }),
  ({ add, minus }) => ({ add, minus })
)(Component);

// 方式二：函数形式
connect(
  (state, ownProps) => ({
    count: state.count,
    ...ownProps
  }),
  (dispatch, ownProps) => ({
    add: () => dispatch({ type: 'add' }),
    ...ownProps
  })
)(Component);
```

## 🚀 React 18 并发特性

ModernX 提供了 React 18 并发特性的封装：

### useDvaTransition

```typescript
import { useDvaTransition } from 'modernx/react18-utils';

const MyComponent = () => {
  const [isPending, startTransition] = useDvaTransition();
  
  const handleClick = () => {
    startTransition(() => {
      // 非阻塞状态更新
      dispatch({ type: 'heavyOperation' });
    });
  };
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? '处理中...' : '执行操作'}
    </button>
  );
};
```

### useDvaConcurrentState

```typescript
import { useDvaConcurrentState } from 'modernx/react18-utils';

const MyComponent = () => {
  const { state, deferredState } = useDvaConcurrentState('count');
  
  return (
    <div>
      <p>当前状态: {state}</p>
      <p>延迟状态: {deferredState}</p>
    </div>
  );
};
```

## 📦 完整示例

### Todo List 应用

```typescript
// src/models/todo.ts
export default {
  namespace: 'todo',
  state: {
    items: [],
    filter: 'all'
  },
  reducers: {
    add(state, { payload }) {
      return {
        ...state,
        items: [...state.items, { id: Date.now(), text: payload, done: false }]
      };
    },
    toggle(state, { payload }) {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === payload ? { ...item, done: !item.done } : item
        )
      };
    },
    setFilter(state, { payload }) {
      return { ...state, filter: payload };
    }
  },
  effects: {
    *loadTodos(_, { put }) {
      // 模拟 API 调用
      const todos = yield fetch('/api/todos').then(res => res.json());
      yield put({ type: 'load', payload: todos });
    }
  }
};
```

```typescript
// src/components/TodoList.tsx
import React from 'react';
import { connect } from 'modernx';

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

interface TodoListProps {
  items: TodoItem[];
  add: (text: string) => void;
  toggle: (id: number) => void;
  loadTodos: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ items, add, toggle, loadTodos }) => {
  const [input, setInput] = React.useState('');
  
  React.useEffect(() => {
    loadTodos();
  }, [loadTodos]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      add(input.trim());
      setInput('');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="添加待办事项"
        />
        <button type="submit">添加</button>
      </form>
      
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item.id)}
            />
            <span style={{ textDecoration: item.done ? 'line-through' : 'none' }}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default connect(
  ({ todo: { items } }) => ({ items }),
  ({ add, toggle, loadTodos }) => ({ add, toggle, loadTodos })
)(TodoList);
```

## 🎯 下一步

现在你已经掌握了 ModernX 的基本用法：

- [核心概念](/guide/concepts) - 深入理解 Models、Effects 等
- [API 参考](/api/) - 查看详细的 API 文档
- [示例](/examples/) - 查看更多实际项目示例
- [React 18 特性](/guide/react18-features) - 学习并发特性使用

## 💡 最佳实践

1. **Model 设计**: 保持 Model 简单，复杂逻辑放在 Effects 中
2. **组件连接**: 使用 connect 连接组件和状态
3. **异步处理**: 使用 Effects 处理异步操作
4. **类型安全**: TypeScript 项目充分利用类型提示
5. **性能优化**: 合理使用 React 18 并发特性

开始构建你的 ModernX 应用吧！
