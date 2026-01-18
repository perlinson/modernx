module.exports = {
  "displayName": "modernx-core",
  "testMatch": [
    "<rootDir>/packages/modernx-core/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx-core/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx-core/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx-core/test/setup.js"
  ]
};