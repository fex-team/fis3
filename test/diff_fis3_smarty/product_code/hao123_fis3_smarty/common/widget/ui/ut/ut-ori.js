var UT = {
//	params: {type:'click'},             //全局固定发送参数(level,page,country,type='click')
	url: "/img/gut.gif",    //日志接收地址
//	/**
//	 * 初始化全局的配置信息
//	 * @param params
//	 * @param conf
//	 */
//	init: function(params, conf){ 
//		var uf;
//		if (params) {
//			for (var p in params) {
//				params[p] !== uf && (this.params[p] = params[p])
//			}
//		}
//		this.url = conf && conf.url || this.url;
//	},
	/**
	 * 用于发送统计参数。升级支持了，允许自定义发送地址和覆盖原有的固定参数
	 * <code>
	 *    UT.send({type:'click', position: 'banner'});
	 * </code>
	 * @param data
	 * @param config  可以覆盖url/params
	 * @config url 发送地址
	 * @config params 用于替代原已设置的，固定参数
	 */
	send: function (data, config) {
		data = data || {};
		var utConf = window.conf.UT;
		var logURL = config && config.url || this.url,
			params = config && config.params || utConf.params,
			timeStamp = data.r = +new Date(),
			win = window,
			enc = encodeURIComponent,
			img = win["UT" + timeStamp] = new Image(),
			j, h = [];
		if (params) {
			for (var d in params) {
				if(params[d] !== j && data[d] === j) {  //params是默认参数，不要覆盖data
					data[d] = params[d];
				}
			}
		}
		
		for (j in data) {
			h.push(enc(j) + "=" + enc(data[j]))
		}
		img.onload = img.onerror = function () {
			win["UT" + timeStamp] = null
		};
		img.src = logURL + "?" + h.join("&");
		img = h = null;
	},
	/**
	 * 试图获取Log的特定参数
	 *  对于模块：<div class="mod-XXX" log-mod="modXX" log-index="?">
	 * @param element
	 * @param attrList
	 */
	attr: function (element, attrList) {
		var modId = element.getAttribute("log-mod");
		//试图找modId，同时获得它的index值
		if (!modId) { //如果没有，向父级找
			if (element.parentNode && element.parentNode.tagName.toUpperCase() != 'BODY') {
				this.attr(element.parentNode, attrList);
			}
		} else {    //如果找到了，就到此为止了
			var modIndex = element.getAttribute("log-index");
			if (modIndex) {
				attrList.modIndex = modIndex;
			}
			attrList.modId = modId;
		}
	},
	/**
	 *    1. 获取链接的url,log-index(链接索引) eg: <a href="#" log-index="?" data-sort="typeXX" data-val="valueYY">
	 *    2. 获取父元素的属性: log-mod,log-index(模块索引); 取到BODY以内
	 * @param link
	 * @return {Object} attr参数表
	 */
	link: function (link) {		
		var attrList = {},
			url = link.getAttribute("href",2);//处理IE7下href属性为#的情况
		if (url) {
			//非正常链接与正常链接发送不同的一组参数
			if(/^(javascript|#)/.test(url)){
				attrList['ac'] = "b";
				attrList['url'] = "none";
			}else{
				attrList['ac'] = "a";
				attrList['url'] = url;
			}
		}
		var linkIndex = link.getAttribute('log-index');
		if (linkIndex) {
			attrList['linkIndex'] = linkIndex;
		}
		var sort = link.getAttribute('data-sort') || '';
		if (sort) {
			attrList['sort'] = sort;
			attrList['value'] = link.getAttribute('data-val') || '';
		}
		var offerId = link.getAttribute('log-oid');
		if(offerId){
			attrList['offerid'] = offerId;
		}
		this.attr(link, attrList);
		return attrList;
	}
};

module.exports = UT;