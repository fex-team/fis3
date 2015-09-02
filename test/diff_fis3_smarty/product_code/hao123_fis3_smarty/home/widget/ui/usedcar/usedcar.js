var $ = require('common:widget/ui/jquery/jquery.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require("common:widget/ui/helper/helper.js");

/**
 * 二手车模块
 * @author wangmingfei
 * @constructor
 * @this {usedcar}
 * data cache:
 *  that.opt = {
 *  	   'id': 'type-1-id',
 *  	 'name': 'type-1-name',
 *  	  'url': 'type-1-url',
 *  	'brand': [
 *  		{
 *  		 	  'id': 'brand-1-id',
 *  		    'name': 'brand-1-name',
 *  		   'model': [
 *  		   		{
 *  		   			  'id': 'model-1-id',
 *  		      		'name': 'model-1-name'
 *  			    },...
 *  			]
 *  	 	},...
 *  	]
 *  }
 **/
var usedcar = function(){
	var that = this;
	//config
	that.config = conf.usedcar;
	// dom
	that.usedcarWrapper = $("#sideUsedcar"); // module wrapper
	that.usedcarPanel = that.usedcarWrapper.find(".mod-side"); // api error handle use
	that.usedcarError = $("#usedcarError"); // api error handle use
	that.usedcarSearch = $("#usedcarSearch"); // search button
	// cache type, brand and model data
	that.opt = that.config.typeData;
	// const
	that.CONST_DEFAULT_TYPE = that.opt[0].id;
	// init action
	that.init(that.CONST_DEFAULT_TYPE);
};

/**
 * init action: init dom & bind events
 *
 * @this {usedcar}
 * @param {string} type The type value
 */
usedcar.prototype.init = function(type){
	var that = this;
	that.initDom(type);
	that.bindEvents();
};

/**
 * init dom action: init usedcarTypePicker & get data of parameter type from api
 *
 * @this {usedcar}
 * @param {string} type The type value
 */
usedcar.prototype.initDom = function(type){
	var that = this;
	that.requestApi(type);
};

/**
 * get data from local cache
 *
 * @this {usedcar}
 * @param {string} data The dropdownlist.data
 * @param {string} index The type index
 * @param {string} prop The type value: "brand" or "model"
 * @return {object} Returning data
 */
usedcar.prototype.getData = function(data,index,prop){
	var result = data;
	result = result[index] && result[index][prop] ? result[index][prop] : [];
	return result;
}

/**
 * create car type dropdownlist
 *
 * @this {usedcar}
 * @param {function} dropdownlist The dropdownlist function
 */
usedcar.prototype.createUsedcarTypeSelect = function(dropdownlist,args){
	var that = this;
	that.usedcarTypeSelect = new dropdownlist($.extend({
		selector: "usedcarType",
		data: that.opt,
		supportSubmit: 1,
		child: that.usedcarBrandSelect,
		onChange: function(){
			var thisObj = this;
			if(that.existDataByType(thisObj.selIndex)){
				thisObj.child.reset(that.getData(thisObj.data,thisObj.selIndex,"brand"));
			}else{
				that.requestApi(thisObj.value);
			}
		}
	},args));
}

/**
 * create car brand dropdownlist
 *
 * @this {usedcar}
 * @param {string} type The type value
 * @param {function} dropdownlist The dropdownlist function
 */
usedcar.prototype.createUsedcarBrandSelect = function(type,dropdownlist,args){
	var that = this;
	that.usedcarBrandSelect = new dropdownlist($.extend({
		selector: "usedcarBrand",
		// data: that.getBrandDataByType(type),
		child: that.usedcarModelSelect,
		supportSubmit: 1,
		onChange: function(){
			var thisObj = this;
			thisObj.child.reset(that.getData(thisObj.data,thisObj.selIndex,"model"));
		}
	},args));
}

/**
 * create car model dropdownlist
 *
 * @this {usedcar}
 * @param {string} type The type value
 * @param {function} dropdownlist The dropdownlist function
 */
usedcar.prototype.createUsedcarModelSelect = function(type,dropdownlist,args){
	this.usedcarModelSelect = new dropdownlist($.extend({
		selector: "usedcarModel",
		supportSubmit: 1
	},args));
}

/**
 * create car year dropdownlist
 *
 * @this {usedcar}
 * @param {string} type The type value
 * @param {function} dropdownlist The dropdownlist function
 */
usedcar.prototype.createUsedcarYearSelect = function(type,dropdownlist,args){
	var yearArr = [];
	for(var i = new Date().getFullYear(), j = 0; i >= 1970; i--, j++){
		yearArr[j] = {
			id: i,
			name: i
		};
	}
	this.usedcarYearSelect = new dropdownlist($.extend({
		selector: "usedcarYear",
		data: yearArr
	},args));
}

/**
 * get type index
 * @this {usedcar}
 * @param {string} type The type id
 */
usedcar.prototype.getTypeIndex = function(type){
	var index = 0;
	$.each(this.opt,function(k,v){
		if(v.id === type)
			index = k;
	});
	return index;
}

/**
 * whether car data of a specified type exists
 *
 * @this {usedcar}
 * @param {string} type The type value
 * @return {boolean} Returning false means there's no such type of data
 */
usedcar.prototype.existDataByType = function(type){
	return this.opt[type].brand && this.opt[type].brand.length;
};

/**
 * request data a specified type from api: if ajax fails, then display ajax error panel; else if data is an empty array, then the brand & model selector becomes blank
 * @this {usedcar}
 *
 * @param {string} type The type id
 */
usedcar.prototype.requestApi = function(type){
	var that = this,
		params = "?app="+that.config.app+"&act=contents&type="+type+"&country="+conf.country;
	$.ajax({
		url: conf.apiUrlPrefix + params,
		//url: "/static/home/widget/usedcar/data_"+type+".json",
		dataType: "jsonp",
		jsonp: "jsonp",
		//jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
		jsonpCallback: "ghao123_" + hex_md5(params,16),
		cache: false
	}).done(function(data){
		if(data.message.errNum > 0 && data.content.data.length){
			// hide ajax error notice
			that.ajaxSucceed = true;
			that.hideError();
			// cache data
			that.opt[that.getTypeIndex(type)].brand = data.content.data;
			// dropdownlist
			require.async("common:widget/ui/dropdownlist/dropdownlist.js", function (dropdownlist) {
				for(var i = that.config.selector.length - 1; i >= 0; i--){
					var select = that.config.selector[i],
						selectType = select.type,
						selectArgs = select.args;/*{
							allowEmpty: select.allowEmpty,
							emptyItem:{
								id: select.emptyItemId,
								name: select.emptyItemName
							}
						};*/

					if(selectType === "year"){
						($("#usedcarYear").length && !that.usedcarYearSelect) && that.createUsedcarYearSelect(type,dropdownlist,selectArgs);
					}else if(selectType === "model"){
						!that.usedcarModelSelect && that.createUsedcarModelSelect(type,dropdownlist,selectArgs);
					}else if(selectType === "brand"){
						!that.usedcarBrandSelect && that.createUsedcarBrandSelect(type,dropdownlist,selectArgs);
					}else if(selectType === "type"){
						if(!that.usedcarTypeSelect){
							that.createUsedcarTypeSelect(dropdownlist,selectArgs);
						}else{
							that.usedcarTypeSelect.target.trigger("change");
						}
					}
				}
			});
		}
	});
	if(!that.ajaxSucceed) that.showError();
};

/**
 * bind content events
 *
 * @this {usedcar}
 */
usedcar.prototype.bindEvents = function(){
	var that = this;
	that.usedcarError.click(function(e){ // apierror link click
		e.preventDefault();
		that.initDom(that.CONST_DEFAULT_TYPE);
	});
	that.usedcarWrapper.on("click","#usedcarSearch",function(){ // search button click
		var type = that.getTypeIndex($.trim(that.usedcarTypeSelect.value));
		if(conf.country === "ar"){
			var params = {
				urlPrefix: that.opt[type].url,
				brand: $.trim(that.usedcarBrandSelect.value),
				model: $.trim(that.usedcarModelSelect.value)
			};
		}else if(conf.country === "sa"){
			// 沙特策略：按选项的名称来查询，brand始终有值，如果model有值则查询url只填model，如果model无值则url只填brand，year参数只有在model有值时才添加到url中
			var model = $.trim(that.usedcarModelSelect.value),
				year = $.trim(that.usedcarYearSelect.value);
			// 如果有id说明是正常的选项，此时取该选项的name；id为空则说明是空白项，此时就取id即""
			model = model ? $.trim(that.usedcarModelSelect.title) : model;
			var params = {
				urlPrefix: that.opt[type].url,
				brand: model ? "" : $.trim(that.usedcarBrandSelect.title),
				model: model,
				year: year && model ? "+" + year : ""
			};
		}
		window.open(helper.replaceTpl(that.config.urlTpl,params));
		that.sendStat({position:"search"});
	}).on("mousedown",".dropdown-trigger",function(e){
		that.sendStat({ac:"b"});
	});
};

/**
 * show ajax error notice
 *
 * @this {usedcar}
 */
usedcar.prototype.showError = function(){
	var that = this;
	that.usedcarWrapper.css('height' , '300px');
	that.usedcarPanel.hide();
	that.usedcarError.show();
};

/**
 * hide ajax error notice
 *
 * @this {usedcar}
 */
usedcar.prototype.hideError = function(){
	var that = this;
	that.usedcarWrapper.css('height' , 'auto');
	that.usedcarPanel.show();
	that.usedcarError.hide();
};

/**
 * send statistic action
 *
 * @this {usedcar}
 */
usedcar.prototype.sendStat = function(otherParams){

	UT.send($.extend({
        type:"click",
        level:1,
        modId:"usedcar",
        country:conf.country
    },otherParams));
};

module.exports = usedcar;
