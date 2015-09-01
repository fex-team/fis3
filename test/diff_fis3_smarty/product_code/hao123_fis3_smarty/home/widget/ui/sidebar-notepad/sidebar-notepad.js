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
var helper = require("common:widget/ui/helper/helper.js");
var time = require("common:widget/ui/time/time.js");

require("common:widget/ui/jquery/widget/jquery.textarealimit/jquery.textarealimit.js");


Gl.notepad = {};

var _conf = conf.notepad,
    container = $("#" + _conf.id),
    fbContent = '<div class="sidebar-notepad-head"><img src="https://graph.facebook.com/#{bindid}/picture?width=48&height=48" /><div class="sidebar-notepad-head-wrapper"><p class="sidebar-notepad-uname">#{uname}</p><p class="sidebar-notepad-num"><span id="notepadNum">0</span>' + _conf.noteWord + '</p></div><div class="sidebar-notepad-list-title"><div class="sidebar-notepad-add" id="notepadAdd"><span class="sidebar-notepad-add-add">#{addBtn}</span></div></div></div>',
    loginContent = $(helper.replaceTpl('<div class="sidebar-notepad-login"><div class="sidebar-notepad-write-text"><h3>#{writeTextH1}</h3><h4>#{writeTextH2}</h4></div><div class="sidebar-notepad-read-text"><h3>#{readTextH1}</h3><h4>#{readTextH2}</h4></div><div class="sidebar-notepad-lets-login"><h1>#{loginTextH1}</h1><h2>#{loginTextH2}</h2></div><div class="sidebar-notepad-login-btn" id="notepadFBBtn"><i class="sidebar-i-notepad-fb"></i><span class="sidebar-notepad-login-text">#{loginBtn}</span></div>', _conf)),
    noteContent = $(helper.replaceTpl('<div class="sidebar-notepad-first"><div class="sidebar-notepad-list"><div class="sidebar-notepad-list-wrapper"><div class="sidebar-notepad-list-container"><ul id="notepadList"></ul></div></div></div><div class="sidebar-notepad-no-note"><div class="sidebar-notepad-no-btn"><span class="sidebar-notepad-no-icon"><i></i></span><span class="sidebar-notepad-no-content">#{firstNoteBtn}</span></div></div></div><div class="sidebar-notepad" style="visibility: hidden;"><div class="sidebar-notepad-notes"><div class="sidebar-notepad-title"><input type="text" autocomplete="off" id="notepadTitle" maxlength="250" disabled="disabled"><label for="notepadTitle" id="notepadTip">#{blankTitleTip}</label></div><div class="sidebar-notepad-tle"><p class="sidebar-notepad-tle-content" id="notepadTle"></p><span class="sidebar-notepad-create-time" id="notepadCreateTime"></span></div><div class="sidebar-notepad-article-container"><div class="sidebar-notepad-article-border"></div><div class="sidebar-notepad-article"><textarea id="notepadArticle" class="sidebar-notepad-textarea" maxlength="10000" disabled="disabled"></textarea><div class="sidebar-notepad-article-shadow"><div class="sidebar-notepad-article-shadow1"></div><div class="sidebar-notepad-article-shadow2"></div></div><p class="sidebar-notepad-notice" id="notepadNotice">#{overflowNotice}</p><p class="sidebar-notepad-saved" id="notepadSaved">#{savedText}</p><span class="sidebar-notepad-back" id="notepadBack">#{backBtn}</span><span class="sidebar-notepad-save sidebar-notepad-save-disable" id="notepadSave" data-aid="#{aid}"">#{saveBtn}</span></div></div></div>', _conf)),
    listTpl = '<li data-aid="#{aid}"><p>#{title}</p><span>#{ct}</span><i class="sidebar-notepad-del"></i></li>',
    isInit = false, // whether the notepad tab has been initialized
    isChange = false, // state of whether the article has been updated
    isDisabled = true, // whether the notepad widget can be used
    canSave = true, // saving state, if the last saving process is end or timeout, set it to 'true'
    createTime = "", // temporary time for new article
    titleText = "",
    articleText = "",
    timer,
    interval, // for input status checking interval
    t; // for saved button timeout

// Initialization
Gl.notepad.init = function() {
    var that = this;
    that.switchTab();
    that.bindEvent();
};

// Event binding
Gl.notepad.bindEvent = function() {
    var that = this;

    $("#notepadArticle", container).textarealimit(); //Limit textarea's maxlength

    $("#notepadArticle").live("keypress", function() {
        var that = $(this);
        // Check content text overflow status
        if (that.val().length >= 10000) {
            $("#notepadNotice").show();
        } else {
            $("#notepadNotice").hide();
        }
    }).live("keyup", function() {
        var that = $(this);
        // Check content text overflow status
        if (that.val().length >= 10000) {
            $("#notepadNotice").show();
        } else {
            $("#notepadNotice").hide();
        }
    });
    // Clicking on the login btn
    container.on("click", "#notepadFBBtn", function() {
        var loginCtroller = window.loginCtroller;

        if (loginCtroller) {
            if (loginCtroller.verify == 1) {
                that.initNotes();
            } else {
                loginCtroller.fire();
            }
        }
        UT.send({
            type: "click",
            ac: "b",
            position: "notepad",
            sort: "login",
            modId: "notepad"
        });
    });

    // Add new acticle
    container.on("click", "#notepadAdd, .sidebar-notepad-no-btn", function() {
    	if($(this).hasClass('sidebar-notepad-no-btn')) {
    		container.removeClass('sidebar-notepad-fresh');
    	}
        if (!isDisabled) {
            $(".sidebar-notepad-list-wrapper").scrollTop(0); // Scroll to the top of the list
            that.add();
            if ($("#notepadList li").eq(0).attr("data-aid") !== "" && $("#notepadList li").eq(0).attr("data-aid") !== "undefined" || $("p", $("#notepadList li").eq(0)).text() !== "") {
                var ct = createTime ? createTime.getTime() : time.getTime().getTime();
                that.createList({
                    ct: ct
                }); // Create an empty element into the title list
            } else {
                $("#notepadList li").eq(0).addClass("sidebar-active");
            }
            //$(".sidebar-notepad-first", container).hide();
            //$(".sidebar-notepad", container).show();
            container.addClass('sidebar-notepad-second');
            container.find(".sidebar-notepad-tle").hide();
        }
        // User track
        UT.send({
            type: "click",
            ac: "b",
            position: "notepad",
            sort: "add",
            modId: "notepad"
        });
    });

    // Save button
    container.on("click", "#notepadSave", function() {
        var _sel = $(this);
        that.save({
            setSaved: true
        });

        if (_sel.hasClass('sidebar-notepad-save-disable')) {
        } else {
        	clearTimeout(timer);
            $("#notepadSaved").addClass("sidebar-notepad-saved-show");
            timer = setTimeout(function() {
                $("#notepadSaved").removeClass("sidebar-notepad-saved-show");
            }, _conf.savedTimeout);

            setTimeout(function() {
            	if($.trim($("#notepadTitle").val()) === "") {
            		$(".sidebar-notepad-tle", container).hide();
            	} else {
            		$(".sidebar-notepad-tle", container).show();
            	}
            }, 600);
        }

        // User track
        UT.send({
            type: "click",
            ac: "b",
            position: "notepad",
            sort: "save",
            modId: "notepad"
        });
    });

    // back button
    container.on("click", "#notepadBack", function() {
        //$(".sidebar-notepad-first", container).show();
        //$(".sidebar-notepad", container).hide();
        container.removeClass('sidebar-notepad-second');
        UT.send({
            type: "click",
            ac: "b",
            position: "notepad",
            sort: "back",
            modId: "notepad"
        });
    });

    // Switch articles from title list
    container.on("click", "#notepadList li", function(e) {
        if (e.target.tagName !== "I") { // Not click on the del btn
            var aid = $(this).attr("data-aid");
            // Switch active status
            $("#notepadList li").removeClass("sidebar-active");
            $(this).addClass("sidebar-active");
            //$(".sidebar-notepad-first", container).hide();
            //$(".sidebar-notepad", container).show();
            container.addClass("sidebar-notepad-second");
            that.save(); // Save the current article
            that.showContent(aid);
            // User track
            UT.send({
                type: "click",
                ac: "b",
                position: "notepad",
                sort: "list",
                modId: "notepad"
            });
        }
    });

    // Delete button
    container.on("click", ".sidebar-notepad-del", function() {
        var aid = $(this).parent().attr("data-aid");
        that.del(aid);
        // User track
        UT.send({
            type: "click",
            ac: "b",
            position: "notepad",
            sort: "del",
            modId: "notepad"
        });
    });

    // Input tips switch
    $("#notepadTitle", container).live({
        focus: function() {
            $("#notepadTip").hide();
        },
        blur: function() {
            that.inputTipSwitch();
        },
        // Focus on the content when click 'TAB' or 'ENTER' in title area
        keydown: function(e) {
            var key = e.which;
            if (key === 9 || key === 13) {
                e.preventDefault();
                $("#notepadArticle").focus();
            }
        }
    });

    // Focus on the title input box when clicking on the tips
    $("#notepadTip", container).live("mousedown", function() {
        $("#notepadTitle").focus();
    });

    //modify title
    container.on("click", ".sidebar-notepad-tle", function() {
    	$(this).hide();
    	$("#notepadTitle").focus();
    });
};

Gl.notepad.switchTab = function() {

    var that = this;
    if (isInit) {
        container.show();
        //$("#notepadArticle").focus();
    } else {
        if (window.loginCtroller && window.loginCtroller.verify == 1) {
            // If the user has been login, show articles list directly.
            that.initNotes();
        } else {
            // Else show login page
            container.append(loginContent).show();
            isInit = true;
        }
    }
};

// 生成用户facebook信息
Gl.notepad.createFbMsg = function() {

    var that = this;
    if (window.loginCtroller && window.loginCtroller.checkStatus) {
        window.loginCtroller.checkStatus({
            success: function(data) {
                $.extend(true, data, _conf);
                fbContent = $(helper.replaceTpl(fbContent, data));
                $(".sidebar-notepad-first", container).prepend(fbContent).show();
            },
            error: function() {
                // alert("error")
            }
        });
    }
};

// create scrollbar for title list
Gl.notepad.createScroll = function() {
    require.async("common:widget/ui/scrollable/scrollable.js", function() {
        $(".sidebar-notepad-list-container", container).eq(0).scrollable({
            autoHide: false,
            onScroll: function() {

            }
        });
    });
};

// Show and init the notepad, start to loading the notes.
Gl.notepad.initNotes = function() {

    var that = this;
    loginContent.remove();
    container.append(noteContent).show();
    that.createFbMsg();

    that.getList(); // Get the articles list
    that.inputStatus(); // Checking input status
    that.createScroll(); // Create scrollbar
    isInit = true; // Notepad has been initialized
    setTimeout(function() {
        $(".sidebar-notepad", container).css("visibility", "visible");
    }, 1500);
};

// check whether the textarea has been updated
Gl.notepad.inputStatus = function() {
    var title = $("#notepadTitle", container),
        article = $("#notepadArticle", container),
        saveBtn = $("#notepadSave", container),
        hasOverflow = false; // Whether the content length over 10000

    isChange = false; // Init change status
    titleText = title.val();
    articleText = article.val();
    clearInterval(interval);
    $("#notepadNotice").hide();

    saveBtn.addClass("sidebar-notepad-save-disable");

    interval = setInterval(function() {
        // When the user has input, enable the save button
        if (titleText !== title.val() || articleText !== article.val()) {
            saveBtn.removeClass("sidebar-notepad-save-disable");
        }
    }, _conf.checkRate);
};

// Get the article's title list
Gl.notepad.getList = function() {
    var that = this;

    $.ajax({
        url: "/cloudnote/gettitle",
        data: null,
        type: "POST",
        success: function(data) {
            if (!$.parseJSON(data).status || $.parseJSON(data).status != "200") return;

            var num = 0;
            // var aid;
            data = $.parseJSON(data).data;
            /*if(data[0]) {
				aid = data[0].aid;
			}*/
            for (var i in data) {
                that.createList(data[i]);
                num = num + 1;
            };
            if(num === 0) {
            	container.addClass('sidebar-notepad-fresh');
            }
            var getNum = setInterval(function() {
                if ($("#notepadNum").length) {
                    $("#notepadNum").html(num);
                    clearInterval(getNum);
                }
            }, 400);

            // Auto save
            setInterval(function() {
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
Gl.notepad.showContent = function(aid) {
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
        //$("#notepadTle").html(data.title);
        $("#notepadArticle").focus().val(data.content); // Focus on the textarea
        $("#notepadCreateTime").text(data.ct);
        $("#notepadSave").attr("data-aid", aid);
        that.inputStatus(); // Check the input status
        that.inputTipSwitch();
    } else if (!aid || aid === "undefined") {
        var ct = helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(createTime)));
        // If the article has no aid, then add a new one.
        $("#notepadTitle").val("");
        //$("#notepadTle").html("");
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
            success: function(data) {
                data = $.parseJSON(data).data;
                if (data) {
                    var date = new Date(data.ct >= 2147483647 ? parseInt(data.ct) : data.ct * 1000); // Check the create time format is in seconds or millisecond
                    date = helper.replaceTpl(_conf.timeTpl, time.getForm(date));
                    $("#notepadTitle").val(data.title);
                    //$("#notepadTle").html(data.title);
                    $("#notepadArticle").focus().val(data.content); // Focus on the textarea
                    $("#notepadCreateTime").text(date);
                    // Bind article info with $.data
                    listEle.data("data", {
                        aid: aid,
                        title: data.title,
                        content: data.content,
                        ct: date
                    });
                } else {
                    $("#notepadTitle").val("");
                    //$("#notepadTle").html("");
                    $("#notepadArticle").focus().val(""); // Focus on the textarea
                    $("#notepadCreateTime").text("");
                    // Bind article info with $.data
                    listEle.data("data", {
                        aid: aid,
                        title: "",
                        content: "",
                        ct: ""
                    });
                }
                $("#notepadSave").attr("data-aid", aid);
                that.inputStatus(); // Check the input status
                that.inputTipSwitch();
            }
        });
    }
};

// Create article's info into the titles' list
Gl.notepad.createList = function(opt) {
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
    date.y = date.y.toString().substring(2);
    ct = helper.replaceTpl(_conf.timeTpl.split(" ")[0], date);
    list = $(helper.replaceTpl(listTpl, {
        aid: aid,
        title: title,
        ct: ct
    }));

    // Add active status when the article is the current one.
    if (aid == currentAid) {
        list.addClass("sidebar-active");
        $("#notepadList li").removeClass("sidebar-active");
    }
    $("#notepadList").prepend(list);

    return list; // Return the list object
};

Gl.notepad.inputTipSwitch = function() {
	var val = $("#notepadTitle").val();
	$("#notepadTle").html(val);
    if (val === "") {
        $("#notepadTip").show();
        container.find(".sidebar-notepad-tle").hide();
    } else {
        $("#notepadTip").hide();
        container.find(".sidebar-notepad-tle").show();
    }
};

// Add a new article
Gl.notepad.add = function(opt) {
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
    $("#notepadList li").removeClass("sidebar-active");
    $("#notepadTitle").val(title);
    //$("#notepadTle").html(title);
    $("#notepadArticle").focus().val(content); // Focus on the textarea
    $("#notepadCreateTime").text(ct);
    // Reset save button
    $("#notepadSave").attr("data-aid", "").text(_conf.saveBtn);
    clearTimeout(t);
    that.inputStatus(); // Start to check input status
    that.inputTipSwitch();
};

// Save & Create articles
Gl.notepad.save = function(opt) {
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
            //$("#notepadSave").text(_conf.savedText);
            // $("#notepadSaved").addClass("sidebar-notepad-saved-show");
            // t = setTimeout(function() {
            //     //$("#notepadSave").text(_conf.saveBtn);
            //     $("#notepadSaved").removeClass("sidebar-notepad-saved-show");
            // }, _conf.savedTimeout);
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
                var list = that.createList({
                    title: title,
                    content: content,
                    ct: ct
                });
            }
            $("#notepadTitle").val(title);
            //$("#notepadTle").html(title);
            that.inputTipSwitch();
            $.ajax({
                url: "/cloudnote/create",
                data: {
                    time: Math.floor(ct / 1000), // Set create time format in seconds in case of database overflow
                    title: title,
                    content: content
                },
                type: "POST",
                success: function(data) {
                    data = $.parseJSON(data).data;
                    if (data) {
                        list.attr("data-aid", data.aid);
                        if (!$("#notepadSave").attr("data-aid") && $("p", $("#notepadList li").eq(0)).text() !== "") {
                            $("#notepadSave").attr("data-aid", data.aid);
                        }
                        // Bind article info with $.data
                        list.data("data", {
                            aid: data.aid,
                            title: title,
                            content: content,
                            ct: helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(ct)))
                        });
                        $("#notepadNum").html(parseInt($("#notepadNum").html(), 10) + 1);
                    }
                }
            });
            isChange = false; // Restore changing status
        } else {
            var save = function() {
                $.ajax({
                    url: "/cloudnote/save",
                    data: {
                        aid: aid,
                        title: title,
                        content: content
                    },
                    type: "POST",
                    success: function() {
                        canSave = true; // saving process is end
                    },
                    error: function() {
                        canSave = true; // saving process is end
                    }
                });
            };
            // If the article's aid is available, save it.
            var listEle = $("#notepadList li[data-aid='" + aid + "']");
            $("p", listEle).text(title);
            $("#notepadTitle").val(title);
            //$("#notepadTle").html(title);
            that.inputTipSwitch();
            // Check save list state
            if (canSave) {
                canSave = false;
                save();
            } else {
                // Abandon the last saving process after timeout
                setTimeout(function() {
                    canSave = true;
                    save();
                }, _conf.saveListTimeout);
            }
            isChange = false; // Restore changing status
            // Bind article info with $.data
            listEle.data("data", {
                aid: aid,
                title: title,
                content: content,
                ct: helper.replaceTpl(_conf.timeTpl, time.getForm(new Date(ct)))
            });
        }
    }
};

// Delete an article with its aid
Gl.notepad.del = function(aid) {
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
        //$("#notepadTle").html("");
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
        type: "POST",
        success: function(data) {
            data = $.parseJSON(data).status;
            (data < 500) && $("#notepadNum").html(parseInt($("#notepadNum").html(), 10) - 1);
        }
    });
};
