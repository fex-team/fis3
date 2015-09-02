

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/lyrics/ltr/ltr.css"%> <%else%> <%require name="home:widget/lyrics/rtl/rtl.css"%> <%/if%>
	<div class="mod-lyrics" id="sideLyrics" monkey="sideLyrics" log-mod="lyrics">
		<textarea style="visibility: hidden; display: none;" class="side-render" data-mod="lyrics">
			<div class="mod-side">
				<div class="search-box">
					<input type="text" name="lyricsMusicName" id="lyricsMusicName" value="<%$body.lyrics.searchBoxText%>"/>
					<div id="musicSearch"></div>
				</div>
				<div class="lyrics-ui-wrapper">
					<ul id="lyricsUl">

					</ul>
				</div>
				<input type="hidden" id="lyricsSearchUrl" name="lyricsSearchUrl" value="<%$body.lyrics.searchUrl%>" />
			</div>
			<a id='lyrics-error' class='api-error' href='#'><%$head.apiError%></a>
			<a class="charts_more" href="<%$body.lyrics.moreUrl%>"><%$body.lyrics.moreText%><i class="arrow_r">&rsaquo;</i></a>
		</textarea>
	</div>
	<%script%>
		conf.lyrics = {
			searchBoxText: "<%$body.lyrics.searchBoxText%>"
		};
		require.async('home:widget/lyrics/lyrics-async.js');
	<%/script%>
