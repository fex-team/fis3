<%extends file='common/page/layout/base.tpl'%>

<%block name="layout"%>
	<style>
		.mod-footer-wrap{position: absolute;top: 580px;width: 100%;}
		.mod-footer-seo{margin-top: 0;background-color: #ffffff;color: #bdbdbd;}
		.mod-footer-wrap a, .mod-footer-wrap .box-fot a{color: #bdbdbd;}
	</style>
	<%block name="header"%>
		<%if !empty($body.headerTest.headerflatnew) && $body.headerTest.headerflatnew == "1"%>
			<div class="l-wrap">	
				<%block name="header-wrap"%><%/block%>
			</div>
		<%else%>
			<div>	
				<%block name="user-bar"%><%/block%>
			</div>
		<%/if%>
	<%/block%>
	<%block name="404"%><%/block%>
	<div class="mod-footer-wrap">
		<%block name="footer"%><%/block%>
	</div>
<%/block%>