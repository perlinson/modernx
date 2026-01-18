import { createStore } from 'redux';
import modernxLogger from '../src/index.js';

describe('ModernX Logger Plugin', () => {
  let store;
  let logger;

  beforeEach(() => {
    // Mock console methods for testing
    global.console = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      group: jest.fn(),
      groupEnd: jest.fn(),
      groupCollapsed: jest.fn(),
    };

    logger = modernxLogger();
    store = createStore(
      (state = {}, action) => {
        switch (action.type) {
          case 'TEST_ACTION':
            return { ...state, test: action.payload };
          default:
            return state;
        }
      },
      undefined,
      logger.onAction
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should create a logger plugin', () => {
      expect(logger).toHaveProperty('_handleActions');
      expect(logger).toHaveProperty('onAction');
      expect(typeof logger.onAction).toBe('function');
    });

    it('should log actions to console', () => {
      store.dispatch({
        type: 'TEST_ACTION',
        payload: { message: 'test' }
      });

      expect(global.console.log).toHaveBeenCalled();
    });

    it('should handle actions without errors', () => {
      expect(() => {
        store.dispatch({ type: 'UNKNOWN_ACTION' });
      }).not.toThrow();
    });
  });

  describe('Configuration Options', () => {
    it('should work with default options', () => {
      const defaultLogger = modernxLogger();
      const testStore = createStore(
        (state = {}, action) => state,
        undefined,
        defaultLogger.onAction
      );

      expect(() => {
        testStore.dispatch({ type: 'TEST' });
      }).not.toThrow();
    });

    it('should work with custom options', () => {
      const customLogger = modernxLogger({
        collapsed: false,
        duration: true,
        timestamp: false,
      });

      const testStore = createStore(
        (state = {}, action) => state,
        undefined,
        customLogger.onAction
      );

      expect(() => {
        testStore.dispatch({ type: 'CUSTOM_TEST' });
      }).not.toThrow();
    });
  });

  describe('Action Handling', () => {
    it('should handle action handlers correctly', () => {
      const handlers = {
        TEST_ACTION: (state, action) => ({ ...state, handled: true })
      };

      const actionHandler = logger._handleActions(handlers, {});
      const result = actionHandler({}, { type: 'TEST_ACTION' });

      expect(result).toEqual({ handled: true });
    });

    it('should pass through unknown actions', () => {
      const handlers = {
        KNOWN_ACTION: (state, action) => ({ ...state, known: true })
      };

      const actionHandler = logger._handleActions(handlers, {});
      const result = actionHandler({}, { type: 'UNKNOWN_ACTION' });

      expect(result).toEqual({});
    });
  });

  describe('Error Handling', () => {
    it('should not crash on malformed actions', () => {
      expect(() => {
        store.dispatch(null);
      }).not.toThrow();
    });

    it('should handle actions without type', () => {
      expect(() => {
        store.dispatch({ payload: 'no type' });
      }).not.toThrow();
    });
  });
});
