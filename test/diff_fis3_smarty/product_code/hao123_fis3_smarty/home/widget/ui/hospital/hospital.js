var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var helper = require('common:widget/ui/helper/helper.js');

var hospital = function() {
	var bindEvents = function() {
		// var $hosp = $('#sideHospitle'),
		// 	$checkbox = $('.checkbox-item',$hosp),
		// 	$radio = $('.radio-item',$hosp),
		var	$searchBtn = $('#searchBtn');

		// $checkbox.on('click',function(){
		// 	var checkboxID = '#' + $(this).attr('for'),
		// 		$checkboxItem = $(checkboxID);

		// 	if( $(this).hasClass('checkbox-checked') ){
		// 		$(this).removeClass('checkbox-checked');
		// 		$checkboxItem.prop('checked',true);
		// 	}else{
		// 		$(this).addClass('checkbox-checked');
		// 		$checkboxItem.prop('checked',false);
		// 	}
		// });
		// $radio.on( 'click', function(){
		// 	var radioID = '#' + $(this).attr('for'),
		// 		$radioItem = $(radioID),
		// 		radioName = $radioItem.attr('name');

		// 	if( !$(this).hasClass('radio-checked') ){
		// 		$.each( $radio, function( i,item ){
		// 			var _item = $(item);
		// 			if( _item.prev().attr('name') == radioName ){
		// 				_item.removeClass('radio-checked');
		// 				$radioItem.prop('checked',false);
		// 			}
		// 		});
		// 		$(this).addClass('radio-checked');
		// 		$radioItem.prop('checked',true);
		// 	}
		// });
		$searchBtn.on( 'click', function(){
			var utObj = {
				"type": "click",
				"modId": "hospital"
			};
			UT && UT.send(utObj);
		});
	};
	var placeholderFix = function(){
		//ie浏览器不支持placeholder fix
		var $inputbox = $('#sideHospitle').find('.inputbox'),
			$searchArea = $('#search-area'),
			$searchKeyword = $('#search-keyword'),
			supportPlaceholder = ('placeholder' in document.createElement('input')),
			placeholderTpl = '<label class="placeholder-iefix">#{note}</label>';
		
		if (!supportPlaceholder) {
				var note1Tpl = '',
					note2Tpl = '';

				note1Tpl  = note1Tpl  + helper.replaceTpl(placeholderTpl,{"note":conf.hospital.note1});
				note2Tpl  = note2Tpl  + helper.replaceTpl(placeholderTpl,{"note":conf.hospital.note2});
				$searchArea.append(note1Tpl);
				$searchKeyword.append(note2Tpl);
				
				var $plLabel = $('#sideHospitle').find('.placeholder-iefix');
				$inputbox.on({
					focus: function() {
						$(this).next().hide();
					},
					blur: function() {
						$(this).val() == "" && $(this).next().show();
					}
				});
				$plLabel.on('click', function(){
					$(this).prev().focus();
				});
		}
	};
	
	var init = function() {
		bindEvents();
		placeholderFix();
	};
	init();
};

module.exports = hospital;