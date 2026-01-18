import { Middleware } from 'redux';

export interface LoggerOptions {
  collapsed?: boolean;
  duration?: boolean;
  timestamp?: boolean;
  level?: 'log' | 'debug' | 'info' | 'warn' | 'error';
  colors?: {
    title?: string | boolean;
    prevState?: string | boolean;
    action?: string | boolean;
    nextState?: string | boolean;
    error?: string | boolean;
  };
  logger?: {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
  };
  actionTransformer?: (action: any) => any;
  stateTransformer?: (state: any) => any;
  errorTransformer?: (error: any) => any;
  predicate?: (getState: () => any, action: any) => boolean;
  diffPredicate?: (getState: () => any, action: any) => boolean;
}

export interface ModernXLoggerPlugin {
  _handleActions: (handlers: any, defaultState: any) => Middleware;
  onAction: Middleware;
}

declare function modernxLogger(options?: LoggerOptions): ModernXLoggerPlugin;

export default modernxLogger;
