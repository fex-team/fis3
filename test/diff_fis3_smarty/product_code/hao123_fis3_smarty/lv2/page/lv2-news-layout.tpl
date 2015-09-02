<%extends file='common/page/layout/base.tpl'%>
<%block name="layout"%>
    <%widget name="lv2:widget/news/news.tpl" mid="<%$body.news.moduleId|default:'partnerNews'%>" mod_id="<%$body.news.modId%>"%>
<%/block%>