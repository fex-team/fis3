/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-1-20  下午2:06
 *
 */
var $ = require('common:widget/ui/jquery/jquery.js');
var slide = require('common:widget/ui/slide/slide.js');
    var pluginName = "slide";
    var vendorPrefix = (function () { //todo jquery自动加上了vendorPrefix，简化为判断是否支持css3的transition
        var body = document.body || document.documentElement,
            style = body.style;
        var transition = "Transition";
        var vendor = [ "O", "ms" , "Moz", "Webkit"], len = vendor.length;
        while (len--) {
            if (vendor[len] + transition in style) {
                return vendor[len];
            }
        }
        return false;
    })();

    var pluginImpl = {
        options: {
            animate: {
                pca: true,//prevent continuous animation 阻止连续动画   todo 命名???
                currentClass: "cur", //当前显示的slide添加的className,
                styles: "slide", //["fade"|"slide"]轮播动画类型
                easing: "ease-in-out", //css3支持的animation-timing-function. (由于jQuery默认只提供"linear" 和 "swing",在不支持css3的浏览器，easing的参数不为linear时全部变为swing)
                speed: 800 //动画持续时间
            }
        },

        slide: function (direct, opts) {
            var _this = this, speed = opts.speed, easing = opts.easing;
            var value = [ "-100%" , "0", "100%"];
            this.current.css("left", value[1 + direct]).show();
            if (vendorPrefix) {
                this.container.css({
                    "transform": "translateX(" + value[1 - direct] + ")", //todo translateY
                    "transitionTimingFunction": easing,
                    "transitionDuration": speed + "ms"
                }).one("transitionend", function () {
                    _this._slideDone(direct);
                });
            } else {
                this.container.animate({"left": value[1 - direct]}, speed, easing, function () {
                    _this._slideDone(direct);
                });
            }
        },
        _triggerAnimateDone: function (name) {//todo 统一动画完成事件
            this._isAnimate = false;
            this.element.trigger("ui_" + name + "_done", {
                current: this.current,
                last: this.last,
                lastIndex: this.lastIndex,
                index: this.index
            });
        },
        _slideDone: function (direct) {
            this._changCurrentClass();
            this.container.removeAttr("style");//todo 默认style
            this.last.hide();
            this.current.css("left", 0).show();
            this._triggerAnimateDone("slide");
        },
        _slideStop: function () { //todo
        },

        fade: function (direct, opts) {
            var _this = this, speed = opts.speed;
            var flag = 2;
            this.last.fadeOut(speed, function () {
                _this._fadeDone(--flag);
            });
            this.current.fadeIn(speed, function () {
                _this._fadeDone(--flag);
            });
        },
        _fadeDone: function (flag) {
            if (flag == 0) {
                this._changCurrentClass();
                this._triggerAnimateDone("fade");
            }
        },
        _fadeStop: function () { //todo
        },
        animate: function (direct, step) {
            this._isAnimate = true;
            var opts = this.options.animate;
            opts.step = step;
            this.element.trigger("ui_" + opts.styles + "_start", {
                current: this.current,
                last: this.last,
                lastIndex: this.lastIndex,
                index: this.index
            });
            this[opts.styles](direct, opts);
            if (!opts.pca) {
                this.stopAnimate = this["_" + opts.styles + "Stop"];
            }
        },
        stopAnimate: function () { //阻止连续动画
            return false;
        },
        _createAnimate: function (options) {
            var _this = this;
            this.supportCss3 = vendorPrefix;
            if (!vendorPrefix && options.animate.easing != "linear") {
                //由于jQuery默认只提供"linear" 和 "swing",在不支持css3的浏览器，easing的参数不为linear时全部变为swing
                options.animate.easing = "swing";
            }
            this._needChangeClass = false;
            this.element.on("ui_jump", function (e, data) {
                _this.animate(data.direct, data.step);
                return false;
            });
        }
    };

    var plugin = $[pluginName];
    plugin._extend(pluginImpl);
