var $ = require("common:widget/ui/jquery/jquery.js");

conf.fb_like && $(window).load(function() {
	$(".fb_like").append('<iframe src="//www.facebook.com/plugins/like.php?locale='+conf.fb_like.locale+'&amp;href='+conf.fb_like.url+'&amp;layout=button_count&amp;width='+conf.fb_like.width+'&amp;show_faces=false&amp;font&amp;colorscheme=light&amp;action=like&amp;height='+conf.fb_like.height+'" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:'+conf.fb_like.width+'px; height:'+conf.fb_like.height+'px;" allowTransparency="true"></iframe>');
});