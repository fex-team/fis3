var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var helper = require("common:widget/ui/helper/helper.js");
var scroll = require("common:widget/ui/scrollable/scrollable.js");

var sidebarAppbox = function() {
	var appItemTpl = '<li class="app-item">'
					+  '<a class="app-link" href="#{link}" data-sort="#{appid}" title="#{name}">'
					+	  '<img class="app-icon" src="#{src}" />'	
					+	  '<span class="app-name">#{name}</span>'
					+	  '<span class="app-num"><span class="app-users">#{num}</span>&nbsp;#{users}</span>'	
					+  '</a>'
					  '</li>',
		appItemTplWithDes = '<li class="app-item #{first}">'
					+  '<a class="app-link" href="#{link}" data-sort="#{appid}" title="#{name}">'
					+	  '<img class="app-icon" src="#{src}" />'	
					+	  '<span class="app-name">#{name}</span>'
					+	  '#{numStr}'
					+	  '<span class="app-des">#{description}</span>'
					+	  '#{appIconStr}'
					+  '</a>'
					  '</li>',	  
		_conf = conf.sidebarAppbox;

	function getData(){
		var appId = [],
			params = "";

		for ( var i = 1; i < _conf.list.length; i++ ) {
			appId.push(_conf.list[i].appid);
		}

		params = "?app=sidebar&act=home&country="+conf.country+"&type="+_conf.type+"&id="+appId.join(",");
		$.ajax({
            url: ( _conf.apiPre ? _conf.apiPre : conf.apiUrlPrefix ) + params,
            dataType: "jsonp",
            jsonp: "jsonp",
            jsonpCallback: "ghao123_" + hex_md5(params,16),
            cache: false,
            success: function(result) {
               render( [_conf.list[0]].concat( result.content.data ) );
            }
        });
	}

	function render( data ){
		var dom = "",
			ul = $(".apps",".mod-sidebar-appbox");
		for(var i = 0; i < data.length; i++){
			var curOpt = _conf.list[i];
			dom = dom + helper.replaceTpl( _conf.list[i].description ? appItemTplWithDes : appItemTpl,{
				"link" : i === 0 ? curOpt.link : "http://"+conf.country+".apps.hao123.com/"+data[i].app_id,
				"src" : i === 0 ? curOpt.imgSrc : data[i].icon_35,
				"name" : i === 0 ? curOpt.name : data[i].app_name,
				"num" : i === 0 ? curOpt.num : data[i].uv,
				"appid" : i === 0 ? curOpt.appid : data[i].app_id,
				"users" : _conf.users,
				"description" : curOpt.description,
				"first" : i === 0 ? "first" : "",
				"appIconStr" : curOpt.showIcon === "true" ? '<i class="app-icon-star"></i>' : '',
				"numStr" : i === 0 ? '<p class="app-played-number"><i class="app-people-icon"></i><span>' + curOpt.num + '</span></p>' : ''
			});
		}
		ul.append(dom);
		ul.scrollable({
			autoHide:false,
			dir:conf.dir
		});
	}	
	getData();
}

module.exports = sidebarAppbox;