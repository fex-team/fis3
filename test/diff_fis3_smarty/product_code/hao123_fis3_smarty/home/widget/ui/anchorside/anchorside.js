var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
require('common:widget/ui/jquery/jquery.cookie.js');

//window.Gl || (window.Gl = {});
//back to top button
var anchorside = function () {
	var el = $(".mod-anchorside").find(".guid-item"),
		win = $(window),
		_conf = conf.anchorside,
		list = _conf.list;

	// send log for new-to-old homepage
	!function(){
		try {
			if(window.localStorage) {
				if(localStorage.getItem("homeSwitch") == "from-new") {
					UT.send({
					    type:"click",
					    ac:"b",
					    position:"switch-to-old",
					    modId:"anchorside"
					});
					localStorage.removeItem("homeSwitch");
				}
			}
		} catch(e) {
		}
	}();

	el.hover(
		function(){
			var $this = $(this),
				index = $this.index(),
				data = list[index],
				image = data.icon_hover_url?data.icon_hover_url:data.defaultIconHoverUrl;

			//isfold表示icon是否需要展开
			!data.isFold && $this.width(data.divWidth).find(".guid-description").show();
			$this.find("i").css("backgroundImage","url("+image+")");

		},
		function(){
			var $this = $(this),
				index = $this.index(),
				data = list[index],
				image = data.icon_url?data.icon_url:data.defaultIconUrl;
			!data.isFold && $this.width( data.size||46).find(".guid-description").hide();
			$this.find("i").css("backgroundImage","url("+image+")");

		}
	);
	el.on("click",function(){
		$(".g-area-lazyload").lazyload({triggerAll:true});

		var that = $( this ),
			curListOpt = list[that.index()],
			anthorMod = curListOpt.anthorMod,
			curPosTop = win.scrollTop();
		if(that.hasClass("gotonew")){
			//log request can not be sent successfully, it is canceled by the following reload action. so use localstorage instead.
			try {
				if(window.localStorage) {
					localStorage.setItem("homeSwitch", "from-old");
				}
			} catch(e) {
			}
			// 非普通链接类型，为抽样使用
			if(!that.hasClass("normallink")){
				$.cookie("sample_channel_flattest", null);
				setTimeout(function(){
					window.location.reload();
				},0);
			}
		}else if( !that.hasClass("backtop") ){
			// 如果有配置anthorMod字段（需要被定位的模块）
			if( anthorMod ){
				var $anchorMod = $( anthorMod ),
					paddingTop = 0,
					timer;
				// 判断需要需要给头部留出多少距离
				if( _conf.newHeader && _conf.isCeiling === "1" ){
					if( _conf.ceilingMore == "1" && !$( "body" ).hasClass( "header-fixed-up" ) ){
						paddingTop = parseInt( _conf.paddingTop1 ) || 140;
					}else{
						paddingTop = parseInt( _conf.paddingTop ) || 35;
					}
				}
				timer = setInterval( function(){
					if( !$anchorMod.length ){
						$anchorMod = $( anthorMod );
					}else{
						offsetTop = $anchorMod.offset().top;
						// win.scrollTop( offsetTop - paddingTop );
						scrollAnimate( offsetTop - paddingTop );
						clearInterval( timer );
					}
				}, 100 );
			}else{
				// win.scrollTop( 3000 );
				scrollAnimate( $( document ).height() );
			}

			UT.send({
			    type:"click",
			    ac:"b",
			    position:"bottom",
			    sort: that.attr( "data-type" ),
			    modId:"anchorside"
			});
		}
		else{
			scrollAnimate( 0 );
			// win.scrollTop(0);
			UT.send({
			    type:"click",
			    ac:"b",
			    position:"top",
			    modId:"anchorside"
			});
		}

		/**
		 * @param curPos{number} 当前滚动条距离顶端的距离
		 * @param toPos{number} 需要滚动的位置距离顶端的距离
		 */
		// function scrollAnimate( curPos, toPos ){
		// 	var timer,
		// 		times = curListOpt.scrollTime / 16,
		// 		step = ( toPos - curPos ) / times,
		// 		tempPos = curPos;

		// 	timer = setInterval( function(){
		// 		console.log( ~~(new Date()) );
		// 		times --;
		// 		tempPos += step;
		// 		win.scrollTop( tempPos );

		// 		if( times < 1 ){
		// 			win.scrollTop( toPos );
		// 			clearInterval( timer );
		// 		}

		// 	}, 16 );
		// }
		function scrollAnimate( toPos ){
			var scrollTime = parseInt( curListOpt.scrollTime );
			if( scrollTime ){
				$( "html, body" ).animate( {
					scrollTop : toPos + "px"
				}, scrollTime );
			}else{
				win.scrollTop( toPos );
			}
		};
	});

	$(window).on("scroll", function () {
		win.scrollTop()>=900?$(".backtop").css("display","block"):$(".backtop").css("display","none");
	});
}

module.exports = anchorside;
