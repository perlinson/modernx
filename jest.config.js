module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  projects: [
    '<rootDir>/packages/*'
  ],
  moduleNameMapper: {
    '^@modernx/(.*)$': '<rootDir>/packages/$1/src'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};