/*
	var addthis_config =
	{
	   ui_use_css: false
	};
	var addthis_share = 
	{ 
	    templates: {
	                   twitter: 'twitter:check out {{url}} (from {{title}})-{{html}} ',
	               }
	}*/


var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var conf = window.conf;

var snsShare = {
	data: conf.snsShare,
	containterTpl: "<div class='snsshare_box snsshare_box_ltr' id='snsShareBox' log-mod='sns'><div id='snsShareBtn'><i class='snsshare_icon'></i>"+ (conf.snsShare.shareWord ? conf.snsShare.shareWord : "share") + "</div><div id='snsShareList'>#{innertpl}</div></div>",
	shareItemTpl: "<a class='snsshare_icon snsshare_button_#{index}' href='#{customurl}' data-sort='sns' data-val='#{sharetype}'></a>",
	init: function(){
		this.html(this.data);
		this.bindEvents(this.data);
	},
	html: function(data){
		var shareUrl = encodeURIComponent(window.location.href),
			shareImg = encodeURIComponent(window.location.protocol+'//'+window.location.host+data.content.logoSrc),
			shareTitle = encodeURIComponent(data.content.title),
			shareDesc = encodeURIComponent(data.content.description),
			list = data.list,				
			type = "",
			customUrl = "",
			defaultUrl = "",
			listHtml = "";
		for(var i = 0; i < list.length; i++){
			type = encodeURIComponent(list[i].name);
			defaultUrl = "http://api.addthis.com/oexchange/0.8/forward/"+type+"/offer?url="+shareUrl;
			if(list[i].customUrl){					
				customUrl = list[i].customUrl.replace(/(#{shareurl}|#{sharetitle}|#{sharedesc}|#{shareimg})/g, function($0, $1) {
							    return {
							        "#{shareurl}": shareUrl,
							        "#{sharetitle}": shareTitle,
							        "#{sharedesc}": shareDesc,
							        "#{shareimg}": shareImg
							    }[$1];
							});
			}else{
				customUrl = defaultUrl;
			}
			if(list[i].name == "facebook"){
				customUrl = "###";
			}
			listHtml += this.shareItemTpl.replace(/(#{index}|#{customurl}|#{sharetype})/g, function($0, $1) {
			    return {
			        "#{index}": list[i].className||i+1,
			        "#{customurl}": customUrl,
			        "#{sharetype}": type
			    }[$1];
			});						
		}			

		// alert(this.containterTpl.replace(/#{innertpl}/g,listHtml));

		$(document.body).append(this.containterTpl.replace(/#{innertpl}/g,listHtml));
		$("#snsShareList").children().last().css("margin-bottom", "8px");
	},
	bindEvents: function(data){
		$("#snsShareBox a").click(function(event){
			var windowWidth = 600,
			windowHeight = 330,
			top = (window.screen.height - windowHeight) / 2,
			left = (window.screen.width - windowWidth) / 2,
			tar = event.target,
			val = $(tar).attr("data-val");

			UT && UT.send({"type": "click", "position": "sns", "sort": val,"modId":"sns"});

			if($(this).hasClass("snsshare_button_fb")){
				FB.ui({
		            method: "feed",
		            name: data.content.title,		            
		            link: window.location.href,
		            picture: window.location.protocol+'//'+window.location.host+data.content.logoSrc,
		            description: data.content.description
		        }, function(response) {
		            
		        });
		        return false;
			}

			window.open($(this).attr("href"),"","width="+windowWidth+",height="+windowHeight+",top="+top+",left="+left+",location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
			return false;
		});

		$("#snsShareBtn").mouseenter(function(){
			$(this).css("backgroundColor", "#BFCFE2");

			var el          = $('#snsShareList'),
			    curHeight   = el.height(),
			    autoHeight  = el.css('height', 'auto').height();
			el.height(curHeight).animate({height: autoHeight}, {queue:false,duration:300});
		});

		$("#snsShareBox").mouseleave(function(){
			$("#snsShareBtn").css("backgroundColor", "#D4DCE6");
			$("#snsShareList").animate({height: "0px"}, {queue:false,duration:300});
		});
	}
};

module.exports = snsShare;