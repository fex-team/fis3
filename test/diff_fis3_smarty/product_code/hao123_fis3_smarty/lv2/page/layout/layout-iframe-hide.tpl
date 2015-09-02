<%assign var="head" value=$root.head%>
<%assign var="body" value=$root.body%>
<%assign var="html" value=$root.html%>
<!DOCTYPE html>
<%html framework="common:static/mod.js"%>
    <%head%>
    <%/head%>
    <%body%>
        <%block name="content"%><%/block%>
    <%/body%>
<%/html%> 