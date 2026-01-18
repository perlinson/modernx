# React 18 Strict Mode Example

This example demonstrates how dva applications work correctly in React 18 Strict Mode, including proper cleanup and double-rendering behavior.

## Features Demonstrated

- **Strict Mode Compatibility**: Application runs without warnings in Strict Mode
- **Effect Cleanup**: Proper cleanup of subscriptions and timers
- **Double Rendering Handling**: Components handle React 18's double-rendering correctly
- **Resource Management**: Proper cleanup of resources on unmount

## Key Concepts

### Strict Mode
React 18 Strict Mode helps identify potential issues by:
- Intentionally double-invoking effects in development
- Detecting unsafe lifecycles
- Ensuring proper cleanup patterns

### Cleanup Patterns
- Subscriptions with proper unlistener functions
- Timer cleanup with clearInterval/clearTimeout
- Event listener removal

## Usage

```bash
cd examples/react18-strict-mode
npm install
npm start
```

## What to Look For

1. **Console Output**: Notice the double-rendering behavior in development
2. **Effect Cleanup**: Verify timers and subscriptions are cleaned up
3. **No Warnings**: Application should run without React warnings
4. **State Consistency**: State remains consistent across renders

## Files

- `index.js`: Application setup with Strict Mode wrapper
- `App.js`: Main component demonstrating Strict Mode patterns
- `README.md`: This documentation

## Learn More

- [React 18 Strict Mode](https://react.dev/reference/react/StrictMode)
- [Effect Cleanup](https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-functions)
- [dva Subscriptions](../../packages/modernx-core/src/subscription.js)
