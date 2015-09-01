<style>
    .side-mod-preload-speed-test{
        border:1px solid #e3e5e6;
        border-bottom:1px solid #d7d8d9;
        background: #f5f7f7;
       /* height: 62px;*/
    }
    .side-mod-preload-speed-test > *{
        visibility: hidden;
    }
</style>

<%*   声明对ltr/rtl的css依赖    *%>
<%if $head.dir=='ltr'%> <%require name="home:widget/speed-test/ltr/ltr.css"%> <%else%> <%require name="home:widget/speed-test/rtl/rtl.css"%> <%/if%>



	<%if isset($body.speedTest)%>

	<div <%if !empty($dir)%>dir="<%$dir%>"<%/if%> class="speed-test speed-test--cover" id="speedTest" log-mod="speedtest">
	    <div class="speed-test_panel">
	        <div class="speed-test_needle"></div>
	        <div class="speed-test_chart_wrap">
	            <span class="speed-test_chart"></span>
	        </div>
	        <span class="speed-test_bandwidth"></span>
	    </div>
	    <div class="speed-test_show"></div>
	    <div class="speed-test_control">
	        <span class="speed-test_info"></span>

	        <div class="speed-test_btn"><span class="speed-test_progress"></span><a href="###" class="speed-test_start" onclick="return !1"><%$body.speedTest.textDefault%></a></div>
	        <div class="speed-test_result">
	            <div class="speed-test_result_t"></div>
	            <div class="speed-test_result_more"><em class="speed-test_result_bandwidth">N/A</em><span>Mbp/s</span></div>
	            <em class="speed-test_result_down">N/A</em><span>KB/s</span>

	           <ul class="speed-test_result_info">
	                <li class="speed-test_grade">เกรด <span><i></i><i></i><i></i></span></li>
	                <li class="speed-test_faster" style="*padding-top:13px">เร็วกว่า <em style="*bottom:5px;">64.8%</em>ของผู้ใช้ไทย</li>
	                <%if !empty($body.speedTest.imageAd)%>
                    	<%*image ad*%><li class="speed-test_imagead"></li>
                    <%else%>
                    	<%*text ad*%><li class="speed-test_share"></li>
                    <%/if%>
		   		</ul>
		   		<%if !empty($body.speedTest.facebookShare)%>
		   			<div class="speed-test_fbshare unselect">
		   				<a href="#" class="speed-test_fbsharebtn gradient-bg-darkblue" data-sort="fbshare"><i></i><strong><%$body.speedTest.facebookShare.ui.btnText%></strong></a>
		   				<div class="ui-o"></div>
		   			</div>
		   		<%/if%>
	            <div class="speed-test_ip">IP: <span></span><p></p></div>
	        </div>
	        <a href="###" style="top:-195px;right:5px;" class="speed-test_hide" onclick="return !1">&nbsp;</a>
	    </div>
</div>

	<%script%>
		require.async('common:widget/ui/jquery/jquery.js',function($){
			//#speedTest
			//两种载入条件：onload 或者 用户鼠标移到这个模块区域; 这里自定义事件
			$(window).one('e_go.speed',function(){
				require.async(['home:widget/ui/speed-test/speed-test.js'], function(speedTestInit) {
//					console.log('INIT go.speed');
					var el = $("#speedTest")[0];
					speedTestInit({
						// jsUrl: "speedtest.js",
//		    jsUrl: "/static/widget/home/speed-test/speed-test.js",
						phpUrl: "<%$body.speedTest.phpUrl%>",
						// phpUrl: "/api/spd.php",
						userip: "<%$sysInfo.userip%>",
//		    getIpUrl: "http://jsonip.com",
						getSize: 5e5,
						postSize: 1e5,
						dialQueue: [0, 1, 5, 10, 20, 30, 50, 75, 100],
						angleMax: 235,
						getSizeFallback: 1e5,
						postSizeFallback: 5e4,
						getTimes: 3,
						postTimes: 0,
						fixResult: 1,
						remainder: 1,
						testTimeout: 6e4,
						textDefault: "<%$body.speedTest.textDefault%>",
						textStart: "<%$body.speedTest.textStart%>",
						textLoading: "<%$body.speedTest.textLoading%>",
						textTesting: "<%$body.speedTest.textTesting%>",
						textError: "<%$body.speedTest.textError%>",
						tplTitle: "<%$body.speedTest.tplTitle%>",
						speedColumn: "<%$body.speedTest.speedColumn%>",
						tplTime: "<%$body.speedTest.tplTime%>",
						tplShare: '<%$html.speedTestShare|default:""%>',
						tplImageAd: '<%$html.speedTestImageAd|default:""%>',
						imageAd: <%json_encode($body.speedTest.imageAd)%>,
						<%if !empty($body.speedTest.facebookShare)%>
						fbShare: <%json_encode($body.speedTest.facebookShare)%>,
						<%/if%>
						tplGrade: "<%$body.speedTest.tplGrade%>",
						tplFaster: "<%$body.speedTest.tplFaster%>"
					}, el);
				});
			});
			if(!$("#sideMagicBox #speedTest").length){
				$(window).load(function(){
					$(window).trigger('e_go.speed');
	//				console.log('window load');
				});
				$('#speedTest').one('mouseenter',function(){
					$(window).trigger('e_go.speed');
	//				console.log('#speedTest mouseenter');
				});
			}
		});

	<%/script%>
	<%/if%>
