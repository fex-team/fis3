<%*   声明对ltr/rtl的css依赖    *%>
<%require name="lv2:widget/sa-index-popfilm/rtl/rtl.css"%>

<div id="saIndexPopFilm" class="mod-sa-index-popfilm" log-mod="sa-index-popfilm<%$body.popFilm.mod%>">
    <div class="toptitle title<%$body.popFilm.mod%>"></div>
    <div class="films-wrap">
        <%foreach $body.popFilm.list as $list%>
            <a class="films film-item<%$body.popFilm.mod%>" href="<%$list.url%>" data-sort="<%$list@index+1%>">
                <i class="i-play pos-ab"></i>
                <img class="film-img" src="<%$list.img%>"/>
                <span class="title-mask pos-ab"></span>
                <span class="title-word pos-ab"><%$list.title%></span>
            </a>
        <%/foreach%>
    </div>
</div>



