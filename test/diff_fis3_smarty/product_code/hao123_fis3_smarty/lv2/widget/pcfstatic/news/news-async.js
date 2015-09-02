var $ = require( 'common:widget/ui/jquery/jquery.js' );

!function() {
    var userid = window.location.search.match( /(^|&|\\?)id=([^&]*)(&|$)/i );
    var PCF_conf = {
        params: {
            fr: conf.pcfnews.pcfFr,
            id: userid === null ? "/" : userid[2]
        }
    };
    var PCF = {
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

    //关闭按钮的响应事件
    function closeWindow() {
        javascript: try {
            window.external.Close();
        } catch ( e ) {
            window.close();
        }
    }

    //打开新链接
    function hasOpenUrl() {
        return external && external.PCFCommon && external.PCFCommon.OpenUrl;
    }


    $( "#pcfstaticNews" ).on( "click", "a", function( e ) {
        PCF.send( {
            act: "click_link",
            pos: 'content'
        });
        if ( hasOpenUrl() ) {
            external.PCFCommon.OpenUrl( $(this).attr("href") );
            e.preventDefault();
        }
        closeWindow();
    }).
    on( "click", ".i-close", function() {
        PCF.send( {act: "close"} );
        closeWindow();
    });
}();