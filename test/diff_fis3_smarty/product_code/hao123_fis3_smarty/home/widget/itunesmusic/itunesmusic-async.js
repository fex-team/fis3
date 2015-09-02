var $ = require('common:widget/ui/jquery/jquery.js'),
	scrollable = require( 'common:widget/ui/scrollable/scrollable.js' ),
	swfobject = require("home:widget/ui/swfobject/swfobject.js"),
	// hex_md5 = require('home:widget/ui/md5/md5.js'),
	helper = require( 'common:widget/ui/helper/helper.js' ),
	UT = require('common:widget/ui/ut/ut.js');
	
var myPlayer;

window.onYouTubePlayerReady = function(){
	myPlayer = document.getElementById("myytplayer");	
	if(myPlayer){
		myPlayer.playVideoAt(0);
	}
}

function play(){
	if(myPlayer){
		myPlayer.playVideo();
	}
}

function stop(){
	if(myPlayer){
		myPlayer.stopVideo();
	}
}

function pause(){
	if(myPlayer){
		myPlayer.pauseVideo();
	}
}


var iTunesMusic = function(){
	var that = this;
    that.init();
};
var scrollbar;
iTunesMusic.prototype = {
	init: function(){
		var that = this;
		that.modWrap = $("#sideiTunesMusic");
		// 初始化tab切换
		that._initTab();

		// 异步获取数据渲染模板
		that.itemTpl = ['<div class="box rank-unit">',
							'<div class="media">',
								'<a href="#{url}" target="_blank" class="rank-photo rank-ut">',
									'<i class="ic-rank">#{rank}</i>',
									'<img src="#{img}" class="rank-img">',
									'<span class="rank-price#{showprice}">#{priceIcon}#{price}</span>',
								'</a>',
							'</div>',
							'<div class="content">',
								'<a href="#{url}" target="_blank" class="rank-title rank-ut">#{trackName}</a>',
								'<span class="rank-artist info-font">#{artistName}</span>',
								'<span class="rank-time info-font">#{date}</span>',
								'<div class="btn-wrap on">',
									'<a href="" class="action-btn" data-name="#{trackName}" data-status="play"><i></i>#{playText}</a>',
									'<a href="#{url}" target="_blank" class="store-btn rank-ut">#{itunesText}</a>',
								'</div>',
							'</div>',
						'</div>'].join('');

		// 初始化第一个tab数据
		var	initObj = that.modWrap.find(".im-tabContent li")[0];
		that._ajaxTabData($(initObj), 1);

	},
	_initTab: function(){
		var that = this,
			modWrap = that.modWrap,
			$tabControlEles = modWrap.find(".im-tabControl li");

		$tabControlEles.on('click',function(e){
			e.preventDefault();
			that._tabAction($(this));
			//切换tab默认scroll从头
			var scrollFlag = modWrap.find('.mod-scroll');
			if (scrollFlag.length) {
				that._scrollToTop(0);
			}
			scrollDelta = 0;
		});
	},
	_tabAction: function(obj){
		var that = this,
			modWrap = that.modWrap,
			itemTpl = that.itemTpl,
			$tabItem = modWrap.find(".im-tabControl a"),
			$contentItem = modWrap.find(".im-tabContent li"),
			index = obj.data("track"),
			$curContent = $contentItem.eq(index),
			tabUtName = index ? 'en' : 'jp';

		//tab切换
		$tabItem.removeClass("current").eq(index).addClass("current");
		$contentItem.hide();
		$curContent.show();
		that._ajaxTabData($curContent,index+1);

		that._sendUt({"position":"tab","sort":tabUtName});
	},
	_ajaxTabData: function($dataWrap, tabIndex){
		var that = this,
			modWrap = that.modWrap,
			itemTpl = that.itemTpl;
		if(!$dataWrap.find(".rank-unit").length){
			var params = "?app=itunes&act=contents&country=jp&type=" + tabIndex + "&num=10&vk=1";
			$.ajax({
			    // url: 'http://api.ghk.hao123.com:8088/api.php' + params,
			    url: conf.apiUrlPrefix + params,
			    dataType: "jsonp",
			    jsonp: "jsonp",
    			cache: false,
			    success: function(data) {
					if(data.content && data.content.data){
						that._renderData($dataWrap,data.content.data,tabIndex);
					}
			    }
			});
		}
	},
	_renderData: function($tabCon, data, _idx){
		var that = this,
			modWrap = that.modWrap,
			itemTpl = that.itemTpl,
			_scroll = modWrap.find('.mod-scroll'),
			length = data.length,
			html = "",
			showprices = conf.itunes.tabItems[_idx-1].showPrice.split('|');
		for( var i=0; i<length; i++ ){
			$.extend( data[i], { 
				"rank": i+1, 
				"priceIcon": conf.itunes.priceIcon, 
				"showprice": showprices[i], 
				"playText": conf.itunes.playText,
				"itunesText": conf.itunes.itunesText 
			} );
			data[i].date = that._formatTime(data[i].date);
			html += helper.replaceTpl(itemTpl, data[i]);
		}
		$tabCon.append(html);

		if (!_scroll.length) {
			that._initScroll();
		}
		that._initPlayer($tabCon);
		var $rankUt = modWrap.find('.rank-ut');
		that._sendUt({"position":"song","sort":"buy"}, $rankUt, 'click');
	},
	_sendUt: function(obj, ele, _event){
		var utObj = {
			"type": "click",
			"modId": "itunes-music"
		};
		$.extend( utObj, obj );
		
		if(!ele || !_event){
			UT.send(utObj);
		}else{
			ele.on(_event, function(){
				UT.send(utObj);
			});
		}
	},
	_initScroll: function(){
		var that = this,
			modWrap = that.modWrap,
			$curList = modWrap.find(".im-tabContent");
		scrollbar = $curList.scrollable({
			autoHide: true
			// ,onScroll: function(){scrollDelta = this.state.y;}
		});
		// that._scrollToTop(0);
	},
	_initPlayer: function($tabEl){ 
		// 嵌入ybflash
		var that = this,
			modWrap = that.modWrap,
			$playBtn = $('.action-btn',$tabEl);

		$playBtn.on('click', function(e){
			e.preventDefault();
			var trackName = $(this).data('name'),
				btnStatus = $(this).attr('data-status'),
				$unitWrap = $(this).parent().parent().parent(),
				alreadyPlay = $unitWrap.next().hasClass('video-wrap');

			that._sendUt({"position":"button","sort":btnStatus});
			if (btnStatus == 'play') {
				// 点击播放
				if (!alreadyPlay) {
					// 该节点没有播放过
					var $videoWrap = modWrap.find('#video-wrap');
					if ($videoWrap.length > 0) {
						//其他节点播放过，删除播放过节点
						var playedBtn = $('.action-btn', $videoWrap.prev());
						that._btnAciton(playedBtn,'stop');
						//删除节点
						$videoWrap.remove();
					}

					that._createObject($unitWrap,trackName);

				}else{
					//该节点播放过
					$unitWrap.next().css({
						'height':'200px',
						'margin-left': '0px'
					});
					// $unitWrap.next().show();
					play();
				}

			}else{

				$unitWrap.next().css({
					'height':'0px',
					'margin-left': '-999999px'
				});
				// $unitWrap.next().hide();
				pause();
			}

			// 改变按钮状态
			that._btnAciton($(this),btnStatus);
		});

	},
	_btnAciton: function(_btn, _text){
		var _html;
		if (_text == 'play') {
			_html = '<i></i>' + conf.itunes.stopText;
			_btn.html(_html).attr('data-status','stop');
			_btn.parent().addClass('off').removeClass('on');
		}else{
			_html = '<i></i>' + conf.itunes.playText;
			_btn.html(_html).attr('data-status','play');
			_btn.parent().addClass('on').removeClass('off');
		}
	},
	_createObject: function(ele, searchName){
		//插入节点
		var tpl = '<div id="video-wrap" class="video-wrap"><i></i><div id="ytapiplayer"></div></div>';
		ele.after(tpl);
		//创建flash
		var params = { 
			allowScriptAccess: "always",
			allowFullScreen:true,
			bgcolor:"#000000" 
		};
		var atts = { id: "myytplayer" };
		swfobject.embedSWF("https://www.youtube.com/v/videoseries?version=3&listType=search&list="+ searchName +"&enablejsapi=1&playerapiid=myytflashplayer", 
           "ytapiplayer", "300", "200", "8", null, null, params, atts);

	},
	_scrollToTop: function(data){
		var that = this;
		scrollbar.goTo({y:data});
	},
	_formatTime: function(time){
		var _str='';
		if (time) {
			var date = new Date(time),
				month = date.getMonth() + 1;
			_str = date.getFullYear() + '年' + month + '月' + date.getDate() + '日';
		}
		return _str;
	}
	// ,
	// _adjustScroll: function(ele){
	// 	var that = this,
	// 		modWrap = that.modWrap,
	// 		num = ~~ele.data('track');

	// 	var tt = ele.position().top,
	// 		_top = 435 - tt - 109,
	// 		_dis = num * 109;

	// 	if (_top < 200) {
	// 		that._scrollToTop( -Number(_dis) );
	// 	}
	// }
	//
};
module.exports = iTunesMusic;
