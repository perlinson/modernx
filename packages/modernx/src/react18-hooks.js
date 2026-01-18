/**
 * React 18 Hooks for modernx
 * 提供实际可在组件中使用的 React 18 Hooks
 */

import { useContext, useDeferredValue, useTransition, useCallback } from 'react';
import { ReactReduxContext } from 'react-redux';

// React 18 上下文
const React18Context = React.createContext(null);

// useDvaTransition Hook
export function useDvaTransition(timeoutMs = 4000) {
  const store = useContext(ReactReduxContext);
  const [isPending, startTransition] = useTransition({
    timeoutMs
  });

  const dispatch = useCallback((action) => {
    if (isPending) return;
    
    startTransition(() => {
      store.dispatch(action);
    });
  }, [store, isPending, startTransition]);

  return [isPending, dispatch];
}

// useDvaConcurrentState Hook
export function useDvaConcurrentState(namespace) {
  const store = useContext(ReactReduxContext);
  const state = store.getState();
  const namespaceState = namespace ? state[namespace] : state;
  
  // 使用 React 18 的 useDeferredValue 进行延迟渲染
  const deferredState = useDeferredValue(namespaceState);
  
  return {
    state: namespaceState,
    deferredState,
    isLoading: state.loading && state.loading[namespace]
  };
}

// useDvaLoading Hook
export function useDvaLoading(namespace) {
  const store = useContext(ReactReduxContext);
  const state = store.getState();
  const loading = state.loading || {};
  
  return {
    loading: namespace ? !!loading[namespace] : false,
    globalLoading: loading.global || false,
    loadingModels: Object.keys(loading).filter(key => loading[key])
  };
}

// batchUpdates 函数
export function batchUpdates(updates) {
  const store = useContext(ReactReduxContext);
  
  if (React.startTransition) {
    // React 18 自动批处理
    updates.forEach(update => store.dispatch(update));
  } else if (React.unstable_batchedUpdates) {
    // React 17 手动批处理
    React.unstable_batchedUpdates(() => {
      updates.forEach(update => store.dispatch(update));
    });
  } else {
    // 降级处理
    updates.forEach(update => store.dispatch(update));
  }
}

// useDvaConcurrent Hook - 综合并发特性
export function useDvaConcurrent(namespace) {
  const [isPending, startTransition] = useDvaTransition();
  const { state, deferredState, isLoading } = useDvaConcurrentState(namespace);
  const { loading, globalLoading, loadingModels } = useDvaLoading(namespace);
  
  const concurrentDispatch = useCallback((action) => {
    startTransition(() => {
      const store = useContext(ReactReduxContext);
      store.dispatch(action);
    });
  }, [startTransition]);
  
  return {
    // 状态
    state,
    deferredState,
    isLoading,
    loading,
    globalLoading,
    loadingModels,
    
    // 并发控制
    isPending,
    startTransition,
    concurrentDispatch,
    
    // 工具函数
    batchUpdates
  };
}

// 检测 React 18 可用性
export function isReact18ConcurrentAvailable() {
  return (
    typeof useTransition === 'function' &&
    typeof useDeferredValue === 'function' &&
    typeof React.startTransition === 'function'
  );
}

// Provider 组件
export function React18Provider({ children, store }) {
  return (
    <React18Context.Provider value={store}>
      {children}
    </React18Context.Provider>
  );
}

export default {
  useDvaTransition,
  useDvaConcurrentState,
  useDvaLoading,
  batchUpdates,
  useDvaConcurrent,
  isReact18ConcurrentAvailable,
  React18Provider
};
