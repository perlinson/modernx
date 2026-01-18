module.exports = {
  "displayName": "modernx-loading",
  "testMatch": [
    "<rootDir>/packages/modernx-loading/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx-loading/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx-loading/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx-loading/test/setup.js"
  ]
};