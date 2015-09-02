<%style%>
<%if $head.dir=='ltr'%> 
@import url('/widget/header-flat/site-switch/ltr/ltr.css?__inline');
<%else%> 
@import url('/widget/header-flat/site-switch/rtl/rtl.css?__inline');
<%/if%>
<%/style%>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> 
  <%require name="common:widget/header-flat/site-switch/ltr/ltr.more.css"%> 
<%else%> 
  <%require name="common:widget/header-flat/site-switch/rtl/rtl.more.css"%> 
<%/if%>

<div class="settings"></div>
<%script%>
require.async(["common:widget/ui/jquery/jquery.js"], function($) {
    $(".settings").html('<span class="settings-btn" id="settingBtn"><span class="btn-holder"></span></span> <div class="settings-dropdown" id="settingDropdown"> <ul class="settings-site" id="siteList" log-mod="country"> <li class="site_ar"> <a href="http://ar.hao123.com/?from=siteswitch" target="_self" data-la="ar-eg">مصر</a> </li> <li class="site_sa"> <a href="http://sa.hao123.com/?from=siteswitch" target="_self" data-la="ar-sa">السعودية</a> </li> <li class="site_ae"> <a href="http://ae.hao123.com/?from=siteswitch" target="_self" data-la="ar-ae">الامارات</a> </li> <li class="site_ma"> <a href="http://ma.hao123.com/?from=siteswitch" target="_self" data-la="ar-ma">المغرب</a> </li> <li class="site_br"> <a href="http://br.hao123.com/?from=siteswitch" target="_self" data-la="pt-br">Brasil</a> </li> <li class="site_id"> <a href="http://id.hao123.com/?from=siteswitch" target="_self" data-la="id-id">Indonesia</a> </li> <li class="site_jp"> <a href="http://jp.hao123.com/?from=siteswitch" target="_self" data-la="">日本</a> </li> <li class="site_th"> <a href="http://th.hao123.com/?from=siteswitch" target="_self" data-la="th-th">ประเทศไทย</a> </li> <li class="site_vn"> <a href="http://vn.hao123.com/?from=siteswitch" target="_self" data-la="vi-vn">Việt Nam</a> </li> <li class="site_en"> <a href="http://en.hao123.com/?from=siteswitch" target="_self" data-la="">USA</a> </li> <li class="site_cn"> <a href="http://cn.hao123.com/?from=siteswitch" target="_blank" data-la="zh-cn">简体中文</a> </li> <li class="site_tw"> <a href="http://tw.hao123.com/?from=siteswitch" target="_self" data-la="">繁體中文</a> </li> </ul> </div>');
    require.async("common:widget/header-flat/site-switch/site-switch-async.js");
});
<%/script%>
