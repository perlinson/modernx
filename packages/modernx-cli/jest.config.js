module.exports = {
  "displayName": "modernx-cli",
  "testMatch": [
    "<rootDir>/packages/modernx-cli/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx-cli/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx-cli/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx-cli/test/setup.js"
  ]
};