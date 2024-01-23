fis.config.merge({
    namespace : 'photo',
    roadmap : {
        domain : {
            '*.js' : 'http://localhost:8080',
            '*.css' : 'http://localhost:8080'
        },
        path : [
            {
                reg : /^\/test\//i,
                release : false
            },
            {
                reg : /\.tmpl$/i,
                release : false
            },
            {
                reg : /^\/widget\/.*\.(js|css)$/i,
                isMod : true,
                release : '/static/${namespace}$&'
            },
            {
                reg : /^\/widget\/(.*\.tpl)$/i,
                isMod : true,
                url : 'widget/${namespace}/$1',
                release : '/template/widget/${namespace}/$1'
            },
            {
                reg : /^\/plugin\//i
            },
            {
                reg : /^\/.+\.tpl$/i,
                release : '/template/${namespace}$&'
            },
            {
                reg : /^\/photo-map\.json$/i,
                release : '/config$&'
            },
            {
                reg : 'server.conf'
            },
            {
                reg : /^.*$/,
                release : '/static/${namespace}$&'
            }
        ]
    },
    settings : {
        postprocessor : {
            jswrapper : {
                type : 'amd'
            }
        }
    },
    deploy : {
        'rd-test' : {
            receiver : 'http://zhangyunlong.fe.baidu.com/receiver.php',
            to : '/home/zhangyunlong/public_html'
        }
    },
    pack : {
        'static/pkg/aio.js' : [ 'mod.js', '**.js' ],
        'static/pkg/aio.css' : '**.css'
    }
});
