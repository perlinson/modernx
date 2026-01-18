module.exports = {
  collectCoverageFrom: ['packages/**/src/*.{ts,tsx,js,jsx}'],
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/packages/modernx/$1',
  },
};
