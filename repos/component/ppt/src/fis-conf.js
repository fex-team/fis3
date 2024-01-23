fis.config.merge({
    modules : {
        parser : {
            md : 'marked'
        }
    },
    roadmap : {
        ext : {
            md : 'html'
        },
        path : [
            {
                reg : '**.md',
                release : false
            },
            {
                reg : '**',
                release : 'report$&'
            }
        ]
    },
	deploy : {
		fe : {
			receiver : 'http://zhangyunlong.fe.baidu.com/receiver.php',
			to : '/home/zhangyunlong/public_html'
		}
	}
});