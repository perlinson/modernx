# ModernX Logger

Redux logger plugin for ModernX applications, providing comprehensive debugging and state monitoring capabilities.

## Features

- **Redux Integration**: Seamless integration with ModernX's Redux-based state management
- **Action Logging**: Real-time logging of all Redux actions with timestamps
- **State Visualization**: Visual display of state changes and diffs
- **Performance Monitoring**: Built-in performance tracking for actions
- **Customizable Options**: Configurable logging levels and formats

## Installation

```bash
npm install modernx-logger --save-dev
```

## Usage

### Basic Setup

```javascript
import modernx from 'modernx';
import logger from 'modernx-logger';

const app = modernx({
  plugins: [logger()],
});
```

### Advanced Configuration

```javascript
import modernx from 'modernx';
import logger from 'modernx-logger';

const app = modernx({
  plugins: [
    logger({
      collapsed: true,
      duration: true,
      timestamp: true,
      level: 'info',
      colors: {
        title: false,
        prevState: false,
        action: false,
        nextState: false,
        error: false,
      },
    }),
  ],
});
```

### CLI Integration

When creating a new ModernX project, you can include the logger automatically:

```bash
npx modernx create my-app --tools logger
```

## API Reference

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `collapsed` | boolean | `true` | Collapse action groups |
| `duration` | boolean | `true` | Show action duration |
| `timestamp` | boolean | `true` | Include timestamp |
| `level` | string | `'log'` | Logging level |
| `colors` | object | `{}` | Custom color configuration |

### Configuration Examples

#### Development Environment

```javascript
logger({
  collapsed: false,
  duration: true,
  timestamp: true,
  level: 'debug',
  colors: {
    title: 'purple',
    prevState: 'grey',
    action: 'blue',
    nextState: 'green',
    error: 'red',
  },
});
```

#### Production Environment

```javascript
logger({
  collapsed: true,
  duration: false,
  timestamp: false,
  level: 'error',
  colors: false,
});
```

## Migration from DVA Logger

If you're migrating from DVA, the ModernX logger provides the same API:

```javascript
// DVA Logger
import { createLogger } from 'dva-logger';

// ModernX Logger (API compatible)
import logger from 'modernx-logger';

// Usage is identical
const app = modernx({
  plugins: [logger()],
});
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## License

MIT
