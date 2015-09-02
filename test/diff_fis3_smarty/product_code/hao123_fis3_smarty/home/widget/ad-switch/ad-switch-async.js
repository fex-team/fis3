/**
 * 支持api获取广告数据（目前只支持单个api数据来源）
 * 支持PM配置广告
 * 支持api和PM配置广告同时存在（api数据在PM配置数据前面展示）
 * 当api广告图片出现问题时，支持PM配置替换掉有问题的api广告图片（）
 */
var $ = require( "common:widget/ui/jquery/jquery.js" ),
	cycletabs = require( "common:widget/ui/cycletabs/cycletabs.js" ),
	Helper = require( "common:widget/ui/helper/helper.js" );

function RightAds( id ){
	var that = this;
	that.opt = conf[id];
	that.mod = $( "#" + that.opt.id );
	that.itemTpl = '<div class="mod-charges_bg"></div><a href="#{url}" data-sort="ad" data-val="#{dataValue}" data-itemid="#{itemId}" title="#{title}" log-oid="#{offerid}"><img src="#{src}" alt="#{alt}"/></a>';

	that.render();
}

RightAds.prototype = {
	/* 发送广告曝光率统计 */
	bindOuterLog: function(){
		var that = this;
		$(that.slider).on("e_change", function(e, data){
	            var that = this,
	            	offerLog = data.itemObj.offerLog;

	            OUTLOG.conf = $.extend(OUTLOG.conf || {}, {url: offerLog});
	            OUTLOG.send();
		});
	},
	render : function(){
		var that = this,
			datas = [],
			options,
			getData = that.collectData();
		that.slider = new cycletabs.NavUI();
		that.bindOuterLog();

		$.when( getData )
			.done( function( data ){
				for ( var i=0, len=data.length; i<len; i++ ){
					datas.push({
						"content": Helper.replaceTpl(that.itemTpl, data[i]),
						"id": i + 1,
						"offerLog" : data[i].offerLog || ""
					});
				}
				options = {
					offset: 0,
					navSize: 1,
					itemSize: conf.curLayout == 1020 ? 300 : 240,
					autoDuration: that.opt.time ? that.opt.time : 0,
					dir: conf.dir,
					autoScrollDirection: conf.dir == "ltr" ? "forward" : "backward",
					scrollDuration: 500,
					autoScroll: that.opt.random == "1" ? false : true,
					containerId: "#" + that.opt.id,
					data: datas,
					defaultId: 1
				};
				that.slider.init( options );
			} );
	},
	/**
	 * 将从api和PM配置的数据收集在一起
	 */
	collectData : function(){
		var that = this,
			hasApi = !!that.opt.api,
			deferred = $.Deferred(),
			i, getApiAdGroup;
		// 如果有api，从api获取数据，并在获取到数据之后同获取到的PM配置的数据合并
		if( hasApi ){
			getApiAdGroup = that.formatApiData();
			$.when( getApiAdGroup )
				.done( function( data ){
					var res = [];
					// 将api数据和PM配置数据整合在一起传递给监控函数处理
					deferred.resolve( res.concat( data, that.getStaticData() ) );
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
	 * 拿到PM配置的数据
	 */
	getStaticData : function(){
		var that = this,
			adGroup = that.opt.ad_group,
			len = adGroup.length,
			i,
			res = [];
		for( i=0; i<len; i++ ){
			var curAd = adGroup[i];
			if( curAd && !curAd.tnForHide || that.opt.tn.match( curAd.tnForHide ) ){
				// id的作用是方便PM看到从api获取到的数据哪一条的图片加载失败。方便替换。
				// PM配置的广告资源不需要配置该项，但需要传入默认值
				if( !curAd.itemId ){
					curAd.itemId = "static" + i;
				}
				res.push( curAd );
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
						offerid : that.opt.apiOfferid,
						dataValue : curData.name,
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
			backups = that.opt.backups || [],
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
			// PM配置的api读到的数据最多显示多少条
			settedNum = that.opt.apiMaxNum ? parseInt( that.opt.apiMaxNum ) : 3;
		$.ajax( {
			url : conf.apiUrlPrefix + that.opt.api + "&jsonp=?", // "http://api.ghk.hao123.com:8088/api.php"
			dataType : "jsonp"
		} )
		.done( function( data ){
			var d = data.content.data;
			if( d.length > settedNum ){
				d.length = settedNum
			}
			deferred.resolve( d );
		} )
		.fail( function(){
			deferred.reject();
		} );
		return deferred.promise();
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

module.exports = RightAds;
