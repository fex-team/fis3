var $ = require("common:widget/ui/jquery/jquery.js");
require('common:widget/ui/jquery/jquery.cookie.js');
require('common:widget/ui/time/time.js');
/*  version:1.0
	@Yang Tainyu
	功能：对应dom元素生成相应指示气跑。
	气泡生成组件API：
	#ps.调用需要在函数中传对象作为参数#
	{
		id :				//生成div的id (必要) ps.为区分气泡在id命名为‘popup+模块名+特殊名’,
		parentDom : 		//气泡箭头指向的父元素 (必要),
		width : 			//宽度（默认196）,
		height : 			//高度（默认87，可自适应大小）,
		relativePosition : {  //相对定位，默认为绝对定位，热区会伸缩，需要用到相对定位
			left:  			//气泡左位置,
			top:  			//气泡上位置
			right:          //适用于ar
		},
		arrowMargin :  {    //气泡中arrow的margin值，用于定位指向箭头位置
			left : ,
			top : ,
			right : 	    //适用于ar
		},
		style : 			//选择气泡生成位置（1. north<默认>  2. east  3.south  4.west）,
		summary : 			//气泡中的文字 (必要),
		images : 			//气泡中的图片url ,
		btns : {			//默认不加按钮
			description : 	//按钮中的文字,
			handle : 		//按钮绑定click事件的触发事件
		}
	}
*/
/*
  *  version 1.1
  *  @Ding xu
  *  升级的内容：
     1、调用的参数变更
     @params
     	id => 生成div的id,为区分气泡在id命名为‘popup+模块名+特殊名’,必要参数
     	dom => 	气泡箭头指向的父元素，必要参数
     	noticePop => 气泡参数对象，数据来源于CMS配置，必要参数
     	btnCallBack => 按钮绑定的事件，非必要参数
     2、调用的方式变更
     @example
     	new createNoticePop(id,dom,"<%json_encode($body.guide.magicBoxNoticePop)%>",btnCallBackFuntion);
     3、noticePop内的参数与1.0版本基本保持一致，CMS中配置的参数如下
     @params
     	description => 气泡内的文字描述，必要参数
     	style => 气泡生成的位置，1.1版本中改为必要参数
		//以下为非必要参数，规则与1.0版本一致
     	position => 气泡的位置,内部包含left，righr，top
     	arrow => 气泡箭头的位置,内部包含left，righr，top
     	image => 图片
     	width => 宽度
     	height => 高度
     	btn => 按钮的文字描述
     4、气泡组件迁移至common ui下
     5、备注
       （1）气泡的文字描述暂时不支持链接的形式
       （2）按钮的宽度目前不可调
       （3）id和dom参数目前由FE的同学决定，后面需要评估有没有必要将控制权交给PM
       （4）CMS的配置实例可以参看泰国新手引导
*/
/*
  *  version 1.2
  *  @wmf
  *  升级的内容：
     1、增加控制气泡显示时间段的属性showPeriod：有值且符合格式规范的则只在指定的时间段内刷新页面会显示气泡；没有值则全天候显示气泡，选填
     2、增加是否强制每天都显示的属性showEveryday：如果该值为1，当用户关闭气泡时存入cookie"noticePop"中的值为id=true，下次刷新气泡还是会显示；如果没有该值或者值不为1，当用户关闭气泡时存入cookie"noticePop"中的值为id=当天日期，当天内刷新页面气泡都不会显示，换成其他日期刷新页面才会显示
*/
var createNoticePop = function(id,dom,noticePop,btnCallBack){
	var id = id,
		pointDom = dom,
		//以下参数来源于nocitePop
		summary = noticePop.description,
		popStyle = noticePop.style,
		relativePositionTop = noticePop.position.top?noticePop.position.top*1:0,
		relativePositionLeft= noticePop.position.left?noticePop.position.left*1:0,
		relativePositionRight= noticePop.position.right?noticePop.position.right*1:0,
		arrowMarginTop = noticePop.arrow.top?noticePop.arrow.top*1:0,
		arrowMarginLeft = noticePop.arrow.left?noticePop.arrow.left*1:0,
		arrowMarginRight = noticePop.arrow.right?noticePop.arrow.right*1:0,
		popWidth = noticePop.width?noticePop.width:0,
		popHeight = noticePop.height?noticePop.height:0,
		images = noticePop.image?noticePop.image:"",
		btnDescription = noticePop.btn?noticePop.btn:"";
	//生成的气泡id
	var	myPopId = '';

	//如果气泡中需要button，构造button
	var createButtons = function(){
		var btns = {
				description : btnDescription,
				handle : btnCallBack
			};
		button = '<div class="button">'+btns.description+'</div>';
		myPopId.append(button);
		if(btns.handle){
			myPopId.find('.button').on('click',btns.handle);
		}
	};
	var createDom = function(){
		var noticeDom = '<div class="notice-pop" id="'+id+'"><div class="cancel">&#x2715;</div>';
		if(images){
			noticeDom +='<img src="'+images+'"/>';
		}
		noticeDom +='<p>'+summary+'</p></div>';
		pointDom.before(noticeDom);
		myPopId = $('#'+id);
	};
	//重新按输入位置定位
	var setPopPosition = function(){
		myPopId.css({marginTop:relativePositionTop+'px', marginLeft:relativePositionLeft+'px', marginRight:relativePositionRight+'px'});
	};
	//重新按输入气泡大小改变大小
	var setPopCss = function(){
		if(popWidth){
			myPopId.css({width: popWidth+'px'});
		}
		if(popHeight){
			myPopId.css({height: popHeight+'px'});
		}
	};
	//气泡指针位置margin设定
	var setArrow = function(){
		if(arrowMarginLeft){
			myPopId.find('.arrow-parent').css({marginLeft:arrowMarginLeft+'px'});
			myPopId.find('.arrow-child').css({marginLeft:arrowMarginLeft+2+'px'});
		}
		if(arrowMarginTop){
			myPopId.find('.arrow-parent').css({marginTop:arrowMarginTop+'px'});
			myPopId.find('.arrow-child').css({marginTop:arrowMarginTop+2+'px'});
		}
		if(arrowMarginRight){
			myPopId.find('.arrow-parent').css({marginRight:arrowMarginRight+'px'});
			myPopId.find('.arrow-child').css({marginRight:arrowMarginRight+2+'px'});
		}

	};
	var chooseStyle = function(){
		var arrowDom;
		switch(popStyle){
			case 'east' : {
				arrowDom = '<div class="arrow-east arrow arrow-parent"></div><div class="child-pop-east arrow arrow-child"></div>';
				break;
			};
			case 'south' : {
				arrowDom = '<div class="arrow-south arrow arrow-parent"></div><div class="child-pop-south arrow arrow-child"></div>';
				break;
			};
			case 'west' : {
				arrowDom = '<div class="arrow-west arrow arrow-parent"></div><div class="child-pop-west arrow arrow-child"></div>';
			};	break;
			case 'north' : {};
			default : {
				arrowDom = '<div class="arrow-north arrow arrow-parent"></div><div class="child-pop-north arrow arrow-child"></div>';
			};
		};
		myPopId.append(arrowDom);
	}
	//选择气泡类型 上、右、下、左
	var arrowForAbsolute = function(){
		var arrowDom;
		switch(popStyle){
			case 'east' : {
				myPopId.css({left:pointDom.offset().left+pointDom.width()+10+'px'});
				break;
			};
			case 'south' : {
				myPopId.css({top:pointDom.offset().top+pointDom.height()+10+'px'});
				break;
			};
			case 'west' : {
				myPopId.css({left:pointDom.offset().left-myPopId.width()-40+'px'});
				break;
			};
			case 'north' : {};
			default : {
				myPopId.css({top:pointDom.offset().top-myPopId.height()-30+'px'});
			};
		}
	};
	//根据气泡显示的时间段,showPeriod: [4,7]判断当前时刻是否在显示区间内，没有此属性则全时段显示
	var timeToShow = function(serverNow,showPeriod){
		var loop = 0,
			startHour = parseInt(showPeriod[0],10),
			endHour = parseInt(showPeriod[1],10),
			curHour;
		//当时间段参数的数组长度为2并且开始时间<=结束时间时才走时间段控制
		if(showPeriod.length == 2 && startHour <= endHour){
			curHour = serverNow.getHours();
			//如果在显示时间段内则显示气泡
			if(curHour >= startHour && curHour < endHour + 1){
				return true;
			//否则不显示
			}else{
				return false;
			}
		//否则不受时间段控制，始终显示（处理不需要时间段控制以及时间段填写有误的情况）
		}else{
			return true;
		}
	};

	//返回cookie值的日期标记部分
	var getTimeStamp = function(date){
		//如果设置每天都要强制显示气泡，则返回当天日期作为cookie日期标记
		if(noticePop.showEveryday == '1'){
			var serverNowForm = Gl.time.getForm(date) || Gl.time.getForm(new Date());
			return serverNowForm.y+"-"+serverNowForm.m+"-"+serverNowForm.d;
		//否则返回"true"，一旦关闭则气泡将再不显示直到用户清掉cookie
		}else{
			return "true";
		}
	};
	//返回当前情况下气泡是否应该显示出来，当cookie值为空或者cookie值与当前日期不是同一天时显示，其它情况都不显示
	var getIsHidden = function(serverNow){
		// delete old cookie if existed, TODO: remove later
		$.cookie("noticePops") && $.cookie('noticePops', null);
		var isHidden = $.cookie.get('noticePops-'+id);
		return !isHidden || (isHidden && isHidden !== getTimeStamp(serverNow));
	};

	var init = function(){
		var	isRelative = relativePositionTop,
		  	showPeriod = noticePop.showPeriod.split("-"),
		  	serverNow = Gl.time.getTime() || new Date(); //获取服务器时间，如果不行再取客户端时间代替
		//cookie中是否显示气泡
		if(getIsHidden(serverNow) && timeToShow(serverNow,showPeriod)){
			createDom();
			if (btnDescription){
				createButtons();
			}
			setPopCss();
			chooseStyle();
			if(isRelative){
				setArrow();
				setPopPosition();
			}
			else{
				setArrow();
				arrowForAbsolute();
				setPopPosition();
			}
			// 增加一个关闭气泡的自定义事件"closepop"，方便外部文件使用
			myPopId.find('.cancel').on('click',function(){
				close();
			});
		}
	};
	var close = function(){
		if(myPopId){
			myPopId.detach();
			//气泡的cookie为noticePops
			$.cookie.set("noticePops-"+id,getTimeStamp());
		}
	};
	init();
	return {
		close: close
	};
};



module.exports = createNoticePop;
