# React 18 Automatic Batching Example

This example demonstrates how dva leverages React 18's automatic batching feature to optimize performance.

## Features Demonstrated

- **Automatic Batching**: Multiple state updates are batched automatically
- **Performance Comparison**: Shows the difference between batched and non-batched updates
- **react18Utils.batchUpdates**: Explicit batching control when needed

## Key Concepts

### Automatic Batching
React 18 automatically batches multiple state updates that occur within the same event loop tick, reducing unnecessary re-renders.

### Explicit Batching
Sometimes you need explicit control over batching, especially in async operations or event handlers.

## Usage

```bash
cd examples/react18-batching
npm install
npm start
```

## What to Look For

1. **Performance Metrics**: Observe the render count and timing
2. **Batching Behavior**: See how multiple updates are combined
3. **Explicit Control**: Try the explicit batching button

## Files

- `index.js`: Application setup with React 18 createRoot
- `App.js`: Main component demonstrating batching features
- `README.md`: This documentation

## Learn More

- [React 18 Automatic Batching](https://react.dev/learn/render-and-commit#batching-all-state-updates)
- [dva React 18 Utils](../../packages/modernx/src/react18-utils.js)
