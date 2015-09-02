<%extends file='common/page/layout/base.tpl'%>
<%block name="layout"%>
	<div class="l-g">
        <%block name="p-1-1"%>
        	<%if !empty($body.headerTest.widget)%>
				<%widget name="common:widget/header/`$body.headerTest.widget`.tpl"%>
			<%else%>
				<%widget name="common:widget/header/header.tpl"%>
			<%/if%>
        <%/block%>
    </div>
	<div class="l-g" style="<%$body.campaignIframeParent.style%>">
		<%block name="p-2-1"%>
			<iframe src="<%$body.campaignIframe.url%>" width="<%$body.campaignIframe.width%>" height="<%$body.campaignIframe.height%>" frameborder="<%$body.campaignIframe.frameborder%>" scrolling="<%$body.campaignIframe.scrolling%>"></iframe>
		<%/block%>
	</div>
	<%if !empty($body.footerSEO) && $body.footerSEO.isHidden != "1"%>
		<%widget name="common:widget/footer-seo/footer-seo.tpl"%>
	<%else%>
		<%widget name="common:widget/footer/footer.tpl" linkList=$body.footprint.links copyright=$html.copyright uaq=$head.uaq%>
	<%/if%>
<%/block%>