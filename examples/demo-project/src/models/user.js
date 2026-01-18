// User model
export default {
  namespace: 'user',
  state: {
    currentUser: null,
    loading: false,
    error: null
  },
  effects: {
    *login({ payload }, { put, call }) {
      yield put({ type: 'setLoading', payload: true });
      try {
        // 模拟 API 调用
        const response = yield call(mockLogin, payload);
        yield put({ type: 'setUser', payload: response });
        yield put({ type: 'setLoading', payload: false });
      } catch (error) {
        yield put({ type: 'setError', payload: error.message });
        yield put({ type: 'setLoading', payload: false });
      }
    }
  },
  reducers: {
    setUser(state, { payload }) {
      return { ...state, currentUser: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setError(state, { payload }) {
      return { ...state, error: payload };
    }
  }
};

function mockLogin(credentials) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        token: 'mock-jwt-token'
      });
    }, 1000);
  });
}