/**
 * dva-react18 应用入口
 * React 18 enhanced dva framework
 */

import { createApp } from 'dva-react18';
import { useDvaTransition } from 'dva-react18';

// 创建 dva 应用实例
const app = createApp({
  // 应用配置
});

// 注册模型
app.model({
  namespace: 'count',
  state: 0,
  reducers: {
    increment(state) {
      return state + 1;
    },
    decrement(state) {
      return state - 1;
    },
  },
  effects: {
    *incrementAsync({ payload }, { call, put }) {
      // 模拟异步操作
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield put({ type: 'increment', payload });
    },
  },
});

// 启动应用
export default app;

// React 18 并发特性示例
export function ConcurrentExample() {
  const [isPending, startTransition] = useDvaTransition();
  
  const handleClick = () => {
    startTransition(() => {
      // 这些更新会被批处理，不会阻塞 UI
      app.dispatch({ type: 'count/increment' });
      app.dispatch({ type: 'count/increment' });
    });
  };
  
  return (
    <div>
      <h1>React 18 Concurrent Features</h1>
      <button onClick={handleClick} disabled={isPending}>
        {isPending ? 'Loading...' : 'Increment (Concurrent)'}
      </button>
      <p>Click to see concurrent rendering in action!</p>
    </div>
  );
}
