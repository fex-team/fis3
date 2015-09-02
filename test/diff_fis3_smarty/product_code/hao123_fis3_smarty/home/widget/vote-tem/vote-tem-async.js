var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var helper = require('common:widget/ui/helper/helper.js');

var voteTel = function(){
	var that = this;

	that.voteTemWrap = $("#voteTem");

	that.exchangeBtn = $("#vote-exchange-btn");
	/*结果页外层容器*/
	that.resultWrap = '<div class="vote-template-result">'
					  +'<div class="vote-tel-title">'
					  + '<span></span>'
					  +'<div class="vote-tel-result-back"></div>'
					  +'</div>'
					  +'<ul class="vote-tel-result-items"></ul>'
					  +	'<div class="vote-handle-area-result vote-tel">'
						  +	'<a class="vote-share"><i></i><span></span></a>'
					  +'</div>'
					  +'</div>';
	/*结果页分项*/
	that.resultTpl = '<li class="vote-tel-items-del" index="">'
						+'<i><span></span></i>'
						+ '<a class="vote-tel-items-name" title="">...</a>'
						+ '<span class="vote-tel-items-percent-wrap">'
							+ '<span class="vote-tel-items-percent"></span>'
						+ '</span>'
						+ '<span class="vote-tel-items-num">...</span>'
						+ '<span class="vote-result-checked"></span>'
					+ '</li>';
	/*投票页外层容器*/
	that.voteTemplate = '<div class="vote-template">'
						+'<div class="vote-tel-title">'
						+	'<span></span>'
						+	'</div>'
						+'<div class="vote-tel-area">'
						+'</div>'
						+'<div class="vote-handle-area">'
						+	'<div class="vote-tel-btn"></div>'
						+	'<div class="vote-tel-result"></div>'
						+'</div>'
						+'</div>';
	/*投票页分项*/
	that.imgTpl =	'<div class="vote-item" index="">'
					+	'<img src=""/>'
					+	'<span class="vote-item-text" title=""></span>'
					+	'<div class="vote-checked"></div>'
					+'</div>';

	/*是非题模板*/

	that.agreeTpl = '<div class="pray-template">'
						+ '<div class="vote-tel-title pray-title">'
							+ '<span></span>'
						+ '</div>'
						+ '<img src="" class="pray-template-img" />'
						+ '<div class="vote-agree-ordis">'
							+ '<div class="vote-agree" index="1"></div>'
							+ '<div class="vote-disagree" index="2"></div>'
						+ '</div>'
						+ '<div class="vote-common-line"></div>'
						+ '<div class="vote-handle-area-result pary-tel">'
							+	'<div class="vote-share"><i></i><span></span></div>'
						+ '</div>'
				    + '</div>';
	// cache share data
	that.shareConf = conf.voteAreaEl.voteArray;
	// encode share data
	$.each(that.shareConf, function(k, v){
		$.extend(v, {
			shareTitle: encodeURIComponent(v['shareTitle']),
			shareTextPre: encodeURIComponent(v['shareTextPre']),
			shareTextLast: encodeURIComponent(v['shareTextLast']),
			shareImg: encodeURIComponent(v['shareImg']),
			shareText: encodeURIComponent(v['shareText']),
			prayImg: encodeURIComponent(v['prayImg']),
			redirectURL: encodeURIComponent(conf.defaultDisplay.redirectURL),
			appId: conf.fbAppId
		});
	});
	// extract share tpl
	$.extend(that.shareConf, {
		shareTpl: {
			twitter: {
				redirect_url: "https://twitter.com/intent/tweet?text=#{shareTextPre}#{arr}#{shareTextLast}&url=#{redirectURL}",
				redirect_url01: "https://twitter.com/intent/tweet?text=#{shareText}&url=#{redirectURL}"
			},
			facebook: {
				redirect_url: "https://www.facebook.com/dialog/feed?app_id=#{appId}&display=popup&link=#{redirectURL}&picture=#{shareImg}&name=#{shareTitle}&description=#{shareTextPre}#{arr}#{shareTextLast}&to=&redirect_uri=https://www.facebook.com/",
				redirect_url01: "https://www.facebook.com/dialog/feed?app_id=#{appId}&display=popup&link=#{redirectURL}&picture=#{shareImg}&name=#{shareTitle}&description=#{shareText}&to=&redirect_uri=https://www.facebook.com/"
			}
		}
	});

	that.init(conf.defaultDisplay.defaultNum);

	//换一换按钮操作
	that.exchangeBtnEl();
}

voteTel.prototype = {
	/*投票按钮*/
	voteBtnEl:function(only){
		var _this = this,
			arr = [],
			index = '',
			voteUl = this.voteTemWrap.find(".vote-tel-area"),
			voteItem = voteUl.find(".vote-item"),
			voteBtn = this.voteTemWrap.find(".vote-tel-btn"),
			exchangeBtn = $("#vote-exchange-btn");
		// ======================================================
		//	1.投票按钮点击后，如果没有选项，则不可投票
		//	2.投票后，隐藏换一换按钮
		//	3.请求投票借口，渲染结果页面renderResultData(index，only)
		//	4.滑动到结果页面：switchItems();
		// ======================================================
		voteBtn.on("click",this,function(){
			arr = [];
			if($(this).hasClass("voted-check")){
				return;
			}else{
				if(voteUl.find(".votechecked").length == 0){
					return;
				}else{
					exchangeBtn.css("visibility","hidden");
					$(this).addClass("voted-check");
				}
				voteItem.each(function(){
					if($(this).hasClass("votechecked")){
						arr.push($(this).attr("index"));
					}
				});
				_this.renderResultData(arr,only);
				_this.switchItems();
				UT.send({type:"click",ac:"b",position:"vote-handle",modId:"vote-wraper"});
			}
		});
	},
	/*查看结果按钮*/
	resultBtnEl:function(only){
		var _this = this,
			resultBtn = this.voteTemWrap.find(".vote-tel-result"),
			exchangeBtn = $("#vote-exchange-btn"),
			voteBtn = this.voteTemWrap.find(".vote-tel-btn");
		// ===========================================================
		//	1.查看结果按钮点击后，隐藏换一换按钮
		//	2.查看结果：没有投票选项，结果对勾隐藏resultItemsEl("hidden")
		//	3.请求投票借口，index参数不选，即不投票renderResultData("",only)
		//	4.滑动到结果页面switchItems()
		// ===========================================================
		resultBtn.on("click",this,function(){
			exchangeBtn.css("visibility","hidden");
			/*隐藏结果对号*/
			_this.renderResultData("",only);
			_this.switchItems();
			if(voteBtn.hasClass("voted-check")){
				return;
			}else{
				_this.resultItemsEl("hidden");
			}
			UT.send({type:"click",ac:"b",position:"result-handle",modId:"vote-wraper"});
		});
	},
	/*查看按钮、投票按钮点击后左右滑动操作*/
	switchItems:function(){
		var voteItem = this.voteTemWrap.find(".vote-item"),
			voteBtn = this.voteTemWrap.find(".vote-tel-btn");

		this.voteTemWrap.animate({"left":conf.dir == "rtl" ? "100%" : "-100%"},"slow",function(){
			if(voteBtn.hasClass("voted-check")){
				return;
			}else{
				voteItem.find(".vote-checked").hide();
				voteItem.removeClass("votechecked");
				voteItem.removeAttr("sort");
			}

		});
	},
	/*返回按钮操作*/
	backBtnEl:function(){
		var _this = this,
			voteBackBtn = this.voteTemWrap.find(".vote-tel-result-back");

		voteBackBtn.on("click",this,function(){
			_this.switchItemsBack();
			UT.send({type:"click",ac:"b",position:"back-handle",modId:"vote-wraper"});
		})
	},
	/*返回按钮操作后，页面左右滑动滑回主页面*/
	switchItemsBack:function(){
		var _this = this,
			resultItem = this.voteTemWrap.find(".vote-tel-items-del"),
			exchangeBtn = $("#vote-exchange-btn"),
			voteBtn = this.voteTemWrap.find(".vote-tel-btn");
		/// ========================================================
		//	1.返回按钮点击，将结果进度条置空
		//	2.结果显示的序号隐藏
		//	3.换一换按钮显示
		//	4.结果对号隐藏，下次再次进入后有可能结果改变resultItemsEl("hidden");
		/// =========================================================
		this.voteTemWrap.animate({"left":"0"},"slow",function(){
			resultItem.find(".vote-tel-items-percent").width(0);
			resultItem.find("i").css("visibility","hidden");
			exchangeBtn.css("visibility","visible");
			if(voteBtn.hasClass("voted-check")){
				return
			}else{
				_this.resultItemsEl("hidden");
			}
		});
	},
	/*换一换按钮操作*/
	exchangeBtnEl:function(){
		var _this = this,
			exchangeBtn = $("#vote-exchange-btn"),
			arr = [],
			last = conf.defaultDisplay.defaultNum;
		for(var i=0;i<conf.voteAreaEl.voteArray.length;i++){
			arr.push(i);
		}

		function getRandom(){
		    return arr[Math.floor(Math.random()*arr.length+1)-1];
		}
		/*换一换之后的一项和前一项不同*/
		exchangeBtn.click(function(){

			var current = getRandom();

			!function(){
			    if( current == last){
			        current = getRandom();
			        arguments.callee();
			    }else{
			        last = current;

			    }
			}();
			/// ==================================
			//	1.置空内容区，重新渲染配置选项
			//	2.重新渲染页面的内容随机分配且于前一个不同
			/// ==================================
			_this.voteTemWrap.html("");

			_this.init(current);

			UT.send({type:"click",ac:"b",position:"exchange",modId:"vote-wraper"});
		})
	},
	/*图片选项操作*/
	handleItems:function(only){
		var _this = this,
			sortIndex = 0,
			sortArray = [],
			num = 0,
			voteItem = this.voteTemWrap.find(".vote-item"),
			voteBtn = _this.voteTemWrap.find(".vote-tel-btn");
		/// ==================================
		//	1.图片选项鼠标滑动后，显示相对应的策略
		//		1）如果是选中的则不做操作
		//	2.鼠标离开后取出相对应策略
		//	3.点击行为
		/// ==================================
		voteItem.on("mouseenter",this,function(){
			if(voteBtn.hasClass("voted-check")){
				return ;
			}else{
				if($(this).find(".vote-checked").is(":hidden")){
					$(this).addClass("vote-tel-active");

				}else{
					return;
				}
			}
		}).on("mouseleave",this,function(){
			$(this).removeClass("vote-tel-active");

		}).on("click",this,function(){
			var $this = $(this),
				tmpIndex = $this.attr("index"),
				resultItem = _this.voteTemWrap.find(".vote-tel-items-del");
			// =============================================================
			//	1.如果对号隐藏，分两种情况
			//		1）在选中的选项总和没有大于配置的最大选项时，显示点击后的策略
			//		2）如果总和大于配置的最大项，显示当前项策略不变，但是移出第一个选择的项
			//		3）同时对应结果页面的选中对号采取相同策略
			//	2.如果对号没有隐藏，直接采取显示的策略
			// ==============================================================
		if(voteBtn.hasClass("voted-check")){
			return ;
		}else{
			if($this.find(".vote-checked").is(":hidden")){
				if($(".votechecked").length >= conf.voteAreaEl.voteArray[only]['voteMaxNum']){
					//显示当前项，给其添加sort属性依次递增
					$this.find(".vote-checked").show();
					$this.addClass("votechecked");
					$this.attr("sort",sortIndex+=1);

					//显示对应结果页的对号
				    resultItem.each(function(){
				        if($(this).attr("index") == tmpIndex){
				            $(this).find(".vote-result-checked").css("visibility","visible");
				            $(this).attr("sort",num+=1);
				        }
				    });
					/// ================================================
					//	1.去除第一个选项，每项点击后新增一个sort属性点击一次增加1
					//	2.当超出配置选项后将最小的移出
					//	3.同时移出对应的属性
					/// ================================================
					sortArray = [];
					voteItem.each(function(){
						if($(this).attr("sort")){
							sortArray.push(parseInt($(this).attr("sort")))
						}
					});
					var tmp = Math.min.apply(null,sortArray);
					voteItem.each(function(){
						if(parseInt($(this).attr("sort")) === tmp){
							$(this).find(".vote-checked").hide();
							$(this).removeClass("votechecked");
							$(this).removeAttr("sort");
						}
					});

					/**结果页面的选项移出*/

					sortArray2 = [];
					resultItem.each(function(){
						if($(this).attr("sort")){
							sortArray2.push(parseInt($(this).attr("sort")))
						}
					});
					var tmp2 = Math.min.apply(null,sortArray2);
					resultItem.each(function(){
						if(parseInt($(this).attr("sort")) === tmp2){
							$(this).find(".vote-result-checked").css("visibility","hidden");
							$(this).removeAttr("sort");
						}
					});


				}else{

					$this.find(".vote-checked").show();
					$this.addClass("votechecked");
					$this.attr("sort",sortIndex+=1);

					//显示对应结果页的对号

				    resultItem.each(function(){
				        if($(this).attr("index") == tmpIndex){
				            $(this).find(".vote-result-checked").css("visibility","visible");
				            $(this).attr("sort",num+=1)
				        }
				    });
				}
			}else{
				//显示对应结果页的对号
			    resultItem.each(function(){
			        if($(this).attr("index") == tmpIndex){
			            $(this).find(".vote-result-checked").css("visibility","hidden");
			        }
			    })

				$this.find(".vote-checked").hide();
				$this.removeClass("votechecked");
				$this.removeAttr("sort");
			}
			$this.removeClass("vote-tel-active");
			/***
			*	按钮可点
			*/
			if($(".votechecked").length){
				_this.voteTemWrap.find(".vote-tel-btn").addClass("vote-btn-w");
			}else{
				_this.voteTemWrap.find(".vote-tel-btn").removeClass("vote-btn-w");
			};

		}
			UT.send({type:"click",ac:"b",position:"vote-item",modId:"vote-wraper"});
		});
	},
	/*结果对号的显影*/
	resultItemsEl:function(how){
		var resultItem = this.voteTemWrap.find(".vote-tel-items-del");
		/*显示几个结果项*/
		resultItem.each(function(){
			$(this).find(".vote-result-checked").css("visibility",how);
	       	$(this).removeAttr("sort");
		});
	},
	/*请求数据*/
	renderResultData:function(id,only){
		var	_this = this,
			voteparams = "?app=vote&country="+conf.country+"&vote_id="+conf.voteAreaEl.voteArray[only]['vid']+"&vnum="+conf.voteAreaEl.voteArray[only]['item'].length;

		id = id || "";
		voteparams = id ? voteparams+"&id="+id.join(',')+"&act=mCastVote&vk=0":voteparams+"&act=mGetVote&vk=0";
		$.ajax({
			url:conf.apiUrlPrefix+voteparams,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(voteparams,16),
			cache: false,

			success:function(result){
				/*循环插入common数据*/
				var result = result.content.data;
				var voteItemDel = _this.voteTemWrap.find(".vote-tel-items-del");

				/*为前面的小图标排序*/
				var result_extra = _this.sortData(result);

				voteItemDel.each(function(i){
					$(this).find(".vote-tel-items-name").text(result_extra[i].name);
					$(this).find(".vote-tel-items-name").attr("title",result_extra[i].name);
					$(this).find("i").find("span").text(result_extra[i].r);
					$(this).find(".vote-tel-items-num").text(result[i].n);
					$(this).find(".vote-tel-items-percent").css({"background": _this.getRandomColor});
					$(this).find(".vote-tel-items-percent").animate({"width" : $("body").hasClass("flow-on") ? parseInt(result[i].p)*100/100 : parseInt(result[i].p)*65/100},1000,function(){});
				});
				/*滑动完毕后显示排名*/
				voteItemDel.each(function(){
					if($(this).find("i").find("span").text() <= conf.voteAreaEl.voteArray[only]['displayNum']){
						$(this).find("i").css("visibility","visible");
					}
				});
			},
			error:function(){

			}
		});
	},
	renderAgreeData:function(id,only){
		var	_this = this,
			voteparams = "?app=vote&country="+conf.country+"&vote_id="+conf.voteAreaEl.voteArray[only]['vid']+"&vnum=2&id="+id+"&act=mCastVote&vk=0";

			$.ajax({
			url:conf.apiUrlPrefix+voteparams,
			dataType: "jsonp",
			jsonp: "jsonp",
			jsonpCallback: "ghao123_" + hex_md5(voteparams,16),
			cache: false,

			success:function(result){
				/*循环插入common数据*/
				var result = result.content.data,
					agreeResult = _this.voteTemWrap.find(".vote-agree"),
					disagreResult = _this.voteTemWrap.find(".vote-disagree"),
					agreeBtnResult,
					disagreeBtnResult;

				conf.dir == 'ltr' ? agreeBtnResult = conf.voteAreaEl.voteArray[only]['agreeBtn']+"("+result[0].n+")" : agreeBtnResult = "("+result[0].n+")"+conf.voteAreaEl.voteArray[only]['agreeBtn'];
				conf.dir == 'ltr' ? disagreeBtnResult = conf.voteAreaEl.voteArray[only]['disagreeBtn']+"("+result[1].n+")" : disagreeBtnResult = "("+result[1].n+")" + conf.voteAreaEl.voteArray[only]['disagreeBtn'];
				/*插入是非题按钮内容*/
				agreeResult.text(agreeBtnResult);
				disagreResult.text(disagreeBtnResult);
				/*添加样式*/
				agreeResult.addClass("voted-check");
				disagreResult.addClass("voted-check");
			},
			error:function(){

			}
		});
	},
	/*投票页渲染*/
	renderImgItems:function(only){

		var _this = this;

		//渲染外层容器
		_this.renderWrap(only);
		//内层容器插入
		_this.renderInner(only);

		//操作数据
		_this.handleItems(only);
	},
	/*投票页渲染外层容器*/
	renderWrap:function(only){
		var domWrap = '';
		this.voteTemWrap.append(domWrap + this.voteTemplate);

		var voteTitle = this.voteTemWrap.find(".vote-tel-title"),
			voteHandle = this.voteTemWrap.find(".vote-handle-area");
		voteTitle.find('span').text(conf.voteAreaEl.voteArray[only]['title']);
		voteHandle.find('.vote-tel-btn').text(conf.voteAreaEl.voteArray[only]['voteButton']);
		voteHandle.find('.vote-tel-result').text(conf.voteAreaEl.voteArray[only]['result']);
	},
	/*投票页渲染内层图片*/
	renderInner:function(only){
		var dom = '';
		for(var i=0;i<conf.voteAreaEl.voteArray[only]['item'].length;i++){
			dom = dom + this.imgTpl;
		}
		//渲染内层图片
		var voteUl = this.voteTemWrap.find(".vote-tel-area");
		voteUl.append(dom);
		//渲染CMS数据
		voteUl.find(".vote-item").each(function(i){
			$(this).addClass("vote-item-0" + conf.voteAreaEl.voteArray[only]['item'].length);
			$(this).attr("index",$(this).index()+1);
			$(this).find("img").addClass("vote-item-img0" + conf.voteAreaEl.voteArray[only]['item'].length);
			$(this).find("img").attr("src",conf.voteAreaEl.voteArray[only]['item'][i].img);
			$(this).find(".vote-item-text").text(conf.voteAreaEl.voteArray[only]['item'][i].text);
			$(this).find(".vote-item-text").attr("title",conf.voteAreaEl.voteArray[only]['item'][i].text);
			$(this).find(".vote-checked").addClass("vote-checked-0" +conf.voteAreaEl.voteArray[only]['item'].length);
		});
	},
	/*结果页面渲染*/
	renderUl:function(only){
		var _this = this;

		_this.renderResultWrap(only);

		_this.renderResultItems(only);
	},
	/*结果页面外层渲染*/
	renderResultWrap:function(only){
		var dom2 = '';
		this.voteTemWrap.append(dom2 + this.resultWrap);
		var voteHandleResult = this.voteTemWrap.find(".vote-handle-area-result");
		var voteResultTemplateTitle = this.voteTemWrap.find(".vote-template-result");

		voteResultTemplateTitle.find(".vote-tel-title").find("span").text(conf.voteAreaEl.voteArray[only]['resultTitlte']);
		voteResultTemplateTitle.find(".vote-tel-result-back").text(conf.voteAreaEl.voteArray[only]['backBtn']);
		voteHandleResult.find(".vote-share").addClass(conf.voteAreaEl.voteArray[only]['noteShare']);
		voteHandleResult.find(".vote-share-fb").find("span").text(conf.voteAreaEl.voteArray[only]['shareFB']);
		voteHandleResult.find(".vote-share-ter").find("span").text(conf.voteAreaEl.voteArray[only]['shareTer']);
	},
	/*结果页面内容渲染*/
	renderResultItems:function(only){
		var dom = '';
		var resultContainer = this.voteTemWrap.find(".vote-tel-result-items");

		for(var i=0;i<conf.voteAreaEl.voteArray[only]['item'].length;i++){
			dom = dom + this.resultTpl;
		}
		resultContainer.append(dom);
		resultContainer.addClass("vote-tel-result-items-0"+conf.voteAreaEl.voteArray[only]['item'].length);

		var resultList = this.voteTemWrap.find(".vote-tel-items-del");
		resultList.each(function(i){
			$(this).attr("index",$(this).index()+1);
		})
	},
	/*结果页面选项渲染操作*/
	sortData:function(data){
		for(var n = 0;n < data.length;n++ ){
			data[n]["name"] = $(".vote-item").eq(data[n].id-1).find(".vote-item-text").text();
		}
		return data;
	},
	/*分享到FB或Twitter*/
	shareToEl:function(only){
		var _this = this,
			voteShareFB = this.voteTemWrap.find(".vote-share-fb"),
			voteShareTER = this.voteTemWrap.find(".vote-share-ter");
		voteShareFB.click(function(){
			_this.getVoteEl(only,"facebook");
			UT.send({type:"click",ac:"b",position:"facebook-share",modId:"vote-wraper"});
		});
		voteShareTER.click(function(){
			_this.getVoteEl(only,"twitter");
			UT.send({type:"click",ac:"b",position:"twitter-share",modId:"vote-wraper"});
		});
	},
	/*分享内容插入*/
	getVoteEl:function(only,item){
		var that = this,
			arr = [],
			redirect_url,
			redirect_url01,
			resultList = this.voteTemWrap.find(".vote-tel-items-del");

		resultList.each(function(){
			if($(this).find(".vote-result-checked").css("visibility") == 'visible'){
				arr.push($(this).find(".vote-tel-items-name").text());
			}
		});

		redirect_url = helper.replaceTpl(that.shareConf.shareTpl[item]["redirect_url"], that.shareTxtObj);
		redirect_url01 = helper.replaceTpl(that.shareConf.shareTpl[item]["redirect_url01"], that.shareTxtObj);

		arr.length ? window.open(redirect_url,"newwindow") : window.open(redirect_url01,"newwindow")

	},
	/*是非题否模板初始化*/
	renderAgree:function(only){
		this.agreeOrNotEl(only);
		this.agreeEl(only);
		this.agreeShare(only);
	},
	/*渲染是非题否模板*/
	agreeOrNotEl:function(only){
		this.voteTemWrap.append(this.agreeTpl);

		var prayModule = this.voteTemWrap.find(".pray-template");

		prayModule.find(".pray-title").find('span').text(conf.voteAreaEl.voteArray[only]['title']);
		prayModule.find("img").attr("src",conf.voteAreaEl.voteArray[only]['prayImg']);
		prayModule.find(".vote-agree").text(conf.voteAreaEl.voteArray[only]['agreeBtn']);
		prayModule.find(".vote-disagree").text(conf.voteAreaEl.voteArray[only]['disagreeBtn']);
		prayModule.find(".vote-share").addClass(conf.voteAreaEl.voteArray[only]['noteShare']);
		prayModule.find(".vote-share").find("span").text(conf.voteAreaEl.voteArray[only]['shareWhich']);
	},
	/*是非题按钮操作*/
	agreeEl:function(only){
		var _this = this,
			agreeBtn = this.voteTemWrap.find(".vote-agree"),
			disagreeBtn = this.voteTemWrap.find(".vote-disagree");

		agreeBtn.one("click",this,function(){
			if($(this).hasClass("voted-check")){
				return
			}else{
				var index = $(this).attr("index");
				_this.renderAgreeData(index,only);
				UT.send({type:"click",ac:"b",position:"agree",modId:"vote-wraper"});
			}
		});
		disagreeBtn.one("click",this,function(){
			if($(this).hasClass("voted-check")){
				return
			}else{
				var index = $(this).attr("index");
				_this.renderAgreeData(index,only);
				UT.send({type:"click",ac:"b",position:"disagree",modId:"vote-wraper"});
			}
		});
	},
	/*是非题分享到*/
	agreeShare:function(only){
		var _this = this,
			shareFB = this.voteTemWrap.find(".vote-share-fb"),
			shareTer = this.voteTemWrap.find(".vote-share-ter");
		shareFB.click(function(){
			_this.getIsNot("facebook",only);
			UT.send({type:"click",ac:"b",position:"facebook-share",modId:"vote-wraper"});
		});
		shareTer.click(function(){
			_this.getIsNot("twitter",only);
			UT.send({type:"click",ac:"b",position:"twitter-share",modId:"vote-wraper"});
		})
	},
	/*是非题获取分享到值*/
	getIsNot:function(item,only){
		var redirect_url = helper.replaceTpl(that.shareConf.shareTpl[item]["redirect_url01"], that.shareTxtObj);

		window.open(redirect_url,"newwindow");
	},
	/*获取随机颜色值*/
	getRandomColor:function(){
	  return  '#' +
	    (function(color){
	    return (color +=  '0123456789abcdef'[Math.floor(Math.random()*16)])
	      && (color.length == 6) ?  color : arguments.callee(color);
	  })('');
	},
	/*通票模板初始化*/
	renderVote:function(only){
		var _this = this;
		_this.renderImgItems(only);
		_this.renderUl(only);
		_this.voteBtnEl(only);
		_this.resultBtnEl(only);
		_this.shareToEl(only);
		_this.backBtnEl();	//返回按钮
	},

	/*初始化*/
	init:function(only){
		var _this = this;
		// get share data of current vote
		_this.shareTxtObj = _this.shareConf[only];
		// 换一换按钮的显影
		conf.voteAreaEl.voteArray.length<=1 && _this.exchangeBtn.hide();

		conf.voteAreaEl.voteArray[only].tpl === "A" ? _this.renderVote(only) : _this.renderAgree(only);
	}
}

module.exports = voteTel;
