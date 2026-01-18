# modernx-react18 CLI

The command line utility for modernx-react18 - React 18 enhanced modernx framework.

## Features

- 🚀 **Modern Project Scaffolding**: Create React 18 + modernx projects with one command
- 📋 **Multiple Templates**: Choose from basic, full, React 18 concurrent features, and enterprise templates
- 🔧 **Feature Management**: Add features like router, immer, loading, TypeScript, testing
- 🛠️ **Development Tools**: Built-in dev server and build tools
- ⚡ **React 18 Support**: Native support for React 18 concurrent features

## Installation

```bash
# Install globally
npm install -g modernx-react18-cli

# Or use npx
npx modernx-react18 create my-app
```

## Usage

### Create a New Project

```bash
# Create with default template (basic)
modernx-react18 create my-app

# Create with specific template
modernx-react18 create my-app --template react18

# Create without installing dependencies
modernx-react18 create my-app --no-install
```

### Available Templates

- **basic**: Basic modernx-react18 project
- **full**: Full featured project with router, immer, loading
- **react18**: React 18 concurrent features demo
- **enterprise**: Enterprise ready project with best practices

### Add Features to Project

```bash
# Add React Router
modernx-react18 add router

# Add Immer for immutable state
modernx-react18 add immer

# Add TypeScript support
modernx-react18 add typescript

# Add testing setup
modernx-react18 add testing
```

### Development Commands

```bash
# Start development server
modernx-react18 dev

# Build for production
modernx-react18 build

# List available templates
modernx-react18 template
```

## Project Structure

Generated projects include:

```
my-app/
├── src/
│   ├── components/       # React components
│   ├── models/          # ModernX models
│   ├── routes/          # Route components (if router added)
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── app.js           # ModernX app configuration
│   └── index.js         # Entry point
├── public/              # Static assets
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── .eslintrc.js         # ESLint configuration
└── README.md            # Project documentation
```

## React 18 Features

This CLI creates projects that include React 18 concurrent features:

### useTransition Hook

```javascript
import { useModernXTransition } from 'modernx-react18';

function MyComponent() {
  const [isPending, startTransition] = useModernXTransition();
  
  const handleClick = () => {
    startTransition(() => {
      dispatch({ type: 'count/increment' });
    });
  };
  
  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? 'Loading...' : 'Click me'}
    </button>
  );
}
```

### useDeferredValue Hook

```javascript
import { useModernXConcurrentState } from 'modernx-react18';

function SearchComponent() {
  const { state, deferredState } = useModernXConcurrentState('search');
  
  return (
    <div>
      <input 
        value={state.query}
        onChange={(e) => dispatch({ type: 'search/updateQuery', payload: e.target.value })}
      />
      <p>Current: {state.query}</p>
      <p>Deferred: {deferredState.query}</p>
    </div>
  );
}
```

### Automatic Batching

React 18 automatically batches multiple state updates:

```javascript
// These updates are automatically batched
dispatch({ type: 'count/increment' });
dispatch({ type: 'count/increment' });
dispatch({ type: 'count/increment' });
```

## Scripts

Generated projects include these npm scripts:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Development

### Building the CLI

```bash
cd cli
npm install
npm run build
```

### Testing the CLI

```bash
cd cli
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Learn More

- [modernx-react18 Documentation](https://github.com/perlinson/modernx)
- [React 18 Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [modernx Framework](https://github.com/perlinson/modernx)
