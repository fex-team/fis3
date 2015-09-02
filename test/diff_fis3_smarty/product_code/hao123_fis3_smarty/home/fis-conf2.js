//rtl,ltr首页公共模块
var index_commonCss = [/^\/widget\/ui\/mod-frame\/(.*\.css)$/i,'/widget/hot-site/game-history/game-history.css'];
//页面底部的css,由于目前量比较小，所以与右侧栏一起打包
var footer_ltr_css = ['/widget/bottombar/ltr/ltr.css'],
    footer_rtl_css = ['/widget/bottombar/rtl/rtl.css'];


//首页的公共的
// fis.config.merge({
//     namespace : 'home',
//     roadmap: {
//     	domain: {
//     		"image": "<%$root.head.cdn%>"
//     	}
//     },
//     pack: {
//         //合并打包配置
//         'pkg/index_full_js.js': [
//         	// 列出所有国家都用得着的资源：最全(个别资源特大模块除外)
//             '/widget/hot-site/hot-site-async.js',
//             '/widget/customsites/customsites-async.js',
//             '/widget/sortsite/sortsite-async.js',
//             '/widget/sort-area/sort-area-tab-async.js',
//             '/widget/sort-area/sort-area-nav-async.js',
//             '/widget/sort-area/create-content-async.js',
//             '/widget/sort-area/sort/sort-async.js',
//             '/widget/hot-site/game-history/game-history-async.js',
//             '/widget/snow/snow-async.js'

//         ],
//     	'pkg/async_js.js': [
//         	/^\/widget\/ui\/speed-test\/(.*\.js)$/i,
//             '/widget/anchorbar/anchorbar-async.js',
//             '/widget/ui/charts/charts.js',
//             '/widget/news/mod-news.js',
// 	        '/widget/ui/astro/astro.js',
//             '/widget/magicbox/magicbox-async.js',
//             '/widget/news/news-async.js',
//             '/widget/promote/promote-async.js',
//             '/widget/resulttest/resulttest-async.js',
// 	        '/widget/ui/bus/bus.js',
// 	        '/widget/ui/pray/pray.js',
// 	        '/widget/ui/translate/translate.js',
// 	        '/widget/ui/gold/gold.js',
// 	        '/widget/ui/score/score.js',
//             '/widget/ui/tvlive/tvlive.js',
// 	        '/widget/ui/football/football.js',
//             '/widget/lyrics/lyrics-async.js',
//             '/widget/ui/usedcar/usedcar.js',
//             '/widget/rate/rate-async.js',
//             '/widget/ui/anchorside/anchorside.js',
//             '/widget/history-add/history-add-async.js',
//             '/widget/user-guider/user-guider-async.js',
//             '/widget/big-ad-switch/big-ad-switch-async.js',
//             '/widget/ui/side-like/side-like-async.js'
//     	],
//         'pkg/lottery_vn.js': [
//             '/widget/ui/lottery/vnLotteryBase.js',
//             '/widget/ui/lottery/vnLotteryIndex.js'
//         ],
//         'pkg/bottoms.js': [
//             '/widget/bottom/bottom-async.js',
//             '/widget/bottom-vote/bottom-vote-async.js',
//             '/widget/bottomImage/bottomImage-async.js',
//             '/widget/bottom-ecommerce/bottom-ecommerce-async.js',
//             '/widget/br-bottom-vote/br-bottom-vote-async.js',
//             '/widget/bottom-book/bottom-book-async.js'
//         ],
//         'pkg/sidebar_js.js': [
//             '/widget/sidetoolbar/sidetoolbar-async.js',
//             '/widget/sidebar-appbox/sidebar-appbox-async.js',
//             '/widget/valentine/valentine-async.js',
//         ],
//         'pkg/sidebar_facebook.js': [
//             'widget/ui/sidebar-facebook/fbclient-tpl.js',
//             'widget/ui/sidebar-facebook/fbclient-core.js',
//             'widget/ui/sidebar-facebook/fbclient.js',
//             'widget/ui/sidebar-facebook/facebook.js',
//             'widget/sidebar-embed-iframe/sidebar-embed-iframe-async.js',
//         ],
//         'pkg/recommand.js': [
//             'widget/recommand/recommand-async.js',
//             'widget/recommand/layout2/layout2-async.js',
//             'widget/recommand/football/football-async.js'
//         ],

//         'pkg/index_common.css': index_commonCss,
//         //首页首屏模块和公共模块(ltr)
//         'pkg/index_ltr.css': [

// 	        //首页首屏模块
// 	        // '/widget/ui/side-mod-frame/ltr/ltr.css',
// 	        '/widget/css-module-base/ltr/ltr.css',
// 	        // merge the widgets
//             '/widget/history/ltr/ltr.more.css',
//             '/widget/hot-site/ltr/ltr.more.css',
//             '/widget/customsites/ltr/ltr.more.css',
// 	        '/widget/sortsite/ltr/ltr.more.css',
//             '/widget/sort-area/tab/ltr/ltr.css',
//             '/widget/sort-area/nav/ltr/ltr.css',
//             '/widget/sort-area/sort/ltr/ltr.more.css',
//             '/widget/popupsite/ltr/ltr.css',
// 	        '/widget/notepad/ltr/ltr.css',
//             '/widget/send-bless/ltr/ltr.css',
//         ],
//         // 两种布局自动切换样式(ltr)
//         'pkg/flow_ltr.css': [
//             '/widget/trigger-flow/ltr/ltr.css',
//             /^\/widget\/(?!customsite|hot-site|sort-area).*?\/flow\/ltr\/ltr.flow.css$/i
//         ],
//         // 右边栏（明飞）模块单独合并(ltr)
//         'pkg/rightcolumn_ltr.css': [
//             '/widget/ui/side-mod-frame/ltr/ltr.css',
//             '/widget/recommand/ltr/ltr.css',
//             '/widget/recommand/layout1/ltr/ltr.css',
//             '/widget/recommand/layout2/ltr/ltr.css',
//             '/widget/recommand/layout3/ltr/ltr.css',
//             '/widget/recommand/football/ltr/ltr.css',
//         	'/widget/anchorbar/ltr/ltr.css',
// 	        '/widget/speed-test/ltr/ltr.css',
// 	        '/widget/lottery/lottery.css',
// 	        '/widget/astro/ltr/ltr.css',
// 	        '/widget/pray/ltr/ltr.css',
// 	        '/widget/magicbox/ltr/ltr.css',
// 	        '/widget/bus/ltr/ltr.css',
// 	        '/widget/translate/ltr/ltr.css',
// 	        '/widget/gold/ltr/ltr.css',
// 	        '/widget/score/ltr/ltr.css',
// 	        '/widget/tvlive/ltr/ltr.css',
// 	        '/widget/football/ltr/ltr.css',
// 	        '/widget/charts/ltr/ltr.css',
//             '/widget/news/ltr/ltr.css',
//             '/widget/ad-switch/ltr/ltr.css',
//             '/widget/big-ad-switch/ltr/ltr.css',
//             '/widget/mail/ltr/ltr.css',
// 	        '/widget/useful/ltr/ltr.css',
//             '/widget/lyrics/ltr/ltr.css',
//             '/widget/anchorside/ltr/ltr.css',
//             '/widget/side-like/ltr/ltr.css' 
//             // '/widget/rate/ltr/ltr.css'暂时ltr还没有国家有汇率模块
//         ],


//         //首页首屏模块和公共模块(rtl)
//         'pkg/index_rtl.css': [

// 	        //首页首屏模块
// 	        '/widget/css-module-base/rtl/rtl.css',
// 	        '/widget/history/rtl/rtl.more.css',
//             '/widget/popupsite/rtl/rtl.css',
// 	        '/widget/hot-site/rtl/rtl.more.css',
//             '/widget/sort-area/tab/rtl/rtl.css',
//             '/widget/sort-area/nav/rtl/rtl.css',
//             '/widget/sort-area/sort/rtl/rtl.more.css',
//             '/widget/popupsite/rtl/rtl.css',
//             '/widget/customsites/rtl/rtl.more.css',
//             '/widget/send-bless/rtl/rtl.css'
//         ],
//         // 两种布局自动切换样式(rtl)
//         'pkg/flow_rtl.css': [
//             '/widget/trigger-flow/rtl/rtl.css',
//             /^\/widget\/(?!customsite|hot-site|sort-area).*?\/flow\/rtl\/rtl.flow.css$/i
//         ],
//        	  // 右边栏（明飞）模块单独合并
//          'pkg/rightcolumn_rtl.css': [
//             '/widget/ui/side-mod-frame/rtl/rtl.css',
//             '/widget/recommand/rtl/rtl.css',
//             '/widget/recommand/layout1/rtl/rtl.css',
//             '/widget/recommand/layout2/rtl/rtl.css',
//             '/widget/recommand/layout3/rtl/rtl.css',
//             '/widget/recommand/football/rtl/rtl.css',
//          	'/widget/anchorbar/rtl/rtl.css',
// 	        '/widget/speed-test/rtl/rtl.css',
// 	        '/widget/astro/rtl/rtl.css',
// 	        '/widget/pray/rtl/rtl.css',
// 	        '/widget/magicbox/rtl/rtl.css',
// 	        '/widget/resulttest/rtl/rtl.css',
// 	        '/widget/gold/rtl/rtl.css',
//             '/widget/football/rtl/rtl.css',
// 	        '/widget/charts/rtl/rtl.css',
//             '/widget/news/rtl/rtl.css',
//             '/widget/ad-switch/rtl/rtl.css',
//             '/widget/big-ad-switch/rtl/rtl.css',
//             '/widget/mail/rtl/rtl.css',
// 	        '/widget/useful/rtl/rtl.css',
//             '/widget/usedcar/rtl/rtl.css',
//             // merge the widgets
//             '/widget/lyrics/rtl/rtl.css',
//             '/widget/anchorside/rtl/rtl.css',
//             '/widget/rate/rtl/rtl.css'
//         ],
//         //抽样或者国家特有的css单独合成一个包，而不是分别打包,为了不堵塞执行！！！！！！！！！！！！！
//         //ltr
//         'pkg/diff_sample_ltr.css':[
//             '/widget/br-music-player/br-music-player.css',            
//             '/widget/daily-sign/ltr/ltr.css',
//             '/widget/sidebar-history/ltr/ltr.more.css',
//             '/widget/sidebar-notepad/ltr/ltr.css',
//             '/widget/sidebar-embed-iframe/ltr/ltr.css',
//             '/widget/sidebar-shop/ltr/ltr.css',
// 	        '/widget/sidebar-appbox/ltr/ltr.css',
//             '/widget/valentine/ltr/ltr.css',
//             '/widget/user-guider/ltr/ltr.css'
//         ],
//         'pkg/sidetoolbar_ltr.css':[
//             '/widget/sidetoolbar/ltr/ltr.css'
//         ],
//         'pkg/diff_sample_rtl.css':[
//             '/widget/sidetoolbar/rtl/rtl.css',
//             '/widget/sidebar-embed-iframe/rtl/rtl.css',
// 	    '/widget/sidebar-appbox/rtl/rtl.css',
//             '/widget/valentine/rtl/rtl.css',
//             '/widget/user-guider/rtl/rtl.css'
//         ],
//         'pkg/small_ltr.css': [
//             '/widget/notepad/small-ltr/small-ltr.css',
//             '/widget/history/small-ltr/small-ltr.css'
//         ],
//         'pkg/small_rtl.css': [
//             '/widget/notepad/small-rtl/small-rtl.css',
//             '/widget/history/small-rtl/small-rtl.css'
//         ],
//         //metro
//         'pkg/hot-site-metro.css':[
//             //hot-site-metro
//             '/widget/hot-site-metro/ltr/ltr.more.css'
//         ],
//         //metro
//         'pkg/hotsite-newtab.css':[
//             //hot-site-metro
//             '/widget/hotsite-newtab/ltr/ltr.css'
//         ],

//         //bottom为啥不合并？因为bottom不在首屏，对应的css是有条件才会载入!
//         'pkg/bottom_ltr.css':[
//             '/widget/bottom/ltr/ltr.css',
//             '/widget/bottom-vote/ltr/ltr.css',
//             '/widget/bottomImage/ltr/ltr.css',
//             '/widget/bottom-ecommerce/ltr/ltr.css',
//             '/widget/br-bottom-vote/ltr/ltr.css',
//             '/widget/bottom-book/ltr/ltr.css'
//         ],
//         'pkg/bottom_rtl.css':[
//             '/widget/bottom/rtl/rtl.css',
//             '/widget/bottom-vote/rtl/rtl.css',
//             '/widget/bottomImage/rtl/rtl.css',
//             '/widget/br-bottom-vote/rtl/rtl.css',
//             '/widget/bottom-book/rtl/rtl.css'
//         ],
//     },
//     settings: {
//         smarty : {
//             'left_delimiter'  : '<%',
//             'right_delimiter' : '%>'
//         },
//         spriter: {
//             csssprites: {
//                 //图之间的边距
//                 margin: 5
//             }
//         },
//         optimizer : {
//             'png-compressor' : {
//                 type : 'pngquant' //default is pngcrush
//             }
//         },
//          preprocessor: {
//             'widget-inline': {
//                 include: /.+/i,
//                 exclude: /(ad-switch|anchorbar|astro|speed-test|sidebar-preload|music-player|news|joke|hotsite-side|magicbox|useful|mail|rightcolumn|bottombar|footer|bottom-ecommerce|\$)/i
//             }
//         }
//     }
// });
// fis.config.set('modules.optimizer.tpl','html-compress');
// fis.config.get('roadmap.path').unshift({
//   reg: /\/widget\/(.*)\/nts\/(.+)$/,
//   useHash: false,
//   release: "/static/home/widget/$1/nts/$2"
// });


// fis.config.merge({
//     modules: {
//         postpackager: 'ext-map',
//         packager : 'autopack'
//     },
//     //插件参数设置
//     settings: {
//         packager : {
//             autopack : {
//                 //fid为接入自动合并后分配的产品线FID字符串
//                 'fid' : 'globalhao123'
//             }
//         }
//     }
// });

// fis.config.set('settings.spriter.csssprites', {
//     width_limit:102400,
//     height_limit: 102400
// });



//wangrui
fis.require('smarty')(fis);

fis.set('namespace', "home");

fis
    .media('dev')
    .match('**' , {
        useHash: true
    });

fis.set('smarty', {
    'left_delimiter': '<%',
    'right_delimiter': '%>'
});
fis.set('roadmap', {
    domain: {
            "image": "<%$root.head.cdn%>"
        }
});

fis.set('pack', {
    //合并打包配置
        'pkg/index_full_js.js': [
            // 列出所有国家都用得着的资源：最全(个别资源特大模块除外)
            '/widget/hot-site/hot-site-async.js',
            '/widget/customsites/customsites-async.js',
            '/widget/sortsite/sortsite-async.js',
            '/widget/sort-area/sort-area-tab-async.js',
            '/widget/sort-area/sort-area-nav-async.js',
            '/widget/sort-area/create-content-async.js',
            '/widget/sort-area/sort/sort-async.js',
            '/widget/hot-site/game-history/game-history-async.js',
            '/widget/snow/snow-async.js'

        ],
        'pkg/async_js.js': [
            /^\/widget\/ui\/speed-test\/(.*\.js)$/i,
            '/widget/anchorbar/anchorbar-async.js',
            '/widget/ui/charts/charts.js',
            '/widget/news/mod-news.js',
            '/widget/ui/astro/astro.js',
            '/widget/magicbox/magicbox-async.js',
            '/widget/news/news-async.js',
            '/widget/promote/promote-async.js',
            '/widget/resulttest/resulttest-async.js',
            '/widget/ui/bus/bus.js',
            '/widget/ui/pray/pray.js',
            '/widget/ui/translate/translate.js',
            '/widget/ui/gold/gold.js',
            '/widget/ui/score/score.js',
            '/widget/ui/tvlive/tvlive.js',
            '/widget/ui/football/football.js',
            '/widget/lyrics/lyrics-async.js',
            '/widget/ui/usedcar/usedcar.js',
            '/widget/rate/rate-async.js',
            '/widget/ui/anchorside/anchorside.js',
            '/widget/history-add/history-add-async.js',
            '/widget/user-guider/user-guider-async.js',
            '/widget/big-ad-switch/big-ad-switch-async.js',
            '/widget/ui/side-like/side-like-async.js'
        ],
        'pkg/lottery_vn.js': [
            '/widget/ui/lottery/vnLotteryBase.js',
            '/widget/ui/lottery/vnLotteryIndex.js'
        ],
        'pkg/bottoms.js': [
            '/widget/bottom/bottom-async.js',
            '/widget/bottom-vote/bottom-vote-async.js',
            '/widget/bottomImage/bottomImage-async.js',
            '/widget/bottom-ecommerce/bottom-ecommerce-async.js',
            '/widget/br-bottom-vote/br-bottom-vote-async.js',
            '/widget/bottom-book/bottom-book-async.js'
        ],
        'pkg/sidebar_js.js': [
            '/widget/sidetoolbar/sidetoolbar-async.js',
            '/widget/sidebar-appbox/sidebar-appbox-async.js',
            '/widget/valentine/valentine-async.js',
        ],
        'pkg/sidebar_facebook.js': [
            'widget/ui/sidebar-facebook/fbclient-tpl.js',
            'widget/ui/sidebar-facebook/fbclient-core.js',
            'widget/ui/sidebar-facebook/fbclient.js',
            'widget/ui/sidebar-facebook/facebook.js',
            'widget/sidebar-embed-iframe/sidebar-embed-iframe-async.js',
        ],
        'pkg/recommand.js': [
            'widget/recommand/recommand-async.js',
            'widget/recommand/layout2/layout2-async.js',
            'widget/recommand/football/football-async.js'
        ],

        'pkg/index_common.css': index_commonCss,
        //首页首屏模块和公共模块(ltr)
        'pkg/index_ltr.css': [

            //首页首屏模块
            // '/widget/ui/side-mod-frame/ltr/ltr.css',
            '/widget/css-module-base/ltr/ltr.css',
            // merge the widgets
            '/widget/history/ltr/ltr.more.css',
            '/widget/hot-site/ltr/ltr.more.css',
            '/widget/customsites/ltr/ltr.more.css',
            '/widget/sortsite/ltr/ltr.more.css',
            '/widget/sort-area/tab/ltr/ltr.css',
            '/widget/sort-area/nav/ltr/ltr.css',
            '/widget/sort-area/sort/ltr/ltr.more.css',
            '/widget/popupsite/ltr/ltr.css',
            '/widget/notepad/ltr/ltr.css',
            '/widget/send-bless/ltr/ltr.css',
        ],
        // 两种布局自动切换样式(ltr)
        'pkg/flow_ltr.css': [
            '/widget/trigger-flow/ltr/ltr.css',
            /^\/widget\/(?!customsite|hot-site|sort-area).*?\/flow\/ltr\/ltr.flow.css$/i
        ],
        // 右边栏（明飞）模块单独合并(ltr)
        'pkg/rightcolumn_ltr.css': [
            '/widget/ui/side-mod-frame/ltr/ltr.css',
            '/widget/recommand/ltr/ltr.css',
            '/widget/recommand/layout1/ltr/ltr.css',
            '/widget/recommand/layout2/ltr/ltr.css',
            '/widget/recommand/layout3/ltr/ltr.css',
            '/widget/recommand/football/ltr/ltr.css',
            '/widget/anchorbar/ltr/ltr.css',
            '/widget/speed-test/ltr/ltr.css',
            '/widget/lottery/lottery.css',
            '/widget/astro/ltr/ltr.css',
            '/widget/pray/ltr/ltr.css',
            '/widget/magicbox/ltr/ltr.css',
            '/widget/bus/ltr/ltr.css',
            '/widget/translate/ltr/ltr.css',
            '/widget/gold/ltr/ltr.css',
            '/widget/score/ltr/ltr.css',
            '/widget/tvlive/ltr/ltr.css',
            '/widget/football/ltr/ltr.css',
            '/widget/charts/ltr/ltr.css',
            '/widget/news/ltr/ltr.css',
            '/widget/ad-switch/ltr/ltr.css',
            '/widget/big-ad-switch/ltr/ltr.css',
            '/widget/mail/ltr/ltr.css',
            '/widget/useful/ltr/ltr.css',
            '/widget/lyrics/ltr/ltr.css',
            '/widget/anchorside/ltr/ltr.css',
            '/widget/side-like/ltr/ltr.css' 
            // '/widget/rate/ltr/ltr.css'暂时ltr还没有国家有汇率模块
        ],


        //首页首屏模块和公共模块(rtl)
        'pkg/index_rtl.css': [

            //首页首屏模块
            '/widget/css-module-base/rtl/rtl.css',
            '/widget/history/rtl/rtl.more.css',
            '/widget/popupsite/rtl/rtl.css',
            '/widget/hot-site/rtl/rtl.more.css',
            '/widget/sort-area/tab/rtl/rtl.css',
            '/widget/sort-area/nav/rtl/rtl.css',
            '/widget/sort-area/sort/rtl/rtl.more.css',
            '/widget/popupsite/rtl/rtl.css',
            '/widget/customsites/rtl/rtl.more.css',
            '/widget/send-bless/rtl/rtl.css'
        ],
        // 两种布局自动切换样式(rtl)
        'pkg/flow_rtl.css': [
            '/widget/trigger-flow/rtl/rtl.css',
            /^\/widget\/(?!customsite|hot-site|sort-area).*?\/flow\/rtl\/rtl.flow.css$/i
        ],
          // 右边栏（明飞）模块单独合并
         'pkg/rightcolumn_rtl.css': [
            '/widget/ui/side-mod-frame/rtl/rtl.css',
            '/widget/recommand/rtl/rtl.css',
            '/widget/recommand/layout1/rtl/rtl.css',
            '/widget/recommand/layout2/rtl/rtl.css',
            '/widget/recommand/layout3/rtl/rtl.css',
            '/widget/recommand/football/rtl/rtl.css',
            '/widget/anchorbar/rtl/rtl.css',
            '/widget/speed-test/rtl/rtl.css',
            '/widget/astro/rtl/rtl.css',
            '/widget/pray/rtl/rtl.css',
            '/widget/magicbox/rtl/rtl.css',
            '/widget/resulttest/rtl/rtl.css',
            '/widget/gold/rtl/rtl.css',
            '/widget/football/rtl/rtl.css',
            '/widget/charts/rtl/rtl.css',
            '/widget/news/rtl/rtl.css',
            '/widget/ad-switch/rtl/rtl.css',
            '/widget/big-ad-switch/rtl/rtl.css',
            '/widget/mail/rtl/rtl.css',
            '/widget/useful/rtl/rtl.css',
            '/widget/usedcar/rtl/rtl.css',
            // merge the widgets
            '/widget/lyrics/rtl/rtl.css',
            '/widget/anchorside/rtl/rtl.css',
            '/widget/rate/rtl/rtl.css'
        ],
        //抽样或者国家特有的css单独合成一个包，而不是分别打包,为了不堵塞执行！！！！！！！！！！！！！
        //ltr
        'pkg/diff_sample_ltr.css':[
            '/widget/br-music-player/br-music-player.css',            
            '/widget/daily-sign/ltr/ltr.css',
            '/widget/sidebar-history/ltr/ltr.more.css',
            '/widget/sidebar-notepad/ltr/ltr.css',
            '/widget/sidebar-embed-iframe/ltr/ltr.css',
            '/widget/sidebar-shop/ltr/ltr.css',
            '/widget/sidebar-appbox/ltr/ltr.css',
            '/widget/valentine/ltr/ltr.css',
            '/widget/user-guider/ltr/ltr.css'
        ],
        'pkg/sidetoolbar_ltr.css':[
            '/widget/sidetoolbar/ltr/ltr.css'
        ],
        'pkg/diff_sample_rtl.css':[
            '/widget/sidetoolbar/rtl/rtl.css',
            '/widget/sidebar-embed-iframe/rtl/rtl.css',
        '/widget/sidebar-appbox/rtl/rtl.css',
            '/widget/valentine/rtl/rtl.css',
            '/widget/user-guider/rtl/rtl.css'
        ],
        'pkg/small_ltr.css': [
            '/widget/notepad/small-ltr/small-ltr.css',
            '/widget/history/small-ltr/small-ltr.css'
        ],
        'pkg/small_rtl.css': [
            '/widget/notepad/small-rtl/small-rtl.css',
            '/widget/history/small-rtl/small-rtl.css'
        ],
        //metro
        'pkg/hot-site-metro.css':[
            //hot-site-metro
            '/widget/hot-site-metro/ltr/ltr.more.css'
        ],
        //metro
        'pkg/hotsite-newtab.css':[
            //hot-site-metro
            '/widget/hotsite-newtab/ltr/ltr.css'
        ],

        //bottom为啥不合并？因为bottom不在首屏，对应的css是有条件才会载入!
        'pkg/bottom_ltr.css':[
            '/widget/bottom/ltr/ltr.css',
            '/widget/bottom-vote/ltr/ltr.css',
            '/widget/bottomImage/ltr/ltr.css',
            '/widget/bottom-ecommerce/ltr/ltr.css',
            '/widget/br-bottom-vote/ltr/ltr.css',
            '/widget/bottom-book/ltr/ltr.css'
        ],
        'pkg/bottom_rtl.css':[
            '/widget/bottom/rtl/rtl.css',
            '/widget/bottom-vote/rtl/rtl.css',
            '/widget/bottomImage/rtl/rtl.css',
            '/widget/br-bottom-vote/rtl/rtl.css',
            '/widget/bottom-book/rtl/rtl.css'
        ]
});

fis.match('**.tpl',{
    parser: function(content, file) {
    // 支持这种写法。
    // 
    // $a = __getHash('/static/js/xxx.js');
    // 
    
    var lang = fis.compile.lang;

    return content.replace(/__getHash\s*\(\s*('|")(.+)\1\s*\)/ig, function(all, quote, value) {
      return quote + lang.hash.wrap(value) + quote;
    });
  }
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
                exclude: /(ad-switch|anchorbar|astro|speed-test|sidebar-preload|music-player|news|joke|hotsite-side|magicbox|useful|mail|rightcolumn|bottombar|footer|bottom-ecommerce|\$)/i
            }
});

fis.config.set('modules.optimizer.tpl','html-compress');

fis.match(/\/widget\/(.*)\/nts\/(.+)$/ , {
    useHash: false,
  release: "/static/home/widget/$1/nts/$2"
});
fis.set('modules', {
    postpackager: 'ext-map',
        packager : 'autopack'
});


fis.set('settings', {
    //插件参数设置
    
        packager : {
            autopack : {
                //fid为接入自动合并后分配的产品线FID字符串
                'fid' : 'globalhao123'
            }
        }
});

fis.config.set('settings.spriter.csssprites', {
    width_limit:102400,
    height_limit: 102400
});
