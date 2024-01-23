//静态资源域名，使用spmx release命令时，添加--domains或-D参数即可生效
//fis.config.set('roadmap.domain', 'http://127.0.0.1:8080');

//如果要兼容低版本ie显示透明png图片，请使用pngquant作为图片压缩器，
//否则png图片透明部分在ie下会显示灰色背景
//使用spmx release命令时，添加--optimize或-o参数即可生效
//fis.config.set('settings.optimzier.png-compressor.type', 'pngquant');

//设置jshint插件要排除检查的文件，默认不检查lib、jquery、backbone、underscore等文件
//使用spmx release命令时，添加--lint或-l参数即可生效
//fis.config.set('settings.lint.jshint.ignored', [ 'lib/**', /jquery|backbone|underscore/i ]);

//csssprite处理时图片之间的边距，默认是3px
fis.config.set('settings.spriter.csssprites.margin', 20);

//配置一些seajs.config的配置项
//请不要在此配置alias项，系统会帮你管理的
//fis.config.set('seajs', {});

//使用spmx release是添加-d remote参数，即可将项目发布到http://vm-1.chongzi.kd.io/机器上
//这个机器有时候可能没开启，大家自己另外搭服务器尝试吧
//receiver.php在：https://github.com/fouber/fis-command-release/blob/master/tools/receiver.php
fis.config.set('deploy.remote', {
    receiver : 'http://vm-1.chongzi.kd.io/receiver.php',
    to : '/home/chongzi/Web/'
});