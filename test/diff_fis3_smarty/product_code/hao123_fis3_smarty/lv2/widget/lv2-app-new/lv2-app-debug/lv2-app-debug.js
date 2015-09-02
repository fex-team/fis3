var $ = require('common:widget/ui/jquery/jquery.js');
var extAppDebug = {};
var extApp = {};
extApp.config = {
	minHeight: 500
};
extAppDebug.update = function(appid, appURL, height){
	//update canvas
	var appHeight = Math.max(height, extApp.config.minHeight);
	$('#lv2AppCanvas').attr('src', appURL).attr('height', appHeight);
	//update height
	$('#lv2AppList').css('height',appHeight-17);
	$('#lv2AppCanvasWrapper').css('height',appHeight);
	//update list
	$('#lv2AppList').find('[data-app-appid='+appid+']').addClass('current');
};
extAppDebug.init = function(){
	$('#open-debug-submit').on('click',function(e){
		var url = $('#open-debug-url').val();
		if(url){
			if(url.indexOf('?') == -1){
				url += '?';
			}
		} else {
			url =  'about:blank';
		}
		var height = parseInt($('#open-debug-height').val() || '500')+50;
		var width = 760;

		extAppDebug.update('-1', url, height);
		alert('update success!');
	});
};


module.exports = extAppDebug;