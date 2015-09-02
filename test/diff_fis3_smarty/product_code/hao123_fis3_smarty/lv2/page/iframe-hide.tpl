<%extends file='lv2/page/layout/layout-iframe-hide.tpl'%>

<%block name="content"%>
    <%if $body.content%>
        <%$body.content%>
    <%else%>
        <script type="text/javascript">
            try {
                var iframes = parent.document.getElementsByTagName('iframe');
                for (var i=0; i < iframes.length; i++) {
                    if (document == iframes[i].contentDocument || self == iframes[i].contentWindow) {
                        iframes[i].parentNode.style.display = 'none';
                        break;
                    }
                }
            } catch (e) {}
        </script>
    <%/if%>
<%/block%>