// 任务模型
export default {
  namespace: 'tasks',
  state: {
    tasks: [],
    loading: false,
    filter: 'all', // all, active, completed
    stats: {
      total: 0,
      completed: 0,
      active: 0
    }
  },
  
  effects: {
    *fetchTasks({ payload }, { put, call }) {
      yield put({ type: 'setLoading', payload: true });
      
      try {
        const tasks = yield call(fetchTasksAPI);
        yield put({ type: 'setTasks', payload: tasks });
        yield put({ type: 'updateStats' });
      } catch (error) {
        console.error('获取任务失败:', error);
      } finally {
        yield put({ type: 'setLoading', payload: false });
      }
    },
    
    *addTask({ payload }, { put, select }) {
      const newTask = {
        id: Date.now(),
        title: payload,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'normal'
      };
      
      const currentTasks = yield select(state => state.tasks.tasks);
      yield put({ type: 'setTasks', payload: [...currentTasks, newTask] });
      yield put({ type: 'updateStats' });
      
      console.log('添加任务:', newTask);
    },
    
    *toggleTask({ payload }, { put, select }) {
      const currentTasks = yield select(state => state.tasks.tasks);
      const updatedTasks = currentTasks.map(task => 
        task.id === payload 
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null }
          : task
      );
      
      yield put({ type: 'setTasks', payload: updatedTasks });
      yield put({ type: 'updateStats' });
    },
    
    *deleteTask({ payload }, { put, select }) {
      const currentTasks = yield select(state => state.tasks.tasks);
      const filteredTasks = currentTasks.filter(task => task.id !== payload);
      
      yield put({ type: 'setTasks', payload: filteredTasks });
      yield put({ type: 'updateStats' });
    }
  },
  
  reducers: {
    setTasks(state, { payload }) {
      return { ...state, tasks: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
    setFilter(state, { payload }) {
      return { ...state, filter: payload };
    },
    updateStats(state) {
      const total = state.tasks.length;
      const completed = state.tasks.filter(task => task.completed).length;
      const active = total - completed;
      
      return {
        ...state,
        stats: { total, completed, active }
      };
    }
  }
};

// 模拟 API
function fetchTasksAPI() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: '学习 ModernX', completed: true, createdAt: '2024-01-01T00:00:00Z', priority: 'high' },
        { id: 2, title: '创建 GUI 演示', completed: false, createdAt: '2024-01-02T00:00:00Z', priority: 'normal' },
        { id: 3, title: '测试状态监控', completed: false, createdAt: '2024-01-03T00:00:00Z', priority: 'low' }
      ]);
    }, 500);
  });
}
