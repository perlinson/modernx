/**
 * dva-react18 React 18 并发特性演示应用
 * 展示 React 18 与 dva 框架的集成
 */

import { createApp } from 'dva-react18';
import { useDvaTransition, useDvaConcurrentState, batchUpdates } from 'dva-react18';

// 创建 dva 应用实例
const app = createApp({
  // 应用配置
});

// 注册模型 - 计数器
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

// 注册模型 - 搜索
app.model({
  namespace: 'search',
  state: {
    query: '',
    results: []
  },
  reducers: {
    updateQuery(state, { payload }) {
      return {
        ...state,
        query: payload
      };
    },
    updateResults(state, { payload }) {
      return {
        ...state,
        results: payload
      };
    },
  },
  effects: {
    *searchAsync({ payload }, { call, put }) {
      // 模拟搜索 API 调用
      const results = yield call(searchAPI, payload);
      yield put({ type: 'updateResults', payload: results });
    },
  },
});

// 模拟搜索 API
function searchAPI(query) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`
      ]);
    }, 500);
  });
}

// 启动应用
export default app;

// React 18 并发特性工具
export { useDvaTransition, useDvaConcurrentState, batchUpdates };
