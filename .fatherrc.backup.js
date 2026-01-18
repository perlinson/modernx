module.exports = {
  esm: 'babel',
  cjs: {
    type: 'babel',
    lazy: true,
  },
  umd: {
    name: 'modernx',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      redux: 'Redux',
      'react-redux': 'ReactRedux',
      'redux-saga': 'createSagaMiddleware',
      invariant: 'invariant',
      'is-plain-object': 'isPlainObject',
      warning: 'warning',
      flatten: 'flatten'
    },
  },
  lessInBabelMode: true,
  cssModules: false,
  extractCSS: false,
  injectCSS: false,
  runtimeHelpers: false, // 修复 runtime helpers 冲突
  extraBabelPlugins: [
    ['@babel/plugin-transform-runtime', {
      corejs: false,
      helpers: true,
      regenerator: true,
    }],
  ],
  extraBabelPresets: [
    ['@babel/preset-env', {
      modules: false,
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8'],
        node: '14'
      },
      // 修复 loose 模式冲突
      loose: false
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
  ],
  target: 'browser',
  doc: {
    themeConfig: {
      name: 'modernx',
    },
    base: '/modernx',
    publicPath: '/modernx/',
  },
};
