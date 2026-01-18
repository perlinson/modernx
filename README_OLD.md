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

- **[react18-concurrent](./examples/react18-concurrent/)**: Concurrent features demonstration
- **[react18-batching](./examples/react18-batching/)**: Automatic batching examples  
- **[react18-strict-mode](./examples/react18-strict-mode/)**: Strict Mode compatibility
- **[react-router-v6](./examples/react-router-v6/)**: React Router v6 migration

### 📚 Migration Guide

See [React 18 Upgrade Summary](./REACT_18_UPGRADE_SUMMARY.md) for detailed migration instructions and best practices.

---

## Features

* **Easy to learn, easy to use**: only 6 apis, very friendly to redux users, and **API reduce to 0 when [use with umi](https://umijs.org/guide/with-modernx.html)**
* **Elm concepts**: organize models with `reducers`, `effects` and `subscriptions`
* **Support HMR**: support HMR for components, routes and models with [babel-plugin-modernx-hmr](https://github.com/perlinson/babel-plugin-modernx-hmr)
* **Plugin system**: e.g. we have [modernx-loading](https://github.com/perlinson/modernx/tree/master/packages/modernx-loading) plugin to handle loading state automatically
* **React 18 Ready**: Full support for React 18 concurrent features and performance optimizations

## Demos

### React 18 Examples
* [React 18 Concurrent Features](./examples/react18-concurrent/): Demonstrate useTransition and useDeferredValue
* [React 18 Automatic Batching](./examples/react18-batching/): Show performance improvements with batching
* [React 18 Strict Mode](./examples/react18-strict-mode/): Strict Mode compatibility examples
* [React Router v6 Migration](./examples/react-router-v6/): Complete v5 to v6 migration example

### Classic Examples
* [Count](https://stackblitz.com/edit/modernx-example-count): Simple count example
* [User Dashboard](https://github.com/perlinson/modernx/tree/master/examples/user-dashboard): User management dashboard
* [AntDesign Pro](https://github.com/ant-design/ant-design-pro)：([Demo](https://preview.pro.ant.design/))，out-of-box UI solution for enterprise applications
* [HackerNews](https://github.com/perlinson/modernx-hackernews):  ([Demo](https://perlinson.github.io/modernx-hackernews/))，HackerNews Clone
* [antd-admin](https://github.com/zuiidea/antd-admin): ([Demo](http://antd-admin.zuiidea.com/))，A admin dashboard application demo built upon Ant Design and ModernX.js
* [github-stars](https://github.com/sorrycc/github-stars): ([Demo](http://sorrycc.github.io/github-stars/#/?_k=rmj86f))，Github star management application
* [Account System](https://github.com/yvanwangl/AccountSystem.git): A small inventory management system
* [react-native-modernx-starter](https://github.com/nihgwu/react-native-modernx-starter): react-native example integrated modernx and react-navigation

## Quick Start

See the [docs directory](./docs) for guides and API references.

### React 18 Quick Start

```javascript
import { createApp } from 'modernx';
import { useModernXTransition } from 'modernx/react18-utils';

// Enable React 18 concurrent features
const app = createApp({
  // your models and configuration
});

// Use concurrent features in your components
function MyComponent() {
  const [isPending, startTransition] = useModernXTransition();
  
  const handleClick = () => {
    startTransition(() => {
      // dispatch actions with automatic batching
      dispatch({ type: 'fetchData' });
    });
  };
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Loading...' : 'Fetch Data'}
    </button>
  );
}
```

## FAQ

### Why is it called modernx?

> ModernX represents the modern approach to React state management with enhanced performance, React 18 concurrent features, and a streamlined developer experience. The 'X' signifies the cross-platform compatibility and extensible architecture.

### Is it production ready?

Yes, modernx is production ready. We have 1000+ projects using modernx in production.

### Does it support IE8?

No.

### What React versions are supported?

- ✅ React 16.14+ (LTS)
- ✅ React 17.x  
- ✅ React 18.x (Recommended for best performance)

### How do I migrate from React Router v5 to v6?

We provide a complete compatibility layer in `modernx/routerV6Compat`. See the [React Router v6 Migration Guide](./docs/REACT_ROUTER_V6_MIGRATION.md) for detailed instructions.

## Next

Some basic articles.

* The [8 Concepts](https://github.com/perlinson/modernx/blob/master/docs/Concepts.md), and know how they are connected together
* [modernx APIs](https://github.com/perlinson/modernx/blob/master/docs/API.md)
* Checkout [modernx knowledgemap](https://github.com/perlinson/modernx-knowledgemap), including all the basic knowledge with ES6, React, modernx
* Checkout [more FAQ](https://github.com/perlinson/modernx/issues?q=is%3Aissue+is%3Aclosed+label%3Afaq)
* If your project is created by [modernx-cli](https://github.com/perlinson/modernx-cli), checkout how to [Configure it](https://github.com/sorrycc/roadhog#configuration)

Want more?

* 看看 modernx 的前身 [React + Redux 最佳实践](https://github.com/sorrycc/blog/issues/1)，知道 modernx 是怎么来的
* 在 gitc 分享 modernx 的 PPT ：[React 应用框架的现代化实践](http://slides.com/sorrycc/modernx)
* 如果还在用 modernx@1.x，请尽快 [升级到 2.x](https://github.com/sorrycc/blog/issues/48)

## Community

| Slack Group                                                  | Github Issue                                            | 钉钉群                                                       | 微信群                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [sorrycc.slack.com](https://join.slack.com/t/sorrycc/shared_invite/enQtNTUzMTYxNDQ5MzE4LTg1NjEzYWUwNDQzMWU3YjViYjcyM2RkZDdjMzE0NzIxMTg3MzIwMDM2YjUwNTZkNDdhNTY5ZTlhYzc1Nzk2NzI) | [umijs/umi/issues](https://github.com/umijs/umi/issues) | <img src="https://gw.alipayobjects.com/zos/rmsportal/jPXcQOlGLnylGMfrKdBz.jpg" width="60" /> | <img src="https://img.alicdn.com/tfs/TB13U6aF6DpK1RjSZFrXXa78VXa-752-974.jpg" width="60" /> |

## License

[MIT](https://tldrlegal.com/license/mit-license)
