fis.match('*', {
  useHash: false
});

fis.match('::packager', {
  postpackager: fis.plugin('loader', {
    //allInOne: true
  })
});

fis.match('*.{css,less}', {
  release: false,
  packTo: '/static/aio.css'
});
