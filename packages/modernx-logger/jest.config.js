module.exports = {
  "displayName": "modernx-logger",
  "testMatch": [
    "<rootDir>/packages/modernx-logger/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx-logger/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx-logger/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx-logger/test/setup.js"
  ]
};