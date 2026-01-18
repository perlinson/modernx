/**
 * React 18 Concurrent Features Compatibility Utilities
 * Provides utilities to work with React 18 concurrent features in modernx applications
 */

import { useTransition, useDeferredValue, startTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createElement } from 'react';

/**
 * Hook for managing state transitions with React 18 useTransition
 * @param {Object} options - Configuration options
 * @returns {Array} [isPending, startTransition]
 */
export function useDvaTransition(options = {}) {
  const [isPending, startTransition] = useTransition(options);
  const dispatch = useDispatch();
  
  const startDvaTransition = (action) => {
    startTransition(() => {
      dispatch(action);
    });
  };
  
  return [isPending, startDvaTransition];
}

/**
 * Hook for deferred values with modernx state
 * @param {*} value - The value to defer
 * @returns {*} Deferred value
 */
export function useDvaDeferredValue(value) {
  return useDeferredValue(value);
}

/**
 * Hook for managing concurrent state with deferred updates
 * @param {string} namespace - Redux namespace
 * @param {Function} selector - State selector function
 * @returns {Object} Combined state and transition utilities
 */
export function useDvaConcurrentState(namespace, selector = state => state) {
  const dispatch = useDispatch();
  const state = useSelector(state => selector(state[namespace] || {}));
  const deferredState = useDeferredValue(state);
  const [isPending, startTransition] = useTransition();
  
  const dispatchWithTransition = (action) => {
    startTransition(() => {
      dispatch(action);
    });
  };
  
  return {
    state,
    deferredState,
    isPending,
    dispatch: dispatchWithTransition
  };
}

/**
 * Higher-order component for React 18 concurrent features
 * @param {React.Component} Component - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {React.Component} Wrapped component
 */
export function withDvaConcurrent(Component, options = {}) {
  const {
    namespace,
    selector,
    deferState = false,
    showLoading = true
  } = options;
  
  return function DvaConcurrentWrapper(props) {
    const {
      state,
      deferredState,
      isPending,
      dispatch
    } = useDvaConcurrentState(namespace, selector);
    
    const finalState = deferState ? deferredState : state;
    
    if (showLoading && isPending) {
      return createElement('div', null, 'Loading...');
    }
    
    return createElement(Component, {
      ...props,
      state: finalState,
      dispatch,
      isPending
    });
  };
}

/**
 * Utility for batching state updates in React 18
 * React 18 automatically batches updates, but this provides explicit control
 * @param {Function} callback - Function containing state updates
 */
export function batchUpdates(callback) {
  // In React 18, updates are automatically batched
  // This function exists for explicit control and compatibility
  if (typeof unstable_batchedUpdates !== 'undefined') {
    // Fallback for React 17 and below
    unstable_batchedUpdates(callback);
  } else {
    // React 18+ - updates are automatically batched
    callback();
  }
}

/**
 * Hook for safe concurrent feature usage with fallback
 * @param {Function} concurrentHook - Hook that uses concurrent features
 * @param {*} fallback - Fallback value for non-concurrent environments
 * @returns {*} Hook result or fallback
 */
export function useSafeConcurrentHook(concurrentHook, fallback) {
  try {
    return concurrentHook();
  } catch (error) {
    return fallback;
  }
}

/**
 * Check if React 18 concurrent features are available
 * @returns {boolean} True if concurrent features are available
 */
export function isReact18ConcurrentAvailable() {
  return typeof useTransition !== 'undefined' && 
         typeof useDeferredValue !== 'undefined' && 
         typeof startTransition !== 'undefined';
}

/**
 * Enhanced dispatch function for concurrent updates
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Function} Enhanced dispatch function
 */
export function createConcurrentDispatch(dispatch) {
  return (action) => {
    if (isReact18ConcurrentAvailable()) {
      startTransition(() => {
        dispatch(action);
      });
    } else {
      dispatch(action);
    }
  };
}

/**
 * Utility for creating concurrent-aware selectors
 * @param {Function} selector - Original selector
 * @returns {Function} Enhanced selector
 */
export function createConcurrentSelector(selector) {
  return (state, ...args) => {
    const result = selector(state, ...args);
    return result;
  };
}

/**
 * Hook for managing loading states with React 18 concurrent features
 * @param {Array} effects - Array of effect names to track
 * @returns {Object} Loading state and utilities
 */
export function useDvaLoading(effects = []) {
  const loading = useSelector(state => state.loading || {});
  const [isTransitioning, startTransition] = useTransition();
  
  const isEffectLoading = effects.some(effect => loading.effects[effect]);
  const isLoading = isEffectLoading || isTransitioning;
  
  return {
    isLoading,
    isEffectLoading,
    isTransitioning,
    loading,
    startTransition
  };
}

// Export all utilities for easy importing
export default {
  useDvaTransition,
  useDvaDeferredValue,
  useDvaConcurrentState,
  withDvaConcurrent,
  batchUpdates,
  isReact18ConcurrentAvailable,
  useSafeConcurrentHook,
  createConcurrentDispatch,
  useDvaLoading,
  createConcurrentSelector
};
