/**
 * 支持api获取广告数据（目前只支持单个api数据来源）
 * 支持PM配置广告
 * 支持api和PM配置广告同时存在（api数据在PM配置数据前面展示）
 * 当api广告图片出现问题时，支持PM配置替换掉有问题的api广告图片（）
 */
var $ = require( "common:widget/ui/jquery/jquery.js" ),
	Helper = require( "common:widget/ui/helper/helper.js" );

function supports(prop) {
	var div = document.createElement('div'),
		vendors = ["Khtml", "Ms", "O", "Moz", "Webkit"],
		len = vendors.length;
	if (prop in div.style) return true;
	prop = prop.replace(/^[a-z]/, function(val) {
		return val.toUpperCase();
	});
	while (len--) {
		if (vendors[len] + prop in div.style) {
			return true;
		}
	}
	return false;
}

var supportsCSS3 = supports("transition");

function sideAd( id, useIndex ){
	var that = this;
	that.opt = conf[id];
	that.mod = $( "#" + that.opt.id );
	that.useIndex = (useIndex === "1" ? true : false);
	that.list = that.mod.find(".nav-item-list");
	that.itemTpl = {
		'image': '<a href="#{url}" data-itemid="#{itemId}" title="#{title}" log-oid="#{offerid}"><img src="#{src}" alt="#{alt}"/></a>',
		'api': '<a href="#{url}" data-itemid="#{itemId}" title="#{title}" log-oid="#{offerid}"><img src="#{src}" alt="#{alt}"/></a>',
		'iframe': '<iframe log-oid="#{offerid}" frameborder="no" marginwidth="0" marginheight="0" scrolling="no" src="#{src}" width="#{width}" height="#{height}" allowtransparency="true"></iframe>',
		'js': '#{content}'
	};
	that.append = document.write;

	that.render();
	that.bindEvents();
}

sideAd.prototype = {
	/**
	 * 发送广告曝光率统计
	 */
	bindOuterLog: function(offerLog){
        OUTLOG.conf = $.extend(OUTLOG.conf || {}, {url: offerLog});
        offerLog && OUTLOG.send();
	},
	/**
	 * 绑定事件
	 */
	bindEvents: function(){
		var that = this;
		that.mod.on("mousedown",".nav-item",function(){
			UT.send({
				"modId": "bigadbanner",
				// "sort": $(this).find("[log-oid]").attr("log-oid"),
				"sort": $(this).find("a").attr("href"),
				"type": "click"
			});
		});
	},
	/**
	 * 渲染到页面
	 */
	render : function(){
		var that = this,
			datas = [],
			options,
			getData = that.collectData();

		$.when( getData )
			.done( function( data ){
				/*只有第一个广告是直接插入页面，其他广告都是先塞在textarea里*/
				for ( var i=0, len=data.length; i<len; i++ ){
					if(data[i].type == "iframe"){
						$.extend(data[i],{
							width: that.opt.width,
							height: that.opt.height
						});
					}
					datas.push({
						"content": '<li class="nav-item ui-o" style="position: absolute; top: 0px; left: 0px; z-index: 0; ' + (i ? 'display: none;' : 'opacity: 1;') + '">'+ (i ? '<textarea>' : '') + Helper.replaceTpl(that.itemTpl[data[i].type] + (i ? '</textarea>' : '') + '</li>', data[i]),
						"id": i + 1,
						"offerLog": data[i].offerLog
					});
				}

				/*原有cycletab的切换原理会导致重复加载iframe或js类型的广告*/
				var options = {
					itemSize: that.opt.itemSize ? that.opt.itemSize : 300,
					autoDuration: that.opt.autoDuration ? that.opt.autoDuration : 5000,
					dir: conf.dir,
					useIndex: that.useIndex,
					autoScrollDirection: that.opt.autoScrollDirection ? that.opt.autoScrollDirection : "forward",
					scrollDuration: that.opt.scrollDuration ? parseInt(that.opt.scrollDuration, 10) : 600,
					container: that.mod,
					list: that.list,
					arrows: that.mod.find(".slide-prev,.slide-next"),
					datas: datas,
					onSwitch: that.bindOuterLog
				};

				/* 设置循环轮播效果 */
				new Slide(options).init();

				if(!supportsCSS3) {
					that.mod.addClass('js-slide-on');
				}

				/*预留处理js类型，需要暂时重写document.write*/
				document.write = that.append;
			} );
	},
	/**
	 * 把传入的数组的元素顺序随机打散
	 */
	shuffle: function(o){
	    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	    return o;
	},
	/**
	 * 是否有api类型广告
	 */
	getSpecialType: function(){
		var that = this;
		that.apiIndex = -1;
		$.each(that.opt.ad_group, function(i, v){
			if(v.type == "api"){
				that.apiIndex = i;
			}else if(v.type == "iframe"){
				that.hasIframe = true;
			}
		});
	},
	/**
	 * 将从api和PM配置的数据收集在一起
	 */
	collectData : function(){
		var that = this,
			deferred = $.Deferred(),
			i, getApiAdGroup;
		that.getSpecialType();
		// 如果有api，从api获取数据，并在获取到数据之后同获取到的PM配置的数据合并
		if( ~that.apiIndex ){
			getApiAdGroup = that.formatApiData();
			$.when( getApiAdGroup )
				.done( function( data ){
					// 将api数据和PM配置数据整合在一起传递给监控函数处理
					deferred.resolve( that.getStaticData(data) );
				} )
				.fail( function(){
					deferred.reject();
				} );
		}else{
			// 如果没有api，直接拿PM配置的数据
			deferred.resolve( that.getStaticData() );
		}
		return deferred.promise();
	},
	/**
	 * 整合api和PM配置的数据
	 */
	getStaticData : function(apiData){
		var that = this,
			adGroup = that.opt.ad_group,
			len = adGroup.length,
			i,
			res = [];
		for( i=0; i<len; i++ ){
			var curAd = adGroup[i];
			if( curAd ){
				// 按顺序接入api数据
				if( curAd.type == "api"){
					res = res.concat(apiData);
				}else if( !curAd.tnForHide || that.opt.tn.match( curAd.tnForHide ) ){
					// id的作用是方便PM看到从api获取到的数据哪一条的图片加载失败。方便替换。
					// PM配置的广告资源不需要配置该项，但需要传入默认值
					if( !curAd.itemId ){
						curAd.itemId = "static" + i;
					}
					res.push( curAd );
				}
			}
		}
		/*数组随机化*/
		if(that.opt.random == 1 && (res.length > 1)) {
			if(~that.apiIndex) {
				if(!that.useIndex) {
					res = that.shuffle(res);
				} else {
					res = [res[0]].concat(that.shuffle(res.slice(1)));
				}
			}
		}
		return res;
	},
	/**
	 * 将从api中获取的数据格式化为tpl中需要的数据格式（字段名称替换）
	 **/
	formatApiData : function(){
		var that = this,
			deferred = $.Deferred(),
			apiConf = that.opt.ad_group[that.apiIndex],
			getDataFromApi = that.getDataFromApi();

		$.when( getDataFromApi )
			.done( function( data ){
				var len = data.length,
					i;
				for( var i=0; i<len; i++ ){
					var curData = data[i],
						// 是否对该条数据有备份图片，得到该图片地址
						backupImg = that.getBackup( curData.id );
					// 对api数据中的字段和tpl中需要的字段不统一的部分进行调整和添加
					$.extend( curData, {
						type: "api",
						offerid : apiConf.offerid,
						// dataValue : curData.name,
						title : curData.des,
						src : backupImg !== "" ? backupImg : curData.img,
						alt : curData.des,
						itemId : curData.id
					} );
				}
				deferred.resolve( data );
			} )
			.fail( function(){
				deferred.reject();
			} );
		return deferred.promise();
	},
	/**
	 * 当发现api广告图片加载失败时，PM可通过cms配置的方式替换掉失败的图片
	 * id 从api获得的数据中每一项的标识
	 * return imgSrc 备份图片的地址
	 **/
	getBackup : function( id ){
		var that = this,
			apiConf = that.opt.ad_group[that.apiIndex],
			backups = apiConf.backups || [],
			len = backups.length,
			i,
			imgSrc = "";
		for( i=0; i<len; i++ ){
			if( parseInt( backups[i].id ) === parseInt( id ) ){
				imgSrc = backups[i].imgSrc;
				break;
			}
		}
		return imgSrc;
	},
	/**
	 * 从api获取数据
	 *
	 ***/
	getDataFromApi : function(){
		var that = this,
			datas = [],
			deferred = $.Deferred(),
			apiConf = that.opt.ad_group[that.apiIndex],
			apiType = apiConf.apiType ? apiConf.apiType : "all",
			// PM配置的api读到的数据最多显示多少条
			apiMaxNum = apiConf.apiMaxNum ? parseInt( apiConf.apiMaxNum ) : 10;

		$.ajax( {
			url : conf.apiUrlPrefix + Helper.replaceTpl(apiConf.api, {type: apiType, num: apiMaxNum}) + "&jsonp=?",
			dataType : "jsonp"
		} )
		.done( function( data ){
			var d = data.content.data;
			if( d.length > apiMaxNum ){
				d.length = apiMaxNum
			}
			deferred.resolve( d );
		} )
		.fail( function(){
			deferred.reject();
		} );
		return deferred.promise();
	}
};
var Slide = function(opt){
	var that = this;
	that.opt = opt;
	that.datas = opt.datas;
	that.max = that.datas.length; // 临界值
	that.mod = opt.container;
	that.list = opt.list;
	that.arrows = opt.arrows;
	that.ele = {};
	that.befObj = null;
	that.curObj = null;
	that.useIndex = opt.useIndex;
	if(that.max > 1){
		that.canSlide = true; //当前是否可以滑动（防止用户过度频繁操作）
		that.counter = 0; // 记录广告序号
		that.step = opt.itemSize; // 切换步长
		that.autoScrollDirection = opt.autoScrollDirection;
		that.dir = opt.dir; // 下标
		that.STYLE_KEY = "left";
		that.animateStyle = {};
		that.resetStyle = {};
	}

};
Slide.prototype = {
	constructor: Slide,
	init: function(){
		var that = this;
		that.render();
		if(that.max > 1){
			that.autoScroll();
			that.bindEvents();
		}
	},
	render: function(){
		var that = this,
			html = "",
			max = that.max,
			datas = that.datas;

		/*生成datas & html*/
		/*if(max > 1){
			datas.push(datas[0]);// 为了循环播放尾部要再加上第一个
			datas.unshift(datas[max-1]);// 为了循环播放头部要再加上最后一个
		}*/
		$.each(datas, function(index, item){
			if(that.useIndex && ( index === 0 )) {

			} else {
				html += datas[index].content;
			}
		});

		/*插入并设置总宽度*/
		that.list.append(html);

		that.ele = that.list.children();

		that.opt.onSwitch && that.opt.onSwitch.call(that, that.datas[that.counter||0].offerLog);
		if(max > 1){
			/*that.list
			.css({
				"width": that.step*(that.max+2),
				"left": -that.step*that.counter
			});*/
		}else{
			that.arrows.hide();
		}
	},
	lazyLoadAd: function(){
		var that = this,
			curItem = that.curObj,
		// 如果有textarea，说明还没有加载过，把内容从textarea中取出插入页面，从而实现动态加载
			curTextarea = curItem.find("textarea");
		curTextarea.length && curItem.html(curTextarea.text());
	},
	animateShow: function() {
		var that = this;

		if(supportsCSS3) {
			that.befObj.css({"z-index": "1"});
			that.curObj.css({"z-index": "10", "display": "block", "opacity": "1"});
			setTimeout(function() {
				that.befObj.css({"opacity": "0", "z-index": "0"}); // hide before element
			    that.canSlide = true;
			}, that.opt.scrollDuration + 50);
		} else {
			that.curObj.css({"z-index": "10", "display": "none"})
			.fadeIn(that.opt.scrollDuration, function() {
				$(this).css("z-index", "0");
				that.befObj.hide(); // hide before element
				that.canSlide = true;
			});
		}
	},
	scrollNext: function(){
		var that = this;

		that.canSlide = false;
		that.befObj = that.ele.eq(that.counter);
		that.counter++;
		if(that.counter >= that.max) {
			that.counter = 0;
		}
		that.curObj = that.ele.eq(that.counter);
		// 延迟加载
		that.lazyLoadAd();
		// 动画滑动效果
		/*that.animateStyle[that.STYLE_KEY] = -that.step*that.counter;
		that.resetStyle[that.STYLE_KEY] = -that.step*1;*/

		that.animateShow();

		/*that.list.animate(that.animateStyle, that.opt.scrollDuration, function(){
			if(that.autoScrollDirection == "forward"){
				// 特殊处理从最后一张向第一张切的情况，动画过程中看到的是排在最后一个广告后面的第一个广告的克隆，广告结束时刻直接切回第一张位置
				if(that.counter == that.max+1){
					that.counter = 1;
					that.list.css(that.resetStyle);
				}
			}
			that.canSlide = true;
		});*/
		that.opt.onSwitch && that.opt.onSwitch.call(that, that.datas[that.counter].offerLog);
	},
	scrollPrev: function(){
		var that = this;

		that.canSlide = false;
		that.befObj = that.ele.eq(that.counter);
		that.counter--;
		if(that.counter < 0) {
			that.counter = that.max-1;
		}
		that.curObj = that.ele.eq(that.counter);
		
		// 延迟加载
		that.lazyLoadAd();

		that.animateShow();

		/*// 动画滑动效果
		that.animateStyle[that.STYLE_KEY] = -that.step*that.counter;
		that.resetStyle[that.STYLE_KEY] = -that.step*that.max;

		that.list.animate(that.animateStyle, that.opt.scrollDuration, function(){
			if(that.autoScrollDirection == "forward"){
				// 特殊处理从第一张向最后一张切的情况，动画过程中看到的是排在第一个广告前面的最后一个广告的克隆，广告结束时刻直接切回最后一张位置
				if(that.counter == 0){
					that.counter = that.max;
					that.lazyLoadAd();
					that.list.css(that.resetStyle);
				}
			}
			that.canSlide = true;
		});*/
		that.opt.onSwitch && that.opt.onSwitch.call(that, that.datas[that.counter].offerLog);
	},
	/*设置循环轮播*/
	autoScroll: function(){
		var that = this;
		that.timer = setInterval(function(){
			that.scrollNext();
		}, that.opt.autoDuration);
	},
	bindEvents: function(){
		var that = this;
		/*设置mouseenter时停止动画，mouseleave时恢复动画*/
		that.mod.on("mouseenter", function(){
			clearInterval(that.timer);
		}).on("mouseleave", function(){
			that.autoScroll();
		}).on("click", ".slide-next",function(e){
			that.canSlide && that.scrollNext();
			e.preventDefault();
		}).on("click", ".slide-prev",function(e){
			that.canSlide && that.scrollPrev();
			e.preventDefault();
		});
	}
};

/* 发送广告曝光率统计 */
var OUTLOG = {
    send: function(f) {
    	var i = this.conf,
    		b = i && i.url || this.url
    	if(b){
    		f = f || {};
    		var a = f.r = +new Date(),
    		    l = window,
    		    g = encodeURIComponent,
    		    e = l["OUTLOG" + a] = new Image(),
    		    c = i && i.data,
    		    j, h = [];
    		if (c) {
    		    for (var d in c) {
    		        c[d] !== j && (f[d] = c[d])
    		    }
    		}
    		for (j in f) {
    		    h.push(g(j) + "=" + g(f[j]))
    		}
    		e.onload = e.onerror = function() {
    		    l["OUTLOG" + a] = null
    		};
    		e.src = b + "?" + h.join("&");
    		e = h = null;
    	}
    }
};
module.exports = sideAd;
