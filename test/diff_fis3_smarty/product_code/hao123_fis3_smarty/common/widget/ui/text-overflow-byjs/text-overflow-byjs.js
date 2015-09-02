var $ = require('common:widget/ui/jquery/jquery.js');

function tob(paramObj){
	/*************************
		jp ch字符切割
		br ar th sa空格切割
	*************************/
	var Form = {
		Character:{
			"jp":true,
			"ch":true,
			"th":true,
			"tw":true
		},
		Space:{
			"br":true,
			"ar":true,
			"sa":true
		}
	};

	/************************
		全局查找还是部分查找
	*************************/
	var dom = paramObj.parent?paramObj.parent.find(".text-overflow-byjs"):$(".text-overflow-byjs"),
		form = paramObj.language in Form.Space ? "Space":"Character",
		more = paramObj["more"] ? paramObj["more"] : "";

	/************************
		遍历每一个元素进行
	************************/
	dom.each(function(i){
		var parentHeight = $(this).height(),
			$children = $(this).children(),
			j=6+more,
			$child;
		switch($children.eq(0)[0].tagName){ 
			case "IMG" :$child = $children.eq(1);break;//解决图文混排问题,其他情况可以添加更多的case
			default :$child = $children.eq(0);
		}
		while($child.outerHeight() > parentHeight ) {
			var content = $child.text(),//容器内文字
				outerHeight = $child.outerHeight();//超出部分高度
			if(parseInt(outerHeight)>parseInt(parentHeight)*2){//判断高度情况
				$child.html(content.substring(0,(content.length)/2+j)+"...");
			}else if(parseInt(outerHeight)>parseInt(parentHeight)*1.5){
				$child.html(content.substring(0,content.length-content.length*0.4+j)+"...");
			}else if(parseInt(outerHeight)>parseInt(parentHeight)*1.3){
				$child.html(content.substring(0,content.length-content.length*0.2+j)+"...");
			}else if(form === "Character"){//字符切割
				$child.text(content.substring(0,content.length-j)+"...");
			}else if(form === "Space"){//空格切割
				$child.html(content.substring(0,content.lastIndexOf(" ")-j)+"...");
				//$child.text(content.substring(0,content.lastIndexOf(" "))+"...");
			}
		};
	});
}

module.exports = tob;
