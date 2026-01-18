# ModernX GUI

Development GUI with real-time visualization for ModernX applications, providing comprehensive debugging and state inspection capabilities.

## Features

- **Real-time Visualization**: Live display of Redux state and actions
- **Project Structure Analysis**: Automatic detection and visualization of ModernX models
- **WebSocket Communication**: Real-time data synchronization between app and GUI
- **Action History**: Complete history of Redux actions with timestamps and payloads
- **State Inspector**: Visual tree view of application state
- **Hot Module Replacement**: Automatic GUI updates during development

## Installation

```bash
npm install modernx-gui --save-dev
```

## Usage

### Command Line Interface

Start the GUI from any ModernX project directory:

```bash
npx modernx-gui
```

This will:
1. Automatically detect your ModernX project structure
2. Start a local development server
3. Open your default browser to the GUI interface
4. Begin real-time state monitoring

### Programmatic Integration

```javascript
import modernx from 'modernx';
import gui from 'modernx-gui';

const app = modernx({
  plugins: [
    gui({
      port: 3000,
      autoOpen: true,
      websocket: true,
    }),
  ],
});
```

### CLI Integration

When creating a new ModernX project, you can include the GUI automatically:

```bash
npx modernx create my-app --tools gui
```

## GUI Interface

### Project Structure Panel

- **Models List**: Displays all detected ModernX models
- **File Tree**: Shows project structure and relationships
- **Configuration**: Shows current ModernX configuration

### State Viewer

- **Current State**: Real-time display of application state
- **State Tree**: Expandable tree view of nested state
- **State Diff**: Visual diff between state changes

### Action History

- **Action Timeline**: Chronological list of all actions
- **Action Details**: Payload, timestamp, and metadata
- **State Transitions**: Visual representation of state changes

### Real-time Monitoring

- **Live Updates**: Automatic state and action updates
- **Performance Metrics**: Action execution time and performance
- **Error Tracking**: Visual error reporting and stack traces

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `port` | number | `3000` | GUI server port |
| `autoOpen` | boolean | `true` | Auto-open browser |
| `websocket` | boolean | `true` | Enable WebSocket communication |
| `host` | string | `'localhost'` | GUI server host |

### Example Configuration

```javascript
gui({
  port: 3001,
  autoOpen: false,
  websocket: true,
  host: '0.0.0.0', // Allow remote connections
});
```

## Development Workflow

### 1. Start Development Server

```bash
cd my-modernx-app
npx modernx-gui
```

### 2. Start Your Application

```bash
npm run dev
```

### 3. Open GUI Interface

The GUI will automatically:
- Detect your running ModernX application
- Connect via WebSocket for real-time updates
- Display current state and action history

### 4. Monitor and Debug

Use the GUI interface to:
- Inspect current application state
- Review action history and payloads
- Monitor performance metrics
- Track state changes in real-time

## WebSocket Protocol

The GUI communicates with your application via WebSocket:

```javascript
// Send state update to GUI
ws.send(JSON.stringify({
  type: 'state_update',
  payload: newState,
  timestamp: Date.now(),
}));

// Send action to GUI
ws.send(JSON.stringify({
  type: 'action',
  payload: {
    type: 'USER_ACTION',
    payload: actionData,
  },
  timestamp: Date.now(),
}));
```

## Migration from DVA GUI

If you're migrating from DVA, the ModernX GUI provides enhanced capabilities:

```javascript
// DVA GUI (Electron-based)
import dva from 'dva';
import gui from 'dva-gui';

// ModernX GUI (Web-based, enhanced)
import modernx from 'modernx';
import gui from 'modernx-gui';

// Enhanced features:
// - WebSocket real-time communication
// - Cross-browser compatibility
// - Hot module replacement
// - Enhanced state visualization
```

## Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support
- **Legacy browsers**: Graceful degradation

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

## Troubleshooting

### Common Issues

1. **GUI not connecting**
   - Check if WebSocket is enabled
   - Verify port availability
   - Check firewall settings

2. **Project not detected**
   - Ensure `package.json` has ModernX dependency
   - Check for `src/models/` directory
   - Verify project structure

3. **Browser not opening**
   - Check default browser settings
   - Try manual browser navigation to GUI URL
   - Verify port is not in use

### Debug Mode

Enable debug logging:

```bash
DEBUG=modernx-gui:* npx modernx-gui
```

## License

MIT
