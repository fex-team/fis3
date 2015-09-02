<style>
    .side-mod-preload-music-player{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
    }
    .side-mod-preload-music-player > *{
        visibility: hidden;
    }
</style>
	<div class="mod-player box-border" id="sidePlayer" monkey="sideplayer" log-mod="musicplayer">
		<dl class="mod-side cf">
			<dt>
				<a href="http://www.nhaccuatui.com/">
					<i class="fr"></i>
					<%$body.<%$mod%>.title%>
				</a>
			</dt>
			<dd class="player">
				<i class="player-pic"></i>
				<div class="player-song">
					<span class="player-title"><span class="song-title"></span><span class="song-artist"></span></span>
				</div>
				<div class="player-progressbar">
					<div class="player-indicator-wrapper">
						<div class="player-indicator" id="indicator">
							<div id="loaded_indicator"></div>
							<div id="current_indicator"><i class="user_controller"></i></div>
						</div>
					</div>
					<span id="current_time">00:00</span>
				</div>
				<div class="player-controller" id="controller">
					<i id="prevSong" class="disabled" title="<%$body.<%$mod%>.prevBtnText%>"></i>
					<i id="play-pause" class="play" title="<%$body.<%$mod%>.playBtnText%>"></i>
					<i id="nextSong" class="disabled" title="<%$body.<%$mod%>.nextBtnText%>"></i>
				</div>
				<div class="player-volume">
					<input type="button" id="mute" title="静音：关"/>
				    <span id="volume_range">
				        <span id="volume" style="width: 50%;"><i class="user_controller"></i></span>
				    </span>
				</div>
			</dd>
			<dd class="playlist">
				<div class="playlist-tabwrapper">
					<ul class="playlist-tab"></ul>
					<i class="arrow_r arrow_r_disabled" id="prevTab">&lsaquo;</i>
					<i class="arrow_r" id="nextTab">&rsaquo;</i>
				</div>
				<div class="scroll-lists scroll-wrapper" onselectstart="return false;"></div>
			</dd>
			<form class="player-search" id="playerSearchForm">
				<span class="player-search-box">
					<label class="player-search-placeholder" id="playerPlaceHolder"><%$body.<%$mod%>.searchForm.placeholder%></label>
					<span class="player-search-outer">
						<input name="<%$body.<%$mod%>.searchForm.query%>" type="text" class="player-search-input" id="playerSearchBox" autocomplete="off"/>
					</span>
					<div class="player-search-btn gradient-bg-silver"><button type="submit"><i></i></button></div>
				</span>
			</form>
		</dl>
	</div>
<%script%>
	<%if !empty($body.MusicPlayer)%>
	/*音乐播放器模块*/
	conf.sidePlayer = <%json_encode($body.MusicPlayer)%>;
	require.async('home:widget/music-player/music-player-async.js');
	<%/if%>
<%/script%>
