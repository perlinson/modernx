# Basic Example

A simple example demonstrating the core concepts of ModernX.

## Installation

```bash
npm install modernx modernx-core
```

## Basic Usage

```javascript
import { createApp } from 'modernx';
import { Provider, useModel } from 'modernx-core';

// Define a model
const counterModel = {
  name: 'counter',
  state: {
    count: 0
  },
  reducers: {
    increment: (state) => ({
      ...state,
      count: state.count + 1
    }),
    decrement: (state) => ({
      ...state,
      count: state.count - 1
    })
  }
};

// Create app
const app = createApp({
  models: [counterModel]
});

// React component
function Counter() {
  const [state, dispatch] = useModel('counter');
  
  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={() => dispatch('increment')}>+</button>
      <button onClick={() => dispatch('decrement')}>-</button>
    </div>
  );
}

function App() {
  return (
    <Provider app={app}>
      <Counter />
    </Provider>
  );
}

export default App;
```

## Key Concepts

1. **Models**: Define state and reducers
2. **Actions**: Dispatch actions to update state
3. **Hooks**: Use `useModel` hook to access state and dispatch

## Running the Example

```bash
npm start
```

This will start a development server with the counter example.
