<%extends file='lv2/page/lv2-spark-nps.tpl'%>
<%* 不发统计*%>
<%block name="redirectUt"%>
if(UT) {UT["url"] = "<%$head.redirectUt%>";notSendUt = true;}
<%/block%>

