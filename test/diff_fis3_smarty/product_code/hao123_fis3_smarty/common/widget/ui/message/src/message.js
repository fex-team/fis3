/*
 * All in one Front-End message framework.
 * @author yuji@baidu.com
 * @update 2013/12/20
 *
 * module <-> module
 * iframe <-> module
 * opener -> page
 * page <-> page
 *

 window.opener hack 已经被封
 Cross-document messaging
 @see http://caniuse.com/#feat=x-doc-messaging

 TODO:

 - IE6-7:
    * [opener]只能单向, 不允许跨域
    * [page]

 - IE8-10:
    * [opener]
    * [page]

 -IE10-11
    * [opener](不允许跨域)

 - 其他
    * 除了 IE6-7, 跨域的 iframe 之间通信需要通过父页面代理传递 @see mod6<->mod7
  */
!function(name, fn, context) {
    context = this;

    fn = fn(context, {});

    for(var key in fn)
    fn.hasOwnProperty(key) && !function(key) {
        fn.prototype[key] = function() {
            fn[key].apply(null, [].concat.call(this.channel, [].slice.call(arguments)));
            return this;
        }
    }(key);

    typeof define === "function" && typeof module !== "undefined"

    // AMD
    ? module.exports = fn

    // Native
    : (context["Hao123"] || (context["Hao123"] = {}))[name] = fn;

    // independent from AMD
    window.Gl = window.Gl || {};
    Gl[name] = fn;
}.call(window, "message", function(WIN, channels, undef) {

    var supportPostMessage = "postMessage" in WIN

        , uid = +new Date

        , NAV = WIN.navigator

        , storage = !!function(result) {
            try {
                localStorage.setItem(uid, uid);
                result = localStorage.getItem(uid) == uid;
                localStorage.removeItem(uid);
                return result;
            } catch(e) {}
        }() && localStorage

        /**
         * simple array iterator
         * @param  {Array}   arr     array
         * @param  {Function} cb callback
         * @return {[type]}            [description]
         */
        , each = function(arr, cb) {
            for(var i = 0, l = arr.length; i < l; i++)
            if(cb(arr[i], i, arr) === !1) break;
        }

        // Constractor
        , message = function(channel) {
            if(!(this instanceof message)) return new message(channel);
            this.channel = channel;
        }

        , listener = function(e) {
            var data, channel;

            try{
                data = JSON.parse(e.data);
            } catch(e) {
                return;
            }

            data && (channel = data.channel) && (channel = channels[channel]) && each(channel, function(li) {
                li && li(data.data);
            });
        }

        // init listen
        , init = {
            "iframe": function() {

                if(supportPostMessage) {
                    if(WIN.addEventListener) WIN.addEventListener("message", listener, false);
                    else WIN.attachEvent("onmessage", listener);
                }

                /*else NAV["_" + uid] = function(data) {
                    var channel;

                    alert(data.channel)
                    data && (channel = data.channel) && (channel = channels[channel]) && each(channel, function(li) {
                        li && li(data.data);
                    });
                }*/
                this["iframe"] = null;
            }

            , "opener": function() {
                if(supportPostMessage) {
                    if(WIN.addEventListener) WIN.addEventListener("message", listener, false);
                    else WIN.attachEvent("onmessage", listener);
                }
                this["iframe"] = null;
            }
            , "page": function() {

                // @see https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage
                // Storage event handlers only fire if the storage event is triggered from another window.
                if(storage) {
                    if(WIN.addEventListener) {
                        WIN.addEventListener("storage", function(e) {
                            var data, channel;
                            (data = e.newValue) && (channel = e.key) && (channel = channels[channel]) && each(channel, function(li) {
                                li && li(data);
                            });
                            // console.log(e);
                        }, false)
                    }

                    // IE8/9的storage事件不携带key和newValue等属性
                    // IE8/9的storage事件触发在localStorage的值真正改变之前
                    // 所以要支持IE8/9，必须在事件触发后，设置超时，并扫描检测所有localStorage中存储的key，手动检测其值是否发生改变。
                    // window.attachEvent("onstorage", handle_storage);
                    else {

                        /*document.attachEvent("onstorage", function(e) {
                            alert(1111)
                            var data, channel;
                            (data = e.newValue) && (channel = e.key) && (channel = channels[channel]) && each(channel, function(li) {
                                li && li(data);
                            });
                        });

                        if(document.all){
                            var old = storage.getItem({key:"a"});
                            function checkUpdate(){
                                var newV = storage.getItem({key:"a"});
                                if(old != newV){
                                    alert(newV);
                                    old = newV;
                                }
                            }
                            setInterval(function(){
                                checkUpdate();
                            },500);
                        }*/
                    }
                }
                this["page"] = null;
            }
        }

    /**
     * [send description]
     * @param  {[type]} channel [description]
     * @param  {[type]} data    [description]
     * @param  {[Object | Array]} target  default: window.parent
     * @return {[type]}         [description]
     */
    message.send = function(channel, data, target) {

        var type = channel.split(".")[0];

        channel && ({
            "iframe": supportPostMessage
                ? function() {

                    // If cross-domian can not read target's length, so not supports spec muilt target.

                    /*
                    !(target = target || WIN.parent).length && (target = [target]);
                    each([target], function(li) {
                        li.postMessage(channel + "|" + data, "*");
                    });
                    */

                    setTimeout(function () {
                        // console.log(target)

                        // fuck!!
                        // IE8/9 only allowed post String!
                        (target || WIN.parent).postMessage(JSON.stringify({data: data, channel: channel}), "*");
                    }, 0);
                }
                : function() {

                    // NAV["_" + uid] && NAV["_" + uid]({data: data, channel: channel});
                    // async callback
                    setTimeout(function () {
                        (channel = NAV[channel]) && each(channel, function(callback) {
                            callback && callback(data);
                        });
                    }, 0);
                }
            , "module": function() {

                // async callback
                setTimeout(function () {
                    (channel = channels[channel]) && each(channel, function(callback) {
                        callback && callback(data);
                    });
                }, 0);
            }
            , "opener": function() {
                setTimeout(function () {

                    // fuck!!
                    // 1. IE8/9 only allowed post String!
                    // 2. IE10-11 opener + postMessage not allow cross-domain!
                    try{
                        (target || WIN.parent).postMessage(JSON.stringify({data: data, channel: channel}), "*");
                    } catch(e) {
                    // fallback to window.opener

                    // reg on NAV?

                        // catch cross-domain error.
                        try{
                            channel = WIN.opener.navigator[channel]
                        } catch(e) {
                            return;
                        }
                        each(channel, function(callback) {
                            callback && callback(data);
                        });
                    }
                }, 0);
            }
            , "page": storage
            ? function() {
                storage[channel] = data + "";
                setTimeout(function() {
                    storage.removeItem(channel);
                }, 0);
            }

            // IE10 issue/
            : function() {

            }
        })[type]();

        return message;
    }

    message.on = function(channel, callback) {
        var type = channel.split(".")[0];
        init[type] && init[type]();

        if((type === "iframe" || type === "opener") && !supportPostMessage) {
            (NAV[type = channel] || (NAV[type] = [])).push(callback);
        }
        else channel && (channels[channel] || (channels[channel] = [])).push(callback);

        return message;
    }

    // off callback or all.

    /**
     * [off description]
     * @param  {[type]}   channel  [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     *
     * note:
     * 1. about callback
     * [undefind] ==> remove all listeners
     * [String|Array] ==> remove spec listeners
     */
    message.off = function(channel, handle) {
        channel && handle
            ? each(channels[channel], function(callback, i) {
                each(handle instanceof Array ? handle : [handle], function(cb) {
                   cb === callback && (channels[channel][i] = null);
                });
            })
            : channels[channel] = [];
        return message;
    }

    return message;
});
