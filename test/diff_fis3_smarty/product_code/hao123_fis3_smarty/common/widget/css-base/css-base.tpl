<%*   声明对ltr/rtl的css依赖    *%>

<%*   *.ie.css 包含 IE 6-8 的支持, *.css 则对这部分进行了精简    *%>
<%style%>
	<%if $head.dir=='ltr'%>
		@import url('/widget/css-base/dist/base.ltr.ie.css?__inline');
		<%if !empty($head.flowLayout)%>
			@import url('/widget/css-base/dist/base.ltr.ie.flow.css?__inline');
		<%/if%>
	<%else%>
		@import url('/widget/css-base/dist/base.rtl.ie.css?__inline');
		<%if !empty($head.flowLayout)%>
			@import url('/widget/css-base/dist/base.rtl.ie.flow.css?__inline');
		<%/if%>
	<%/if%>
<%/style%>
