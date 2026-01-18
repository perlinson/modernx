import React from 'react';
import { connect } from 'modernx';
import './Counter.css';

const Counter = ({ count, add, minus, reset, asyncAdd }) => {
  return (
    <div className="Counter">
      <h2>Counter: {count}</h2>
      <div className="Counter-display">
        <div className="Counter-number">{count}</div>
      </div>
      <div className="Counter-controls">
        <button onClick={add} className="Counter-button Counter-button--add">
          + Add
        </button>
        <button onClick={minus} className="Counter-button Counter-button--minus">
          - Minus
        </button>
        <button onClick={reset} className="Counter-button Counter-button--reset">
          ↺ Reset
        </button>
      </div>
      <div className="Counter-async">
        <button 
          onClick={asyncAdd} 
          className="Counter-button Counter-button--async"
        >
          ⏳ Async Add (+1 after 1s)
        </button>
      </div>
      <div className="Counter-info">
        <h3>Features demonstrated:</h3>
        <ul>
          <li>✅ State management with ModernX</li>
          <li>✅ Synchronous operations (add, minus, reset)</li>
          <li>✅ Asynchronous operations (asyncAdd)</li>
          <li>✅ React component connection</li>
          <li>✅ TypeScript-ready (if using .tsx)</li>
        </ul>
      </div>
    </div>
  );
};

export default connect(
  ({ count }) => ({ count }),
  ({ add, minus, reset, asyncAdd }) => ({ add, minus, reset, asyncAdd })
)(Counter);
