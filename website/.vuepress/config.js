module.exports = {
  title: 'dva-react18',
  description: 'React 18 enhanced dva framework with concurrent features',
  base: '/dva-react18/',
  dest: 'dist',
  port: 8000,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Features', link: '/features' },
      { text: 'Examples', link: '/examples' },
      {   text: 'API', link: '/api' },
      { text: 'Migration', link: '/migration' },
      { text: 'GitHub', link: 'https://github.com/perlinson/dva' }
    ],
    sidebar: 'auto',
    sidebarDepth: 2,
    editLink: true,
    docsRepo: 'https://github.com/perlinson/dva/tree/master/docs',
    docsBranch: 'gh-pages',
    editLinkText: 'Edit this page on GitHub'
  }
};
