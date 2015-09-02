var $ = window.jQuery || window.require && require("common:widget/ui/jquery/jquery.js");

$ && function(WIN, DOC, undef) {
    var shim = $('<span>');
    $.fn.placeholder = function(text, args) {

        args = $.extend({
            hideOnFocus: false
            , customClass: ""
            , customCss: {}
        }, args);

        var $el = this
            , wrap = shim.clone(!1)
            , holder = shim.clone(!1)

            , toggle = function() {
                $el.val() ? holder.hide() : holder.show();
            }
            
            , reset = function(str, _args) {

                text = str || text;
                _args = $.extend(!0, args, _args);

                // var offset = (rendered ? wrap : $el).offset()
                //     , pos = $el.position();

                // console.log($el.outerWidth(), $el.innerWidth())

                var paddingTop = ($el.outerHeight() - $el.height())/2 + 'px'
                    , paddingLeft = ($el.outerWidth() - $el.width())/2 + 'px';

                // auto style
                holder.css($.extend({
                    'position': 'absolute'
                    , 'overflow': 'hidden'
                    // , 'top': offset.top - pos.top
                    // , 'left': offset.left - pos.left
                    , 'top': parseInt($el.css('top')) || 0
                    , 'left': parseInt($el.css('left')) || 0

                    // $el.css('margin') not working in firefox
                    , 'margin': [$el.css('margin-top'), $el.css('margin-right'), $el.css('margin-bottom'), $el.css('margin-left')].join(' ')
                    , 'padding': [paddingTop, paddingLeft, paddingTop, paddingLeft].join(' ')
                    , 'pointer-events': 'none'
                    , 'color': '#999'
                    // , 'width': $el.width()
                    , 'width': $el.width()
                    , 'height': $el.height()
                    , 'line-height': $el.css('line-height')
                    , 'display': 'none'
                    , 'cursor': 'text'
                }, _args.customCss));

                _args.customClass && holder.addClass(_args.customClass);

                wrap.css({
                    'display': 'inline-block'
                    , 'position': 'relative'
                    , 'z-index': ~~$el.css("z-index") + 1
                    // , 'width': $el.css('width')
                    , 'width': '100%'
                    // , 'height': $el.css('height')
                    , 'height': '100%'
                    , 'vertical-align': 'top'
                });

                holder.html(text);

                toggle();
            }
            , get = function() {
                return text;
            };
            // , rendered = 0;

        // cache native attr
        text = text || $el.attr("placeholder");
        $el.attr("placeholder", "");
        $el.wrap(wrap);
        (wrap = $el.parent()).append(holder);
        reset();
        rendered = 1;

        args.hideOnFocus
        ? $el
            .focus(function() {
                holder.hide();
            })
            .blur(function() {
                toggle();
            })
        : $el.on("input propertychange", function(e) {
            toggle();
        });
        holder.click(function() {
            $el.focus();
        });
        return {
            reset: reset
            , get: get
        }
    }
}(window, document);
