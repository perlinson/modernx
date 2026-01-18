module.exports = {
  "displayName": "modernx-gui",
  "testMatch": [
    "<rootDir>/packages/modernx-gui/**/__tests__/**/*.js",
    "<rootDir>/packages/modernx-gui/**/?(*.)+(spec|test).js"
  ],
  "collectCoverageFrom": [
    "packages/modernx-gui/src/**/*.{js,jsx,ts,tsx}"
  ],
  "moduleNameMapper": {
    "^@modernx/(.*)$": "<rootDir>/packages/$1/src"
  },
  "setupFilesAfterEnv": [
    "<rootDir>/jest.setup.js",
    "<rootDir>/packages/modernx-gui/test/setup.js"
  ]
};