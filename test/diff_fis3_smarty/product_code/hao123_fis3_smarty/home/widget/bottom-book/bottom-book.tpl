<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="home:widget/bottom-book/ltr/ltr.css"%> 
<%else%> 
<%require name="home:widget/bottom-book/rtl/rtl.css"%> 
<%/if%>
<div class="mod-bottom-book btm-bk" log-mod="bottom-book">
    <div class="btm-hd" style="visibility: hidden;">
       <%if !empty($body.bottomBook.logoImg)%>
         <a href="<%$body.bottomBook.logoUrl%>" class="btm-logo" title="<%$body.bottomBook.logoTitle%>"><img src="<%$body.bottomBook.logoImg%>"></a>
         <div class="btm-extra">
         	<%if !empty($body.bottomBook.right1Tle)%>
         	  <div class="btm-tle-btn btm-tle-btn1"><a href="<%$body.bottomBook.right1Url%>"><%$body.bottomBook.right1Tle%></a></div>
         	<%/if%>
         	<%if !empty($body.bottomBook.right2Tle)%>
         	  <div class="btm-tle-btn btm-tle-btn2"><a href="<%$body.bottomBook.right2Url%>"><%$body.bottomBook.right2Tle%></a></div>
         	<%/if%>
         </div>
       <%/if%>
    </div>
    <div class="btm-bd">
    	<div class="btm-wrap"></div>
    </div>
</div>
<%script%>
    conf.bottomBook = {};
    conf.bottomBook.buy = '<%$body.bottomBook.buyBook%>';
    conf.bottomBook.scrollDuration = '<%$body.bottomBook.scrollDuration%>';
    conf.bottomBook.autoScroll = '<%$body.bottomBook.autoScroll%>';
    conf.bottomBook.list = <%json_encode($body.bottomBook.list)%>;
	require.async("home:widget/bottom-book/bottom-book-async.js", function (bottomBook) {
		bottomBook();
	});
<%/script%>