

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%>
	<%require name="home:widget/notepad/ltr/ltr.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* 云笔记首屏抽样样式 *%>
		<%require name="home:widget/notepad/small-ltr/small-ltr.css"%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* 云笔记首屏两种布局样式 *%>
		<%require name="home:widget/notepad/flow/ltr/ltr.flow.css"%>
	<%/if%>
<%else%>
	<%require name="home:widget/notepad/rtl/rtl.css"%>
	<%if !empty($head.splitHotsite) %>
		<%* 云笔记首屏抽样样式 *%>
		<%require name="home:widget/notepad/small-rtl/small-rtl.css"%>
	<%/if%>
	<%if !empty($head.flowLayout) %>
		<%* 云笔记首屏两种布局样式 *%>
		<%require name="home:widget/notepad/flow/rtl/rtl.flow.css"%>
	<%/if%>
<%/if%>

<a href="javascript:void(0)" onclick="return false;" class="hotsite-tabs_btn notepad-tab" id="notepadTab" hidefocus="true" log-mod="notepad"><i class="i-notepad"></i><%$body.notepad.tabText%>
	<%if empty($body.notepad.bubbleHidden)%>
		<i class="icon-new_red"></i>
	<%/if%>
</a>

<%script%>
conf.notepad = {
	checkRate: 500,
	savedTimeout: 3000,
	autoSaveRate: 20000,
	saveListTimeout: 5000,
	writeTextH1: "<%$body.notepad.writeText1.text%>",
	writeTextH2: "<%$body.notepad.writeText2.text%>",
	readTextH1: "<%$body.notepad.readText1.text%>",
	readTextH2: "<%$body.notepad.readText2.text%>",
	loginTextH1: "<%$body.notepad.loginText1.text%>",
	loginTextH2: "<%$body.notepad.loginText2.text%>",
	loginBtn: "<%$body.notepad.loginBtn.text%>",
	addBtn: "<%$body.notepad.addBtn%>",
	saveBtn: "<%$body.notepad.saveBtn%>",
	savedText: "<%$body.notepad.savedText%>",
	timeTpl: "<%$body.notepad.timeTpl|default:'#{y}-#{m}-#{d} #{hh}:#{mm}'%>",
	overflowNotice: "<%$body.notepad.overflowNotice%>",
	blankTitleTip: "<%$body.notepad.blankTitleTip%>"
};

require.async(["common:widget/ui/jquery/jquery.js"], function ($) {

	$(window).one("e_go.notepad", function () {
		require.async("home:widget/ui/notepad/notepad.js", function () {
			Gl.notepad.init();
		});
	});

	$(window).load(function () {
		$(window).trigger("e_go.notepad");
	});

	$("#notepadTab").one("mouseenter", function () {
		$(window).trigger("e_go.notepad");
	});
});
<%/script%>
