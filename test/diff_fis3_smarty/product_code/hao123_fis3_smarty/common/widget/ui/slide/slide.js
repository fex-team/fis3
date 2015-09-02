/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-1-15  下午4:43
 *
 */
var $ = require('common:widget/ui/jquery/jquery.js');
    var pluginName = "slide";
    var noop = function () {
    };

    var plugin = function (opts, elem) {
        if (!this._create) {
            return new plugin(opts, elem);
        }

        this.element = $(elem);
        this.options = $.extend(true, {}, this.options, this._getCreateOptions(), opts);
        this._create(this.options);
        return this;
    };

    plugin.prototype = {
        options: {
            slide: {
                index: 0, //显示第0个slide
                currentClass: "cur", //当前显示的slide添加的className
                container: ".slide-container", //包含所有slide的父节点  jQuery选择器或者dom元素 $(opts.container, this.element)
                content: ".slide" //所有slide节点  jQuery选择器或者dom元素 $(opts.content, this.container)

            }
        },
        length: null,
        _isAnimate: false,
        _needChangeClass: true, //是否要在每次slide播放时改变slide的currentClass （组件二次开发的时候使用，如animate.js中设置为false，再在动画过程中去设置）
        last: null,
        current: null,
        _setIndex: function (i) {
            var len=this.length;
            this.lastIndex = (len + this.index) % len;
            this.index = (len + i) % len;
        },
        _getCreateOptions: noop,
        init: noop,


        getItemByIndex: function (i) {
            return this.content.eq(i % this.length);
        },
        next: function (step) {
            if (step == undefined) {
                step = 1;
            }
            this.jump(this.index + step, step);
        },
        prev: function (step) {
            if (step == undefined) {
                step = 1;
            }
            this.jump(this.index - step, step);
        },
        _changeClass: function (addElem, delElem, className) {
            delElem.removeClass(className);
            addElem.addClass(className);
        },
        _changCurrentClass: function () {
            this._changeClass(this.current, this.last, this.options.slide.currentClass);
        },
        jump: function (index, step) {
            if (this._isAnimate) {//todo 是否要这个限制？？ 动画的时候不能再继续jump
                if (this.stopAnimate() == false) {
                    return;
                }
            }
            var lastIndex = this.index;//上一次位置
            if (lastIndex == index) {
                //lastIndex不做类似_setIndex中取余数的处理，是为了判断direct的方向
                return;
            }
            var direct = lastIndex < index ? 1 : -1; //direct=1, 正向（显示右边的dom元素，自右向左滚动）
            this._setIndex(index);//重置this.index ,this.last ,this.current
            this.last = this.current;
            this.current = this.getItemByIndex(this.index);

            if (this._needChangeClass) {
                this._changCurrentClass();
            }
            this.element.trigger("ui_jump", {
                direct: direct,
                step: step,
                lastIndex: lastIndex,
                index: this.index
            });

        },
        /**
         * 更新slide组件，如初始化后动态插入了slide，需要执行这个update方法
         */
        update: function () {
            for (var i = 0, len = this._updateFnArray.length; i < len; i++) {
                var fn = this._updateFnArray[i];
                fn.call(this, this.options);
            }
        },
        _updateSlide: function (options) {
            var opts = options.slide;
            this.container = $(opts.container, this.element);
            this.content = $(opts.content, this.container);
            this.length = this.content.length;
        },
        _create: function (options) {
            this._updateFnArray = [this._updateSlide];
            var _this = this, opts = options.slide;
            this._updateSlide(options);
            this.index = opts.index;
            this.last = this.current = this.getItemByIndex(this.index);
            this.current.addClass(opts.currentClass);

            //引入插件初始化
            for (var name in this) {
                name.replace(/^(?:_create)(\w+)/g, function (match, str) {
                    var fn = _this[match];
                    if ($.isFunction(fn)) {
                        var optionsName = str.replace(/^(\w)/, function (m, s) {
                            return s.toLowerCase();//首字母小写
                        });
                        //打包合并文件后引入了这个插件，但项目中又不需要，提供参数置空可以不初始化
                        //todo 有没有更好的方案？？？
                        if (options[optionsName] == undefined) {
                            return;
                        }
                        var ret = fn.call(_this, options);
                        if (ret !== undefined) {
                            _this[optionsName] = ret; //初始化的时候如果有返回值，将其挂载到 组件.参数名 下
                        }
                    }
                })
            }

            this.element.trigger("ui_create", options);
            this.init(options);
        }
    };

    plugin._extend = function (pluginImpl) {
        $.extend(true, plugin.prototype, pluginImpl);
    };


    //todo pluginName 可变
    $[pluginName] = plugin;
    $.fn[pluginName] = function (opts) {
        return this.each(function () {
            if (!$.data(this, "ui_" + pluginName)) {
                return $.data(this, "ui_" + pluginName, new plugin(opts, this));
            }
        });
    };


//    if (typeof define === "function") {
//        define("slide", function () {
//            return plugin;
//        });
//    }


