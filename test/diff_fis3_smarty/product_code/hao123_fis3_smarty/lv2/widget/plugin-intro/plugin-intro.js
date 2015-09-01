var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");

var initInstall= function(){
		var installBtn = $("#plugin-intro_btn"),
			isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null,
			installImg = installBtn.find("img");
		//chrome.app.isInstalled 为chrome 15+提供的私有接口  判断插件是否已经安装
		if(isChrome && chrome.app.isInstalled != null){
			if(chrome.app.isInstalled){
				forbiddenBtn();
			}else{
				installBtn.click(function(e){
					e.preventDefault();
					UT.send({
						type:'click',
						modId:'plugin-intro'
					});
					if(!/^http:\/\/ar/.test(window.location.href)) {
						window.open("https://chrome.google.com/webstore/detail/hao123-speed-dial/fmgknaemoiakmnafpgmbglmkdfagljpd");
						return false;
					}
					//chrome.webstore.install 为chrome 15+提供的私有接口  安装插件
					chrome.webstore.install(
						conf.pluginIntro.pluginUrl,
						 function(){
						 	forbiddenBtn();
						 }, 
						 function(data){
						 	alert(data);
						 }
					 );
				});
			}
			//禁用按钮
			function forbiddenBtn(){
				//接触默认绑定在按钮上的事件之后再取消a标签的默认行为
				installBtn.unbind("click").bind("click", function(e){
					e.preventDefault();
				});
				installImg.attr("src", conf.pluginIntro.introBtnImgAdded);
				installBtn.css("cursor" , "default");
			}
		}else{
			installBtn.click(function(){
				UT.send({
					type:'click',
					modId:'plugin-intro'
				});
			});
		}
	}
module.exports = initInstall;