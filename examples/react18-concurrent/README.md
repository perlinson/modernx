# React 18 Concurrent Features Example

This example demonstrates how to use React 18 concurrent features with dva framework.

## Features Demonstrated

- `useTransition` for non-blocking state updates
- `useDeferredValue` for deferred state rendering
- Concurrent state management with dva models
- Loading states with React 18 concurrent features

## Usage

```bash
npm install
npm start
```

## Key Concepts

### useDvaTransition

```javascript
import { react18Utils } from 'dva';

function MyComponent() {
  const [isPending, startDvaTransition] = react18Utils.useDvaTransition();
  const dispatch = useDispatch();
  
  const handleHeavyUpdate = () => {
    startDvaTransition({
      type: 'model/heavyUpdate',
      payload: data
    });
  };
  
  return (
    <div>
      <button onClick={handleHeavyUpdate}>
        {isPending ? 'Updating...' : 'Update Data'}
      </button>
    </div>
  );
}
```

### useDvaConcurrentState

```javascript
function DataList({ namespace }) {
  const {
    state,
    deferredState,
    isPending,
    dispatch
  } = react18Utils.useDvaConcurrentState(namespace);
  
  return (
    <div>
      {isPending && <div>Loading...</div>}
      <ul>
        {(deferredState.items || []).map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### withDvaConcurrent HOC

```javascript
const EnhancedComponent = react18Utils.withDvaConcurrent(MyComponent, {
  namespace: 'users',
  selector: state => ({ users: state.list }),
  deferState: true,
  showLoading: true
});
```
