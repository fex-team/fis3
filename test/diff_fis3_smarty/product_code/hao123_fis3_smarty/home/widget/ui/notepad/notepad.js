/*
*	Cloud Notepad
*	V1.0.0
*
*	@Frank Feng

*	todo: 
*	1. cache acticle's content with $.data -- Done
*	2. statistics -- Done
*	3. login callback -- Done
*	4. comments -- Done
*	5. cursor position -- Done
*	6. saved in 3s -- Done
*	7. check save status -- Done
*	8. add a new list while create an article -- Done
*	9. delete an article then clear content area -- Done
*	10. scroll to the top of the list after clicking new note -- Done
*	11. tips when the title is empty -- Done
*/

var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");
var	helper = require("common:widget/ui/helper/helper.js");
var time = require("common:widget/ui/time/time.js");

require("common:widget/ui/jquery/widget/jquery.textarealimit/jquery.textarealimit.js");


Gl.notepad = {};

var _conf = conf.notepad,
	container = $('<div class="notepad-container" id="notepadContainer" log-mod="notepad"></div>'),
	loginContent = $(helper.replaceTpl('<div class="notepad-login"><div class="notepad-write-text"><h3>#{writeTextH1}</h3><h4>#{writeTextH2}</h4></div><div class="notepad-read-text"><h3>#{readTextH1}</h3><h4>#{readTextH2}</h4></div><div class="notepad-lets-login"><h1>#{loginTextH1}</h1><h2>#{loginTextH2}</h2></div><div class="notepad-login-btn" id="notepadFBBtn"><i class="i-notepad-fb"></i><span class="notepad-login-text">#{loginBtn}</span></div>', _conf)),
	noteContent = $(helper.replaceTpl('<div class="notepad"><div class="notepad-list"><div class="notepad-list-title"><div class="notepad-add" id="notepadAdd"><span class="i-notepad-add"><i></i></span><span class="notepad-add-add">#{addBtn}</span></div></div><div class="notepad-list-wrapper"><div class="notepad-list-container"><ul id="notepadList"></ul></div></div></div><div class="notepad-notes"><div class="notepad-title"><input type="text" autocomplete="off" id="notepadTitle" maxlength="250" disabled="disabled"><label for="notepadTitle" id="notepadTip">#{blankTitleTip}</label><span class="notepad-create-time" id="notepadCreateTime"></span></div><div class="notepad-article-container"><div class="notepad-article-border"></div><div class="notepad-article"><textarea id="notepadArticle" class="notepad-textarea" maxlength="10000" disabled="disabled"></textarea><p class="notepad-notice" id="notepadNotice">#{overflowNotice}</p><span class="notepad-save notepad-save-disable" id="notepadSave" data-aid="#{aid}"">#{saveBtn}</span></div></div></div><div class="notepad-ring"></div><div class="notepad-article-shadow1"></div><div class="notepad-article-shadow2"></div>', _conf)),
	listTpl = '<li data-aid="#{aid}"><p>#{title}</p><span>#{ct}</span><i class="notepad-del"></i></li>',
	isInit = false, // whether the notepad tab has been initialized
	isChange = false, // state of whether the article has been updated
	isDisabled = true, // whether the notepad widget can be used
	canSave = true, // saving state, if the last saving process is end or timeout, set it to 'true'
	createTime = "", // temporary time for new article
	titleText = "",
	articleText = "",
	oriTab, // original selected tab
	interval, // for input status checking interval
	t; // for saved button timeout

// Initialization
Gl.notepad.init = function () {
	var that = this;
	that.bindEvent();
};

// Event binding
Gl.notepad.bindEvent = function () {
	var that = this;

	$("#notepadArticle", noteContent).textarealimit(); //Limit textarea's maxlength

	// Switch to notepad
	$("#notepadTab").on("click", function (e) {
		e.preventDefault();

		var isClose = true; // Is the notepad tab closing

		if ($("#hotsiteTab").hasClass("cur")) {
			oriTab = $("#hotsiteTab");
			isClose = false; // Open notepad
		} else if ($("#historyTab").hasClass("cur")) {
			oriTab = $("#historyTab");
			isClose = false; // Open notepad
		} else if ($("#hotsiteNewTab").hasClass("cur")) {
			oriTab = $("#hotsiteNewTab");
			isClose = false; // Open notepad
		}

		// Show close icon and switch tabs
		if (!isClose) {
			$("#hotsiteTab,#historyTab,#hotsiteNewTab").removeClass("cur");
			$(this).addClass("cur close");
			that.switchTab(true); // Switching to the Notepad tab
		} else {
			$(this).removeClass("cur close");
			oriTab.addClass("cur");
			that.switchTab(false); // Switching to the original tab
		}

		// User track
		UT.send({
			type: "click",
			position: "notepad",
			sort: "tab",
			modId:"notepad"
		});
	});

	// Switch to hotsite of history
	$("#hotsiteTab,#historyTab").on("click", function () {
		$("#notepadTab").removeClass("cur close");
		that.switchTab(false); // Switching to the original tab
	});

	// Clicking on the login btn
	$("#notepadFBBtn", loginContent).on({
		mouseenter: function () {
			$(this).addClass("notepad-login-btn-hover");
		},
		mouseleave: function () {
			$(this).removeClass("notepad-login-btn-hover");
		},
		mousedown: function () {
			$(this).addClass("notepad-login-btn-click");
		},
		mouseup: function () {
			$(this).removeClass("notepad-login-btn-click");
		},
		click: function () {

			var loginCtroller = window.loginCtroller;

			if(loginCtroller){

				if(loginCtroller.verify == 1){

					that.initNotes();

				}else{
					
					loginCtroller.fire();
				}
			}
			// window.loginCtroller && window.loginCtroller.fire(); //Login with facebook account
			// that.initNotes();
			// User track
			UT.send({
				type: "click",
				ac: "b",
				position: "notepad",
				sort: "login",
			modId:"notepad"
			});
		}
	});

	// Add new acticle
	$("#notepadAdd", noteContent).on({
		mouseenter: function () {
			$(this).addClass("notepad-add-hover");
		},
		mouseleave: function () {
			$(this).removeClass("notepad-add-hover");
		},
		click: function () {
			if (!isDisabled) {
				$(".notepad-list-wrapper").scrollTop(0); // Scroll to the top of the list
				that.add();
				if ($("#notepadList li").eq(0).attr("data-aid") !== "" && $("#notepadList li").eq(0).attr("data-aid") !== "undefined" || $("p", $("#notepadList li").eq(0)).text() !== "") {
					var ct = createTime ? createTime.getTime() : time.getTime().getTime();
					that.createList({ct: ct}); // Create an empty element into the title list
				} else {
					$("#notepadList li").eq(0).addClass("active");
				}
			}
			// User track
			UT.send({
				type: "click",
				ac: "b",
				position: "notepad",
				sort: "add",
				modId:"notepad"
			});
		}
	});

	// Save button
	$("#notepadSave").live({
		mouseenter: function () {
			$(this).addClass("notepad-save-hover");
		},
		mouseleave: function () {
			$(this).removeClass("notepad-save-hover");
		},
		click: function () {
			that.save({setSaved: true});
			// User track
			UT.send({
				type: "click",
				ac: "b",
				position: "notepad",
				sort: "save",
				modId:"notepad"
			});
		}
	});

	// Switch articles from title list
	$("#notepadList li").live({
		mouseenter: function () {
			$(this).addClass("hover");
		},
		mouseleave: function () {
			$(this).removeClass("hover");
		},
		click: function (e) {
			if (e.target.tagName !== "I") { // Not click on the del btn
				var aid = $(this).attr("data-aid");
				// Switch active status
				$("#notepadList li").removeClass("active");
				$(this).addClass("active");
				that.save(); // Save the current article
				that.showContent(aid);
				// User track
				UT.send({
					type: "click",
					ac: "b",
					position: "notepad",
					sort: "list",
					modId:"notepad"
				});
			}
		}
	});

	// Delete button
	$(".notepad-del").live({
		mouseenter: function () {
			$(this).addClass("notepad-del-hover");
		},
		mouseleave: function () {
			$(this).removeClass("notepad-del-hover");
		},
		click: function () {
			var aid = $(this).parent().attr("data-aid");
			that.del(aid);
			// User track
			UT.send({
				type: "click",
				ac: "b",
				position: "notepad",
				sort: "del",
				modId:"notepad"
			});
		}
	});

	// Input tips switch
	$("#notepadTitle", noteContent).on({
		focus: function () {
			$("#notepadTip").hide();
		},
		blur: function () {
			that.inputTipSwitch();
		},
		// Focus on the content when click 'TAB' or 'ENTER' in title area
		keydown: function (e) {
			var key = e.which;
			if (key === 9 || key === 13) {
				e.preventDefault();
				$("#notepadArticle").focus();
			}
		}
	});

	// Focus on the title input box when clicking on the tips
	$("#notepadTip", noteContent).on("mousedown", function () {
		$("#notepadTitle").focus();
	});
};

// Tab switching between hotsite, history and notepad.
Gl.notepad.switchTab = function (type) {
	/*
	*	@params: 
	*	type: 'true' will open notepad tab; 'false' will open the original feature tab.
	*/

	var that = this,
		newHotsite = $(".mod-hotsite-newtab");

	if (type) {
		$("#hotsiteContainer,.hotsite-custom,.mod-hotsite-newtab").hide();

		if(isInit) {
			container.show();
			$("#notepadArticle").focus();
		} else {
			if (window.loginCtroller && window.loginCtroller.verify == 1) {
				// If the user has been login, show articles list directly.
				that.initNotes();
			} else {
				// Else show login page
				container.append(loginContent).show();
				$(".hotsite_wrap").append(container);
				isInit = true;
			}
		}
	} else {
		$(".hotsite-custom").show();
		if( newHotsite.length ){
			newHotsite.hasClass("current") ? newHotsite.show() : $("#hotsiteContainer").show();
		} else {
			$("#hotsiteContainer").show();
		}

		container.hide();
	}
	
};

// Show and init the notepad, start to loading the notes.
Gl.notepad.initNotes = function () {
	if (!isInit && $("#hotsiteContainer").css("display") === "block") return; // Stop init when the hotsite area is shown
	
	var that = this;
	loginContent.remove();
	container.append(noteContent);
	$(".hotsite_wrap").append(container);
	
	//修复当正在登陆notepad时，切换到热区，notepad会加到热区下方的bug
	if(isInit && $("#hotsiteContainer").css("display") === "block" || $(".mod-hotsite-newtab").css("display") === "block") {
		container.hide();
	}else{
		container.show();
	}

	that.getList(); // Get the articles list
	that.inputStatus(); // Checking input status

	isInit = true; // Notepad has been initialized
};

// check whether the textarea has been updated
Gl.notepad.inputStatus = function () {
	var	title = $("#notepadTitle", noteContent),
		article = $("#notepadArticle", noteContent),
		saveBtn = $("#notepadSave", noteContent),
		hasOverflow = false; // Whether the content length over 10000

	isChange = false;	// Init change status
	titleText = title.val();
	articleText = article.val();
	clearInterval(interval);
	$("#notepadNotice").hide();

	saveBtn.addClass("notepad-save-disable");

	interval = setInterval(function () {
		// When the user has input, enable the save button
		if (titleText !== title.val() || articleText !== article.val()) {
			saveBtn.removeClass("notepad-save-disable");
		} 
		// Check content text overflow status
		if (article.val().length >= 10000 && !hasOverflow) {
			$("#notepadNotice").show();
			hasOverflow = true;
		} else if (article.val().length < 10000 && hasOverflow) {
			$("#notepadNotice").hide();
			hasOverflow = false;
		}
	}, _conf.checkRate);
};

// Get the article's title list
Gl.notepad.getList = function () {
	var that = this;

	$.ajax({
		url: "/cloudnote/gettitle",
		data: null,
		type: "POST",
		success: function (data) {
			if (!$.parseJSON(data).status || $.parseJSON(data).status != "200") return;

			// var aid;
			data = $.parseJSON(data).data;
			/*if(data[0]) {
				aid = data[0].aid;
			}*/
			for (i in data) {
				that.createList(data[i]);
			};
			// Auto save
			setInterval(function () {
				that.save();
			}, _conf.autoSaveRate);
			// that.showContent(aid);
			$("#notepadTitle,#notepadArticle").removeAttr("disabled");
			$("#notepadTip").show();
			isDisabled = false;
			that.add();
		}
	});
};

// Show the article's content with aid
Gl.notepad.showContent = function (aid) {
	/*
	*	@params
	*	aid: the article's id which need to show
	*/
	var that = this,
		currentAid = $("#notepadSave").attr("data-aid"),
		listEle = $("#notepadList li[data-aid='" + aid + "']");

	if (currentAid == aid) return; // Do not do anything while clicking the current article

	clearTimeout(t);
	// Reset save button
	$("#notepadSave").attr("data-aid", aid).text(_conf.saveBtn);

	if (listEle.data("data")) {
		// If the article has been bound with $.data, create with it
		var data = listEle.data("data");
		$("#notepadTitle").val(data.title);
		$("#notepadArticle").focus().val(data.content); // Focus on the textarea
		$("#notepadCreateTime").text(data.ct);
		$("#notepadSave").attr("data-aid", aid);
		that.inputStatus(); // Check the input status
		that.inputTipSwitch();
	} else if (!aid || aid === "undefined") {
		var ct = helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(createTime)));
		// If the article has no aid, then add a new one.
		$("#notepadTitle").val("");
		$("#notepadArticle").focus().val(""); // Focus on the textarea
		$("#notepadCreateTime").text(ct);
		// Reset save button
		$("#notepadSave").attr("data-aid", "");
		that.inputStatus(); // Check the input status
		that.inputTipSwitch();
	} else {
		$.ajax({
			url: "/cloudnote/getcontent",
			data: {
				aid: aid
			},
			type: "POST",
			success: function (data) {
				data = $.parseJSON(data).data;
				if (data) {
					var date = new Date(data.ct >= 2147483647 ? parseInt(data.ct) : data.ct * 1000); // Check the create time format is in seconds or millisecond
					date = helper.replaceTpl(_conf.timeTpl, time.getForm(date));
					$("#notepadTitle").val(data.title);
					$("#notepadArticle").focus().val(data.content); // Focus on the textarea
					$("#notepadCreateTime").text(date);
					// Bind article info with $.data
					listEle.data("data", {aid: aid, title: data.title, content: data.content, ct: date});
				} else {
					$("#notepadTitle").val("");
					$("#notepadArticle").focus().val(""); // Focus on the textarea
					$("#notepadCreateTime").text("");
					// Bind article info with $.data
					listEle.data("data", {aid: aid, title: "", content: "", ct: ""});
				}
				$("#notepadSave").attr("data-aid", aid);
				that.inputStatus(); // Check the input status
				that.inputTipSwitch();
			}
		});
	}
};

// Create article's info into the titles' list
Gl.notepad.createList = function (opt) {
	/*
	* 	@param
	*	aid: article's aid
	*	title: article's title
	*	ct: article's creating time
	*/
	opt = opt || {};

	var aid = opt.aid || $("#notepadSave").attr("data-aid"),
		title = opt.title || $("#notepadTitle").val(),
		ct = opt.ct ? (opt.ct >= 2147483647 ? parseInt(opt.ct) : opt.ct * 1000) : time.getTime().getTime(), // Check the create time format is in seconds or millisecond
		date = new Date(parseInt(ct)),
		currentAid = $("#notepadSave").attr("data-aid"),
		list; // List object which need to be created
	date = time.getForm(date);
	ct = helper.replaceTpl(_conf.timeTpl, date);
	list = $(helper.replaceTpl(listTpl, {aid: aid, title: title, ct: ct}));

	// Add active status when the article is the current one.
	if (aid == currentAid) {
		list.addClass("active");
		$("#notepadList li").removeClass("active");
	}
	$("#notepadList").prepend(list);

	return list; // Return the list object
};

Gl.notepad.inputTipSwitch = function () {
	if($("#notepadTitle").val() === "") {
		$("#notepadTip").show();
	} else {
		$("#notepadTip").hide();
	}
};

// Add a new article
Gl.notepad.add = function (opt) {
	/*
	* 	@param
	*	title: article's title
	*	content: article's content
	*/
	opt = opt || {};
	var that = this,
		date = createTime || time.getTime(),
		ct = helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(date))),
		title = opt.title || "",
		content = opt.content || "";

	createTime = date;

	// that.createList({title:"", ct: date.getTime()});
	that.save();
	$("#notepadList li").removeClass("active");
	$("#notepadTitle").val(title);
	$("#notepadArticle").focus().val(content); // Focus on the textarea
	$("#notepadCreateTime").text(ct);
	// Reset save button
	$("#notepadSave").attr("data-aid", "").text(_conf.saveBtn);
	clearTimeout(t);
	that.inputStatus(); // Start to check input status
	that.inputTipSwitch();
};

// Save & Create articles
Gl.notepad.save = function (opt) {
	/*
	* 	@param
	*	aid: article's aid
	*	title: article's title
	*	content: article's content
	*	ct: article's creating time
	*	setSaved: if the value is true, set the Save button's text as SAVED
	*/
	opt = opt || {};

	var that = this,
		aid = opt.aid || $("#notepadSave").attr("data-aid"),
		title = opt.title || $("#notepadTitle").val(),
		content = opt.content || $("#notepadArticle").val(),
		ct = opt.ct || time.getTime().getTime();

	if (titleText !== title || articleText !== content) {
		isChange = true; // Check whether user has input anything
	} 
	titleText = title;
	articleText = content;

	if (title === "" && content === "") {
		isChange = false; // It's illegal to save when the title and content are both empty
	} else if (title === "") {
		title = content.substr(0, 250); // If the title is blank, using content's substring as title
	}

	// Can save with changing
	if (isChange) {
		// Set saved text and reset it
		if (opt.setSaved) {
			$("#notepadSave").text(_conf.savedText);
			t = setTimeout(function () {
				$("#notepadSave").text(_conf.saveBtn);
			}, _conf.savedTimeout);
		}
		if (!aid || aid === "undefined") {
			// If the article's aid is not available, create it.
			ct = createTime ? createTime.getTime() : ct;
			createTime = ""; // reset create time
			// remove the first element while it's a new one
			if ($("#notepadList li").eq(0).attr("data-aid") === "" || $("#notepadList li").eq(0).attr("data-aid") === "undefined") {
				var list = $("#notepadList li").eq(0);
				$("p", list).text(title);
			} else {
				var list = that.createList({title: title, content: content, ct: ct});
			}
			$("#notepadTitle").val(title);
			that.inputTipSwitch();
			$.ajax({
				url: "/cloudnote/create",
				data: {
					time: Math.floor(ct / 1000), // Set create time format in seconds in case of database overflow
					title: title,
					content: content
				},
				type: "POST",
				success: function (data) {
					data = $.parseJSON(data).data;
					if (data) {
						list.attr("data-aid", data.aid);
						if (!$("#notepadSave").attr("data-aid") && $("p", $("#notepadList li").eq(0)).text() !== "") {
							$("#notepadSave").attr("data-aid", data.aid);
						}
						// Bind article info with $.data
						list.data("data", {aid: data.aid, title: title, content: content, ct: helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(ct)))});
					}
				}
			});
			isChange = false; // Restore changing status
		} else {
			var save = function () {				
				$.ajax({
					url: "/cloudnote/save",
					data: {
						aid: aid,
						title: title,
						content: content
					},
					type: "POST",
					success: function () {
						canSave = true; // saving process is end
					},
					error: function () {
						canSave = true; // saving process is end
					}
				});
			};
			// If the article's aid is available, save it.
			var listEle = $("#notepadList li[data-aid='" + aid + "']");
			$("p", listEle).text(title);
			$("#notepadTitle").val(title);
			
			that.inputTipSwitch();
			// Check save list state
			if (canSave) {
				canSave = false;
				save();
			} else {
				// Abandon the last saving process after timeout
				setTimeout(function () {
					canSave = true;
					save();
				}, _conf.saveListTimeout);
			}
			isChange = false; // Restore changing status
			// Bind article info with $.data
			listEle.data("data", {aid: aid, title: title, content: content, ct: helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(ct)))});
		}
	}
};

// Delete an article with its aid
Gl.notepad.del = function (aid) {
	/*
	*	@params
	*	aid: the article's id which need to be removed
	*/
	var that = this,
		currentAid = $("#notepadSave").attr("data-aid");

	$("#notepadList li[data-aid='" + aid + "']").remove();

	// When remove the current article, clear the content area.
	if (aid === currentAid) {
		$("#notepadTitle").val("");
		$("#notepadArticle").val("");
		$("#notepadCreateTime").text("");
		$("#notepadSave").attr("data-aid", "");
		that.inputTipSwitch();
	}

	// Add this article as a new one, but without aid.
	// that.add({title: "", content: $("#notepadArticle").val()});

	$.ajax({
		url: "/cloudnote/del",
		data: {
			aid: aid
		},
		type: "POST"
	});
};
