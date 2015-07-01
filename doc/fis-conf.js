/* global fis */
var build = require('./process');

// project ignores
var ignores = fis.get('project.ignore');
ignores.concat([
  '/process/*',
  '/demo*'
]);

fis.media('prod').match('*', {
  domain: '/fis3-doc'
});

fis.match('*', {
  useHash: false
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
  prepackager: build.buildNav()
});
