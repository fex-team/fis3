var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var TPL = require('common:widget/ui/tpl/tpl.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');

/**
 * 热点新闻
 * @param
*/
var Hotspot = function( api, $wrap ) {
    this.api = api;
    this.$wrap = $wrap;
};

Hotspot.prototype = {
    init: function() {
        this._renderModules();
    },
    _fetchData: function() {
        var that = this;

        return $.ajax({
            url: that.api,
            dataType: "jsonp",
            jsonp: "jsonp"
        });
    },
    _dispatchData: function( demands ) {
        var that = this,
            guid = 0,
            end = 0,
            fetchData = that._fetchData(),
            module = "",
            modules = [];

        return fetchData.then( function( result ) {
            result = result.content.item_list;
            end = result.length;
            $.each( demands, function( name, params ) {
                while ( params[0] ) {
                    if ( end === guid ) {
                        return false;
                    }
                    var cur = result[ guid ];
                    if ( cur[ name ] && cur[ name ].length ) {
                        params[1].push( cur );
                        params[0]--;
                    }
                    guid++;
                }

                module = params[2].call( that, params[1] );
                params[3] && modules.push( module );
            });

            return modules.join("");
        });
    },
    _formatSlideNews: function( data ) {
        var tpl = '<a class="slide border-grey" href="{{link}}">'
                  + '<img class="img slide-img" src="{{img_url}}" />'
                  + '<span class="title slide-title">{{title}}</span>'
                  + '<span class="title-mask"></span>'
                  +'</a>',
            dom = "",
            formatTpl = this._formatTpl,
            slideData = [];

        for( var i = 0, length = data.length; i < length; i++ ){
            dom = formatTpl( tpl, "", [ data[i] ] );
            slideData.push( { "content" : dom,"id" : i + 1 } );
        }

        this._renderSlide( slideData );

        return
    },
    _formatThumbNews: function( data ) {
        var tpl = '<a class="thumb border-grey" href="{{link}}">'
                  + '<img class="img thumb-img" src="{{thumb_img_url}}" />'
                  + '<span class="title thumb-title">{{title}}</span>'
                  +'</a>',
            wrap = '<div class="thumb-wrap">{{dom}}</div>';

        return this._formatTpl( tpl, wrap, data );
    },
    _formatTextNews: function( data ) {
        var tpl = '<a class="text" href="{{link}}">'
                  + '<i class="blue-icon"></i>'
                  + '<span class="title text-title">{{title}}</span>'
                  +'</a>',
            wrap = '<div class="text-wrap">{{dom}}</div>';

        return this._formatTpl( tpl, wrap, data );
    },
    _formatTpl: function ( tpl, wrap, data ) {
        var dom = "";

        for( var i = 0, length = data.length; i < length; i++ ){
            dom = dom + TPL( tpl, data[i] );
        }

        return wrap ? wrap.replace( /{{dom}}/, dom ) : dom;
    },
    _renderSlide: function ( slideData ) {
        var that = this,
            options = {
                offset: 0,
                navSize: 1,
                itemSize: 250,
                autoScroll: true,
                dir: conf.dir,
                autoScrollDirection: "forward",
                autoDuration: 2500,
                scrollDuration: 500,
                quickSwitch: true,
                containerId: that.$wrap.find(".slide-wrap"),
                data: slideData,
                defaultId: 1
            },
            slide = new cycletabs.NavUI();

        slide.init(options);
    },
    _renderModules: function() {
        var that = this,
            $wrap = that.$wrap,
            demands = {
                "img_url": [ 3, [], that._formatSlideNews, false ],
                "thumb_img_url": [ 2, [], that._formatThumbNews, true ],
                "title": [ 10, [], that._formatTextNews, true ]
            },
            dispatch = that._dispatchData( demands );

        dispatch.done( function( modules ) {
            $wrap.append( modules );
        });
    }
};

module.exports = Hotspot;
