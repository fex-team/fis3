    fis.config.merge({
        roadmap : {
            domain : {
                //所有css文件添加http://localhost:8080作为域名
                '**.css' : 'http://localhost:8080'
            },
            path : [
                {
                    //所有的js文件
                    reg : '**.js',
                    //发布到/static/js/xxx目录下
                    release : '/static/js$&'
                },
                {
                    //所有的css文件
                    reg : '**.css',
                    //发布到/static/css/xxx目录下
                    release : '/static/css$&'
                },
                {
                    //所有image目录下的.png，.gif文件
                    reg : /^\/images\/(.*\.(?:png|gif))/i,
                    //发布到/static/pic/xxx目录下
                    release : '/static/pic/$1'
                }
            ]
        }
    });