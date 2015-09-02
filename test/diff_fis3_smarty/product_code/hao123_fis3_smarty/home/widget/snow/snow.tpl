<%script%>
	require.async( ["common:widget/ui/jquery/jquery.js", "home:widget/snow/snow-async.js"], function( $, Snow ){
		var snow = <%json_encode( $body.snow )%>;
		var triggerMods = snow.modIds || [];
		var directShow = snow.directShow;
		var delay = parseInt( snow.delay ) || 0;
		var begin = 0;
		var config = {
			'snowNum' : snow.snowNum,
	    	'snowlevel': snow.snowlevel || 2, 
	    	'timeout': 1000 * snow.timeout || 10,
	    	'speed' : snow.speed,
	    	'img': snow.img
		};
		for( var i=0, len=triggerMods.length; i<len; i++ ){
			$( "body" ).on( "click", triggerMods[i], function(){
				var now = + new Date();
				if( ( now - begin ) > parseInt( config.timeout ) ){
					begin = + new Date();
					new Snow( config );
				}
			} );
		}
		if( directShow === "1" && !$.cookie.get( "snowed" ) ){
			setTimeout( function(){
				new Snow( config );

			}, delay );
			$.cookie.set('snowed', '1', { expires: 1 });
		}
	} );
<%/script%>