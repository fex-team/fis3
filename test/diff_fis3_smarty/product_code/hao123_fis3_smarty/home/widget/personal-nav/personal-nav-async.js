var $ = jQuery = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var helper = require("common:widget/ui/helper/helper.js");
var hex_md5 = require('common:widget/ui/md5/md5.js');
require("common:widget/ui/jquery/widget/jquery.ui.tip/jquery.ui.tip.js");
require("common:widget/ui/jquery/widget/jquery.ui.button/jquery.ui.button.js");


!function(){
	var _conf = conf.personalNav, 
		defaultIcon = "'"+_conf.defaultIcon+"'",
		websiteLiTpl =  '<li class="websites-item">'
						+'	<a class="websites-link" href="#{url}">'
						+'		<img class="websites-icon" src="#{src}" onerror="this.src='+defaultIcon+';this.onerror=null;" />'
						+'		<span class="websites-name">#{name}</span>'
						+'	</a>'	
						+'</li>',
		nav = $(".mod-personal-nav"),
		ul = nav.find(".websites"),
		emptyIcon = $(".empty-icon");

	/**
	 * 取得网址列表
	 */
	 function getWebsites(){
	 	var params = "?app=recomlink&act=contents&num=5&vk=0&country=" + conf.country;

	 	$.ajax({
	 		url : conf.apiUrlPrefix + params,
	 		dataType : "jsonp",
	 		jsonp : "jsonp",
	 		jsonpCallback : "ghao123_" + hex_md5(params,16),
	 		success : function ( result ) {
	 			if( result.content.data.length ){
	 				nav.find(".emptyTip").hide();
	 				emptyIcon.addClass("ib");
					renderWebsites( result.content.data );
	 			}  			
	 		}
	 	});
		
	 }

	 /**
	 * 清空网址列表
	 */
	 function emptyWebsites(){
	 	var params = "?app=recomlink&act=clear&vk=0&country=" + conf.country;

	 	$.ajax({
	 		url : conf.apiUrlPrefix + params,
	 		dataType : "jsonp",
	 		jsonp : "jsonp",
	 		jsonpCallback : "ghao123_" + hex_md5(params,16),
	 		success : function(){
	 			UT.send({
	 				modId : "personal-nav",
	 				position : "delete",
	 				type : "click",
	 				ac : "b"
	 			});
	 		}

	 	});
	 }	

	/**
	 * 生成网址列表
	 * @param {array} webList 网址列表
	 * @webList {string} url 网站网址
	 * @webList {string} name 网站名称
	 */
	function renderWebsites(webList){
		var len = 5,
			list = "";

		//防止返回的数据超长	
		len = Math.min( webList.length,len );
		for (var i = 0; i < len; i++) {
			var data = webList[i],
				favIcon = getFavIconUrl( data.url );
			
			list = list + helper.replaceTpl(websiteLiTpl,{"url" : data.url,"src" : favIcon,"name" : data.title});	
		};
		ul.append(list);
	}

	/**
	 * 获取最爱网址的小图标，与自定义网址的功能一致
	 * @param {string} url 需要取得图标的网址
	 * @return {string} icon地址
	 */
	function getFavIconUrl(url){
        prohost = url.match(/([^:\/?#]+:\/\/)?([^\/@:]+)/i);
        prohost = prohost ?  prohost : [true,"http://",document.location.hostname];
        //抓取ico
        return  prohost[1] + prohost[2]  + "/favicon.ico";
	}

	/**
	 * 创建删除提示弹窗
	 */
	function renderDeleteTip(){
		var tipConfig = {
				closeOnEscape: false,
	            id : "personalNavDeleteTip",
	            defaultPosition:"bottom",
	            buttons:{
	            	"OK" : {
	            		text : _conf.okTip,
	            		click : function(){
	            			emptyIcon.removeClass("ib");
							ul.hide();
							nav.find(".emptyTip").show();
							$(this).tip("close");
							emptyWebsites();
					 		
	            		},
	            		addClass: "mod-btn_normal"
	            	},
	            	"Cancel" : {
	            		text : _conf.cancelTip,
	            		click : function(){
	            			$(this).tip("close");
	            			UT.send({
				 				modId : "personal-nav",
				 				position : "cancelDelete",
				 				type : "click",
				 				ac : "b"
				 			});
	            		},
	            		addClass: "mod-btn_cancel"
	            	}
	            }
			};

		$('<div id="personalNavTip">'+ _conf.emptyTip + '</div>').tip(tipConfig);
        $(".ui-tip a").button();	
	} 


	/**
	 * 绑定事件
	 */
	function bindEvents(){
		var deleteTip = $("#personalNavTip");

		//清空网址列表
		emptyIcon.on("click",function(){
			var tar = $(this);
			
			//关闭其它的弹窗 如果有的话
			deleteTip.tip("close");
			//打开弹窗
			deleteTip.tip({autoOpen:"open",ativeObj:tar});
			UT.send({
 				modId : "personal-nav",
 				position : "empty",
 				type : "click",
 				ac : "b"
 			});

		});

		//点击页面的其它区域时关闭删除提示
		$(document).on("mousedown",function(e){
			var target = $( e.target ),
				tipWidget = deleteTip.tip("widget"),
                isCloseTip =  tipWidget.is(":visible") && !target.hasClass("empty-icon") && !target.closest(tipWidget).length;

            isCloseTip && deleteTip.tip("close");    

		});
	}

	/**
	 * 初始化
	 * 获取网址列表
	 * 初始化删除提示组件
	 * 绑定事件
	 */
	function init(){
		getWebsites();
		renderDeleteTip();
		bindEvents();
	}

	init();	
}();

