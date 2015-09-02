var $ = require("common:widget/ui/jquery/jquery.js");

function Snow(config){
    config = typeof config == 'object' ? config : {};
    var begin = new Date(); 
    var timeout = config.timeout?config.timeout:10000;
    var imgInfo = config.img;
	var snowlevel = config.snowlevel?config.snowlevel:2;
    var speed = config.speed;
	var snowNum = 15;
	var screenWidth = document.documentElement.clientWidth || document.body.clientWidth;  
    snowNum = Math.ceil(snowNum*screenWidth/1024);
    // console.log(snowNum);
    var snows = [];
	var UA = navigator.userAgent;
	var IE = UA.match(/MSIE (\d+)/);
		IE = IE && +IE[1];
	var IE6 = (IE == 6);
	var snowInterval = null;
    if (!IE6) {
        function initFn() {
            var snow = function(index){
                var screenWidth = document.documentElement.clientWidth || document.body.clientWidth,    
                    screenHeight = document.documentElement.clientHeight || document.body.clientHeight, 
                    scale = Math.random() * 1 - 0.3,               
                    sizeW = Math.ceil(40 * (1 + scale) ),    
                    sizeH = Math.ceil(62 * (1 + scale) ), 
                    sizeW = 40,
                    sizeH = 62,           
                    snowX = Math.random() * (screenWidth-100),      
                    snowY = 0,                                     
                    speedX = 0,                                   
                    angleX = 0,                                    
                    speedY = parseInt(snowlevel,10) + Math.random() * speed,                 
                    amplitude = Math.random() * 3,                 
                    opacity = 1,                                 
                    img = null,                                     
                    moveInterval = null,                           
                    hideInterval = null,                            
                    _this = this;
                
                if ( Math.random() - 0.5 > 0) {                     
                    speedX = (0.01 + Math.random()/100);
                } else {
                    speedX = -(0.01 + Math.random()/100);
                }        
                var draw = function (){        
                    img = document.createElement('img');
                    var cnt = imgInfo.length;
					var info = imgInfo[Math.floor(Math.random() * cnt % cnt)]; 
                    img.src = info['src'];
                    sizeW = info['width'];
                    sizeH = info['height'];
                    var cssStyle = {
                        'position':'absolute',
                        'zIndex':'10000000',
                        'opacity':opacity,
                        'width':(sizeW + 'px'),
                        'height':(sizeH + 'px')
                    };
                    for( var i in cssStyle) {
                        if(cssStyle.hasOwnProperty(i)){
                            img.style[i] = cssStyle[i]; 
                        }           
                    }
                    img.style.left = snowX + 'px';
                    img.style.top = snowY + 'px';
                    document.body.appendChild(img);
                };
                var move = function (){ 
                    angleX += speedX;
                    snowX = snowX + amplitude * Math.sin(angleX);
                    snowY += speedY;
                    var screenWNow = document.documentElement.clientWidth || document.body.clientWidth,
                        screenHNow = document.documentElement.clientHeight || document.body.clientHeight;
                    /*表情下的高度，统一为600，大屏中就只下上半部分*/
                    var maxHeight = 600; 
                    if ( 70 < snowX && snowX < (screenWNow - 100) && 0 < snowY && snowY < maxHeight ) {
                        img.style.left = snowX + 'px';
                        img.style.top = snowY + 'px';
                    } else {
                        img.style.left = snowX + 'px';
                        img.style.top = snowY + 'px';
                        if ( !hideInterval) {
                            hideInterval = setInterval(function(){ 
                                if (opacity >= 0) {
                                    opacity -= 0.2;
                                    img.style.opacity = opacity;
                                } else {
                                    destory(); 
                                    var end = new Date();
                                    if ((end-begin) <= timeout) {
                                        snows[index] = new snow(index);
                                    }
                                }
                            }, 50);
                        }
                    }
                };
                var destory = this.destory = function(){    
                    clearInterval(hideInterval);
                    clearInterval(moveInterval);
                    if (img.parentNode) {
                        img.parentNode.removeChild(img); 
                    }
                    _this = null;
                };

                var init = function() {     
                    draw();
                    moveInterval = setInterval(function(){
                        move();
                    }, 50)
                };
                init();
            };
            function initSnow(){    
                var initSnowNum = 10 + 3 * snowlevel;
                for (var i = 0; i < initSnowNum; i ++) {
                    snows[i] = new snow(i);
                }
                /*下雪时间间隔跟下雪速度有关，速度越快，间隔越小*/
                snowInterval = setInterval( function() {
                    var snowCount = snows.length;
                    if ( snowCount < snowNum) {
                        snows[snowCount] = new snow(snowCount);
                    } else {
                        clearInterval(snowInterval);
                    }
                }, 200/snowlevel);
            }  
            function destroySnow() {
                clearInterval(snowInterval); 
            }

            var me = this;
            setTimeout(function() {
                destroySnow();
            }, timeout);

            initSnow();
        }
        initFn();
    }
};
module.exports = Snow;