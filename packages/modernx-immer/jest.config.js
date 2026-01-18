module.exports = {
  "displayName": "modernx-immer",
  "testMatch": [
    "<rootDir>/packages/modernx-immer/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx-immer/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx-immer/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx-immer/test/setup.js"
  ]
};