fis.require('smarty')(fis);

fis.set('namespace', "bookeditor");

fis
    .media('dev')
    .match('**' , {
        useHash: false
    });

//fis.match('*', {
//      deploy: fis.plugin('local-deliver', {
//        to: "../output"
//      })
//});

fis.set('project.charset', 'gbk');




// fis.match( /\/(ueditor\/.*$)/i , {
//     useHash: false,
//     release: '/static/${namespace}/js/$1'
// });

// fis.match( /^\/static\/js\/util\.js/i , {
//     isMod: true,
//     release: '/static/${namespace}/js/util.js'
// });

// fis.match( /^\/widget\/(.*\.tpl)$/i , {
//     isMod: true,
//     url : '${namespace}/widget/$1',
//     release : '/template/${namespace}/widget/$1'
// });

// fis.match( /^\/widget\/(.*\.(js|css))$/i , {
//     isMod: true,
//     release : '/static/${namespace}/widget/$1'
// });

// fis.match( /^\/page\/(.+\.tpl)$/i , {
//     isMod: true,
//     release : '/template/${namespace}/page/$1',
//     extras: {
//             isPage: true
//         }
// });

// fis.match( /\.tmpl$/i , {
//     release : false
// });

// fis.match( /^\/(static|data)\/(.*)/i , {
//     release: '/$1/${namespace}/$2'
// });

// fis.match( /^\/plugin\/.*\.php$/i , {
//     release: '/template/$&'
// });

// fis.match( "domain.conf" , {
//     release: 'template/config/$&'
// });

// fis.match( /^\/config\/(.*)/i , {
//     release: '/template/config/$1'
// });

// fis.match( "build.sh" , {
//     release: false
// });

// fis.match( '${namespace}-map.json' , {
//     release: '/template/config/${namespace}-map.json'
// });

// // fis.match( /^.+$/ , {
// //     release: '/static/${namespace}$&'
// // });

// fis.set('smarty', {
//     'left_delimiter': '<{',
//     'right_delimiter': '}>'
// });

// fis.match('/static/js/jquery.js', {
//     packTo: 'pkg/aio.js'
// });

// fis.match('/static/js/jquery.color.js', {
//     packTo: 'pkg/aio.js'
// });

// fis.match('/static/js/util.js', {
//     packTo: 'pkg/aio.js'
// });

// fis.match('/static/js/bootstrap.js', {
//     packTo: 'pkg/aio.js'
// });

// fis.match(/^static\/css\/.*\.css$/i, {
//     packTo: 'pkg/aio.css'
// });
//wangrui

fis.match(/^static\/css\/.*\.css$/i, {
    packTo: 'pkg/aio.css'
});
fis.match('/static/js/bootstrap.js', {
    packTo: 'pkg/aio.js'
});
fis.match('/static/js/util.js', {
    packTo: 'pkg/aio.js'
});
fis.match('/static/js/jquery.color.js', {
    packTo: 'pkg/aio.js'
});
fis.match('/static/js/jquery.js', {
    packTo: 'pkg/aio.js',
    packOrder: -100
});
fis.set('smarty', {
    'left_delimiter': '<{',
    'right_delimiter': '}>'
});
// fis.match( /^.+$/ , {
//     release: '/static/${namespace}$&'
// });

fis.match( '${namespace}-map.json' , {
    release: '/template/config/${namespace}-map.json'
});
fis.match( "build.sh" , {
    release: false
});
fis.match( /^\/config\/(.*)/i , {
    release: '/template/config/$1'
});
fis.match( "domain.conf" , {
    release: 'template/config/$&'
});
fis.match( /^\/plugin\/.*\.php$/i , {
    release: '/template/$&'
});
fis.match( /^\/(static|data)\/(.*)/i , {
    release: '/$1/${namespace}/$2'
});
fis.match( /\.tmpl$/i , {
    release : false
});
fis.match( /^\/page\/(.+\.tpl)$/i , {
    isMod: true,
    release : '/template/${namespace}/page/$1',
    extras: {
            isPage: true
        }
});
fis.match( /^\/widget\/(.*\.(js|css))$/i , {
    isMod: true,
    release : '/static/${namespace}/widget/$1'
});
fis.match( /^\/widget\/(.*\.tpl)$/i , {
    isMod: true,
    url : '${namespace}/widget/$1',
    release : '/template/${namespace}/widget/$1'
});
fis.match( /^\/static\/js\/util\.js/i , {
    isMod: true,
    release: '/static/${namespace}/js/util.js'
});
fis.match( /\/(ueditor\/.*$)/i , {
    useHash: false,
    release: '/static/${namespace}/js/$1'
});

// fis.match('*.js', {
//     optimizer: false
// })
