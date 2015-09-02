//rtl,ltr首页公共模块
var common_commonCss = [
					// include CSS BASE：节省请求
			        // /^\/widget\/ui\/css-framework-base\/(.*\.css)$/i,
			        // merge the ui

                    // icon, remove form: css-base
                    // "/widget/ui/css-icon/rtl/rtl.css",
			        '/widget/ui/prompt/prompt.css',
			        '/widget/ui/suggest/suggest.css',
			        '/widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.css',
			        '/widget/ui/jquery/widget/jquery.ui.datepicker/jquery.ui.datepicker.css',
			        // widget
			        '/widget/header/add-fav-bar/add-fav-bar.css',
			        '/widget/header/logo/logo.css',
			        // '/widget/keyboard/keyboard.css',
			        '/widget/ui/lottery/lottery.css',
			        '/widget/ui/dropdownlist/dropdownlist.css',
                    '/widget/ui/scrollable/scrollable.css',
			        '/widget/ui/popup/popup.css',
                    '/widget/ui/css-ui/css-ui.css',
                    '/widget/ui/calendar/calendar.css',
                    '/widget/ui/sns-share/sns-share.css',
                    '/widget/ui/dialog/dialog.css'
];



// fis.config.merge({
//     namespace : 'common',
//     //roadmap: {
//     //	domain: {
//     //		"image": "<%$root.head.cdn%>"
//     //	}
//     //},
//     pack: {
//         //合并打包配置
//         // JS文件打包配置
//         // BASE
//         'pkg/js_framework.js': [
// 	        /^\/widget\/ui\/jquery\/([^\/]*\.js)$/i,
// 	        '/widget/ui/jquery/1.8.3/jquery.min.js',
//             '/static/lazyload.js',
//             '/static/BigPipe.js',
//             '/widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js',
//             '/widget/ui/message/src/message.js',
// 	        /^\/widget\/ui\/helper\/(.*\.js)$/i,
// 	        /^\/widget\/ui\/localstorage\/(.*\.js)$/i,
// 	        /^\/widget\/ui\/localcookie\/(.*\.js)$/i,
// 	        /^\/widget\/ui\/ut\/(.*\.js)$/i,
// 	        /^\/widget\/ui\/eventcenter\/(.*\.js)$/i,
// 	        /^\/widget\/ui\/monitor\/(.*\.js)$/i,
//             'widget/ui/cookieless/cookieless.js'
//         ],
//         // common modules' js
//         'pkg/module_common.js': [
//             '/widget/ui/cycletabs/cycletabs.js',
//         	// UI
// 	        '/widget/ui/date/date.js',
//             '/widget/ui/date-new/date.js',
// 	        '/widget/ui/md5/md5.js',
// 	        '/widget/ui/time/time.js',
// 	        '/widget/ui/side-render/side-render.js',
// 	        '/widget/ui/multicookie/multicookie.js',
// 	        '/widget/ui/suggest/suggest.js',
// 	        '/widget/ui/popup/popup.js',
// 	        '/widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js',
// 	        '/widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js',
// 	        '/widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js',
// 	        '/widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js',
// 	        '/widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js',
// 	        '/widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js',
// 	        '/widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js',
// 	        '/widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js',
//             '/widget/ui/jquery/widget/jquery.placeholder/jquery.placeholder.js',

//             '/widget/ui/bubble/src/bubble.js',
//             '/widget/ui/scrollable/scrollable.js',

// 	        // widget
// 	        // search box
// 	        '/widget/search-box/search-box-async.js',
//             '/widget/search-box-4ps/search-box-4ps-async.js',
//             // keybord AR/SA ONLY
//             '/widget/keyboard/keyboard-async.js'
// 	        // lottery
// 	        // '/widget/ui/lottery/lottery.js',
// 	        // dropdownlist
// 	        //'/widget/ui/dropdownlist/dropdownlist.js',
// 	        // notice popup
// 	        //'/widget/ui/notice-pop/notice-pop.js'
//         ],
//         // head & foot
//         'pkg/common_heot.js': [
//             '/widget/header/logo/logo-async.js',
//             '/widget/footer/footer.js',
//             '/widget/header/clock/clock-async.js',
//             '/widget/header/account/account-async.js',
//             '/widget/header/site-switch/site-switch-async.js',
//             '/widget/ui/weather/weather.js',
//             '/widget/header/userbar-btn/userbar-btn-async.js',
//             '/widget/header/tear-page/tear-page-async.js',
//             '/widget/header/add-fav-bar/add-fav-bar-async.js'
//         ],
//          // calendar
//         'pkg/calen_async.js': [
//             '/widget/header/clock/calendar-async.js',
//             '/widget/ui/calendar/calendar.js',
//             '/widget/ui/date-new/plugin/buddhist.js',
//             '/widget/ui/date-new/plugin/isl.js',
//             '/widget/ui/date-new/plugin/lunar.js',
//             '/widget/ui/date-new/plugin/rokuyou.js'
//         ],
//         // heederTest's async js
//         'pkg/headerTest_async.js': [
//             '/widget/header/header-com/header-com-async.js',
//             '/widget/header/account-test/account-test-async.js',
//             '/widget/header/userbar-btn-test/userbar-btn-test-async.js',
//             '/widget/header/skinbox/skinbox-async.js',
//             '/widget/header/message/message-async.js',
//             '/widget/header/userbar-btn-header/userbar-btn-header-async.js',
//             '/widget/header/skin-trans/skin-trans-async.js',
//             '/widget/header/skinbox/skin-mod.js'
//         ],
//         // common modules headerTest css
//         'pkg/module_headerTest_ltr.css': [
//           	'/widget/header/header-com/ltr-s/ltr.more.css',
//             '/widget/header/userbar-btn-test/ltr-s/ltr.more.css',
//             '/widget/header/account-test/ltr-s/ltr.more.css',
//             '/widget/header/skinbox/ltr/ltr.more.css',
//             '/widget/header/message/ltr/ltr.more.css',
//             '/widget/header/userbar-btn-header/ltr-s/ltr.more.css'
//         ],
//         // common modules headerTest css
//         'pkg/module_headerTest_rtl.css': [
//           	'/widget/header/header-com/rtl-s/rtl.more.css',
//             '/widget/header/userbar-btn-test/rtl-s/rtl.more.css',
//             '/widget/header/account-test/rtl-s/rtl.more.css',
//             '/widget/header/skinbox/rtl/rtl.more.css',
//             '/widget/header/message/rtl/rtl.more.css',
//             '/widget/header/userbar-btn-header/rtl-s/rtl.more.css'
//         ],
//         'pkg/header_flat_ltr.css': [
//             '/widget/header-flat/ltr/ltr.more.css',
//             '/widget/header-flat/account/ltr/ltr.more.css',
//             '/widget/header-flat/clock/ltr/ltr.more.css',
//             '/widget/header-flat/logo/ltr/ltr.more.css',
//             '/widget/header-flat/message/ltr/ltr.more.css',
//             '/widget/header-flat/site-switch/ltr/ltr.more.css',
//             '/widget/header-flat/userbar-btn-header/ltr/ltr.more.css',
//             '/widget/header-flat/weather/ltr/ltr.more.css',
//             '/widget/header-flat/banner-site/ltr/ltr.more.css',
//             '/widget/userbar-btn-searchside/ltr/ltr.more.css',
//             '/widget/header-flat/fontsize-switch/ltr/ltr.more.css',
//             '/widget/header-flat/add-fav-bar/ltr/ltr.more.css'
//         ],
//         'pkg/header_flat_rtl.css': [
//             '/widget/header-flat/rtl/rtl.more.css',
//             '/widget/header-flat/account/rtl/rtl.more.css',
//             '/widget/header-flat/clock/rtl/rtl.more.css',
//             '/widget/header-flat/logo/rtl/rtl.more.css',
//             '/widget/header-flat/message/rtl/rtl.more.css',
//             '/widget/header-flat/site-switch/rtl/rtl.more.css',
//             '/widget/header-flat/userbar-btn-header/rtl/rtl.more.css',
//             '/widget/header-flat/weather/rtl/rtl.more.css',
//             '/widget/header-flat/banner-site/rtl/rtl.more.css',
//             '/widget/userbar-btn-searchside/rtl/rtl.more.css',
//             '/widget/header-flat/fontsize-switch/rtl/rtl.more.css',
//             '/widget/header-flat/add-fav-bar/rtl/rtl.more.css'
//         ],
//         'pkg/module_common.css': common_commonCss,
//           // ltr's HEADER & FOOTER  & common
//         'pkg/module_common_ltr.css': [
//         	// include CSS BASE：节省请求

//             // merge icons
//             "/widget/ui/css-icon/ltr/ltr.css",
//             '/widget/ui/cycletabs/ltr/ltr.css', // cycletabs
// 	        // merge the ui
// 	        // '/widget/ui/jquery/widget/jquery.ui.button/ltr/ltr.css',
// 	        '/widget/ui/jquery/widget/jquery.ui.tip/ltr/ltr.css',
// 	        // widget

// 	        // /^\/widget\/header\/ltr\/([^.]+\..+\.css)$/i,
// 	        // /^\/widget\/footer\/ltr\/(.*\.css)$/i,
// 	        // /^\/widget\/header\/[^\/]*\/ltr\/([^.]+\..+\.css)$/i,

// 	        // searchbox
// 	        // '/widget/search-box/ltr/ltr.css',
// 	        // notice popup
// 	        '/widget/ui/notice-pop/ltr/ltr.css',
// 	        //login popup
// 		    '/widget/login-popup/ltr/ltr.css'
//         ],
//         'pkg/module_common_rtl.css': [
//         	// include CSS BASE：节省请求

//             // merge icons
//             "/widget/ui/css-icon/rtl/rtl.css",
//             '/widget/ui/cycletabs/rtl/rtl.css',// cycletabs
// 	        // merge the ui
// 	        // '/widget/ui/jquery/widget/jquery.ui.button/rtl/rtl.css',
// 	        '/widget/ui/jquery/widget/jquery.ui.tip/rtl/rtl.css',
// 	        // widget
// 	        // /^\/widget\/footer\/rtl\/(.*\.css)$/i,
// 	        // searchbox
// 	        // '/widget/search-box/rtl/rtl.css',
// 	        "/widget/rtl/rtl/rtl.css",
// 	        // notice popup
// 	        '/widget/ui/notice-pop/rtl/rtl.css',
// 	        //login popup
// 	        '/widget/login-popup/rtl/rtl.css',
//             //keyboard
//             '/widget/keyboard/rtl/rtl.css'
//     	],
//         'pkg/module_sidebar_ltr.css': [
//             '/widget/css-base/dist/base.ltr.css',
//             '/widget/css-base/dist/base.ltr.ie.css',
//             '/widget/css-flatbase/ltr/ltr.css'
//         ],
//         'pkg/module_sidebar_rtl.css': [
//             '/widget/css-base/dist/base.rtl.css',
//             '/widget/css-base/dist/base.rtl.ie.css',
//             '/widget/css-flatbase/rtl/rtl.css'
//         ]

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
//         preprocessor: {
//             'widget-inline': {
//                 include: /.+/i,
//                 exclude: /(rightcolumn|bottombar|footer|\$)/i
//             }
//         }
//     }
// });

// fis.config.get('roadmap.path').unshift({
//      reg : '/widget/ui/keyboard/keyboard.js',
//      useCompile : false,
//      release : '/static/common/widget/ui/keyboard/keyboard.js'
// });
// fis.config.get('roadmap.path').unshift({
//    reg: "/static/sidebar-base.js",
//    useHash: false,
//    useMap: false,
//    release: "/static304/sidebar-base.js"
// });
// fis.config.get('roadmap.path').unshift({
//    reg: "/static/ar_hao123_sug.js",
//    useHash: false,
//    useMap: false,
//    release: "/static304/ar_hao123_sug.js"
// });
// fis.config.get('roadmap.path').unshift({
//    reg: "/static/br_hao123_sug.js",
//    useHash: false,
//    useMap: false,
//    release: "/static304/br_hao123_sug.js"
// });
// fis.config.get('roadmap.path').unshift({
//    reg: "/static/th_hao123_sug.js",
//    useHash: false,
//    useMap: false,
//    release: "/static304/th_hao123_sug.js"
// });

// fis.config.set('modules.optimizer.tpl','html-compress');

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




//wangrui
fis.require('smarty')(fis);

fis.set('namespace', "common");

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
    //合并打包配置
        // JS文件打包配置
        // BASE
        'pkg/js_framework.js': [
            /^\/widget\/ui\/jquery\/([^\/]*\.js)$/i,
            '/widget/ui/jquery/1.8.3/jquery.min.js',
            '/static/lazyload.js',
            '/static/BigPipe.js',
            '/widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js',
            '/widget/ui/message/src/message.js',
            /^\/widget\/ui\/helper\/(.*\.js)$/i,
            /^\/widget\/ui\/localstorage\/(.*\.js)$/i,
            /^\/widget\/ui\/localcookie\/(.*\.js)$/i,
            /^\/widget\/ui\/ut\/(.*\.js)$/i,
            /^\/widget\/ui\/eventcenter\/(.*\.js)$/i,
            /^\/widget\/ui\/monitor\/(.*\.js)$/i,
            'widget/ui/cookieless/cookieless.js'
        ],
        // common modules' js
        'pkg/module_common.js': [
            '/widget/ui/cycletabs/cycletabs.js',
            // UI
            '/widget/ui/date/date.js',
            '/widget/ui/date-new/date.js',
            '/widget/ui/md5/md5.js',
            '/widget/ui/time/time.js',
            '/widget/ui/side-render/side-render.js',
            '/widget/ui/multicookie/multicookie.js',
            '/widget/ui/suggest/suggest.js',
            '/widget/ui/popup/popup.js',
            '/widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js',
            '/widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js',
            '/widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js',
            '/widget/ui/jquery/widget/jquery.ui.autocomplete/jquery.ui.autocomplete.js',
            '/widget/ui/jquery/widget/jquery.ui.autocomplete.html/jquery.ui.autocomplete.html.js',
            '/widget/ui/jquery/widget/jquery.ui.position/jquery.ui.position.js',
            '/widget/ui/jquery/widget/jquery.sethome/jquery.sethome.js',
            '/widget/ui/jquery/widget/jquery.addfav/jquery.addfav.js',
            '/widget/ui/jquery/widget/jquery.placeholder/jquery.placeholder.js',

            '/widget/ui/bubble/src/bubble.js',
            '/widget/ui/scrollable/scrollable.js',

            // widget
            // search box
            '/widget/search-box/search-box-async.js',
            '/widget/search-box-4ps/search-box-4ps-async.js',
            // keybord AR/SA ONLY
            '/widget/keyboard/keyboard-async.js'
            // lottery
            // '/widget/ui/lottery/lottery.js',
            // dropdownlist
            //'/widget/ui/dropdownlist/dropdownlist.js',
            // notice popup
            //'/widget/ui/notice-pop/notice-pop.js'
        ],
        // head & foot
        'pkg/common_heot.js': [
            '/widget/header/logo/logo-async.js',
            '/widget/footer/footer.js',
            '/widget/header/clock/clock-async.js',
            '/widget/header/account/account-async.js',
            '/widget/header/site-switch/site-switch-async.js',
            '/widget/ui/weather/weather.js',
            '/widget/header/userbar-btn/userbar-btn-async.js',
            '/widget/header/tear-page/tear-page-async.js',
            '/widget/header/add-fav-bar/add-fav-bar-async.js'
        ],
         // calendar
        'pkg/calen_async.js': [
            '/widget/header/clock/calendar-async.js',
            '/widget/ui/calendar/calendar.js',
            '/widget/ui/date-new/plugin/buddhist.js',
            '/widget/ui/date-new/plugin/isl.js',
            '/widget/ui/date-new/plugin/lunar.js',
            '/widget/ui/date-new/plugin/rokuyou.js'
        ],
        // heederTest's async js
        'pkg/headerTest_async.js': [
            '/widget/header/header-com/header-com-async.js',
            '/widget/header/account-test/account-test-async.js',
            '/widget/header/userbar-btn-test/userbar-btn-test-async.js',
            '/widget/header/skinbox/skinbox-async.js',
            '/widget/header/message/message-async.js',
            '/widget/header/userbar-btn-header/userbar-btn-header-async.js',
            '/widget/header/skin-trans/skin-trans-async.js',
            '/widget/header/skinbox/skin-mod.js'
        ],
        // common modules headerTest css  wangrui
        // 'pkg/module_headerTest_ltr.css': [
        //     '/widget/header/header-com/ltr-s/ltr.more.css',
        //     '/widget/header/userbar-btn-test/ltr-s/ltr.more.css',
        //     '/widget/header/account-test/ltr-s/ltr.more.css',
        //     '/widget/header/skinbox/ltr/ltr.more.css',
        //     '/widget/header/message/ltr/ltr.more.css',
        //     '/widget/header/userbar-btn-header/ltr-s/ltr.more.css'
        // ],
        // common modules headerTest css
        'pkg/module_headerTest_rtl.css': [
            '/widget/header/header-com/rtl-s/rtl.more.css',
            '/widget/header/userbar-btn-test/rtl-s/rtl.more.css',
            '/widget/header/account-test/rtl-s/rtl.more.css',
            '/widget/header/skinbox/rtl/rtl.more.css',
            '/widget/header/message/rtl/rtl.more.css',
            '/widget/header/userbar-btn-header/rtl-s/rtl.more.css'
        ],
        'pkg/header_flat_ltr.css': [
            '/widget/header-flat/ltr/ltr.more.css',
            '/widget/header-flat/account/ltr/ltr.more.css',
            '/widget/header-flat/clock/ltr/ltr.more.css',
            '/widget/header-flat/logo/ltr/ltr.more.css',
            '/widget/header-flat/message/ltr/ltr.more.css',
            '/widget/header-flat/site-switch/ltr/ltr.more.css',
            '/widget/header-flat/userbar-btn-header/ltr/ltr.more.css',
            '/widget/header-flat/weather/ltr/ltr.more.css',
            '/widget/header-flat/banner-site/ltr/ltr.more.css',
            '/widget/userbar-btn-searchside/ltr/ltr.more.css',
            '/widget/header-flat/fontsize-switch/ltr/ltr.more.css',
            '/widget/header-flat/add-fav-bar/ltr/ltr.more.css'
        ],
        'pkg/header_flat_rtl.css': [
            '/widget/header-flat/rtl/rtl.more.css',
            '/widget/header-flat/account/rtl/rtl.more.css',
            '/widget/header-flat/clock/rtl/rtl.more.css',
            '/widget/header-flat/logo/rtl/rtl.more.css',
            '/widget/header-flat/message/rtl/rtl.more.css',
            '/widget/header-flat/site-switch/rtl/rtl.more.css',
            '/widget/header-flat/userbar-btn-header/rtl/rtl.more.css',
            '/widget/header-flat/weather/rtl/rtl.more.css',
            '/widget/header-flat/banner-site/rtl/rtl.more.css',
            '/widget/userbar-btn-searchside/rtl/rtl.more.css',
            '/widget/header-flat/fontsize-switch/rtl/rtl.more.css',
            '/widget/header-flat/add-fav-bar/rtl/rtl.more.css'
        ],
        'pkg/module_common.css': common_commonCss,
          // ltr's HEADER & FOOTER  & common
        'pkg/module_common_ltr.css': [
            // include CSS BASE：节省请求

            // merge icons
            "/widget/ui/css-icon/ltr/ltr.css",
            '/widget/ui/cycletabs/ltr/ltr.css', // cycletabs
            // merge the ui
            // '/widget/ui/jquery/widget/jquery.ui.button/ltr/ltr.css',
            '/widget/ui/jquery/widget/jquery.ui.tip/ltr/ltr.css',
            // widget

            // /^\/widget\/header\/ltr\/([^.]+\..+\.css)$/i,
            // /^\/widget\/footer\/ltr\/(.*\.css)$/i,
            // /^\/widget\/header\/[^\/]*\/ltr\/([^.]+\..+\.css)$/i,

            // searchbox
            // '/widget/search-box/ltr/ltr.css',
            // notice popup
            '/widget/ui/notice-pop/ltr/ltr.css',
            //login popup
            '/widget/login-popup/ltr/ltr.css'
        ],
        'pkg/module_common_rtl.css': [
            // include CSS BASE：节省请求

            // merge icons
            "/widget/ui/css-icon/rtl/rtl.css",
            '/widget/ui/cycletabs/rtl/rtl.css',// cycletabs
            // merge the ui
            // '/widget/ui/jquery/widget/jquery.ui.button/rtl/rtl.css',
            '/widget/ui/jquery/widget/jquery.ui.tip/rtl/rtl.css',
            // widget
            // /^\/widget\/footer\/rtl\/(.*\.css)$/i,
            // searchbox
            // '/widget/search-box/rtl/rtl.css',
            "/widget/rtl/rtl/rtl.css",
            // notice popup
            '/widget/ui/notice-pop/rtl/rtl.css',
            //login popup
            '/widget/login-popup/rtl/rtl.css',
            //keyboard
            '/widget/keyboard/rtl/rtl.css'
        ],
        'pkg/module_sidebar_ltr.css': [
            '/widget/css-base/dist/base.ltr.css',
            '/widget/css-base/dist/base.ltr.ie.css',
            '/widget/css-flatbase/ltr/ltr.css'
        ],
        'pkg/module_sidebar_rtl.css': [
            '/widget/css-base/dist/base.rtl.css',
            '/widget/css-base/dist/base.rtl.ie.css',
            '/widget/css-flatbase/rtl/rtl.css'
        ]
});

fis.match('::package', {
  packager: fis.plugin('map', {
    'pkg/module_headerTest_ltr.css': [
      '/widget/header/header-com/ltr-s/ltr.more.css',
            '/widget/header/userbar-btn-test/ltr-s/ltr.more.css',
            '/widget/header/account-test/ltr-s/ltr.more.css',
            '/widget/header/skinbox/ltr/ltr.more.css',
            '/widget/header/message/ltr/ltr.more.css',
            '/widget/header/userbar-btn-header/ltr-s/ltr.more.css'
    ],
    'pkg/common_heot.js':[
        '/widget/header/logo/logo-async.js',
            '/widget/footer/footer.js',
            '/widget/header/clock/clock-async.js',
            '/widget/header/account/account-async.js',
            '/widget/header/site-switch/site-switch-async.js',
            '/widget/ui/weather/weather.js',
            '/widget/header/userbar-btn/userbar-btn-async.js',
            '/widget/header/tear-page/tear-page-async.js',
            // '/widget/header/add-fav-bar/add-fav-bar-async.js'
    ]
  })
});


fis.match('/widget/header/skinbox/ltr/ltr.more.css', {
  packTo: 'pkg/module_headerTest_ltr.css',
  packOrder: -100
});

fis.match('/widget/header/add-fav-bar/add-fav-bar-async.js', {
  isMod: true, // 设置 comp 下都是一些组件，组件建议都是匿名方式 define
    release: '/pkg/$0',
    lint: fis.plugin('jshint', {
        ignored: [/jquery\.js$/i],

        //using Chinese reporter
        i18n: 'zh-CN',
        es3: true,
        //jshint options
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true
    })
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
fis.config.set('modules.optimizer.tpl','html-compress');


fis.match('/widget/ui/keyboard/keyboard.js' , {
    useCompile : false,
     release : '/static/common/widget/ui/keyboard/keyboard.js'
});
fis.match("/static/sidebar-base.js" , {
    useHash: false,
   useMap: false,
   release: "/static304/sidebar-base.js"
});
fis.match("/static/ar_hao123_sug.js" , {
    useHash: false,
   useMap: false,
   release: "/static304/ar_hao123_sug.js"
});
fis.match("/static/br_hao123_sug.js" , {
    useHash: false,
   useMap: false,
   release: "/static304/br_hao123_sug.js"
});

fis.match("/static/th_hao123_sug.js" , {
    useHash: false,
   useMap: false,
   release: "/static304/th_hao123_sug.js"
});



