var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');

/************************base.js**********************************/
window.Gl || (window.Gl = {});
Gl.number || (Gl.number = {});
Gl.number.pad = function (source, length) {
    var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));

    if (string.length < length) {
        pre = (new Array(length - string.length + 1)).join('0');
    }

    return (negative ?  "-" : "") + pre + string;
};
Gl.guid = "$HAO123$";
window[Gl.guid] = window[Gl.guid] || {};
Gl.lang = Gl.lang || {};
(function(){
    //不直接使用window，可以提高3倍左右性能
    var guid = window[Gl.guid];

    Gl.lang.guid = function() {
        return "HAOPLAYER__" + (guid._counter ++).toString(36);
    };

    guid._counter = guid._counter || 1;
})();
Gl.browser || (Gl.browser = {});
Gl.browser.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
Gl.browser.chrome = /chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;
Gl.browser.firefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;
Gl.browser.isWebkit = /webkit/i.test(navigator.userAgent);
Gl.browser.maxthon = /(\d+\.\d+)/i.test(external.max_version) ? + RegExp['\x241'] : undefined;
Gl.browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(navigator.userAgent) && !/chrome/i.test(navigator.userAgent) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
Gl.string || (Gl.string = {});
Gl.string.encodeHTML = function (source) {
    return String(source)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
};
Gl.array || (Gl.array = {});
Gl.array.remove = function (source, match) {
    var len = source.length;
    while (len--) {
        if (len in source && source[len] === match) {
            source.splice(len, 1);
        }
    }
    return source;
};
Gl.swf || (Gl.swf = {});
Gl.swf.create = function (options, target) {
    options = options || {};
    var html = Gl.swf.createHTML(options)
               || options['errorMessage']
               || '';
    if (target && 'string' == typeof target) {
        target = jQuery('#'+target);
    }
    if (target) {
        target.html(html);
    } else {
        document.write(html);
    }
};
Gl.swf.createHTML = function (options) {
    options = options || {};
    var version = this.version,
        needVersion = options['ver'] || '6.0.0',
        vUnit1, vUnit2, i, k, len, item, tmpOpt = {};
        //Gl.string.encodeHTML = baidu.string.Gl.string.encodeHTML

    // 复制options，避免修改原对象
    for (k in options) {
        tmpOpt[k] = options[k];
    }
    options = tmpOpt;

    // 浏览器支持的flash插件版本判断
    if (version) {
        version = version.split('.');
        needVersion = needVersion.split('.');
        for (i = 0; i < 3; i++) {
            vUnit1 = parseInt(version[i], 10);
            vUnit2 = parseInt(needVersion[i], 10);
            if (vUnit2 < vUnit1) {
                break;
            } else if (vUnit2 > vUnit1) {
                return ''; // 需要更高的版本号
            }
        }
    } else {
        return ''; // 未安装flash插件
    }

    var vars = options['vars'],
        objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];

    // 初始化object标签需要的classid、codebase属性值
    options['align'] = options['align'] || 'middle';
    options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
    options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
    options['movie'] = options['url'] || '';
    delete options['vars'];
    delete options['url'];

    // 初始化flashvars参数的值
    if ('string' == typeof vars) {
        options['flashvars'] = vars;
    } else {
        var fvars = [];
        for (k in vars) {
            item = vars[k];
            fvars.push(k + "=" + encodeURIComponent(item));
        }
        options['flashvars'] = fvars.join('&');
    }

    // 构建IE下支持的object字符串，包括属性和参数列表
    var str = ['<object '];
    for (i = 0, len = objProperties.length; i < len; i++) {
        item = objProperties[i];
        str.push(' ', item, '="', Gl.string.encodeHTML(options[item]), '"');
    }
    str.push('>');
    var params = {
        'wmode'             : 1,
        'scale'             : 1,
        'quality'           : 1,
        'play'              : 1,
        'loop'              : 1,
        'menu'              : 1,
        'salign'            : 1,
        'bgcolor'           : 1,
        'base'              : 1,
        'allowscriptaccess' : 1,
        'allownetworking'   : 1,
        'allowfullscreen'   : 1,
        'seamlesstabbing'   : 1,
        'devicefont'        : 1,
        'swliveconnect'     : 1,
        'flashvars'         : 1,
        'movie'             : 1
    };

    for (k in options) {
        item = options[k];
        k = k.toLowerCase();
        if (params[k] && (item || item === false || item === 0)) {
            str.push('<param name="' + k + '" value="' + Gl.string.encodeHTML(item) + '" />');
        }
    }

    // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
    options['src']  = options['movie'];
    options['name'] = options['id'];
    delete options['id'];
    delete options['movie'];
    delete options['classid'];
    delete options['codebase'];
    options['type'] = 'application/x-shockwave-flash';
    options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';


    // 构建embed标签的字符串
    str.push('<embed');
    // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
    // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
    var salign;
    for (k in options) {
        item = options[k];
        if (item || item === false || item === 0) {
            if ((new RegExp("^salign\x24", "i")).test(k)) {
                salign = item;
                continue;
            }

            str.push(' ', k, '="', Gl.string.encodeHTML(item), '"');
        }
    }

    if (salign) {
        str.push(' salign="', Gl.string.encodeHTML(salign), '"');
    }
    str.push('></embed></object>');

    return str.join('');
};
Gl.swf.getMovie = function (name) {
    //ie9下, Object标签和embed标签嵌套的方式生成flash时,
    //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
    var movie = document[name], ret;
    return Gl.browser.ie == 9 ?
        movie && movie.length ?
            (ret = Gl.array.remove(jQuery.makeArray(movie),function(item){
                return item.tagName.toLowerCase() != "embed";
            })).length == 1 ? ret[0] : ret
            : movie
        : movie || window[name];
};
Gl.swf.version = (function () {
    var n = navigator;
    if (n.plugins && n.mimeTypes.length) {
        var plugin = n.plugins["Shockwave Flash"];
        if (plugin && plugin.description) {
            return plugin.description
                    .replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s)+r/, ".") + ".0";
        }
    } else if (window.ActiveXObject && !window.opera) {
        for (var i = 12; i >= 2; i--) {
            try {
                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                if (c) {
                    var version = c.GetVariable("$version");
                    return version.replace(/WIN/g,'').replace(/,/g,'.');
                }
            } catch(e) {}
        }
    }
})();

window[Gl.guid]._instances = window[Gl.guid]._instances || {};



Gl.lang.Class = function(guid) {
    this.guid = guid || Gl.lang.guid();
    window[Gl.guid]._instances[this.guid] = this;
};
window[Gl.guid]._instances = window[Gl.guid]._instances || {};


Gl.lang.Class.prototype.dispose = function(){
    delete window[Gl.guid]._instances[this.guid];

    for(var property in this){
        if (jQuery.type(this[property]) != "function") {
            delete this[property];
        }
    }
    this.disposed = true;   // 20100716
};


Gl.lang.Class.prototype.toString = function(){
    return "[object " + (this._className || "Object" ) + "]";
};

Gl.lang.Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};

Gl.lang.Class.prototype.addEventListener = function (type, handler, key) {
    if (jQuery.type(handler) != "function") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var t = this.__listeners, id;
    if (typeof key == "string" && key) {
        if (/[^\w\-]/.test(key)) {
            throw("nonstandard key:" + key);
        } else {
            handler.hashCode = key;
            id = key;
        }
    }
    type.indexOf("on") != 0 && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = {});
    id = id || Gl.lang.guid();
    handler.hashCode = id;
    t[type][id] = handler;
};


Gl.lang.Class.prototype.removeEventListener = function (type, handler) {
    if (typeof handler != "undefined") {
        if ( (jQuery.type(handler) == "function" && ! (handler = handler.hashCode))
            || (jQuery.type(handler) != "string")
        ){
            return;
        }
    }

    !this.__listeners && (this.__listeners = {});

    type.indexOf("on") != 0 && (type = "on" + type);

    var t = this.__listeners;
    if (!t[type]) {
        return;
    }
    if (typeof handler != "undefined") {
        t[type][handler] && delete t[type][handler];
    } else {
        for(var guid in t[type]){
            delete t[type][guid];
        }
    }
};


Gl.lang.Class.prototype.dispatchEvent = function (event, options) {
    if (jQuery.type(event) == "string") {
        event = new Gl.lang.Event(event);
    }
    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, t = this.__listeners, p = event.type;
    event.target = event.target || this;
    event.currentTarget = this;

    p.indexOf("on") != 0 && (p = "on" + p);

    jQuery.type(this[p]) == "function" && this[p].apply(this, arguments);

    if (typeof t[p] == "object") {
        for (i in t[p]) {
            t[p][i].apply(this, arguments);
        }
    }
    return event.returnValue;
};

Gl.lang.createClass = function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || Gl.lang.Class;

    // 创建新类的真构造器函数
    var fn = function(){
        // 继承父类的构造器
        if(superClass != Gl.lang.Class){
            superClass.apply(this, arguments);
        }else{
            superClass.call(this);
        }
        constructor.apply(this, arguments);
    };

    fn.options = options.options || {};

    var C = function(){},
        cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) fp[i] = cp[i];

    typeof options.className == "string" && (fp._className = options.className);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function(json){
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn;  // 这个静态方法也返回类对象本身
    };

    return fn;
};
/**************************************common.js***************************************/
/**
 * @fileoverview: 通用库
 * @author: qiaogang
 * @requires tangram.js
 * @date: Wednesday, April 11, 2012
 *
 */
var mbox = mbox || {};

/**
 * 创建命名空间，  支持申请多级命名和多个命名空间如
 * @example 例mbox.namespace("lang"), mbox.lang=mbox.lang||{},
 *  mbox.namespace("m3.dispatch"), mbox.namespace("lang","m3");
 * @param {string} name
 * @return obj,最后申请的命名空间.
 */
mbox.namespace = function() {
    var a = arguments, o = null, i, j, d;
    for (i = 0, len = a.length; i < len; i++) {
        d = ('' + a[i]).split('.');
        o = mbox;
        for (j = (d[0] == 'mbox') ? 1 : 0; j < d.length; j = j + 1) {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};

jQuery.extend(mbox, {
    /**
     * @lends mbox
     */
    /**
     * 创建一个新的引信函数,
     * @example 在音乐盒中用来解决flash加载的问题。如果flash还没加载完全，将要执行的函数保存到队列中；如果flash已加载，直接执行传入的函数,
     *  flashReady=new mbox.Fuze();flashReady(fn);  flash加载完调用flashReady.fire();
     * @return {Function} fn 引信函数
     * @member mbox
     */
    Fuze : function() {
        var queue, fn, infire;
        queue = [];

        /**
         * 引信函数
         * @param {function} process
         * @private
         */
        fn = function(process) {
            if (infire) {
                process();
            } else {
                queue.push(process);
            }
        };

        fn.fire = function() {
            while (queue.length) {
                queue.shift()();
            }
            infire = true;
        };

        fn.extinguish = function() {
            infire = false;
        };

        fn.wettish = function() {
            this.fire();
            this.extinguish();
        };

        fn.clear = function () {
            while (queue.length) {
                queue.shift();
            }
            this.extinguish();
        };

        return fn;
    },

    /**
     * 转换时间，毫秒转换为mm:ss格式
     * @param {Number} time
     * @return {String} 格式mm:ss
     * @member mbox
     */
    convertTime : function(time) {
        var minute, second;
        time = Math.round(time / 1000);
        minute = Math.floor(time / 60);
        second = time % 60;
        return Gl.number.pad(minute, 2) + ':' + Gl.number.pad(second, 2);
    },

    /**
     * 计时器类
     * 可以创建新的 Timer 对象，以便按指定的时间顺序运行代码。 使用 start() 方法来启动计时器。
     * 通过addEventListener添加定时处理句柄。
     * 可以开始、暂停、终止一个计时器
     * @member mbox
     * @namespace
     * @name Timer
     */
    Timer : (function( window, undefined ) {
        /**
         * Timer构造函数,由于是由匿名执行的函数返回的构造函数，所以在生成文档时名称难改。（音乐盒文档中出现多次）
         * @example 创建一个计时器
         *          var timer=new mbox.Timer(1000,3);
         * @param {Number} delay 计时器事件间的延迟 单位:毫秒(ms) 注意：间隔在0-15ms时可能计算不准确
         * @param {Number} repeatCount 设置的计时器运行总次数。如果重复计数设置为 0，则计时器将持续不断运行，直至调用了 stop()/reset() 方法或程序停止。
         * @member mbox.Timer
         */
        var fn = function( delay, repeatCount ) {
            this._timer = function(){};
            this._listener = function(){};
            this._timerComplete = function(){};
            this._timerID = null;
            this._delay = this._remain = delay;
            this._repeatCount = repeatCount || 0 ;
            this._currentCount = 0;
            this._isRunning = false;
            this._startTime = this._endTime = 0;
            this.EVENTS = {
                TIMER : 'timer',
                COMPLETE : 'timerComplete'
            };
        };


        fn.prototype =
        /**
         * @lends mbox.Timer
         */
        {
            /**
             * 根据传参创建新的计时器
             * @param {Object} dalay 计时器事件间的延迟 单位:毫秒(ms) 注意：间隔在0-15ms时可能计算不准确
             * @param {Object} repeatCount 设置的计时器运行总次数。如果重复计数设置为 0，则计时器将持续不断运行，直至调用了 stop()/reset() 方法或程序停止。
             * @private
             */
            _createTimer : function(delay, repeatCount) {
                var me = this;
                if (repeatCount == 1) {
                    return function(){
                        return window.setTimeout(function() {
                            me.reset();
                            me._listener(me._delay, repeatCount);
                            me._timerComplete();
                        }, delay);
                    }
                } else {
                    return function() {
                        return window.setInterval(function() {
                            if (repeatCount !=0 && me._currentCount >= repeatCount) {
                                me.reset();
                                me._timerComplete();
                            } else {
                                me._currentCount++;
                                me._listener(delay, me._currentCount);
                            }
                        }, delay);
                    }
                }
            },

            /**
             * 添加事件侦听器
             * 监听类型: EVENTS.TIMER 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
             * EVENTS.COMPLETE 每当它完成 Timer.repeatCount 设置的请求数后调度。
             * @method addEventListener
             * @param {String} type 监听事件类型
             * @param {Function} listener 事件侦听器
             * @member mbox.Timer
             */
            addEventListener : function(type, listener) {
                if (type == "timer") {
                    this._listener = listener;
                    this._timer = this._createTimer(this._delay, this._repeatCount);
                } else if (type == "timerComplete") {
                    this._timerComplete = listener;
                }
            },

            /**
             * 如果计时器正在运行，则停止计时器，并将 _currentCount 属性设回为 0，这类似于秒表的重置按钮。
             * @method reset
             * @member mbox.Timer
             */
            reset : function() {
                this.stop();
                if (this._repeatCount == 1) {
                    this._timer = this._createTimer(this._delay, this._repeatCount);
                }
                this._currentCount = 0;
                this._remain = this._delay;
                this._startTime = this._endTime = 0;
            },

            /**
             * 如果计时器尚未运行，则启动计时器。
             * @method start
             * @member mobx.Timer
             */
            start : function() {
                if (!this._timerID) {
                    this._timerID = this._timer();
                    if (this._repeatCount == 1) {
                        this._startTime = new Date().getTime();
                    }
                    this._isRunning = true;
                }
            },

            /**
             * 停止计时器。 如果在调用 stop() 后调用 start()，则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
             * @method stop
             * @member mobx.Timer
             */
            stop : function() {
                if (this._timerID) {
                    if (this._repeatCount == 1) {
                        window.clearTimeout(this._timerID);
                    } else {
                        window.clearInterval(this._timerID);
                    }
                    this._timerID = null;
                    this._isRunning = false;
                }
            },

            /**
             * 暂停计时器。
             * 调用时暂停计时器计时，start()后，从上次暂停时的时间开始继续计时。
             * 例如：一个20秒的计时器，在第5秒处暂停，当再次start()后，计时器将从第6秒开始，完成剩余的时间。
             * 注意：目前只支持repeatCount = 1的情况。其他情况调用等同于stop()。
             * @method pause
             * @member mbox.Timer
             */
            pause : function() {
                if (this._repeatCount == 1) {
                    if (this._timerID) {
                        this.stop();

                        this._endTime = new Date().getTime();
                        this._remain = this._remain - (this._endTime - this._startTime);
                        if (this._remain > 0) {
                            this._timer = this._createTimer(this._remain, 1);
                        } else {
                            this.reset();
                        }
                    }
                } else {
                    this.stop();
                }
            },

            /**
             * 获得计时器从 0 开始后触发的总次数。
             * @method getCurrentCount
             * @return {Number}
             * @member mbox.Timer
             */
            getCurrentCount : function() {
                return this._currentCount;
            },

            /**
             * 判断计时器是否在运行
             * @method isRunning
             * @return {Boolean}
             * @member mbox.Timer
             */
            isRunning : function() {
                return this._isRunning;
            }
        };

        return fn;
    })(window),

    /**
     * 秒表类
     * @member mbox
     * @namespace
     * @name StopWatch
     */
    StopWatch : (function (window, undefined) {
        var count = 0;
        var fn = function () {
            this.startTime = 0;
            this.isRunning = false;
            this.isReset = true;
            this.passedTime = 0;
            count++;
        };

        fn.prototype = {

            /**
             * 重置秒表
             *
             * @param
             * @method
             */
            reset:function () {
                this.startTime = 0;
                this.pauseTime = 0;
                this.passedTime = 0;
                this.isRunning = false;
                this.isReset = true;
            },

            /**
             * 开始/恢复计时
             *
             * @param
             * @return
             * @method
             */
            start:function () {
                if (this.isReset) {
                    this.reset();
                    this.startTime = new Date().getTime();
                } else {
                    if (!this.isRunning) {
                        this.startTime = new Date().getTime();
                    }
                }
                this.isRunning = true;
                this.isReset = false;
            },

            /**
             * 秒表暂停
             *
             * @param
             * @return {Number}
             * @method
             */
            pause:function () {
                if (!this.isReset && this.isRunning) {
                    this.pauseTime = new Date().getTime();
                    this.passedTime += this.pauseTime - this.startTime;
                    this.isRunning = false;
                }
            },

            /**
             * 秒表是否运行中
             *
             * @param
             * @return {Boolean} true - 运行中，false - 停止
             * @method
             */
            isRunning:function () {
                return this.isRunning;
            },

            /**
             * 秒表是否重置
             *
             * @param
             * @return {Boolean} true - 重置，false - 未重置
             * @method
             */
            isReset:function () {
                return this.isReset;
            },

            /**
             * 获取秒表当前计时时间
             *
             * @return {Number} 当前时间 单位：毫秒(ms)
             * @method
             */
            getTime:function () {
                if (this.isReset) {
                    return 0;
                } else {
                    if (this.isRunning) {
                        return new Date().getTime() - this.startTime + this.passedTime;
                    } else {
                        return this.passedTime;
                    }
                }
            },

            /**
             * 由该类创建出实例的个数
             *
             * @param
             * @return
             * @method
             */
            getCounts:function () {
                return count;
            }
        };

        return fn;
    })(window)
});

/**
 * @namespace
 * @name mbox.lang
 */
mbox.namespace('mbox.lang');
jQuery.extend(mbox.lang, {
    /**
     * @lends mbox.lang
     */
    /**
     * 创建一个类，包括创造类的构造器、继承基类T.lang.Class
     * 基于T.lang.createClass进行了封装
     * @param {Function} constructor 构造函数
     * @param {Object} options
     * @return
     * @member mbox.lang
     */
    createClass : function(constructor, options) {
        var fn = Gl.lang.createClass(constructor, options);

        fn.extend = function(json) {
            for (var i in json) {
                fn.prototype[i] = (function(method, name) {
                    if (jQuery.type(method) == "function") {
                        return function() {
                            this.dispatchEvent(name, {
                                name : name,
                                arguments : arguments
                            });
                            var res = method.apply(this, arguments);
//                            this.dispatchEvent('afterCallMethod', {
//                                name : name,
//                                arguments : arguments,
//                                result : res
//                            });
                            return res;
                        };
                    } else {
                        return method;
                    }
                })(json[i], i);
//                fn.prototype[i] = json[i];
            }
            return fn;
        };

/*
        fn.before = function(json) {
            for (var i in json) {
                var _method = fn.prototype[i];
                if (typeof _method == 'function') {
                    var _newMethod = function(arguments) {
                        _method.apply(fn, arguments);
                    }
                }
                fn.prototype[i] = json[i];
            }
            return fn;
        };

        fn.after = function(json) {

            return fn;
        };
*/
        return fn;
    }
});
/*************************************PlayEngine_Interface.js*********************************/
/**
 * @fileoverview 播放器超类
 * @authod qiaogang@baidu.com
 * @class PlayEngine_Interface
 * @requires tangram-1.5.0.js
 * @requires common.js
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

/**
 * @class PlayEngine_Interface播放核心的接口类, fmp
 *
 */
var PlayEngine_Interface = mbox.lang.createClass((function(window, undefined) {
    var guid = 0;

    var defConf = {
        mute    : false,
        volume  : 50
    };

    var fn = function(conf) {
        /**
         * 标准状态
         *
         */
        this.STATES = {
            INIT       : 'init',        //-2 还未初始化(dom未加载)
            READY      : 'ready',       //-1 初始化成功(dom已加载,且可以播放)
            STOP       : 'stop',        //0
            PLAY       : 'play',        //1
            PAUSE      : 'pause',       //2
            END        : 'end',         //3
            BUFFERING  : 'buffering',   //4
            PREBUFFER  : 'pre-buffer',  //5
            ERROR      : 'error'        //6
        };

        /**
         * 标准事件
         *
         */
        this.EVENTS = {
            STATECHANGE     : 'player_playStateChange',
            POSITIONCHANGE  : 'player_positionChange',
            PROGRESS        : 'player_progress',
            ERROR           : 'player_error',
            INIT            : 'player_initSuccess',    //dom加载成功，已进入ready状态
            INITFAIL        : 'player_initFail'        //dom加载失败，版本不支持或加载异常
        };

        conf = conf || {};
        this.mute = typeof conf.mute == 'undefined' ? defConf.mute : !!conf.mute;
        this.volume = typeof conf.volume == 'undefined' ? defConf.volume : conf.volume;
        this.ready = false;
        this.url = '';
        this.state = this.STATES.INIT;
        this.engineType = '';
        this.stateStack = [this.STATES.INIT];
        this.supportMimeType = [];
    };

    fn.prototype = {
        /**
         * 创建新的guid
         *
         * @return {String}
         */
        newId : function() {
            return "_m3_" + guid++;
        },

        /**
         * 初始化播放器
         * 进行加载dom
         */
        init : function() {

        },

        /**
         * 重置播放器
         * 除音量和静音状态外的其他状态，都要进行重置
         */
        reset : function() {

        },

        /**
         * 开始加载资源
         *
         * @param {String}
         */
        setUrl : function(url) {

        },

        /**
         * 获取当前的资源地址
         *
         * @return {String}
         */
        getUrl : function() {
            return this.url;
        },

        /**
         * 开始播放/继续播放
         *
         */
        play : function() {

        },

        /**
         * 暂停播放
         * 播放位置不清零，资源继续下载
         */
        pause : function() {

        },

        /**
         * 停止当前播放的资源
         * 播放位置清零 ，中断下载
         */
        stop : function() {

        },

        /**
         * 设置静音状态
         *
         * @param {Boolean}
         */
        setMute : function(mute) {

        },

        /**
         * 获取静音状态
         *
         * @return {Boolean}
         */
        getMute : function() {
            return this.mute;
        },

        /**
         * 设置音量
         *
         * @param {Number} 取值范围 0-100
         */
        setVolume : function(vol) {

        },

        /**
         * 获取音量
         *
         * @return {Number} 取值范围 0-100
         */
        getVolume : function() {
            return this.volume;
        },

        /**
         * 获取当前播放状态
         *
         * @return {String} 播放状态
         */
        getState : function() {
            return '';
        },

        /**
         * 设置当前播放进度
         *
         * @param {Number} pos 当前播放进度。单位:毫秒
         */
        setCurrentPosition : function(pos) {

        },

        getCurrentPosition : function() {
            return 0;
        },

        /**
         * 获取当前加载进度百分比
         *
         * @return {Number} 取值范围 0-1
         */
        getLoadedPercent : function() {
            return 0;
        },

        /**
         * 获取已加载的字节数
         *
         * @return {Number} 已加载的字节数。单位: bytes
         */
        getLoadedBytes : function() {
            return 0;
        },

        /**
         * 获取资源总字节数
         *
         * @return {Number} 总字节数。单位: bytes
         */
        getTotalBytes : function() {
            return 0;
        },

        /**
         * 获取歌曲总时长
         *
         * @return {Number} 单位: 毫秒
         */
        getTotalTime : function() {
            return 0;
        },

        /**
         * 获取当前播放内核版本号
         *
         * @return {String}
         */
        getVersion : function() {
            return '';
        },

        /**
         * 获取当前内核的类型
         *
         * @return {String} 当前内核类型
         */
        getEngineType : function() {
            return this.engineType;
        },

        /**
         * 判断制定的mimeType是否可以播放
         *
         * @param {String} mimeType
         * @return {Boolean}
         */
        canPlayType : function(mimeType) {
            var list = this.getSupportMimeTypeList();
            return jQuery(list).is(function(index) {
                return mimeType == list[index];
            });
        },

        /**
         * 获取当前内核支持的格式
         *
         * @return {Array(String)} 支持的格式
         */
        getSupportMimeTypeList : function() {
            return this.supportMimeType;
        },

        /**
         * 添加事件
         *
         * @param {String} eventName 事件名称，目前支持的事件有:
         *      'playStateChange'   播放状态改变时
         *      'positionChange'    播放位置改变时
         *      'progress'          数据加载时
         *      'complete'          数据加载完成
         *      'error'             播放错误时
         *      'initSuccess'       内核加载成功时
         *      'initFail'          内核加载失败时(浏览器不支持等)
         * @param {Function} listener 返回自定义的Event，其中target为触发的子内核实力
         */
        setEventListener : function(eventName, listener) {
            var _listener = jQuery.proxy(function() {
                return listener.apply(this, arguments);
            }, this);

            this.addEventListener(eventName, _listener);
        }
    };

    return fn;
})(window), {superClass : Gl.lang.Class, className : 'PlayEngine_Interface'});
/*****************************************PlayEngine.js***********************************/
/**
 * @fileoverview 播放器控制类 外部调用的入口
 * @authod qiaogang@baidu.com
 * @requires PlayEngine_Interface.js
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */
/**
 * @requires ../common/commone.js, ../common/tangram-custom-full-yui.js
 * 播放核心PlayEngine,封装了playcore2子内核的实现，提供给外部统一的创建实例和使用playcore2的入口。
 * @class PlayEngine 继承了tangram.lang.Class,带有setEventListener,dispatchEvent等事件监听和派发的函数.
 * @extends T.lang.Class
 * @param {Object}  conf初始化参数，设置要加载的子内核
 * @conf {Array} subEngines 子内核的配置项，
 * @example var player = new PlayEngine({
    subEngines : [{ constructorName : 'PlayEngine_Audio' }] });
 */
var PlayEngine = mbox.lang.createClass(function(conf) {
    conf = conf || {};
    //子内核的配置项

    this.subEnginesConf = [];
    this.subEnginesInitArgs = {};
    this.curEngine = null;
    this.curEngineType = '';
    //只未初始化的内核(已new)
    this.unInitEngineList = [];
    //初始化(init)成功&浏览器支持(test)的内核实例
    this.engineList = [];
    this.engineTypeList = [];
    this.ready = false;
    this.defaultExt = '.mp3';

    this.coreContainer = null;
    /**
     * 常量PlayEngine中定义的事件<br/>
     * this.EVENTS = {
     &nbsp;&nbsp;STATECHANGE     : 'playStateChange',    //播放状态改变事件(STATES)<br/>
     &nbsp;&nbsp;POSITIONCHANGE  : 'positionChange',     //播放时播放进度改变事件<br/>
     &nbsp;&nbsp;PROGRESS        : 'progress',           //加载时加载进度改变事件<br/>
     &nbsp;&nbsp;ERROR           : 'error',              //播放过程中出错时的事件<br/>
     &nbsp;&nbsp;INIT            : 'initSuccess',        //播放器初始化成功时的事件<br/>
     &nbsp;&nbsp;INITFAIL        : 'initFail'            //播放器初始化失败时的事件<br/>
        };
     * @final EVENTS,
     * @type {Object}
     * @member PlayEngine
     */
    this.EVENTS = {
        STATECHANGE     : 'player_playStateChange',    //播放状态改变事件(STATES)
        POSITIONCHANGE  : 'player_positionChange',     //播放时播放进度改变事件
        PROGRESS        : 'player_progress',           //加载时加载进度改变事件
        ERROR           : 'player_error',              //播放过程中出错时的事件
        INIT            : 'player_initSuccess',        //播放器初始化成功时的事件
        INITFAIL        : 'player_initFail'            //播放器初始化失败时的事件
    };

    /**
     * 常量PlayEngine中定义的播放器状态.       <br/>
     * this.STATES={                         <br/>
     &nbsp;INIT       : 'init',        //-2 还未初始化<br/>
     &nbsp;READY      : 'ready',       //-1 初始化成功(dom已加载)<br/>
     &nbsp;STOP       : 'stop',        //0<br/>
     &nbsp;PLAY       : 'play',        //1<br/>
     &nbsp;PAUSE      : 'pause',       //2<br/>
     &nbsp;END        : 'end',         //3<br/>
     &nbsp;BUFFERING  : 'buffering',   //4<br/>
     &nbsp;PREBUFFER  : 'pre-buffer'   //5<br/>
        };
     * @final EVENTS,
     * @member PlayEngine
     */
    this.STATES = {
        INIT       : 'init',        //-2 还未初始化
        READY      : 'ready',       //-1 初始化成功(dom已加载)
        STOP       : 'stop',        //0
        PLAY       : 'play',        //1
        PAUSE      : 'pause',       //2
        END        : 'end',         //3
        BUFFERING  : 'buffering',   //4
        PREBUFFER  : 'pre-buffer',  //5
        ERROR      : 'error'        //6
    };

    //progress timer 模拟加载进度事件
    this.progressTimer = new mbox.Timer(200, 0);
    //position timer 模拟播放进度事件
    this.positionTimer = new mbox.Timer(100, 0);
    this._initEngines(conf);
}, {
    className : 'PlayEngine'
}).extend({
    /**
     * @private _error
     */
    _error : function(errMsg) {
        throw new Error(errMsg);
    },

    /**
     * @method  初始化给定的子内核构造函数名称
     * @private
     * @member PlayEngine
     * @param {String} engines,子内核的构造函数名称，如:"PlayEngine_FMP";
     */
    _initEngines : function(config) {
        this.coreContainer = config.el || null;

        this.subEnginesConf = config.subEngines || [];

        jQuery.each(this.subEnginesConf, jQuery.proxy(function(index, item) {
            var subEngineName = item.constructorName,
                args = item.args || {},
                subEngineConstructor;

            this.subEnginesInitArgs[subEngineName] = args;

            try {
                subEngineConstructor = eval(subEngineName);
                if (jQuery.type(subEngineConstructor) != "function") {
                    return;
                }
            } catch(e) {
                return;
            }
            var engine = new subEngineConstructor(args);
            this.unInitEngineList.push(engine);
        }, this));

        // 给一个默认的 curEngine 值，防止调用 play、reset 等方法时报错
        this.curEngine = this.unInitEngineList[0];
    },

    /**
     * 初始化播放内核
     * //注意：监听初始化事件，需要在init之前注册
    //初始化成功事件
    player.setEventListener('initSuccess', function(e) {
        T.g('initok').value += '|' + e.engineType;
    });
    //初始化失败事件
    player.setEventListener('initFail', function(e) {
        T.g('initfail').value += '|' + e.engineType;
    });
     * @param {Object} options
     * @options {HTMLElement|String} [el] 容器所在dom节点或id
     * @options {Array(Object)} subEngines 子内核配置项
     * @confs {String} [constructorName] 子内核的构造函数名
     * @confs {Object} [args] 子内核的init参数
     * @args {String} [swfPath] flash内核所在路径
     * @example player.init({
     *  el : T.g('container'),
     *   subEngines : {
            'PlayEngine_Audio' : {}
           'PlayEngine_FMP_MP3' : {            //子内核构造函数名
               swfPath : 'flash/fmp_mp3.swf',
                instanceName : 'player'         //当前实例名
           },
           'PlayEngine_FMP_AAC' : {            //子内核构造函数名
                swfPath : 'flash/fmp_aac.swf',
               instanceName : 'player'         //当前实例名
           }
        }
    });

     * @method
     * @member PlayEngine
     */
    init : function(options) {
        if (this.ready) {
            return this._error('');
        }

        options = options || {};

        this.subEnginesInitArgs = options.subEngines ?
            options.subEngines : this.subEnginesInitArgs;

        this.coreContainer = options.el ?
            options.el : this.coreContainer;

        if (!this.coreContainer) {
            var con = jQuery('<div>', {
                id : '_player_container_' + Gl.lang.guid()
            });
            con.css({
                'width'     : '1px',
                'height'    : '1px',
                'overflow'  : 'hidden'/*,
                'position'  : 'absolute',
                'top'       : '-10px',
                'zIndex'    : '1'*/
            });
            jQuery(document.body).append(con);
            this.coreContainer = options.el = con;
        }

        //init core
        jQuery.each(this.unInitEngineList, jQuery.proxy(function(index, engine) {
            var subEngineNameToString = engine.toString(),
                subEngineName = '',
                reg = /^\[object (.*)\]$/i;
            if (reg.test(subEngineNameToString)) {
                subEngineName = RegExp.$1;
            }
            var args = this.subEnginesInitArgs[subEngineName] || {};
            if (engine.test(true)) {
                args.instanceName = args.instanceName + '.engineList[' + this.engineList.length + ']';
                args.el = args.el || this.coreContainer;
                this.engineList.push(engine);
                engine.init.apply(engine, [args]);
            }
        }, this));

        //switch core
        this.switchEngineByUrl(this.defaultExt);
        this.ready = true;
        this._initProgressEvent();
        this._initPositionChangeEvent();
    },

    /**
     * 判断指定的mimeType或格式是否支持
     *
     * @param {String} mimeType mimeType或文件扩展名
     * @return {Boolean}
     * @member PlayEngine
     * @method canPlayType
     */
    canPlayType : function(mimeType) {
        return jQuery(this.engineList).is(function(index) {
            return this.engineList[index].canPlayType(mimeType);
        });
    },

    /**
     * 获取支持的格式类型
     *
     * @member PlayEngine
     * @return {Array(String)} 支持的类型
     * @method
     */
    getSupportMimeTypeList : function() {
        var list = [];
        jQuery.each(this.engineList, jQuery.proxy(function(index, item) {
            list = list.concat(item.getSupportMimeTypeList());
        }, this));
        return list;
    },

    /**
     * 根据播放资源的URL选择播放子内核
     * @member PlayEngine
     * @param {String} url
     * @return
     * @method
     */
    switchEngineByUrl : function(url/*, stopRecursion*/) {
        var has = jQuery(this.engineList).is(jQuery.proxy(function(index) {
            var str = this.engineList[index].getSupportMimeTypeList().join('|');
            var reg = new RegExp('\\.(' + str + ')(\\?|$)', 'ig');
            if (reg.test(url)) {
                this.curEngine = this.engineList[index];
                this.curEngineType = this.engineList[index].getEngineType();
                return true;
            }
        }, this));
        //如果没有匹配到，使用默认扩展名适配。并且切断递归调用，防止死循环
        var stopRecursion = arguments[1];
        if (!has && !stopRecursion) {
            arguments.callee.apply(this, [this.defaultExt, true]);
        }
    },

    /**
     * 根据指定的扩展名或MimeType选择播放子内核
     * @member PlayEngine
     * @param {String} mimeType
     * @return
     * @method
     */
    switchEngineByMimeType : function(mimeType) {
        jQuery(this.engineList).is(jQuery.proxy(function(index) {
            if (this.engineList[index].canPlayType(mimeType)) {
                this.curEngine = this.engineList[index];
                this.curEngineType = this.engineList[index].getEngineType();
                return true;
            }
        }, this));
    },

    /**
     * 重置播放器
     * @member PlayEngine
     * @example player.reset();
     * @return
     * @method reset
     */
    reset : function() {
        this.curEngine.reset.apply(this.curEngine, arguments);
    },

    /**
     *
     * 设置播放核调度器的音频地址
     * @member PlayEngine
     * @param {String} url 音频地址
     * @return
     * @method setUrl
     */
    setUrl : function(url) {
        var oldEngie = this.curEngine;
        this.switchEngineByUrl(url);
        if (oldEngie && oldEngie != this.curEngine) {
            oldEngie.stop();
        }
        if (this.curEngine) {
            this.curEngine.setUrl.apply(this.curEngine, arguments);
        }
    },
     /**
      * 获取当前资源的url
      * @member PlayEngine
      * @return {String} url
      */
    getUrl : function() {
        return this.curEngine.getUrl.apply(this.curEngine, arguments);
    },

    /**
     *
     * 操作播放核调度器播放
     * @param {Number} [pos] Default: 'undefined'。制定播放的位置 单位：毫秒。如果没有参数，则从当前位置开始播放。
     * @method play
     * @member PlayEngine
     */
    play : function(pos) {
        if (typeof pos == 'undefined') {
            if (this.curEngine) {
                return this.curEngine.play.apply(this.curEngine, arguments);
            }
        } else {
            return this.setCurrentPosition(pos);
        }
    },

    /**
     * 操作播放核调度器暂停
     * @member PlayEngine
     * @method pause
     */
    pause : function() {
        if (this.curEngine) {
            return this.curEngine.pause.apply(this.curEngine, arguments);
        }
    },

    /**
     * 操作播放核调度器停止
     * @member PlayEngine
     * @method stop
     */
    stop : function() {
        if (this.curEngine) {
            return this.curEngine.stop.apply(this.curEngine, arguments);
        }
    },

    /**
     * 设置播放核调度器静音状态
     * @method setMute
     * @member PlayEngine
     * @param {Boolean} mute 播放核是否静音
     */
    setMute : function(mute) {
        var args = arguments;
        jQuery.each(this.engineList, function(index, item) {
            item.setMute.apply(item, args);
        });
    },

    /**
     * 取得播放核调度器静音状态
     * @member PlayEngine
     * @method getMute
     * @return {Boolean} 播放核是否静音
     */
    getMute : function() {
        if (this.curEngine) {
            return this.curEngine.getMute.apply(this.curEngine, arguments);
        }
        return false;
    },

    /**
     * 设置播放核调度器音量大小
     * @member PlayEngine
     * @method setVolume
     * @param {Number} volume 音量大小，取值范围 0-100，0 最小声
     */
    setVolume : function(volume) {
        var args = arguments;
        jQuery.each(this.engineList, function(index, item) {
            item.setVolume.apply(item, args);
        });
    },

    /**
     * 取得播放核调度器音量大小
     * @method getVolume
     * @member PlayEngine
     * @return {Number} 播放核音量大小，范围 0-100，0 最小声
     */
    getVolume : function() {
        if (this.curEngine) {
            return this.curEngine.getVolume.apply(this.curEngine, arguments);
        }
        return 0;
    },

    /**
     * 设置播放核调度器当前播放进度并播放
     * @member PlayEngine
     * @method setCurrentPosition
     * @param {Number} time 目标播放时间，单位：毫秒
     */
    setCurrentPosition : function(time) {
        if (this.curEngine) {
            return this.curEngine.setCurrentPosition.apply(this.curEngine,
                arguments);
        }
    },

    /**
     * 取得播放核调度器当前播放进度
     *  @member PlayEngine
     * @method getCurrentPosition
     * @return {Number} 当前播放时间，单位：毫秒
     */
    getCurrentPosition : function() {
        if (this.curEngine) {
            return this.curEngine.getCurrentPosition.apply(this.curEngine,
                arguments);
        }
        return 0;
    },

    /**
     * 取得播放核调度器当前播放进度的字符串表现形式
     *  @member PlayEngine
     * @method getCurrentPositionString
     * @return {String} 当前播放时间，如 00:23
     */
    getCurrentPositionString : function() {
        return mbox.convertTime(this.getCurrentPosition());
    },

    /**
     * 取得播放核调度器当前下载百分比
     *  @member PlayEngine
     * @method getLoadedPercent
     * @return {Number} 下载百分比，取值范围 0-1
     */
    getLoadedPercent : function() {
        if (this.curEngine) {
            return this.curEngine.getLoadedPercent.apply(this.curEngine,
                arguments);
        }
        return 0;
    },

    /**
     * 取得当前文件下载了多少byte，单位byte
     * @member PlayEngine
     * @method getLoadedBytes
     * @reuturn {Number} 下载了多少byte
     */
    getLoadedBytes : function() {
        if (this.curEngine) {
            return this.curEngine.getLoadedBytes.apply(this.curEngine,
                arguments);
        }
    },
    /**
     * 取得当前链接文件的总大小
     * @member PlayEngine
     * @method getTotalBytes
     * @return {Number} 当前资源的总大小，单位byte
     */
    getTotalBytes : function() {
        if (this.curEngine) {
            return this.curEngine.getTotalBytes.apply(this.curEngine,
                arguments);
        }
        return 0;
    },

    /**
     * 取得播放核调度器当前 URL 总播放时长
     * @member PlayEngine
     * @method getTotalTime
     * @return {Number} 总时长，单位：毫秒
     */
    getTotalTime : function() {
        if (this.curEngine) {
            return this.curEngine.getTotalTime.apply(this.curEngine,
                arguments);
        }
        return 0;
    },

    /**
     * 取得播放核调度器当前 URL 总播放时长的字符串表现形式
     * @member PlayEngine
     * @method getTotalTimeString
     * @return {String} 总时长，如 00:23
     */
    getTotalTimeString : function() {
        return mbox.convertTime(this.getTotalTime());
    },

    /**
     * 获取当前子内核的实例
     * @member PlayEngine
     * @return {Object} curEngine 当前子内核实例对象
     */
    getCurEngine : function() {
        return this.curEngine;
    },

    /**
     * 获取当前播放内核的种类
     * @member PlayEngine
     * @return {String} 播放内核种类
     * @method getEngineType
     */
    getEngineType : function() {
        return this.getCurEngine().getEngineType();
    },

    /**
     * 获取播放器版本号
     * @member PlayEngine
     * @return {Object} 当前已初始化成功的子内核类型和对应的版本号 {engineType:engineVersion,...}
     */
    getVersion : function() {
        var res = {};
        jQuery.each(this.engineList, function(index, item) {
            res[item.getEngineType()] = item.getVersion();
        });
        return res;
    },

    /**
     * 取得当前播放核调度器播放状态
     * @member PlayEngine
     * @method getState
     * @return {?String} 当前播放状态
     */
    getState : function() {
        if (this.curEngine) {
            return this.curEngine.getState.apply(this.curEngine,
                arguments);
        }
        return null;
    },

    /**
     * 添加事件
     *
     * @param {String} eventName 事件名称，目前支持的事件有:
     *      1. 'playStateChange'   播放状态改变时
     *      funtion(event){
     *          event.newState      //当前播放状态
     *          event.oldState      //上一个播放状态
     *          event.engineType    //当前播放内核类型
     *          event.target        //当前子播放内核的实例
     *      }
     *
     *      2. 'positionChange'    播放位置改变时
     *      function(event) {
     *          event.position      //当前播放进度 单位：毫秒
     *          event.target        //当前子播放内核的实例
     *      }
     *
     *      3. 'progress'          数据加载时
     *      function(event) {
     *          event.progress      //当前加载进度百分比 范围：0-1
     *          event.totalTime     //当前音频总时长 单位：毫秒
     *          event.target        //当前子播放内核的实例
     *      }
     *
     *      4. 'error'             播放错误时 // todo
     *
     *      5. 'initSuccess'       内核加载成功时
     *      function(event) {
     *          event.engineType    //当前播放内核类型
     *          event.engine        //当前播放内核的DOM
     *          event.target        //当前子播放内核的实例
     *      }
     *
     *      6. 'initFail'          内核加载失败时(浏览器不支持等)
     *      function(event) {
     *          event.engineType    //加载失败的子内核类型
     *          event.config        //init初始化时传入subEngines配置项
     *      }
     * @param {Function} handler
     * @member PlayEngine
     * @return
     * @method
     */
    setEventListener : function(eventName, listener) {
        var _listener;
        if (eventName == this.EVENTS.INITFAIL ||
            eventName == this.EVENTS.INIT) {
            _listener = jQuery.proxy(function(e) {
                listener.apply(this, arguments);
            }, this);
        } else {
            _listener = jQuery.proxy(function(e) {
                if (e.target && e.target.getEngineType() == this.curEngineType) {
                    listener.apply(this, arguments);
                }
            }, this);
        }

        jQuery.each(this.unInitEngineList, function(index, item) {
            item.setEventListener(eventName, _listener);
        });
    },

    /**
     * 初始化加载进度改变的事件
     * @member PlayEngine
     * @param
     * @return
     * @method _initProgressEvent
     * @private
     */
    _initProgressEvent : function() {
        this.progressTimer.addEventListener('timer',
            jQuery.proxy(function(delay, repeatCount) {
                var percent = this.getLoadedPercent();
                this.curEngine.dispatchEvent(this.EVENTS.PROGRESS, {
                    progress    : percent,
                    totalBytes  : this.getTotalBytes(),
                    loadedBytes : this.getLoadedBytes(),
                    totalTime   : this.getTotalTime()
                });
                if (percent == 1&&this.curEngineType!='wmp') {
                    this.progressTimer.stop();
                }
            }, this)
        );

        this.setEventListener(this.EVENTS.STATECHANGE,
            jQuery.proxy(function(e) {
                var st = e.newState;
                switch (st) {
                    //st == 'pre-buffer'
                    case this.STATES.PREBUFFER :
                    //st == 'play'
                    case this.STATES.PLAY :
                        if (this.getLoadedPercent() < 1) {
                            this.progressTimer.start();
                        }
                        break;
                    //stop
                    case this.STATES.STOP :
                    //ready
                    case this.STATES.READY :
                    //end
                    case this.STATES.END :
                        this.progressTimer.reset();
                        break;
                }
            }, this)
        );

        this.setEventListener('setUrl', jQuery.proxy(function(e) {
            this.progressTimer.reset();
            this.progressTimer.start();
        }, this));
    },

    /**
     * 初始化播放进度改变的事件
     * @member PlayEngine
     * @param
     * @return
     * @method _initPositionChangeEvent
     * @private
     */
    _initPositionChangeEvent : function() {
        this.positionTimer.addEventListener('timer',
            jQuery.proxy(function(delay, repeatCount) {
                var curPos = this.getCurrentPosition();
                this.curEngine.dispatchEvent(this.EVENTS.POSITIONCHANGE, {
                    position : curPos
                });
            }, this)
        );

        this.setEventListener(this.EVENTS.STATECHANGE,
            jQuery.proxy(function(e) {
                var st = e.newState;
                switch (st) {
                    //st == 'play'
                    case this.STATES.PLAY :
                        this.positionTimer.start();
                        break;
                    //st == 'stop'
                    case this.STATES.STOP :
                    //st == 'pause'
                    case this.STATES.PAUSE :
                        this.positionTimer.pause();
                        // 刷新一下position
                        this.curEngine.dispatchEvent(this.EVENTS.POSITIONCHANGE, {
                            position:this.getCurrentPosition()
                        });
                        break;
                    //ready
                    case this.STATES.READY :
                    //end
                    case this.STATES.END :
                        this.positionTimer.reset();
                        break;
                }
            }, this)
        );
        this.setEventListener('setUrl', jQuery.proxy(function(e) {
            this.positionTimer.reset();
        }, this));
    }
});
/***************************************PlayEngine_FMP_MP3.js**************************************/
/**
 * @fileoverview 播放内核 Adobe Flash Player 内核的封装(fmp_mp3.swf只支持MP3的内核)
 * @authod qiaogang@baidu.com
 * @class PlayEngine_FMP_MP3
 * @requires PlayEngine_Interface.js
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */
var PlayEngine_FMP_MP3 = mbox.lang.createClass(function(conf) {
    conf = conf || {};

    /**
     * 子内核支持的格式(文件扩展名)
     */
    this.supportMimeType = ['mp3'];

    this.engineType = 'fmp_mp3';

    /**
     * 播放器 swf 地址
     */
    this.swfPath = 'fmp_mp3.swf';

    /**
     * flash 版本的最低要求
     */
    this.flashVersionRequire = conf.flashVersionRequire || '9.0.0';

    /**
     * flash 版本小于最低要求时的提示文本
     */
    this.versionErrorMessage = conf.versionErrorMessage || '';

    /**
     * 状态码hash表,用来和标准STATE状态做一个映射
     */
    this.stateCode = {
        '-2' : this.STATES.INIT,
        '-1' : this.STATES.READY,
        '0'  : this.STATES.STOP,
        '1'  : this.STATES.PLAY,
        '2'  : this.STATES.PAUSE,
        '3'  : this.STATES.END,
        '4'  : this.STATES.BUFFERING,
        '5'  : this.STATES.PREBUFFER,
        '6'  : this.STATES.ERROR
    };

    this.flashLoaded = false;
    this.flashReady = new mbox.Fuze();
}, {
    superClass : PlayEngine_Interface,
    className : 'PlayEngine_FMP_MP3'
}).extend({
    /**
     * 判断当前环境中是否可用，子内核加载时，依据这里的结果
     *
     * @param {Boolean} 是否派发INITFAIL事件，默认不派发
     * @return {Boolean}
     */
    test : function(dispatch) {
        return this._checkPlayer(dispatch);
    },

    /**
     * 播放核的初始化
     *
     * @param {Object} options
     * @config {HTMLElement|String} [el] 播放内核容器或容器id
     * @config {String} instanceName 创建的实例名字 用于flash回调
     * @config {String} swfPath flash文件路径
     */
    init : function(options) {
        options = options || {};
        var el = options.el;
        this.instanceName = options.instanceName;
        this.swfPath = options.swfPath || this.swfPath;

        var inner, id = this.newId();        
        if (jQuery.type(el) == "string") {
            el = jQuery('#'+el);
        }

        if (!el) {
            el = jQuery('<div>');
            jQuery(document.body).append(el);
        }
        inner = jQuery('<div>');
        el.append(inner);

//        if (T.browser.maxthon || T.browser.ie) {
            this.swfPath += '?' + id + '_' + Math.random();
//        }

        Gl.swf.create({
            id : this.flashObjectId = id,
            width : '1px',
            height : '1px',
            ver : this.flashVersionRequire,
            errorMessage : this.versionErrorMessage,
            allowscriptaccess : 'always',
            url : this.swfPath,
            bgcolor : '#ffffff',
            wmode : 'window',
            scale : 'noscale',
            vars : {
                _instanceName : this.instanceName + '',
                _buffertime : 2000
            }
        }, inner);

        this.flashObject = Gl.swf.getMovie(this.flashObjectId);        
    },

    /**
     * 播放核状态重置
     * 注意：会抛出stop事件，会重置除音量和静音状态的其他状态值。
     * @method reset
     */
    reset : function() {
        this.stop();
        if (this.state != this.STATES.INIT) {
            this.url = '';
            this.state = this.STATES.READY;
            this.stateStack = [this.STATES.READY];
        }
    },

    /**
     * 设置播放核的音频地址,开始加载url
     * @method setUrl
     * @param {String} url 音频地址
     */
    setUrl : function(url) {
        this.flashReady(jQuery.proxy(function() {
            this.url = url;
            this.flashObject.f_load(url);
        }, this));
    },

    /**
     * 操作音频播放
     * @method play
     */
    play : function() {
        this.flashReady(jQuery.proxy(function() {
            if ( this.state == this.STATES.PLAY ) return;
            this.flashObject.f_play();
        }, this));
    },

    /**
     * 操作音频暂停
     * @method pause
     */
    pause : function() {
        this.flashReady(jQuery.proxy(function() {
            if ( this.state == this.STATES.PAUSE ||
                 this.state == this.STATES.STOP ||
                 this.state == this.STATES.END ) return;
            this.flashObject.f_pause();
        }, this));
    },

    /**
     * 操作音频停止
     * @method stop
     */
    stop : function() {
        this.flashReady(jQuery.proxy(function() {
            if ( this.state == this.STATES.STOP ) return;
            this.flashObject.f_stop();
        }, this));
    },

    /**
     * 设置播放核静音状态
     * @method setMute
     * @param {Boolean} mute 播放核是否静音
     */
    setMute : function(mute) {
        this.flashReady(jQuery.proxy(function() {
            this.mute = mute;
            this.flashObject.setData('mute', mute);
        }, this));
    },

    /**
     * 设置播放核音量大小
     * @method setVolume
     * @param {Number} volume 音量大小，取值范围 0-100，0 最小声
     */
    setVolume : function(volume) {
        this.flashReady(jQuery.proxy(function() {
            this.volume = volume;
            this.flashObject.setData('volume', volume);
        }, this));
    },

    /**
     * 设置播放核当前播放进度
     * @method setCurrentPosition
     * @param {Number} time 目标播放时间，单位：毫秒
     */
    setCurrentPosition : function(time) {
        this.flashReady(jQuery.proxy(function() {
            this.flashObject.f_play(time);
        }, this));
    },

    /**
     * 取得播放核当前播放进度
     * @method getCurrentPosition
     * @return {Number} 当前播放时间，单位：毫秒
     */
    getCurrentPosition : function() {
        return this.flashLoaded ?
            this.flashObject.getData('currentPosition') : 0;
    },

    /**
     * 取得播放核当前下载百分比
     * @method getLoadedPercent
     * @return {Number} 下载百分比，取值范围 0-1
     */
    getLoadedPercent : function() {
        return this.flashLoaded ?
            this.flashObject.getData('loadedPct') : 0;
    },

    /**
     * 取得播放核当前 URL 总播放时间
     * @method getTotalTime
     * @return {Number} 总时长，单位：毫秒
     */
    getTotalTime : function() {
        return this.flashLoaded ?
            this.flashObject.getData('length') : 0;
    },

    /**
     * 取得当前播放器原生状态
     * @method getState
     * @param {Number}
     * @return {String} 当前播放状态
     */
    getState : function(state) {        
        return jQuery.type(state) == "number" ?
            this.stateCode[state] : this.state;//this.flashObject.getData('playStatus');
    },

    getVersion : function() {
        return Gl.swf.version;
    },

    /**
     * 这个函数有特殊用途，不允许污染函数体的代码
     * @private
     */
    _firePlayStateChange : function(stateName) {
        if (this.state != stateName) {
            this.state = stateName;
            this.stateStack.push(stateName);
            var previouState = this.stateStack.shift();
            this.dispatchEvent(this.EVENTS.STATECHANGE, {
                newState : stateName,
                oldState : previouState,
                engineType : this.engineType
            });
        }
    },

    /**
     * fmp_mp3.swf 加载完成时的回调函数
     * @private
     */
    _onLoad : function() {
        this.state = this.STATES.READY;
        this.stateStack = [this.state];
        this.dispatchEvent(this.EVENTS.INIT, {
            engineType : this.engineType,
            engine : this.flashObject
        });
        //如果fire()后立刻调用this.flashObject中的方法会报错，因此使用队列方式。可以避免调用this.flashObject报错
        setTimeout(jQuery.proxy(function() {
            this.flashReady.fire();
            this.flashLoaded = true;
        }, this), 0);
    },

    /**
     * fmp_mp3.swf 状态改变时的回调函数
     * @param {String} state 状态码
     * @private
     */
    _onPlayStateChange : function(state) {
        this._firePlayStateChange(this.getState(state));
    },

    /**
     * 检查播放器是否存在或被禁用
     * @param {Boolean} 是否派发INITFAIL事件，默认不派发
     * @private
     */
    _checkPlayer : function(dispatch) {
        dispatch = !!dispatch;
        var curVer = Gl.swf.version,
            reqVer = this.flashVersionRequire;
        if (curVer) {
            var curVerArr = curVer.split('.'),
                reqVerArr = reqVer.split('.');
            if ( curVerArr[0] - reqVerArr[0] >= 0
                && curVerArr[1] - reqVerArr[1] >= 0 ) {
                return true;
            } else {
                if (dispatch) {
                    this.dispatchEvent(this.EVENTS.INITFAIL, {
                        engineType : this.engineType
                    });
                }
                return false;
            }
        } else {
            if (dispatch) {
                this.dispatchEvent(this.EVENTS.INITFAIL, {
                    engineType : this.engineType
                });
            }
            return false;
        }
    }
});
/**
 * @fileoverview: 内核 策略模型
 * @author: qiaogang
 * @date: Sunday, March 25, 2012
 *
 */
var PlayEngineRuleModel = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} delayTime 毫秒 定时器生效时间(比如:超时N秒，缓冲N秒的时间)
     * @options {Object} listener
     * @options {String} [name] 策略标识
     */
    function (conf) {
        conf = conf || {};
        this.name = conf.name || '';
        this.delayTime = conf.delayTime;
        this.timer = null;
        this.playEngine = conf.playEngine || null;
        this.listener = conf.listener || {};
        this.handler = conf.handler || function(){};
        this.EVENTS = {
            TIMER : 'timer'
        };
        this.init();
    }, {
        className : 'PlayEngineRuleModel'
    }).extend({
        init : function () {
            if (!this.timer && this.delayTime != null) {
                this.timer = new mbox.Timer(this.delayTime, 1);
                this.addHandler(this.handler);
                this.timer.addEventListener(this.timer.EVENTS.TIMER,
                    jQuery.proxy( function(delay, repeatCount) {
                        this.dispatchEvent(this.EVENTS.TIMER, {
                            timer       : this.timer,
                            playEngine  : this.playEngine
                        });
                    }, this)
                );
            }
        },

        setPlayEngine : function(player) {
            this.playEngine = player;
        },

        /**
         * 获得规则名
         */
        getName : function () {
            return this.name;
        },

        /**
         * 获得状态监听器
         * @return {Function} listener
         */
        getListener : function () {
            return this.listener;
        },
        
        getTimer : function() {
            return this.timer;
        },

        /**
         * 设置策略触发后的处理器
         * @param {Function} handler
         */
        addHandler : function (handler) {
            this.addEventListener(this.EVENTS.TIMER, jQuery.proxy(function() {
                handler.apply(this, arguments);
            }, this));
        }
    }
);
/**
 * @fileoverview: 播放内核 策略模块
 * @author: qiaogang;huangzhongjian
 * @date: Sunday, March 25, 2012
 *
 */
/*
 * 以下规则监控播放器setUrl();play();后的状态改变
 */
var PlayEngineRules = PlayEngineRules || {};
/**
 * 1. 播放前缓冲超时（链接超时）
 * 链接时间超过[time]秒(默认10s)，未进入到缓冲或播放状态，触发。
 * 持续prebuffer状态
 */
PlayEngineRules.Prebuffer = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认10s
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 10;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "preBuffer",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.getTimer().reset();
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    var nSt = engineEvent['newState'];
                    var STATES = engineEvent.target.STATES;
                    if (nSt == STATES.PREBUFFER) {
                        ruleEvent.getTimer().start();
                    } else {
                        ruleEvent.getTimer().reset();
                    }
                }
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.Prebuffer'
    }).extend({
        getRule : function() {
            return this.rule;
        }
});

/**
 * 2. 缓冲超时
 * 缓冲时间超过10秒，未进入到播放状态，触发。
 * (第一次持续buffer状态)
 */
PlayEngineRules.FirstBuffer = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认10s
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 10;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "firstBuffer",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.getTimer().reset();
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    var nSt = engineEvent['newState'], oSt = engineEvent['oldState'];
                    var STATES = engineEvent.target.STATES;
                    if (nSt == STATES.BUFFERING) {
                        if (oSt == STATES.READY || oSt == STATES.PREBUFFER) {
                            ruleEvent.getTimer().start();
                        }
                    } else {
                        ruleEvent.getTimer().reset();
                    }
                }
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.FirstBuffer'
    }).extend({
        getRule : function() {
            return this.rule;
        }
});

/**
 * 3. 连续缓冲超时（播放后连续缓冲超时）
 * 进入播放状态后，连续缓冲（在play间出现的buffer时间）累计超过20秒，视为坏链。
 * 期间play状态小于100ms的记为buffer
 */
PlayEngineRules.Buffer = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认20s
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 20;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "buffer",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.startRecord = true;
                    ruleEvent.getTimer().reset();
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    var nSt = engineEvent['newState'], oSt = engineEvent['oldState'];
                    var STATES = engineEvent.target.STATES;
                    if (ruleEvent.startRecord) {
                        if (nSt == STATES.BUFFERING) {
                            if (oSt == STATES.PLAY) {
                                ruleEvent.getTimer().start();
                            }
                        } else if (nSt == STATES.PLAY || nSt == STATES.PAUSE) {
                            if (oSt == STATES.BUFFERING) {
                                ruleEvent.getTimer().pause();
                            }
                        } else if (nSt == STATES.END || nSt == STATES.READY) {
                            ruleEvent.getTimer().reset();
                            ruleEvent.startRecord = false;
                        }
                    }
                }
            },
            handler : function(event) {
                event.target.startRecord = false;
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.Buffer'
    }).extend({
        getRule : function() {
            return this.rule;
        }
});

/**
 * 4. 播放后进入异常状态
 * 播放后进入ready，并且持续该状态超过1秒，视为坏链。
 */
PlayEngineRules.Exception = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认20s
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 1;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "exception",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.startRecord = true;
                    ruleEvent.getTimer().reset();
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    var nSt = engineEvent['newState'], oSt = engineEvent['oldState'];
                    var STATES = engineEvent.target.STATES;
                    if (ruleEvent.startRecord) {
                        if (nSt == STATES.READY || nSt == STATES.ERROR) {
                            if (oSt == STATES.PLAY || oSt == STATES.PREBUFFER) {
                                ruleEvent.getTimer().start();
                            }
                        } else {
                            ruleEvent.getTimer().reset();
                        }
                    }
                }
            },
            handler : function(event) {
                event.target.startRecord = false;
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.Exception'
    }).extend({
        getRule : function() {
            return this.rule;
        }
});

/**
 * 5. 连续播放
 * 进入播放状态后，持续时间超过60秒的，视为优质链接，保存链接。
 * 持续时间指非人为操作，人为操作后（比如暂停后再播放），记录时间重置。
 */
PlayEngineRules.Play60s = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认20s
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 60;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "savelink",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.startRecord = true;
                    ruleEvent.getTimer().reset();
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    var nSt = engineEvent['newState'], oSt = engineEvent['oldState'];
                    var STATES = engineEvent.target.STATES;
                    if (ruleEvent.startRecord) {
                        if (nSt == STATES.PLAY) {
                            ruleEvent.getTimer().start();
                        } else if (nSt == STATES.PAUSE || nSt == STATES.BUFFERING) {
                            if (oSt == STATES.PLAY) {
                                ruleEvent.getTimer().pause();
                            }
                        } else {
                            ruleEvent.getTimer().reset();
                        }
                    }
                }
            },
            handler : function(event) {
                event.target.startRecord = false;
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.Play60s'
    }).extend({
        getRule : function() {
            return this.rule;
        }
});

/**
 * 6.出现播放状态且持续100ms后(保证更准确)
 *
 */
PlayEngineRules.Play100ms = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认100ms
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 0.1;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "play100ms",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.startRecord = true;
                    ruleEvent.getTimer().reset();
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    var nSt = engineEvent['newState'], oSt = engineEvent['oldState'];
                    var STATES = engineEvent.target.STATES;
                    if (nSt != STATES.END) {
                        if (ruleEvent.startRecord) {
                            if (nSt == STATES.PLAY) {
                                ruleEvent.getTimer().start();
                            } else {
                                ruleEvent.getTimer().reset();
                            }
                        }
                    }
                }
            },
            handler : function(event) {
                event.target.startRecord = false;
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.Play100ms'
    }).extend({
        getRule : function() {
            return this.rule;
        }
});

/**
 * 6.无播放连接1000ms后
 *
 */
PlayEngineRules.NoLink = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认100ms
     * @options {Function} handler 超时后的回调
     */
        function(conf) {
        conf = conf || {};
        conf.time = conf.time || 1;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "nolink",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.startRecord = true;
                    ruleEvent.getTimer().reset();
                    var url = engineEvent.arguments[0];
                    if (url == '' || url == null) {
                        ruleEvent.getTimer().start();
                    }
                },

                playStateChange : function(ruleEvent, engineEvent) {

                }
            },
            handler : function(event) {
                event.target.startRecord = false;
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.NoLink'
    }).extend({
        getRule : function() {
            return this.rule;
        }
    });

/**
 * 7.加载资源无响应5s超时(setUrl后为进入任何状态)
 *
 */
PlayEngineRules.LoadException = mbox.lang.createClass(
    /**
     * 构造函数
     * @param {Object} conf
     * @options {Number} [time] 超时时间，默认10s
     * @options {Function} handler 超时后的回调
     */
    function(conf) {
        conf = conf || {};
        conf.time = conf.time || 10;
        conf.handler = conf.handler || function(){};
        this.rule = new PlayEngineRuleModel({
            name        : "loadexception",
            delayTime   : conf.time * 1000,
            listener    : {
                setUrl : function(ruleEvent, engineEvent) {
                    ruleEvent.startRecord = true;
                    ruleEvent.getTimer().reset();
                    var url = engineEvent.arguments[0];
                    if (url != '' || url != null) {
                        ruleEvent.getTimer().start();
                    }
                },

                playStateChange : function(ruleEvent, engineEvent) {
                    if (ruleEvent.startRecord) {
                        ruleEvent.getTimer().reset();
                    }
                }
            },
            handler : function(event) {
                event.target.startRecord = false;
            }
        });
        this.rule.addHandler(conf.handler);
    }, {
        className : 'PlayEngineRules.LoadException'
    }).extend({
        getRule : function() {
            return this.rule;
        }
    });

    /**
 * @fileoverview: 播放内核 策略控制器
 * 通过监听播放内核(playEngine)的状态, 触发对应的策略(RuleModel)
 *
 * @author: qiaogang huangzhongjian
 * @date: Sunday, March 25, 2012
 *
 */
/**
 * @fileoverview: 播放内核 策略控制器
 * 通过监听播放内核(playEngine)的状态, 触发对应的策略(RuleModel)
 *
 * @author: qiaogang huangzhongjian
 * @date: Sunday, March 25, 2012
 *
 */
var PlayEngineRulesController = mbox.lang.createClass(
    function(conf) {
        conf = conf || {};
        this.playEngine = conf.playEngine;
        this.rules = [];
        //阻止ruleModel监听标识，用于中断所有ruleModel的监听
        this.isBlock = false;
    }, {
        className : 'PlayEngineRulesController'
    }).extend({
    /**
     * 添加规则 实例
     * @method addRule
     * @param {PlayEngineRuleModel} ruleModel
     */
    addRule : function(ruleModel) {
        var rule = ruleModel.getRule();

        rule.setPlayEngine(this.playEngine);
        this.rules.push(rule);

        var listener = rule.getListener();

        $.each(listener, jQuery.proxy(function(eventName,callback) {
            var _listener = jQuery.proxy(function() {
                if (!this.isBlock) {
                    callback.apply(rule, arguments);
                }
            }, this,rule);
            switch (eventName.toLowerCase()) {
                case 'playstatechange' :
                    eventName = this.playEngine.EVENTS.STATECHANGE;
                    break;
            }

            this.playEngine.setEventListener(eventName, _listener);
        }, this));
    },

    /**
     * 获得已加载规则模型的数量
     * @method getRulesCount
     */
    getRulesCount : function() {
        return this.rules.length;
    },

    /**
     * 返回已添加的规则数组
     * @method getRules
     * @return {Array}
     */
    getRules : function() {
        return this.rules;
    },

    /**
     * 根据规则唯一标识重置定时器
     * @method reset
     * @param {String} name 规则唯一标识。若为空，则重置所有已添加规则的定时器
     */
    reset : function(name) {
        if (name) {
            for (var i = 0, len = this.rules.length; i < len; i++) {
                if (this.rules[i].getName() == name) {
                    this.rules[i].getTimer().reset();
                }
            }
        } else {
            for (var i = 0, len = this.rules.length; i < len; i++) {
                this.rules[i].getTimer().reset();
            }
        }
    },
    /**
     * 阻断状态监听器的监听(即，阻断通过on的方式对某一方法的监听，不去调用通过on注册的方法)
     * @method blockListen
     */
    blockListen : function() {
        this.isBlock = true;
    },

    /**
     * 恢复状态监听器的监听
     * @method resetListen
     */
    resetListen : function() {
        this.isBlock = false;
    },

    /**
     * 获得阻断状态
     * @method getBlockState
     */
    getBlockState : function() {
        return this.isBlock;
    }
});


module.exports = {
	PlayEngine: PlayEngine,
	PlayEngineRules: PlayEngineRules,
	PlayEngineRulesController: PlayEngineRulesController
};