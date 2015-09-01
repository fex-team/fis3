<%if $head.dir=='ltr'%>
	<style type="text/css">
		div.ui-bubble-anniversary{
			position: absolute;
			width: 196px;
			border-color: #88b738;
			border-radius: 10px;
			z-index: 110 !important;
			background-color: #fff;
		}
		div.ui-bubble-anniversary .ui-bubble_close{
			color: #ffbdc3;
		}
		div.ui-bubble-anniversary .ui-arrow{
			color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-r .ui-bubble_out{
			border-left-color: #81b32d; 
		}
		div.ui-bubble-anniversary.ui-bubble-b .ui-bubble_out{
			border-top-color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-l .ui-bubble_out{
			border-right-color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-t .ui-bubble_out{
			border-bottom-color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-r .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-r .ui-bubble_out,
		div.ui-bubble-anniversary.ui-bubble-l .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-l .ui-bubble_out{
			top: 30px;
		}
		div.ui-bubble-anniversary.ui-bubble-b .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-b .ui-bubble_out,
		div.ui-bubble-anniversary.ui-bubble-t .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-t .ui-bubble_out{
			left: 100px;
		}
		div.ui-bubble-anniversary .decorate{
			display: block;
			position: absolute;
			bottom: -6px;
			left: -7px;
			width: 103px;
			height: 88px;
			background-image: url(./img/anniversary02.png); 
			background-position: 0 -120px;
			background-repeat: no-repeat;
			z-index: 1;
		}
		div.ui-bubble-anniversary .ui-bubble_t{
			margin: 10px 20px 5px 40px;
			min-height: 30px;
			z-index: 2;

		}
		div.ui-bubble-anniversary .ui-btn{
			display: block;
			visibility: hidden;
			border-color: #81b32d;
			background-color: #88cc35;
			background-image: -webkit-linear-gradient(top, #8bce36, #7fc831, #75c42e);
			background-image: -moz-linear-gradient(top, #8bce36, #7fc831, #75c42e);
			background-image: linear-gradient(top, #8bce36, #7fc831, #75c42e);
		}
		div.ui-bubble-anniversary .ui-btn.show{
			visibility: visible;
		}
	</style>
<%else%>
	<style type="text/css">
		div.ui-bubble-anniversary{
			position: absolute;
			width: 196px;
			border-color: #88b738;
			border-radius: 10px;
			z-index: 110 !important;
			background-color: #fff;
		}
		div.ui-bubble-anniversary .ui-bubble_close{
			color: #ffbdc3;
		}
		div.ui-bubble-anniversary .ui-arrow{
			color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-r .ui-bubble_out{
			border-left-color: #81b32d; 
		}
		div.ui-bubble-anniversary.ui-bubble-b .ui-bubble_out{
			border-top-color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-l .ui-bubble_out{
			border-right-color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-t .ui-bubble_out{
			border-bottom-color: #81b32d;
		}
		div.ui-bubble-anniversary.ui-bubble-r .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-r .ui-bubble_out,
		div.ui-bubble-anniversary.ui-bubble-l .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-l .ui-bubble_out{
			top: 30px;
		}
		div.ui-bubble-anniversary.ui-bubble-b .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-b .ui-bubble_out,
		div.ui-bubble-anniversary.ui-bubble-t .ui-bubble_in,
		div.ui-bubble-anniversary.ui-bubble-t .ui-bubble_out{
			left: 100px;
		}
		div.ui-bubble-anniversary .decorate{
			display: block;
			position: absolute;
			bottom: -6px;
			left: -7px;
			width: 103px;
			height: 88px;
			background-image: url(./img/anniversary02.png); 
			background-position: 0 -120px;
			background-repeat: no-repeat;
			z-index: 1;
		}
		div.ui-bubble-anniversary .ui-bubble_t{
			margin: 10px 20px 5px 40px;
			min-height: 30px;
			z-index: 2;

		}
		div.ui-bubble-anniversary .ui-btn{
			display: block;
			visibility: hidden;
			border-color: #81b32d;
			background-color: #88cc35;
			background-image: -webkit-linear-gradient(top, #8bce36, #7fc831, #75c42e);
			background-image: -moz-linear-gradient(top, #8bce36, #7fc831, #75c42e);
			background-image: linear-gradient(top, #8bce36, #7fc831, #75c42e);
		}
		div.ui-bubble-anniversary .ui-btn.show{
			visibility: visible;
		}
	</style>
<%/if%>

<%script%>
	conf = conf || {};
	conf.anniversary = <%json_encode($body.anniversary)%>;
	
	require.async("home:widget/anniversary/anniversary-async.js", function( Anniversary ){
		new Anniversary();
	});
<%/script%>