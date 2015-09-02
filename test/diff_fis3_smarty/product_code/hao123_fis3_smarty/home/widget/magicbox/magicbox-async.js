var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
var helper = require('common:widget/ui/helper/helper.js');
require('common:widget/ui/jquery/jquery.cookie.js');
require("common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js");
var message = require("common:widget/ui/message/src/message.js");
var eventCenter = $({});
var MESSAGE_CHANNEL = "module.magicbox.trigger";

var MagicboxModel = {
    isFolded: 0,
    curIndex: 0,
    widgets: [],
    init: function(config){
        var that = this;
        that.isFolded = parseInt(config.isFolded,10) || 0;
        var lockWidget = $.cookie.get("lock");
        $.each(config.tabs, function(k, v) {
            v.isLoaded = 0;
            v.id === lockWidget && (that.lockIndex = k);
        });
        that.curIndex = that.lockIndex || 0;
        that.widgets = config.tabs;
        return that;
    },
    // change [isFolded] value
    setIsFolded: function(index){
        var that = this;
        that.isFolded = 1 - that.isFolded;
        eventCenter.trigger("isfoldedchange-data",[index]);
    },
    // change [isLoaded] value
    setIsLoaded: function(index){
        var that = this;
        that.widgets[index].isLoaded = 1;
        eventCenter.trigger("isloadedchange-data",[that.widgets[index].id]);
    },
    // change [curIndex] value
    setCurIndex: function(index,isInit){
        var that = this,
            isLock = (that.lockIndex === index),
            dataUnit = that.widgets[index];
        that.curIndex = index;
        eventCenter.trigger("curindexchange-data",[index,isInit,isLock,that.isFolded,dataUnit]);
    },
    // change [lock] value
    setLockOn: function(index){
        var that = this;
        that.lockIndex = index;
        var name = that.widgets[index].id;
        $.cookie.set("lock",name);
        eventCenter.trigger("lockonchange-data");
    },
    setLockOff: function(){
        this.lockIndex = null;
        $.cookie.del("lock");
        eventCenter.trigger("lockoffchange-data");
    }
};

var MagicboxController = {
    init: function(){
        var that = this;
        // bind events
        that._bindEvents();
        // init DataModel
        that.data = MagicboxModel.init(conf.magicBox);
        // init UI
        MagicboxView.init(that.data.curIndex,that.data.widgets,conf.magicBox.noticePop);
    },
    _initCore: function(index){
        var that = this,
            isInit = 1;
        if ($.belowthefoldCheck($(".magicbox-tab"),{container:window,threshold:0})) {
            that._switchWidget(index,isInit);
        }else{
            $(window).on("scroll.magicBox", function () {
                if($.belowthefoldCheck($(".magicbox-tab"),{container:window,threshold:0})) {
                    that._switchWidget(index,isInit);
                    $(window).off("load.magicBox");
                    $(window).off("scroll.magicBox");
                }
            });
            $(window).on("load.magicBox", function () {
                that._switchWidget(index,isInit);
                $(window).off("load.magicBox");
                $(window).off("scroll.magicBox");
            });
        }
    },
    _switchWidget: function(index,isInit){
        var data = this.data;
        if(!data.widgets[index].isLoaded && !(data.isFolded && isInit)){
            data.setIsLoaded(index);
        }
        data.setCurIndex(index,isInit);
    },
    _toggleWidget: function(index){
        this.data.setIsFolded(index);
    },
    _loadWidget: function(index){
        this.data.setIsLoaded(index);
    },
    _lockWidget: function(){
        var data = this.data;
        data.setLockOn(data.curIndex);
    },
    _unlockWidget: function(){
        this.data.setLockOff();
    },
    // trigger specified widget to init
    _initWidget: function(wid) {
        var that = this;
        // BigPipe.asyncLoad([{id: curTabId}],"home:widget/magicbox/magicbox.tpl");
        if (wid == "speedTest") {
            $(window).trigger("e_go.speed", [{messageChannel: MESSAGE_CHANNEL}]);
            // $(".speed-test_panel").css("height", "195px");
        } else {
            $(window).trigger("e_go." + wid, [{messageChannel: MESSAGE_CHANNEL}]);
        }
    },
    _bindEvents: function() {
        var that = this;
        eventCenter
        .on("init-ui",function(e,index){
            that._initCore(index);
        })
        .on("toggle-ui",function(e,index){
            that._toggleWidget(index);
        })
        .on("initwidget-ui",function(e,wid){
            that._initWidget(wid);
        })
        .on("load-ui",function(e,index){
            that._loadWidget(index);
        })
        .on("switch-ui",function(e,index){
            that._switchWidget(index);
        })
        .on("lock-ui",function(){
            that._lockWidget();
        })
        .on("unlock-ui",function(){
            that._unlockWidget();
        })
        .on("refresh-ui", function() {
            // 触发监听该信道的widget的refresh方法
            message.send(MESSAGE_CHANNEL, {type: "refresh"});
        });
    }
};

var MagicboxView = {
    init: function(index,data,noticePop){
        var that = this;
        that.dir = conf.dir;
        that.curIndex = index;
        that.container = $("#sideMagicBox");
        that.tabWrapper = that.container.find(".magicbox-tab");
        that.panels = that.container.find(".magicbox-panel");
        that.widgetTitle = that.container.find(".widget-title");
        that.collapseBtn = that.container.find(".collapse");
        that.lockBtn = that.container.find(".lock");
        that.refreshBtn = that.container.find(".refresh");
        that.tabs = data;
        that._renderTabs(index, data, noticePop);
        that._bindEvents();
        eventCenter.trigger("init-ui",[index]);
    },
    // update ui while switching widget
    _switch: function(index,isInit,isLock,isFolded,dataUnit) {
        var that = this;
        // update tabs
        that._updateTabs(index);
        // update title & buttons
        that._updateBar(index,isLock,dataUnit);
        // update content panels
        var isFolded = parseInt(isFolded,10);
        if(!(isFolded && isInit) && dataUnit.isLoaded){
            that._updatePanels(index,isFolded);
        }
        that.curIndex = index;
    },
    // update tabs while switching
    _updateTabs: function(index){
        var that = this;
        if (that.tabs.length <= 3) {
            var tabIndex = $(".mod-magicbox .nav-item[data-index="+index+"]").index();
            if(that.dir == "ltr"){
                conf.flowLayout ?
                    $(".arrow-up",that.tabWrapper).css("left",tabIndex*99) :
                    $(".arrow-up",that.tabWrapper).css("left",tabIndex*68+16);
                $(".nav-item-list",that.tabWrapper).css("left","0");
            }else{
                conf.flowLayout ?
                    $(".arrow-up",that.tabWrapper).css("left",(2-tabIndex)*99) :
                    $(".arrow-up",that.tabWrapper).css("left",(2-tabIndex)*68+16);
                $(".nav-item-list",that.tabWrapper).css("right","0");
            }
        }
    },
    // update lock button status while switching
    _updateLockBtn: function(isLock) {
        var that = this;
        if (isLock) {
            that.lockBtn.addClass("locked");
        } else {
            that.lockBtn.removeClass("locked");
        }
    },
    // update refresh button status while switching
    _updateRefreshBtn: function(isRefresh) {
        var that = this;
        if (isRefresh) {
            that.refreshBtn.show();
        } else {
            that.refreshBtn.hide();
        }
    },
    // update title & buttons while switching
    _updateBar: function(index,isLock,dataUnit){
        var that = this;
        that.widgetTitle.html(dataUnit.content);
        that._updateLockBtn(isLock);
        that._updateRefreshBtn(dataUnit.refresh);
    },
    // update content panels while switching
    _updatePanels: function(index,isFolded){
        var that = this;
        that.panels.hide();
        if(isFolded){
            eventCenter.trigger("toggle-ui",[index]);
        }else{
            that.panels.eq(index).show();
        }

    },
    // 切换curIndex指定的panel的显隐状态
    _togglePanel: function(index) {
        var that = this;
        var curPanel = that.panels.eq(index);
        if (curPanel.is(":visible")) {
            curPanel.slideUp(300,function() {
                that.collapseBtn.addClass("expand");
            });
        } else {
            curPanel.slideDown(300,function() {
                that.collapseBtn.removeClass("expand");
            });
        }
    },
    // init tabs
    _renderTabs: function(index, data, noticePop) {
        var that = this;
        // render tabs
        that.mbtab = new cycletabs.NavUI();
        that.mbtab.init({
            containerId: '.magicbox-tab',
            offset: 1,
            data: data,
            defaultId: data[index].id, //1
            navSize: 3,
            itemSize: conf.flowLayout ? 99 : 68,
            autoScroll: false,
            dir: that.dir,
            idKey: 'id', //用来指定返回的关键key
            showTitle: 1,
            completeLi: conf.flowLayout ? true : false
        });
        // add current pointer
        $(".ctrl", that.tabWrapper).append("<i class='arrow-up'><i class='triangle'></i></i>");
        // hide left & right arrows when is not needed
        if (that.tabs.length <= 3) {
            $(".ctrl p", that.tabWrapper).hide();
        }
        if(noticePop){
            that._createNoticePop();
        }
    },
    _createNoticePop: function(){
        var that = this;
        require.async(['common:widget/ui/notice-pop/notice-pop.js'],function(createNoticePop){
            that.bubble = new createNoticePop("popupMagicBox1",that.tabWrapper,{
                description:conf.magicBox.noticePop.description,
                style:"north",
                image:conf.magicBox.noticePop.image,
                position:{left:15, top:-58, right:15},
                arrow:{left:conf.magicBox.noticePop.arrowLeft || 81, right:conf.magicBox.noticePop.arrowRight || 14},
                showPeriod: conf.magicBox.noticePop.showPeriod || "",
                showEveryday: conf.magicBox.noticePop.showEveryday || ""
            });
        });
    },
    /*// close bubble when switching tabs
    _closeNoticePop: function(){
        var that = this;
        if($(".notice-pop",that.container).length){
            $(".cancel",that.container).trigger("e_closepop");
        }
    },*/
    _bindEvents: function() {
        var that = this;
        // dom event
        $(that.mbtab)
        .on("e_change", function(e,data){
            eventCenter.trigger("switch-ui",[data.index]);
            // close bubble when switching tabs
            that.bubble && that.bubble.close();
        })
        .on("e_toggle", function(e,data){
            eventCenter.trigger("toggle-ui",[data.index]);
        })
        .on("e_hover_nav", function(e,index){
            eventCenter.trigger("load-ui",[index]);
        })
        .on("e_click_nav", function(e,index){
            if(index != that.curIndex) {
                var dataId = that.tabs[index].id;
                UT.send({
                    ac:"b",
                    modId:(dataId=="bus")?"bustransfer":dataId.toLowerCase(),
                    position:"links",
                    sort:dataId
                });
            }
        })
        .on("e_click_prev e_click_next", function(){
            UT.send({
                ac:"b",
                modId:"magicBox",
                position:"switch"
            });
        });
        that.container
        .on("click", ".lock", function() {
            if(!$(this).hasClass("locked")){
                eventCenter.trigger("lock-ui");
                var dataId = that.tabs[that.curIndex].id;
                UT.send({
                    ac:"b",
                    modId:(dataId=="bus")?"bustransfer":dataId.toLowerCase(),
                    position:"lock"
                });
            }
        })
        .on("click", ".locked", function() {
            eventCenter.trigger("unlock-ui");
        })
        .on("click", ".refresh", function() {
            eventCenter.trigger("refresh-ui");
        })
        .on("click", ".collapse", function(){
            eventCenter.trigger("toggle-ui",[that.curIndex]);
        });
        // custom event
        eventCenter
        .on("isloadedchange-data",function(e,wid){
            eventCenter.trigger("initwidget-ui",[wid]);
        })
        .on("curindexchange-data",function(e,index,isInit,isLock,isFolded,dataUnit){
            that._switch(index,isInit,isLock,isFolded,dataUnit);
        })
        .on("isfoldedchange-data",function(e,index){
            that._togglePanel(index);
        })
        .on("lockonchange-data",function(){
            that.lockBtn.addClass("locked");
        })
        .on("lockoffchange-data",function(){
            that.lockBtn.removeClass("locked");
        });
        // for anchor bar use
        $(window).on('locate.magicbox' , function(e , modName){
            var i;
            for(i = 0 ; i < that.tabs.length ; i++){
                if(that.tabs[i].id.toLowerCase() === modName){
                    break;
                }
            }
            $(that.mbtab).trigger("e_change",{isInit: false, index: i, itemObj: this.tabs[i]});
            /*that.mbtab.switchTo(i);
            that.switchTo(i);*/
        });
    }
};

module.exports = MagicboxController;
