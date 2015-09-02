
	<div log-mod="embedlv2" id="embedlv2">
		<ul id="embed-iframe-nav">
			<li class="space first current-right"></li>
			<li class="nav-item home current" data-url="/" data-id="home">
				<a href="#index" class="home-link"><i></i><span><%$body.embedlv2async2.navHomeName%></span></a>
			</li>
			<li class="space current-left"></li>
			<%foreach $body.embedlv2async2.navData as $navItem%>
				<li class="nav-item <%$navItem.id%> <%if $navItem@last%>last-nav<%/if%>"  data-url='<%$navItem.url%>' data-id="<%$navItem.id%>">
					<a href="#news" class="lv2-link">
						<i></i><span><%$navItem.name%></span>
					</a>
				</li>
				<li class="space <%if $navItem@last%>last<%/if%>"></li>
			<%/foreach%>
		</ul>
		<div id="embed-iframe-wrapper" style="position:relative;display:none;">
			<div id="embed-iframe-loading" style="display: none;">
				<img class="loading" src="./loading.gif" />
				<div class="loading-desc">
					<%$body.embedlv2async2.loadingText%>
				</div>
			</div>
		</div>
	</div>
	<%script%>
		conf.embedlv2 = {
			loadingTime: <%$body.embedlv2.loadingTime|default:'2500'%>
		};
		require.async(['common:widget/ui/jquery/jquery.js', 'common:widget/ui/ut/ut.js', 'common:widget/ui/helper/helper.js'],function($,UT,helper){

			function changeIframe(url, id){
				$("#embed-iframe-wrapper").children().hide();
				$('#embed-iframe-loading').show();
				if ($('#embed-iframe-'+ id).length > 0) {
					$('#embed-iframe-loading').hide();
					$('#embed-iframe-'+ id).show();
				} else {
					$.getJSON('/resource/ar' + url + '/data.json', function (data) {
						var dom = $('<div id="embed-iframe-'+ id +'">').append($(data.html));
						$('#embed-iframe-loading').hide();
						$("#embed-iframe-wrapper").append(dom);
						helper.globalEval(data.script);
					});
				}

				setTimeout(function(){$('#embed-iframe-loading').hide();}, conf.embedlv2.loadingTime);
			}

			//initBindEvent
			$('#embed-iframe-nav .nav-item').on('mouseenter', function(e){
				var $link = $(this);
				if($link.hasClass('current')){
					return;
				} else {
					//为icon添加hover之后的震动动画
					$link.addClass('hover');
				}
			}).on('mouseleave', function(e){
				//取消icon上的动画
				$(this).removeClass('hover');
			}).on('click', function(e){
				e.preventDefault();

				var $link = $(this);
				var url = $link.attr('data-url');

				if($link.hasClass('home')){
					$('#embed-iframe-wrapper').hide();
					$('#embed-iframe-loading').hide();

					$('.hotsite_b').show();
				} else if($link.hasClass('current')){  //选中的Tab直接打开
					window.open(url);
				} else {
					changeIframe(url, $link.attr('data-id'));
					$('.hotsite_b').hide();
					$('#embed-iframe-wrapper').show();
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
		});
	<%/script%>

