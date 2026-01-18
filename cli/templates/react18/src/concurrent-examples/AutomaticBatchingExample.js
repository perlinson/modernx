/**
 * React 18 自动批处理示例
 * dva-react18 集成
 */

import React from 'react';
import { batchUpdates } from 'dva-react18';

function AutomaticBatchingExample() {
  const handleClick = () => {
    // React 18 自动批处理这些更新
    dispatch({ type: 'count/increment' });
    dispatch({ type: 'count/increment' });
    dispatch({ type: 'count/increment' });
    dispatch({ type: 'count/increment' });
    dispatch({ type: 'count/increment' });
  };
  
  const handleBatchClick = () => {
    // 手动批处理
    batchUpdates([
      { type: 'count/increment' },
      { type: 'count/increment' },
      { type: 'count/increment' }
    ]);
  };
  
  return (
    <div>
      <h2>自动批处理示例</h2>
      <button onClick={handleClick}>
        自动批处理 (5次更新)
      </button>
      <button onClick={handleBatchClick} style={{ marginLeft: '10px' }}>
        手动批处理 (3次更新)
      </button>
      <p>React 18 会自动批处理多个状态更新，减少重渲染次数。</p>
    </div>
  );
}

export default AutomaticBatchingExample;
