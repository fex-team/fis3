( function sidebarVoteTips( $ ){
	var Time = require( "common:widget/ui/time/time.js" );
	Gl.time.getTime( function(){
		var sidebarVoteTips = $( "#sidebarVoteTips" ),
			toTimeStr = sidebarVoteTips.attr( "data-date" ),
			toTimeArr = toTimeStr.split( "," ),
			//倒计时到的那天
			toTime = + new Date( toTimeArr[0], toTimeArr[1]-1, toTimeArr[2]);
		setTimeout( function(){
			var nowTime = + Gl.serverNow || + new Date(),//+ new Date(),
				spaceTime = Math.ceil( ( toTime - nowTime ) / ( 1000 * 60 * 60 * 24 ) ),
				// 检测浏览器是否支持某css属性
				supports = (function() { 
					var div = document.createElement('div'), 
						vendors = 'Khtml O Moz Webkit'.split(' '), 
						len = vendors.length; 
					return function(prop) { 
						if ( prop in div.style ) return true; 
						if ('-ms-' + prop in div.style) return true; 
						prop = prop.replace(/^[a-z]/, function(val) { 
							return val.toUpperCase(); 
						}); 
						while(len--) { 
							if ( vendors[len] + prop in div.style ) { 
								return true; 
							} 
						} 
					return false; 
					}; 
				})(),
				isSupportAnimate = supports( "animation" ); 
			init();

			function init(){
				var preTimeArr = formatNumber( spaceTime + 1 )
					spaceTimeArr = formatNumber( spaceTime );
				// 如果支持css3的animation
				if( isSupportAnimate ){
					createClock( preTimeArr[0], preTimeArr[1] );
					flipClock(sidebarVoteTips.find(".flip")[0], spaceTimeArr[0], preTimeArr[0]);
					flipClock(sidebarVoteTips.find(".flip")[1], spaceTimeArr[1], preTimeArr[1]);
				// 不支持的情况
				}else{
					createClock( spaceTimeArr[0], spaceTimeArr[1] );
				}
			}
			function flipClock(el, to, from){
				el = $(el);
			    var fore = el.find(".fore")
			        , back = el.find(".back")
			        , foreText = fore.find(".inn")
			        , backText = back.find(".inn")
			        , oldText = foreText[0].innerHTML;
			    if(oldText == to) return;
			    from = from || oldText || "8";
			    backText.html(to);
			    el.parent().removeClass( "play" );
			    fore[0].className = "before back";
			    back[0].className = "active fore";
			    el.parent().addClass("play");
			}
			function createClock( from1, from2 ){
				var clockHtml = '<div class="filp-wrap">'
						        +   '<ul class="flip">'
						        +       '<li class="fore">'
						        +           '<a href="javascript:;" onclick="return false;">'
						        +               '<div class="up">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from1 + '</div>'
						        +               '</div>'
						        +               '<div class="down">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from1 + '</div>'
						        +               '</div>'
						        +           '</a>'
						        +       '</li>'
						        +       '<li class="back">'
						        +           '<a href="javascript:;" onclick="return false;">'
						        +               '<div class="up">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from1 + '</div>'
						        +               '</div>'
						        +               '<div class="down">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from1 + '</div>'
						        +               '</div>'
						        +           '</a>'
						        +       '</li>'
						        +   '</ul>'
						        +   '<ul class="flip">'
						        +       '<li class="fore">'
						        +           '<a href="javascript:;" onclick="return false;">'
						        +               '<div class="up">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from2 + '</div>'
						        +               '</div>'
						        +               '<div class="down">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from2 + '</div>'
						        +               '</div>'
						        +           '</a>'
						        +       '</li>'
						        +       '<li class="back">'
						        +           '<a href="javascript:;" onclick="return false;">'
						        +               '<div class="up">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from2 + '</div>'
						        +               '</div>'
						        +               '<div class="down">'
						        +                   '<div class="shadow"></div>'
						        +                   '<div class="inn">' + from2 + '</div>'
						        +               '</div>'
						        +           '</a>'
						        +       '</li>'
						        +   '</ul>'
						        + '</div>';
				sidebarVoteTips.prepend( clockHtml );
			}
			//保证数字时两位数,产出单个字符串的数组如：[0,9]
			function formatNumber( number ){
				var res = ( parseInt( number ) + 100 ).toString().split( "" );
				res = res.slice( 1, res.length );
				return res;
			}
		}, 1000 );	
	});
} )( jQuery );