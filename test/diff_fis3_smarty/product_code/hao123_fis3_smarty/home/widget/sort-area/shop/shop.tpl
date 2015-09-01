<%script%>
	conf = conf || {};
	conf.sortArea = conf.sortArea || {};
	conf.sortArea.shopOpt = {
		slideDir : "<%$body.sortAreaContainer.shop.slideDir%>",
		sortName : "<%$body.sortAreaContainer.shop.sortName%>",
		autoDuration : "<%$body.sortAreaContainer.shop.autoDuration%>",
		scrollDuration : "<%$body.sortAreaContainer.shop.scrollDuration%>",
		defaultShow : "<%$body.sortAreaContainer.shop.defaultShow%>",
		character : "<%$body.sortAreaContainer.shop.character%>",
		hour : "<%$body.sortAreaContainer.shop.hour%>",
		minute : "<%$body.sortAreaContainer.shop.minute%>",
		second : "<%$body.sortAreaContainer.shop.second%>",
		offsetTimeText : "<%$body.sortAreaContainer.shop.offsetTimeText%>",
		noLv2 : "<%$body.sortAreaContainer.shop.noLv2%>",
		sortItem : {},
		tabId : "<%$tab.id%>"
	};
	<%foreach $body.sortAreaContainer.shop.sortItem as $sortItem%>
		conf.sortArea.shopOpt.sortItem["<%$sortItem.id%>"] = <%json_encode($sortItem)%>;
	<%/foreach%>

	require.async( ["home:widget/sort-area/create-content-async.js","common:widget/ui/jquery/jquery.js"], function( CreateContent, $ ){
		$( "#sortArea" ).on( "sortArea.tabClicked_<%$tab.id%>", function(){
			var defaultData = <%json_encode( $body.sortAreaContainer.shopContent )%>;
			/**defaultData,支持配置数据**/
			new CreateContent( "<%$tab.id%>", null, defaultData );
		} );
		conf.sortArea.clildModuleReady["<%$tab.id%>"] = "true";
	} );
<%/script%>