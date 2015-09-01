<%extends file='lv2/page/layout/layout-spark.tpl'%>
<%* search box *%>
<%block name="p-1"%>
	<%widget name="lv2:widget/search-box/search-box.tpl"%>
<%/block%>

<%* hotsite *%>
<%block name="p-2"%>
    <%widget name="lv2:widget/spark-hotsite/spark-hotsite.tpl"%>
<%/block%>

<%* content recommand *%>
<%block name="p-3"%>
    <%if !empty($body.recommandOrder)%>
    <div class="order-wrap">
    <%foreach explode(",", $body.recommandOrder) as $mod%>
        <%$rightModTplPath = <%uri name="lv2:widget/`$mod`/`$mod`.tpl"%>%>
		<%if !empty($rightModTplPath) && file_exists(<%$sysInfo.templateRoot|cat:"$rightModTplPath"%>)%>  
		<div class="order-<%$mod%> order<%if $mod@last%> order-last<%/if%>">
			<%widget name="lv2:widget/`$mod`/`$mod`.tpl"%>
		</div>
		<%/if%>
	<%/foreach%>
	</div>
	<%/if%>
<%/block%>
