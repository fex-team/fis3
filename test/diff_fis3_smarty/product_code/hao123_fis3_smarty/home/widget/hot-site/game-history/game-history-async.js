var $ = require("common:widget/ui/jquery/jquery.js");
var helper = require("common:widget/ui/helper/helper.js");
	window.Gl || (window.Gl = {});
	Gl.playHistory = {		
		init: function(pageType){
			//play history init
			var thisObj = this;
			//thisObj.history = $.parseJSON($.cookie("playHistory") || '{"list":[]}');
			thisObj.history = $.parseJSON($.cookie("playHistory") || '{"list":[{"name":"Medieval Biker","url":"http://www.papajogos.com.br/jogo/medieval-biker.html","imgSrc":"/static/web/br/img/nav_game/d9c690dd5c04d56b6db42951951ab696.jpg","date":"05-29"},{"name":"Euro Striker 2012","url":"http://clickjogos.uol.com.br/jogos/euro-striker-2012/ ","imgSrc":"/resource/br/img/game/home/0529Banner01.png","date":"05-29"}]}');
			thisObj.arrLength = thisObj.history.list.length;
			if(pageType == "index"){
				thisObj.entrance = $(".game-page");
				thisObj.hotLink = thisObj.entrance.find(".hotsite_link");
				if(thisObj.arrLength){
					thisObj.hotLink.find(".span-hot-name").append("<i class='triangle more_trigger'></i>");
				}				
			}
			thisObj.bindEvents(pageType);
		},
		updateCookie: function($this,event){
			var thisObj = this,
				newData = {},
				name = $.trim($this.find("[class$='name']").text()),
				url = $this.attr("href"),
				imgSrc = $this.find("img").attr("src"),
				d = new Date(),
				month = (d.getMonth()+1).toString(),
				day = d.getDate().toString(),
				date = (month.length>1?month:'0'+month)+"-"+(day.length>1?day:"0"+day),					
				isExisted = 0,
				oldIndex = -1;					
			newData={
				name: name,
				url: url,
				imgSrc: imgSrc,
				date: date
			};

			if(thisObj.arrLength){
				for(var i=0;i<thisObj.arrLength;i++){
					if(url == thisObj.history.list[i].url){
						isExisted = 1;
						oldIndex = i;
						break;
					}
				}
			}
			if(isExisted){
				thisObj.history.list.splice(oldIndex,1);
			}else if(thisObj.arrLength >= 6){
				thisObj.history.list.pop();					
			}
			thisObj.history.list.unshift(newData);
			thisObj.arrLength = thisObj.history.list.length;
			
			$.cookie("playHistory",$.toJSON(thisObj.history),{expires:2000, path: "/" });
			//event.preventDefault();//for debug use, will be removed after debugging
		},
		bindEvents: function(pageType){
			var thisObj = this;
			if(pageType == "index"){
				if(thisObj.arrLength){		
					$(".game-page").hover(
						function(){
							var outerHtml = "<ul class='more_links'>#{inner}</ul>",
								moreLinks = $(".game-page .more_links"),
								innerHtml = "",
								list = thisObj.history.list;
							
							for(var i=0;i<thisObj.arrLength;i++){
								innerHtml += "<li><a href='"+list[i].url+"' data-sort='hotsitemore' data-val='"+list[i].url+"' title='"+list[i].name+"'><img class='site-icon' src='/static/web/common/img/gut.gif' customsrc='"+list[i].imgSrc+"' onerror=this.src='/static/web/tw/img/defautlico.png';this.onerror=null;><span class='site-name'>"+list[i].name+"</span></a></li>";
							}
							innerHtml += "<li><a class='more' href='/games'>"+conf.moreText+"<i class='arrow_r'>›</i></a></li>"
							if(moreLinks.length){
								moreLinks.empty();
								moreLinks.append(innerHtml);
							}else{
								outerHtml = helper.replaceTpl(outerHtml,{inner: innerHtml});
								thisObj.hotLink.after(outerHtml);
							}						
						},
						function(){

						}
					);
					$(".game-page .more_links a[class!=more]").live("click",function(e){//console.log("add");
						thisObj.updateCookie($(this),e);
					});
				}
			}
		}
	};	
