var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');

var container = $(".mod-joke"),
		title = container.find(".joke_title"),
		content = container.find(".joke_content"),
		refresh_but = container.find(".joke_refresh"),
		api_prefix = conf.apiUrlPrefix;
	refresh_but.click(function(e){
		//发请求
		var params = "?app=joke&act=contents&num=1&country="+conf.country;
		$.ajax({
			url: api_prefix + params,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(params,16),
	    	cache: false,
	    	success: function(data) {
	    		var links = data.content.data,
					tip = data.content.tip,
					title_text = data.content.title;
				//笑话两字的文本
				title.text(title_text);
				//刷新按钮的提示
				refresh_but.attr("title",tip);
				$.each(links,function(){
					var url = this.url,
						name = this.name;
					content.attr({
						href:url,
						title:name
					});
					content.text(name);
				});
	    	}
		});
		e.preventDefault();
	});
	refresh_but.trigger('click');
