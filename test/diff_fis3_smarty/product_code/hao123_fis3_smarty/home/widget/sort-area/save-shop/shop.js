/*
 * shop.js只处理模块内部事务，要尽量少的与外框耦合。
 * 该文件最终会以字符串的形式存储与json格式的文件中
 * 保持和二级页方面一致，使用闭包
 */
( function( $, window ){

	var $ = require( "common:widget/ui/jquery/jquery.js" ),
		UT = require( "common:widget/ui/ut/ut.js" ),
		helper = require( "common:widget/ui/helper/helper.js" ),
		cycletabs = require("common:widget/ui/cycletabs/cycletabs.js"),

		//推荐部分滚动的元素共12个
		RECOMMONDLEN = 12,
		NAVCONTENTLEN = 15,
		//win = $(window),
		//一些需要PM配置的数据
		_conf = conf.sortArea.shopOpt,
		dataParam = helper.getQuery( conf.sortArea.sortAreaTab[_conf.tabId].dataUrl ).category.split(","),

		//此data来自tab（大框架的tab）发送请求时请求回来的dada，该data被绑定到全局对象conf的embedShopSortsite中
		data = conf.sortArea.data,
		dataContent = data.content.data.contents,
		recommondDataDefault = data.defaultData && data.defaultData.recommand,
		recommondData = recommondDataDefault ? recommondDataDefault.concat(dataContent[dataParam[0]]) : dataContent[dataParam[0]],
		firstNavDataDefault = data.defaultData && data.defaultData.firstTab,
		firstNavData = firstNavDataDefault ? firstNavDataDefault.concat(dataContent[dataParam[1]]) : dataContent[dataParam[1]],
		firstNav = dataParam[1] || "cms",
		offsetTime = {},

		//test
		// data = {"message":{"errNum":2,"errMessage":"GET DB DATA SUCCESS"},"content":{"data":{"contents":{"fashion":[{"price":"2980","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2F453402%2Fa02055.html","title":"\u30cf\u30a4\u30c9\u30ed\u30b2\u30f3 HYDROGEN \u30ed\u30f3T \u30ed\u30f3\u30b0T\u30b7\u30e3\u30c4 \u9577\u8896T\u30b7\u30e3\u30c4 \u30e1\u30f3\u30ba","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/453402_a02055","createtime":"1384438525"},{"price":"45300","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ftelaffy%2Fgf-8230e-9jr.html","title":"GF-8230E-9JR \u30ab\u30b7\u30aa G-SHOCK 30th Anniversary Lightning Yellow FROGMAN \u3010New\u3011","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/telaffy_gf-8230e-9jr","createtime":"1384438525"},{"price":"1278","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fsoukai%2F4902522914451.html","title":"(\u8a33\u3042\u308a)\u30b9\u30ea\u30e0\u30a6\u30a9\u30fc\u30af \u7f8e\u811a\u30bf\u30a4\u30c4 \u30d6\u30e9\u30c3\u30af\u30fb\u7121\u5730 M\u301cL\u30b5\u30a4\u30ba ( 2\u30b3\u30d1\u30c3\u30af )\/ \u30b9\u30ea\u30e0\u30a6\u30a9\u30fc\u30af","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/soukai_4902522914451","createtime":"1384438525"},{"price":"8190","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fvoodoocats%2F9170.html","title":"FIREFIRST\u3000\u30bf\u30fc\u30dd\u30ea\u30f3\u30d0\u30c3\u30af\u30d1\u30c3\u30af\u3000\u30e1\u30c3\u30bb\u30f3\u30b8\u30e3\u30fc\u30d0\u30c3\u30b0","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/voodoocats_9170","createtime":"1384438525"},{"price":"1999","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fkutsu-nishimura%2Fstepluck09104blk.html","title":"STEP LUCK KSM-09104 \u30e1\u30f3\u30ba \u30d3\u30b8\u30cd\u30b9\u30b7\u30e5\u30fc\u30ba \u30e2\u30f3\u30af\u30d9\u30eb\u30c8\u30bf\u30a4\u30d7 \u30d6\u30e9\u30c3\u30af","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/kutsu-nishimura_stepluck09104blk","createtime":"1384438525"},{"price":"2980","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ffurufuru%2Fmarc-wallet.html","title":"\u30a2\u30d0\u30af\u30ed Abercrombie \u30a2\u30d0\u30af\u30ed\u30f3\u30d3\u30fc\uff06\u30d5\u30a3\u30c3\u30c1 \u30a2\u30d0\u30af\u30ed \u30ed\u30f3\u30b0T\u30b7\u30e3\u30c4 \u30e1\u30f3\u30ba \u9577\u8896 \u30a2\u30d0\u30af\u30ed lon2680-2","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/furufuru_marc-wallet","createtime":"1384438525"},{"price":"3885","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fe-que%2Fvwne000000094.html","title":"\u30f4\u30a3\u30f4\u30a3\u30a2\u30f3\u30a6\u30a8\u30b9\u30c8\u30a6\u30c3\u30c9 \u30cd\u30af\u30bf\u30a4 94","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/e-que_vwne000000094","createtime":"1384438525"},{"price":"1050","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Feclity%2Fayc-evreco-.html","title":"\u30d0\u30c3\u30b0 \u4eba\u6c17 \u30d6\u30e9\u30f3\u30c9 \u6298\u308a\u305f\u305f\u307f \u30a8\u30f3\u30d3\u30ed\u30b5\u30c3\u30af\u30b9 ENVIROSAX","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/eclity_ayc-evreco-","createtime":"1384438525"},{"price":"56700","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Finfinity%2Fbarbour-internationala7.html","title":"Barbour\u3000\u30d0\u30fc\u30d6\u30a1\u30fc\u3000INTERNATIONAL\u3000JACKET\u3000\u30a4\u30f3\u30bf\u30fc\u30ca\u30b7\u30e7\u30ca\u30eb\u3000\u30aa\u30a4\u30eb\u30af\u30ed\u30b9\u3000\u30b8\u30e3\u30b1\u30c3\u30c8\u3000BLACK\u3000A007","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/infinity_barbour-internationala7","createtime":"1384438525"},{"price":"3885","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fe-que%2Fvwne000000021.html","title":"\u30f4\u30a3\u30f4\u30a3\u30a2\u30f3\u30a6\u30a8\u30b9\u30c8\u30a6\u30c3\u30c9 \u30cd\u30af\u30bf\u30a4 21","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/e-que_vwne000000021","createtime":"1384438525"},{"price":"3822","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ffukuei%2F104-0485-001.html","title":"\u30b9\u30fc\u30d1\u30fc\u30df\u30ea\u30aa\u30f3\u30d8\u30a2\u30fc\u3000\u30d6\u30e9\u30c3\u30af\uff2e\uff4f.1 30g","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/fukuei_104-0485-001","createtime":"1384438525"},{"price":"3380","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Faquagarden%2Fhydrogen-13lt-1.html","title":"\u30cf\u30a4\u30c9\u30ed\u30b2\u30f3 HYDROGEN \u30ed\u30f3\u30b0\uff34\u30b7\u30e3\u30c4 \u9577\u8896\u30ed\u30f3\u30b0\uff34\u30b7\u30e3\u30c4 \u30e1\u30f3\u30ba","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/aquagarden_hydrogen-13lt-1","createtime":"1384438525"}],"food":[{"price":"687","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fbuchibarimarket%2F4822-545.html","title":"\u30af\u30ea\u30b9\u30de\u30b9\u304a\u83d3\u5b50\u30d6\u30fc\u30c4\uff08\uff2c\uff09","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/buchibarimarket_4822-545","createtime":"1384438539"},{"price":"1980","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307217&va=2294857&vc_url=http%3A%2F%2Fwww.amazon.jp%2Fdp%2FB009HL937O%2Fref%3Dasc_df_B009HL937O887094%3Fsmid%3DAN1VRQENFRJN5%26tag%3DAssocID%26creative%3D9407%26creativeASIN%3DB009HL937O%26linkCode%3Dasn","title":"\u65ed\u677e \u30c0\u30a4\u30a8\u30c3\u30c8\u3053\u3046\u3084 \u7c89\u672b 64g\u00d710\u500b","img":"http:\/\/ecx.images-amazon.com\/images\/I\/51%2B9qMykyDL._SL160_.jpg","createtime":"1384438539"},{"price":"1920","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fkamenosuke%2F4901085049594.html","title":"\uff082\u30b1\u30fc\u30b9\u3067\u9001\u6599\u7121\u6599\uff09\u4f0a\u85e4\u5712 \u7406\u60f3\u306e\u30c8\u30de\u30c8\u3000\u7d19\u30d1\u30c3\u30af\uff08200ml\u00d724\u672c\uff09\uff08\u4f0a\u85e4\u5712\uff09\uff08\u5e38\u6e29\uff09\uff08\u30c9\u30ea\u30f3\u30af\uff09","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/kamenosuke_4901085049594","createtime":"1384438539"},{"price":"9800","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fgiftbimi%2F0-1-gift-akakiri.html","title":"\u713c\u914e\u30ae\u30d5\u30c8\u8d64\u9727\u5cf6 \u4f50\u85e4\u9ea6 \u9ce5\u98fc\u3010\u8d08\u308a\u7269 \u30d7\u30ec\u30bc\u30f3\u30c8\u30ae\u30d5\u30c8\u306b\u4eba\u6c17\u3067\u3059\uff01\u3011","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/giftbimi_0-1-gift-akakiri","createtime":"1384438539"},{"price":"2600","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ftokubaiya%2F50133.html","title":"\u30c0\u30a4\u30c9\u30fc\u3000\u30c0\u30a4\u30c9\u30fc\u30d6\u30ec\u30f3\u30c9\u30b3\u30fc\u30d2\u30fc\u3000185\uff47\u300030\u672c","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/tokubaiya_50133","createtime":"1384438539"},{"price":"2898","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ftanomail%2F9678934.html","title":"\uff08\u307e\u3068\u3081\uff09\u30b7\u30f3\u30d3\u30fc\u30ce\u3000\u30b8\u30e3\u30ef\u30c6\u30a3\u3000\u30ec\u30c3\u30c9\u3000\uff15\uff10\uff10\uff4d\uff4c\u00d7\uff12\uff14\u672c","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/tanomail_9678934","createtime":"1384438539"},{"price":"41","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fomakase%2Fg12-0313-693m.html","title":"\u30af\u30ea\u30b9\u30bf\u30eb\u30ac\u30a4\u30b6\u30fc 500ml\u3000g12-0313-693m","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/omakase_g12-0313-693m","createtime":"1384438539"},{"price":"1812","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fkamenosuke%2F4560151629537.html","title":"\uff08\u9001\u6599\u7121\u6599\uff09 \u304a\u3044\u3057\u3044\u70ad\u9178\u6c34 \uff08500ml\u00d724\u672c\u5165\uff09\uff08\u30b5\u30c3\u30dd\u30ed\uff09\uff08\u5e38\u6e29\uff09\uff08\u30c9\u30ea\u30f3\u30af\uff09","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/kamenosuke_4560151629537","createtime":"1384438539"},{"price":"1675","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fjnl%2Fe013317h.html","title":"\u3010\u30af\u30ec\u30d9\u30ea\u30f3\u30b2\u30eb 150g\u3011","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/jnl_e013317h","createtime":"1384438539"},{"price":"2685","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fk-ztown%2F269752.html","title":"\u30af\u30e9\u30b7\u30a8 \u3057\u3087\u3046\u304c\u6e6f 12g\u00d76\u888b<9\u30bb\u30c3\u30c8>","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/k-ztown_269752","createtime":"1384438539"},{"price":"650","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fkokubuya%2Ff013.html","title":"\u65ed\u98df\u54c1\u3000\u65ed\u30dd\u30f3\u9162\u3000360ml","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/kokubuya_f013","createtime":"1384438539"},{"price":"5317","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Ftanomail%2F9671058.html","title":"\uff08\u307e\u3068\u3081\uff09\u80e1\u9ebb\u9ea6\u8336\u3000\uff11\uff2c\u30da\u30c3\u30c8\u3000\uff11\uff12\u672c\u5165 \uff08223684\uff09","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/tanomail_9671058","createtime":"1384438539"},{"price":"255","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fhazama%2Fa412120h.html","title":"\u30a8\u30ad\u30ca\u30b1\u30a2\u306e\u3069\u98f4[\u30a8\u30ad\u30ca\u30b1\u30a2\u306e\u3069\u98f4]","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/hazama_a412120h","createtime":"1384438539"},{"price":"880","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307217&va=2294857&vc_url=http%3A%2F%2Fwww.amazon.jp%2Fdp%2FB00FEAMUP4%2Fref%3Dasc_df_B00FEAMUP4887094%3Fsmid%3DA1N6HTHWYSWFUT%26tag%3DAssocID%26creative%3D9419%26creativeASIN%3DB00FEAMUP4%26linkCode%3Dasn","title":"\u5927\u585a\u88fd\u85ac \u30bd\u30a4\u30ab\u30e9 \u30aa\u30ea\u30fc\u30d6\u30aa\u30a4\u30eb\u30ac\u30fc\u30ea\u30c3\u30af\u5473 27g\u00d76\u888b","img":"http:\/\/ecx.images-amazon.com\/images\/I\/41tr%2BfdaPaL._SL160_.jpg","createtime":"1384438539"},{"price":"188","link":"http:\/\/ck.jp.ap.valuecommerce.com\/servlet\/referral?vs=3035888&vp=882307085&va=2294800&vc_url=http%3A%2F%2Fstore.shopping.yahoo.co.jp%2Fhazama%2Fk418660h.html","title":"\u30b1\u30a2\u30e9\u30a4\u30b9160g[\u30b1\u30a2\u30e9\u30a4\u30b9160g]","img":"http:\/\/item.shopping.c.yimg.jp\/i\/g\/hazama_k418660h","createtime":"1384438539"}]},"updateTime":"1384438539","offsetTime":59192}}},
		// dataContent = data.content.data.contents,
		// recommondData = dataContent.fashion,
		// firstNavData = dataContent.fashion,
		// firstNav = "fashion",
		// offsetTime = {
		// 	fashion : 384
		// }
		// data.firstNav = "fashion",

		recommondCon = $("#embedShopRecommond"),
		navCon = $("#embedShopNav"),
		sortCon = $("#embedShopSort"),
		sortLoading = $("#embed-shop-loading"),
		sendingAjax = {},

		//不停的切换tab之后，或者第一次展示时，需要显示的内容
		showWhich = $.cookie("embedshop") || firstNav,

		recommondListTpl = '<li class="embed-shop-recommond-list #{first}"><a href="#{link}"><img src="#{img}" width="145" height="145" title="#{title}" /><span class="embed-shop-layer"></span><p class="embed-shop-item-name" title="#{title}">#{title}</p><p class="embedv-shop-item-price">#{price}</p></a></li>',
		navConTpl = '<span class="embed-shop-title">#{sortName}</span><ul class="cf"></ul><span class="embed-shop-time">#{offsetTime}</span>',
		navListTpl = '<li class="embed-shop-nav-list"><a href="javascript:;" target="_self" class="nav-item #{id}" data-id="#{id}">#{name}</a><span>|</span></li>',
		sortListTpl = '<li class="embed-shop-sort-list"><a href="#{link}"><img src="#{img}" width="126" height="126" title="#{title}" /><span class="embed-shop-list-icon #{special}">#{num}</span></a><p class="embed-shop-list-name" title="#{title}"><a href="#{link}" title="#{title}">#{title}</a></p><p class="embed-shop-list-price">#{price}</p></li>';
	/*
	 * 创建推荐区的DOM碎片
	 */	
	function createSlideFragment(){

		var len = Math.min( RECOMMONDLEN, recommondData.length ),
			slideData = [],
			itemStr = '<ul class="embed-shop-recommond-ul cf">',
			itemId = 1;

		for( var i=0; i<len; i++ ){

			if ( i % 4 === 0 && i !== 0 ) {
				slideData.push( 
					{
						"content": itemStr + '</ul>',
						"id": itemId
					} 
				);

				itemId ++ ;
				itemStr = '<ul class="embed-shop-recommond-ul cf">';
			}

			recommondData[i].price = _conf.character + Number(recommondData[i].price).toLocaleString();

			recommondData[i].first = i % 4 === 0 ? "first" : "";

			itemStr += helper.replaceTpl( recommondListTpl, recommondData[i] );

			if( i === len-1 ){
				slideData.push( 
					{
						"content": itemStr + '</ul>',
						"id": itemId
					} 
				);
			}
		}

		return slideData;
	}

	/*
	 * 创建分类区DOM碎片
	 */
	function createSortlistFragment(category, datas){

		var data = datas || firstNavData;
		if( !data.length ){
			return;
		}
		var	len =Math.min( NAVCONTENTLEN, data.length ),
			listFrag = '<div class="embed-shop-sort-' + category + ' embed-shop-sort-item" data-id="' + category + '"><ul class="cf">';

		if($.isEmptyObject(data)){
			return null;
		}else{

			for(var i=0; i<len; i++){

				var curData = data[i];

				curData.num = i + 1;
				i < 3 ? curData.special = "special" : curData.special = "";
				curData.price = _conf.character + Number(curData.price).toLocaleString();

				listFrag += helper.replaceTpl(sortListTpl, curData);
			}

			listFrag += '</ul></div>';

			return listFrag;
		}

	}

	/*
	 * 创建导航区DOM碎片
	 */
	function createNavFragment(){
		var containerStr = '',
			listStr = '',
			navStr = '',
			sortItem = _conf.sortItem,

			containerData = {
				sortName : _conf.sortName,
				offsetTime : formatTime(offsetTime[firstNav]),
				offsetTimeText : _conf.offsetTimeText
			},

			listData = {};

		containerStr = helper.replaceTpl(navConTpl, containerData);

		for(var key in sortItem){
			listStr += helper.replaceTpl(navListTpl, sortItem[key]);
		}

		navStr = $(containerStr).filter("ul").append(listStr).end();

		return navStr;
	}

	/*
	 * 推荐区滚动的处理
	 * 同时会将DOM碎片插入DOM
	 */
	function renderRecommondAndslide(){
		var data = createSlideFragment(),

			options = {
				offset: 0,
				navSize: 1,
				itemSize: 649,
				autoScroll: true,
				autoScrollDirection: _conf.slideDir,
				autoDuration: _conf.autoDuration,
				scrollDuration: _conf.scrollDuration,
				quickSwitch: true,
				containerId: recommondCon.find(".embed-shop-recommond-con"),
				data: data,
				defaultId: 1
			},

		recommondSlide = new cycletabs.NavUI();
		recommondSlide.init(options);
	}

	/*
	 * 渲染分类区
	 */
	function renderCategory(container, category, datas){

		var dom = createSortlistFragment(category, datas);

		container.append( dom );
	}

	/*
	 * 渲染导航区
	 */
	function renderNav(){

		var dom = createNavFragment();

		navCon.append(dom);
	}

	/*
	 * 发送请求获取数据的统一入口
	 * tab 发送请求的是哪个tab
	 */
	function getData( category ){
		var url = _conf.sortItem[category].api,
			sortContents = sortCon.find(".embed-shop-sort-item");

		sendingAjax[category] = true;

		sortContents.hide();
		sortLoading.show();

		$.ajax({
			url : url,
			dataType: "jsonp"

		}).done(function(data){

			var datas = data.content.data.contents[category];

			if(parseInt(data.message.errNum) < 0){
				sortLoading.hide();
				showContent(showWhich);
				return;

			}else{

				renderCategory(sortCon, category, datas);
				
				offsetTime[category] = data.content.data.offsetTime;

				sortLoading.hide();
				showContent(showWhich);
				setOffsetTime(offsetTime[showWhich]);
			}

			sendingAjax[category] = false;

		}).fail(function(data){

			sortLoading.hide();
			showContent(showWhich);
			sendingAjax[category] = false;
		});

	}

	/*
	 * 设置更新时间
	 */
	function setOffsetTime( time ){
		var offsetT = time || offsetTime[firstNav],
			timeDom = navCon.find(".embed-shop-time"),
			time = formatTime( offsetT );

		timeDom.text(time);
	}

	/*
	 * 格式化更新时间
	 */
	function formatTime( time ){
		var result = "",
			time = parseInt(time),
			hour = parseInt(time / 3600);
			// minute = parseInt( (time % 3600) / 60 ),
			// second = parseInt( time % 60 );

		// (hour > 0) && (result += (hour + _conf.hour));
		// (minute > 0) && (result += (minute + _conf.minute));
		// (second > 0) && (result += (second + _conf.second));

		result = result + hour + _conf.hour +  _conf.offsetTimeText;

		return result;

	}

	/*
	 * 显示用户最后点击的分类tab
	 */
	function showContent( showWhich ){

		var curCategory = sortCon.find(".embed-shop-sort-" + showWhich);

		sortCon.children().hide();
		curCategory.show();
		
	}

	/*
	 * 切换分类
	 */
	function changeCategory( category, isClick ){
		
		var content = $(".embed-shop-sort-" + category, sortCon),
			tabs = navCon.find(".nav-item"),
			tab = navCon.find("a[data-id='" + category + "']");

		tabs.removeClass("current");
		tab.addClass("current");

		if(content.length){
			showContent(category);
			setOffsetTime(offsetTime[showWhich]);

		}else{

			if(!sendingAjax[category]){
				getData(category);
			}
		}
		
		if(isClick){

			$.cookie("embedshop", category, {expires: 1800});

		}else{

			bindLikeClickEvent();
		}
	}

	// 用于当不是用户直接点击行为（cookie）进行的tab切换，但用户在该区域中有操作时，发送一次统计
	function bindLikeClickEvent(){

		sortCon.one("click", ".embed-shop-sort-item", function(){

			var category = $(this).attr("data-id");
			sendLog("categorytab", category + "tab");
		});
	}

	function bindEvent(){

		navCon.on("click", ".nav-item", function(event){

			var clickedCategory = $(this).attr("data-id");

			changeCategory(clickedCategory, true);

			showWhich = clickedCategory;
		});
	}

	function bindLog(){

		recommondCon.on("click", ".embed-shop-recommond-list", function(){

			sendLog("recommond", "conent");
		});

		navCon.on("click", ".nav-item", function(){

			var category = $(this).attr("data-id");
			sendLog("categorytab", category + "tab");
		});

		sortCon.on("click", ".embed-shop-sort-item", function(){
			
			var category = $(this).attr("data-id");
			sendLog("categoryContent", category + "content");
		});
	}

	/*
	 */
	function sendLog( position, sort ){

		UT.send({
			modId : "embedshop",
			position : position,
			sort : sort
		});
	}

	function init(){

		offsetTime[firstNav] = data.content.data.offsetTime;

		// 渲染推荐区并启动轮播
		renderRecommondAndslide();

		// 渲染导航区
		renderNav();

		// 渲染分类区
		renderCategory(sortCon, firstNav); 

		// 根据cookie切换到相应的tab，如果没有cookie切换到第一个
		changeCategory(showWhich);

		// 显示出来需要展示的category

		showContent(showWhich);

		bindEvent();

		bindLog();
		
	};

	init();

} )( jQuery, window);

