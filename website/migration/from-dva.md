# Migration from DVA

This guide helps you migrate applications from DVA to ModernX.

## Overview

ModernX provides a similar state management experience to DVA but with modern React patterns and better TypeScript support.

## Key Differences

| Feature | DVA | ModernX |
|---------|-----|----------|
| API | dva-core | modernx-core |
| Hooks | connect() | useModel() |
| Effects | put/call | dispatch/async |
| Subscriptions | Built-in | Custom hooks |
| Loading | Built-in | Custom effects |

## Migration Steps

### 1. Install Dependencies

```bash
npm install modernx modernx-core
npm remove dva @types/dva
```

### 2. Model Migration

#### DVA Model
```javascript
// DVA model
export default {
  namespace: 'user',
  state: {
    currentUser: null,
    loading: false
  },
  reducers: {
    saveCurrentUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    }
  },
  effects: {
    *login({ payload }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        const response = yield call(api.login, payload);
        yield put({ type: 'saveCurrentUser', payload: response.data });
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/login') {
          dispatch({ type: 'clearCurrentUser' });
        }
      });
    }
  }
};
```

#### ModernX Model
```javascript
// ModernX model
const userModel = {
  name: 'user',
  state: {
    currentUser: null,
    loading: false
  },
  reducers: {
    setCurrentUser: (state, payload) => ({
      ...state,
      currentUser: payload
    }),
    setLoading: (state, payload) => ({
      ...state,
      loading: payload
    }),
    clearCurrentUser: (state) => ({
      ...state,
      currentUser: null
    })
  },
  effects: {
    async login(payload) {
      this.setLoading(true);
      try {
        const response = await api.login(payload);
        this.setCurrentUser(response.data);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        this.setLoading(false);
      }
    }
  }
};
```

### 3. Component Migration

#### DVA Component
```javascript
// DVA component
import { connect } from 'dva';

function UserComponent({ user, dispatch }) {
  const handleLogin = (credentials) => {
    dispatch({ type: 'user/login', payload: credentials });
  };
  
  return (
    <div>
      {user.loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={() => handleLogin({ email: 'test@example.com' })}>
          Login
        </button>
      )}
      {user.currentUser && <p>Welcome, {user.currentUser.name}</p>}
    </div>
  );
}

export default connect(({ user }) => ({ user }))(UserComponent);
```

#### ModernX Component
```javascript
// ModernX component
import { useModel } from 'modernx-core';

function UserComponent() {
  const [userState, userDispatch] = useModel('user');
  
  const handleLogin = (credentials) => {
    userDispatch('login', credentials);
  };
  
  return (
    <div>
      {userState.loading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={() => handleLogin({ email: 'test@example.com' })}>
          Login
        </button>
      )}
      {userState.currentUser && <p>Welcome, {userState.currentUser.name}</p>}
    </div>
  );
}

export default UserComponent;
```

### 4. App Setup Migration

#### DVA Setup
```javascript
// DVA setup
import dva from 'dva';
import createLoading from 'dva-loading';

const app = dva();
app.use(createLoading());
app.model(userModel);
app.model(postModel);
app.router(router);
app.start('#root');
```

#### ModernX Setup
```javascript
// ModernX setup
import { createApp } from 'modernx';
import { Provider } from 'modernx-core';

const app = createApp({
  models: [userModel, postModel]
});

function App() {
  return (
    <Provider app={app}>
      <Router />
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
```

### 5. Subscriptions Migration

DVA subscriptions can be migrated to custom hooks:

#### DVA Subscription
```javascript
subscriptions: {
  setup({ dispatch, history }) {
    return history.listen(({ pathname }) => {
      if (pathname === '/login') {
        dispatch({ type: 'user/clearCurrentUser' });
      }
    });
  }
}
```

#### ModernX Custom Hook
```javascript
// Custom hook for route-based actions
function useRouteActions() {
  const [userDispatch] = useModel('user');
  const location = useLocation();
  
  React.useEffect(() => {
    if (location.pathname === '/login') {
      userDispatch('clearCurrentUser');
    }
  }, [location.pathname, userDispatch]);
}

// Use in component
function LoginComponent() {
  useRouteActions();
  // ... rest of component
}
```

### 6. Loading State Migration

#### DVA Loading
```javascript
// DVA provides built-in loading
function Component({ loading }) {
  return (
    <div>
      {loading.effects['user/login'] && <p>Logging in...</p>}
    </div>
  );
}

export default connect(({ loading }) => ({ loading }))(Component);
```

#### ModernX Loading
```javascript
// ModernX requires custom loading state
const userModel = {
  name: 'user',
  state: {
    loading: false,
    loadingEffects: {}
  },
  reducers: {
    setLoading: (state, payload) => ({
      ...state,
      loading: payload
    }),
    setLoadingEffect: (state, { effect, loading }) => ({
      ...state,
      loadingEffects: {
        ...state.loadingEffects,
        [effect]: loading
      }
    })
  },
  effects: {
    async login(payload) {
      this.setLoadingEffect({ effect: 'login', loading: true });
      try {
        // Login logic
      } finally {
        this.setLoadingEffect({ effect: 'login', loading: false });
      }
    }
  }
};

// Or create a loading utility
function createLoadingEffect(model) {
  return {
    ...model,
    state: {
      ...model.state,
      loading: false
    },
    effects: {
      ...model.effects,
      ...Object.keys(model.effects || {}).reduce((acc, key) => {
        acc[key] = async function(...args) {
          this.setLoading(true);
          try {
            await model.effects[key].call(this, ...args);
          } finally {
            this.setLoading(false);
          }
        };
        return acc;
      }, {})
    }
  };
}
```

## Migration Checklist

- [ ] Replace `dva` with `modernx` and `modernx-core`
- [ ] Convert model namespace to name
- [ ] Update reducers to use function syntax
- [ ] Convert effects to async/await
- [ ] Replace `connect()` with `useModel()` hook
- [ ] Migrate subscriptions to custom hooks
- [ ] Update loading state handling
- [ ] Test all functionality
- [ ] Update TypeScript types if applicable

## Common Issues

### 1. Action Dispatching
```javascript
// DVA
dispatch({ type: 'user/login', payload: credentials });

// ModernX
userDispatch('login', credentials);
```

### 2. State Access
```javascript
// DVA
const { user } = this.props;

// ModernX
const [userState] = useModel('user');
```

### 3. Effects Error Handling
```javascript
// DVA
try {
  yield call(api.login, payload);
} catch (error) {
  yield put({ type: 'setError', payload: error.message });
}

// ModernX
try {
  await api.login(payload);
} catch (error) {
  this.setError(error.message);
}
```

## Benefits of Migration

1. **Modern React**: Uses hooks instead of HOCs
2. **Better TypeScript**: Improved type safety
3. **Simpler API**: More intuitive API design
4. **Better Performance**: Optimized re-rendering
5. **Easier Testing**: Better testability
6. **Future Proof**: Actively maintained

## Next Steps

1. Start with a single model
2. Test thoroughly
3. Gradually migrate other models
4. Update tests
5. Update documentation

## Need Help?

- Check the [ModernX Documentation](../guide/)
- View [Examples](../examples/)
- Open an issue on [GitHub](https://github.com/perlinson/modernx)
