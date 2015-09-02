/*
 * cookie策略：记录用户的上次点击
 * 统计策略：统计每个tab的点击，但cookie跳转分两种情况，用户没有点击cookie跳转的内容，不记录，否则记录一次点击。
 * PM可配置默认展示哪个tab。
 */

var $ = require("common:widget/ui/jquery/jquery.js"),
	UT = require("common:widget/ui/ut/ut.js"),
	helper = require("common:widget/ui/helper/helper.js");

$.cookie("supportCookie",true);

var	embedNav = $( "#embed-iframe-nav" ),
	supportCookie = !!jQuery.cookie( "supportCookie" ),
	embedWrapper = $( "#embed-iframe-wrapper" ),
	embedLoading = $( "#embed-iframe-loading" ),
	homeContent = $( ".box-sort" ),
	_conf = conf.embedlv2,
	navOptions = _conf.navData,
	defaultShow = _conf.defaultShow,
	// 如果来自特殊渠道，默认展示配置的tab，该策略高于cookie和pm配置
	spcTn = _conf.spcTn,
	spcTnDefaultShow = _conf.spcTnDefaultShow,
	urlParamTn = ( helper.getQuery() ).tn,

	/* 
	 * 由于几个请求可能同时发出，该字段用来记录需要显示哪个
	 * 此字段存在语义问题，因为初始值并不是在click之后赋值的。
	 * 如果有cookie则记录cookie值，如果没有则记录PM配置，如果都没有，为空
	 */
	shouldShow = (supportCookie && $.cookie( "navClass" )) || defaultShow,

	// 记录正在发送的清空，防止同一请求发出尚未返回时再次发出。
	sendingAjax = {};

function bindEvent(){

	embedNav.on( "mouseenter", ".nav-item", function( e ){
		var $link = $( this );

		if( $link.hasClass( "current" ) ){
			return;

		} else {

			// 为icon添加hover之后的震动动画
			$link.addClass( "hover" );
		}

	} ).on( "mouseleave", ".nav-item", function( e ){

		// 取消icon上的动画
		$(this).removeClass( "hover" );

	} ).on( "click", ".nav-item", function( e ){
		e.preventDefault();
		var $link = $( this );

		// 记录最后一次点击的tab
		shouldShow = $link.attr( "data-id" );
		
		changeTabs( $link, relocation, true );
	} );	

	// 自定义事件，按需加载二级页资源中的图片  暂时未启动。
	// embedWrapper.on( "lazyloadImg", function(){

	// 	var images = $( this ).find( ".g-img-lazyload" ).filter( ":visible" );
	
	// 	images.lazyload( {

	// 		//imgClass : "vs-img-src",
	// 		autoFireEvent : null
	// 	} );
	// } );
}

/*
 * elem    需要切换到的标签的DOM或jQuery对象
 * fn      如果是用户主动点击标签则传入fn，fn的作用主要是进行位置的调整
 	       如果是加载页面时，通过cookie进行的标签切换，则不需要调整位置
 * isClick 当该tab的切换是来自用户主动点击而不是cookie时为true，否则为false
 */
function changeTabs( elem, fn , isClick ){

	var $link = $( elem ),
		dataId = $link.attr( "data-id" ),
		url = "/";

	// 如果数据中存在api字段 url设置为api，否则url设置为数据中的url字段
	dataId == "home" ? url : navOptions[dataId].api ? url = navOptions[dataId].api : url = navOptions[dataId].url;
		
	if( dataId == "home" ){

		embedWrapper.hide();
		homeContent.show();

		if(isClick){

			supportCookie && $.cookie( "navClass", "home", {expires: 1800} );

			sendLog( "tabs", "home" );
		}
		
	// 如果点击的是当前tab，链接到相应的二级页
	}else if( $link.hasClass( "current" ) ){  

		if(navOptions[dataId].noLv2){
			return;
		}

		//选中的Tab直接打开
		window.open( "/" + dataId + "?from=hao123_tab" );

		sendLog( "lv2", dataId );

	}else{

		homeContent.hide();
		embedWrapper.show();
		embedWrapper.children().hide();
		embedLoading.show()
		
		// 重新定位嵌入资源的位置，当用户不是手动点击，而是cookie触发的change时，不会进行重新定位
		if( fn ){
			fn();
		}

		initLv2( url, dataId );

		// 记录data-id，用以记录用户此次点击的标签。
		if( supportCookie && isClick ){

			$.cookie( "navClass", dataId, {expires: 1800} );
		}

		// 如果是用户手动切换tab，发送一条log
		if( isClick ){

			sendLog( "tabs", dataId );

		// 如果是cookie触发的切换tab，则为该tab对应的内容绑定点击事件。统计需要。
		}else{

			bindClickEvent();
		}
	}

	// 标签样式的改变
	embedNav.find( ".nav-item" ).removeClass( "current" );
	$link.addClass( "current" );

}

/*
 * url 每个标签下面对应的二级页资源的url
 * id  每个标签的标记 data-id
 */
function initLv2( url, id ){

	var content = $( "#embed-iframe-"+ id, embedWrapper );

	if ( content.length > 0 ) {
		embedLoading.hide();
		content.show();

	} else {
		
		if( !sendingAjax[id] ){

			getDatas( url, id );
		}
	}
}

// 读静态资源和读api都使用该方法
function getDatas( url, id ){

	sendingAjax[id] = true;

	var timeout = navOptions[id].timeout,
		updataTime = navOptions[id].updateTime,
		dataUrl = navOptions[id].dataUrl,
		getData,
		getTpl;

	timeout = url == navOptions[id].api ? parseInt( timeout ) : 0;

	if(dataUrl){
		getData = $.ajax(
			{
				url : dataUrl,
				dataType : "jsonp"
			}
		);
	}
	
	getTpl = $.ajax(
		{
			url: setTimeStamp( url, updataTime ),
			dataType: "json",
			timeout: timeout
		}
	);

	$.when(getTpl, getData ).done( function( tpl, data ){

		if(data){
			_conf.data = data[0];
			var categorys = helper.getQuery(dataUrl).category.split(","),
				recommond = categorys[0],
				firstNav = categorys[1];

			_conf.data.recommond = recommond;
			_conf.data.firstNav = firstNav;

		}
		
		render( tpl[0], id );
		embedLoading.hide();

		// 显示最后一次点击的tab相应的内容
		embedWrapper.find( "#embed-iframe-" + shouldShow ).show();

		// 按需加载图片
		// embedWrapper.trigger("lazyloadImg");

		sendingAjax[id] = false;

	} ).fail( function(){

		// 如果此次发送的请求不是请求的静态json文件，而是api，并且失败了，则请求resource目录的备份。
		if( url != navOptions[id].url ){

			// navOptions[id].url 和第一次请求的url并不一样，如需修改请谨慎
			getDatas( navOptions[id].url, id );

		}else{
			
			sendingAjax[id] = false;
		}
	} );
}

// 将获取到的数据插入DOM，此处可能会有用户不会用到的渲染，造成渲染浪费
function render( data, id ){

	if( $.isEmptyObject( data ) ){
		return;
	}

	var dom = $('<div id="embed-iframe-'+ id +'" class="embedlv2-content" data-id="' + id + '" style="display:none;">').append($(data.html));

	embedWrapper.append( dom );
	helper.globalEval( data.script );
}

// 发送统计信息
function sendLog( position, sort ){
	UT.send( {
		type : "click",
		modId : "embedlv2",
		position : position,
		sort : sort
	} );
}

// 该方法为每个tab绑定一次点击事件。该点击发送一条log，说明用户在该区域至少进行过一次操作。统计需要
function bindClickEvent(){
	
	// 处理当用户的tab切换来自于cookie，并且点击了该tab下的内容时，发送一条统计。
	embedWrapper.one( "click", ".embedlv2-content", function(){

		var id = $( this ).attr( "data-id" );
		
		sendLog( "tabs", id );
	} );
}

// 点击标签尽量全显示该标签下的内容
function relocation() {

	var win = $( window ),
		navOffset = embedNav.offset().top,
		newHeader = _conf.newHeader,
		isCeiling = _conf.isCeiling,
		ceilingMore = _conf.ceilingMore,
		// 判断searchbox是否已经显示到页头中
		isSearchboxCeiled = $( "body" ).hasClass( "header-fixed-up" ),
		paddingTop = _conf.paddingTop,
		paddingTop1 = _conf.paddingTop1;

		// focusEle = $( "*:focus" ),
		// timer,
		// times = 0,
		// maxTimes = 100;
	// // 因为浏览器会自动定位到focus的元素，因此需要获取到focus的元素，取消focus
	// timer = setInterval( function(){
	// 	// 如果没找到这个元素，或者没有超过最大尝试次数
	// 	if( focusEle.length < 1 && times < maxTimes ){
	// 		focusEle = $( "*:focus" );
	// 		times ++;

	// 	}else{
	// 		// 找到这个元素后取消focus
	// 		focusEle.blur();
	// 		navOffset = embedNav.offset().top;

			//判断是否有页头吸顶
			if( newHeader && isCeiling === "1" ){
				if( ceilingMore == "1" && !isSearchboxCeiled ){
					win.scrollTop( navOffset - ( parseInt( paddingTop1 ) || 140 ) );
				}else{
					win.scrollTop( navOffset - ( parseInt( paddingTop ) || 35 ) );
				}
			}else{
				win.scrollTop( navOffset );
			}
			// clearInterval( timer );
	// 	}
		
	// }, 30 );
}
/*****/
/*
 * 是否来自指定的渠道
 * PM会配置一个以|分割的字符串，用来区分多个渠道
 */
function isFromSpecialTn(){
	var arr = spcTn.split("|"), //使用trim()在IE8下报错
		bool = false;

	for(var i=0, len=arr.length; i<len; i++){

		if(urlParamTn === arr[i] && arr[i] ){

			bool =  true;
			break;
		}
	}

	return bool;
}

/*
 * 为url添加时间戳
 * time 为多长时间改变一次时间戳,以小时为单位。如果time传0，则实时变化。   
 */
function setTimeStamp( url, time ){
	var timeStamp,
		date = ( new Date() ).getTime();

	if( parseInt( time ) === 0 ){

		timeStamp = Math.floor( date/1000 );

	}else{

		time = time || 4;
		timeStamp = Math.floor( date/( time * 36e5 ) );
	}

	timeStamp = "timeStamp=" + timeStamp;
    return url.indexOf( "?" ) < 0 ? ( url + "?" + timeStamp ) : ( url + "&" + timeStamp );
}

// 目前存在的问题：每次都会先渲染分类区，然后才会通过查看cookie值跳转到相应的tab
function init(){
	var isFromSpcTnBool = isFromSpecialTn();
	bindEvent();

	/* 
	 * 如果没有cookie，但是PM配置了显示哪个tab，按PM配置显示，如果来自特殊渠道的用户，默认展开PM配置的特殊tn的tab
	 * 如果cookie和PM配置都没有，changeTabs不执行
	 */
	 // 
	if( isFromSpcTnBool && spcTnDefaultShow ){
		shouldShow = spcTnDefaultShow;
		$( function(){
			shouldShow && changeTabs( $( "." + shouldShow ), relocation, false );
		} );
		
	}else{
		shouldShow && changeTabs( $( "." + shouldShow ), false, false );
	}
	

}

init();