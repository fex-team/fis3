var $ = require('common:widget/ui/jquery/jquery.js');
var sideRender = require('common:widget/ui/side-render/side-render.js');
var UT = require('common:widget/ui/ut/ut.js');


sideRender("lyrics", function () {
	var musicName = $('#lyricsMusicName'),
		searchUrl = $('#lyricsSearchUrl').val(),
		sideLyrics = $('#sideLyrics').find('ul'),
		scrollLogFlag = true,
		//歌词搜索拼接路径
		sendSearchResult = function(){
			var musicVal = musicName.val();
			if(musicVal == conf.lyrics.searchBoxText){
				window.open(encodeURI(searchUrl));
			}
			else{
				window.open(encodeURI(searchUrl+musicVal));
			}
			UT.send({position: "searchLyrics",ac: "b",modId: "lyrics",type: "click",country: conf.country});
		},
		//创建歌曲排行榜dom
		createDom = function(){
			var lyricsUl = $('#lyricsUl'),
				lyricsDom = '';
			$.ajax({
				type : "get",
				async: false,
				dataType : "jsonp",
				url: conf.apiUrlPrefix + "?app=lyric&act=contents&country=id&jsonp=?",
				success: function(msg){
					var newIndex = msg.content.total;
					if(msg.content.total > 10){
						newIndex = 10;
					}
					for(var index = 0; index < newIndex; index++){
						var songName = msg.content.data[index].song,
							artistName = msg.content.data[index].artist;
						/*if(songName.length > 22){
							songName = songName.substring(0,20) + "...";
						}
						if(artistName.length > 22){
							artistName = artistName.substring(0,20) + "...";
						}*/
						if(index < 3){
							lyricsDom += '<li><div class="num top-three">'+(index+1)+'</div><a href="'+msg.content.data[index].artist_link+'" target="_blank" class="star-img"><img src="'+msg.content.data[index].artist_img+'" width="25"/></a><div class="album"><a href="'+msg.content.data[index].song_link+'" target="_blank" class="music" title="'+msg.content.data[index].song+'">'+songName+'</a><a href="'+msg.content.data[index].artist_link+'" target="_blank" class="artist" title="'+msg.content.data[index].artist+'">'+artistName+'</a></div></li>';
						}
						else{
							lyricsDom += '<li><div class="num">'+(index+1)+'</div><a href="'+msg.content.data[index].artist_link+'" target="_blank" class="star-img"><img src="'+msg.content.data[index].artist_img+'" width="25"/></a><div class="album"><a href="'+msg.content.data[index].song_link+'" target="_blank" class="music" title="'+msg.content.data[index].song+'">'+songName+'</a><a href="'+msg.content.data[index].artist_link+'" target="_blank" class="artist" title="'+msg.content.data[index].artist+'">'+artistName+'</a></div></li>';
						}
					}
					lyricsUl.append(lyricsDom);
					require.async("common:widget/ui/scrollable/scrollable.js", function(){
						lyricsUl.scrollable({
							onScroll: function(){
								//保证效率，所以直发一次scroll统计
								if(scrollLogFlag){
									UT.send({position: "musicScroll",modId: "lyrics",type: "scroll",country: conf.country});
									scrollLogFlag = false;
								}
							}
						});
					});
				}
			});
		};

	createDom();
	//歌词搜索框默认文字
	musicName.on({
		focus:function(){
			if(this.value == conf.lyrics.searchBoxText){
				this.value = '';
			}
			$(this).css('color','#000');
		},
		blur:function(){
			if(this.value == ''){
				this.value = conf.lyrics.searchBoxText;
			}
			$(this).css('color','#999999');
		}
	});
	//歌词搜索触发事件
	$('#musicSearch').on('click', function(){
		sendSearchResult();
	});

	musicName.on('keydown', function(event){
		if(event.keyCode == '13'){
			sendSearchResult();
		}
	});
	//滚动条样式控制

	sideLyrics.on('click','.album a',function(event){
		UT.send({position: $(this).attr('class'), modId: "lyrics",type: "click",country: conf.country});
	});
});
