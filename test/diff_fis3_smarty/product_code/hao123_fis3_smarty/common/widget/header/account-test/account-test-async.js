String.prototype.replaceTpl = function (o){
	return this.replace(/#\{([^}]*)\}/gm,function(v,k){return v=o[k]||""})
};

var $      = require("common:widget/ui/jquery/jquery.js"),
    helper = require("common:widget/ui/helper/helper.js"),
	UT     = require("common:widget/ui/ut/ut.js");

/**
 * loginCtroller代表初始化。在index.html页面333行。
 */
! function(WIN, conf) {
	var wrap   = $("#accountWrap"),
		dropDwon = $(".account-dropdown_wrap"),
	    login  = $(".account_login-tip"),
	    logout = $(".account_logout-tip"),
		elName = logout.find(".account_logout_name"),
		elMail = logout.find(".account_logout_email"),
		elImg  = logout.find("img"),
		elLogout = logout.find(".account_logout_btn"),
		mask     = wrap.find(".account_trig"),
		dir      = conf.dir,
		headImgUrl = conf.commonLogin.defauUrl;

	var conf = conf.commonLogin,
		self = WIN.loginCtroller = {
			/**
			 * verify user login status
			 * 2 ==> unlogin | 1 ==> already login
			 * vertify:2 ==>代表“没有登录”的状态，vertify:1 ==>代表“登录”的状态
			 * uid ==> 用户唯一标识
			 * loginUrl ==> 配置的参数，代表向服务器端发送的请求，参数，这里有一些参数需要转换编码，目前还没有弄懂参数的编码转换的含义
			 */
			verify   : 2,
			uid      : 0,
			loginUrl: conf.hao123LoginUrl.replaceTpl({
				idc: conf.idcMap[conf.countryCode],
				country: conf.countryCode,
				level: conf.level
			}),

			// type : 1.代表登录状态，并且请求的数据data存在的情况
			// type ：2.代表默认状态，没有登录成功
			// 最后的self.verify代表渲染页面之后将登录状态修改为当前值，type :1为已经登录，2:为未登录
			render: function(type, data) {
				var img    = new Image(),
				    imgUrl = "";

				if (type == 1 && data) {

					login.hide();
					elName.html(data.uname);
					//调整email的换行显示策略
					var emailContent = data.email;
					var emailArray = emailContent.split("@");
					if (emailContent.length > 17 && emailContent.indexOf("@") < 15) {
						emailContent = emailArray[0] + "<br/>@" + emailArray[1];
					}
					elMail.html(emailContent);

					self.uid    = data.uid;
					self.bindid = data.bindid;
					imgUrl = helper.replaceTpl(headImgUrl, {
						id: data.bindid
					});
					img.src = imgUrl;
					setTimeout( function() {
						elImg.attr("src", imgUrl);
					    if($("#headPic").length > 0) {
					    	$("#headPic").attr("src", imgUrl);
					    } else {
					    	mask.removeClass("account_title").html("<img id='headPic' src='" + imgUrl + "' />");
					    }
					    wrap.addClass("account-login_suc");
					}, 500);

				} else {
				    if (/(png|gif|jpg|jpeg)/i.test(conf.defauImg)) {
					    mask.removeClass("account_title").html("<img id='headPic' src='" + conf.defauImg + "' />");
				    } else {
					    mask.addClass("account_title").html(conf.defauImg);
				    }
					wrap.removeClass("account-login_suc");
					elLogout.attr("href", helper.replaceTpl(conf.logoutUrl, {
						idc: encodeURIComponent(conf.idcMap[conf.countryCode]),
						"gotourl": encodeURIComponent(document.location.href)
					}));
				}

				// update status when user login.
				self.verify = type;
			},
			/**
			 * 检查登录的状态
			 * Check user's status about wheather they have been login.
			 * @param url ==> target url;
			 * success ==> excute something when finish
			 * error ==> when login failure
			 * (1)obj为传入的对象值
			 * (2)ajax发送请求,cache：false；
			 * (3)url:请求地址，转码后的地址
			 * (4)success:成功之后要处理的事情
			 * (5)error:失败后的信息提示
			 */
			checkStatus: function(obj) {
				obj = obj || {};
				$.ajax({
					cache: false,
					url: helper.replaceTpl(conf.checkLoginUrl, {
						countryCode: encodeURIComponent(conf.countryCode)
					}),
					success: function(data) {
						data = eval("(" + data + ")");
						if(data && data.status == 1 && obj.success) {
							// record facebook id
							data.bindid && $.cookie("__FBID", data.bindid, {
							    expires: 10*365,
							    path: '/'
							});
							obj.success(data);
						}
						else obj.error && obj.error();
					},
					error: function() {
						obj.error && obj.error();
					}
				});
			},

			/*

			loginCtroller.fire(url,width,height);
			login layout fold ==> loginCtroller.fire.call(jQuery("#fBook")[0]);
			params:

			url, width, height
			*/
			fire: function(url, width, height) {
				if (self.verify == 1) {

					return self.verify;
				}

				// UT.send({
				// 	"type"     : "click",
				// 	"position" : "login",
				// 	"sort"     : "login",
				// 	"modId"    : "account"
				// });
				document.domain = "hao123.com";

				var w = width  || conf.iWidth,
					h = height || conf.iHeight;

				WIN.open(url || self.loginUrl, "newwindow", "height=" + h + ",innerHeight=" + h + ",width=" + w + ",innerWidth=" + w + ",top=" + (WIN.screen.availHeight - 30 - h) / 2 + ",left=" + (WIN.screen.availWidth - 30 - w) / 2 + ",toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no");
			},
			/**
			 * 为联合登录执行的操作
			 * @param  {[array]} data [需要处理的联合登录url列表]
			 * 登录成功后，从数据中得到需要处理的联合登录url的列表，遍历列表，对每个url填入联合登录所需的参数（参数如下，值从cookie中取），然后请求url，触发后端在其域下种下相应cookie
			 * (1)type: [facebook | twitter | google | yahoo]
			 * (2)uss: urlencode之后的第三方的access_token
			 * (3)bduss: 百度的token
			 * (4)level: 权限级别，业务自己的level，顶部为1，侧边栏为2
			 * (5)thid: 用户在第三方的唯一id，非必填
			 */
			unitedLogin: function(data){
				var suffix = "?type=#{type}&uss=#{uss}&bduss=#{bduss}&level=#{level}&thid=#{thid}",
					imgList = [];
				$.each(data.loginurl, function(i,v){
					imgList[i] = new Image();
					imgList[i].src = helper.replaceTpl(v+suffix, {
						type: $.cookie("LOGINTYPE") || "",
						uss: $.cookie("USS") || "",
						bduss: $.cookie("BDUSS") || "",
						level: $.cookie("LEVEL") || "",
						thid: $.cookie("THIRDID") || ""
					});
				});
			},
			/**
			 * 初始化执行的操作
			 * @param  {[type]} data [description]
			 * @return {[type]}      [description]
			 * (1)hao123LoginCallback:回调函数:不错在data或者未登录的状态时要执行的事情==>弹窗
			 *    如果成功，执行“统计”请求；并且渲染页面
			 * (2)绑定点击事件:在整个按钮点击的情况下，首先，判断登录状态(“1”为登录，“2”为未登录)
			 * 	  登录状态下：给最外层div添加样式“mod-login--unfold”(这个样式在login_mod.css文件里),		 做的操作就是将div展开,并且将里面的(图片，姓名，邮箱，lougout按钮)样式切换到大图状态。
			 * (3)第二种情况 ==>未登录。首先，发送统计请求，再执行window.open方法，打开登录页面的窗口->    登录
			 * (4)给body绑定事件：移除大图下面所有效果，切换为小图状态。
			 * (5)给logout标签绑定“统计”事件。
			 * (6)最后一步调用“checkStatus”方法，如果成功的话，渲染页面
			 */
			init: function(data) {

				//self.render(1,data);
				// 1. reg global callback
				WIN.hao123LoginCallback = function(data) {
					if (!data || data.status != 1) {
						return alert(conf.txtErrorMsg);
					}
					// record facebook id
					data.bindid && $.cookie("__FBID", data.bindid, {
					    expires: 10*365,
					    path: '/'
					});

					UT.send({
						"type"     : "access",
						"position" : "login"
					});
					self.render(data.status, data);
					Gl.history && Gl.history.get(); //Get the sites list again for history widget
					Gl.notepad && Gl.notepad.initNotes(); // intialize notepad while available
					Gl.hotsiteFB && Gl.hotsiteFB.start();
					Gl.loginPopup && Gl.loginPopup.remove(); //close login popup
					$(WIN).trigger("dailySign.login"); // daily sign

					// united login for tieba .etc
					data.loginurl && self.unitedLogin(data);

				};

				var isInsert = false;

				// 2. bind button event
				login.on("click", function() {
					if(self.verify != 1) {
						UT.send({
					        "type"     : "click",
					        "ac"       : "b",
					        "position" : "login",
					        "sort"     : "login",
					        "modId"    : "account"
				        });
					}
					self.fire.call(this);
				});

				mask.on("click", function() {
					if(wrap.hasClass("account-login_suc")) {

					} else {
						if(self.verify != 1) {
							UT.send({
					        	"type"     : "click",
					        	"ac"       : "b",
					        	"position" : "login",
					        	"sort"     : "login",
					        	"modId"    : "account"
				        	});
						}
						self.fire.call(this);
					}
				});
				wrap.hover(function() {
					if(wrap.hasClass("account-login_suc")) {
						login.hide();
						logout.show();
					} else {
					    login.css(dir == 'ltr' ? 'right' : 'left', (parseInt(mask.outerWidth() / 2 - 19, 10)) + 'px');
						login.show();
						logout.hide();
					}
					dropDwon.show();
					mask.addClass("module-mask");
					UT.send({
						modId: "msgbox",
						type: "others",
						sort: "hover",
						position: "accounticon"
					});
				}, function() {
					dropDwon.hide();
					mask.removeClass("module-mask");
				});


				elLogout.on("click", function() {
					UT.send({
						"type"    : "click",
						"position": "login",
						"sort"    : "logout",
						"modId"   : "account"
					});
				});
				// 3. check status
				self.checkStatus({
					success: function(data) {
						self.render(1, data);
					},
					error: function() {
						// alert("error")
					}
				});
				// 4. init render
				self.render(2);
			}
		};
}(window, conf);
