<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header/app-list/ltr-s/ltr.css?__inline');
<%else%> 
@import url('/widget/header/app-list/rtl-s/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header/app-list/ltr-s/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header/app-list/rtl-s/rtl.more.css"%> 
<%/if%>
<div class="app-wrapper" log-mod="app-list">
    <div class="app-head" id="appHead">
    </div>
    <div class="app-group" id="appContent">
    	<div class="app-arrow"><div class="app-arrow_bg"></div></div>
    	<div class="app-group_content">
    	</div>
    </div>
</div>
<%script%>
conf.appTest = <%json_encode($body.headerTest.app)%>;

require.async("common:widget/ui/jquery/jquery.js", function ($) {

    var $win = $(window);

    if(/(png|gif|jpg|jpeg)/i.test(conf.appTest.title)) {
        $("#appHead").html("<img src='" + conf.appTest.title + "' />");
    } else {
        $("#appHead").addClass("app-head_word").html(conf.appTest.title);
    }

    // 鼠标滑过按钮或者onload之后加载JS文件，只加载一次
    $win.one("headerTest.app", function() {
        require.async("common:widget/header/app-list/app-list-async.js");
    }).load(function() {
        $win.trigger("headerTest.app");
    });

    $("#appHead").one("mouseenter", function() {
        $win.trigger("headerTest.app");
        // 防止用户在未load之前hover相关区域不能触发脚本里面的事件
        conf.appTest.isMouseTriggered = true; 
    });
});

<%/script%>