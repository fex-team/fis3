<style type="text/css">
	.mod-sort-area-apps{
		background-color: #f9fafa;
		padding: 12px 12px 22px;
		visibility: visible !important;
	}
	.mod-sort-area-apps a{
		display: inline-block;
	}
	.mod-sort-area-apps h2{
		font-size: 16px;
		font-weight: 800;
		border-left: 2px solid #39ba8b;
		color: #444;
		padding-left: 6px;
		margin-bottom: 8px;
	}
	/**carousel**/
	.mod-sort-area-apps .carousel-content{
		height: 220px;
		margin-bottom: 18px;
		position: relative;
		overflow: hidden;
	}
	.mod-sort-area-apps .carousel-content ul{
		width: 1740px;
		height: 215px;
		position: absolute;
		left: -308px;
	}
	.mod-sort-area-apps .carousel-content .carousel-list{
		float: left;
		position: relative;
	}
	.mod-sort-area-apps .carousel-content .item-btn{
		position: absolute;
		display: block;
		width: 122px;
		height: 215px;
		opacity: 0;
		filter: alpha(opacity=0);
		cursor: pointer;
		background-color: #000;
		z-index: 1;
	}
	.mod-sort-area-apps .carousel-content .leftItem{
		left: 0px;
		top: 0px;
	}
	.mod-sort-area-apps .carousel-content .rightItem{
		right: 0px;
		top: 0px;
	}
	/*
	.mod-sort-area-apps .carousel-items-container{
		width: 684px;
		height: 220px;
		overflow: hidden;
	}
	.mod-sort-area-apps .carousel-items-container ul{
		width: 1740px;
		margin-left: -305px;
	}
	*/
	.mod-sort-area-apps .carousel-list{
		float: left;
		margin-right: 5px;
		box-shadow: 0px 2px 3px #aaa;
	}
	.mod-sort-area-apps .carousel-list a{
		display: block;
	}
	.mod-sort-area-apps .carousel-list a img{
		width: 430px;
		height: 215px;
	}
	/*
	.mod-sort-area-apps .carousel-content .ui-nav .nav-item-list{
		position: relative;
	}
	.mod-sort-area-apps .carousel-content .ui-nav .nav-item{
		float: left;
	}
	*/
	.mod-sort-area-apps .carousel-content .arrow{
		width: 35px;
		height: 63px;
		position: absolute;
		top: 75px;
		cursor: pointer;
		z-index: 2;
	}
	.mod-sort-area-apps .carousel-content .arrow.left:hover,
	.mod-sort-area-apps .carousel-content .arrow.right:hover{
		background-color: rgba(0,188,164,0.5);
	}
	.mod-sort-area-apps .carousel-content .arrow.left{
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -42px;
		left: 0px;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
	}
	.mod-sort-area-apps .carousel-content .arrow.right{
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -110px;
		right: 0px;
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}
	
	/**hot**/
	.mod-sort-area-apps .float-container .hot,
	.mod-sort-area-apps .float-container .new{
		float: left;
		overflow: hidden;
	}
	.mod-sort-area-apps .float-container .hot{
		width: 486px;
		margin-right: 10px;

	}
	.mod-sort-area-apps .hot .hot-list{
		float: left;
		width: 236px;
		height: 135px;
		border: 1px solid #d1d1d1;
		margin-bottom: 10px;
		position: relative;
		box-shadow: 0 1px 1px #ccc;
		margin-right: 10px;
	}
	.mod-sort-area-apps .hot .hot-list.last{
		margin-right: 0px;
	}
	.mod-sort-area-apps .hot .new-icon{
		display: block;
		width: 38px;
		height: 38px;
		position: absolute;
		right: -1px;
		top: -1px;
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 0px;
	}
	.mod-sort-area-apps .hot .hot-main{
		padding: 10px;
		background-color: #fff;
	}
	.mod-sort-area-apps .hot .hot-list-title{
		color: #444;
		font-size: 14px;
		font-weight: 800;
	}
	.mod-sort-area-apps .hot .hot-list-title a{
		max-width: 155px;

	}
	.mod-sort-area-apps .hot .hot-list-title a:hover{
		color: #1aae76;
		text-decoration: underline;
	}
	.mod-sort-area-apps .hot .hot-useres{
		color: #c3c3c3;
	}
	.mod-sort-area-apps .hot .hot-user-icon{
		display: block;
		width: 17px;
		height: 18px;
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -232px;
		float: left;
		margin-right: 4px;
	}
	.mod-sort-area-apps .hot .spcIco{
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -213px;
	}
	.mod-sort-area-apps .hot .hot-user-num{
		display: inline-block;
		height: 18px;
		line-height: 20px;
		color: #d1d1d1;
	}
	.mod-sort-area-apps .hot .hot-main img{
		width: 46px;
		height: 46px;
		margin-right: 10px;
		border: 1px solid #d2d4d5;
		border-radius: 5px;
	}
	.mod-sort-area-apps .hot .hot-main .img-container{
		float: left;
	}
	.mod-sort-area-apps .hot .hot-des{
		height: 46px;
		border-top: 1px solid #f3f3f3;
		background-color: #f9fafa;
		position: relative;
		margin: 0 10px;
		color: #666;
	}
	.mod-sort-area-apps .hot .hot-des p{
		line-height: 16px;
	}
	.mod-sort-area-apps .hot .hot-des .ui-arrow.out,
	.mod-sort-area-apps .hot .hot-des .ui-arrow.in{
		border-width: 7px;
		top: -13px;
		left: 25px;
	}

	.mod-sort-area-apps .hot .hot-des .ui-arrow.out{
		border-bottom-color: #f3f3f3;
		top: -14px;
	}
	.mod-sort-area-apps .hot .hot-des .ui-arrow.in{
		border-bottom-color: #f9fafa;
		
	}
	.mod-sort-area-apps .hot .text-overflow-block,
	.mod-sort-area-apps .hot .text-overflow-block:before{
	    height: 46px; 
	    line-height: 16px; 
	    margin-top: 10px;
	}
	.mod-sort-area-apps .hot .text-overflow-block:after{
		background: linear-gradient(to right,rgba(255,255,255,0),#f9fafa 50%,#f9fafa);
		background: -webkit-gradient(linear,left top,right top,from(rgba(255,255,255,0)),to(#f9fafa),color-stop(50%,#f9fafa));
	}
	/**new**/
	.mod-sort-area-apps .new{
		border: 1px solid #d1d1d1;
		margin-top: 26px;
		background-color: #fff;
		box-shadow: 0 1px 1px #ccc;
		width: 184px;
	}
	.mod-sort-area-apps .new h2{
		border: none;
		height: 29px;
		line-height: 29px;
		background-color: #fafafa;
		font-weight: normal;
		margin-bottom: 0px;
		border-bottom: 1px solid #f2f2f2;
	}
	.mod-sort-area-apps .new .new-list.even{
		background-color: #fafafa;
	}
	.mod-sort-area-apps .new .list-container{
		display: block;
		height: 40px;
		line-height: 40px;
		color: #595959;
	}
	.mod-sort-area-apps .new .list-container .icon{
		display: inline-block;
		width: 15px;
		height: 15px;
		line-height: 17px;
		text-align: center;
		color: #fff;
		background-color: #ccc;
		margin-left: 10px;
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -195px;
		vertical-align: middle;
	}
	.mod-sort-area-apps .new .list-container .spcIco{
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -178px;
	}
	.mod-sort-area-apps .new .list-container .name{
		margin-left: 5px;
		display: inline-block;
		height: 15px;
		line-height: 15px;
		max-width: 130px;
		vertical-align: middle;
	}
	.mod-sort-area-apps .new .list-container:hover .name{
		color: #1cad77;
		box-shadow: 0 1px 0px #1cad77;
	}
	.mod-sort-area-apps .new .list-container img{
		width: 16px;
		height: 16px;
		margin-left: 5px;
		border: 1px solid #d2d4d5;
		border-radius: 2px;
	}


	/**more**/
	.mod-sort-area-apps .more-content{
		border: 1px solid #d1d1d1;
		padding: 10px 25px 20px 35px;
		background-color: #fff;
		box-shadow: 0px 1px 1px #ccc;
		position: relative;
		height: 139px;
	}
	.mod-sort-area-apps .more-content .list-container{
		height: 228px;
		overflow: hidden;
	}
	.mod-sort-area-apps .more .more-list{
		width: 152px;
		height: 45px;
		float: left;
		position: relative;
		margin-left: 1px;
		margin-top: 1px;
	}
	.mod-sort-area-apps .more .more-list.last{
		margin-right: 0px;
	}
	.mod-sort-area-apps .more .more-list-title{
		color: #444;
		font-size: 12px;
		height: 16px;
	}
	.mod-sort-area-apps .more .more-list-title a{
		width: 87px;
	}
	.mod-sort-area-apps .more .more-list-title a:hover{
		text-decoration: underline;
		color: #1aae76;
	}
	.mod-sort-area-apps .more .more-useres{
		color: #c3c3c3;
	}
	.mod-sort-area-apps .more .more-user-icon{
		display: block;
		width: 17px;
		height: 18px;
		background: url(/resource/br/tab/app-tab.png) no-repeat 0 -232px;
		float: left;
		margin-right: 4px;
	}
	.mod-sort-area-apps .more .more-user-num{
		display: inline-block;
		height: 18px;
		line-height: 20px;
		color: #d1d1d1;
	}
	.mod-sort-area-apps .more .more-main{
		padding: 10px 10px 0;
	}
	.mod-sort-area-apps .more .more-list.hovered .more-main{
	box-shadow: 1px 0px 0px #e7e8e8, 0px -1px 0px #e7e8e8, -1px 0px 0px #e7e8e8;
	}
	.mod-sort-area-apps .more .more-main img{
		width: 33px;
		height: 33px;
		margin-right: 10px;
		border: 1px solid #d2d4d5;
		border-radius: 3px;
	}
	.mod-sort-area-apps .more .more-main .img-container{
		float: left;
	}
	.mod-sort-area-apps .more .more-des{
		max-height: 78px;
		position: relative;
		padding: 10px 0px 0px;
		color: #666;
		z-index: 2;
		display: none;
		box-shadow: 1px 0px 0px #e7e8e8, 0px 1px 0px #e7e8e8, -1px 0px 0px #e7e8e8;
	}
	.mod-sort-area-apps .more .more-des .text-overflow-block{
		border-top: 1px solid #f3f3f3;
		background-color: #f9fafa;
		padding: 10px;
	}
	.mod-sort-area-apps .more .more-des .ui-arrow.out,
	.mod-sort-area-apps .more .more-des .ui-arrow.in{
		border-width: 7px;
		top: -2px;
		left: 20px;
	}

	.mod-sort-area-apps .more .more-des .ui-arrow.out{
		border-bottom-color: #f3f3f3;
		top: -3px;
	}
	.mod-sort-area-apps .more .more-des .ui-arrow.in{
		border-bottom-color: #f9fafa;
	}
	.mod-sort-area-apps .more-content .ui-nav .nav-item-list{
		position: relative;
	}
	.mod-sort-area-apps .more-content .ui-nav .nav-item{
		float: left;
		width: 612px;
	}
	.mod-sort-area-apps .more-content .ui-nav .ctrl span{
		cursor: pointer;
		position: absolute;
		display: block;
		font-size: 60px;
		top: 40px;
		color: #d7d7d7;
		text-shadow: inset 0px 0px 1px #ccc;
	}
	.mod-sort-area-apps .more-content .ui-nav .ctrl span:hover{
		color: #65c7a4;
	}
	.mod-sort-area-apps .more-content .ui-nav .ctrl .prev span{
		left: 8px;
	}
	.mod-sort-area-apps .more-content .ui-nav .ctrl .next span{
		right: 8px;
	}
	.mod-sort-area-apps .more .text-overflow-block,
	.mod-sort-area-apps .more .text-overflow-block:before{
	    max-height: 56px; 
	    line-height: 16px; 
	}
	.mod-sort-area-apps .more .text-overflow-block:after{
		background: linear-gradient(to right,rgba(255,255,255,0),#f9fafa 50%,#f9fafa);
		background: -webkit-gradient(linear,left top,right top,from(rgba(255,255,255,0)),to(#f9fafa),color-stop(50%,#f9fafa));
	}
	.w960 .flow-on .mod-sort-area-apps .float-container .hot{
		width: 446px;
	}
	.w960 .flow-on .mod-sort-area-apps .hot .hot-list{
		width: 216px;
	}
	.w960 .flow-on .mod-sort-area-apps .hot .hot-list-title a{
		max-width: 135px;
	}
	.w960 .flow-on .mod-sort-area-apps .new{
		width: 166px;
	}
	.w960 .flow-on .mod-sort-area-apps .new .list-container .name{
		max-width: 110px;
	}
	.w960 .flow-on .mod-sort-area-apps .carousel-content ul{
		left: -338px;
	}
	.w960 .flow-on .mod-sort-area-apps .carousel-content .item-btn{
		width: 96px;
	}
	.w960 .flow-on .mod-sort-area-apps .more-content .ui-nav .nav-item{
		width: 562px;
	}
	.w960 .flow-on .mod-sort-area-apps .more .more-list{
		width: 185px;
	}
	.w960 .flow-on .mod-sort-area-apps .more .more-list-title a{
		width: 120px;
	}
</style>
<div id="sortAreaApps" class="mod-sort-area-apps" log-mod="sort-area-apps" style="visibility:hidden;">
	<div class="carousel">
		<h2 class="carousel-title">
		</h2>
		<div class="carousel-content">
			<span class="arrow left"></span>
			<span class="arrow right"></span>
			<span class="item-btn leftItem"></span>
			<span class="item-btn rightItem"></span>
		</div>
	</div>
	<div class="float-container cf">
		<div class="hot">
			<h2 class="hot-title">
			</h2>
			<ul class="cf">
			</ul>
		</div>
		<div class="new">
			<h2 class="title">
			</h2>
			<ul class="cf">
			</ul>
		</div>
	</div>
	<div class="more">
		<h2 class="title">
		</h2>
		<div class="more-content">
			<div class="list-container">
				<ul class="cf">
				</ul>
			</div>
		</div>
	</div>
</div>