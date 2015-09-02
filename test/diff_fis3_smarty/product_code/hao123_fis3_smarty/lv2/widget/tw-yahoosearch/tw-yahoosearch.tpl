<%style%>
<%if $head.dir=='ltr'%> 
  @import url('/widget/tw-yahoosearch/ltr/ltr.css?__inline');
<%else%> 
  @import url('/widget/tw-yahoosearch/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%require name="lv2:widget/ui/suggest/suggest.css"%> 

<div class="mod-se-yhs" log-mod="se-yhs">
    <div alog-alias="p-1" class="se-head">
      <div class="l-wrap">
    	<div class="se-logo">
    	    <a class="lg-hao" title="<%$body.yahooSear.logoTitle%>" href="<%$body.yahooSear.logoUrl|default:'/'%>"><img src="<%$body.yahooSear.logoImg%>"></a>
    	</div>
    	<div class="se-bd">
    		<ul class="se-tab" id="tabList">
    			<li class="cur"><a href="/" onclick="return false"><%$body.yahooSear.curTab%></a></li>
                <%if !empty($body.yahooSear.tabList)%>
    			<%foreach $body.yahooSear.tabList as $item%>
    			    <li><a href="<%$item.url%>" hrf="<%$item.url%>" typ="<%$item.typ%>"><%$item.title%></a></li>
    			<%/foreach%>
                <%/if%>
    		</ul>
    		<form action="/yahoosearch" id="searchForm" target="_self" class="form">
    		    <div class="se-input">
    		       <input name="p" id="searchInput" size="42" type="text" autocomplete="off">
    		    </div>
    		    <div class="se-btn">
    		        <button type="submit" id="searchSubmit" class="se-submit"><%$body.yahooSear.submit%></button>
    		    </div>
    		</form>
    	</div>
    	<div class="se-yaho">
    		<a class="lg-yaho" title="<%$body.yahooSear.yahooTitle%>" href="<%$body.yahooSear.yahooUrl|default:'/'%>"><img src="<%$body.yahooSear.yahooImg%>"></a>
    	</div>
      </div>
    </div>
    <div alog-alias="p-2" class="l-wrap se-wrap">
    	<iframe id="content" class="se-content" src="<%$body.yahooSear.src%><%urlencode($root.urlparam.p)%>" width="100%" frameborder="0" scrolling="auto"></iframe>
    </div>
    <div alog-alias="p-3" class="l-wrap se-foot">
    	<form action="/yahoosearch" id="searchForm2" target="_self" class="form">
    		<div class="se-input">
    		    <input name="p" id="searchInput2" size="42" type="text" autocomplete="off">
    		</div>
    		<div class="se-btn">
    		    <button type="submit" id="searchSubmit2" class="se-submit"><%$body.yahooSear.submit%></button>
    		</div>
        </form>
    </div>
  </div>
</div>
<script src="http://d.yimg.com/rj/v1/yhs-no-constructor.js" type="text/javascript">
</script>
<%script%>
require.async('lv2:widget/tw-yahoosearch/tw-yahoosearch-async.js');
<%/script%>