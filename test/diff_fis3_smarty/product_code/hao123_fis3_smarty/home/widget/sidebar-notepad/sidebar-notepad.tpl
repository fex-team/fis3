

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
	<%require name="home:widget/sidebar-notepad/ltr/ltr.css"%>
<%else%> 
	<%require name="home:widget/sidebar-notepad/rtl/rtl.css"%>
<%/if%>

<div class="mod-notepad-container" log-mod="notepad">
    <div class="sidebar-notepad-wrapper"  id="notepadContainer"></div>
</div>

<%script%>
conf.notepad = {
    id: "notepadContainer",
	checkRate: 500,
	savedTimeout: 2000,
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
	blankTitleTip: "<%$body.notepad.blankTitleTip%>",
	noteWord: "<%$body.notepad.noteWord%>",
	backBtn: "<%$body.notepad.backWord%>",
	firstNoteBtn: "<%$body.notepad.firstNoteBtn%>"
};

require.async("home:widget/ui/sidebar-notepad/sidebar-notepad.js", function () {
	Gl.notepad.init();
});
<%/script%>
