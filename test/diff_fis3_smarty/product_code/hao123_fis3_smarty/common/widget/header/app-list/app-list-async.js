var $ = require("common:widget/ui/jquery/jquery.js"),
	helper = require("common:widget/ui/helper/helper.js"),
	UT = require("common:widget/ui/ut/ut.js");

var wrap = $("#appContent"),
	appHd = $("#appHead"),
	content = wrap.find(".app-group_content"),
	CON = conf.appTest,
	num = parseInt(CON.limitNum, 10), //每行显示app数目
	len = CON.list.length, //cms中配置的app数目
	TPL = '<a href="#{url}" class="app-item" title="#{descrip}"><img src="#{icon}" /><span style="width:' + CON.wordWidth + 'px;">#{title}</span></a>',
	appData = "",
	listWidth = (CON.margin * 2 + Math.max(parseInt(CON.wordWidth, 10), parseInt(CON.iconWidth, 10))) * num + 4; //用于每几个显示一行

$.each(CON.list, function(index, value) {
	if (index % num === 0) {
		appData += "<div class='app-group_list' style='width: " + listWidth + "px;'>";
	}
	appData += helper.replaceTpl(TPL, value);
	if (((index + 1) % num === 0) || (index + 1 === num)) {
		appData += "</div>";
	}
});

content.html(appData);

wrap.parent().hover(function() {
	appHd.addClass("module-mask");
	wrap.show();
}, function() {
	appHd.removeClass("module-mask");
	wrap.hide();
});

content.on("click", "a", function(e) {
	UT.send({
		"type": "click",
		"position": "clickApp",
		"sort": $(this).attr("href"),
		"value": $(this).children('span').html(),
		"modId": "app-list"
	});
});
if (CON.isMouseTriggered) {
	wrap.parent().trigger('mouseenter');
}