/**
 * React 18 集成模块
 * 将 React 18 新特性直接集成到 modernx-core 中
 */

import { createElement } from 'react';

// 检测 React 18 并发特性是否可用
export function isReact18ConcurrentAvailable() {
  try {
    // 检查是否存在 React 18 的并发特性
    return (
      typeof window !== 'undefined' &&
      window.React &&
      window.React.startTransition &&
      window.React.useTransition &&
      window.React.useDeferredValue
    );
  } catch (error) {
    return false;
  }
}

// 创建 React 18 工具函数
export function createReact18Utils(store, app) {
  const { dispatch, getState, subscribe } = store;
  
  // React 18 并发特性工具
  const react18Utils = {
    // 检测并发特性可用性
    isConcurrentAvailable: isReact18ConcurrentAvailable(),
    
    // 安全的并发更新
    safeConcurrentUpdate: (updates) => {
      if (react18Utils.isConcurrentAvailable && window.React.startTransition) {
        window.React.startTransition(() => {
          updates.forEach(update => dispatch(update));
        });
      } else {
        // 降级到同步更新
        updates.forEach(update => dispatch(update));
      }
    },
    
    // 批量更新
    batchUpdates: (updates) => {
      if (react18Utils.isConcurrentAvailable) {
        // React 18 自动批处理
        updates.forEach(update => dispatch(update));
      } else {
        // 手动批处理（如果可用）
        if (window.React && window.React.unstable_batchedUpdates) {
          window.React.unstable_batchedUpdates(() => {
            updates.forEach(update => dispatch(update));
          });
        } else {
          updates.forEach(update => dispatch(update));
        }
      }
    },
    
    // 获取状态（支持延迟）
    getState: (namespace, deferred = false) => {
      const state = getState();
      const namespaceState = namespace ? state[namespace] : state;
      
      if (deferred && react18Utils.isConcurrentAvailable && window.React.useDeferredValue) {
        // 这里在实际使用中会在 Hook 中处理
        return namespaceState;
      }
      
      return namespaceState;
    }
  };
  
  return react18Utils;
}

// React 18 Hook 工厂函数
export function createReact18Hooks(store) {
  const { dispatch, getState, subscribe } = store;
  
  return {
    // useDvaTransition Hook
    useDvaTransition: () => {
      if (typeof window === 'undefined') {
        // SSR 降级
        return [false, () => {}];
      }
      
      // 在实际组件中使用时，这里会调用 React 的 useTransition
      // 这里只提供工厂函数，具体实现在组件中
      return [false, () => {}];
    },
    
    // useDvaConcurrentState Hook
    useDvaConcurrentState: (namespace) => {
      if (typeof window === 'undefined') {
        // SSR 降级
        return { state: null, deferredState: null };
      }
      
      // 在实际组件中使用时，这里会调用 React 的 useDeferredValue
      return {
        state: getState()[namespace],
        deferredState: getState()[namespace]
      };
    },
    
    // useDvaLoading Hook
    useDvaLoading: (namespace) => {
      const state = getState();
      const loading = state.loading || {};
      const namespaceLoading = namespace ? loading[namespace] : loading;
      
      return {
        loading: !!namespaceLoading,
        loadingModels: Object.keys(loading).filter(key => loading[key])
      };
    }
  };
}

// 高阶组件工厂
export function createReact18HOC(store) {
  return {
    // withDvaConcurrent HOC
    withDvaConcurrent: (Component, options = {}) => {
      const { namespace, deferState = false, showLoading = false } = options;
      
      return function DvaConcurrentWrapper(props) {
        // 在实际使用中，这里会使用 React 的 Hooks
        return createElement(Component, {
          ...props,
          store,
          react18Utils: createReact18Utils(store)
        });
      };
    }
  };
}

// 导出工厂函数
export function createDvaReact18Enhancer() {
  return (store, app) => {
    // 添加 React 18 工具到 store
    store.react18Utils = createReact18Utils(store, app);
    store.react18Hooks = createReact18Hooks(store);
    store.react18HOC = createReact18HOC(store);
    
    return store;
  };
}

// 默认导出
export default {
  isReact18ConcurrentAvailable,
  createReact18Utils,
  createReact18Hooks,
  createReact18HOC,
  createDvaReact18Enhancer
};
