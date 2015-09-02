( function( win ){
	var $ = require( "common:widget/ui/jquery/jquery.js" ),
		UT = require( "common:widget/ui/ut/ut.js" ),
		helper = require( "common:widget/ui/helper/helper.js" ),
		cycletabs = require("common:widget/ui/cycletabs/cycletabs.js"),



		sortAreaApp = function(){
			var opt = conf.sortAreaApp,
				id = opt.id,
				mod = $( "#" + id ),

				data = conf.sortArea.data.content.data,
				/* banner轮播区*/
				initCarousel = function(){
					var carouselOpt = opt.carousel,
						carouselMod = mod.find( ".carousel" ),
						contentMod = carouselMod.find( ".carousel-content" ),
						itemsMod = contentMod.find( "ul" ),
						leftBtn = contentMod.find( ".left" ),
						rightBtn = contentMod.find( ".right" ),
						leftItem = contentMod.find( ".leftItem" ),
						rightItem = contentMod.find( ".rightItem" ),
						itemsData = carouselOpt.items,
						length = itemsData.length,
						formatedData = [],
						left1 = "-738px",
						left2 = "-308px",
						itemTpl = 		'<li class="carousel-list">'
									+		'<a href="#{link}" data-sort="carouse">'
									+			'<img src="#{imgSrc}" title="#{title}" alt="#{title}" />'
									+		'</a>'
									+	'</li>',
						itemsStr = '<ul class="cf">',
						timer, isSliding;

					init();
					function init(){
						carouselMod.find( "h2" ).text( carouselOpt.title );
						render();
						bindEvent();
						autoSlide();
					}
					function render(){
						for( var i=0; i<3; i++ ){
							var curData = itemsData[i];
							itemsStr += helper.replaceTpl( itemTpl, itemsData[i] );
						}
						itemsStr += '</ul>';
						contentMod.append( itemsStr );
					}
					function slide( dir ){
						if( isSliding ) return;
						isSliding = true;
						var tmp;
						itemsMod = contentMod.find( "ul" );
						if( dir == "right" ){
							tmp = itemsData.shift();
							itemsData = itemsData.concat( tmp );
							itemsMod.append( helper.replaceTpl( itemTpl, itemsData[2] ) );
						}else{
							itemsMod.css( "left", left1 );
							itemsMod.prepend( helper.replaceTpl( itemTpl, itemsData[length-1] ) );
							tmp = itemsData.pop();
							itemsData = [tmp].concat( itemsData );
						}
						itemsMod.animate( {
							left : dir == "right" ? left1 : left2
						}, parseInt( carouselOpt.scrollDuration ) || 500, function(){
							if( dir == "right" ){
								itemsMod.find( "li:eq(0)" ).remove();
								itemsMod.css( "left", left2 );
							}else{
								itemsMod.find( "li:eq(3)" ).remove();
							}
							isSliding = false;
						} );
					}
					function autoSlide(){
						if( !timer ){
							timer = setInterval( function(){
								slide( carouselOpt.autoScrollDirection || "right");
							}, parseInt( carouselOpt.autoDuration ) || 3000 );
						}
					}
					function stopAutoSlide(){
						clearInterval( timer );
						timer = null;
					}
					function bindEvent(){
						leftBtn.on( "click", function(){
							slide( "left" );
						} );
						leftItem.on( "click", function(){
							slide( "left" );
						} );
						rightBtn.on( "click", function(){
							slide( "right" );
						} );
						rightItem.on( "click", function(){
							slide( "right" );
						} );
						contentMod.on( "mouseenter", function(){
							stopAutoSlide();
						} )
						.on( "mouseleave", function(){
							autoSlide();
						} );

					}
					window.Gl && Gl.message && Gl.message.on("module.flow.switch",function ( width ){
				        if( width == 1020 ){
				        	left1 = "-738px";
							left2 = "-308px";
							itemsMod.css( "left", left2 );
				        }else{
				        	left1 = "-768px";
							left2 = "-338px";
							itemsMod.css( "left", left2 );
				        }
				    });
				},
				initHot = function(){
					var hotOpt = opt.hot,
						hotData = data.hot,
						hotMod = mod.find( ".hot" ),
						itemTpl =   	'<li class="hot-list #{last}">'
									+		'<div class="hot-main cf">'
									+			'<a href="#{redirect_uri}" class="img-container" data-sort="#{dataSort}"><img src="#{icon_35}" alt="#{app_name}" title="#{app_name}" /></a>'
									+			'<h4 class="hot-list-title"><a href="#{redirect_uri}" class="text-overflow" data-sort="#{dataSort}" title="#{app_name}">#{app_name}</a></h4>'
									+			'<p class="hot-useres">'
									+				'<i class="hot-user-icon"></i>'
									+				'<span class="hot-user-num">#{app_loaded}</span>'
									+			'</p>'
									+		'</div>'
									+		'<div class="hot-des">'
									+			'<b class="ui-arrow out"></b>'
						    		+			'<b class="ui-arrow in"></b>'
						    		+			'<div class="text-overflow-block">'
						    		+			'<p>#{app_abstract}</p>'
						    		+			'</div>'
						    		+		'</div>'
									+		'<i class="#{newIcon}"></i>'
									+	'</li>',
						itemsStr = "";
					hotMod.find( "h2" ).text( hotOpt.title );
					for( var i=0; i<hotData.length; i++ ){
						var curData = hotData[i];
						var curOpt = hotOpt.items[i];
						curData.last = i % 2 === 1 ? "last" : "";
						curData.newIcon = curOpt.newIcon ? "new-icon" : "";
						curData.dataSort = hotOpt.items[i].appid;
						itemsStr += helper.replaceTpl( itemTpl, curData );
					}
					hotMod.find( "ul" ).html( itemsStr );
				},
				initNew = function(){
					var newAppOpt = opt.newApp,
						newAppData = data["new"],
						newMod = mod.find( ".new" ),
						dataLength = newAppData.length,
						length = dataLength > 10 ? 10 : length,
						itemTpl =   '<li class="new-list #{even}">'
								+		'<a href="#{redirect_uri}" class="list-container" data-sort="new">'
								+			'<i class="icon #{spcIco}">#{index}</i>'
								+			'<img src="#{icon_35}" title="#{app_name}" />'
								+			'<span class="name text-overflow" title="#{app_name}">#{app_name}</span>'
								+		'</a>'
								+	'</li>',
						itemsStr = "";
					newMod.find( "h2" ).text( newAppOpt.title );
					for( var i=0; i<newAppData.length; i++ ){
						var curData = newAppData[i];
						curData.index = i+1;
						curData.even = i % 2 === 1 ? "even" : "";
						curData.spcIco = i < 3 ? "spcIco" : "";
						itemsStr += helper.replaceTpl( itemTpl, newAppData[i] );
					}
					newMod.find( "ul" ).html( itemsStr );
				},
				initMore = function(){
					var moreOpt = opt.more,
						moreData = data.all,
						dataLength = moreData.length,
						setedLength = moreOpt.num ? parseInt( moreOpt.num ) : dataLength,
						length = setedLength > dataLength ? dataLength : setedLength,
						moreMod = mod.find( ".more" ),
						listContainer = moreMod.find(".list-container"),
						itemTpl = 	'<li class="more-list #{last}">'
								+		'<div class="more-main cf">'
								+			'<a href="#{redirect_uri}" class="img-container" data-sort="more"><img src="#{icon_35}" title="#{app_name}" alt="#{app_name}" /></a>'
								+			'<h4 class="more-list-title"><a href="#{redirect_uri}" data-sort="more" class="text-overflow" title="#{app_name}">#{app_name}</a></h4>'
								+			'<p class="more-useres">'
								+				'<i class="more-user-icon"></i>'
								+				'<span class="more-user-num">#{app_loaded}</span>'
								+			'</p>'
								+		'</div>'
								+		'<div class="more-des">'
								+			'<b class="ui-arrow out"></b>'
					    		+			'<b class="ui-arrow in"></b>'
					    		+			'<div class="text-overflow-block">'
					    		+			'<p>#{app_abstract}</p>'
					    		+			'</div>'
					    		+		'</div>'
								+	'</li>',
						slideData = [],
						slideItemId = 1,
						slideItemStr = '<ul class="cf">';

					init();

					function init(){
						var curLayout = conf.curLayout;
						moreMod.find( "h2" ).text( moreOpt.title );
						formatSliderData( curLayout );
						render( curLayout );
						bindEvent();
					}
					function formatSliderData( width ){
						for( var i=0; i<length; i++ ){
							var curData = moreData[i],
								num = width && width == 960 ? 9 : 12;
							if ( i % num === 0 && i !== 0 ) {
								slideData.push( {
										"content": slideItemStr + '</ul>',
										"id": slideItemId
									} );
								slideItemId ++ ;
								slideItemStr = '<ul class="cf">';
							}
							if( num === 12 ){
								curData.last = i % 4 === 3 ? "last" : "";
							}else{
								curData.last = i % 3 === 2 ? "last" : "";
							}
							
							slideItemStr += helper.replaceTpl( itemTpl, curData );
							if( i === length-1 ){
								slideData.push( 
									{
										"content": slideItemStr + '</ul>',
										"id": slideItemId
									} 
								);
							}
						}
					}
					function render( width ){
						var options = {
								offset: 0,
								navSize: 1,
								itemSize: width && width == 960 ? 562 : 612,
								autoScroll: true,
								autoScrollDirection: moreOpt.autoScrollDirection || "forward",
								autoDuration: parseInt( moreOpt.autoDuration ) || 3000,
								scrollDuration: parseInt( moreOpt.scrollDuration ) || 500,
								containerId: listContainer,
								data: slideData,
								defaultId: 1
							},
							slider = new cycletabs.NavUI();
						slider.init(options);
					}
					function bindEvent(){
						moreMod.on( "mouseenter", ".more-list", function(){
							var thisMod = $( this );
							thisMod.addClass( "hovered" );
							moreMod.find( ".more-des" ).stop( true, true );
							thisMod.find( ".more-des" ).slideDown( "normal" );
						} )
						.on( "mouseleave", ".more-list", function(){
							var thisMod = $( this );
							moreMod.find( ".more-des" ).stop( true, true );
							thisMod.find( ".more-des" ).slideUp( "fast", function(){
								thisMod.removeClass( "hovered" );
							} );
						} );
					}
					window.Gl && Gl.message && Gl.message.on("module.flow.switch",function ( width ){
						slideItemStr = '<ul class="cf">';
						slideItemId = 1;
						slideData = [];
						listContainer.html( "" );
				        init();
				    });
				},
				init = function(){
					initCarousel();
					initHot();
					initNew();
					initMore();
				};

			
			return init;
		}();
		
	sortAreaApp();
} )( window );