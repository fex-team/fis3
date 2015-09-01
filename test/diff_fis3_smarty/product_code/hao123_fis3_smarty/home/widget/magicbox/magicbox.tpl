<style>
	.side-mod-preload-magicbox{
		border:1px solid #e3e5e6;
		border-bottom:1px solid #d7d8d9;
		background: #f5f7f7;
	}
	.side-mod-preload-magicbox > *{
		visibility: hidden;
	}
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/magicbox/ltr/ltr.css"%> <%else%> <%require name="home:widget/magicbox/rtl/rtl.css"%> <%/if%>

	<div class="mod-magicbox box-border" id="sideMagicBox" monkey="sidemagicbox">
		<div class="mod-side">
			<div class="magicbox-tab cycletabs unselect"></div>
			<div class="magicbox-title">
				<i class="collapse" title="<%$body.magicBox.closeText|default:'close'%>"></i>
				<i class="lock" title="<%$body.magicBox.lockText|default:'lock'%>"></i>
				<i class="refresh" title="<%$body.magicBox.refreshText|default:'refresh'%>"></i>
				<span class="widget-title"></span>
			</div>
			<ul class="cyclepanels">
				<%foreach $body.magicBox.tabs as $mod%>
				<%if !empty($mod.id)%>
					<li class="magicbox-panel cyclepanel">
						<%*widget name="`$modname`" mode='quickling' pagelet_id=$mod.id*%>

							<%if $mod.id == 'speedTest'%>
								<%widget name="home:widget/speed-test/speed-test.tpl"%>
							<%else%>
								<%widget name="home:widget/`$mod.id`/`$mod.id`.tpl"%>
							<%/if%>

					</li>
				<%/if%>
				<%/foreach%>
			</ul>
		</div>
	</div>
	<%script%>
		conf.magicBox = <%json_encode($body.magicBox)%>;
		require.async(['common:widget/ui/jquery/jquery.js', 'home:widget/magicbox/magicbox-async.js'],function($, magicBox){
			magicBox.init();
		});
	<%/script%>
