var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
//===================================================================
var anchors = [];//存放该组件cms上的所有数据
var anchorTab;//轮播组件
var currentItem;//当前显示的item，实际上指向anchor-icon
var promptDiv = $('#anchorPrompt');//运营小提示
var win = $(window);
var body = $('html,body');//为了兼容各浏览器的平滑滚动
var dir; //ltr or rtl
var sideAnchorBar = $('#sideAnchorBar');
var hoverable = true;//是否接受hover
//===================================================================
//绑定事件
var bindEvent = function(){
	//hover
	$('#anchorNav').on('mouseover' , '.anchor-icon' , function(e){
		var item = $(e.target);
		//当不接受hover事件或者hover到同一元素上时不做处理
		if(!hoverable || (item[0] === currentItem[0])){
			return;
		}
		switchItemAnimation(item);
		currentItem = item;
	});

	//click the item
	sideAnchorBar.on('click' , '.anchor-item , #anchorPrompt' , function(e){
		locateTo(currentItem);
		//发送统计
		var index = getIndexByItem(currentItem);
		if(anchors[index].group === 'none'){
			sendLog(anchors[index].modName);
		}else{
			sendLog(anchors[index].group + '-' + anchors[index].modName);
		}
	});
	//tab改变后，此事件由轮播组件内部发出
	$(anchorTab).on('e_change' , function(e , data){
		//还原item状态后才能再次接收hover事件
		resetCurrentItem();
		hoverable = true;
	});

	$('.ctrl' , sideAnchorBar).click(function(e){
		//点击prev或者next按钮后，轮播组件开始动画效果，此时不接受hover事件，否则会出现错位
		hoverable = false;
		var currentGroup = sideAnchorBar.find('.anchor-group');
		currentGroup.find('div').removeAttr('style');//去除jquery设置的内联样式
		//统计
		sendLog('arrow');
	});
};

//统计
var sendLog = function(extraparam){
	UT.send({
        type:"click",
        modId:"anchorbar",
        position:extraparam
    });
};

//还原定位到第一个元素
var resetCurrentItem = function(){
	var currentGroup = sideAnchorBar.find('.anchor-group');
	// var defaultItem = (dir === 'ltr' ? '.first' : '.last');
	// currentItem = currentGroup.find(defaultItem + ' ' + '.anchor-icon');
	currentItem = currentGroup.find('.first .anchor-icon');
	switchPromptAnimation(currentItem);
};

/**
*对服务器传来的json进行过滤和处理，包括修改数组结构，去除不显示的项
*/
var filterItems = function(inputList){
	var outputList = [];
	var item;
	var group;
	for(item in inputList){
		if(inputList[item].show === '0'){
			continue;
		}
		group = inputList[item].group;
		if(group.length !== 0){
			group = group.toLowerCase();
		}else{
			group = 'none';
		}
		outputList.push({
			'modName': item,
			'title': inputList[item].title,
			'prompt': inputList[item].prompt,
			'group': group
		});
	}
	return outputList;
};

//生成随机排列的模块列表，即每次用户看到的列表顺序都是随机的
var randomItems = function(inputList){
	var length = inputList.length;
	var math = Math;
	var index;
	var outputList = [];
	while(length > 0){
		index = math.floor(math.random()*length);
		outputList.push(inputList[index]);
		inputList[index] = inputList[length-1];
		length = length - 1;
	}
	return outputList;
};

//根据cms数据生成锚点列表对应的dom树
var createDomList = function(){
	var list = [];//最后返回的数组
	var length = anchors.length;
	var item;
	var itemGroup = [];//包裹dom树的数组
	var groupIndex = 0;
	var i_class;//设置特定css所需的类名
	var mod; //余数，不是"模块"的意思
	for(var i = 0 ; i < length ; i++){
		i_class = '';
		mod = i%3;
		if(mod === 0){
			i_class = 'first';
			itemGroup.push("<div class='anchor-group'>");
		}else if(mod === 2){
			i_class = 'last';
		}
		//根据dir生成不同dom，逼不得已。。。。。。因为rtl的bug
		if(dir === 'ltr'){
			itemGroup.push(
				"<div class='anchor-item " , i_class , "'>\
			        <div class='anchor-icon " , anchors[i].modName.toLowerCase() , "-img' anchor-index='" , i , "'></div>\
			        <div class='anchor-title'>" , anchors[i].title , "</div>\
			    </div>"
			);
		}else{
			itemGroup.push(
				"<div class='anchor-item " , i_class , "'>\
				    <div class='anchor-title'>" , anchors[i].title , "</div>\
				    <div class='anchor-icon " , anchors[i].modName.toLowerCase() , "-img' anchor-index='" , i , "'></div>\
                </div>"
			);
		}
		//遍历到每组最后一个或者（最后剩余的不满3个元素）都闭合dom
		if((i%3 === 2) || (i === length-1 && itemGroup)){
			itemGroup.push("</div>");
			var groupStr = itemGroup.join('');
			list.push({
				'content': groupStr,
				'id': groupIndex
			});
			groupIndex++;
			itemGroup = [];
		}
	}
	return list;
};

/**
*高亮动画
*@param {Jquery}elem 需要定位到的模块
*/
var highlightAnimation = function(elem){
	var div = $("<div class='anchor-highlight'></div>");
	var offset = elem.offset();
	div.css({
		'left': offset.left + 'px',
		'top': offset.top + 'px',
		'height': elem.innerHeight(),
		'width': elem.innerWidth()
	});
	div.appendTo('body');
	//狂闪两次
	for(var i = 0 ; i < 4 ; i++){
		div.fadeToggle(300);
	}

};

//滚动至锚点处
var scroll2Mod = function(modName){
	var elem = $('.mod-' + modName);
	if(elem.length > 0){
		var windowHeight = win.height();
		var elemHeight = elem.outerHeight();
		var offset = elem.offset();
		var scrollTop = offset.top - (windowHeight-elemHeight)/2;
		var switcher = true;
		body.animate({
			'scrollTop': scrollTop + 'px'
		} , 600 , function(){
			//此处之所以设置状态位，是因为body=$('html,body'),
			//等于是给html和body分别绑了回调函数，所以如果不设置状态位的话,
			//将执行highlightAnimation(elem)函数2次
			// if(switcher){
			// 	highlightAnimation(elem);
			// 	switcher = false;
			// }
		});
		setTimeout(function(){
			highlightAnimation(elem);
		} , 1000);
	}
};

//hover后切换显示的动画
var switchItemAnimation = function(item){
	var titleClass = '.anchor-title';
	var currentTitle = currentItem.siblings(titleClass);
	var itemTitle = item.siblings(titleClass);
	currentTitle.stop();//开始动画之前先要中止所有正在进行的动画，否则会出问题
	currentTitle.animate({'width': 0},200);
	itemTitle.animate({'width': '105px'},200);

	switchPromptAnimation(item);
};

//hover后显示prompt小提示的动画
var switchPromptAnimation = function(item){
	var prompt = getPrompt(item);
	if(prompt && prompt.length > 0){
		// promptDiv.show();
		promptDiv.css("display","block");
		promptDiv.html(prompt);
	}else{
		promptDiv.hide();
	}
};

//获取item对应的prompt提示
var getPrompt = function(item){
	var index = getIndexByItem(item);
	return anchors[index].prompt;
};

//通过item获取对应的index，以便获取对应的title,prompt等信息
var getIndexByItem = function(item){
	return item.attr('anchor-index');
};

//初始化轮播组件
var initCycleTabs = function(list){
	anchorTab = new cycletabs.NavUI();
	anchorTab.init({
		containerId: '#anchorNav',
		offset: 0,
		data: list,
		defaultId: 0,  //1
		navSize: 1,
		itemSize: 40, //元素高度
		autoScroll: false,
		direction: 'v',
		idKey: 'id' //用来指定返回的关键key
	});
};

//锚点定位函数，分两个步骤，第一是定位到包装容器，然后是发送事件初始化具体模块
var locateTo = function(item){
	var index = getIndexByItem(item);
	var arrItem = anchors[index];
	var modName = arrItem.modName;
	var group = arrItem.group;
	//发送事件,如果模块单独存在，则直接发给该模块的包装元素；
	//如果该模块为magicbox或charts等的子模块，则发给父模块的包装元素，
	//子模块名称已参数形式传入，便于初始化
	var e = 'locate.';//锚点定位事件，统一为locate事件
	if(group !== 'none'){
		win.trigger(e + group , modName);
		scroll2Mod(group);
	}else{
		win.trigger(e + modName);
		scroll2Mod(modName);
	}

};

//初始化函数
var init = function(anchorbar){
	dir = anchorbar.dir;
	anchors = anchorbar.anchors;
	anchors = filterItems(anchors);
	anchors = randomItems(anchors);//随机排列列表
	//生成列表dom，并加入到轮播组件
	var list = createDomList();
	initCycleTabs(list);

	//设置默认展开项
	resetCurrentItem();

	bindEvent();

};

module.exports = init;
