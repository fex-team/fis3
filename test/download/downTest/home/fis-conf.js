fis.config.merge({
    namespace : 'home',
    pack : {
        'static/pkg/aio.css' : [
            'static/lib/css/bootstrap.css',
            'static/lib/css/bootstrap-responsive.css',
            'widget/**.css'
        ],
        'static/pkg/aio.js' : [
            'static/lib/js/jquery-1.10.1.js',
            'widget/**.js'
        ]
    }
});