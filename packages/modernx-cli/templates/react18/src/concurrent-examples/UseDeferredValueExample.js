/**
 * React 18 useDeferredValue Hook 示例
 * dva-react18 集成
 */

import React from 'react';
import { useDvaConcurrentState } from 'dva-react18';

function UseDeferredValueExample() {
  const { state, deferredState } = useDvaConcurrentState('search');
  
  const handleInputChange = (e) => {
    dispatch({ type: 'search/updateQuery', payload: e.target.value });
  };
  
  return (
    <div>
      <h2>useDeferredValue 示例</h2>
      <input 
        type="text" 
        placeholder="搜索..."
        onChange={handleInputChange}
        style={{ padding: '8px', fontSize: '16px' }}
      />
      <div style={{ marginTop: '10px' }}>
        <p>当前查询: {state.query}</p>
        <p>延迟查询: {deferredState.query}</p>
        <p>当输入时，延迟查询会滞后于当前查询，提供更好的用户体验。</p>
      </div>
    </div>
  );
}

export default UseDeferredValueExample;
