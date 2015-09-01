/**
 * @author Wayne(weiyimin01@baidu.com)
 * @date   2014.04.02
 * @description 泰国宋干节首页活动
 */
var $ = require("common:widget/ui/jquery/jquery.js");
var UT = require( "common:widget/ui/ut/ut.js" );

/**
 * 宋干节首页动画
 * @param {JSON}       conf       cms配置
 * conf = {
 * 	'flashHz'       : 40,   //刷新频率
 * 	'dropHz'        : 70,   //添加下落元素的频率
 * 	'dropDuration'  : 2000, //下落元素的缓动时间
 * 	'waterHz'       : 70,   //添加泼水元素的频率
 * 	'waterDuration' : 800,  //泼水的缓动时间
 * 	'animateTime'   : 5000, //总的动画时间
 * 	'startDropTime' : 500,  //开始添加下落元素的时间
 * 	'endAddElemTime': 1000, //动画结束前停止添加新的动画元素的时间
 * 	'girlSpeed'     : 500 , //小人上升的缓动时间
 * 	'rotateDegree'  : 1080, //花的旋转角度
 * 	'hoverText'     : "重播动画"
 * }
 */
var flashHz , dropHz , waterHz , animateTime , girlSpeed , startDropTime , endAddElemTime , waterDuration , dropDuration;

function SongKran(conf){
	if(!this.supportCanvas()){return;}
	this._conf = conf;
	this.firstTime = true;

	//生成dom
	var dom = "<div class=\"mod-event-water event-water-hide\" id=\"eventWater\"><div class=\"canvas-wrapper\"><canvas id=\"myCanvas\"></canvas><span class=\"girl\"></span></div></div>";
	$(dom).insertAfter('body');

	//获取相关dom引用
	this.$mod = $('#eventWater');
	this.$wrapper = this.$mod.find('.canvas-wrapper');
	this.$girl = this.$mod.find('.girl');

	var ctrlDom = "<span class=\"event-water-ctrl\" title=\""+ (this._conf.hoverText || 'Replay') +"\"></span>";
	this.$ctrl = $(ctrlDom).appendTo('body');
	
	this.myCanvas = document.getElementById('myCanvas');
	//定位canvas元素
	this.locateCanvas();
	this.ctx = this.myCanvas.getContext('2d');

	//动画配置
	flashHz        = Number(this._conf.flashHz) || 40; 
	dropHz         = Number(this._conf.dropHz) || 70; 
	waterHz        = Number(this._conf.waterHz) || 70; 
	animateTime    = Number(this._conf.animateTime) || 5000;
	girlSpeed      = Number(this._conf.girlSpeed) || 500;
	startDropTime  = Number(this._conf.startDropTime) || 500;
	endAddElemTime = Number(this._conf.endAddElemTime) || 1000;
	waterDuration  = Number(this._conf.waterDuration) || 800;
	dropDuration   = Number(this._conf.dropDuration) || 2000;
	rotateDegree   = Number(this._conf.rotateDegree) || 1080;

	//预加载图片资源
	this.sourceCount = 0; //加载完成的资源
	this.eventCtrl = $(this);
	this.bindEvent();
	this._drops = this.loadImage(__uri('./img/drops.png'));
	this._flower1 = this.loadImage(__uri('./img/flower1.png'));
	this._flower2 = this.loadImage(__uri('./img/flower2.png'));
	this._water = this.loadImage(__uri('./img/water.png'));
	this._girl  = this.loadImage(__uri('./img/mascot.png'));

	//注册jquery缓动函数
	$.easing.bounce = function(p) {
       if (p < (1/2.75)) {
        return (7.5625*p*p);
      } else if (p < (2/2.75)) {
        return (7.5625*(p-=(1.5/2.75))*p + .75);
      } else if (p < (2.5/2.75)) {
        return (7.5625*(p-=(2.25/2.75))*p + .9375);
      } else {
        return (7.5625*(p-=(2.625/2.75))*p + .984375);
      }
    };
}

SongKran.prototype = {
	//判断是否支持canvas
	'supportCanvas': function(){
		var UA  = navigator.userAgent;
		var str = UA.match(/msie\s(\d+)/i);
		var IE  = str ? Number(str[1]) : 10;

		if(IE >= 9){
			return true;
		}else{
			return false;
		}
	},

	//定位canvas
	'locateCanvas': function(){
		this.height = window.innerHeight;
		this.width  = window.innerWidth;
		this.myCanvas.height = this.height;
		this.myCanvas.width = this.width;
	},

	//创建一个Image对象，实现图片的预下载 
	'loadImage' : function(url) {  
		var self = this;   
	    var img = new Image();   
	    img.onload = function(){
	        img.onload = null;
	        self.imgCallback();
	    }
	    img.src = url; 
	    return img;
	},

	//图片预加载回调函数
	'imgCallback': function(){
		this.sourceCount++;
        if(this.sourceCount === 5){
        	this.eventCtrl.trigger('SOURCE_READY');
        }
	},

	'bindEvent': function(){
		var self = this;
		//资源准备完毕，初始化动画
		self.eventCtrl.on('SOURCE_READY' , function(){
			self.start();
		});

		//控制按钮事件
		self.$ctrl.on('click' , function(){
			UT.send({type:"click",position:"restart",modId:"event-water"}); 
			self.start();
		});
	},

	//开始
	'start': function(){
		var self = this;
		self.waterArr = [];
		self.dropArr = [];
		self.delta = -100;
		self.$ctrl.removeClass('event-water-ctrl-show');
		self.$mod.removeClass('event-water-hide');
		self.locateCanvas();

		self._mainTimer = setInterval(function(){
			self.delta += 100;
			if(self.delta === 0){
				//动态添加动画元素
				self._addWaterElemTimer = setInterval(function(){
					self.addWaterElem();
				} , waterHz);

				//动画
				self._animateTimer = setInterval(function(){
					self.draw();
				} , flashHz);

				return;
			}

			//开始添加下落元素并弹出小人
			if(self.delta === startDropTime){
				self._addDropElemTimer = setInterval(function(){
					self.addDropElem();
				} , dropHz);

				//弹出小人
				self.$girl.animate({
					'bottom': '15px',
				} , girlSpeed , 'bounce');
				
				return;
			}

			//结束前停止添加新元素
			if(self.delta === (animateTime - endAddElemTime)){
				clearInterval(self._addWaterElemTimer);
				clearInterval(self._addDropElemTimer);
				return;
			}

			if(self.delta === (animateTime - 500)){
				self.$girl.animate({
					'bottom': '-260px',
				} , girlSpeed);			
			}

			//结束
			if(self.delta === animateTime){
				self.stop();
				return;
			}

		} , 100);
	},

	//停止
	'stop': function(){
		var self = this;
		self._animateTimer && clearInterval(self._animateTimer);
		self._addWaterElemTimer && clearInterval(self._addWaterElemTimer);
		self._addDropElemTimer && clearInterval(self._addDropElemTimer);
		self._mainTimer && clearInterval(self._mainTimer);

		self.$mod.addClass('event-water-hide');
		self.ctx.clearRect(0 , 0 , self.width , self.height); // clear canvas

		//if(self.firstTime){
			self.$ctrl.addClass('event-water-ctrl-show');
		//}
	},

	//绘制canvas
	'draw': function(){
		var self = this;
		self.ctx.clearRect(0 , 0 , self.width , self.height); // clear canvas
		self.drawElemByArr(self.ctx , self.waterArr);
		self.drawElemByArr(self.ctx , self.dropArr);
	},

	'drawElemByArr': function(ctx , arr){
		$.each(arr , function(i , elem){
			if(!elem || elem.shouldHide){
				elem = null;
				return;
			}else{
				elem.draw(ctx , flashHz);
			}
		});
	},

	//添加动画元素
	'addWaterElem': function(){
		var d = Math.random();
		var elem;

		if(d >= 0.5){
			elem = new Water(this._water , d , this.width , this.height);
			this.waterArr.push(elem);
		}
	},

	'addDropElem': function(){
		var d = Math.random()/2;
		var elem;

		if(d >= 0.33 && d < 0.5){
			this.dropArr.push(new Flower(this._flower1 , d , this.width , this.height));
		}else if(d >= 0.17 && d < 0.33){
			this.dropArr.push(new Flower(this._flower2 , d , this.width , this.height));
		}else if(d < 0.17){
			this.dropArr.push(new LittleDrop(this._drops , d , this.width , this.height));
		}
	},
};

//动画元素基类
var animateElem = {
	'_image': '',
	'_dtime': 0,
	'shouldHide': false,
	/**
	 * 绘图函数
	 * @param  {Context2D} ctx canvas上下文
	 * @param  {int}       dt  时间间隔
	 */
	'draw': function(ctx , dt){},
	'_checkShouldHide': function(){
		this.shouldHide = (this._dtime >= this._duration); 
	},
};
//===============================================
/**
 * 泼水元素
 * @param {string} image  图片url
 * @param {Number} random 随机数
 * @param {int}    width  canvas宽度
 * @param {int}    height canvas高度
 */
function Water(image , random , width , height){
	this._image = image;
	this._duration = waterDuration;
	//随机产生起始坐标
	var xt   = random*10;
	this.x0 = (xt - Math.floor(xt)) * width;
	var yt   = random*100;
	this.y0 = (yt - Math.floor(yt)) * height;
}

Water.prototype = $.extend({} , animateElem , {
	'draw': function(ctx , dt){
		ctx.save();
		ctx.translate(this.x0 , this.y0);
		ctx.globalAlpha = 1 - this._dtime/this._duration;

		var g = tween.easeOutExpo(this._dtime , 4 , 8 , this._duration);
		ctx.drawImage(this._image , -26.2*g , -23.75*g , 52.4*g , 47.5*g);
		ctx.restore();
		this._dtime += dt;
		this._checkShouldHide();
	},
});

//=================================================
//下落元素公共基类
var dropElem = $.extend({} , animateElem , {

	'init': function(image , random , width , height){
		this._image = image;
		this._origin = this.getOrigin(random , width , height);
	},
	//获取初始坐标和scale值
	'getOrigin': function(random , width , height){
		var r1 = random * 10;
		var r2 = random * 100;
		var r3 = random * 1000;
		return {
			'x0': (r1 - Math.floor(r1)) * width,
			'y0': height - (r2 - Math.floor(r2)) * (height + 200),
			'scale': (r3 - Math.floor(r3) + 1)/2,
		};
	},
	'draw': function(ctx , dt){
		ctx.save();
		var g = tween.easeOutSine(this._dtime , 0 , 1 , this._duration);
		this._otherTransform(ctx , dt , g);
		ctx.scale(this._origin.scale , this._origin.scale);
		//ctx.globalAlpha = 1 - this._dtime/this._duration;
		ctx.drawImage(this._image , -this._image.width/2 , -this._image.height/2);
		ctx.restore();
		this._dtime += dt;
		this._checkShouldHide();
	},
	'_otherTransform': function(ctx , dt){},
});
//=================================================
function Flower(image , random , width , height){
	this._duration = dropDuration;
	this.farther = 400; //缓动距离
	this.rotateDegree = rotateDegree; //旋转角度
	this.rad = Math.PI/180; //角度转换成弧度
	this.init(image , random , width , height);
}

Flower.prototype = $.extend({} , dropElem , {
	'_otherTransform': function(ctx , dt , g){
		ctx.translate(this._origin.x0 , this._origin.y0 + this.farther * g);
		ctx.rotate(this.rotateDegree * g * this.rad);
	},
});
//==================================================
function LittleDrop(image , random , width , height){
	this._duration = dropDuration;
	this.farther = 300; //缓动距离
	this.init(image , random , width , height);
}

LittleDrop.prototype = $.extend({} , dropElem , {
	'_otherTransform': function(ctx , dt , g){
		ctx.translate(this._origin.x0 , this._origin.y0 + this.farther * g);
	},
});

/**
 * 缓动函数
 * @param  {int} t 经历的时间
 * @param  {int} b 开始位置
 * @param  {int} c 变化长度
 * @param  {int} d 总时间
 */
var tween = {
	'easeOutSine': function(t , b , c , d){
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    'easeOutExpo': function(t , b , c , d){
		return c * (1-Math.pow(2 , -10 * t/d)) + b;
	},
};

module.exports = SongKran;