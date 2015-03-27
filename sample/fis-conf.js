fis.match('(*.html)', {
    release: '/html/$1'
});

fis.media('dev').match('(*.js)', {
    release: '/static/$1'
});

fis.media('production').match('(*.js)', {
    release: '/production/$1',
    optimize: 'uglify-js'
});
