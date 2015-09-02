<%style%>
<%if $head.dir=='ltr'%> 
  @import url('/widget/partner-topbar/ltr/ltr.css?__inline');
<%else%> 
  @import url('/widget/partner-topbar/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<div class="mod-topbar<%if !empty($body.partnerBar.lightMod)%> sk-light sk-light-<%$body.partnerBar.lightMod%><%/if%>" log-mod="partner-topbar" id="topBarPar">
<div class="wr">
  <div class="logo">
    <a href="<%$body.partnerBar.logo.url%>" title="<%$body.partnerBar.logo.title%>">
      <img src="<%$body.partnerBar.logo.imgSrc%>" class="lg-nor" />
      <img src="<%$body.partnerBar.logo.hoverImgSrc%>" class="lg-hov" style="display: none;" />
    </a>
  </div>
  <ul class="list">
    <%foreach $body.partnerBar.list as $item%>
      <li style="width:<%99/$item@total%>%">
      	<a href="<%$item.url%>" <%if !empty($item.color)%> style="color: <%$item.color%>;"<%/if%> title="<%$item.title%>">
      	  <span class="hr"></span>
      	  <span class="co"><%if !empty($item.imgSrc)%><img src="<%$item.imgSrc%>" /><%/if%><%$item.content%></span>
      	</a>
      </li>
    <%/foreach%>
  </ul>
  <form action="<%$body.partnerBar.search.action%>" class="form">
     <span class="fo">
       <input name="<%$body.partnerBar.search.q%>" type="text" autocomplete="off" class="in" id="searchInput"/>
       <span class="re"></span>
     </span>
     <div class="hi" style="display: none;">
     	<%foreach $body.partnerBar.search.params as $li%>
     	   <input type="hidden" name="<%$li.name%>" value="<%$li.value%>" />
     	<%/foreach%>
     </div>
     <button type="submit" class="su"></button>
  </form>
</div>
</div>


<%script%>
  conf.partnerSearch = <%json_encode($body.partnerBar.search|default:"{}")%>;
	require.async('lv2:widget/partner-topbar/partner-topbar-async.js');
<%/script%>