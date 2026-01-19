module.exports = {
  title: 'ModernX',
  description: 'Modern React state management framework with concurrent features',
  base: '/modernx',
  dest: 'dist',
  port: 8000,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'Packages', link: '/packages/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Migration', link: '/migration/' },
      { text: 'GitHub', link: 'https://github.com/perlinson/modernx' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Getting Started',
          collapsable: false,
          children: [
            '/guide/introduction',
            '/guide/installation',
            '/guide/quick-start',
            '/guide/concepts'
          ]
        },
        {
          title: 'Advanced',
          collapsable: false,
          children: [
            '/guide/react18-features',
            '/guide/plugins',
            '/guide/testing',
            '/guide/performance'
          ]
        }
      ],
      '/api/': [
        '/api/',
        '/api/createApp',
        '/api/model',
        '/api/effects',
        '/api/hooks'
      ],
      '/packages/': [
        {
          title: 'Core Packages',
          collapsable: false,
          children: [
            '/packages/modernx',
            '/packages/modernx-core',
            '/packages/modernx-cli'
          ]
        },
        {
          title: 'Development Tools',
          collapsable: false,
          children: [
            '/packages/modernx-gui',
            '/packages/modernx-logger'
          ]
        },
        {
          title: 'Plugins',
          collapsable: false,
          children: [
            '/packages/modernx-immer',
            '/packages/modernx-loading'
          ]
        }
      ],
      '/examples/': [
        '/examples/',
        '/examples/basic',
        '/examples/with-router',
        '/examples/with-typescript',
        '/examples/with-testing',
        '/examples/with-gui'
      ],
      '/migration/': [
        '/migration/',
        '/migration/from-dva',
        '/migration/react-router-v6',
        '/migration/react-18'
      ]
    },
    sidebarDepth: 2,
    editLink: true,
    docsRepo: 'https://github.com/perlinson/modernx/tree/master/website',
    docsBranch: 'gh-pages',
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',
    contributors: 'Contributors'
  },
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      '@vuepress/plugin-search',
      {
        searchMaxSuggestions: 10
      }
    ]
  ]
};
