<!doctype html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<style type="text/css">
	body{padding: 0;margin: 0px;}
	.right-wide-ad{width: 300px;}
	</style>
</head>
<body class="right-wide-ad" id="rightWideAd">
	<script>
	!function(){
		var adGroup = <%json_encode($root.body.ad_group)%>;

		var temp = location.search.match(/i=(\d+)/);
		if(temp !== null){
			var i = temp[1];
			document.write(adGroup[i].content);
		}else{
			console.log("miss index");
		}
    }();
	</script>
</body>
</html>
