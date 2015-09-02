/**
 * jQuery custom-scrollbar plugin
 * @author yuji@baidu.com
 * @update 2013/10/17
 *
 * Compatibility:
 * 1. IE 6-10, Firefox, Opera, Chrome, Safari
 * 2. ltr/rtl
 * 3. Windows / Mac
 * 4. Mouse / Touchpad
 *
 * TODO:
 *
 * 1. [Feature] drag when middle-key is pressing
 * 2. [Feature] support mobil device
 * 3. [API] destroy support
 */

// var $ = window.jQuery || window.require && require("common:widget/ui/jquery/jquery.js");

!function(WIN, DOC, $, undef) {

$ = $ || window.require && require("common:widget/ui/jquery/jquery.js");

if(!$) return;

/**
 * check if3D hardware acceleration supports
 * @type {String}
 */
var supportCss3d = "WebKitCSSMatrix" in WIN && "m11" in new WebKitCSSMatrix()

    /**
     * check ifMutationObserver supports
     */
    // , MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

    /**
     * Constructor
     * @param {[type]} el [description]
     * @param {[type]} args [description]
     * @return {[type]} [description]
     */
    , scroll = function($el, args) {

        var that = this;

        that.$el = $el;
        that.el = $el[0];

        that.$parent = that.$el.parent();
        that.state = {};

        // Default options
        that.args = $.extend({

            /**
             * mousewheel speed
             * @type {Number}
             */
            wheelSpeed: 20

            /**
             * Mousedown pressing delay on scrollbar
             * @type {Number}
             */
            , pressDelay: 200

            /**
             * Timer of update layout(0 | false ==> do not check)
             * @type {Number}
             */
            , watch: 200

            /**
             * Direction, default to auto
             * @type {String}
             */
            , dir: ""

            /**
             * Auto hide scrollbar when mouseleave
             * @type {String|Bool|Number}
             * @example: true, 1, "1" ==> true | false, 0, "0" ==> false
             */
            , autoHide: true

            /**
             * Add a activate class when pressing or dragging
             * @type {String}
             */
            , activateClass: "mod-scroll--activate"

            /**
             * Add a custom class, like: "mod-scroll--black"
             * @type {String}
             */
            , customClass: ""

            /**
             * Prevent default Wheel event
             * @type {Boolean}
             */
            , preventDefaultWheel: false

            /**
             * The suffix-classes of controller elements
             * @type {Object}
             */
            , controller: {
                barX: "bar-x"
                , barY: "bar-y"
                , thumbX: "thumb-x"
                , thumbY: "thumb-y"
            }

            // , bounds

            /**
             * Event API
             * onInit
             * onScroll
             *
             * onWheel
             *
             * onStartPress
             * onEndPress
             *
             * onStartDrag
             * onEndDrag
             */
        }, args);

        that.init();
    }

    , fn = scroll.prototype;

/**
 * Initialization
 * @return {[type]} [description]
 */
fn.init = function() {
    var that = this
        , $el = that.$el
        , $parent = that.$parent
        , $wrap = that.$wrap = $("<div>");

    // Initialization controller Layout
    $.map(that.args.controller, function(v, k) {
        $wrap.append(that.state["$" + k] = $('<div class="mod-scroll_' + v + '"></div>'));
    });

    // Update State
    that.updateState();

    // Update Layout
    that.initLayout();

    $parent.css("position") === "static" && $parent.css({
        "position": "relative"
    });

    if(that.state.autoHide) {
        $wrap.css({
            "display": "none"
        });
        $parent
            .on("mouseenter", function() {
                $wrap.css({
                    "display": "block"
                });
            })
            .on("mouseleave", function() {
                !that.state.draging && $wrap.css({
                    "display": "none"
                });
            });
    }

    $parent
        .css({
            overflow: "hidden"
        })
        .append($wrap)

        // firefox Compatible, not require jquery.mousewheel
        .on(DOC.onmousewheel !== undef ? "mousewheel" : "DOMMouseScroll", function(e) {
            that.wheelHandle.call($el, e, that);
        });

    $wrap
        .addClass("mod-scroll " + that.args.customClass)
        .on("mousedown", function(e) {
            e.preventDefault();
            that.mouseHandle.call(e.target, e, that);
        });

    // Observer fallback to IE / Opera
    // if(!MutationObserver)

    if(that.args.watch != 0) that.resizeTimer = setInterval(function() {
        that.detectLayout() && that.resizeHandle.call(that);
    }, that.args.watch);

    that.args.onInit && that.args.onInit.call(that);

    /*rAF(function(scrolling) {
    scrolling = state.scrolling;

    if(scrolling) {
    state.scrolling = 0;
    var axis = scrolling.axis
    , e = scrolling.e
    , n = scrolling.n
    , tmp = scrolling.tmp
    , pos = scrolling.pos
    , N = scrolling.N
    , $thumb = scrolling.$thumb;

    state[axis] = that.fixPos(-n * (axis === "y"
    ? tmp.h + e.pageY - tmp.y
    : tmp.w + e.pageX - tmp.x) / N, axis);

    that.$wrap.addClass(that.args.activateClass);

    // disable userselect during dragging
    if(typeof userSelect === "string"){
    return document.documentElement.style[userSelect] = "none";
    }
    document.unselectable = "on";
    document.onselectstart = function(){
    return false;
    }

    that.args.onStartDrag && that.args.onStartDrag.call(that);

    that.scrollTo(that.$el, {
    x: state.x
    , y: state.y
    });

    pos[axis] = Math.floor(-state[axis] * N / n);
    that.scrollTo($thumb, pos);

    that.args.onScroll && that.args.onScroll.call(that);

    }
    rAF(arguments.callee);
    });*/
}

/**
 * Update State
 * @return {[type]} [description]
 */
fn.updateState = function() {
    var that = this
        , $el = that.$el
        , $parent = that.$parent
        , state = $.extend(that.state, {

            // Auto detect direction
            dir: function(el, dir) {
                that.args.dir = el.currentStyle

                ? el.currentStyle[dir]

                // fix firefox bug, @see: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
                : function() {
                    var result = "";
                    if(WIN && WIN.getComputedStyle(el, null)) {
                        result = WIN.getComputedStyle(el, null).getPropertyValue(dir);
                    } else {
                        result = DOC.documentElement.dir;
                    }
                    return result || "ltr";
                }();
                return that.args.dir === "ltr";
            }(that.el, "direction")

            , autoHide: that.args.autoHide == 1

            // Outer Height
            , H: $parent.height()

            // Inner Height
            , h: $el.outerHeight()

            // Outer Width
            , W: $parent.width()

            // Inner Width
            , w: $el.outerWidth()

            // Axis-x current-offset of Content
            , x: that.state.x || 0

            // Axis-y current-offset of Content
            , y: that.state.y || 0
        })

        /**
         * Get thumb size
         * @param {[type]} outer [description]
         * @param {[type]} inner [description]
         * @return {[type]} [description]
         */
        , thumbSize = function(outer, inner) {
            return Math.floor(Math.min(Math.pow(outer, 2) / inner, outer));
        };

    that.state = $.extend(state, {

        // Update scroll offset
        _x: Math.max(state.w - state.W, 0)
        , _y: Math.max(state.h - state.H, 0)

        // Update thumb size
        , _w: thumbSize(state.W, state.w)
        , _h: thumbSize(state.H, state.h)
    });
}

/**
 * Initialization Layout
 * @return {[type]} [description]
 */
fn.initLayout = function() {
    var that = this
        , state = that.state
        , $el = that.$el
        , $parent = that.$parent
        , $wrap = that.$wrap
        , style = {}
        , isShowX = state.W < state.w
        , isShowY = state.H < state.h;

    // Reset Layout
    style[state.dir ? "right" : "left"] = 0;
    style.display = isShowY ? "block" : "none";
    state.$barY.css(style);
    state.$thumbY.css(style).css({
        "height": state._h + "px"
    });

    style = {};
    style[state.dir ? "left" : "right"] = 0;
    style.display = isShowX ? "block" : "none";
    state.$barX.css(style);
    state.$thumbX.css(style).css({
        "width": state._w + "px"
    });

    // Start Observer
    /*if(MutationObserver) {
    that.observer = new MutationObserver(function(mutations) {
    // console.log(mutations)
    that.detectLayout() && that.resizeHandle.call(that);
    });

    $($el, $parent).each(function() {
    that.observer.observe(this, {
    attributes: true
    , childList: true
    , characterData: true
    // , subtree: true
    // , attributeFilter: ["dir"]
    });
    });
    }*/
}

fn.moveThumb = function(duration) {
    var that = this
        , state = that.state;

    that.scrollTo(state.$thumbX, {
        x: Math.floor(-state.x * state.W / state.w)
        , y: 0
    }, duration);

    that.scrollTo(state.$thumbY, {
        x: 0
        , y: Math.floor(-state.y * state.H / state.h)
    }, duration);
}

fn.resizeHandle = function() {
    var that = this
        , state = that.state;

    // that.observer && that.observer.disconnect();

    that.updateState();

    that.moveThumb();

    that.initLayout();
}

/**
 * [selectable description]
 * @param {Boolean} isPrevent [description]
 * @param {Object} $el [description]
 * @return {Object} [description]
 */
fn.selectable = function(isPrevent, $el) {
    return $el || $("body")
        .css("user-select", isPrevent ? "none" : "text")
        .attr("unselectable", isPrevent ? "on" : "off")[isPrevent ? "on" : "off"]("selectstart.scroll", false);
}

/**
 * Mouse evnent handle, contains click & drag
 * @param {[type]} e [description]
 * @param {[type]} that [description]
 * @return {[type]} [description]
 */
fn.mouseHandle = function(e, that) {
    var $target = $(this)
        , state = that.state
        , axis = "x"
        , n = state.w
        , N = state.W
        , pos = {
            x: 0
            , y: 0
        }
        , $thumb = state.$thumbX
        , isPressing = !1
        , pressed = 0
        , tmp
        , pressing = function() {
            var offset;

            state[axis] = that.fixPos(state[axis] + N * ((axis === "y"

                // jQuery bug on firefox: e.offsetY ==> undefined & position().top ==> 0
                // @see: http://bugs.jquery.com/ticket/8523
                // ? e.offsetY > state.$thumbY.position().top
                // : e.offsetX > state.$thumbX.position().left) ? -1 : 1), axis);
                ? e.pageY - $target.offset().top > Math.max(parseFloat(state.$thumbY.css("marginTop")), state.$thumbY.position().top)
                : e.pageX - $target.offset().left > Math.max(parseFloat(state.$thumbX.css("marginLeft")), state.$thumbX.position().left)) ? -1 : 1), axis);

            that.scrollTo(that.$el, {
                x: state.x
                , y: state.y
            });

            pos[axis] = Math.floor(-state[axis] * N / n);
            that.scrollTo($thumb, pos);

            offset = (axis === "x"
                ? e.pageX - $target.offset().left
                : e.pageY - $target.offset().top) - pos[axis];

            offset = offset > 0
            ? offset > (axis === "x"
                ? state._w
                : state._h)
            : offset < 0;

            that.args.onScroll && that.args.onScroll.call(that, e);

            if(!offset) {
                isPressing = !1;
                pressed = 1;
                that.$wrap.removeClass(that.args.activateClass);

                that.args.onEndPress && that.args.onEndPress.call(that);
            }

            isPressing && setTimeout(function() {
                isPressing && pressing();
            }, that.args.pressDelay);
        };

    if(this === state.$thumbY[0] || this === state.$barY[0]) {
        axis = "y";
        n = state.h;
        N = state.H;
        $thumb = state.$thumbY;
    }

    if(this === state.$thumbX[0] || this === state.$thumbY[0]) {

        tmp = {
            x: e.pageX
            , y: e.pageY

            // jQuery bug on firefox: e.offsetY ==> undefined & position().top ==> 0
            // , h: $target.position().top
            // , w: $target.position().left
            , h: Math.max(parseFloat($target.css("marginTop")), $target.position().top)
            , w: Math.max(parseFloat($target.css("marginLeft")), $target.position().left)
        }

        if(!state.dir) tmp.w = tmp.w - state._w;
        state.draging = !0;

        $(DOC)
            .on("mousemove.scroll", function(e) {

                state[axis] = that.fixPos(-n * (axis === "y"
                    ? tmp.h + e.pageY - tmp.y
                    : tmp.w + e.pageX - tmp.x) / N, axis);

                that.$wrap.addClass(that.args.activateClass);

                // disable userselect during dragging
                that.selectable(1);

                that.args.onStartDrag && that.args.onStartDrag.call(that);

                that.scrollTo(that.$el, {
                    x: state.x
                    , y: state.y
                });

                pos[axis] = Math.floor(-state[axis] * N / n);

                // Dynamic fix, for lazyload when drag.
                pos[axis] = Math.min(pos[axis], N - (axis == "y" ? state._h : state._w));
                that.scrollTo($thumb, pos);
                that.args.onScroll && that.args.onScroll.call(that, e);
            });
    }

    else if(this === state.$barX[0] || this === state.$barY[0]) {
        // isPressing = !1;
        isPressing = !0;

        that.$wrap.addClass(that.args.activateClass);

        that.args.onStartPress && that.args.onStartPress.call(that);
        pressing();
    }

    $(DOC)
        .on("mouseup.scroll", function() {
            $(this).off("mousemove.scroll").off("mouseup.scroll");
            !pressed && that.args.onEndPress && that.args.onEndPress.call(that);
            isPressing = !1;
            state.draging = !1;
            that.$wrap.removeClass(that.args.activateClass);

            // enable userselect after dragging
            that.selectable(0);
            that.resizeHandle();
            that.args.onEndDrag && that.args.onEndDrag.call(that);
        });
}

/**
 * Mouse wheel event handle
 * @param {[type]} e [description]
 * @param {[type]} that [description]
 * @return {[type]} [description]
 */
fn.wheelHandle = function(e, that) {

    var state = that.state
        , $el = $(that.el)
        , getOffset = function(axis) {
            var delta = that.getDelta(e)
                , wheelDir = that.args.wheelDir;

            if(wheelDir) {
                delta[wheelDir] = delta[wheelDir === "x" ? "y" : "x"];
                delta[wheelDir === "x" ? "y" : "x"] = 0;
            }
            return that.state[axis] + delta[axis] * that.args.wheelSpeed;
        }
        , x = getOffset("x")
        , y = getOffset("y")
        , _x = that.fixPos(x, "x")
        , _y = that.fixPos(y, "y")
        , isScrollable = !x && _y === that.state.y || !y && _x === that.state.x || x < _x || y < _y;

    !isScrollable && e.stopPropagation();
    !(!that.args.preventDefaultWheel && isScrollable) && e.preventDefault();

    that.scrollTo(that.$el, {
        x: _x
        , y: _y
    });

    that.state.x = _x;
    that.state.y = _y;

    that.moveThumb();

    that.args.onWheel && that.args.onWheel.call(that, e);
    that.args.onScroll && that.args.onScroll.call(that, e);
}

/**
 * Fixed bounds check
 * @param {[type]} n [description]
 * @param {[type]} axis [description]
 * @return {[type]} [description]
 */
fn.fixPos = function(n, axis) {
    var min = Math.min
        , max = Math.max
        , N = -this.state["_" + axis];

    if(!this.state.dir && axis === "x") {
        min = Math.max;
        max = Math.min;
        N = -N;
    }
    return Math.floor(max(min(n, 0), N));
}

/**
 * Detect layout is dynamic changed
 * @return {[type]} [description]
 */
fn.detectLayout = function() {
    var that = this,
        state = that.state;

    return !(state.h === that.$el.outerHeight()
        && state.w === that.$el.outerWidth()
        && state.H === that.$parent.height()
        && state.W === that.$parent.width());
}

/**
 * Keep scroll function simplest
 * @type {[type]}
 */
fn.scrollTo = supportCss3d
? function($el, pos) {
    $el.css({"transform": "translate3d(" + pos.x + "px," + pos.y + "px, 0)"});
}
: function($el, pos, duration) {
    if(isNaN(pos.x) || !isFinite(pos.x)) pos.x = 0;
    if(isNaN(pos.y) || !isFinite(pos.y)) pos.y = 0;

    var margin = this.state.dir
        ? pos.y + "px" + " auto auto " + pos.x + "px"
        : pos.y + "px " + -pos.x + "px auto auto";

    duration
    ? $el.animate({
        "margin": margin
    }, duration, "swing")
    : $el[0].style.margin = margin;
}

/**
 * Move Content to {x, y}
 * @type {[type]}
 */
fn.goTo = function(pos, duration, callback) {
    var that = this;
    that.updateState();
    $.each(pos, function(k, v) {
        that.state[k] = that.fixPos(v, k);
    });

    // support animate
    if(duration) {
        that.$parent.addClass("mod-scroll--animate");
        setTimeout(function() {
            that.$parent.removeClass("mod-scroll--animate");
            callback && callback();
        }, 1000);
    }
    else callback && callback();

    that.moveThumb(duration);
    that.initLayout();
    that.scrollTo(that.$el, {
        x: that.state.x
        , y: that.state.y
    }, duration);

    return that;
}

/**
 * Compatible get wheel delta
 * @param {[type]} e [description]
 * @return {[type]} [description]
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference%2Fwheel
 */
fn.getDelta = function(e) {
    e = e.originalEvent || e;
    var delta = {
        delta: 0
        , x: 0
        , y: 0
    };

    // stupid bugs, but who cares
    // 1. early safari float bug: e.wheelDelta ==> Math.round(e.wheelDelta)
    // 2. opera 9 bug: e.wheelDelta ==> -e.wheelDelta
    delta.delta = e.wheelDelta !== undef
        ? e.wheelDelta / 120
        : -(e.detail || 0) / 3;

    // Gecko
    if(e.axis) delta[e.axis === e.HORIZONTAL_AXIS ? "x" : "y"] = delta.delta;

    // Webkit
    else if(e.wheelDeltaX !== undef) {
        delta.x = e.wheelDeltaX / 120;
        delta.y = e.wheelDeltaY / 120;
    }

    // fallback
    else delta.y = delta.delta;
    return delta;
}

// TODO
fn.destroy = function() {
    var that = this;

    // Stop observer
    /* MutationObserver
    ? that.observer && that.observer.disconnect()
    : clearInterval(that.resizeTimer);*/

    that.resizeTimer && clearInterval(that.resizeTimer);
}

// jQuery plugin wraper
$.fn.extend({
    /**
     * plugin
     *
     * @param {Object} argument comment
     */
    scrollable: function(args) {
        return new scroll(this, args);
    }
});

}(window, document, window.jQuery);
