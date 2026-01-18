/**
 * Simple Router Middleware for React Router v6
 * Replaces connected-react-router with a lightweight solution
 */

import { createAction } from 'redux';

// Router actions
export const push = createAction('ROUTER/PUSH');
export const replace = createAction('ROUTER/REPLACE');
export const go = createAction('ROUTER/GO');
export const goBack = createAction('ROUTER/GO_BACK');
export const goForward = createAction('ROUTER/GO_FORWARD');

// Simple router middleware
export function createRouterMiddleware(history) {
  return (store) => (next) => (action) => {
    switch (action.type) {
      case 'ROUTER/PUSH':
        history.push(action.payload);
        break;
      case 'ROUTER/REPLACE':
        history.replace(action.payload);
        break;
      case 'ROUTER/GO':
        history.go(action.payload);
        break;
      case 'ROUTER/GO_BACK':
        history.goBack();
        break;
      case 'ROUTER/GO_FORWARD':
        history.goForward();
        break;
      default:
        break;
    }
    return next(action);
  };
}

// Simple router reducer (optional - if you want to track router state in Redux)
export const routerReducer = (state = {}, action) => {
  switch (action.type) {
    case 'ROUTER/LOCATION_CHANGE':
      return {
        ...state,
        location: action.payload,
      };
    default:
      return state;
  }
};
