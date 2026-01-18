# modernx-immer

ModernX 的 Immer 集成插件，提供不可变状态更新的便捷方式。

## 🎯 特性

- 🔄 **不可变更新** - 使用 Immer 简化不可变状态更新
- ⚡ **性能优化** - 自动检测状态变化，避免不必要的更新
- 📝 **简洁语法** - 使用可变语法编写不可变代码
- 🔧 **TypeScript** - 完整的类型支持
- 🎯 **零配置** - 开箱即用

## 🚀 快速开始

### 安装
```bash
npm install modernx-immer
```

### 基础使用
```javascript
import { createApp } from 'modernx';
import immer from 'modernx-immer';

const app = createApp({
  plugins: [immer()],
  models: [
    {
      namespace: 'todos',
      state: {
        items: [],
        loading: false
      },
      reducers: {
        addTodo: (state, { payload }) => {
          // 使用 Immer 的可变语法
          state.items.push(payload);
          state.loading = false;
        },
        removeTodo: (state, { payload }) => {
          const index = state.items.findIndex(item => item.id === payload);
          if (index !== -1) {
            state.items.splice(index, 1);
          }
        },
        updateTodo: (state, { payload }) => {
          const todo = state.items.find(item => item.id === payload.id);
          if (todo) {
            Object.assign(todo, payload.updates);
          }
        }
      }
    }
  ]
});
```

## 📋 API 参考

### immer 插件
```javascript
import immer from 'modernx-immer';

const app = createApp({
  plugins: [
    immer({
      // Immer 配置
      enableFreeze: true,
      enableAutoFreeze: true,
      immerOptions: {
        // Immer 选项
        onAutoFreeze: (state) => {
          console.log('State frozen:', state);
        }
      }
    })
  ]
});
```

### 在 Reducers 中使用
```javascript
reducers: {
  // 简单更新
  increment: (state, { payload }) => {
    state.count += payload;
  },
  
  // 数组操作
  addItem: (state, { payload }) => {
    state.items.push(payload);
  },
  
  // 对象更新
  updateUser: (state, { payload }) => {
    const user = state.users.find(u => u.id === payload.id);
    if (user) {
      Object.assign(user, payload.updates);
    }
  },
  
  // 复杂操作
  updateNestedState: (state, { payload }) => {
    const { userId, updates } = payload;
    const user = state.users.find(u => u.id === userId);
    if (user) {
      user.profile.name = updates.name;
      user.profile.email = updates.email;
      user.preferences.theme = updates.theme;
    }
  }
}
```

## 🔧 高级用法

### 嵌套状态更新
```javascript
reducers: {
  updateProfile: (state, { payload }) => {
    // 深层嵌套更新
    state.user.profile.name = payload.name;
    state.user.profile.contact.email = payload.email;
    state.user.profile.contact.phone = payload.phone;
  },
  
  addNestedItem: (state, { payload }) => {
    // 添加到嵌套数组
    state.categories[payload.categoryId].items.push(payload.item);
  }
}
```

### 条件更新
```javascript
reducers: {
  conditionalUpdate: (state, { payload }) => {
    // 条件更新
    if (state.items.length < 10) {
      state.items.push(payload);
    }
    
    // 条件删除
    if (payload.force) {
      state.items = [];
    }
  }
}
```

### 批量更新
```javascript
reducers: {
  batchUpdate: (state, { payload }) => {
    // 批量更新
    payload.updates.forEach(update => {
      const item = state.items.find(item => item.id === update.id);
      if (item) {
        Object.assign(item, update.changes);
      }
    });
  }
}
```

## 🎯 使用场景

### 1. 复杂状态结构
```javascript
const complexModel = {
  namespace: 'app',
  state: {
    user: {
      profile: {
        name: '',
        email: '',
        settings: {
          theme: 'light',
          notifications: true
        }
      },
      posts: [],
      friends: []
    },
    ui: {
      sidebar: {
        open: false,
        width: 250
      },
      modals: {
        login: { open: false },
        settings: { open: false }
      }
    }
  },
  reducers: {
    updateUserProfile: (state, { payload }) => {
      // 深层更新
      state.user.profile.name = payload.name;
      state.user.profile.email = payload.email;
      state.user.profile.settings.theme = payload.theme;
    },
    
    toggleSidebar: (state) => {
      state.ui.sidebar.open = !state.ui.sidebar.open;
    },
    
    openModal: (state, { payload }) => {
      state.ui.modals[payload].open = true;
    },
    
    addPost: (state, { payload }) => {
      state.user.posts.unshift(payload);
    },
    
    addFriend: (state, { payload }) => {
      state.user.friends.push(payload);
    }
  }
};
```

### 2. 数组和对象操作
```javascript
const listModel = {
  namespace: 'list',
  state: {
    items: [],
    selectedItems: [],
    filters: {
      search: '',
      category: 'all',
      sortBy: 'date'
    }
  },
  reducers: {
    addItem: (state, { payload }) => {
      state.items.unshift(payload);
    },
    
    removeItem: (state, { payload }) => {
      const index = state.items.findIndex(item => item.id === payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
      
      // 同时从选中项中移除
      const selectedIndex = state.selectedItems.findIndex(id => id === payload);
      if (selectedIndex !== -1) {
        state.selectedItems.splice(selectedIndex, 1);
      }
    },
    
    toggleSelection: (state, { payload }) => {
      const index = state.selectedItems.findIndex(id => id === payload);
      if (index === -1) {
        state.selectedItems.push(payload);
      } else {
        state.selectedItems.splice(index, 1);
      }
    },
    
    updateFilters: (state, { payload }) => {
      Object.assign(state.filters, payload);
    },
    
    clearSelection: (state) => {
      state.selectedItems = [];
    }
  }
};
```

### 3. 性能优化
```javascript
const optimizedModel = {
  namespace: 'optimized',
  state: {
    data: new Map(),
    cache: {},
    loading: false
  },
  reducers: {
    setData: (state, { payload }) => {
      // 使用 Map 进行高效查找
      state.data.set(payload.id, payload);
    },
    
    updateData: (state, { payload }) => {
      const existing = state.data.get(payload.id);
      if (existing) {
        // 合并更新
        Object.assign(existing, payload.updates);
      }
    },
    
    removeData: (state, { payload }) => {
      state.data.delete(payload);
    },
    
    clearCache: (state) => {
      state.cache = {};
    }
  }
};
```

## 🔌 与其他插件集成

### 与 Logger 集成
```javascript
import { createApp } from 'modernx';
import immer from 'modernx-immer';
import logger from 'modernx-logger';

const app = createApp({
  plugins: [
    immer(),
    logger({
      // 记录状态变化
      diff: true
    })
  ],
  models: [
    {
      namespace: 'todos',
      state: { items: [] },
      reducers: {
        addTodo: (state, { payload }) => {
          state.items.push(payload);
        }
      }
    }
  ]
});
```

### 与 Loading 集成
```javascript
import { createApp } from 'modernx';
import immer from 'modernx-immer';
import loading from 'modernx-loading';

const app = createApp({
  plugins: [
    immer(),
    loading()
  ],
  models: [
    {
      namespace: 'api',
      state: { data: null },
      effects: {
        *fetchData({ payload }, { put, call }) {
          yield put({ type: 'showLoading', payload: 'fetchData' });
          
          try {
            const data = yield call(api.fetchData, payload);
            yield put({ type: 'setData', payload: data });
          } finally {
            yield put({ type: 'hideLoading', payload: 'fetchData' });
          }
        }
      },
      reducers: {
        setData: (state, { payload }) => {
          state.data = payload;
        }
      }
    }
  ]
});
```

## 🎨 最佳实践

### 1. 保持 reducers 纯净
```javascript
// ✅ 好的做法
reducers: {
  updateUser: (state, { payload }) => {
    state.user.name = payload.name;
    state.user.email = payload.email;
  }
}

// ❌ 避免的做法
reducers: {
  updateUser: (state, { payload }) => {
    // 不要在 reducer 中进行异步操作
    api.updateUser(payload);
    
    // 不要在 reducer 中产生副作用
    console.log('User updated:', payload);
    
    state.user.name = payload.name;
  }
}
```

### 2. 使用描述性的 action 名称
```javascript
// ✅ 好的做法
reducers: {
  setUserProfile: (state, { payload }) => {
    state.user.profile = payload;
  },
  addTodoItem: (state, { payload }) => {
    state.todos.items.push(payload);
  }
}

// ❌ 避免的做法
reducers: {
  set: (state, { payload }) => {
    state.user = payload.user;
    state.todos = payload.todos;
  }
}
```

### 3. 合理组织状态结构
```javascript
// ✅ 好的做法
state: {
  user: {
    profile: {},
    preferences: {},
    history: []
  },
  todos: {
    items: [],
    filters: {},
    loading: false
  }
}

// ❌ 避免的做法
state: {
  userProfile: {},
  userPreferences: {},
  todoItems: [],
  todoFilters: {},
  isLoading: false
}
```

## 🧪 测试

### 测试 Immer Reducers
```javascript
import { getUserModel } from './models/user';

describe('userModel with immer', () => {
  let model;
  
  beforeEach(() => {
    model = getUserModel();
  });
  
  it('should handle nested updates', () => {
    const state = {
      user: {
        profile: { name: 'John', email: 'john@example.com' }
      }
    };
    
    const action = {
      type: 'updateProfile',
      payload: { name: 'Jane', email: 'jane@example.com' }
    };
    
    const newState = model.reducers.updateProfile(state, action);
    
    expect(newState.user.profile.name).toBe('Jane');
    expect(newState.user.profile.email).toBe('jane@example.com');
    
    // 验证不可变性
    expect(newState).not.toBe(state);
    expect(newState.user).not.toBe(state.user);
    expect(newState.user.profile).not.toBe(state.user.profile);
  });
});
```

### 测试复杂状态操作
```javascript
describe('complex state operations', () => {
  it('should handle array operations', () => {
    const state = { items: [{ id: 1, name: 'Item 1' }] };
    const action = { type: 'addItem', payload: { id: 2, name: 'Item 2' } };
    
    const newState = model.reducers.addItem(state, action);
    
    expect(newState.items).toHaveLength(2);
    expect(newState.items[1]).toEqual(action.payload);
    expect(newState.items[0]).toEqual(state.items[0]);
  });
});
```

## 🚀 版本历史

- **v1.1.1** - 修复类型定义问题
- **v1.1.0** - 添加性能优化
- **v1.0.0** - 初始版本

## 📞 支持

- 📖 [完整文档](https://github.com/perlinson/modernx)
- 🐛 [问题反馈](https://github.com/perlinson/modernx/issues)
- 💬 [讨论区](https://github.com/perlinson/modernx/discussions)

---

**🔄 让状态更新更加简单！**
