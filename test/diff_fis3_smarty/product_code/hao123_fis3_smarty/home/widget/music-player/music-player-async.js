var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var helper = require('common:widget/ui/helper/helper.js');
window.player = {}; //播放内核对象，要求必须是全局变量
require.async('home:widget/music-player/player.js', function(PlayCore) {
    var config = conf.sidePlayer; //播放器config
    var maxNum = config.maxNum.split(","); //列表最大歌曲数量
    var loadThreshold = config.loadThreshold; //还差多少首歌到底部时会再请求新数据
    var numPerReq = config.numPerReq; //一次请求多少首
    var hasEverUsed = 0; //为只触发一次使用统计而加的标志位
    var container = $("#sidePlayer"); //整个播放器外容器
    var eventCenter = $({}); //{};公共事件对象
    /*
     *data层
     */
    var dataModel = {
        // 得到全部播放类别数据，初始化数据模型
        initModel: function() {
            var that = this,
                params = "?app=mplayer&country=" + conf.country + "&act=tablist"
            that.initCurState();
            $.ajax({
                url: conf.apiUrlPrefix + params,
                // url: "/static/home/widget/music-player/tablist.json",
                dataType: "jsonp",
                jsonp: "jsonp",
                jsonpCallback: "ghao123_" + hex_md5(params,16),
                // jsonpCallback: "ghao123_89166f825c14732e",
                cache: false
            }).done(function(data) {
                data = data.content.data;
                $.each(data, function(index, type) {
                    that.initListAttr(index, type);
                });
                eventCenter.trigger("typeready.ui", [data]);
                that.append(0);
            });
        },
        // 初始化当前状态数据
        initCurState: function(){
            this.curState = {
                showType: 0, //当前显示的列表type
                playType: 0, //当前播放的列表type
                curIndex: 0, //当前播放的歌曲index
                curFileLink: "", //当前加载的歌曲url,刷新后点击播放按钮时会用到
                appendLock: 0 //当前append操作是否被锁住
            };
        },
        // 初始化list数据，index- (number)播放类别id，type-(string)类别名称
        initListAttr: function(index, type) {
            this.listAttr = this.listAttr || [];
            this.listAttr[index] = {
                type: type, //类别名
                lastIndex: -1, //已加载的最大index
                length: 0, //目前列表的长度
                data: [] //目前列表的数据
            };
        },
        // 设置当前状态数据，data-(object)要更新的属性集合
        setCurState: function(data) {
            $.extend(this.curState, data);
        },
        // 设置列表数据，index-(number)播放类别id，obj-(object)要更新的属性集合
        setListAttr: function(index, obj) {
            $.extend(this.listAttr[index], obj);
        },
        // 获得当前播放状态中的某个属性值，key-(string)要查询的属性名称
        getCurState: function(key) {
            if (key) {
                return this.curState[key];
            } else {
                return this.curState;
            }
        },
        // 获得某个列表数据中的某个属性值，index-(number)播放类别id，key-(string)要查询的属性名称
        getListAttr: function(index, key) {
            return this.listAttr[index][key];
        },
        // 获得某个歌曲的信息，playType-(number)正在播放的类别id，curIndex-(number)正在播放的歌曲在列表中的序号，key(string) optinal 要查询的歌曲属性名称，不填则得到该歌曲的所有信息
        getSingleData: function(playType, curIndex, key) {
            if (key) {
                return this.listAttr[playType].data[curIndex][key];
            } else {
                return this.listAttr[playType].data[curIndex];
            }
        },
        // 判断当前活动数据是否在列表头部
        isAtHead: function() {
            return this.getCurState("curIndex") === -1;
        },
        // 判断当前活动数据是否在列表尾部
        isAtTail: function() {
            return this.getCurState("curIndex") === this.getListAttr(this.getCurState("playType"), "length");
        },
        // 对append操作加锁
        lockAppend: function() {
            this.setCurState({
                appendLock: 1
            });
        },
        // 对append操作解锁
        unlockAppend: function() {
            this.setCurState({
                appendLock: 0
            });
        },
        // 判断当前是否可以进行append操作
        canAppend: function() {
            return !this.getCurState("appendLock");
        },
        // 请求列表数据，触发UI层的append事件，index-(number)播放类别id，callback-(function)得到数据后要执行的回调
        append: function(index, callback) {
            var that = this,
                gap = maxNum[index] - that.getListAttr(index, "length"),
                params = "?app=mplayer&act=contents&country=" + conf.country + "&num=" + (gap > numPerReq ? numPerReq : gap) + "&type=" + that.getListAttr(index, "type");
            $.ajax({
                url: conf.apiUrlPrefix + params,
                // url: "/static/home/widget/music-player/songlist" + index + ".json",
                dataType: "jsonp",
                jsonp: "jsonp",
                jsonpCallback: "ghao123_" + hex_md5(params,16),
                // jsonpCallback: "ghao123_89166f825c14732e",
                cache: false
            }).done(function(data) {
                data = data.content.data;
                var oldData = that.getListAttr(index, "data");
                that.setListAttr(index, {
                    lastIndex: oldData.length,
                    length: that.getListAttr(index, "length") + data.length,
                    data: oldData.concat(data)
                });
                var lastIndex = that.getListAttr(index, "lastIndex"),
                    curSong = that.getSingleData(index, 0);
                eventCenter.trigger("append.ui", [index, data, lastIndex, curSong]);
                callback && callback.call(that);
                that.unlockAppend();
            });
        },
        // 一次性加载列表中剩余的所有数据（当前活动数据已经在列表头部并且UI层还请求前一首时使用），index-(number)播放类别id，callback-(function)得到数据后要执行的回调
        appendAll: function(index, callback) {
            var that = this,
                gap = maxNum[index] - this.getListAttr(index, "length"),
                params = "?app=mplayer&act=contents&country=" + conf.country + "&num=" + gap + "&type=" + this.getListAttr(index, "type");
            $.ajax({
                url: conf.apiUrlPrefix + params,
                // url: "/static/home/widget/music-player/songlist" + index + ".json",
                dataType: "jsonp",
                jsonp: "jsonp",
                jsonpCallback: "ghao123_" + hex_md5(params,16),
                // jsonpCallback: "ghao123_89166f825c14732e",
                cache: false
            }).done(function(data) {
                data = data.content.data;
                var oldData = that.getListAttr(index, "data");
                that.setListAttr(index, {
                    lastIndex: oldData.length,
                    length: that.getListAttr(index, "length") + data.length,
                    // length: maxNum,
                    data: oldData.concat(data)
                });
                var lastIndex = that.getListAttr(index, "lastIndex");
                eventCenter.trigger("appendAll.ui", [index, data, lastIndex]);
                callback && callback.call(that);
                that.unlockAppend();
            });
        },
        // 判断某个列表是否被初始化过，index-(number)播放类别id
        hasInit: function(index){
            return this.getListAttr(index,"length");
        },
        // 将某个list数据重置为初始状态，index(number)播放类别id
        clearListAttr: function(index) {
            var that = this;
            // 记录重置前该类别的第一首歌的链接，处理特殊操作“模块加载完成后首先点【刷新】然后点【播放】”
            that.setCurState({
                curFileLink: that.getSingleData(index, 0, "file_link")
            });
            that.setListAttr(index, {
                lastIndex: -1,
                length: 0,
                data: []
            });
        },
        // 刷新某个类别的数据，index-(number)播放类别id
        refresh: function(index) {
            var that = this;
            // 刷新的是当前播放类别
            if (that.getCurState("playType") === index) {
                that.setCurState({
                    showType: index,
                    curIndex: "" // 只有刷新操作会把curIndex置为空，作为刷新操作后的标志
                });
            // 刷新的不是当前播放类别
            } else {
                that.setCurState({
                    showType: index
                });
            }
            // 只有在列表已经初始化过了才进行
            if(that.hasInit(index)){
                that.clearListAttr(index);
                that.append(index);
            }
        },
        // 判断是否上一个操作是否是刷新操作
        isRefresh: function() {
            if (this.getCurState("curIndex") === "") {
                return true;
            } else {
                return false;
            }
        },
        // 自定义事件
        customizeEvent: function() {
            var that = this;
            eventCenter
                .on("append.data", function(e, index, callback) {
                    if (that.canAppend()) {
                        that.lockAppend();
                        that.append(index, callback);
                    }
                })
                .on("appendAll.data", function(e, index, callback) {
                    if (that.canAppend()) {
                        that.lockAppend();
                        that.appendAll(index, callback);
                    }
                })
                .on("activate.data", function(e, state, needToLoad) {
                    if (state) {
                        $.extend(state, {
                            playType: that.getCurState("showType")
                        });
                        that.setCurState(state);
                    }
                    var curState = that.getCurState();
                    if (that.isRefresh()) {
                        var curSong = {
                            file_link: that.getCurState("curFileLink")
                        };
                    } else {
                        var curSong = that.getSingleData(curState["playType"], curState["curIndex"]);
                    }
                    eventCenter.trigger("play.ui", [curState, curSong, that.isRefresh(), needToLoad]);
                })
                .on("deactivate.data", function() {
                    eventCenter.trigger("pause.ui", [that.getCurState(), that.isRefresh()]);
                })
                .on("next.data", function() {
                    if (that.isAtTail()) {
                        that.setCurState({
                            curIndex: 0
                        });
                    }
                    var curState = that.getCurState(),
                        curSong = that.getSingleData(curState["playType"], curState["curIndex"]);
                    eventCenter.trigger("next.ui", [curState, curSong]);
                })
                .on("prev.data", function() {
                    var index = that.getCurState("playType");
                    if (that.isAtHead()) {
                        that.setCurState({
                            curIndex: that.getListAttr(index, "length") - 1
                        });
                    }
                    var curState = that.getCurState(),
                        curSong = that.getSingleData(curState["playType"], curState["curIndex"]);
                    eventCenter.trigger("prev.ui", [curState, curSong]);
                })
                .on("refresh.data", function(e, index) {
                    that.refresh(index);
                    eventCenter.trigger("refresh.ui", [index]);
                })
                .on("switch.data", function(e, index) {
                    that.setCurState({
                        showType: index
                    });
                    if (!that.hasInit(index)) {
                        eventCenter.trigger("append.data", [index]);
                    }
                    eventCenter.trigger("switch.ui", [index, that.getCurState()]);
                });
        },
        // 初始化入口
        init: function() {
            this.initModel();
            this.customizeEvent();
            return this;
        }
    };
    /*
     *logic层
     */
    var sidePlayer = {
        // 判断【滚动】操作是否需要列表请求新数据，index-(number)播放类别id
        scrollNeedMore: function(index) {
            var state = this.list.scrollbar[index].state;
            return state.y + state._y <= loadThreshold * 30 && this.dataModel.getListAttr(index, "length") < maxNum[index];
        },
        // 判断【下一首】操作是否需要列表请求新数据，index-(number)播放类别id
        nextNeedMore: function(index) {
            return this.dataModel.getListAttr(index,"length") - this.dataModel.getCurState("curIndex") <= loadThreshold && this.dataModel.getListAttr(index, "length") < maxNum[index];
        },
        // 判断【上一首】操作是否需要列表请求新数据，index-(number)播放类别id
        prevNeedMore: function(index) {
            return this.dataModel.getCurState("curIndex") < 0 && this.dataModel.getListAttr(index, "length") < maxNum[index];
        },
        // 播放功能，触发data层activate事件，needToLoad-(boolean)是否需要加载，state-(object)需要重载的当前状态属性集合
        play: function(needToLoad, state) {
            eventCenter.trigger("activate.data", [needToLoad, state]);
        },
        // 暂停功能，触发data层deactivate事件
        pause: function() {
            eventCenter.trigger("deactivate.data");
        },
        // 下一首功能，在特定条件下会触发data层append事件
        next: function() {
            var that = this,
                dataModel = that.dataModel,
                index = dataModel.getCurState("playType"),
                tmpCurIndex = dataModel.getCurState("curIndex");
            dataModel.setCurState({
                curIndex: tmpCurIndex === "" ? 0 : tmpCurIndex + 1
            });
            if (that.nextNeedMore(index)) {
                eventCenter.trigger("append.data", [index, that.nextCallback]);
                return;
            }
            that.nextCallback();
        },
        // 得到下一首数据后要做的操作
        nextCallback: function() {
            eventCenter.trigger("next.data")
        },
        // 上一首功能，在特定条件下会触发data层appendAll事件
        prev: function() {
            var that = this,
                dataModel = that.dataModel,
                index = dataModel.getCurState("playType"),
                tmpCurIndex = dataModel.getCurState("curIndex");
            // curIndex减1，对用户超频繁操作造成的越界会做简单修正
            dataModel.setCurState({
                curIndex: tmpCurIndex === "" || tmpCurIndex < 0 ? -1 : tmpCurIndex - 1
            });
            if (that.prevNeedMore(index)) {
                eventCenter.trigger("appendAll.data", [index, that.prevCallback]);
                return;
            }
            that.prevCallback();
        },
        // 得到上一首数据后要做的操作
        prevCallback: function() {
            eventCenter.trigger("prev.data");
        },
        // 刷新功能，包括切换列表和触发data层refresh事件，index-(number)播放类别id
        refresh: function(index) {
            this.switchList(index);
            eventCenter.trigger("refresh.data", [index]);
        },
        // 切换列表功能，触发data层的switch事件，index-(number)播放类别id
        switchList: function(index) {
            var dataModel = this.dataModel;
            eventCenter.trigger("switch.data", [index]);
        },
        // 滚动功能，在特定条件下会触发data层append事件
        scroll: function() {
            var dataModel = this.dataModel,
                index = dataModel.getCurState("showType");
            if (this.scrollNeedMore(index)) {
                eventCenter.trigger("append.data", [index]);
            }
        },
        // 搜索功能
        initSearchBox: function() {
            var that = this,
                playerSearchBox = container.find(".player-search-input"),
                playerPlaceHolder = container.find(".player-search-placeholder");
            playerSearchBox
                .focus(function() {
                    playerPlaceHolder.hide();
                })
                .blur(function() {
                    !$.trim(playerSearchBox.val()).length && playerPlaceHolder.show();
                });
            playerPlaceHolder.click(function() {
                playerSearchBox.focus();
            });
            container.on("submit", ".player-search", function(e) {
                if ($.trim(playerSearchBox.val()).length) {
                    $(this).attr("action", conf.sidePlayer.searchForm.action);
                } else {
                    e.preventDefault();
                }
                playerSearchBox.select();
                that.sendStat("search");
            });
        },
        // 自定义事件
        customizeEvent: function() {
            var that = this;
            eventCenter
                .on("play.logic", function(e, state, needToLoad) {
                    that.play(state, needToLoad);
                    that.sendStat('', 'hasEverUsed');
                    that.sendStat('play');
                })
                .on("pause.logic", function() {
                    that.pause();
                    that.sendStat('', 'hasEverUsed');
                })
                .on("next.logic", function() {
                    that.next();
                    that.sendStat('', 'hasEverUsed');
                    that.sendStat('play');
                })
                .on("prev.logic", function() {
                    that.prev();
                    that.sendStat('', 'hasEverUsed');
                    that.sendStat('play');
                })
                .on("refresh.logic", function(e, index) {
                    that.refresh(index);
                    that.sendStat("refresh");
                })
                .on("switch.logic", function(e, index) {
                    that.switchList(index);
                    that.sendStat('', 'hasEverUsed');
                })
                .on("scroll.logic", function() {
                    that.scroll();
                    that.sendStat('', 'hasEverUsed');
                })
                .on("log.logic", function(e, sort, duplicateVarName) {
                    that.sendStat(sort, duplicateVarName);
                })
                .on("mplog.logic",function(e,type){
                    that.MPT.send({
                        type: type,
                        list: that.dataModel.getListAttr(that.dataModel.getCurState("playType"), "type"),
                        song_name:$(".song-title").text()
                    });
                });
        },
        // 发送hao123统计
        sendStat: function(sort, duplicateVarName) {
            var that = this;
            if (((duplicateVarName || "").length && !eval(duplicateVarName)) || !(duplicateVarName || "").length) {
                if (sort || sort != "") {
                    UT.send({
                        type: "click",
                        ac:"b",
                        sort: sort,
                        level: 1,
                        position: "sidePlayer",
                        modId: "musicplayer"
                    });
                    if (sort == "play") {
                        that.MPT.send({
                            type: "playstart",
                            list: that.dataModel.getListAttr(that.dataModel.getCurState("playType"), "type"),
                            song_name: $(".song-title").text()
                        });
                    }
                } else {
                    UT.send({
                        type: "click",
                        ac:"b",
                        level: 1,
                        position: "sidePlayer",
                        modId: "musicplayer"
                    });
                }
                if ((duplicateVarName || "").length) {
                    eval(duplicateVarName + " = 1;")
                }
            }
        },
        // 单独为音乐部门发送log的方法
        sendStat4Music: function() {
            var that = this,
                dataModel = that.dataModel;
            var MPT = that.MPT = {
                url: "http://nsclick.baidu.com/v.gif",
                send: function(f) {
                    f = f || {};
                    var i = this.conf,
                        b = i && i.url || this.url,
                        a = f.r = +new Date(),
                        l = window,
                        g = encodeURIComponent,
                        e = l["MPT" + a] = new Image(),
                        c = i && i.data,
                        j, h = [];
                    if (c) {
                        for (var d in c) {
                            c[d] !== j && (f[d] = c[d])
                        }
                    }
                    for (j in f) {
                        h.push(g(j) + "=" + g(f[j]))
                    }
                    e.onload = e.onerror = function() {
                        l["MPT" + a] = null
                    };
                    e.src = b + "?" + h.join("&");
                    e = h = null;
                }
            };
            MPT && (MPT.conf = {
                data: {
                    ref: "pc_widgethao123_vn",
                    pid: "304"
                }
            });
            var play100ms = new PlayCore.PlayEngineRules.Play100ms({
                handler: function() {
                    MPT.send({
                        type: "playsong100ms",
                        list: dataModel.getListAttr(dataModel.getCurState("playType"), "type"),
                        song_name: $(".song-title").text()
                    });
                }
            });
            var play60s = new PlayCore.PlayEngineRules.Play60s({
                handler: function() {
                    MPT.send({
                        type: "60play",
                        list: dataModel.getListAttr(dataModel.getCurState("playType"), "type"),
                        song_name: $(".song-title").text()
                    });
                }
            });
            var playerRuleController = new PlayCore.PlayEngineRulesController({
                playEngine: player // 传入播放核心的实例
            });
            playerRuleController.addRule(play100ms);
            playerRuleController.addRule(play60s);
        },
        // 初始化入口
        init: function() {
            var that = this;
            that.dataModel = dataModel.init();
            that.core = core.init();
            that.controls = controls.init();
            that.list = list.init();
            that.customizeEvent();
            that.sendStat4Music();
            that.initSearchBox();
            return that;
        }
    };
    /*
     *UI层
     */
    // 播放控件
    var controls = {
        // 改变播放/暂停按钮状态，type-(string)要变成的状态
        changeBtnState: function(type) {
            var playBtn = $("#play-pause");
            // 暂停时按钮的状态
            if (type === "pause") {
                playBtn.removeClass().addClass("play").attr('title', config.playBtnText);
            // 播放时按钮的状态
            } else {
                if ($("#prevSong").hasClass("disabled")) {
                    $("#prevSong,#nextSong").removeClass("disabled");
                }
                playBtn.removeClass().addClass("pause").attr('title', config.pauseBtnText);
            }
        },
        // 进度条功能，设置播放时间进度（由一系列响应函数组成）
        progressbar: function() {
            var that = this;
            var lock = 0; //在调整播放进度时不进行player.EVENTS.POSITIONCHANGE事件
            var indicator = $('#indicator'),
                curIndicator = $('#current_indicator'),
                controller = indicator.find('.user_controller'),
                paneGroup = container.find(".scroll-list"),
                progressbar = $(".player-progressbar"),
                timeMS;

            // 转换时间，毫秒转换为mm:ss格式
            var convertTime = function(time) {
                // 数字不足位的 0 补齐处理，本方法会抛弃小数部分
                var _pad = function(num, length) {
                    num = num.toString().split(".")[0];
                    if (length - num.length > -1) {
                        return Array(length - num.length + 1).join("0") + num;
                    } else {
                        return num;
                    }
                };
                var minute, second;
                time /= 1000;
                minute = Math.floor(time / 60);
                second = time % 60;
                return _pad(minute, 2) + ":" + _pad(second, 2);
            };
            // 控制鼠标改变进度条
            var showTimeIndicate = function(e) {
                var pointX = e.clientX;
                var indicatorX = pointX - indicator.offset().left;
                timeMS = indicatorX * player.getTotalTime() / indicator.width();
                curProgress = Math.round(indicatorX * 100 / indicator.width());
                if (curProgress > 100) curProgress = 100;
                if (curProgress < 0) curProgress = 0;
                curIndicator.width(curProgress + '%');
                e.preventDefault(); // 屏蔽系统的触摸事件（禁止滚动屏幕）
            };
            // 绑定进度条事件
            var bindBarEvent = function() {
                // 控制加载进度条宽度随着加载进度变化
                player.setEventListener(player.EVENTS.PROGRESS, function(e) {
                    $('#loaded_indicator').css('width', player.getLoadedPercent() * 100 + '%');
                });
                // 控制播放进度条宽度随着播放进度变化，如果进度到头触发自动播放下一首操作
                player.setEventListener(player.EVENTS.POSITIONCHANGE, function(e) {
                    if (!lock) {
                        $('#current_time').html(player.getCurrentPositionString());
                        curIndicator.width(player.getCurrentPosition() * 100 / player.getTotalTime() + '%');
                        if (player.getTotalTime() != 0 && player.getCurrentPosition() + 1000 >= player.getTotalTime()) {
                            $('#nextSong').trigger('playerAutoNext');
                        }
                    }
                });
                // 当鼠标移入进度条时，或者触摸屏中手指摸到进度条时，开始提供时间点视觉反馈
                indicator.mousedown(function(e) {
                    if ($('#prevSong,#nextSong').hasClass('disabled')) {
                        eventCenter.trigger("play.logic");
                    }
                    showTimeIndicate(e);
                    lock = 1;
                    progressbar.bind('mousemove', showTimeIndicate);
                    controller.addClass('active');
                    eventCenter.trigger("log.logic", ['', 'hasEverUsed']);
                }).mouseup(function(e) {
                    lock = 0;
                    that.changeBtnState("play");
                    player.setCurrentPosition(timeMS);
                    if ($('#prevSong,#nextSong').hasClass('disabled')) {
                        $('#prevSong,#nextSong').removeClass('disabled');
                    }
                    $('.player-pic').addClass('playing');
                    progressbar.unbind('mousemove');
                    controller.removeClass('active');
                    e.preventDefault(); // 屏蔽系统的触摸事件（禁止滚动屏幕）
                }).hover(
                    function() {
                        controller.addClass('active');
                    },
                    function() {
                        controller.removeClass('active');
                    }
                );
                $('.player-indicator-wrapper').mouseleave(function() {
                    progressbar.unbind('mousemove');
                });
                // 禁止选择，修复有时不能拖动的bug
                indicator[0].onselectstart = function(e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                };
            };
            bindBarEvent();
        },
        // 加载功能，渲染歌曲名称、歌手名，超长的做循环展示，curSong-(object)要加载的歌曲信息集合
        load: function(curSong) {
            var that = this;
            that.songTitle.html(curSong.song_title);
            that.artist.html(curSong.artist);
            that.cycleTitle();
        },
        // 播放功能
        play: function() {
            $('.player-pic').addClass('playing');
            this.changeBtnState("play");
        },
        // 暂停功能
        pause: function() {
            $('.player-pic').removeClass('playing');
            this.changeBtnState("pause");
        },
        // make the song title loop when it's too long to be shown completely
        cycleTitle: function() {
            var thisObj = this;
            clearInterval(thisObj.loopTitleFlag); //stop loop(if there is)
            thisObj.playerTitle.css('left', 0).children(':gt(1)').remove(); //reset the left value and delete the extra 2 container(if there is)
            if (thisObj.playerTitle.width() > thisObj.playerSong.width()) {
                thisObj.playerTitle.append(thisObj.playerTitle.html()).children(':eq(2)').addClass('s-pll'); //add another title container to make loop seamless
                thisObj.loopTitleFlag =
                    setInterval(function() {
                        var left = parseInt(thisObj.playerTitle.css('left'), 10),
                            borderLeft = thisObj.playerSong.width() - thisObj.playerTitle.width(); //margin value of left
                        if (left == borderLeft) {
                            thisObj.playerTitle.css('left', thisObj.playerTitle.width() / 2 + parseInt(left, 10));
                        } else {
                            thisObj.playerTitle.css('left', left - 1);
                        }
                    }, 100);
            }
        },
        // 自定义事件
        customizeEvent: function() {
            var that = this;
            eventCenter
                .on("play.ui", function(e, curState, curSong, isRefresh) {
                    !isRefresh && that.load(curSong);
                    that.play();
                })
                .on("pause.ui", function() {
                    that.pause();
                })
                .on("next.ui prev.ui", function(e, curState, curSong) {
                    that.load(curSong);
                    that.play();
                })
                .on("append.ui", function(e, index, data, lastIndex, curSong) {
                    // 第一次append时要load第一个类别的第一首歌
                    if (!that.hasLoaded) {
                        that.load(curSong);
                        that.hasLoaded = true;
                    }
                });
        },
        // 绑定事件
        bindEvent: function() {
            container
                .on("mousedown", "#play-pause", function() {
                    var thisObj = $(this);
                    if (thisObj.hasClass("play")) {
                        thisObj.addClass('play_active');
                    } else {
                        thisObj.addClass('pause_active');
                    }
                })
                .on("mouseup", "#play-pause", function() {
                    var thisObj = $(this);
                    if (thisObj.hasClass("play")) {
                        eventCenter.trigger("play.logic");
                    } else {
                        eventCenter.trigger("pause.logic");
                    }
                })
                .on("mouseenter", "#play-pause", function() {
                    var thisObj = $(this);
                    if (thisObj.hasClass("play")) {
                        thisObj.addClass("play_hover");
                    } else {
                        thisObj.addClass("pause_hover");
                    }
                })
                .on("mouseleave", "#play-pause", function() {
                    var thisObj = $(this);
                    if (thisObj.hasClass("play")) {
                        thisObj.removeClass("play_hover");
                    } else {
                        thisObj.removeClass("pause_hover");
                    }
                })
                .on("click playerAutoNext", "#nextSong", function() {
                    eventCenter.trigger("next.logic");
                })
                .on("click", "#prevSong", function() {
                    eventCenter.trigger("prev.logic");
                })
                .on("mousedown", "#nextSong, #prevSong", function() {
                    $(this).addClass("active");
                })
                .on("mouseup", "#nextSong, #prevSong", function() {
                    $(this).removeClass("active");
                });
        },
        // 初始化入口
        init: function() {
            var that = this;
            that.hasLoaded = false;
            that.playerSong = $('.player-song');
            that.playerTitle = that.playerSong.find('.player-title');
            that.songTitle = that.playerTitle.find(".song-title");
            that.artist = that.playerTitle.find(".song-artist");
            that.loopTitleFlag; //return value of setInterval, used by clearInterval when loop is not necessary
            that.progressbar();
            that.customizeEvent();
            that.bindEvent();
            return that;
        }
    };
    // 播放列表
    var list = {
        // 生成列表内容，index-(number)播放类别id，data-(array)播放列表数据，lastIndex-(number)播放列表最后一首歌的序号
        formTpl: function(index, data, lastIndex) {
            var that = this,
                html = "",
                curLength = lastIndex + 1;
            $.each(data, function(i, v) {
                html += helper.replaceTpl(that.tpl.li, {
                    colorIcon: (i + curLength) > 3 ? " playlist-order_grey" : "",
                    num: i + curLength,
                    filelink: $.trim(v.file_link),
                    title: $.trim(v.song_title),
                    artist: $.trim(v.artist),
                    songTitle: $.trim(v.song_title)
                });
            });
            return html;
        },
        // 根据当前播放歌曲的变化，改变列表项的状态，滚动条也移动到相应位置，curState-(object)需要修改的状态属性集合
        moveCurTo: function(curState) {
            var playType = curState["playType"],
                curIndex = curState["curIndex"],
                scrollbar = this.scrollbar[playType];
            this.changeItemState("play", curState);
            if (curIndex === 0) {
                scrollbar.goTo({
                    y: 0
                });
            } else {
                scrollbar.goTo({
                    y: -30 * curIndex
                });
            }
        },
        // 改变列表项的状态，type-(string)要变成的状态
        changeItemState: function(type, curState) {
            var playType = curState["playType"],
                curIndex = curState["curIndex"];
            $(".playlist-song").removeClass("play pause");
            if (type === "play") {
                this.lists.eq(playType).find("li").eq(curIndex).addClass("play");
            } else if (type === "pause") {
                this.lists.eq(playType).find("li").eq(curIndex).addClass("pause");
            }
        },
        // 播放功能，curState-(object)需要修改的状态属性集合
        play: function(curState) {
            this.moveCurTo(curState);
        },
        // 暂停功能，curState-(object)需要修改的状态属性集合
        pause: function(curState) {
            this.changeItemState("pause", curState);
        },
        // 下一首功能，curState-(object)需要修改的状态属性集合
        next: function(curState) {
            this.moveCurTo(curState);
        },
        // 上一首功能，curState-(object)需要修改的状态属性集合
        prev: function(curState) {
            this.moveCurTo(curState);
        },
        // 切换列表功能，index-(number)播放类别id，curState-(object)需要修改的状态属性集合
        switchList: function(index, curState) {
            this.listWrappers.hide();
            this.listWrappers.eq(index).show();
            var playType = curState["playType"],
                curIndex = curState["curIndex"],
                showType = curState["showType"];
            this.tabs.removeClass("cur").eq(showType).addClass("cur");
            // 切换到当前播放列表时，滚动条位置要跳到当前播放歌曲
            if (playType == showType) {
                this.scrollbar[playType].goTo({
                    y: -curIndex * 30
                });
            // 否则滚动条位置跳到顶部
            } else {
                this.scrollbar[showType].goTo({
                    y: 0
                });
            }
        },
        // 刷新功能，清空播放列表，滚动条位置跳到顶部，index-(number)播放类别id
        refresh: function(index) {
            this.lists.eq(index).html("");
            this.scrollbar[index].goTo({
                y: 0
            });
        },
        // 添加歌曲到播放列表，index-(number)播放类别id，data-(array)要添加的新数据，lastIndex-(number)播放列表最后一首歌的序号
        append: function(index, data, lastIndex) {
            this.lists.eq(index).append(this.formTpl(index, data, lastIndex));
        },
        // 自定义事件
        customizeEvent: function() {
            var that = this;
            eventCenter
                .on("play.ui", function(e, curState, curSong, isRefresh) {
                    !isRefresh && that.play(curState);
                })
                .on("pause.ui", function(e, curState, isRefresh) {
                    !isRefresh && that.pause(curState);
                })
                .on("next.ui", function(e, curState, curSong) {
                    that.next(curState);
                })
                .on("prev.ui", function(e, curState, curSong) {
                    that.prev(curState);
                })
                .on("switch.ui", function(e, index, curState) {
                    that.switchList(index, curState);
                })
                .on("refresh.ui", function(e, index) {
                    that.refresh(index);
                })
                .on("append.ui appendAll.ui", function(e, index, data, lastIndex) {
                    that.append(index, data, lastIndex);
                })
                .on("typeready.ui", function(e, data) {
                    that.initSkeleton(data);
                });
        },
        // 绑定事件
        bindEvent: function() {
            var that = this,
                timer;
            container
                .on("click", ".playlist-song", function() {
                    var state = {
                        curIndex: $(this).index()
                    };
                    eventCenter.trigger("play.logic", [state, true]);
                })
                .on("mouseenter", ".playlist-song", function() {
                    $(this).addClass('scroll-item_hover');
                })
                .on("mouseleave", ".playlist-song", function() {
                    $(this).removeClass('scroll-item_hover');
                })
                .on("click", ".playlist-tab li", function(e) {
                    eventCenter.trigger("switch.logic", [$(this).index()]);
                })
                .on("mouseenter", ".playlist-tab li", function() {
                    $(this).addClass('hover');
                })
                .on("mouseleave", ".playlist-tab li", function() {
                    $(this).removeClass('hover');
                })
                .on("click", ".refresh", function(e) {
                    var thisObj = $(this).parents("li");
                    // 为了避免频繁点击刷新按钮造成频繁请求而设置延迟执行，只相应一连串刷新操作中的最后一个
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        eventCenter.trigger("refresh.logic", [thisObj.index()]);
                    }, 200);
                    e.stopPropagation();
                });
        },
        // 处理cms中的需要添加【刷新】功能的类别的值（多个用逗号分隔），转成程序方便使用的对象类型
        getRefreshList: function(){
            var refreshList = {};
            $.each(conf.sidePlayer.showRefresh.split(","), function(i,v){
                refreshList[v] = 1;
            });
            return refreshList;
        },
        // 根据类别数据，生成list需要的框架及初始化滚动条，data-(array)播放类别数据
        initSkeleton: function(data) {
            var tabHtml = "",
                listHtml = "",
                that = this,
                tabWrapper = $(".playlist-tab", container),
                refreshList = that.getRefreshList();
            $.each(data, function(i, v) {
                tabHtml += helper.replaceTpl(that.tpl.tab, {
                    num: i,
                    name: v,
                    curClass: !i ? " class='cur'" : "",
                    fresh: parseInt(refreshList[i], 10) ? "<i class='refresh' title='" + conf.sidePlayer.refreshText + "'></i>" : ""
                });
                listHtml += helper.replaceTpl(that.tpl.list, {
                    num: i,
                    inlinestyle: !i ? " style='display:block'" : ""
                });
            });
            if (data.length <= 2) {
                $(".playlist-tabwrapper").addClass("no-arrow");
            }
            if (data.length % 2) {
                tabHtml += "<li class='filler'>&nbsp;</li>";
            }
            tabWrapper.append(tabHtml);
            $(".scroll-wrapper", container).append(listHtml);
            that.tabs = tabWrapper.children();
            that.listWrappers = $(".scroll-inner", container);
            that.lists = that.listWrappers.find(".scroll-list");
            that.bindScrollbar();
        },
        // 初始化滚动条
        bindScrollbar: function() {
            var that = this;
            that.scrollbar = [];
            require.async("common:widget/ui/scrollable/scrollable.js", function() {
                $(".scroll-list", ".mod-player").each(function(i, v) {
                    that.scrollbar[i] = $(this).scrollable({
                        autoHide: false,
                        onScroll: function() {
                            eventCenter.trigger("scroll.logic");
                        }
                    });
                });
            });
        },
        // 初始化入口
        init: function() {
            this.tpl = {
                li: "<li class='playlist-song'><i class='playlist-order#{colorIcon}'>#{num}</i><span class='playlist-name' filelink='#{filelink}' title='#{title}' artist='#{artist}'>#{songTitle}</span></li>",
                tab: "<li id='playtab#{num}'#{curClass} title='#{name}'>#{name}#{fresh}</li>",
                list: "<div id='playlist#{num}' class='scroll-inner'#{inlinestyle}><ul class='playlist-body scroll-list'></ul></div>"
            };
            this.customizeEvent();
            this.bindEvent();
            return this;
        }
    };
    // 播放内核
    var core = {
        // 音量调节器
        volumn: function() {
            var volumnContainer = $('.player-volume');
            var volumeRange = $('#volume_range');
            var volume;

            var changeVolume = function(e) {
                var pointX = e.clientX;
                var indicatorX = pointX - volumeRange.offset().left;
                volume = Math.round(indicatorX * 100 / volumeRange.width());
                if (volume > 100) volume = 100;
                if (volume < 0) volume = 0;
                player.setVolume(volume);
                $('#volume').css('width', volume + '%');
                $('#volume_i').html(volume);
                e.preventDefault(); // 屏蔽系统的触摸事件（禁止滚动屏幕）
            };
            var bindVolumnEvent = function() {
                volumeRange.mousedown(function(e) {
                    changeVolume(e);
                    volumnContainer.bind('mousemove', changeVolume);
                    eventCenter.trigger("log.logic", ["", "hasEverUsed"]);
                });
                volumeRange.mouseup(function(e) {
                    volumnContainer.unbind('mousemove');
                });
                volumnContainer.mouseleave(function(e) {
                    volumnContainer.unbind('mousemove');
                });
                // 禁止选择，修复有时不能拖动的bug
                volumeRange[0].onselectstart = function(e) {
                    if (e.preventDefault) {
                        e.preventDefault();
                    }
                    return false;
                };
                // 切换静音
                $('#mute').click(function() {
                    var isMute = !player.getMute(),
                        that = $(this);
                    player.setMute(isMute);
                    if (isMute) {
                        that.addClass('ismute');
                        that.next().hide('slow');
                    } else {
                        that.removeClass('ismute');
                        that.next().show('slow');
                    }
                    eventCenter.trigger("log.logic", ["", "hasEverUsed"]);
                });
            };
            bindVolumnEvent();
        },
        // 加载功能，真正使用的参数只有curSong-(object)要加载的歌曲信息，isRefresh-(boolean)是否上一个操作是刷新
        load: function(curState, curSong, isRefresh) {
            var url = curSong["file_link"];
            // 当上一个操作不是刷新时才重置播放内核
            !isRefresh && player.reset();
            player.setUrl(url);
            eventCenter.trigger("mplog.logic", ['playend']);
        },
        // 播放功能
        play: function() {
            player.play();
        },
        // 暂停功能
        pause: function() {
            player.pause();
        },
        // 是否是初次播放（内核是否已经有歌曲url）
        isFirstPlay: function() {
            return !player.getUrl().length;
        },
        // 自定义事件
        customizeEvent: function() {
            var that = this;
            eventCenter
                .on("play.ui", function(e, curState, curSong, isRefresh, needToLoad) {
                    // 只有在需要load和初次播放时才做加载操作
                    if (needToLoad || that.isFirstPlay()) {
                        that.load(curState, curSong, isRefresh);
                    }
                    that.play();
                })
                .on("next.ui prev.ui", function(e, curState, curSong) {
                    that.load(curState, curSong);
                    that.play();
                })
                .on("pause.ui", function() {
                    that.pause();
                });
        },
        // 初始化入口
        init: function() {
            // 初始化播放核心，此处注意player必须是全局变量
            player = new PlayCore.PlayEngine({
                subEngines: [
                    /*{
                            constructorName : 'PlayEngine_Audio',
                            args :{}
                        },*/
                    {
                        constructorName: 'PlayEngine_FMP_MP3', //子内核构造函数名
                        args: {
                            swfPath: __uri('./swf/fmp.swf'),
                            instanceName: 'player' //当前实例名
                        }
                    }
                ]
            });
            player.init();
            this.volumn();
            this.customizeEvent();
            return this;
        }
    };
    // 整个模块的初始化入口
    sidePlayer.init();
});
