module.exports = {
  "displayName": "modernx",
  "testMatch": [
    "<rootDir>/packages/modernx/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx/test/setup.js"
  ]
};