/**
 * React 18 Concurrent Features Tests
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import dva, { react18Utils } from 'dva';

// Mock React 18 concurrent features for testing
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useTransition: jest.fn(() => [false, jest.fn()]),
    useDeferredValue: jest.fn((value) => value),
    startTransition: jest.fn((callback) => callback()),
  };
});

describe('React 18 Concurrent Features', () => {
  let app;
  let store;

  beforeEach(() => {
    app = dva();
    app.model({
      namespace: 'test',
      state: {
        count: 0,
        data: [],
        loading: false
      },
      reducers: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
        setData(state, { payload }) {
          return { ...state, data: payload };
        },
        setLoading(state, { payload }) {
          return { ...state, loading: payload };
        }
      },
      effects: {
        *fetchData(action, { put }) {
          yield put({ type: 'setLoading', payload: true });
          // Simulate async operation
          yield new Promise(resolve => setTimeout(resolve, 100));
          const data = Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            name: `Item ${i + 1}`
          }));
          yield put({ type: 'setData', payload: data });
          yield put({ type: 'setLoading', payload: false });
        }
      }
    });
    
    app.start();
    store = app._store;
  });

  test('useDvaTransition hook works correctly', () => {
    const TestComponent = () => {
      const [isPending, startDvaTransition] = react18Utils.useDvaTransition();
      const dispatch = useDispatch();
      
      const handleClick = () => {
        startDvaTransition({ type: 'test/increment' });
      };
      
      return (
        <div>
          <button onClick={handleClick} disabled={isPending}>
            {isPending ? 'Loading...' : 'Increment'}
          </button>
          <div data-testid="count">Count: {store.getState().test.count}</div>
        </div>
      );
    };
    
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Increment'));
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for transition to complete
    await waitFor(() => {
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
      expect(screen.getByText('Increment')).toBeInTheDocument();
    });
  });

  test('useDvaConcurrentState hook works correctly', () => {
    const TestComponent = () => {
      const {
        state,
        deferredState,
        isPending,
        dispatch
      } = react18Utils.useDvaConcurrentState('test');
      
      const handleClick = () => {
        dispatch({ type: 'test/increment' });
      };
      
      return (
        <div>
          <button onClick={handleClick}>
            Increment
          </button>
          <div data-testid="current-count">Current: {state.count}</div>
          <div data-testid="deferred-count">Deferred: {deferredState.count}</div>
          <div data-testid="is-pending">Is Pending: {isPending ? 'Yes' : 'No'}</div>
        </div>
      );
    };
    
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    expect(screen.getByText('Current: 0')).toBeInTheDocument();
    expect(screen.getByText('Deferred: 0')).toBeInTheDocument();
    expect(screen.getByText('Is Pending: No')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Increment'));
    
    expect(screen.getByText('Current: 1')).toBeInTheDocument();
    expect(screen.getByText('Deferred: 1')).toBeInTheDocument();
  });

  test('batchUpdates utility works correctly', () => {
    const TestComponent = () => {
      const dispatch = useDispatch();
      
      const handleMultipleUpdates = () => {
        react18Utils.batchUpdates(() => {
          dispatch({ type: 'test/increment' });
          dispatch({ type: 'test/increment' });
          dispatch({ type: 'test/increment' });
        });
      };
      
      return (
        <div>
          <button onClick={handleMultipleUpdates}>
            Batch Updates
          </button>
          <div data-testid="count">Count: {store.getState().test.count}</div>
        </div>
      );
    };
    
    render(
      <Provider store={store}>
        <TestComponent />
      </Provider>
    );
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Batch Updates'));
    
    // Should be batched to single render
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });

  test('useDvaLoading hook works correctly', () => {
    app.model({
      namespace: 'loading',
      state: {
        effects: {
          'test/fetch': true,
          'test/update': true
        }
      }
    });
    
    app.start();
    
    const TestComponent = () => {
      const { isLoading, isEffectLoading, isTransitioning } = react18Utils.useDvaLoading([
        'test/fetch',
        'test/update'
      ]);
      
      return (
        <div>
          <div data-testid="is-loading">Is Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div data-testid="is-effect-loading">Effect Loading: {isEffectLoading ? 'Yes' : 'No'}</div>
          <div data-testid="is-transitioning">Transitioning: {isTransitioning ? 'Yes' : 'No'}</div>
        </div>
      );
    };
    
    render(
      <Provider store={app._store}>
        <TestComponent />
      </Provider>
    );
    
    expect(screen.getByText('Is Loading: No')).toBeInTheDocument();
    expect(screen.getByText('Effect Loading: No')).toBeInTheDocument();
    expect(screen.getByText('Transitioning: No')).toBeInTheDocument();
  });

  test('isReact18ConcurrentAvailable utility works', () => {
    expect(react18Utils.isReact18ConcurrentAvailable()).toBe(true);
  });

  test('useSafeConcurrentHook fallback works', () => {
    const TestComponent = () => {
      const result = react18Utils.useSafeConcurrentHook(
        () => 'concurrent-result',
        'fallback-result'
      );
      
      return <div data-testid="result">{result}</div>;
    };
    
    render(<TestComponent />);
    expect(screen.getByTestId('result')).toHaveText('concurrent-result');
  });
});

describe('React 18 Strict Mode Compatibility', () => {
  let app;
  let store;

  beforeEach(() => {
    app = dva();
    app.model({
      namespace: 'strict',
      state: {
        count: 0,
        mounted: false
      },
      reducers: {
        increment(state) {
          return { ...state, count: state.count + 1 };
        },
        setMounted(state, { payload }) {
          return { ...state, mounted: payload };
        }
      },
      effects: {
        *mountEffect(action, { put }) {
          yield put({ type: 'setMounted', payload: true });
        }
      },
      subscriptions: {
        setup({ dispatch }) {
          const intervalId = setInterval(() => {
            dispatch({ type: 'increment' });
          }, 100);
          
          return () => {
            clearInterval(intervalId);
          };
        }
      }
    });
    
    app.start();
    store = app._store;
  });

  test('component works in Strict Mode', () => {
    const TestComponent = () => {
      const [mounted, setMounted] = React.useState(false);
      const count = useSelector(state => state.strict.count);
      
      React.useEffect(() => {
        setMounted(true);
        return () => {
          setMounted(false);
        };
      }, []);
      
      return (
        <div>
          <div data-testid="mounted">Mounted: {mounted ? 'Yes' : 'No'}</div>
          <div data-testid="count">Count: {count}</div>
        </div>
      );
    };
    
    // Wrap in Strict Mode
    const StrictComponent = () => (
      <React.StrictMode>
        <Provider store={store}>
          <TestComponent />
        </Provider>
      </React.StrictMode>
    );
    
    render(<StrictComponent />);
    
    expect(screen.getByText('Mounted: No')).toBeInTheDocument();
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    // Wait for mount effect
    await waitFor(() => {
      expect(screen.getByText('Mounted: Yes')).toBeInTheDocument();
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
    
    // Unmount and remount in Strict Mode
    render(<div />);
    render(<StrictComponent />);
    
    expect(screen.getByText('Mounted: No')).toBeInTheDocument();
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Mounted: Yes')).toBeInTheDocument();
      expect(screen.getByText('Count: 2')).toBeInTheDocument();
    });
  });

  test('subscription cleanup works in Strict Mode', () => {
    jest.useFakeTimers();
    
    const TestComponent = () => {
      const count = useSelector(state => state.strict.count);
      return <div data-testid="count">Count: {count}</div>;
    };
    
    const StrictComponent = () => (
      <React.StrictMode>
        <Provider store={store}>
          <TestComponent />
        </Provider>
      </React.StrictMode>
    );
    
    const { unmount } = render(<StrictComponent />);
    
    // Initial render
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    // Wait for subscription to increment count
    await waitFor(() => {
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    });
    
    // Unmount component
    unmount();
    
    // Wait for cleanup
    jest.advanceTimersByTime(200);
    
    // Remount component
    render(<StrictComponent />);
    
    // Should start fresh without previous increments
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
    
    // Should increment again from subscription
    await waitFor(() => {
      expect(screen.getByText('Count: 2')).toBeInTheDocument();
    });
  });
});
