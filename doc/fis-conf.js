/* global fis */
var build = require('./process');

// project ignores
var ignores = fis.get('project.ignore');
ignores.concat([
  '/process/*',
  '/demo*',
  '/README.md'
]);

fis.media('prod').match('*', {
  domain: '/fis3'
});

fis.media('prod').set('domain', '/fis3');

fis.match('*', {
  useHash: false,
  domain: fis.media().get('domain')
});

fis.match('docs/**.md', {
  parser: build.markdownParse(),
  useDomain: true,
  isDoc: true,
  rExt: '.html'
});

fis.match('docs/INDEX.md', {
  useCache: false,
  isIndex: true
});

fis.match('::packager', {
  prepackager: build.buildNav(),
  postpackager: build.replaceDefine(
    {
      'BASE_PATH': fis.media().get('domain'),
      'SITE_DESC': 'FIS3 面向前端的工程构建系统',
      'SITE_AUTHOR': 'fis-team'
    }
  )
});
