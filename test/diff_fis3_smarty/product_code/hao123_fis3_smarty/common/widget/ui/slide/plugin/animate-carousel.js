/**
 *
 * Author: songyaru | songyaru9@gmail.com
 * Date: 14-2-24  下午2:06
 *
 */
var $ = require('common:widget/ui/jquery/jquery.js');
    var pluginName = "slide";
    var plugin = $[pluginName];
    var pluginImpl = {
        options: {
            animate: {
                styles: "carousel",
                easing: "ease-out"
            },
            carousel: {
                max: 5,//一行同时显示的slide数 必须为奇数
                info: {
                    size: [
                        {w: 180, h: 80},//小中大三种slide的尺寸 从左到右
                        {w: 260, h: 120},
                        {w: 340, h: 160}
                    ],
                    len: [60, 100], //表示slide隐藏的长度 从左到右
                    top: [60, 30, 10]//表示slide距离父容器顶部的距离
                }
            }
        },
        carousel: function (direct, options) {
            this._changCurrentClass();
            var _this = this;
            var opts = this.options.carousel;

            var speed = options.speed;
            var step = options.step; //步长
            var flag = opts.max + step;//dom元素动画
            var mid = opts.mid;

            var resetCss = opts.resetCss,
                resetCssText = opts.resetCssText,
                transitionStyle = opts.transitionStyle,
                rLeft = Math.abs(parseInt(resetCss["margin-left"]));

            var tmpSlide, loop = step, lastIndex = this.lastIndex;
            while (loop--) {
                //todo 最后一个右边的slde有可能是第一个（slide个数不够），动画可能出现从最左边飞到最右边。
                //todo 因此要求step=1时 至少要有6张slide，step=2时 至少要有7张slide
                resetCss["margin-left"] = rLeft * direct + "px"; //将隐藏的slide放在出场的位置
                this.getItemByIndex(lastIndex + (mid + 1 + loop) * direct).css(resetCss);//正向时(direct=1,从右向左滑动)，最后一个右边的slide

                resetCss["margin-left"] = -rLeft * direct + "px";
                tmpSlide = this.getItemByIndex(lastIndex - (mid - loop) * direct).css("z-index", loop);
                if (this.supportCss3) {
                    tmpSlide.css(resetCss).css({"transition": transitionStyle, "z-index": loop})
                        .one("transitionend", function () {
                            this.style.cssText = resetCssText;
                            _this._carouselDone(--flag);
                        });
                } else {
                    tmpSlide.animate(resetCss, speed, function () {//将要隐藏的slide
//                        this.style.cssText = resetCssText;
                        _this._carouselDone(--flag);
                    });
                }
            }

            var tmpSlides = [];
            for (var i = 0; i < opts.max; i++) {
                tmpSlide = _this.getItemByIndex(lastIndex - mid + i + step * direct);
                if (_this.supportCss3) {
                    tmpSlides.push(tmpSlide);
                }
                else {
                    tmpSlide.css({"z-index": opts.css[i]["z-index"]}).animate(opts.css[i], speed, function () {
                        _this._carouselDone(--flag);
                    });
                }
            }

            //使用css3时，如果不设置延迟，那么line 48 隐藏的slide放在出场的位置将会失效 (ie/firefox 延迟设小了不生效，因此这里设置为50ms)
            if (_this.supportCss3) {
                setTimeout(function () {
                    for (var i = 0; i < opts.max; i++) {
                        tmpSlides[i].css(opts.css[i]).css({"transition": transitionStyle})
                            .one("transitionend", function () {
                                _this._carouselDone(--flag);
                            });
                    }
                }, 50);
            }
        },
        _carouselDone: function (flag) {
            if (flag == 0) {
                this._triggerAnimateDone("carousel");
            }
        },
        _carouselStop: function () {//todo
        },
        _createCarousel: function (options) {
            if (options.animate == undefined || options.animate.styles != "carousel") {
                return;
            }
            this._needChangeClass = false;
            var _this = this, opts = options.carousel, slideOpts = options.slide;

            //生成slide的样式信息
            opts.css = [];
            var mid = opts.max / 2 | 0;
            var midSlideHalfWidth = opts.info.size[mid].w / 2;
            for (var i = 0; i < opts.max; i++) {
                var j = mid - Math.abs(i - mid);
                opts.css[i] = {};
                opts.css[i]["z-index"] = j + 2;
                opts.css[i].width = opts.info.size[j].w + "px";
                opts.css[i].height = opts.info.size[j].h + "px";
                opts.css[i].top = opts.info.top[j] + "px";


                var mLeft = midSlideHalfWidth;
                if (i > mid) {
                    mLeft -= opts.info.len[mid - 1];
                    for (var k = 0; mid - j - k > 1; k++) {
                        mLeft += opts.info.size[mid - k - 1].w - opts.info.len[mid - k - 2];
                    }
                } else { //i<=mid
                    for (; j < mid; j++) {
                        mLeft += opts.info.size[j].w - opts.info.len[j];
                    }
                    mLeft = -mLeft;
                }
                opts.css[i]["margin-left"] = mLeft + "px";
                this.getItemByIndex(i - mid + this.index).css(opts.css[i]);
            }

            var restLeft = midSlideHalfWidth;
            for (i = 0; i < mid; i++) {
                restLeft += opts.info.size[i].w - opts.info.len[i];
            }
            opts.resetCss = {
                width: 0,
                height: 0,
                top: (opts.info.top[0] + opts.info.size[0].h) + "px",
                "margin-left": restLeft + "px",
                "z-index": 0
            };

            opts.resetCssText = "";
            for (var key in opts.resetCss) {
                opts.resetCssText += key + ":" + opts.resetCss[key] + ";";
            }

            var animateOpts = this.options.animate;
            var transitionStyle = "";
//            this.supportCss3 = false;
            if (this.supportCss3) {
                ["width", "height", "top", "margin-left"].forEach(function (v, i) {
                    transitionStyle += v + " " + animateOpts.speed + "ms " + animateOpts.easing
                        + (i < 3 ? "," : "");
                });
                opts.transitionStyle = transitionStyle;
            }


            //绑定slide点击事件 todo 移出来
            opts.mid = mid;
            var contents = this.content;
            this.container.on("click", slideOpts.content, function () {
                var index = contents.index(this);
                var step = index - _this.index;
                if (step == 0) {
                    return;
                }

                var isLeft = parseInt(this.style.marginLeft) < 0 ? -1 : 1;//点击位置在左侧  todo 此处和css耦合了
                if (step * isLeft < 0) { //说明点击左边slide的index大于中间的index      或者右边的index小于中间的index
                    step += isLeft * _this.length;
                }

                step > 0 ? _this.next(step) : _this.prev(-step);
            });
        }
    };

    plugin._extend(pluginImpl);
