
	<div lod-mod="embedlv2" id="embedlv2">
		<ul id="embed-iframe-nav">
			<li class="nav-item home current" data-url="/" data-id="home">
				<a href="#index" class="home-link"><i></i></a>
			</li>
			<li class="space current-left"></li>
			<%foreach $body.embedlv2async.navData as $navItem%>
				<li class="nav-item <%$navItem.id%>"  data-url='<%$navItem.url%>' data-id="<%$navItem.id%>">
					<a href="#news" class="lv2-link">
						<%if !empty($navItem.isBubbleShow) && ($navItem.isBubbleShow=='true')%><i class="icon-new_red_ltr"></i><%/if%>
						<i></i><span><%$navItem.name%></span>
					</a>
					<p><%$navItem.desc%></p>
				</li>
				<%if !$navItem@last%><li class="space"></li><%/if%>
			<%/foreach%>
		</ul>
		<div id="embed-iframe-wrapper" style="position:relative;display:none;">
			<div id="embed-iframe-loading" style="display: none;"><img class="loading" src="./loading.gif" /><div class="loading-desc"><%$body.embedlv2async.loadingText%></div></div>
		</div>
	</div>
	<%script%>
		conf.embedlv2 = {
			animateTime: <%$body.embedlv2.animateTime|default:'1000'%>,
			loadingTime: <%$body.embedlv2.loadingTime|default:'2500'%>
		};
		require.async(['common:widget/ui/jquery/jquery.js', 'common:widget/ui/ut/ut.js', 'common:widget/ui/helper/helper.js'],function($,UT,helper){

			function changeIframe(url, id){
				$("#embed-iframe-wrapper").children().hide();
				$('#embed-iframe-loading').show();
				if ($('#embed-iframe-'+ id).length > 0) {
					$('#embed-iframe-'+ id).show();
					$('#embed-iframe-loading').hide();
				} else {
					$.getJSON('/resource/ar' + url + '/data.json', function (data) {
						var dom = $('<div id="embed-iframe-'+ id +'">').append($(data.html));
						$("#embed-iframe-wrapper").append(dom);
						helper.globalEval(data.script);
						$('#embed-iframe-loading').hide();
					});
				}

				setTimeout(function(){$('#embed-iframe-loading').hide();}, conf.embedlv2.loadingTime);
			}


			//initBindEvent
			$('#embed-iframe-nav').on('mouseenter','.nav-item',function(e){
				$(window).trigger('e_embedlv2_nav_user_act');

				var $link = $(this);
				if($link.hasClass('current')){
					return;
				} else {
					$link.addClass('hover');
				}
			}).on('mouseleave','.nav-item',function(e){
						$(this).removeClass('hover');
			}).on('click','.nav-item', function(e){
				e.preventDefault();
				$(window).trigger('e_embedlv2_nav_user_act');

				var $link = $(this);
				var url = $link.attr('data-url');
				//返回顶区，再展现新内容
				window.scrollTo(0,0);

				if($link.hasClass('home')){

					$('#embed-iframe-wrapper').hide();
					$('#embed-iframe-loading').hide();

					$('.hotsite_b').show();
				} else if($link.hasClass('current')){  //选中的Tab直接打开
					window.open(url);
				} else {
					changeIframe(url, $link.attr('data-id'));
					$('#embed-iframe-wrapper').show();
					$('.hotsite_b').hide();
				}
				$('#embed-iframe-nav .nav-item').removeClass('current');
				$('#embed-iframe-nav .space').removeClass('current-left').removeClass('current-right');
				var $current = $(this).addClass('current');
				$current.prev().addClass('current-right');
				$current.next().addClass('current-left');


				//LOG
				UT.send({
					type:"click",
					modId:"embedlv2",
					element: $link.attr('data-id'),
					url: url
				});
			});

			//菜单跟随效果
			$(window).on('scroll',function(){
				$(window).scrollTop() > $("#embed-iframe-nav").parent().offset().top ? $('#embed-iframe-nav').addClass("embed-fixed") : $('#embed-iframe-nav').removeClass("embed-fixed");
			});

			//菜单动画，只动画一次，会记cookie
			var isEmbedlv2Guide = jQuery.cookie("isEmbedlv2Guide");
			if(!isEmbedlv2Guide){
				jQuery.cookie("isEmbedlv2Guide", 1,{ expires:2000});

				var $navItems = $('#embed-iframe-nav .nav-item').not(".home");
				var item = 0,itemLen = $navItems.length;
				var timerFlip = null;
				function flipNav(){
					if(item < itemLen * 2){
						$($navItems[item < itemLen ? item : item - itemLen]).addClass('hover-animate');
						timerFlip = setTimeout(flipOutNav, conf.embedlv2.animateTime);
					}
				}
				function flipOutNav(){
					$($navItems[item < itemLen ? item : item - itemLen]).removeClass('hover-animate');
					item++;
					timerFlip = setTimeout(flipNav, 300);
				}
				setTimeout(flipNav, conf.embedlv2.animateTime);
				//一旦用户开始交互，则触发动画停止
				$(window).one('e_embedlv2_nav_user_act',function(){
					clearTimeout(timerFlip);
					$('#embed-iframe-nav .nav-item').removeClass('hover-animate');
				});
			}
		});
	<%/script%>

