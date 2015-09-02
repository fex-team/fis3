var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');


!function(){
	var tabContainer = $("#bottomTabs"),
		tabsDom = tabContainer.find(".bottomTabs"),
		length = tabsDom.length,

		init = function(){			

			$(".bottomContentItem:first").addClass("cur");
			bindEvents();

			if(length === 1){
				tabsDom.addClass("title");
				return;
			}
			else{
				tabsDom.eq(0).addClass("cur");
			}			
			
		},
		switchTab = function(tab){
			var $this = tab,
				tabid = $this.attr("tabid");

				$(".bottomContentItem").removeClass("cur");
				tabsDom.removeClass("cur");

				$this.addClass("cur");
				$("#"+tabid).addClass("cur");
				$this.attr("mle") == "bottomImage" && Gl.bottomImage && Gl.bottomImage.init(tabid);
		},
		bindEvents = function(){
			tabsDom.on("click",function(e){
				e.preventDefault();				
				if(length !== 1 ){
					UT.send({
	                    type:"click",
	                    position:"tabs",
	                    sort:$(this).attr("tabid"),
	                    modId:"bottom"
	                }); 
	                switchTab($(this));
	            }
			});
		};

	init();	
}();
