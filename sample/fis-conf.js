fis.match('(*.html)', {
    release: '/html/$1'
});

fis.match('(**.js)', {
    release: '/static/$1'
});

fis.media('production').match('(*.js)', {
    release: '/production/$1',
    optimizer: fis.plugin('uglify-js', {
        sourceMap: true
    })
});

fis.match('/scripts/**.js', {

    packTo: '/pkg/all.js'
});
