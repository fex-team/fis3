<%*执行bigrender *%>
<%script%>
	require.async(["common:widget/ui/jquery/jquery.js",
			   	   "common:widget/ui/jquery/widget/jquery.lazyload/jquery.lazyload.js"
			   ], function($){
			   		$(".g_fis_bigrender,.g-area-lazyload").lazyload({
						skipInvisible:false,
						autoFireEvent: null,
						threshold: $(window).height()
					});	
			  })
<%/script%>
