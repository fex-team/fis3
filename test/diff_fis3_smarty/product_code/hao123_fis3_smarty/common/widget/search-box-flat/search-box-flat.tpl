
<%if $head.dir=='ltr'%> 
  <%style%>
    @import url('/widget/search-box-flat/ltr/ltr.css?__inline');
  <%/style%>
  <%require name="common:widget/search-box-flat/ltr/ltr.more.css"%> 
  
  <%if !empty($head.flowLayout) %>
	<%style%>
		@import url('/widget/search-box-flat/flow/ltr/ltr.css?__inline');
	<%/style%>
	<%require name="common:widget/search-box-flat/flow/ltr/ltr.flow.css"%> 
  <%/if%>

  <%if $body.searchBox.widget == "search-box-4ps" %>
  <%style%>
    @import url('/widget/search-box-flat/4ps/ltr/ltr.css?__inline');
  <%/style%>
  <%/if%>
<%else%> 
  <%style%>
    @import url('/widget/search-box-flat/rtl/rtl.css?__inline');
  <%/style%>
  <%require name="common:widget/search-box-flat/rtl/rtl.more.css"%> 

  <%if !empty($head.flowLayout) %>
	<%style%>
		@import url('/widget/search-box-flat/flow/rtl/rtl.css?__inline');
	<%/style%>
	<%require name="common:widget/search-box-flat/flow/rtl/rtl.flow.css"%> 
  <%/if%>

  <%if $body.searchBox.widget == "search-box-4ps" %>
  <%style%>
    @import url('/widget/search-box-flat/4ps/rtl/rtl.css?__inline');
  <%/style%>
  <%/if%>
<%/if%>
<%*阿泰葡不使用4ps模版但使用ps搜索时的样式*%>
<%if $body.searchBox.widget != "search-box-4ps" && !empty($body.searchBox.sugUrl)%>
  <%widget name="common:widget/search-box-4ps-noradio/search-box-4ps-noradio.tpl"%>
<%/if%>
