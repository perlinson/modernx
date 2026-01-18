// Jest setup file for React 18 compatibility
import '@testing-library/jest-dom';

// Mock React 18 createRoot API for testing
global.HTMLElement.prototype.scrollIntoView = jest.fn();

// Suppress React 18 Strict Mode double-rendering warnings in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: You are calling ReactDOM.render()')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
