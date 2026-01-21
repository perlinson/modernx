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
- **modernx-core**: Core functionality and React integration
- **modernx-immer**: Immer integration for immutable updates
- **modernx-loading**: Loading state management
- **modernx-logger**: Redux logger plugin
- **modernx-cli**: Command-line tools and scaffolding
- **modernx-gui**: Development GUI and debugging tools

### 🛠️ Developer Experience
- **Full TypeScript Support**: Complete TypeScript support with type definitions and ESLint integration
- **Code Quality**: ESLint + @typescript-eslint + Prettier for consistent code style
- **Zero Configuration**: Out of the box with sensible defaults
- **Modern Toolchain**: Built with Node.js 18, latest Babel, and modern build tools
- **Hot Reload**: Development experience with HMR
- **Debugging Tools**: Built-in logger and GUI visualization tools
- **CLI Integration**: Project scaffolding with optional tools

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

## 🛠️ Development

### Contributing

We welcome contributions! Please see our [Developer Guide](./docs/DEVELOPER_GUIDE.md) for detailed instructions.

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/perlinson/modernx.git
cd modernx

# Install dependencies
npm install

# Bootstrap packages
npm run bootstrap

# Link development dependencies
npm run dev:link

# Start development
npm run dev
```

### Development Commands

```bash
# Build all packages
npm run build

# Run tests
npm test

# Type checking
npm run typecheck

# Lint code
npm run lint

# Validate monorepo
npm run validate:quick
```

### Monorepo Management

```bash
# Workspace status
npm run workspaces:status

# Link internal dependencies
npm run dev:link

# Clean all packages
npm run clean:all

# Run scripts across packages
npm run run:all build
```

---

## 🛠️ Development Tools

### Logger Plugin

Add comprehensive Redux logging to your ModernX application:

```javascript
import modernx from 'modernx';
import logger from 'modernx-logger';

const app = modernx({
  plugins: [logger({
    collapsed: true,
    duration: true,
    timestamp: true,
  })],
});
```

### GUI Development Tool

Start the development GUI for real-time state visualization:

```bash
# Start GUI from project directory
npx modernx-gui

# Or include in project creation
npx modernx create my-app --tools gui
```

The GUI provides:
- **Real-time State Visualization**: Live display of Redux state changes
- **Action History**: Complete timeline of all actions with payloads
- **Project Structure Analysis**: Automatic detection of ModernX models
- **WebSocket Communication**: Real-time synchronization with your app

### CLI Integration

Create new ModernX projects with optional debugging tools:

```bash
# Create project with logger and GUI
npx modernx create my-app --tools logger,gui

# Interactive project creation
npx modernx create my-app
# Select tools during setup:
# - Logger: Redux logger for debugging
# - GUI: Development GUI with real-time visualization
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
- [Installation Guide](./docs/GettingStarted.md#installation)
- [Quick Start](./docs/GettingStarted.md#quick-start)
- [Core Concepts](./docs/Concepts.md)
- [React 18 Features](./docs/GettingStarted.md#react-18-features)
- [Advanced Usage](./docs/GettingStarted.md#advanced-usage)

### API Reference
- [createApp](./docs/API.md#createapp)
- [Model API](./docs/API.md#model-api)
- [Hooks API](./docs/API.md#hooks-api)
- [Plugin API](./docs/API.md#plugin-api)

### Examples
- [Basic Counter](./examples/with-basic)
- [Todo List](./examples/user-dashboard)
- [Async Data](./examples/with-basic)
- [React 18 Concurrent](./examples/react18-concurrent)
- [React Router v6](./examples/react-router-v6)

---

## 🏗️ Project Structure

```
modernx/
├── packages/
│   ├── modernx/           # Main package
│   ├── modernx-core/      # Core functionality
│   ├── modernx-immer/     # Immer integration
│   ├── modernx-loading/   # Loading state
│   ├── modernx-logger/    # Logger plugin
│   ├── modernx-cli/       # Command-line tools
│   └── modernx-gui/       # Development GUI
├── examples/              # Example projects
├── docs/                  # Documentation
├── website/              # VuePress website
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
| [modernx-logger](https://www.npmjs.com/package/modernx-logger) | ![npm version](https://img.shields.io/npm/v/modernx-logger.svg) | ~3KB | Redux logger plugin |
| [modernx-cli](https://www.npmjs.com/package/modernx-cli) | ![npm version](https://img.shields.io/npm/v/modernx-cli.svg) | ~8KB | Command-line tools |
| [modernx-gui](https://www.npmjs.com/package/modernx-gui) | ![npm version](https://img.shields.io/npm/v/modernx-gui.svg) | ~12KB | Development GUI |

---

## 🤝 Contributing

We welcome all kinds of contributions! Please see our [Developer Guide](./docs/DEVELOPER_GUIDE.md) for details.

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
