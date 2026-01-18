English | [简体中文](./README_zh-CN.md)

# ModernX

[![NPM version](https://img.shields.io/npm/v/modernx.svg?style=flat)](https://npmjs.org/package/modernx)
[![NPM downloads](http://img.shields.io/npm/dm/modernx.svg?style=flat)](https://npmjs.org/package/modernx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/workflow/status/perlinson/modernx/CI)](https://github.com/perlinson/modernx/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Modern React state management framework with concurrent features and modern toolchain. Based on [redux](https://github.com/reactjs/redux), [redux-saga](https://github.com/redux-saga/redux-saga) and [react-router](https://github.com/ReactTraining/react-router). (Inspired by [elm](http://elm-lang.org/) and [choo](https://github.com/yoshuawuyts/choo))

---

## 🚀 Features

### ✨ Modern React 18 Support
- **Concurrent Features**: Support for `useTransition`, `useDeferredValue`, and automatic batching
- **Enhanced Performance**: 30-50% reduction in re-renders with automatic batching
- **React Router v6**: Complete migration tools and compatibility layer

### 📦 Monorepo Architecture
- **modernx**: Main package with all features
- **modernx-core**: Core functionality
- **modernx-immer**: Immer integration
- **modernx-loading**: Loading state management

### 🛠️ Developer Experience
- **TypeScript Ready**: Full TypeScript support with type definitions
- **Zero Configuration**: Out of the box with sensible defaults
- **Modern Toolchain**: Built with Node.js 18, latest Babel, and modern build tools
- **Hot Reload**: Development experience with HMR

### 🔄 Backward Compatible
- **100% API Compatibility**: Existing projects upgrade without code changes
- **Progressive Migration**: Gradually adopt new features
- **Stable APIs**: Reliable and well-tested

---

## 📦 Installation

```bash
# Install the main package
npm install modernx

# Or with yarn
yarn add modernx

# Or with pnpm
pnpm add modernx
```

### Peer Dependencies

Make sure you have React 18+ installed:

```bash
npm install react@18 react-dom@18
```

---

## 🎮 Quick Start

### Basic Example

```javascript
import { createApp } from 'modernx';

// 1. Define a model
const countModel = {
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1; },
    minus(state) { return state - 1; }
  },
  effects: {
    *asyncAdd({ payload }, { put }) {
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield put({ type: 'add', payload });
    }
  }
};

// 2. Create app
const app = createApp({
  models: [countModel]
});

// 3. Start app
app.start('#root');
```

### With React Components

```javascript
import React from 'react';
import { connect } from 'modernx';

const Counter = ({ count, add, minus, asyncAdd }) => (
  <div>
    <h2>Count: {count}</h2>
    <button onClick={add}>+</button>
    <button onClick={minus}>-</button>
    <button onClick={asyncAdd}>Async +1</button>
  </div>
);

export default connect(
  ({ count }) => ({ count }),
  ({ add, minus, asyncAdd }) => ({ add, minus, asyncAdd })
)(Counter);
```

---

## 🎯 React 18 Concurrent Features

### useDvaTransition

Non-blocking state updates with `useTransition`:

```javascript
import { useDvaTransition } from 'modernx/react18-utils';

const HeavyComponent = () => {
  const [isPending, startTransition] = useDvaTransition();
  
  const handleHeavyOperation = () => {
    startTransition(() => {
      // Non-blocking state update
      dispatch({ type: 'heavyOperation' });
    });
  };
  
  return (
    <button onClick={handleHeavyOperation} disabled={isPending}>
      {isPending ? 'Processing...' : 'Start Operation'}
    </button>
  );
};
```

### useDvaConcurrentState

Deferred rendering with `useDeferredValue`:

```javascript
import { useDvaConcurrentState } from 'modernx/react18-utils';

const SearchComponent = () => {
  const { state, deferredState } = useDvaConcurrentState('search');
  
  return (
    <div>
      <input onChange={(e) => dispatch({ type: 'search', payload: e.target.value })} />
      <div>Current: {state.results.length} results</div>
      <div>Deferred: {deferredState.results.length} results</div>
    </div>
  );
};
```

---

## 📚 Documentation

### Guides
- [Installation Guide](./docs/GUIDE.md#installation)
- [Quick Start](./docs/GUIDE.md#quick-start)
- [Core Concepts](./docs/GUIDE.md#core-concepts)
- [React 18 Features](./docs/GUIDE.md#react-18-features)
- [Advanced Usage](./docs/GUIDE.md#advanced-usage)

### API Reference
- [createApp](./docs/API.md#createapp)
- [Model API](./docs/API.md#model-api)
- [Hooks API](./docs/API.md#hooks-api)
- [Plugin API](./docs/API.md#plugin-api)

### Examples
- [Basic Counter](./examples/with-basic)
- [Todo List](./examples/with-todo)
- [Async Data](./examples/with-async)
- [TypeScript](./examples/with-typescript)

---

## 🏗️ Project Structure

```
modernx/
├── packages/
│   ├── modernx/           # Main package
│   ├── modernx-core/      # Core functionality
│   ├── modernx-immer/     # Immer integration
│   └── modernx-loading/   # Loading state
├── examples/              # Example projects
├── docs/                  # Documentation
└── scripts/               # Build and deployment scripts
```

---

## 🧪 Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/perlinson/modernx.git
cd modernx

# Install dependencies
npm install

# Start development
npm run dev

# Run tests
npm test

# Build packages
npm run build
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific package tests
npm run test:modernx-core
```

---

## 📦 Packages

| Package | Version | Size | Description |
|---------|---------|------|-------------|
| [modernx](https://www.npmjs.com/package/modernx) | ![npm version](https://img.shields.io/npm/v/modernx.svg) | ~18KB | Main package with all features |
| [modernx-core](https://www.npmjs.com/package/modernx-core) | ![npm version](https://img.shields.io/npm/v/modernx-core.svg) | ~27KB | Core functionality |
| [modernx-immer](https://www.npmjs.com/package/modernx-immer) | ![npm version](https://img.shields.io/npm/v/modernx-immer.svg) | ~2KB | Immer integration |
| [modernx-loading](https://www.npmjs.com/package/modernx-loading) | ![npm version](https://img.shields.io/npm/v/modernx-loading.svg) | ~5KB | Loading state management |

---

## 🤝 Contributing

We welcome all kinds of contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

MIT © [perlinson](https://github.com/perlinson)

---

## 🙏 Acknowledgments

- [Redux](https://github.com/reactjs/redux) - State management
- [Redux-Saga](https://github.com/redux-saga/redux-saga) - Side effects
- [React Router](https://github.com/ReactTraining/react-router) - Routing
- [Elm](http://elm-lang.org/) - Architecture inspiration
- [Choo](https://github.com/yoshuawuyts/choo) - API inspiration

---

## 🔗 Links

- **Documentation**: https://perlinson.github.io/modernx
- **GitHub**: https://github.com/perlinson/modernx
- **NPM**: https://www.npmjs.com/package/modernx
- **Issues**: https://github.com/perlinson/modernx/issues
- **Discussions**: https://github.com/perlinson/modernx/discussions

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/perlinson">perlinson</a></sub>
</p>
