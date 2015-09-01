/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-2-12  上午11:11
 *
 */
var $ = require('common:widget/ui/jquery/jquery.js');
    var pluginName = "slide";
    var plugin = $[pluginName];
    var pluginImpl = {
        options: {
            play: {
                reverse: false, //反向播放,默认播放顺序是从左到右
                auto: true, //是否自动播放
                pause: true, //鼠标移动到slide可以暂停自动播放
                delay: 3000 //自动播放延迟
            }
        },
        _autoPlayTimer: null,
        play: function () {
            var _this = this, opts = this.options.play;
            this._autoPlayTimer = setTimeout(function () {
                opts.reverse ? _this.prev() : _this.next();
            }, opts.delay);
        },
        pause: function () {
            var _this = this;
            this.container.hover(function () {
                _this.stop();
            }, function () {
                _this.play();
            });
        },
        stop: function () {
            clearTimeout(this._autoPlayTimer);
        },
        _createPlay: function (options) {
            var _this = this;
            var opts = options.play;
            if (opts.auto) {
                opts.pause && this.pause();

                this.element.on("ui_jump", function () {
                    _this.stop();
                    _this.play();
                    return false;
                });

                this.play();
            }
        }
    };
    plugin._extend(pluginImpl);
