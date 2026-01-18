import React from 'react';
import { createApp } from 'modernx';
import Counter from './Counter';
import './App.css';

// 1. Define a model
const countModel = {
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1; },
    minus(state) { return state - 1; },
    reset() { return 0; }
  },
  effects: {
    *asyncAdd({ payload }, { put }) {
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield put({ type: 'add', payload });
    }
  }
};

// 2. Create app
const app = createApp({
  models: [countModel]
});

// 3. Start app
app.start();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ModernX Basic Example</h1>
        <p>A simple counter application using ModernX</p>
      </header>
      <main className="App-main">
        <Counter />
      </main>
      <footer className="App-footer">
        <p>
          Built with <a href="https://github.com/perlinson/modernx">ModernX</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
