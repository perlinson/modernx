# DVA Examples

This directory contains various examples demonstrating dva framework features and usage patterns.

## React 18 Examples

### 🚀 React 18 Concurrent Features
**Directory**: `react18-concurrent/`
Demonstrates React 18 concurrent features with dva:
- `useDvaTransition` for non-urgent updates
- `useDvaConcurrentState` for deferred rendering
- `withDvaConcurrent` HOC for class components

### ⚡ React 18 Automatic Batching  
**Directory**: `react18-batching/`
Shows how React 18's automatic batching improves performance:
- Automatic batching of state updates
- Explicit batching with `react18Utils.batchUpdates`
- Performance comparison examples

### 🛡️ React 18 Strict Mode
**Directory**: `react18-strict-mode/`
Demonstrates Strict Mode compatibility:
- Proper effect cleanup patterns
- Double-rendering handling
- Resource management best practices

### 🛣️ React Router v6 Integration
**Directory**: `react-router-v6/`
Shows migration to React Router v6:
- v6 routing patterns
- Navigation hooks (`useNavigate`, `useLocation`)
- Compatibility layer usage

## Classic Examples

### 📊 User Dashboard
**Directory**: `user-dashboard/`
Comprehensive dashboard example with:
- Multiple models and effects
- Complex state management
- API integration patterns

### 🔀 Redux Undo/Redo
**Directory**: `with-redux-undo/`
Demonstrates undo/redo functionality:
- Time travel debugging
- State history management
- Action replay patterns

### 📦 Immer Integration
**Directory**: `with-immer/`
Shows immutable state updates with Immer:
- Simplified reducer writing
- Deep immutability
- Performance optimizations

### 🌐 Next.js Integration
**Directory**: `with-nextjs/`
Server-side rendering with Next.js:
- SSR patterns
- Client-side hydration
- Universal state management

### 🔄 React Router 3
**Directory**: `with-react-router-3/`
Legacy routing example:
- React Router v3 patterns
- Route-based code splitting
- Navigation patterns

## Getting Started

Each example is self-contained. To run an example:

```bash
cd examples/[example-name]
npm install
npm start
```

## React Version Compatibility

- **React 18 Examples**: Require React 18+
- **Classic Examples**: Work with React 16.14+, 17.x, and 18.x

## Migration Guides

For migration from older versions:
- [React Router v5 to v6](../docs/REACT_ROUTER_V6_MIGRATION.md)
- [React 16/17 to 18](../REACT_18_UPGRADE_SUMMARY.md)

## Contributing

To add a new example:

1. Create a new directory under `examples/`
2. Include a `README.md` explaining the example
3. Add a `package.json` if needed
4. Update this README to include your example

## Learn More

- [DVA Documentation](../docs/)
- [API Reference](../packages/modernx/src/)
- [React 18 Features](../packages/modernx/src/react18-utils.js)
