
// 测试环境设置
process.env.NODE_ENV = 'test';
process.env.MODERNX_ENV = 'test';

// 设置测试超时
jest.setTimeout(30000);

// 全局测试工具
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};

// 模拟浏览器环境
if (typeof window === 'undefined') {
  global.window = {};
  global.document = {};
  global.navigator = {};
}
