var $ = require( 'common:widget/ui/jquery/jquery.js' );
var UT = require( 'common:widget/ui/ut/ut.js' );

var Entertainment = require( 'lv2:widget/pcfstatic/everyDayNews/entertainment/entertainment.js' );
var Hotspot = require( 'lv2:widget/pcfstatic/everyDayNews/hotspot/hotspot.js' );
var Politic = require( 'lv2:widget/pcfstatic/everyDayNews/politic/politic.js' );
var Royalty = require( 'lv2:widget/pcfstatic/everyDayNews/royalty/royalty.js' );
var Sport = require( 'lv2:widget/pcfstatic/everyDayNews/sport/sport.js' );

!function() {
    var sortList = { //热点 政治 娱乐 体育 皇室
            "hotspot": Hotspot,
            "politic": Politic,
            "entertainment": Entertainment,
            "sport": Sport,
            "royalty": Royalty
        },
        $pcfNewsWrap = $( "#pcfEveryDayNews" ),
        $wraps = $pcfNewsWrap.find( ".content-wrap" ),
        $tabs = $pcfNewsWrap.find( ".tab" ),
        _conf = conf.everyDayNews,
        config = _conf.sortList,
        PCF = {};

    function init() {
        selectTab( 0 );
        initPcfLogs();
        bindEvents();
    }

    /**
     *
     *  loadContent 加载tab对应的内容区，第一个是默认加载的
     *  @param  {number} sortName 分类索引
     */
    function loadContent( sortIndex ) {
        var sortName = config[ sortIndex ].sort,
            api = config[ sortIndex ].api,
            $thisWrap = $wraps.eq( sortIndex );

        if ( sortList[ sortName ] == null || !api ) {
            showError( $thisWrap );
            return;
        }

        var sort = new sortList[ sortName ]( api, $thisWrap );
        sort.init();
        $thisWrap.data( "hasLoaded", true );
    }

    function selectTab( index ) {
        var $thisWrap = $wraps.eq( index ), $thisTab = $tabs.eq( index ), selectedClass = "tab-selected", hasLoaded = $thisWrap.data( "hasLoaded" );

        $wraps.hide();
        $thisWrap.show();
        $tabs.removeClass( selectedClass );
        $thisTab.addClass( selectedClass );

        !hasLoaded && loadContent( index );
    }

    function initPcfLogs() {
        var userid = window.location.search.match( /(^|&|\\?)id=([^&]*)(&|$)/i );
        var PCF_conf = {
            params: {
                fr: _conf.pcfFr,
                id: userid === null ? "/" : userid[2]
            }
        };
        PCF = {
            url: "http://www.pcfaster.com/static/img/pvi.gif",
            send: function( e, t ) {
                e = e || {};
                var n = PCF_conf,
                    r = t && t.url || this.url,
                    i = t && t.params || n.params,
                    s = e.t = +(new Date),
                    o = window,
                    u = encodeURIComponent,
                    a = o["PCF" + s] = new Image,
                    f, l = [];
                if ( i ) for ( var c in i ) i[c] !== f && e[c] === f && (e[c] = i[c]);
                for ( f in e ) l.push( u( f ) + "=" + u( e[f] ) );
                a.onload = a.onerror = function() {
                    o["PCF" + s] = null
                }, a.src = r + "?" + l.join( "&" ), a = l = null
            }
        };
        PCF.send( {act: "loaded"} );
    }

    function hasOpenUrl() {
        return external && external.PCFCommon && external.PCFCommon.OpenUrl;
    }

    function bindEvents() {
        $pcfNewsWrap.on( "mouseover", ".tab", function() {
            selectTab( $( this ).index() );
        })
        .on( "click", "a", function() {
            PCF.send( {
                act: "click_link",
                pos: 'content'
            });
            if ( hasOpenUrl() ) {
                external.PCFCommon.OpenUrl( $(this).attr("href") );
                e.preventDefault();
            }
        })
        .on( "click", ".i-close", function() {
            PCF.send( {act: "close"} );
            closeWindow();
        });

    }

    function showError( $elem ) {
        $elem.find(".error").show();
    }

    //关闭按钮的响应事件
    function closeWindow() {
        javascript: try {
            window.external.Close();
        } catch ( e ) {
            window.close();
        }
    }

    init();
}();