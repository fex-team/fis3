/*
* jQuery lazyload Plugin
*
* @moliniao
*/
var jQuery = require("common:widget/ui/jquery/jquery.js");

(function($,win){
    var WINDOW = win,
        $WINDOW = $(WINDOW),
        NONE = "none",
        options={
            //占位图片地址
            placeHolderUrl:"",
            //容器
            container:WINDOW,
            //lazyload图片标识符
            imgClass:"g-img-lazyload",
            textAreaClass:"g-area-lazyload",
            skipInvisible: true,
            threshold: 0,
            triggerAll: false,
            loadAreaData:loadAreaData,
            loadImage:loadImage,
            //自动触发事件
            autoFireEvent:"load",
            event: "scroll resize load"
        };

    // 从 textarea 中加载数据
    function loadAreaData(textarea) {
        //获取textarea的jquery对象
        var $textarea = $(textarea),
            val = $textarea.val();

        // 采用隐藏 textarea 但不去除方式，去除会引发 Chrome 下错乱
        $textarea.css("display",NONE).removeAttr("class");
        $textarea.after(val);
    }



    function loadImage(opt) {
        //获取textarea的jquery对象
        var $image = $(this),
            hookName = opt.imgClass,
            src = $image.attr(hookName);

            if (this.src != src) {
                this.src = src;
            }
            $image.removeAttr(hookName);
    }

    $.fn.lazyload = function( opt ){
        opt = opt || {};
        var settings = $.extend( {}, options, opt ),
            $this = this,
            $container = $(settings.container),
            autoFireEvent =  settings.autoFireEvent;
        if( !$this.length ) return;
        $this.each(function(){
            //过滤无效的图片
            if( $.nodeName(this,"img") ){
                if( !this.getAttribute( settings.imgClass ) ) return;
                //触发所有的lazyload事件
                if( settings.triggerAll ){
                    $(this).trigger("appear");
                //绑定lazyload事件
                } else {
                    $(this).one("appear",function(){
                        settings.loadImage.call(this,settings);
                    })
                }

            } else if( $.nodeName(this,"textarea") ){
                //触发所有的lazyload事件
                if( settings.triggerAll ){
                    $(this).trigger("appear");
                //绑定lazyload事件(TODO:后期再改)
                } else {
                   $(this).one("appear",function(){
                     settings.loadAreaData(this);
                   })
                }

            }
        });

        function loadCheck( e ) {
            var eventType =  e.type,
                skipInvisible = settings.skipInvisible;

            $this.each(function() {
                var $this = $(this);
                if ( skipInvisible && $this.is(":hidden") ) {
                    return;
                }

                /*if ( ( $.belowthefoldCheck(this, settings) &&
                     $.rightoffoldCheck(this, settings) ) ||
                     eventType == autoFireEvent ) {
                        $this.trigger("appear");
                }*/

                if ( ( !$.belowVisibleArea(this, settings) && !$.aboveVisibleArea(this, settings) &&
                     $.rightoffoldCheck(this, settings) ) ||
                     eventType == autoFireEvent ) {
                        $this.trigger("appear");
                }
            });

        }

        //绑定事件
        $(settings.container).bind(settings.event, function( e ) {
            loadCheck( e );
        });

        //默认执行一次
        loadCheck( {type:"fistcheck"} );

        return this;
    }


     $.belowthefoldCheck = function(element, settings) {
        var fold,
            $container = $( settings.container );
        if ( $.isWindow( settings.container ) ) {
            fold = $container.height() + $container.scrollTop();
        } else {
            fold = $container.offset().top + $container.height();
        }

        return fold > $(element).offset().top - settings.threshold;
    };

    $.rightoffoldCheck = function(element, settings) {
        var fold,
            $container = $( settings.container );

        if ( $.isWindow( settings.container ) ) {
            fold = $container.width() + $container.scrollLeft();
        } else {
            fold = $container.offset().left + $container.width();
        }

        return fold > $(element).offset().left - settings.threshold;
    };

    $.belowVisibleArea = function(element, settings) {
        var fold,
            $container = $( settings.container );
        if ( $.isWindow( settings.container ) ) {
            fold = $container.height() + $container.scrollTop();
        } else {
            fold = $container.offset().top + $container.height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.aboveVisibleArea = function(element, settings) {
        var fold,
            $container = $( settings.container );
        if ( $.isWindow( settings.container ) ) {
            fold = $container.scrollTop();
        } else {
            fold = $container.offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold;
    };

})(jQuery,window)
