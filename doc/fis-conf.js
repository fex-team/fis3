/* global fis */
var build = require('./process');

// project ignores
var ignores = fis.get('project.ignore');
ignores = ignores.concat([
  'process/**',
  'demo/**',
  '*.psd',
  'README.md',
  '**.adoc',
  'package.json'
]);

fis.set('project.ignore', ignores);
// settings
fis.media('prod').set('domain', '/fis3');

fis.match('docs/**.md', {
  parser: build.markdownParse(),
  useDomain: true,
  isDoc: true,
  rExt: '.html',
  _isResourceMap: false // 强制不让替换 `__RESOURCE__MAP__`
});

fis.match('docs/INDEX.md', {
  useCache: false,
  isIndex: true
});

fis.match('::package', {
  prepackager: [build.buildNav(), build.hackActiveTab()],
  postpackager: [
    build.replaceDefine({
      'BASE_PATH': fis.media().get('domain'),
      'SITE_DESC': 'FIS3 面向前端的工程构建系统',
      'SITE_AUTHOR': 'fis-team'
    })
  ]
});

//--- prod ---

fis.media('prod')
  .match('*', {
    domain: fis.media().get('domain')
  })
  .match('*.{js,css,png,gif,eot,svg,ttf,woff,woff2}', {
    useHash: true
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
fis.media('prod').match('::package', {
  //postpackager: fis.plugin('loader', {}, 'append')
});



