<%script%>
	conf = conf || {};
	conf.sortAreaApp = <%json_encode( $body.sortAreaApp )%>;
	conf.sortAreaApp.id = "sortAreaApps";

	/**for test
	require.async( ["home:widget/sort-area/apps/save-apps-async.js","common:widget/ui/jquery/jquery.js"], function( init, $ ){
		var hotItems = conf.sortAreaApp.hot.items;
		var length = hotItems.length;
		var dataUrl = "?app=apps&act=content&country=br&vk=1&num_hot=" + conf.sortAreaApp.hot.num_hot + "&num_new=" + conf.sortAreaApp.newApp.num_new + "&num_all=" + conf.sortAreaApp.more.num_more + "&ids_hot=";

		for( var i=0; i<length; i++ ){
			dataUrl += hotItems[i].appid;
			if( i !== length-1 ){
				dataUrl += ",";
			}
		}
		init();
	} );
	*****/
	/*******/
	require.async( ["home:widget/sort-area/create-content-async.js","common:widget/ui/jquery/jquery.js"], function( CreateContent, $ ){

		var hotItems = conf.sortAreaApp.hot.items;
		var length = hotItems.length;
		var dataUrl = "?app=apps&act=content&country=br&vk=1&num_hot=" + conf.sortAreaApp.hot.num_hot + "&num_new=" + conf.sortAreaApp.newApp.num_new + "&num_all=" + conf.sortAreaApp.more.num_more + "&ids_hot=";

		for( var i=0; i<length; i++ ){
			dataUrl += hotItems[i].appid;
			if( i !== length-1 ){
				dataUrl += ",";
			}
		}
		$( "#sortArea" ).one( "sortArea.tabClicked_<%$tab.id%>", function(){
			new CreateContent( "<%$tab.id%>", dataUrl );
		} );
		conf.sortArea.clildModuleReady["<%$tab.id%>"] = "true";
	} );
	
<%/script%>