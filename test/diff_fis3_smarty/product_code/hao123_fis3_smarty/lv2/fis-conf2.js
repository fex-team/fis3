





//wangrui


fis.require('smarty')(fis);

fis.set('namespace', "lv2");

fis
    .media('dev')
    .match('**' , {
        useHash: false
    });

fis.set('smarty', {
    'left_delimiter': '<%',
    'right_delimiter': '%>'
});

fis.set('spriter', {
    csssprites: {
                //图之间的边距
                margin: 5
            }
});

fis.set('optimizer', {
    'png-compressor' : {
                type : 'pngquant' //default is pngcrush
            }
});

fis.set('preprocessor', {
    'widget-inline': {
                include: /.+/i,
                exclude: /(rightcolumn|bottombar|footer|\$)/i
            }
});

fis.set('pack', {
    'pkg/lv2_h_v_js.js': [
            '/widget/nav-list-h/nav-list-h.js',
            '/widget/nav-list-v/nav-list-v.js',
            '/widget/lv2-app/lv2-app.js',
            '/widget/backtop/backtop.js'
        ],
        'pkg/lottery_lv2.js':[
            '/widget/ui/md5/md5.js',
            '/widget/site-list-v/lottery/vnLotteryBase.js',
            '/widget/site-list-v/lottery/vnLotteryLv2.js'
        ],
        'pkg/statement_lv2.js':[
            '/widget/statement/statement.js'
        ],
        'pkg/sparktab_async.js':[
            '/widget/ui/suggest/suggest.js',
            '/widget/ui/cycletabs/cycletabs.js',
            '/widget/ui/spark-app/spark-app.js'
        ],
        'pkg/sparktab_common.js':[
            '/widget/spark-hotsite/spark-hotsite-async.js',
            '/widget/spark-game/spark-game-async.js',
            '/widget/spark-picture/spark-picture-async.js',
            '/widget/spark-site/spark-site-async.js',
            '/widget/spark-video/spark-video-async.js',
            '/widget/spark-shopping/spark-shopping-async.js'
        ],
        'pkg/sparktab_common_ltr.css':[
            //'/widget/search-box-4ps/ltr/ltr.more.css',
            '/widget/spark-hotsite/ltr/ltr.more.css',
            '/widget/spark-picture/ltr/ltr.more.css',
            '/widget/spark-site/ltr/ltr.more.css',
            '/widget/spark-video/ltr/ltr.more.css',
            '/widget/spark-game/ltr/ltr.more.css',
            '/widget/spark-shopping/ltr/ltr.more.css',
            '/widget/ui/cycletabs/ltr/ltr.more.css'
        ],
        'pkg/sparktab_common_rtl.css':[
            //'/widget/search-box-4ps/rtl/rtl.more.css',
            '/widget/spark-hotsite/rtl/rtl.more.css',
            '/widget/spark-picture/rtl/rtl.more.css',
            '/widget/spark-site/rtl/rtl.more.css',
            '/widget/spark-video/rtl/rtl.more.css',
            '/widget/spark-game/rtl/rtl.more.css',
            '/widget/spark-shopping/rtl/rtl.more.css',
            '/widget/ui/cycletabs/rtl/rtl.more.css'
        ],
        'pkg/pcfstatic_lv2.js':[
            '/widget/pcfstatic/starthelper.js'
        ],
        'pkg/hao123launcher.js':[
            '/widget/hao123launcher/app.js',
            '/widget/hao123launcher/asyncload.js',
            '/widget/hao123launcher/lazyload.js',
            '/widget/hao123launcher/require.js',
            '/widget/hao123launcher/sidebar-lib.js'
        ],
        'pkg/lv2_pcf_everydaynews.js': [
            '/widget/pcfstatic/everyDayNews/entertainment/entertainment.js',
            '/widget/pcfstatic/everyDayNews/hotspot/hotspot.js',
            '/widget/pcfstatic/everyDayNews/politic/politic.js',
            '/widget/pcfstatic/everyDayNews/royalty/royalty.js',
            '/widget/pcfstatic/everyDayNews/sport/sport.js',
            '/widget/pcfstatic/everyDayNews/everydaynews-async.js'
        ],
        'pkg/lv2_ltr_css.css': [
            '/widget/backtop/ltr/ltr.css'
        ],
        'pkg/lv2_rtl_css.css': [
            '/widget/backtop/rtl/rtl.css'
        ],
        'pkg/lv2_h_ltr.css': [
            '/widget/nav-list-h/ltr/ltr.css',
            '/widget/site-list-h/**/ltr/**.css'
        ],
        'pkg/lv2_h_rtl.css': [
            '/widget/nav-list-h/rtl/rtl.css',
            '/widget/site-list-h/**/rtl/**.css'
        ],
        'pkg/lv2_v_ltr.css': [
            '/widget/nav-list-v/ltr/ltr.css',
            '/widget/site-list-v/**/ltr/**.css',
            '/widget/lv2-app/ltr/ltr.css'
        ],
        'pkg/lv2_v_rtl.css': [
            '/widget/nav-list-v/rtl/rtl.css',
            '/widget/site-list-v/**/rtl/**.css',
            '/widget/lv2-app/rtl/rtl.css'
        ],
        'pkg/lv2_v_ltr-new.css': [
            '/widget/nav-list-v-new/ltr/ltr.css',
            '/widget/site-list-v-new/**/ltr/**.css',
            '/widget/lv2-app-new/ltr/ltr.css'
        ],
        'pkg/lv2_v_rtl-new.css': [
            '/widget/nav-list-v-new/rtl/rtl.css',
            '/widget/site-list-v-new/**/rtl/**.css',
            '/widget/lv2-app-new/rtl/rtl.css'
        ],
        'pkg/lv2_about_ltr.css': [
            '/widget/about-sites-list/ltr/ltr.css',
            '/widget/about-sites-nav/ltr/ltr.css'
        ],
        'pkg/lv2_about_rtl.css': [
            '/widget/about-sites-list/rtl/rtl.css',
            '/widget/about-sites-nav/rtl/rtl.css'
        ],
        'pkg/lv2_about_ltr-new.css': [
            '/widget/about-sites-list-new/ltr/ltr.css',
            '/widget/about-sites-nav-new/ltr/ltr.css'
        ],
        'pkg/lv2_about_rtl-new.css': [
            '/widget/about-sites-list-new/rtl/rtl.css',
            '/widget/about-sites-nav-new/rtl/rtl.css'
        ],
        'pkg/lv2_channel_ltr.css': [
            '/widget/channel/ltr/ltr.css'
        ],
        'pkg/lv2_how_ltr.css': [
            '/widget/how/ltr/ltr.css'
        ],
        'pkg/lv2_how_rtl.css': [
            '/widget/how/rtl/rtl.css'
        ],
        'pkg/lv2_middle_ltr.css': [
            '/widget/middle/ltr/ltr.css'
        ],
        'pkg/lv2_middle_rtl.css': [
            '/widget/middle/rtl/rtl.css'
        ],
        'pkg/lv2_statement_ltr.css': [
            '/widget/statement/ltr/ltr.css'
        ],
        'pkg/lv2_statement_rtl.css': [
            '/widget/statement/rtl/rtl.css'
        ],
        'pkg/lv2_pcf_everydaynews_ltr.css': [
            '/widget/pcfstatic/everyDayNews/entertainment/ltr.css',
            '/widget/pcfstatic/everyDayNews/hotspot/ltr.css',
            '/widget/pcfstatic/everyDayNews/politic/ltr.css',
            '/widget/pcfstatic/everyDayNews/royalty/ltr.css',
            '/widget/pcfstatic/everyDayNews/sport/ltr.css',
            '/widget/pcfstatic/everyDayNews/ltr/ltr.css'
        ]
});


fis.config.set('modules.optimizer.tpl','html-compress');


fis.match(/\/static\/nts\/(.+)$/ , {
    useHash: false,
  release: "/static/lv2/$1"
});
