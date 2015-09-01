var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
var helper = require("common:widget/ui/helper/helper.js");
var hex_md5 = require('common:widget/ui/md5/md5.js');
require('common:widget/ui/jquery/widget/jquery.placeholder/jquery.placeholder.js');

var bottomEcommerce = function(){
	var goodslistUlTpl = '<ul class="e-goodslist-ul">',
		goodslistLiTpl = '<li class="e-goodslist-li">'
						+	'<a class="e-links" href="#{link}" title="#{title}">'
						+		'<img src="#{imageUrl}" class="e-imgs" />'
						+		'<span class="e-title">#{title}</span>'
						+		'<span class="e-subtitle">#{subtitle}</span>'
						+		'<span class="e-price">#{price}</span>'
						+	'</a>'
						+'</li>',
		_conf = conf.bottomEcommerce.list,
		duration = conf.bottomEcommerce.duration,

		init = function(){
			conf.dir == "ltr" ? switchTab(0) : switchTab( _conf.length - 1 );
			bindEvent();
		},
		//获取数据
		getData = function( index ){
			index = index || 0;
			var bconf = _conf[index],
				params = encodeURI("?act=contents&app="+bconf.app+"&country="+conf.country+"&category="+bconf.category+"&num="+bconf.num);

			$.ajax({
				url:conf.apiUrlPrefix+params,
				dataType: "jsonp",
				async:false,
				jsonp: "jsonp",
				jsonpCallback: "ghao123_" + hex_md5(params,16),
				cache: false,

				success:function(result){
					result = result.content.data.contents[bconf.category];
					renderGoodsList( result,index );
				}//,
				// error:function(){

				// }
			});
		},
		//生成一个商品列表
		renderGoodsList = function( data,index ){
			var len = data.length,
				content = "",
			    el = $(".e-goodslist-"+_conf[index].id),
			    mark = 5,
			    size = parseInt(len / mark,10),
			    temp = [],
			    cycData = [];	 
			 
			size = len % mark == 0 ? size : (size + 1); 
			for(var i = 0;i < size; i++ ){
				temp.push(data.slice(mark * i,mark * i + mark));
			}

			for(var j = 0;j < temp.length;j++){
				content = "";
				for(var n = 0; n < temp[j].length; n++){
					var result = temp[j][n],
						pr = $.trim(result.price.replace(/a partir de/, ""));

					if( conf.dir == "rtl" ){
						pr = pr.replace(/(.+?)([\d,]+)$/,function(all,des,price){ return ( "<span>"+price+" </span>" + des);});

					}
					var goodslistLi = helper.replaceTpl(goodslistLiTpl,{
									"title":result.title,
									"link":result.link,
									"subtitle":_conf[index].subtitle,
									"imageUrl":result.img,
									"price": pr
								});

					content += goodslistLi;
				}
				content = goodslistUlTpl+content+"</ul>";
				cycData.push({"content" : content,"id" : j+1});
			}
			if(cycData.length > 1){
				var options = {
					offset: 0,
					navSize: 1,
					itemSize:958,
					autoScroll: true,
					dir:conf.dir,
					autoScrollDirection:"forward",
					autoDuration: duration || 5000,
					scrollDuration: 400,
					containerId: el,
					data: cycData,
					defaultId: 1
				};

				cyc = new cycletabs.NavUI();
				cyc.init(options);
				el.find(".e-goodslist-ul").width(958);
			} else {		 			
				el.html( content );			
			}

			el.attr("hasloaded","true");
		},
		//切换tab
		switchTab = function( index ){
			var el = $(".e-goodslist-"+_conf[index].id);

			$(".e-goodslist-con").hide();
			el.show();
			!el.attr("hasloaded") && getData( index );
			switchForm( index );
			changeTabStyle( index );
		},
		//生成对应的供应商搜索框
		switchForm = function( index ){
			index = index || 0;
			var form = $(".seller-form"),
				param = "",
				hideInput = '<input type="hidden" value="#{value}" name="#{name}">',
				inputs = "",
				data = _conf[index];

			//搜索参数
			data.param && ( param = JSON.parse( data.param ) );

			form.attr("action",_conf[index].action);
			form.find(".seller-inputtext").attr("name",data.key);

			//供应商图标和名称
			$(".seller-title").text(data.sellerName);
			$(".seller-link").attr("href",_conf[index].sellerUrl).find(".seller-img").attr("src",data.sellerIcon);

			//搜索参数
			form.find(".form-params").empty();
			if(param){
				for(var ob in param){
					inputs = inputs + helper.replaceTpl(hideInput,{"value":param[ob],"name":ob});
				};
				form.find(".form-params").append(inputs);
			}

			$(".seller-inputtext").placeholder($(".seller-inputtext").attr("pl"),{ hideOnFocus:true,customClass: "seller-placeholder",customCss: {'color': '#CDCDC1'} });

		},
		//生成tab的选中样式
		changeTabStyle = function( index ){
			index = index || 0;
			var $this = $(".e-sellerstab").eq(index);

			$(".border-bottom").hide();
			$(".e-sellerstab").removeClass("e-sellerstab_click");
			$(".tab-arrow").hide();

			$this.addClass("e-sellerstab_click");
			$this.find(".border-bottom").show();
			$this.find(".tab-arrow").show();
		},
		//绑定事件
		bindEvent = function(){
			$(".mod-bottom-ecommerce")
			//tab切换
			.on("click",".e-sellerstab",function(){
				switchTab( $(this).index() );
				UT.send({
					modId:"bottom-ecommerce",
					ac:"b",
					type:"click",
					position:"tabs"
				});
			})
			//表单提交
			.on("submit",".seller-form",function(){
				UT.send({
					modId:"bottom-ecommerce",
					type:"click",
					position:"search"
				});
			});
		};

	init();
};

module.exports = bottomEcommerce;

