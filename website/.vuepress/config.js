module.exports = {
  title: 'ModernX',
  description: 'Modern React state management framework with concurrent features',
  base: '/modernx/',
  dest: 'dist',
  port: 8000,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
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
      '/examples/': [
        '/examples/',
        '/examples/basic',
        '/examples/with-router',
        '/examples/with-typescript',
        '/examples/with-testing'
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
