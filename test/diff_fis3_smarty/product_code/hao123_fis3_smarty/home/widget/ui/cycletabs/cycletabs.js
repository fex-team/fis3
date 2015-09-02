var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');
var cycletabs = {};

/**
 * 一个特殊的数组，具有循环的特征。起始位会随着数据的获取而自行跳循环处理
 * @constructor
 */
cycletabs.UserLoopArray = function(){
    this.first = 0;
    this.last = 0;
    this.size = 0;
    this.numberList = [];
    this.count = 7;
    this.current = 0;
};
cycletabs.UserLoopArray.prototype = {
    init: function(count, size, first){
        //初始化下标队列
        for(var i=0;i<count;i++){
            this.numberList[i]=i;
        }
        this.count = count;
        this.size = size;
        this.first = first; //下标0开始
        this.last = this.first+this.size-1;
        if(this.last > (this.count-1)){
            this.last = (this.last+1) % this.count - 1;
            if(this.last < 0){
                this.last = this.count-1;
            }
        }
    },
    /**
     * 获得当前的首位下标
     */
    getFirst: function(){
        return this.first;
    },
    getLast: function(){
        return this.last;
    },
    getCurrent: function(){
        return this.current;
    },
    getCount: function(){
        return this.count;
    },
    getList: function(){
        var counter = this.size;
        var arr = new Array(counter);
        var i = 0;
        var pointer = this.first;
        while(counter){
            arr[i] = this.numberList[pointer];
            if(pointer == this.count-1){
                pointer = 0;    //reset
            } else {
                pointer++;
            }
            i++;
            counter--;
        }
        return arr;
    },
    /**
     * 在数可以循环的情况下，根据给定的两个index，计算前进或者后退的距离
     * @param index
     * @param diffIndex
     */
    getDiff: function(index, diffIndex){

        var forwardStep = diffIndex - index;
        var backwardStep = index - diffIndex;

        if(forwardStep < 0){
            forwardStep += this.count;
        }
        if(backwardStep < 0){
            backwardStep += this.count;
        }
        return {
            forwardStep: forwardStep,
            backwardStep: backwardStep
        };

    },
    getPrev: function(){
        var first = this.first;
        first--;
        if(first < 0){
            first = this.count-1;
        }
        return first;
    },
    getNext: function(){
        var last = this.last;
        last++;
        if(last == this.count){
            last = 0;
        }
        return last;
    },
    /**
     * 向后一位或指定位数
     * @param {number} [step=1] 指定后退的步长
     */
    stepPrev: function(step){
        if(step == null){
            step = 1;
        }
        while(step){
            this.first--;
            this.last--;
            this.current--;
            if(this.first < 0){
                this.first = this.count-1;
            }
            if(this.last < 0){
                this.last = this.count-1;
            }
            if(this.current < 0){
                this.current = this.count-1;
            }
            step--;
        }
        return {
            first: this.first,
            last: this.last,
            current: this.current,
            list: this.getList()
        }
    },
    /**
     * 向前一位或指定位数
     * @param {number} [step=1] 指定前进的步长
     */
    stepNext: function(step){
        if(step == null){
            step = 1;
        }
        while(step){
            this.first++;
            this.last++;
            this.current++;
            if(this.first == this.count){
                this.first = 0;
            }
            if(this.last == this.count){
                this.last = 0;
            }
            if(this.current == this.count){
                this.current = 0;
            }
            step--;
        }
        return {
            first: this.first,
            last: this.last,
            current: this.current,
            list: this.getList()
        }
    },
    debug: function(){
        return [
            ' first:', this.first,
            ' last:', this.last,
            ' current:', this.current,
            ' prev:', this.getPrev(),
            ' next:', this.getNext(),
            ' arr:', '[',this.getList().join('|'),']'
        ].join('');
    }
};
/**
 * =功能=
 * 这个是一个纯JS的Nav UI控件。有以下特征：
 * 单元数是固定的、单元的轮换是循环的、单元间的切换需要有动画效果
 * 有左、右箭头，控制Nav的左右切换。
 * Nav单元，可以被点击进行选中，则Nav进行切换
 * =实现思路=
 * Nav自身由1+size的大小构成，其中的第一个，方便形成动画效果（暂不考虑数据<=1+size的情况，后面走特殊流程）
 * 由json数据，进行初始化：根据展现的current和offset,算得实际dom中的first单元，渲染DOM结构，完成选中效果，并最后完成第一次的展现
 * 当next时，则将新展现的last追加到Nav元素列表中,将first那个单元收缩(=>width:0px)产生动画，最后将first从DOM中移除
 * 当prev时，则将新展现的first的前一个（即不可见的占位）补充到Nav元素最前边（width:0），然后展开(=>width:WIDTH px)，最后移除原来的last
 * 当select选中某个元素时，如果是当前元素，忽略；如果是前面的元素，则循环的执行后移操作；如果是后面的元素，则循环的执行前移操作。
 * @constructor
 */
cycletabs.NavUI = function(){
    /*
     //功能接口：[动画、选中、左右箭头+移动]
     //switchPrev
     //switchNext
     //switchTo [移动到特定单元]
     //--movePrev
     //--moveNext
     //_scrollPrev
     //_scrollNext
     //事件：
     //e-nav-arrow-prev-click
     //e-Nav-arrow-next-click
     //e-nav-item-click
     //UI效果类：
     //.ui-nav-hover
     // .prev-hover/active/normal .arrow-prev
     // .next-hover/active/normal .arrow-next

     //.nav-item
     //.nav-item-hover
     //.nav-item-active
     //.nav-item-current
     */
    //    this.minIndex = 1;  //数据最小下标（一般是0）
    //    this.maxIndex = 6;  //数据最大下标(一般是total)
    //    this.firstIndex = 0;    //当前展现的首位的index
    //    this.lastIndex = 0;     //当前展现末位的index
    //    this.currentIndex = 2; //当前指向的ITEM索引
    this.indexObj = new cycletabs.UserLoopArray();    //用于记录当前的指针循环
    //以下为UI默认效果，这里不处理
    //    this.loopView = true;   //循环浏览; 默认循环
    this.ITEM_SIZE = 100;   //（px）
    this.Nav_SIZE = 3;  //显示单元数
    this.CURRENT_OFFSET = 1;  //偏移显示（居中）
    this.dataList = [];
    this.$itemList = [];
    this.containerId = '';
    this.$listContainer = null;
    this.$container = null;
    // 标识，本身是否需要循环
    this.needLoop = false;
    this._scrollDuration = 300;    //500ms
    this._isScrolling = false;   //用于标识Nav处理动画状态
    this._autoScrollDirection = 'forward';   //自动滚动方向

    this.idKey = 'id';  //ITEM的唯一标识(非index)

    //自动滚动的逻辑
    this._timerAutoScroll = null;
    this._autoDuration = 1000;
    this._autoScroll = false;
    this.dir = 'ltr';
    this.direction = 'h'; //todo 声明UI的横向还是纵向放置
    this.DIR_KEY_CONFIG = { //修正ltr/rtl的文字方向+横纵向的影响
        'h-ltr':{
            'BACKWARD':'right'  //后退向右
            ,'FORWARD':'left'   //前进向左
            ,'SIZE': 'width'
        },
        'h-rtl': {
            'BACKWARD':'left'   //前进向左
            ,'FORWARD':'right'  //前进向右
            ,'SIZE': 'width'
        },
        'v': {
            'BACKWARD':'bottom'
            ,'FORWARD':'top'
            ,'SIZE': 'height'
        }
    };
    this.DIR_KEY = null; //修正rtl/ltr的动作方向差异; 默认是 left/right => right/left
    this.quickSwitch = false; //是否显示快速跳转
    this.completeLi = false; //完整li模板
};
cycletabs.NavUI.prototype = {

    /**
     * 根据给定的数据，生成需要的DOM结构
     * @param {Object} config 配置参数
     * @config {Array} data
     * @config {string} [idKey='id'] item数据的唯一标识
     * @config {string|Number} defaultId typeID
     * @config {number} [navSize=3]
     * @config {number} itemSize
     * @config {string} containerId Nav容器
     * @config {number} offset
     * @config {boolean} [autoScroll=false] 是否自动滚动
     * @config {number} [autoDuration=5000] 自动滚动间隔
     * @config {string} [autoScrollDirection='forward'] {'backward','forward'}
     * @config {number} [scrollDuration=300] 单次滚动动画用时
     * @config {string} [dir='ltr'] {'ltr','rtl'}
     */
    init: function(config){
        var that = this;
        /**
         * @type [{id:number, content:string}]    描述Nav数据结构；//Good！可以这样描述数据结构
         * @demo
         *  [{content:'default',id:'1'},{content:'new2',id:'2'},{content:'new3',id:'3'},{content:'new4',id:'4'},{content:'new5',id:'5'},{content:'new6',id:'6'}]
         */
        var data = config.data;
        that.dataList = data;
        that.$itemList = new Array(data.length);
        that.containerId = config.containerId;
        that.$container = $(that.containerId);  //cache jQueryObject
        that.idKey = config.idKey || 'id';
        that.ITEM_SIZE = config.itemSize;
        //fix
        if(config.offset != null){
            that.CURRENT_OFFSET = config.offset;
        }
        var count = data.length;
        count === 1 && (that.CURRENT_OFFSET = 0);
        that._autoDuration = config.autoDuration || 5000;
        that._scrollDuration = config.scrollDuration || 300;
        that._autoScrollDirection = config.autoScrollDirection || 'forward';
        that.showTitle = config.showTitle || 0;
        that.quickSwitch = config.quickSwitch || false;
        that.completeLi = config.completeLi || false;
        that.itemTpl = {
            "completeLi": '<li class="nav-item" data-id="#{idKey}" data-index="#{index}" title="#{content}"><i class="nav-item_#{idKey}"></i><span class="title">#{content}</span></li>',
            "showTitle": '<li class="nav-item nav-item_#{idKey}" data-id="#{idKey}" data-index="#{index}" title="#{content}">#{content}</li>',
            "normal": '<li class="nav-item nav-item_#{idKey}" data-id="#{idKey}" data-index="#{index}">#{content}</li>'
        };

        //指定方向
        that.dir = config.dir || 'ltr';
        //that.direction = 'h';   //TODO,暂不支持纵向的

        that.direction = config.direction || 'h';
        if(that.direction === 'v'){
            that.DIR_KEY = that.DIR_KEY_CONFIG[that.direction];
        }else{
            that.DIR_KEY = that.DIR_KEY_CONFIG[that.direction+'-'+that.dir];
        }


        var defaultIndex = 0;
        var defaultId = config.defaultId;
        for(var i= 0,len=data.length; i<len; i++){
            if(data[i][that.idKey] == defaultId){
                defaultIndex = i;
            }
        }

        var navSize = config.navSize;
        if(navSize == null){
            navSize = this.Nav_SIZE;
        } else {
            this.Nav_SIZE = navSize;
        }
        //note: 在ITEM数量不足navSize时，不循环处理，避免交互处理困难

        var size = navSize;
        if (navSize < data.length) {
            that.needLoop = true;    //需处理循环的工作
        } else {  //数据不足
            size = count;
        }
        that.indexObj.init(count, size, defaultIndex);
        that.indexObj.stepPrev(that.CURRENT_OFFSET);   //fix firstIndex for hideItem + real CURRENT_OFFSET

        this._render();
        //更新聚焦元素
        this._updateFocus(true);    //init
        this.bindEvent();

        that._autoScroll = config.autoScroll || false;
        if(that._autoScroll){
            that._startAutoScroll();
        }
    },
    _render: function(){
        var that = this;
        //build container
        var strArr = [
            '<div class="ui-nav">',
                '<div class="ctrl">',
                    '<p class="prev"><span class="arrow-prev">&lsaquo;</span></p>',
                    '<p class="next"><span class="arrow-next">&rsaquo;</span></p>',
                '</div>',
                '<div class="wrap">',
                    '<ul class="nav-item-list">',
                    '</ul>',
                '</div>',
                '<div class="switch">',
                '</div>',
            '</div>'
        ];
        that.$container.html(strArr.join(''));
        that.$container.find('.wrap').css( that.DIR_KEY.SIZE , that.ITEM_SIZE*that.Nav_SIZE );

        //更新Nav的容器宽度
        var list = that.indexObj.getList();
        var data = that.dataList;
        //构建元素;只有需要展现的才build
        var $tempList = [];
        for(var i= 0,len=list.length; i<len; i++){
            var index = list[i];
            var idKey = data[index][that.idKey];
        //strArr.push(['<li class="nav-item" data-id="'+data[index][that.idKey]+'" data-index="'+index+'">'+data[index].content+'</li>'].join(''));
            var $item = that._getItemObj({
                idKey: idKey,
                index: index,
                content: data[index].content
            });
            that.$itemList[index]=$item;
            $tempList.push($item);
        }
        //strArr.push('</ul></div></div>');  // /.nav-nav-item-list /.wrap /.ui-ctrl
        that.$listContainer = that.$container.find('.nav-item-list');
        $($tempList).each(function(index, item){
            that.$listContainer.append(item);
        });
        if(that.quickSwitch){
            var switchStr = "";
            for(i=0,len=data.length;i<len;i++){
                var idKey = data[i].id;
                switchStr += '<span class="switch-item switch-item_'+idKey+'" data-id="'+idKey+'"></span>';
            }
            that.$container.find(".switch").html(switchStr);
        }

    },
    _getItemObj: function(paramObj){
        var that = this,
            tplType = "normal";
        if (that.completeLi) {
            tplType = "completeLi";
        }else if(that.showTitle){
            tplType = "showTitle";
        }
        return $(helper.replaceTpl(that.itemTpl[tplType],paramObj));
    },
    bindEvent: function(){
        var that = this,
            $that = $(that);
        var $container = $(that.containerId);
        ///////FOR LOGIC /////////////////
        //UI事件
        $($container).on('click', '.prev', function(e){
            that.switchPrev();
            $that.trigger("e_click_prev");
        }).on('click','.next',function(e){
            that.switchNext();
            $that.trigger("e_click_next");
        }).on('click','.nav-item',function(e){
            var index = $(this).attr('data-index');
            that.switchTo(index);
            $that.trigger("e_click_nav",[index]);
        }).on('mouseenter','.nav-item',function(e){
            var index = $(this).attr('data-index');
            $that.trigger("e_hover_nav",[index]);
        }).on('click', '.switch-item', function(){
            var idKey = $(this).attr('data-id');
            for(var i=0; i<that.dataList.length; i++){
                if (that.dataList[i].id == idKey) {
                    break;
                }
            }
            that.switchTo(i);
        });

        //内部事件
        $(that).on('e_after_scroll', function(e){
            that._updateFocus();
            that._isScrolling = false;
        });

        //////////FOR UI EFFECT////////////////
        $($container).on({
            'mouseenter': function(e){
                $(this).addClass('ui-nav-hover');
                if(that._autoScroll){
                    that._stopAutoScroll();
                }
            },
            'mouseleave': function(e){
                $(this).removeClass('ui-nav-hover');
                if(that._autoScroll){
                    that._startAutoScroll();
                }
            }
        },'.ui-nav');
        //prev-arrow
        $($container).on({
            'mouseenter': function(e){
                $(this).addClass('prev-hover');
            },
            'mouseleave': function(e){
                $(this).removeClass('prev-hover');
            },
            'mousedown': function(){
                $(this).addClass('prev-active');
            },
            'mouseup': function(){
                $(this).removeClass('prev-active');
            }
        },'.prev');
        //next arrow
        $($container).on({
            'mouseenter': function(e){
                $(this).addClass('next-hover');
            },
            'mouseleave': function(e){
                $(this).removeClass('next-hover');
            },
            'mousedown': function(){
                $(this).addClass('next-active');
            },
            'mouseup': function(){
                $(this).removeClass('next-active');
            }
        },'.next');
        //item
        $($container).on({
            'mouseenter': function(e){
                $(this).addClass('nav-item-hover');
            },
            'mouseleave': function(e){
                $(this).removeClass('nav-item-hover');
            },
            'mousedown': function(){
                $(this).addClass('nav-item-active');
            },
            'mouseup': function(){
                $(this).removeClass('nav-item-active');
            }
        },'.nav-item');
    },
    switchNext: function(){
        //console.log('switchNext');
        var that = this;
        if(that._isScrolling){
            //console.warn('_isScrolling = true');
            return;
        }
        that._isScrolling = true;

        that.indexObj.stepNext();
        //如果ITEM数据少于Nav宽度时，不用再处理循环的“动画”问题
        if (that.needLoop) {
            that._scrollNext();
        } else {
            //更新聚焦元素
            that._updateFocus();
            that._isScrolling = false;
        }
    },
    switchPrev: function(){
        //console.log('switchPrev');
        var that = this;
        if(that._isScrolling){
            //console.warn('_isScrolling = true');
            return;
        }
        that._isScrolling = true;

        that.indexObj.stepPrev();
        if (that.needLoop) {
            that._scrollPrev();
        } else {
            //更新聚焦元素
            that._updateFocus();
            that._isScrolling = false;
        }
    },
    /**
     * 实现前进的滚动效果,支持滚动多个单元
     * @param {number} [step=1]
     * @private
     */
    _scrollNext: function(step){
        if(step == null){
            step = 1;
        }
        var that = this;
        var indexList = that.indexObj.getList().slice(-step);   //获取最后step个ITEM
        //var strArr = [];
        var $tempList = [];
        for(var i= 0; i<step; i++){
            if (indexList.length <= i) {
                step = i;
                break;
            }
            var index =  indexList[i];
            var $item = that.$itemList[index];
            if(!$item){
                var newObj = that.dataList[index];
                $item = that._getItemObj({
                    idKey: newObj[that.idKey],
                    index: index,
                    content: newObj.content
                });
                that.$itemList[index] = $item;
                $item.css( that.DIR_KEY.SIZE , that.ITEM_SIZE+'px' );
            }
            $tempList.push($item);
            //strArr.push('<li class="nav-item" data-id="'+newObj[that.idKey]+'" data-index="'+index+'">'+newObj.content+'</li>');
        }
        //增大nav的宽,收移；动画打开，直到新的第一个见为止; 移除最后一个，同时nav恢复正常宽、定位
        //var $newItems = $(strArr.join(''));
        //$newItems.find('li').css({'width':that.ITEM_SIZE+'px'});

        var keyForward = that.DIR_KEY.FORWARD;//left
        //动画实现：先将所需呈现的结点加入容器，调整容器的宽高和定位信息，保持与原来所见内容一致；再用animate函数移到最终的效果定位，最后移除旧的结点，并恢复容器的宽和定位（虽然分开执行，但是视觉上面是连贯的。结点的动画处理方式，参考的Tangram:Magic）
        var confStartStyle = {};  //{'left':0, 'width': that.ITEM_SIZE*(that.Nav_SIZE+step)}
        confStartStyle[keyForward] = 0;   //left|right: 0px
        confStartStyle[that.DIR_KEY.SIZE] = that.ITEM_SIZE*(that.Nav_SIZE+step);
        var confEndStyle = {};
        confEndStyle[keyForward] = -that.ITEM_SIZE*step;   //left|right: -xxx px;
        var confFinalStyle = {};        //{'left':0, width:that.ITEM_SIZE*that.Nav_SIZE}
        confFinalStyle[keyForward] = 0;    //left|right: 0;
        confFinalStyle[that.DIR_KEY.SIZE] = that.ITEM_SIZE*that.Nav_SIZE;

        $($tempList).each(function(index,item){
            that.$listContainer.append(item);
        });
        that.$listContainer
            //.append($newItems)
            .css(confStartStyle)
            .animate(confEndStyle, that._scrollDuration, function(){
                that.$listContainer.css(confFinalStyle);
                //临时解决在size + step > count 时，动画实现bug的问题
                //
                var removeCount = Math.min(step , that.dataList.length - that.Nav_SIZE);
                var $oldItems = that.$listContainer.find('[data-index]').slice(0,removeCount);
                //
                $oldItems.remove();
                $(that).trigger('e_after_scroll');
            });
    },
    /**
     * 实现前进的后退的效果,支持滚动多个单元
     * @param {number} [step=1]
     * @private
     */
    _scrollPrev: function(step){
        if(step == null){
            step = 1;
        }
        var that = this;
        var indexList = that.indexObj.getList().slice(0, step);   //获取前面的step个ITEM；然后从末尾到前面，这样倒插到Nav区域中
        //原有的last,要隐藏；新的first,要show

        //var strArr = [];
        var $tempList = [];
        for(var i= 0; i<step; i++){
            if (indexList.length <= i) {
                step = i;
                break;
            }
            var index =  indexList[i];
            var $item = that.$itemList[index];
            if(!$item){
                var newObj = that.dataList[index];
                //strArr.push('<li class="nav-item" data-id="'+newObj[that.idKey]+'" data-index="'+index+'">'+newObj.content+'</li>');
                $item = that._getItemObj({
                    idKey: newObj[that.idKey],
                    index: index,
                    content: newObj.content
                });
                //console.log(newObj);
                that.$itemList[index] = $item;
                $item.css( that.DIR_KEY.SIZE , that.ITEM_SIZE+'px' );
            }
            $tempList.unshift($item);   //从后面开始放入

        }
        //增大nav的宽,收移；动画打开，直到新的第一个见为止; 移除最后一个，同时nav恢复正常宽、定位
        //var $newFirstItems = $(strArr.join(''));
        //$newFirstItems.find('li').css({'width':that.ITEM_SIZE+'px'});

        var keyForward = that.DIR_KEY.FORWARD;//left
        var confStartStyle = {};  //{'left':-that.ITEM_SIZE*step, 'width': that.ITEM_SIZE*(that.navSize+step)}
        confStartStyle[keyForward] = -that.ITEM_SIZE*step;   //left: -xxxpx
        confStartStyle[that.DIR_KEY.SIZE] = that.ITEM_SIZE*(that.Nav_SIZE+step);
        var confEndStyle = {};
        confEndStyle[keyForward] = 0;   //left:0px;
        var confFinalStyle = {};        //{'left':0, width:that.ITEM_SIZE*that.Nav_SIZE}
        confFinalStyle[keyForward] = 0;    //left: 0px;
        confFinalStyle[that.DIR_KEY.SIZE] = that.ITEM_SIZE*that.Nav_SIZE;

        $($tempList).each(function(index,item){
            that.$listContainer.prepend(item);
        });
        that.$listContainer
            //.prepend($newFirstItems)
            .css(confStartStyle)
            .animate(confEndStyle, that._scrollDuration, function(){
                that.$listContainer.css(confFinalStyle);
                var $oldItems = that.$listContainer.find('[data-index]').slice(-step);  //移除旧的结点
                $oldItems.remove();
                $(that).trigger('e_after_scroll');
            });
    },
    /**
     * 定位到特定的元素。
     * 首先，计算当前选中的元素(current)与目前位置的距离"targetStep"，再采用“动画”的方式进行划向。
     * 但是，因为Nav本身是可循环的，向左向右都可以到达目标，如果navs的count>size,则我们采用“最短的滚动策略”，来决定向前移还是向后移。
     * @param targetIndex
     */
    switchTo: function(targetIndex){ //第几个项
        var that = this;
        var list = that.indexObj.getList();
        var currentIndex = list[this.CURRENT_OFFSET];
        if(currentIndex == targetIndex){
            //console.warn('currentIndex == targetIndex');
            $(that).trigger('e_toggle',{index: targetIndex});
            return ;
        }
        if(that._isScrolling){
            //console.warn('_isScrolling = true');
            return;
        }
        that._isScrolling = true;
        if(that.needLoop){
            /**
             * @type UserLoopArray.getDiff
             */
            var diff = this.indexObj.getDiff(currentIndex, targetIndex);
            if(diff.backwardStep < diff.forwardStep){   //后退更短
                that.indexObj.stepPrev(diff.backwardStep);
                //note:回调，相当于一种“私有的事件”，其他人接收不到（或不需要）
                //这里scroll后，需要调用 updateFocus；其实，用fire事件，这里就不用管了
                that._scrollPrev(diff.backwardStep);
            } else if(diff.backwardStep >= diff.forwardStep){    //前进更短
                that.indexObj.stepNext(diff.forwardStep);
                that._scrollNext(diff.forwardStep);
            }
        } else {
            //TODO: fix this
            if(currentIndex < targetIndex){ //=> forward
                that.indexObj.stepNext(targetIndex-currentIndex);
            } else {    //backward
                that.indexObj.stepPrev(currentIndex-targetIndex);
            }
            that._updateFocus();
            that._isScrolling = false;
        }
    },
    /**
     *
     * @param isInit
     * @private
     */
    _updateFocus: function(isInit){
        var that = this;
        //更新聚焦元素
        var list =  this.indexObj.getList();
        var currentIndex = list[this.CURRENT_OFFSET];
        that.$listContainer.find('[data-index]').removeClass('nav-item-current')
            .filter('[data-index='+currentIndex+']').addClass('nav-item-current');

        if (that.quickSwitch) {
            that.$container.find(".switch .switch-item-current").removeClass("switch-item-current");
            that.$container.find(".switch .switch-item_"+(1+currentIndex)).addClass("switch-item-current");
        }
        $(this).trigger('e_change',{isInit: isInit, index: currentIndex, itemObj:this.dataList[currentIndex]});
    },
    /**
     * Nav可按需要，定时跳到下一张
     * @private
     */
    _startAutoScroll: function(){
        var that = this;
        //console.log('start auto scroll');
        that._timerAutoScroll = setInterval(function(){
            if(that._autoScrollDirection == 'forward'){
                that.switchNext();
            } else {    //backward
                that.switchPrev();
            }
        }, that._autoDuration);
    },
    _stopAutoScroll: function(){
        //console.log('stop auto scroll');
        var that = this;
        clearInterval(that._timerAutoScroll);
    }
};

module.exports = cycletabs;
