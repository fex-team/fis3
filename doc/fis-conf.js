/* global fis */
var build = require('./process');

// project ignores
var ignores = fis.get('project.ignore');
ignores = ignores.concat([
  'process/**',
  'demo/**',
  'README.md',
  '**.adoc',
  'package.json'
]);

fis.set('project.ignore', ignores);

fis.media('prod').set('domain', '/fis3');

fis.media('prod')
  .match('*', {
    useHash: true,
    domain: fis.media().get('domain')
  })
  .match('*.js', {
    optimizer: fis.plugin('uglify-js'),
    packTo: '/static/aio.js'
  })
  .match('*.min.js', {
    optimizer: null
  })
  .match('*.css', {
    optimizer: fis.plugin('clean-css'),
    packTo: '/static/aio.css'
  });

// set pack
// fis.media('prod').set('packager', fis.plugin('loader'));


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
  prepackager: [build.buildNav(), build.hackActiveTab()],
  postpackager: [
    build.replaceDefine({
      'BASE_PATH': fis.media().get('domain'),
      'SITE_DESC': 'FIS3 面向前端的工程构建系统',
      'SITE_AUTHOR': 'fis-team'
    }),
    fis.media().get('packager') || function() {}
  ]
});