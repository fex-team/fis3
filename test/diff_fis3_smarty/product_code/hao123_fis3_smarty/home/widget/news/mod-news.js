/**
 * @overview 这个文件是用于hao123首页新闻模块的，利用命名空间，导出到全局进行调用。主要包括：NavUI,ScrollPanelUI,NewsUI
 * @type {*|{}}
 */
//这里利用一个新的全局变量，用于存储模块化的组件对象
var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');
var cycletabs = require('common:widget/ui/cycletabs/cycletabs.js');
var hex_md5 = require('common:widget/ui/md5/md5.js');
var dateTool = require('common:widget/ui/date/date.js');
var ns = {};


    /**
     * 描述新闻类别的状态
     * @constructor
     */
    ns.NewsViewUI = function(config){
        var that = this;
        $.extend(that, config);
        //{$ID: '',type:id, label: data.itemObj.content, total:60, count:-1, pn:0, pageSize:60, data:[]});
        that._scrollTop = 0;    //每次滚动时更新值
        that._isFetching = false;
        that._cacheImageList = {};
        that._hasScrollToBottom = false;
        that.logTxtSort = 'newsItemTxt';
        that.logImgSort = 'newsItemImg';
        that.logImgTxtSort = 'newsItemImgTxt';
        that.tpl = {
            normal:  "<li class='news-item news-item_txt'>"
                    +   "<a href='#{url}' data-type='#{type}' data-country='#{country}' data-seq='#{index}' data-id='#{id}' data-sort='#{dataSort}'>"
                    +       "#{timeBlock}"
                    +       "<span class='title'>"
                    +           "#{title}"
                    +       "</span>"
                    +       "#{descBlock}"
                    +   "</a>"
                    +   "<i class='dot'>●</i>"
                    +"</li>",
            desc:    "<span class='desc'>"
                    +   "#{desc}"
                    +"</span>",
            time:    "<span class='time'>"
                    +   "#{time}"
                    +"</span>"
        };
    };
    ns.NewsViewUI.prototype = {
        renderNormalNews: function(){
            var that = this;
            var data = that.data;
            var contentArr = [];
            var len = data.length;
            var item;

            for(var i=0; i<len; i++){
                item = data[i];
                contentArr.push(helper.replaceTpl(that.tpl["normal"],{
                    url: item.url,
                    type: item.type,
                    country: item.country,
                    index: i,
                    id: item.id,
                    dataSort: that.logTxtSort,
                    title: item.title,
                    timeBlock: ns.newsConfig.showTimeline ? helper.replaceTpl(that.tpl["time"],{time:
                        dateTool.format("M-d hh:mm",new Date(item.updateTime*1000))}) : "",
                    descBlock: ns.newsConfig.showDesc ? helper.replaceTpl(that.tpl["desc"],{desc:item.description}) : ""
                }));
            }
            // if(ns.newsConfig.currentType == ns.newsConfig.defaultType){
            //     var $content = $('<ul class="scroll-list">'+contentArr.join('')+'</ul>');
            //     $('.scroll #content-type-'+that.type).append($content);
            // }else{

                var $content = $('<div class="news-content-item content-type-'+that.type+'">'+that.getHotWords()+'<ul class="scroll-list">'+contentArr.join('')+'</ul></div>');
                $('.scroll .scroll-pane',this.sideNews).append($content);
            // }

            $('.scroll .content-type-'+that.type,this.sideNews).append('<li class="news-item news-item_tip">'+ ns.newsConfig.labelSeeLater+'</li>');
            // that.renderMoreLinks(that.type);
        },
        renderCoverNews: function(container){
            var that = this;
            var counter = 0;    //记录有效的图片数
            var data = that.data;
            var coverItemCount = 5;
            var everyCoverNewsStep = 7; //6+1
            var coverData = [];
            var index = 0;
            var item = null;
            /**
            *新闻模块图片提示标签
            * "<div id='nav-tip-wrapper'>
            *   <div class='nav-tip-triangle' style='border-top-color:" + ns.newsConfig.coverTipColor + "; border-bottom-color:" + ns.newsConfig.coverTipColor + ";'></div>
            *   <div class='nav-tip' style='background-color:" + ns.newsConfig.coverTipColor + ";'>" + ns.newsConfig.coverTipWord + "</div>
            *</div>";
            *@desciption 颜色和提示信息由cms配置，分别对应coverTipCover和coverTipWord
            */
            var newsTip;
            if(ns.newsConfig.coverTipWord !== '-1' && ns.newsConfig.coverTipColor !== '-1'){

                newsTip = "<div class='nav-tip-wrapper'><div class='nav-tip-triangle' style='border-top-color:" + ns.newsConfig.coverTipColor + "; border-bottom-color:" + ns.newsConfig.coverTipColor + ";'></div><div class='nav-tip' style='background-color:" + ns.newsConfig.coverTipColor + ";'>" + ns.newsConfig.coverTipWord + "</div></div>";
            }else{
                newsTip = '';
            }
            window.imgList = [];

            while(counter < Math.min(coverItemCount,data.length) && index < data.length){// 防止图片新闻数量少于coverItemCount时报错
                item = data[index];
                if(item.img != ''){
                    // 处理img字段没有带http://前缀的情况
                    /^http/.test(item.img) || (item.img = "http://"+item.img);
                    coverData.push({
                        //如果upddateTime='2000000002',则为需要添加标签的图片
                        'content': '<div><a title="'+item.title+'" href="'+item.url+'" data-type="'+item.type+'" data-country="'+item.country+'" data-seq="'+index+'" data-id="'+item.id+'" class="news-pic-link" data-sort="'+that.logImgSort+'"><img src="'+item.img+'" alt="pic" /><span class="title">'+item.title+'</span></a>' + (item.updateTime === '2000000002' ? newsTip : '') + '</div>',
                        'id': index + 1
                    });
                    counter++;
                    } else {
                    //console.warn('error img');
                    //console.log(item);
                }
                index++;
            }
            var slide = new cycletabs.NavUI();
            $.extend(that.NavUIConfig, {data: coverData});
            slide.init(that.NavUIConfig);

            //that.pn = coverItemCount;
            var contentArr = [];
            var len = data.length;
            counter = 1;    //reset

            while(index < len){
                item = data[index];

                if(counter%everyCoverNewsStep == 0){ //6txt+1pic
                    if(item.img != ''){
                        // 处理img字段没有带http://前缀的情况
                        /^http/.test(item.img) || (item.img = "http://"+item.img);
                        contentArr.push('<li class="news-item news-item_img"><p><a href="'+item.url+'" data-type="'+item.type+'" data-country="'+item.country+'" data-seq="'+index+'" data-id="'+item.id+'" class="news-pic-link" data-sort="'+that.logImgSort+'"><img data-src="'+item.img+'" alt="pic" /><span class="title">'+item.title+'</span></a></p></li>');
                        counter++;
                    } else {
                        //console.warn('error img');
                        //console.log(item);
                    }
                } else {
                    if(item.img != ''){
                        // 处理img字段没有带http://前缀的情况
                        /^http/.test(item.img) || (item.img = "http://"+item.img);
                        contentArr.push('<li class="news-item news-item_imgtxt"><p><a href="'+item.url+'" data-type="'+item.type+'" data-country="'+item.country+'" data-seq="'+index+'" data-id="'+item.id+'" class="news-pic-link" data-sort="'+that.logImgTxtSort+'"><img '+(counter>3?'data-src':'src')+'="'+item.img+'" alt="pic" /><span class="title">'+item.title+'</span></a></p></li>');
                    }else{
                        contentArr.push(helper.replaceTpl(that.tpl["normal"],{
                            url: item.url,
                            type: item.type,
                            country: item.country,
                            index: index,
                            id: item.id,
                            dataSort: that.logTxtSort,
                            title: item.title,
                            timeBlock: ns.newsConfig.showTimeline ? helper.replaceTpl(that.tpl["time"],{time:
                            dateTool.format("M-d hh:mm",new Date(item.updateTime*1000))}) : "",
                            descBlock: ns.newsConfig.showDesc ? helper.replaceTpl(that.tpl["desc"],{desc:item.description}) : ""
                        }));
                    }

                    counter++;
                }
                index++;
            }
            //that.total = counter;

            $content = $(that.getHotWords()+'<ul class="scroll-list">'+contentArr.join('')+'</ul>');
            $('.scroll .content-type-'+that.type,this.sideNews).append($content);
            $('.scroll .content-type-'+that.type,this.sideNews).append('<li class="news-item news-item_tip">'+ ns.newsConfig.labelSeeLater+'</li>');

            $content.find('img[data-src]').lazyload({
                container: $(".scroll-container",this.sideNews),
                imgClass: "data-src",
                event: "load-news-image",
                skipInvisible: false,
                threshold: 80
            });
            // that.renderMoreLinks(that.type);
        },        
        /**
         * 热搜词，只在默认展示类别显示（无论图片还是纯文本类别），图片类别位置在大图轮播下面，纯文本类别位置在第一个
         */
        getHotWords: function(){
            var that = this,
                hotwordArr = [];
            if(that.type == ns.newsConfig.defaultType && ns.newsConfig.hotWords.length){
                hotwordArr.push('<ul class="word-list">');
                $.each(ns.newsConfig.hotWords, function(i,v){
                    hotwordArr.push('<li class="word-item"><a href="'+v.url+'" data-sort="newsHotWord">'+v.name+'</a></li>');
                });
                hotwordArr.push('</ul>');
            }
            return hotwordArr.join('');
        },
        /**
         * 每个类别自定义更多链接，虽然现在没有地方用，但是暂时保留
         */
        renderMoreLinks: function(type){
            var moreLinks = $(".newsMoreLink",this.sideNews);
            var moreInfo;
            for(var i=0,val;val=conf.sideNews.newsTypeList[i];i++){
                if(val.id == type){
                    moreInfo = conf.sideNews.newsTypeList[i];
                }
            }
            var commonMoreInfo = conf.sideNews;
            var moreTpl = '<a class="charts_more" id="newsMoreLink" href="#{moreUrl}" data-sort="more"><span class="powerby">#{powerby}</span>#{moreText}<i class="arrow_r">›</i></a>';

            if(moreInfo.moreUrl && moreInfo.moreText){
                moreLinks.replaceWith(
                    helper.replaceTpl(moreTpl,{
                        powerby: moreInfo.powerby,
                        moreUrl: moreInfo.moreUrl,
                        moreText: moreInfo.moreText
                    })
                );
            }else if(commonMoreInfo.moreUrl && commonMoreInfo.moreText){
                moreLinks.replaceWith(
                    helper.replaceTpl(moreTpl,{
                        powerby: moreInfo.powerby || "",
                        moreUrl: commonMoreInfo.moreUrl,
                        moreText: commonMoreInfo.moreText
                    })
                );
            }else{
                moreLinks.hide();
            }
        },
        /**
         * 获取更多的数据
         */
        fetch: function(){
            var that = this;
            if(that.count == that.total){
                //console.log('data ready!');
                return ;
            } else {
                //note: 目前数据接口，还不支持分页返回
                var params = "?app=news&act=articles&model=normal&country="+ns.newsConfig.country+"&type="+this.type+"&num="+this.pageSize+(conf.sideNews.wide==1?"&wide=1":"");
                $.ajax({
                    // url: "/static/home/widget/news/data_"+this.type+".json",
                    url: ns.newsConfig.requestUrlPrefix + params,
                    dataType: "jsonp",
                    jsonp: "jsonp",
                    jsonpCallback: "ghao123_" + hex_md5(params,16),
                    // jsonpCallback: "ghao123_d251a1d7fc7a0ef5",
                    cache: false,
                    error: function(XMLHttpRequest, textStatus, errorThrown){
                        //$("#sideNews").hide();
                    },
                    success: function(retData) {
                        if(retData.message && retData.message.errNum >= 0){
                            that._appendData(retData.content.data.contents);
                            that._isFetching = false;
                        } else {
                            that._isFetching = false;
                            //console.warn('error');
                        }
                    }
                });
            }
        },
        /**
         *
         * @param {array} content.data [{country: "ar",img: "api.gld.hao123.com/xxxx.jpg",title: "",type: "2",updateTime: "2013-03-19 03:32",url: ""}]
         * @param {number} content.total
         * @private
         */
        _appendData: function(content){
            var that = this;
            //update data & update state
            //note: 因为不支持翻页，这里直接更新数据即可
            that.data = content[this.type];
            that.total = that.data.length; //返回的总量（为避免不足total，这里把total也更新了）
            that.count = that.total;
            $(that).trigger('e_append_data');   //发个事件。。
        }
    };

	////////////////////
	var __logTimerList = {};  //用于避免多次发送log做的锁
	/**
	 * 用于简化发统计的操作
	 * @param type click/scroll
	 * @param element
	 * @param {number} [lockTime=100] ms
	 * @param {object} [extra]
     * @param {string} [modId]
	 */
	ns.log = function(modid, type, sort, lockTime, extra){
		if(lockTime == null){
			lockTime = 100; //延迟
		}
		var params = {
			level:1,
            modId:modid
			// position:"sideNews"
		};
        /*if(type == "click")
            params.modId = "news";*/
		if(extra == null){
			extra = params;
		} else {
			$.extend(extra, params);
		}
		extra.type = type;
		extra.sort = sort;

		if(!__logTimerList[sort]){   //如果没有锁定才发统计
			UT.send(extra);
			__logTimerList[sort] = true;
			if(lockTime > 0){   //if lockTime == -1 ==> never open again
				setTimeout(function(){
					//一秒之后再解
					__logTimerList[sort] = false;
				},lockTime);
			}
		}
	};
	/////////////////////

module.exports = ns;

