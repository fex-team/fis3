var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
require("common:widget/ui/scrollable/scrollable.js");
require('common:widget/ui/jquery/widget/jquery.placeholder/jquery.placeholder.js');

// config = {
// 	"modId": "sidebarMothersday",
// 	"ano": "<%$body.sidebarMothersday.ano%>",
// 	"emailTemplateId": "<%$body.sidebarMothersday.emailTemplateId%>",
// 	"facebook": <%json_encode($body.sidebarMothersday.facebook)%>,
// 	"success": "<%$body.sidebarMothersday.successText%>",
// 	"failure": "<%$body.sidebarMothersday.failureText%>",
// };

function mama(config){
	var $mod = $("#" + config.modId);
	var ano = config.ano;
	
	//成功和失败的文案
	var success = config.success;
	var failure = config.failure;
	
	//facebook分享
	var facebook = config.facebook;
	var fbFeed = "https://www.facebook.com/dialog/feed?redirect_uri=https://www.facebook.com";
	var app_id = conf.fbAppId;
	var link   = encodeURIComponent(facebook.link);
	var name   = encodeURIComponent(facebook.title);
	var description = encodeURIComponent(facebook.summary);
	var fbUrl = fbFeed + "&app_id=" + app_id + "&link=" + link + "&name=" + name + "&description=" + description;

	//邮件面板各个input
	var $card = $mod.find(".medium-card img");
	var $sendTo = $mod.find(".send-to");
	var $sendFrom = $mod.find(".send-from");
	var $moreMessage = $mod.find(".other-message");
	var $emailError = $mod.find(".email-error");

	//两个面板
	var $cardPanel = $mod.find(".card-panel");
	var $emailPanel = $mod.find(".email-panel");

	//邮件发送结果文案
	var $successResult = $mod.find(".success");
	var $failureResult = $mod.find(".failure");

	var tipTimer; //邮件结果浮层定时
	var sendEmailTimer; //邮件过期定时

	var currentImg;

	//placeholder句柄
	var sendToPH;
	var sendFromPH;
	var moreMessagePH;

	var obj = {
		//初始化函数
		"init": function(){
			var self = this;
			//滚动条通用组件
			$mod.find(".list-inner").scrollable({
				"autoHide": false,
			});

			//palceholder
			sendToPH = $sendTo.placeholder();
			sendFromPH = $sendFrom.placeholder();
			moreMessagePH = $moreMessage.placeholder();

			this.bindEvent();

			//请求各个卡片的分享次数
			this.requestShareTimes(this.getAllImgId() , "get" , function(data){
				self.updateShareTimes(data);
			});
		},

		//更新每张图片的分享次数
		"updateShareTimes": function(data){
			var imgId;
			for(imgId in data){
				$mod.find("[data-imgId=\"" + imgId + "\"]").find(".num-text").html(data[imgId]);
			}
		},

		//获取所有图片的id
		"getAllImgId": function(){
			var idList = "";
			$mod.find(".item-wrapper").each(function(index){
				idList = idList + this.getAttribute("data-imgId") + "|";
			});
			return idList;
		},

		"bindEvent": function(){
			var self = this;
			$mod.find(".list-outer").on("hover" , ".item-wrapper" , function(e){
				self.expandItem(this , e.type);
			});

			$mod.find(".item-wrapper").on("click" , function(e){
				var t = $(e.target);
				if(t.hasClass("fb-btn")){
					UT.send({type:'click', modId:'mothersday', position: "facebook"});
					self.facebookShare(this);
				}else if(t.hasClass("email-btn")){
					UT.send({type:'click', modId:'mothersday', position: "email"});
					self.showEmailPanel(this);
				}
			});

			$mod.find(".more-link").on("click" , function(){
				UT.send({type:'click', modId:'mothersday', position: "more_link"});
			});

			$mod.find(".send-btn").on("click" , function(){
				UT.send({type:'click', modId:'mothersday', position: "send_btn"});
				if(!self.validateEmail()){ return; }
				var sendTo = $sendTo.val().trim();
				var message = $moreMessage.val().trim();
				var sendFrom = $sendFrom.val().trim();
				self.sendEmail(sendTo , message , sendFrom , function(){
					self.showSendResult(success , function(){
						self.hideEmailPanel();
					});
				} , function(){
					self.showSendResult(failure);
				});
			});

			$sendTo.change(function(){
				self.validateEmail();
			});

			$mod.find(".input-g").on("click" , function(){
				UT.send({type:'click', modId:'mothersday', position: "input"});
			});

			$mod.find(".back-btn").on("click" , function(){
				UT.send({type:'click', modId:'mothersday', position: "back_btn"});
				self.hideEmailPanel();
			});
		},

		//验证邮箱，仅验证是否包含@符号
		"validateEmail": function(){
			if($sendTo.val().search("@") !== -1){
				$emailError.hide();
				return true;
			}else{
				$emailError.show();
				return false;
			}
		},

		/**
		 * fb分享
		 * @param  {element} elem 图片dom
		 */
		"facebookShare": function(elem){
			var arr = this.getImageInfo(elem);
			var largeImg = arr[1] + "-l" + arr[2];
			var self = this;
			self.requestShareTimes($(elem).attr("data-imgId") , "increase" , function(data){
				self.updateShareTimes(data);
			});
			window.open(fbUrl + "&picture=" + encodeURIComponent(largeImg));
		},

		//获取图片信息
		"getImageInfo": function(elem){
			var $elem = $(elem);
			var smallImg = $elem.find('.card')[0].src;
			var arr = smallImg.match(/^(\S+)(\.[^\.]{3,5})$/i);
			return arr;
		},

		/**
		 * hover动画
		 * @param  {element} elem 
		 * @param  {string}  type mouseleave|mouseenter
		 */
		"expandItem": function(elem , type){
			var $elem = $(elem);
			if(type === "mouseleave"){
				$elem.addClass("item-leave");
				$elem.find(".card-text").addClass("text-overflow-block");
			}else{
				$elem.removeClass("item-leave");
				$elem.find(".card-text").removeClass("text-overflow-block");
			}
		},

		//展现email面板
		"showEmailPanel": function(elem){
			var arr = this.getImageInfo(elem);
			var mediumImg = arr[1] + "-m" + arr[2];
			currentImg = arr[1] + "-l" + arr[2];
			$card[0].src = mediumImg;
			$emailPanel.fadeIn(300 , function(){
				$cardPanel.hide();
			});
		},

		//隐藏email面板
		"hideEmailPanel": function(){
			var self = this;
			$cardPanel.show();
			$emailPanel.fadeOut(300 , function(){
				self.resetInput();
			});
		},

		//重置email面板
		"resetInput": function(){
			$sendTo.val("");
			$sendFrom.val("");
			$moreMessage.val("");
			sendToPH.reset();
			sendFromPH.reset();
			moreMessagePH.reset();
			$emailError.hide();
			$card[0].src = "";
		},

		/**
		 * 请求分享次数接口
		 * @param  {string}   key      图片id
		 * @param  {string}   type     get|increase
		 * @param  {Function} callback 回调函数
		 */
		"requestShareTimes": function(key , type , callback){
			$.ajax({
				"url": conf.apiUrlPrefix,
				"dataType":"jsonp",
				"jsonp":"jsonp",
				"data": {
					"app": "statistics",
					"act": "shareCount",
					"ano": ano,
					"type": type,
					"key": key,
					"country": conf.country,
				},
			}).done(function(data){
				if(data && data.content && data.content.result){
					callback && callback(data.content.result);
				}
			});
		},

		/**
		 * 发送邮件
		 * @param  {string} sendTo      
		 * @param  {string} message     
		 * @param  {string} sendFrom    
		 * @param  {function} doneHandler 
		 * @param  {function} failHandler 
		 */
		"sendEmail": function(sendTo , message , sendFrom , doneHandler , failHandler){
			sendEmailTimer = setTimeout(function(){
				failHandler && failHandler();
			} , 5000);//5s过期

			var arr = [{
						"template_id": config.emailTemplateId,
						"to": sendTo,
						"message": message || "",
						"sender": sendFrom || "",
						"imgsrc": currentImg,
						}];
			$.ajax({
				"url": conf.apiUrlPrefix + "?email_info=" + JSON.stringify(arr),
				"dataType":"jsonp",
				"jsonp":"jsonp",
				"data": {
					"app": "mail",
					"act": "set",
					"ano": ano,
					"country": conf.country,
				},
			}).done(function(data){
				clearTimeout(sendEmailTimer);
				if(!data || !data.content || !data.content.result){
					failHandler && failHandler();
				}else{
					doneHandler && doneHandler(data);
				}
			});
		},

		//显示发送结果浮层，2s后自动隐藏
		"showSendResult": function(info , callback){
			var $tip = $mod.find(".send-result");
			if($tip.length > 0){
				$tip.remove();
				clearTimeout(tipTimer);
			}
			$tip = $("<div class=\"send-result\"><span class=\"present\"></span> <p class=\"info\"></p> </div>");
			$tip.appendTo($emailPanel).find(".info").html(info);
			$tip.fadeIn(200);
			tipTimer = setTimeout(function(){
				$tip.fadeOut(200 , function(){
					$tip.remove();
					callback && callback();
				});
			} , 2000);
		},
	};

	obj.init();

	return obj;
	
}

module.exports = mama;

