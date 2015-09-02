<style>
    .side-mod-preload-joke{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-joke > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/joke/ltr/ltr.css"%> <%else%> <%require name="home:widget/joke/rtl/rtl.css"%> <%/if%>



	<div class="mod-joke box-border" monkey="sidejoke" log-mod="sidejoke">
		<div class="mod-side cf">
					<span class="joke_text">
						<span class="joke_title"></span>
						<a href="" class="joke_content" data-sort="joke" title=""></a>
					</span>
			<a class="joke_refresh" href="#"></a>
		</div>
	</div>
	<%script%>
		require.async('home:widget/joke/joke-async.js');
	<%/script%>
