var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');

;(function($, document, Math, devicePixelRatio) {
    var canvasSupported = document.createElement("canvas").getContext

    var peity = $.fn.peity = function(type, options) {
            if (canvasSupported) {
                this.each(function() {
                    var defaults = peity.defaults[type]
                    var data = {}
                    var $this = $(this)

                    $.each($this.data(), function(name, value) {
                        if (name in defaults) data[name] = value
                    })

                    var opts = $.extend({}, defaults, data, options)
                    var chart = new Peity($this, type, opts)
                    chart.draw()

                    $this.change(function() {
                        chart.draw()
                    })
                });
            }

            return this;
        };

    var Peity = function($elem, type, opts) {
            this.$elem = $elem
            this.type = type
            this.opts = opts
        };

    var PeityPrototype = Peity.prototype;

    PeityPrototype.colours = function() {
            var colours = this.opts.colours
            var func = colours

            if (!$.isFunction(func)) {
                func = function(_, i) {
                    return colours[i % colours.length]
                }
            }

            return func
        };

    PeityPrototype.draw = function() {
        if($.browser.mozilla && ~~($.browser.version.split(".")[0]) < 5)
        try {peity.graphers[this.type].call(this, this.opts)} catch(e){}
        else peity.graphers[this.type].call(this, this.opts)
    };

    PeityPrototype.prepareCanvas = function(width, height) {
        var canvas = this.canvas

        if (canvas) {
            this.context.clearRect(0, 0, canvas.width, canvas.height)
        } else {
            canvas = $("<canvas>").attr({
                height: height * devicePixelRatio,
                width: width * devicePixelRatio
            });

            if (devicePixelRatio != 1) {
                canvas.css({
                    height: height,
                    width: width
                })
            }

            this.canvas = canvas = canvas[0]
            this.context = canvas.getContext("2d")
            this.$elem.hide().before(canvas)
        }

        return canvas
    };

    PeityPrototype.values = function() {
        return $.map(this.$elem.text().split(this.opts.delimiter), function(value) {
            return parseFloat(value)
        })
    };

    peity.defaults = {};
    peity.graphers = {};

    peity.register = function(type, defaults, grapher) {
        this.defaults[type] = defaults
        this.graphers[type] = grapher
    };
    peity.register("line", {
        // colour: "#c6d9fd",
        colour: "#D0ECE0",
        // strokeColour: "#4d89f9",
        strokeColour: "#00985B",
        strokeWidth: 1,
        delimiter: ",",
        height: 16,
        max: null,
        min: 0,
        width: 32
    }, function(opts) {
        var values = this.values()
        if (values.length == 1) values.push(values[0])
        var max = Math.max.apply(Math, values.concat([opts.max]));
        var min = Math.min.apply(Math, values.concat([opts.min]))

        var canvas = this.prepareCanvas(opts.width, opts.height)
        var context = this.context
        var width = canvas.width
        var height = canvas.height
        var xQuotient = width / (values.length - 1)
        var yQuotient = height / (max - min)

        var coords = [];
        var i;

        context.beginPath();
        context.moveTo(0, height + (min * yQuotient))

        for (i = 0; i < values.length; i++) {
            var x = i * xQuotient
            var y = height - (yQuotient * (values[i] - min))

            coords.push({
                x: x,
                y: y
            });
            context.lineTo(x, y);
        }

        context.lineTo(width, height + (min * yQuotient))
        context.fillStyle = opts.colour;
        context.fill();

        if (opts.strokeWidth) {
            context.beginPath();
            context.moveTo(0, coords[0].y);
            for (i = 0; i < coords.length; i++) {
                context.lineTo(coords[i].x, coords[i].y);
            }
            context.lineWidth = opts.strokeWidth * devicePixelRatio;
            context.strokeStyle = opts.strokeColour;
            context.stroke();
        }
    });
})(jQuery, document, Math, window.devicePixelRatio || 1);

/**
 * speedTest
 * @return {[type]} [description]
 * @description 1. fixed waiting time 2. last result is the max speed
 */

 /*
 todo:
 1. type ==> that.type
 2. replace request 0 to onloadstart
 3. guess suitable size by user's network
  */
module.exports = function() {
    var that, getData, postData, el, opt, progressWidth, realTimeSpeed, realTimechart

        /** @type {Number} waiting time before fetch data */
        , waitingTime;

    return {

        /**
         * fast copy self with string
         * @param  {String} s string
         * @param  {Number} n times
         * @return {String}   result
         */
        copySelf: function(s, n){
            if(n === 0) return "";
            else if(n === 1) return s;
            else {
                var r = arguments.callee(s, n >>> 1);
                return r + r + (n & 1 ? s : "");
            }
        }

        , formatPad: function(s, n) {
            return /\./.test(s = s + "") ? s : s + "." + that.copySelf("0", n || 1)
        }

        /**
         * single test method
         * @param  {String} url  php api url
         * @param  {String} type GET/POST
         * @param  {Number} size test file size
         */
        , test: function(url, type, size) {
            var startTime,
                reqPara = {
                    url: url
                    , type: type
                    , cache: false
                    , xhr: function() {
                        return that.xhr;
                    }
                    , success: function(res) {
                        that.callback(type, startTime, size);
                    }
                    , error: function() {
                        opt.btnStart.data("testate") === 1 && that.render(2);
                    }
                };

            // render current request type
            that.render(0, type);

            // cache
            // fuck firefox, can not cache the xhr object, will not trigger success callback
            // that.xhr = that.xhr || function(xhr) {
            that.xhr = function(xhr) {
                !!window.ProgressEvent && xhr.upload.addEventListener("progress", function(e) {
                    that.progress(e, type);
                }, !1);

                !!window.ProgressEvent && xhr.addEventListener("progress", function(e) {
                    that.progress(e, type);
                }, !1);
                return xhr;
            }($.ajaxSettings.xhr());

            that.postShim = that.postShim || that.copySelf("0", opt.postSize);

            if(type === "POST") reqPara.data = that.postShim;
            else reqPara.url += ("?filesize=" + size);

            // update startTime
            that.startTime = startTime = (new Date).getTime();

            that.ajax = $.ajax(reqPara);
        }

        /**
         * callback for test
         * @param  {String}   type      GET/POST
         * @param  {Time}   startTime   start time
         * @param  {Number}   size      test file size
         */
        , callback: function(type, startTime, size) {

            // test error or timeout
            if(opt.btnStart.data("testate") === 2) return;

            // fetch waiting time twice
            if(size === 0) {
                var _waitingTime = (new Date).getTime() - startTime;

                if(!waitingTime) {
                    waitingTime = _waitingTime;

                    return that.test(opt.phpUrl, "GET", 0);
                }

                else {
                    waitingTime = Math.min(waitingTime, _waitingTime);

                    // update opt.getSize
                    // 400KB/s ==> 188ms ==> 6s
                    // 328KB/s ==> 193ms ==> 6s
                    // 94KB/s ==> 222ms ==> 6s

                    // waitingTime > 200 && (opt.getSize = opt.getSizeFallback, opt.postSize = opt.postSizeFallback);

                    // check first GET end time to adjust getTimes
                    setTimeout(function() {
                        !getData.length && (opt.getTimes = 1);
                    }, 5*1000);
                    setTimeout(function() {
                        getData.length && (opt.getTimes = 5);
                    }, 1*1000);

                    // begin with GET
                    return that.test(opt.phpUrl, "GET", opt.getSize);
                }
            }

            var diffTime = (new Date).getTime() - startTime,
                speed = that.getSpeed(size, (diffTime > waitingTime ? diffTime - waitingTime : 1));

            (type === "GET" ? getData : postData).push(speed);

            // test end
            if(opt.postTimes && postData.length === opt.postTimes || !opt.postTimes && getData.length === opt.getTimes) return that.render(1, type, speed);

            // render ui
            that.render(0, type, speed);

            that.test(opt.phpUrl, getData.length === opt.getTimes ? "POST" : "GET", getData.length === opt.getTimes ? opt.postSize : opt.getSize);
        }

        // get: waiting before receive
        // post: waiting after receive
        , progress: function(e, type) {

            var size = type === "GET" ? opt.getSize : opt.postSize,
                fixLoaded = size * 1 / 20,
                data = type === "GET" ? getData : postData,
                preSpeed = Math.max.apply(Math, data);

            // fix
            // if(e.loaded < fixLoaded || e.loaded > size - fixLoaded) return;
            // if(e.loaded < fixLoaded) return;

            // console.log(that.startTime);

            var diffTime = (new Date).getTime() - that.startTime;

            var speed = that.getSpeed(e.loaded, type === "GET" ? (diffTime > waitingTime ? diffTime - waitingTime : 1) : diffTime);

            // fix begin needle
            if(data.length && (speed > 2 * preSpeed)) speed = preSpeed;
            if(data.length && (speed < preSpeed / 2)) speed = preSpeed;

            if(diffTime < 500 && speed > 100) return;
            if(diffTime < 100) return;

            // update realTimeSpeed
            realTimeSpeed = speed;

            // render ui
            that.render(0, type, speed);

            opt.barProgress.width(Math.min(progressWidth, opt.barProgress.width() + e.loaded / size * progressWidth / (opt.getTimes + opt.postTimes)));
            // var total = (e.loaded / e.total)*100;
            // document.body.innerHTML += Math.ceil(total);
        }

        /**
         * v = s / t, you know that
         * @param  {Number} s         file size (B)
         * @param  {Number} t         pass time (ms)
         * @param  {Number} fixResult fix result if need
         * @param  {Number} remainder the remainder of result
         * @return {Number}           speed (KB/s)
         */
        , getSpeed: function(s, t, fixResult, remainder) {

            // fix toFixed with round
            var multiplier = Math.pow(10, remainder || opt.remainder);
            return Math.round(s / t * 1000 / 1024 * (fixResult || opt.fixResult) * multiplier) / multiplier;
        }

        , speedToBandWidth: function(speed, remainder, padZero) {
            var multiplier = Math.pow(10, remainder || opt.remainder),
                result = that.formatPad(Math.round(speed * 8 / 1024 * multiplier) / multiplier);

            return padZero ? that.copySelf("0", 5 - result.length) + result : result;
        }

        // rotate
        // 2m = 256
        // 1m = 128
        // 5m = 640
        // 10m = 1280
        , rotate: function(speed, scope) {
            var data = opt.dialQueue
            , l = data.length;
            speed = speed * 8 / 1024;
            scope = scope || function(i) {
                for(; i<l; i++) if(speed < data[i]) return i - 1;
                return l-1;
            }(0);

            return Math.round(opt.angleMax / (l - 1) * ((speed - data[scope]) / (data[scope + 1] - data[scope]) + scope)) + 6;
        }

        , rotateRender: function(rotate, fix) {
            opt.supportCanvas

            ? opt.needle.css("transform", "rotate(" + (fix ? Math.abs((rotate + Math.round(Math.random() * fix) - Math.round(Math.random() * fix))) : rotate) + "deg)")

            : opt.needle.css("rotation", rotate);
        }

        /**
         * matrix to angle
         * @param  {String} matrix matrix of transform's PropertyValue
         * @return {Number}        angle value
         */
        , matrixToAngle: function(matrix, a, b) {
            if(!matrix || matrix === "none") return 0;
            matrix = matrix.split("(")[1].split(")")[0].split(",");
            a = matrix[0];
            b = matrix[1];
            return Math.round(Math.asin(b / Math.sqrt(a * a + b * b)) * (180 / Math.PI));
        }

        // render UI

        /**
         * UI render controller
         * @param  {Number} end   render type
         * @param  {String} type  request type
         * @param  {Number} speed KB/s
         */
        , render: function(renderType, reqType, speed) {
            return [

                // process
                function(reqType, speed, rotate) {
                    if(typeof speed > "t") return opt.infoType.html(reqType === "GET" ? "down" : "up");

                    rotate = that.rotate(speed);

                    // !window.ProgressEvent &&

                    // opt.needle.css("transform", "rotate(" + Math.abs((rotate + Math.round(Math.random() * 10) - Math.round(Math.random() * 10))) + "deg)");

                    that.rotateRender(rotate, 10);

                    // opt.realtime.html(speed*8 + "Kb/s; " + speed);
                    speed && (getData.length === opt.getTimes ? opt.resultUp : opt.resultDown).html(that.formatPad(speed)), opt.realTimeBandWidth.html(that.speedToBandWidth(speed, null, !0));


                    opt.barProgress.width(Math.min(progressWidth, (getData.length + postData.length) / (opt.getTimes + opt.postTimes) * progressWidth));

                }

                // end
                , function(rotate) {
                    var now = new Date,
                        nowH;

                    !el.hasClass("speed-test--hide") && el.addClass("speed-test--result");
                    opt.infoType.html("");
                    opt.btnStart.html(opt.textStart).data("testate", 0);
                    rotate = Math.max.apply(Math, getData);

                    // opt.realtime.html("upload: "+ Math.max.apply(Math, postData) + "KB/s; download: " + rotate);
                    rotate && $.extend(opt.speedResult,{
                                    download: that.formatPad(rotate),
                                    bandwidth: that.speedToBandWidth(rotate)
                                });
                    rotate && opt.resultDown.html(that.formatPad(rotate)), opt.resultBandWidth.html(that.speedToBandWidth(rotate)), opt.realTimeBandWidth.html(that.speedToBandWidth(rotate, null, !0));

                    postData.length && opt.resultUp.html(that.formatPad(Math.max.apply(Math, postData)));

                    // opt.barProgress.width((getData.length + postData.length) / (opt.getTimes + opt.postTimes) * progressWidth + "px");

                    opt.barProgress.width(0);

                    // opt.needle.css("transform", "rotate(" + that.rotate(rotate) + "deg)");

                    that.rotateRender(that.rotate(rotate));

                    realTimechart && clearInterval(realTimechart);

                    nowH = now.getHours();
                    nowH = nowH < 12 ? nowH : nowH - 12;
                    $(".speed-test_ip p").html(opt.tplTime.replaceTpl({
                        D: ((now.getDate() + "").length > 1 ? "" : "0") + now.getDate()
                        , M: ((now.getMonth() + 1 + "").length > 1 ? "" : "0") + (now.getMonth() + 1)
                        , Y: now.getFullYear()
                        , h: ((nowH + "").length > 1 ? "" : "0") + nowH
                        , m: ((now.getMinutes() + "").length > 1 ? "" : "0") + now.getMinutes()
                        , des: now.getHours() > 12 ? "PM" : "AM"
                    }));

                    var speedColumn = opt.speedColumn.split("|"),
                        renderStar = function(n, p) {
                            $(".speed-test_faster").html(opt.tplFaster.replaceTpl({
                                percent: '<em style="*bottom:5px;">' + p + '%</em>'
                            }));

                            $(".speed-test_grade").html(opt.tplGrade.replaceTpl({
                                star: "<span>" + that.copySelf("<i></i>", n) + "</span>"
                            }));
                            $.extend(opt.speedResult,{
                                faster:  p + '%',
                                grade: n
                            });
                        };
                    if(opt.imageAd){
                        $(".speed-test_imagead").html(helper.replaceTpl(opt.tplImageAd,opt.imageAd));
                    }else{
                        $(".speed-test_share").html(opt.tplShare);
                    }
                    $(".speed-test_result_t").html(opt.tplTitle);

                    UT && rotate && UT.send({"type": "click", "sort":"sideSpd", "value": "spdEnd", "sp": rotate,"modId":"speedtest"});

                    for(var speedColumn = opt.speedColumn.split("|"), i=0, p = 1, li; li = speedColumn[i];i++) {
                        if(rotate > speedColumn[speedColumn.length-3] || rotate == speedColumn[speedColumn.length-3]) {
                            p = rotate < speedColumn[speedColumn.length-2] ? 90 + ((rotate - speedColumn[speedColumn.length-3]) / (speedColumn[speedColumn.length-2] - speedColumn[speedColumn.length-3])).toFixed(2) * 10 : 99.9
                            return renderStar(5, p.toFixed(1));
                        }

                        else if(rotate < speedColumn[2] || rotate == speedColumn[2]) {
                            if(rotate > speedColumn[0] && rotate < speedColumn[1]) {
                                p = 1 + ((rotate - speedColumn[i]) / (speedColumn[i+1] - speedColumn[i])).toFixed(2) * 10
                            }
                            else if(rotate > speedColumn[1] || rotate == speedColumn[1]){
                                p = 10 + (rotate - speedColumn[i+1]) / (speedColumn[i+2] - speedColumn[i+1]) * 10
                            }
                            return renderStar(1, p.toFixed(1));
                        }

                        else if(rotate < li || rotate === li) {
                            p = (i - 1) * 10 + (rotate - speedColumn[i-1]) / (speedColumn[i] - speedColumn[i-1]) * 10;
                            return renderStar(~~(i/2), p.toFixed(1));
                        }
                    }
                }

                // error
                // notice that each connect will break by web server
                , function() {
                    el.addClass("speed-test--error");

                    opt.btnStart.data("testate", 2).html(opt.textStart);

                    realTimechart && clearInterval(realTimechart);

                    UT && UT.send({"type": "click", "sort":"sideSpd", "value": "spdEnd", "sp": "0","modId":"speedtest"});
                }

                // init
                , function() {
                    // opt.realtime.html("N/A");
                    el.removeClass("speed-test--error").removeClass("speed-test--result").removeClass("speed-test--hide");

                    opt.resultDown.html("N/A");
                    opt.resultBandWidth.html("N/A");
                    opt.resultUp && opt.resultUp.html("N/A");


                    that.angle = that.angle || (opt.supportCanvas ? that.matrixToAngle(opt.needle.css("transform")) : 6);
                    // opt.needle.css("transform", "rotate(" + that.angle + "deg)");

                    that.rotateRender(that.angle);

                    opt.btnStart.data("testate", 1).html(opt.textTesting);


                    if(!opt.supportCanvas) return;
                    that.updatingChart = that.updatingChart || opt.resultChart.html(0).peity("line", { width: 85 });

                    that.updatingChart.text(0);

                    realTimechart = setInterval(function() {
                      // var random = Math.round(Math.random() * 10)
                      var random = realTimeSpeed * 8 / 1024
                      var values = that.updatingChart.text().split(",")
                      // values.shift()
                      values.push(random)

                      that.updatingChart.text(values.join(",")).change();
                    }, 1000);
                }

            ][renderType](reqType, speed);
        }

        , stop: function() {
            that.xhr && (opt.btnStart.data("testate", 2).html(opt.textStart), that.xhr.abort());

            realTimechart && clearInterval(realTimechart);
        }

        , timeoutWatch: function() {
            that.timeout && clearTimeout(that.timeout);
            that.timeout = setTimeout(function() {
                opt.btnStart.data("testate") === 1 && (that.stop(), that.render(2));
            }, opt.testTimeout)
        }

        , start: function(_el, _opt) {

            UT && _opt.btnStart.data("testate") !== 1 && UT.send({type: "click", sort:"sideSpd", value: "spdStrt","modId":"speedtest"});

            // check state
            // testate: 0 || undefined ==> not in testing, 1 ==> begin testing, 2 ==> error or timeout
            if(_opt.btnStart.data("testate") === 1) return that.stop();

            el = _el;
            opt = _opt;
            that = this;

            // reset data
            getData = [];
            postData = [];
            waitingTime = 0;
            progressWidth = opt.barProgress.parent().width();

            that.updatingChart && that.updatingChart.text(0).change();

            // init render
            that.render(3);

            // fetch waitingTime & test queue start
            that.test(opt.phpUrl, "GET", 0);
            that.timeoutWatch();
        }
    }
}();
