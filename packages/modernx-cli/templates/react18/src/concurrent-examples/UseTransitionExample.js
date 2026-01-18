/**
 * React 18 useTransition Hook 示例
 * dva-react18 集成
 */

import React from 'react';
import { useDvaTransition } from 'dva-react18';

function UseTransitionExample() {
  const [isPending, startTransition] = useDvaTransition();
  
  const handleClick = () => {
    startTransition(() => {
      // 这些更新会被批处理，不会阻塞 UI
      dispatch({ type: 'count/increment' });
      dispatch({ type: 'count/increment' });
      dispatch({ type: 'count/increment' });
    });
  };
  
  return (
    <div>
      <h2>useTransition 示例</h2>
      <button onClick={handleClick} disabled={isPending}>
        {isPending ? '处理中...' : '并发更新 (3次)'}
      </button>
      <p>点击按钮查看 React 18 的并发特性</p>
    </div>
  );
}

export default UseTransitionExample;
