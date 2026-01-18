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
  runtimeHelpers: false,
  // 简化 Babel 配置，避免冲突
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
        browsers: ['> 1%', 'last 2 versions'],
        node: '14'
      },
      // 禁用所有可能冲突的插件
      useBuiltIns: false,
      corejs: false,
      // 禁用类属性转换
      include: [
        'transform-arrow-functions',
        'transform-block-scoped-functions',
        'transform-template-literals',
        'transform-literals',
        'transform-function-name',
        'transform-shorthand-properties',
        'transform-computed-properties',
        'transform-for-of',
        'transform-sticky-regex',
        'transform-unicode-escapes',
        'transform-dotall-regex',
        'transform-named-capturing-groups-regex',
        'transform-unicode-regex',
        'transform-async-to-generator',
        'transform-regenerator',
        'transform-exponentiation-operator',
        'transform-object-rest-spread',
        'transform-object-super'
      ]
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }]
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
