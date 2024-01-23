fis.config.merge({
    //插件配置节点
    modules : {
        //编译器插件配置节点
        parser : {
            //使用fis-parser-marked插件编译md后缀文件
            md : 'marked'
        }
    },
    roadmap : {
        ext : {
            //md后缀的文件编译为html
            md : 'html'
        },
        //配置所有资源的domain
        domain : 'http://fis.baidu.com',
        path : [
            {
                //map.json文件
                reg : 'map.json',
                //发布到/config/map.json
                release : '/config/map.json'
            },
            {
                //widget下的tpl文件
                reg : /^\/(widget\/.*\.tpl)/i,
                //是组件化的
                isMod : true,
                //模板资源路径在widget/xxx
                url : '$1',
                //发布到/template/widget/xxx目录
                release : '/template/$1'
            },
            {
                //widget下的js文件
                reg : /^\/(widget\/.*\.js)/i,
                //是组件化的
                //组件化的js文件会经过fis-postprocessor-jswrapper插件的define包装
                isMod : true,
                //发布到/static/widget/xxx.js
                release : '/static/$1'
            },
            {
                //其他tpl文件
                reg : '**.tpl',
                //发布到/template/目录下
                release : '/template$&'
            },
            {
                //md文件
                reg : '**.md',
                //发布到/template/目录下
                release : '/template$&'
            },
            {
                //php文件直接发布
                reg : '**.php'
            },
            {
                //sh文件
                reg : '**.sh',
                //不要发布
                release : false
            },
            {
                reg : '**.ico',
                useHash : false,
                release : '/static$&'
            },
            {
                //其他所有文件
                reg : /^\/(.*)$/,
                //发布到/static/目录下
                release : '/static/$1'
            }
        ]
    },
    settings : {
        postprocessor : {
            //fis-postprocessor-jswrapper插件配置数据
            jswrapper : {
                //使用define包装js组件
                type : 'amd'
            }
        }
    },
    pack : {
        'pkg/aio.js' : [
            'lib/js/mod.js',
            'lib/js/**.js',
            '**.js'
        ],
        'pkg/aio.css' : [
            'lib/css/bootstrap.css',
            'lib/css/bootstrap-responsive.css',
            'lib/css/style.css',
            'lib/css/**.css',
            '**.css'
        ]
    },
    deploy : {
        remote : {
			receiver : 'http://zhangyunlong.fe.baidu.com/receiver.php',
            to : '/home/zhangyunlong/public_html/'
        },
        local : {
            to : '/home/zhangyunlong/fis.baidu.com'
        }
    }
});