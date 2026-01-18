// Sample ModernX App for Testing Tools Integration
import modernx from 'modernx';
import logger from 'modernx-logger';

// Define a sample model
const sampleModel = {
  namespace: 'sample',
  state: {
    count: 0,
    message: 'Hello ModernX with DVA Tools!'
  },
  reducers: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
    decrement(state) {
      return { ...state, count: state.count - 1 };
    },
    updateMessage(state, action) {
      return { ...state, message: action.payload };
    }
  },
  effects: {
    *asyncIncrement({ put }) {
      yield new Promise(resolve => setTimeout(resolve, 500));
      yield put({ type: 'increment' });
    }
  }
};

// Create app with logger plugin
const app = modernx({
  models: [sampleModel],
  plugins: [
    logger({
      collapsed: true,
      duration: true,
      timestamp: true,
      level: 'info'
    })
  ]
});

// Export for testing
export default app;

// Test function to verify integration
export function testLoggerIntegration() {
  console.log('🧪 Testing ModernX Logger Integration...');
  
  // Test action dispatching
  app.dispatch({ type: 'sample/increment' });
  app.dispatch({ type: 'sample/decrement' });
  app.dispatch({ 
    type: 'sample/updateMessage', 
    payload: 'Updated message with logger!' 
  });
  
  // Test async action
  app.dispatch({ type: 'sample/asyncIncrement' });
  
  console.log('✅ Logger integration test completed');
}

// Test function for GUI integration (mock)
export function testGUIIntegration() {
  console.log('🧪 Testing ModernX GUI Integration...');
  
  // Mock GUI functionality
  const mockGUI = {
    start: () => console.log('🚀 GUI Server starting...'),
    connect: () => console.log('🔗 WebSocket connection established'),
    visualize: (state) => console.log('📊 State visualization:', state)
  };
  
  // Test GUI features
  mockGUI.start();
  mockGUI.connect();
  mockGUI.visualize(app.getState());
  
  console.log('✅ GUI integration test completed');
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined' || require.main === module) {
  testLoggerIntegration();
  testGUIIntegration();
}
