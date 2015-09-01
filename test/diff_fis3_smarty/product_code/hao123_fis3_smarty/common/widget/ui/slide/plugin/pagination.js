/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-1-16  下午12:44
 *
 */
 var $ = require('common:widget/ui/jquery/jquery.js');
    var pluginName = "slide";
    var debounce = function (func, wait) {
        var timeout, args, context, timestamp;

        var now = Date.now || function () {
            return new Date().getTime();
        };
        var later = function () {
            var last = now() - timestamp;
            if (last < wait) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                func.apply(context, args);
                context = args = null;
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = now();
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
        };
    };
    var plugin = $[pluginName];
    var pluginImpl = {
        options: {
            pagination: {
                elem: ".pagination", //包含pagination的父节点 jQuery选择器或者dom元素 $(opts.elem)
                child: "li", //所有pagination节点  jQuery选择器或者dom元素  $(opts.child, 父节点)
                currentClass: "cur", //当前显示的pagination添加的className
                type: "click"//["click"|"mouseenter"|"mousemove"] pagination父节点上冒泡监听的事件类型,mousemove支持debounce功能(50ms)
            }
        },
        paginationChange: function (data) {
            this.currentPagination.removeClass(this.options.pagination.currentClass);
            this._setCurrentPagination(data.index);

        },
        _getPagination: function (index) {
            return this.paginations.eq(index);
        },
        _setCurrentPagination: function (i) {
            this.currentPagination = this._getPagination(i);
            this.currentPagination.addClass(this.options.pagination.currentClass);
        },

        _updatePagination: function (options) {
            var opts = options.pagination;
            this.paginations = $(opts.child, $(opts.elem));
        },
        _createPagination: function (options) {
            this._updateFnArray.push(this._updatePagination); //更新pagination
            var _this = this;
            var opts = options.pagination;
            var ret = $(opts.elem);
            this._updatePagination(options);
            this._setCurrentPagination(this.index);

            var eventFn = function () {
                var i = _this.paginations.index(this);
                _this.jump(i);
            };
            if (opts.type == "mousemove") {
                eventFn = debounce(eventFn, 50);
            }
            ret.on(opts.type, opts.child, function () {
                eventFn.call(this);
            });

            this.element.on("ui_jump", function (e, data) {
                _this.paginationChange(data);
                return false; //不要冒泡，防止组件套组件的时候，子组件消息传递到父组件
            });

            return ret;
        }
    };
    plugin._extend(pluginImpl);

