/**
 * jQuery sns-share plugin
 * @author yuji@baidu.com
 * @update 2013/10/31
 *
 * TODO:
 * 1. send to @wmf
 */

var $ = window.jQuery || window.require && require("common:widget/ui/jquery/jquery.js")
    , UT = window.require && require('common:widget/ui/ut/ut.js')
    , replaceTpl = window.require && require("common:widget/ui/helper/helper.js").replaceTpl || function(tpl, data, label) {
        var s = label || /#\{([^}]*)\}/mg,
            trim = function (str) {
                    return str.replace(/^\s+|\s+$/g, '')
                };
        return (tpl + "").replace(s, function (value, name) {
            return value = data[trim(name)] || "";
        });
    }

$ && !function(WIN, DOC, NAV, plugin, undef) {

    var winWidth = 555
        , winHeight = 382
        , openWinConfig = "width=#{width},height=#{height},top=#{top},left=#{left},location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no"

        /**
         * Merge data structure
         * @param  {[type]} target [description]
         * @param  {[type]} source [description]
         * @return {[type]}        [description]
         */
        , merge = function(target, source) {
            var tmp = {};
            $.extend(true, tmp, target);
            $.each(source || {}, function(k, v) {
                tmp[k] = v === v + "" ? v : $.extend(true, tmp[k], v);
            });
            return tmp;
        }

        , args = merge({
            /**
             * UI config
             * @type {Object}
             * @notice top / left default setting centered(can be {Number} or {Function})
             */
            ui: {
                width: winWidth
                , height: winHeight
                , top: function() {
                    return (screen.height - winHeight) / 2
                }
                , left: function() {
                    return (screen.width - winWidth) / 2
                }
                , skin: "skin"
                , eventType: "click"
                , tplWrap: '<ul class="sns-share sns-share--#{skin}">#{inner}</ul>'
                , tplLi: '<li class="sns-share_li sns-share_li-#{service}"><a href="#" data-sns-share="#{service}" title="#{service}" hidefocus="true" onclick="return !1"></a></li>'
            }

            /**
             * API services
             * @type {Object}
             */
            , services: {
                facebook: {
                    api: "https://www.facebook.com/sharer/sharer.php?s=100&p[title]=#{title}&p[summary]=#{summary}&p[images][0]=#{image}&p[url]=#{url}"
                }

                , facebook_feed: {
                    api: "https://www.facebook.com/dialog/feed?app_id=#{app_id}&display=popup&caption=#{summary}&link=#{url}&redirect_uri=#{redirect_uri}&name=#{title}&picture=#{image}&description=#{description}"
                    , active: false
                }

                , twitter: {
                    api: "https://twitter.com/intent/tweet?text=#{input}&url=#{url}"
                }

                , googleplus: {
                    api: "https://plus.google.com/share?url=#{url}&t=#{title}&hl=#{lang}"
                }

                , zingme: {
                    api: "http://link.apps.zing.vn/share?url=#{url}&title=#{title}&description=#{description}&screenshot=#{image}"
                }
            }

            /**
             * Default service
             * @type {Object}
             */
            , service: "facebook"

            /**
             * Share info
             * @type {Object}
             */
            , info: {
                url: WIN.location.href
                , title: DOC.title
                , summary: $("[name=title]").attr("content") || ""
                , image: WIN.location.protocol + '//' + WIN.location.host + "/static/web/common/img/fb-logo.png"
                , description: $("[name=description]").attr("content") || ""
                , input: ""
                , lang: NAV.browserLanguage || NAV.language || NAV.userLanguage || ""
            }
        }, (WIN.conf || {})[plugin])

        /**
         * Pubilc a static method
         * @param  {[type]} opts [description]
         * @return {[type]}      [description]
         */
        , share = $[plugin] = function(opts) {
            opts = merge(args, opts);
            var service = opts.service
                , info = opts.info
                , ui = opts.ui;

            if(!service) return !1;

            UT && UT.send({
                "type": "click"
                , "position": "sns"
                , "sort": service
                , "modId": "sns"
            });

            if($.isFunction(ui.top)) ui.top = ui.top();
            if($.isFunction(ui.left)) ui.left = ui.left();

            $.each(info, function(k, v) {
                info[k] = encodeURIComponent(v);
            });

            service = opts.services[service];
            if(service){
                if(opts.ui.winHandle){
                    opts.ui.winHandle.location.href = replaceTpl(service.api, info);
                }else{
                    WIN.open(replaceTpl(service.api, info), "", replaceTpl(openWinConfig, ui));
                }
            }

            return !1;
        }

    /**
     * Extend jQuery DOM
     * @param  {[type]} opts        [description]
     * @param  {[type]} avaibleList [description]
     * @param  {[type]} fix         [description]
     * @return {[type]}             [description]
     */
    $.fn[plugin] = function(opts, avaibleList, fix) {
        opts = merge(args, opts);

        $(this)
            .html(replaceTpl(opts.ui.tplWrap, {
                skin: opts.ui.skin
                , inner: function(list, services, tpl) {
                    var ret = [];
                    $.each(list || services, function(k, v) {
                        v.active != 0 && ret.push(replaceTpl(tpl, {
                            service: list ? v : k
                        }));
                    });
                    return ret.join("");
                }(avaibleList, opts.services, opts.ui.tplLi)
            }))
            .on(opts.ui.eventType, "[data-sns-share]", function(e) {
                var target = e.target;
                opts.service = $(target).data("sns-share");
                if(fix) opts = fix.call(target, opts);
                share(opts);
            });
    }
}(window, document, navigator, "snsShare");
