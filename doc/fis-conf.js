/* global fis */
var build = require('./process');

fis.get('project.ignore').push('/process/*');

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
