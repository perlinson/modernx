# ModernX Basic Example

A simple counter application demonstrating the core features of ModernX.

## 🚀 Features

- ✅ State management with ModernX models
- ✅ Synchronous operations (add, minus, reset)
- ✅ Asynchronous operations (asyncAdd with delay)
- ✅ React component connection using `connect`
- ✅ Modern UI with gradient effects
- ✅ Responsive design
- ✅ React 18 Strict Mode compatible

## 📦 Installation

```bash
# Clone the ModernX repository
git clone https://github.com/perlinson/modernx.git
cd modernx/examples/with-basic

# Install dependencies
npm install

# Start the development server
npm start
```

## 🎮 Usage

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Controls

- **+ Add**: Increment the counter by 1
- **- Minus**: Decrement the counter by 1
- **↺ Reset**: Reset the counter to 0
- **⏳ Async Add**: Increment by 1 after 1 second delay

## 📁 Project Structure

```
with-basic/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # App styles
│   ├── Counter.js          # Counter component
│   ├── Counter.css         # Counter styles
│   └── index.js            # Application entry point
├── package.json            # Dependencies
└── README.md              # This file
```

## 🔧 Key Concepts

### Model Definition

```javascript
const countModel = {
  namespace: 'count',
  state: 0,
  reducers: {
    add(state) { return state + 1; },
    minus(state) { return state - 1; },
    reset() { return 0; }
  },
  effects: {
    *asyncAdd({ payload }, { put }) {
      yield new Promise(resolve => setTimeout(resolve, 1000));
      yield put({ type: 'add', payload });
    }
  }
};
```

### Component Connection

```javascript
export default connect(
  ({ count }) => ({ count }),
  ({ add, minus, reset, asyncAdd }) => ({ add, minus, reset, asyncAdd })
)(Counter);
```

## 🎯 Learning Outcomes

This example demonstrates:

1. **Model Structure**: How to define a ModernX model with state, reducers, and effects
2. **State Updates**: Both synchronous and asynchronous state management
3. **Component Integration**: How to connect React components to ModernX state
4. **Modern Development**: Using React 18 with Strict Mode
5. **Styling**: Modern CSS with gradients and animations

## 🚀 Next Steps

- Try [Todo List Example](../with-todo/) for more complex state management
- Explore [React 18 Features](../react18-concurrent/) for concurrent features
- Check [TypeScript Example](../with-typescript/) for type safety

## 📚 Documentation

- [ModernX Documentation](https://perlinson.github.io/modernx)
- [API Reference](https://perlinson.github.io/modernx/api/)
- [Getting Started Guide](https://perlinson.github.io/modernx/guide/)

## 🤝 Contributing

Found an issue or want to improve this example? Please open an issue or submit a pull request on the [ModernX repository](https://github.com/perlinson/modernx).

---

Built with ❤️ using [ModernX](https://github.com/perlinson/modernx)
