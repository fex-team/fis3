<%style%>
<%if $head.dir=='ltr'%> 
    @import url('/widget/header/skin-trans/ltr/ltr.css?__inline');
  <%if $body.skinTrans.padding == '1'%> 
.mod-skin-trans {
	padding-right: 10px;
}
  <%/if%>
<%else%> 
    @import url('/widget/header/skin-trans/rtl/rtl.css?__inline');
  <%if $body.skinTrans.padding == '1'%> 
.mod-skin-trans {
	padding-left: 10px;
}
  <%/if%>
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
<%require name="common:widget/header/skin-trans/ltr/ltr.more.css"%> 
<%else%> 
<%require name="common:widget/header/skin-trans/rtl/rtl.more.css"%> 
<%/if%>

<div class="mod-skin-trans" log-mod="skin-trans" id="<%$body.skinTrans.id|default: 'skinTrans'%>">
    <div class="i-st-btn">
        <i class="i-st-ico"></i><span class="i-st-tip"></span>
    </div>
</div>

<%script%>
  conf.skinTrans = <%json_encode($body.skinTrans)%>;
  conf.skinTrans.id = conf.skinTrans.id || "skinTrans";
  require.async(["common:widget/ui/jquery/jquery.js", "common:widget/header/skin-trans/skin-trans-async.js"], function($, control) {
      $(window).trigger("slide.skin"); // 触发皮肤加载文件
      $(window).trigger("append.skin"); // 触发皮肤加载文件
      control && control.init && control.init();
  });
<%/script%>