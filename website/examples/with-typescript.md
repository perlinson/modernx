# TypeScript Integration

Example of using ModernX with TypeScript for type safety.

## Installation

```bash
npm install modernx modernx-core typescript @types/react @types/react-dom
```

## TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es2018",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

## Typed Models

```typescript
import { createApp, Model, Effects } from 'modernx';
import { Provider, useModel } from 'modernx-core';

// Define types
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UserReducers {
  setCurrentUser: (state: UserState, payload: User) => UserState;
  setUsers: (state: UserState, payload: User[]) => UserState;
  setLoading: (state: UserState, payload: boolean) => UserState;
  setError: (state: UserState, payload: string | null) => UserState;
}

interface UserEffects extends Effects<UserState, UserReducers> {
  fetchUsers: () => Promise<void>;
  createUser: (userData: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

// Define typed model
const userModel: Model<UserState, UserReducers, UserEffects> = {
  name: 'user',
  state: {
    currentUser: null,
    users: [],
    loading: false,
    error: null
  },
  reducers: {
    setCurrentUser: (state, payload) => ({
      ...state,
      currentUser: payload
    }),
    setUsers: (state, payload) => ({
      ...state,
      users: payload
    }),
    setLoading: (state, payload) => ({
      ...state,
      loading: payload
    }),
    setError: (state, payload) => ({
      ...state,
      error: payload
    })
  },
  effects: {
    async fetchUsers() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await fetch('/api/users');
        const users: User[] = await response.json();
        this.setUsers(users);
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to fetch users');
      } finally {
        this.setLoading(false);
      }
    },
    
    async createUser(userData) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to create user');
        
        const newUser: User = await response.json();
        const currentUsers = this.getState().users;
        this.setUsers([...currentUsers, newUser]);
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to create user');
      } finally {
        this.setLoading(false);
      }
    },
    
    async updateUser(id, userData) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) throw new Error('Failed to update user');
        
        const updatedUser: User = await response.json();
        const currentUsers = this.getState().users;
        this.setUsers(currentUsers.map(user => 
          user.id === id ? updatedUser : user
        ));
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to update user');
      } finally {
        this.setLoading(false);
      }
    },
    
    async deleteUser(id) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        const currentUsers = this.getState().users;
        this.setUsers(currentUsers.filter(user => user.id !== id));
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to delete user');
      } finally {
        this.setLoading(false);
      }
    }
  }
};

// Create app with full type safety
const app = createApp({
  models: [userModel]
});

// Typed React components
interface UserListProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

function UserList({ onEdit, onDelete }: UserListProps) {
  const [userState, userDispatch] = useModel('user');
  
  React.useEffect(() => {
    userDispatch('fetchUsers');
  }, [userDispatch]);
  
  if (userState.loading) return <div>Loading users...</div>;
  if (userState.error) return <div>Error: {userState.error}</div>;
  
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {userState.users.map(user => (
          <li key={user.id}>
            <span>{user.name} ({user.email})</span>
            <button onClick={() => onEdit(user)}>Edit</button>
            <button onClick={() => onDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface UserFormProps {
  user?: User;
  onSubmit: (userData: Omit<User, 'id'>) => void;
  onCancel: () => void;
}

function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>{user ? 'Edit User' : 'Create User'}</h2>
      
      <div>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </label>
      </div>
      
      <div>
        <label>
          Email:
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </label>
      </div>
      
      <button type="submit">
        {user ? 'Update' : 'Create'}
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}

function App() {
  const [userState, userDispatch] = useModel('user');
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  
  const handleCreateUser = (userData: Omit<User, 'id'>) => {
    userDispatch('createUser', userData);
    setEditingUser(null);
  };
  
  const handleUpdateUser = (id: number, userData: Partial<User>) => {
    userDispatch('updateUser', id, userData);
    setEditingUser(null);
  };
  
  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      userDispatch('deleteUser', id);
    }
  };
  
  return (
    <Provider app={app}>
      <div>
        <h1>ModernX TypeScript Example</h1>
        
        {editingUser ? (
          <UserForm
            user={editingUser}
            onSubmit={(userData) => 
              editingUser.id 
                ? handleUpdateUser(editingUser.id, userData)
                : handleCreateUser(userData)
            }
            onCancel={() => setEditingUser(null)}
          />
        ) : (
          <div>
            <button onClick={() => setEditingUser({} as User)}>
              Create New User
            </button>
            <UserList
              onEdit={setEditingUser}
              onDelete={handleDeleteUser}
            />
          </div>
        )}
      </div>
    </Provider>
  );
}

export default App;
```

## TypeScript Benefits

1. **Type Safety**: Compile-time error checking
2. **IntelliSense**: Better IDE support and auto-completion
3. **Refactoring**: Safe code refactoring
4. **Documentation**: Types serve as documentation
5. **Team Collaboration**: Clear interfaces for team members

## Best Practices

1. **Define interfaces** for all state and payload types
2. **Use generics** for reusable model types
3. **Type effects** with proper return types
4. **Handle errors** with proper type checking
5. **Use strict mode** for maximum type safety
