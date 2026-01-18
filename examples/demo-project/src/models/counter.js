// Counter model
export default {
  namespace: 'counter',
  state: {
    count: 0,
    history: []
  },
  effects: {
    *incrementAsync({ payload }, { put, select }) {
      const currentCount = yield select(state => state.counter.count);
      yield put({ type: 'increment', payload });
      yield put({ 
        type: 'addToHistory', 
        payload: { 
          action: 'increment', 
          value: currentCount + 1,
          timestamp: Date.now()
        } 
      });
    }
  },
  reducers: {
    increment(state, { payload = 1 }) {
      return { 
        ...state, 
        count: state.count + payload 
      };
    },
    decrement(state, { payload = 1 }) {
      return { 
        ...state, 
        count: state.count - payload 
      };
    },
    reset(state) {
      return { 
        ...state, 
        count: 0,
        history: []
      };
    },
    addToHistory(state, { payload }) {
      return {
        ...state,
        history: [...state.history, payload].slice(-10) // 保留最近10条记录
      };
    }
  }
};