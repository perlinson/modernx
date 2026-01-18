import { createLogger } from 'redux-logger';

export default function(opts = {}) {
  return {
    _handleActions(handlers, defaultState) {
      // Pass-through for action handlers
      return (state = defaultState, action) => {
        const { type } = action;
        const handler = handlers[type];
        if (handler) {
          return handler(state, action);
        }
        return state;
      };
    },
    onAction: createLogger({
      collapsed: true,
      duration: true,
      timestamp: true,
      ...opts,
    }),
  };
}
