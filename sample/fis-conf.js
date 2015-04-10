fis.get('project.files').push('scripts/**.js');

fis.match('*.html', {
    release: '/html/$0',
    useMap: true
});

fis.match('*.js', {
    release: '/static/$0'
});

fis.match('scripts/(**.js)', {
    release: '/static/blbla/$1'
});

fis.media('production').match('*.js', {
    release: '/production/$0',
    optimizer: fis.plugin('uglify-js', {
        sourceMap: true
    })
});

fis.match('scripts/**.js', {

    packTo: '/pkg/all.js'
});
