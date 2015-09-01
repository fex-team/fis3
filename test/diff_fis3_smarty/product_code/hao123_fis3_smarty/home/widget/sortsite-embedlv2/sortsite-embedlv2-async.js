// for the title's effects of sort sites area
var $ = require('common:widget/ui/jquery/jquery.js');
$(".box-sort").on( "mouseenter", "dt", function(){
        $(this).addClass("hover");
    })
    .on( "mouseleave", "dt", function(){
        $(this).removeClass("hover click");
    })
    .on( "mousedown mouseup", "dt", function(){
        $(this).toggleClass("click");
    });