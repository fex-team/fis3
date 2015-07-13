// default settings. fis3 release
fis
  .media('dev')

  .match('**', {
    useHash: true
  });


// fis3 release production
fis
  .media('production')

  .match('demo.js', {
    postpackager: fis.plugin('string'),
    packTo:'pkg/a.js',
  })

  .match('*.{css,scss}', {
    postpackager: fis.plugin('string'),
    packTo:'pkg/a2.css'
    // optimizer: fis.plugin('clean-css'),
    // extras:{a:"123"}
  })
  .match('::packager', {
  packager: fis.plugin('map')
  });
