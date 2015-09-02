<style>
    .side-mod-preload-big-ad-switch {
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
        min-height: 66px;
    }
    .side-mod-preload-big-ad-switch .slide-prev,
    .side-mod-preload-big-ad-switch .slide-next {
        visibility: hidden;
    }
    .mod-big-ad-switch .nav-item-list {
        position: relative;
        height: 100%;
        z-index: 1;
    }
    .mod-big-ad-switch {
        width: 100%;
        height: 250px;
        overflow: hidden;
        position: relative;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%require name="home:widget/big-ad-switch/<%$head.dir%>/<%$head.dir%>.css"%>

<%if $body.<%$mod%>.random == "1" && !empty($body.<%$mod%>.ad_group)%>
    <%if shuffle($body.<%$mod%>.ad_group)%><%/if%>
<%/if%>
<%if !empty($body.<%$mod%>.ad_group)%>
    <%$stData = $body.<%$mod%>.ad_group[0]%>
<%/if%>
<%assign var=useIndex value='0'%>

<div class="mod-big-ad-switch pr" log-mod="bigadbanner" id="<%$mod%>_pass">
    <ul class="nav-item-list">
        <%if $stData.type != "api"%>
            <%if empty($stData.tnForHide) || (!empty($stData.tnForHide) && !empty($body.<%$mod%>.tn) && (strpos($body.<%$mod%>.tn, $stData.tnForHide) !== false))%>
                <li class="nav-item ui-o" style="position: absolute; top: 0px; left: 0px; z-index: 0; opacity: 1;">
                    <%if $stData.type == "image"%>
                        <a href="<%$stData.url%>" data-itemid="<%$stData.itemId|default:'static0'%>" title="<%$stData.title%>" log-oid="<%$stData.offerid%>"><img src="<%$stData.src%>" alt="<%$stData.alt%>"/></a>
                    <%elseif $stData.type == "iframe"%>
                        <iframe log-oid="<%$stData.offerid%>" frameborder="no" scrolling="no" src="<%$stData.src%>" width="<%$body.<%$mod%>.width|default:300%>" height="<%$body.<%$mod%>.height|default:250%>"  marginwidth="0" marginheight="0" allowtransparency="true"></iframe>
                    <%else%>
                        <%$stData.content%>
                    <%/if%>
                </li>
                <%$useIndex = '1'%>
            <%/if%>
        <%/if%>
    </ul>
    <%if $body.<%$mod%>.hasCtrl == "1"%>
        <i class="slide-prev">&lsaquo;</i>
        <i class="slide-next">&rsaquo;</i>
    <%/if%>
</div>

<%script%>
    conf = conf || {};
    conf["<%$mod%>_pass"] = <%json_encode( $body.<%$mod%> )%>;
    conf["<%$mod%>_pass"].id = "<%$mod%>_pass";
    require.async(["common:widget/ui/jquery/jquery.js", "home:widget/big-ad-switch/big-ad-switch-async.js"], function($, sideAd) {
        new sideAd( "<%$mod%>_pass", "<%$useIndex%>" );
    });
<%/script%>
