/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-1-22  下午5:22
 *
 */
var $ = require('common:widget/ui/jquery/jquery.js');
    var pluginName = "slide";
    var plugin = $[pluginName];
    var pluginImpl = {
        options: {
            control: {
                left: ".control-left",  //左边的控制按钮的节点 jQuery选择器或者dom元素  $(opts.left)
                right: ".control-right", //同上，右边的控制按钮
                disableClass: "control-disable", //按钮失效时添加的className （非循环轮播的情况下可以使用）
                type: "click" //控制按钮监听的事件
            }
        },
        disableControl: function (type) {
            this.control[type].addClass(this.options.control.disableClass);
        },
        enableControl: function (type) {
            this.control[type].removeClass(this.options.control.disableClass);
        },
        _createControl: function (options) {
            var _this = this;
            var opts = options.control;
            var ret = {};
            $.each(["left", "right"], function (i, name) {
                ret[name] = $(opts[name]).on(opts.type, function () {
                    if (ret[name].hasClass(opts.disableClass)) {//todo 此处不应该用class来判断是否可点击，多个轮播公用一个control的时候没有考虑到
                        return;
                    }
                    i ? _this.next() : _this.prev();
                    _this.element.trigger("ui_control", {
                        type: name,//"left","right"
                        elem: ret[name] // 按钮的元素
                    });
                });
            });
            return ret;
        }
    };
    plugin._extend(pluginImpl);
