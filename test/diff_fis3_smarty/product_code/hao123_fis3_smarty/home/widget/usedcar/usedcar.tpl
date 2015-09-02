<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/usedcar/ltr/ltr.css"%> <%else%> <%require name="home:widget/usedcar/rtl/rtl.css"%> <%/if%>
	<div class="mod-usedcar" id="sideUsedcar" monkey="sideUsedcar" log-mod="usedcar">
		<div class="mod-side">
			<a class="usedcar-banner" href="<%$body.usedcar.jumpUrl%>"></a>
			<div class="usedcar-content">
				<%foreach $body.usedcar.selector as $value%>
					<div class="usedcar-<%$value.type%> pr<%if $value@last%> s-mbm<%/if%>">
						<label for="usedcar<%ucfirst($value.type)%>Picker"><%$value.label%></label>
						<select id="usedcar<%ucfirst($value.type)%>"></select>
					</div>
				<%/foreach%>

				<button class="usedcar-search gradient-bg-green round-corner-s" id="usedcarSearch"><%$body.usedcar.searchText%></button>
			</div>
		</div>
		<a id='usedcarError' class='api-error' href='javascript:;'><%$head.apiError%></a>
	</div>
	<%script%>
		conf.usedcar = <%json_encode($body.usedcar)%>;
		require.async('common:widget/ui/jquery/jquery.js',function($){
			$(window).one("e_go.usedcar", function () {
				require.async(['home:widget/ui/usedcar/usedcar.js'],function(usedcar){
					new usedcar();
				});
			});
			if(!$("#sideMagicBox #sideUsedcar").length){
				$(window).trigger("e_go.usedcar");
			}
		});
	<%/script%>
