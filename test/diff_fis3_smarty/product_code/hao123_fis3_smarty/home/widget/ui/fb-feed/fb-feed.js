var $ = require('common:widget/ui/jquery/jquery.js');
var helper = require('common:widget/ui/helper/helper.js');
var FBShare = function($el,opt){
    var that = this;
    that.btnFbShare = $el;
    that.canDraw = opt.supportDraw && opt.supportCanvas;
    that._init(opt);
};
var fn = FBShare.prototype;
fn._init = function(opt){
    var that = this;
    // 控制触发分享频率的标志位，只有为1时可以触发
    that.enableFbShare = 1;
    // loading icon
    that.loadingIcon = that.btnFbShare.siblings(".ui-o");
    that.opt = opt;
    // init share parameters
    that.shareOpt = opt.fbShare;
    that.urlPrefix = window.location.protocol+'//'+ conf.host;
    $.extend(true, that.shareOpt, {
        service: "facebook_feed",
        info: {
            app_id: conf.fbAppId,
            redirect_uri: that.urlPrefix+"/static/common/close.html",
            landing_uri: that.urlPrefix+"/static/common/landing.html"
        }
    });
    // default share image
    that.defaultImage = that.shareOpt.info.image;
    // 支持canvas的浏览器初始化canvas
    that.canDraw && that._initCanvas();

    require.async('common:widget/ui/sns-share/sns-share.js',function(snsShare){
        // 绑定分享
        that._bindShare();
    });
};
// init canvas
fn._initCanvas = function(){
    var that = this,
        draw = that.draw = {},
        canvasOpt = that.shareOpt.ui.canvas;
    draw.canvasWidth = parseInt(canvasOpt.width,10),
    draw.canvasHeight = parseInt(canvasOpt.height,10);
    draw.canvas = $("<canvas width='"+draw.canvasWidth+"' height='"+draw.canvasHeight+"'></canvas>")[0];
    draw.ctx = draw.canvas.getContext("2d");
    that.initComponent(draw);
};
// init components on canvas
fn.initComponent = function(draw){
    this.opt.callback.initComponent && this.opt.callback.initComponent.call(this,draw);
};
// draw result on canvas
fn.drawResult = function(draw,result){
    this.opt.callback.drawResult && this.opt.callback.drawResult.call(this,draw,result);
};
// 弹出facebook对话框 & 恢复分享按钮为可用状态
fn._startToShare = function(){
    var that = this,
        opt = that.opt;
    $.snsShare(that.shareOpt);
    if(that.canDraw){
        that.btnFbShare.removeClass(opt.disableClass);
        that.enableFbShare = 1;
        that.loadingIcon.hide();
    }
};
// 上传图片到图片服务器
fn._uploadImage = function(dataURL){
    var that = this;
    $.ajax({
        url: conf.uploadUrlPrefix,
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        progressData: false,
        data: {
            type: 1,
            appid: 1,
            data: dataURL.replace(/^[^,]*,/,"")
        }
    }).done(function(data){
        data = $.parseJSON(data);
        if(data.errno === 1){
            that.shareOpt.info.image = data.link;
        }
        that._startToShare();
    }).error(function(){
        that._startToShare();
    });
};
// 给share按钮绑定share事件
fn._bindShare = function(){
    var that = this,
        opt = that.opt,
        descTpl = that.shareOpt.info.description;
    that.btnFbShare.click(function(e) {
        if(that.enableFbShare){
            opt.callback.onClick && opt.callback.onClick.call(this);
            if(that.canDraw){
                var winWidth = 555
                    , winHeight = 382;
                that.shareOpt.ui.winHandle = window.open(that.shareOpt.info.landing_uri,"new","height="+ winHeight +",innerHeight="+ winHeight +",width="+ winWidth +",innerWidth="+ winWidth +",top="+(screen.height - winHeight) / 2+",left="+(screen.width - winWidth) / 2+",toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
                // 在当前分享窗口未弹出之前禁止再次触发分享
                that.enableFbShare = 0;
                // 按钮置灰
                that.btnFbShare.addClass(opt.disableClass);
                // 显示loading icon
                that.loadingIcon.css("display","inline-block");
            }

            // 测速结果数据
            var result = opt.data;
            // 设置分享默认图片
            that.shareOpt.info.image = (/^http/.test(that.shareOpt.info.image) ? "" : that.urlPrefix) + that.defaultImage;
            // 拼分享summary文案
            that.shareOpt.info.description = helper.replaceTpl(descTpl, result) || "";
            // 支持canvas，根据测速结果画图并上传到图片服务器
            if(that.canDraw){
                var draw = that.draw;
                that.drawResult(draw,result);
                that._uploadImage(draw.canvas.toDataURL("image/png"));
            // 不支持canvas，使用默认图片分享
            }else{
                that._startToShare();
            }
        }
        e.preventDefault();
    });
};
// jQuery plugin wraper
$.fn.extend({
    /**
     * plugin
     *
     * @param {Object} argument comment
     */
    bindFBShare: function(args) {
        return new FBShare(this, args);
    }
});
// module.exports = FBShare;
