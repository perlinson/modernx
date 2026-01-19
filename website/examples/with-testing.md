# Testing Example

Example of testing ModernX applications with Jest and React Testing Library.

## Installation

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
```

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
```

## Model Testing

```javascript
// src/models/__tests__/counterModel.test.js
import { createApp } from 'modernx';

const counterModel = {
  name: 'counter',
  state: { count: 0 },
  reducers: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    reset: (state) => ({ ...state, count: 0 }),
    setCount: (state, payload) => ({ ...state, count: payload }),
  },
  effects: {
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.increment();
    },
  },
};

describe('Counter Model', () => {
  let app;
  let store;

  beforeEach(() => {
    app = createApp({ models: [counterModel] });
    store = app.getStore();
  });

  test('should have initial state', () => {
    const state = store.getState();
    expect(state.counter.count).toBe(0);
  });

  test('should increment count', () => {
    store.dispatch('counter/increment');
    const state = store.getState();
    expect(state.counter.count).toBe(1);
  });

  test('should decrement count', () => {
    store.dispatch('counter/decrement');
    const state = store.getState();
    expect(state.counter.count).toBe(-1);
  });

  test('should reset count', () => {
    store.dispatch('counter/increment');
    store.dispatch('counter/increment');
    store.dispatch('counter/reset');
    const state = store.getState();
    expect(state.counter.count).toBe(0);
  });

  test('should set count to specific value', () => {
    store.dispatch('counter/setCount', 42);
    const state = store.getState();
    expect(state.counter.count).toBe(42);
  });

  test('should handle async increment', async () => {
    store.dispatch('counter/incrementAsync');
    // Should still be 0 immediately
    expect(store.getState().counter.count).toBe(0);
    
    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(store.getState().counter.count).toBe(1);
  });
});
```

## Component Testing

```javascript
// src/components/__tests__/Counter.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'modernx-core';
import { createApp } from 'modernx';
import Counter from '../Counter';

const counterModel = {
  name: 'counter',
  state: { count: 0 },
  reducers: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
    setCount: (state, payload) => ({ ...state, count: payload }),
  },
  effects: {
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 100));
      this.increment();
    },
  },
};

const createTestApp = () => {
  const app = createApp({ models: [counterModel] });
  return app;
};

const renderWithProvider = (component, app) => {
  return render(
    <Provider app={app}>
      {component}
    </Provider>
  );
};

describe('Counter Component', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('renders counter with initial value', () => {
    renderWithProvider(<Counter />, app);
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument();
  });

  test('increments count when + button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Counter />, app);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  test('decrements count when - button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Counter />, app);
    
    await user.click(screen.getByRole('button', { name: '-' }));
    
    expect(screen.getByText('Count: -1')).toBeInTheDocument();
  });

  test('handles multiple clicks', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Counter />, app);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });

  test('handles async increment', async () => {
    renderWithProvider(<Counter />, app);
    
    fireEvent.click(screen.getByRole('button', { name: 'Async Increment' }));
    
    // Should still be 0 immediately
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    // Wait for async operation
    await waitFor(() => {
      expect(screen.getByText('Count: 1')).toBeInTheDocument();
    }, { timeout: 200 });
  });
});
```

## Integration Testing

```javascript
// src/__tests__/integration/CounterApp.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'modernx-core';
import { createApp } from 'modernx';
import CounterApp from '../../CounterApp';

// Models
const counterModel = {
  name: 'counter',
  state: { count: 0 },
  reducers: {
    increment: (state) => ({ ...state, count: state.count + 1 }),
    decrement: (state) => ({ ...state, count: state.count - 1 }),
  },
};

const userModel = {
  name: 'user',
  state: { name: '', clicks: 0 },
  reducers: {
    setName: (state, payload) => ({ ...state, name: payload }),
    incrementClicks: (state) => ({ ...state, clicks: state.clicks + 1 }),
  },
  effects: {
    async trackClick(action) {
      this.incrementClicks();
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 50));
    },
  },
};

describe('Counter App Integration', () => {
  let app;

  beforeEach(() => {
    app = createApp({ models: [counterModel, userModel] });
  });

  test('full user flow', async () => {
    const user = userEvent.setup();
    render(
      <Provider app={app}>
        <CounterApp />
      </Provider>
    );

    // Initial state
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    expect(screen.getByText('User: Guest')).toBeInTheDocument();
    expect(screen.getByText('Clicks: 0')).toBeInTheDocument();

    // Set user name
    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.click(screen.getByRole('button', { name: 'Set Name' }));
    
    expect(screen.getByText('User: John')).toBeInTheDocument();

    // Increment counter multiple times
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '+' }));
    
    expect(screen.getByText('Count: 3')).toBeInTheDocument();
    expect(screen.getByText('Clicks: 3')).toBeInTheDocument();

    // Decrement counter
    await user.click(screen.getByRole('button', { name: '-' }));
    
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
    expect(screen.getByText('Clicks: 4')).toBeInTheDocument();
  });

  test('handles errors gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock console.error to avoid noise in test output
    const originalError = console.error;
    console.error = jest.fn();

    render(
      <Provider app={app}>
        <CounterApp />
      </Provider>
    );

    // Simulate error condition
    await user.click(screen.getByRole('button', { name: 'Trigger Error' }));
    
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });

    console.error = originalError;
  });
});
```

## Custom Testing Utilities

```javascript
// src/utils/test-utils.js
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'modernx-core';
import { createApp } from 'modernx';

// Default models for testing
const defaultModels = {
  counter: {
    name: 'counter',
    state: { count: 0 },
    reducers: {
      increment: (state) => ({ ...state, count: state.count + 1 }),
      decrement: (state) => ({ ...state, count: state.count - 1 }),
    },
  },
};

// Custom render function
export const renderWithModernX = (
  component,
  { models = defaultModels, ...renderOptions } = {}
) => {
  const app = createApp({ models });
  
  const Wrapper = ({ children }) => (
    <Provider app={app}>{children}</Provider>
  );

  return render(component, { wrapper: Wrapper, ...renderOptions });
};

// Helper to create test models
export const createTestModel = (name, initialState, reducers, effects) => ({
  name,
  state: initialState,
  reducers,
  effects,
});

// Helper to get store state
export const getTestStore = (models = defaultModels) => {
  const app = createApp({ models });
  return app.getStore();
};

// Re-export testing utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
```

## Using Custom Utils in Tests

```javascript
// src/components/__tests__/CounterWithUtils.test.js
import React from 'react';
import { renderWithModernX, screen, userEvent } from '../../utils/test-utils';
import Counter from '../Counter';

describe('Counter with Custom Utils', () => {
  test('renders with default models', () => {
    renderWithModernX(<Counter />);
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('renders with custom models', () => {
    const customModels = {
      counter: {
        name: 'counter',
        state: { count: 10 },
        reducers: {
          increment: (state) => ({ ...state, count: state.count + 1 }),
        },
      },
    };

    renderWithModernX(<Counter />, { models: customModels });
    
    expect(screen.getByText('Count: 10')).toBeInTheDocument();
  });
});
```

## Testing Best Practices

1. **Test models independently** from components
2. **Mock async operations** in effects
3. **Use custom render utilities** for consistent setup
4. **Test user interactions** with userEvent
5. **Test error states** and edge cases
6. **Keep tests focused** and maintainable
7. **Use descriptive test names**
8. **Test integration** between models and components
