var $ = jQuery = require("common:widget/ui/jquery/jquery.js");
var UT = require("common:widget/ui/ut/ut.js");

$(".mod-hotsite-newtab .hotsite-newtab > span").hover(
  function(){
    var thisObj = $(this),
        position = thisObj.find(".hotsite_link").position(),
        moreLinks = thisObj.children(".more_links");

    if( thisObj.hasClass("description") ){
        return;
    }    
    thisObj.addClass("hotsite_hover");
    
    if(moreLinks.length){
      moreLinks.css({"left":position.left,"top":position.top+thisObj.height()});
      moreLinks.find("img").each(function(){
        var that = $(this);
        if(that.attr('customsrc')){
          that.attr("src",that.attr('customsrc'));
        }else{
          that.attr("src",getFavIconUrl(that.parent().attr('href')));
        }              
      });
      moreLinks.show();
    }            

  },
  function(){
    var thisObj = $(this); 
    if( thisObj.hasClass("description") ){
        return;
    }           
    thisObj.removeClass("hotsite_hover");
    thisObj.children(".more_links").hide();
      
  }
);

$("#hotsiteNewTab").click(function(){
  $(this).addClass("cur");
  $(".mod-hotsite-newtab").addClass("current").show();
  $(".hotsite-custom").show();
  $("#hotsiteContainer").hide();
  $("#notepadContainer").hide();
  $("#hotsiteTab,#historyTab,#notepadTab").removeClass("cur close");
});

$("#hotsiteTab,#historyTab").on("click", function () {
    $(".mod-hotsite-newtab").hide().removeClass("current");
    $(".hotsite-custom").show();
    $("#hotsiteContainer").show();
});