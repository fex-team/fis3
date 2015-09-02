<style>
	.sidebar-vote-tips .flip-space{
	    line-height: 90px;
	    font-size: 80px;
	    float: left;
	    /*text-shadow: 0 2px 5px rgba(0, 0, 0, .5);*/
	}
	.sidebar-vote-tips .filp-wrap{
		margin-left: 10px;
	}

	.sidebar-vote-tips .flip {
	    position: relative;
	    float: left;
	    margin: 12px 3px 0 0;
	    width: 26px;
	    height: 35px;
	    font-size: 38px;
	    font-weight: bold;
	    line-height: 32px;
	    border-radius: 3px;
	}

	.sidebar-vote-tips .flip li {
	    z-index: 1;
	    position: absolute;
	    left: 0;
	    top: 0;
	    width: 100%;
	    height: 100%;
	    font-family: Arial;
	}

	/*.flip li:first-child {
	    z-index: 2;
	}*/

	.sidebar-vote-tips .flip li a {
	    display: block;
	    height: 100%;
	    perspective: 200px;
	    cursor: default;
	}

	.sidebar-vote-tips .flip li a div {
	    z-index: 1;
	    position: absolute;
	    left: 0;
	    width: 100%;
	    height: 50%;
	    overflow: hidden;
	}

	.sidebar-vote-tips .flip li a div .shadow {
	    position: absolute;
	    width: 100%;
	    height: 100%;
	    z-index: 2;
	}

	.sidebar-vote-tips .flip li a div.up {
	    transform-origin: 50% 100%;
	    -webkit-transform-origin: 50% 100%;
	    -moz-transform-origin: 50% 100%;
	    -ms-transform-origin: 50% 100%;
	    top: 0;
	}

	.sidebar-vote-tips .flip li a div.up:after {
	    content: "";
	    position:absolute;
	    top:44px;
	    left:0;
	    z-index: 5;
	    width: 100%;
	    height: 3px;
	    background-color: rgba(0,0,0,.4);
	}

	.sidebar-vote-tips .flip li a div.down {
	    transform-origin: 50% 0%;
	    -webkit-transform-origin: 50% 0%;
	    -moz-transform-origin: 50% 0%;
	    -ms-transform-origin: 50% 0%;
	    bottom: 0;
	    box-shadow: 0 -1px 0 rgba(96,101,109,0.6);
	}

	.sidebar-vote-tips .flip li a div div.inn {
	    position: absolute;
	    left: 0;
	    z-index: 1;
	    width: 100%;
	    height: 200%;
	    color: #fff;
	    text-align: center;
	    background-color: #ff0404;
	    border-radius: 3px;
	    line-height: 100%;
	}

	.sidebar-vote-tips .flip li a div.up div.inn {
	    top: 0;

	}

	.sidebar-vote-tips .flip li a div.down div.inn {
	    bottom: 0;
	}

	/* PLAY */

	.sidebar-vote-tips .play ul li.before {
	    z-index: 3;
	}

	.sidebar-vote-tips .play ul li.active {
	    animation: sidebarVoteTrans .5s .5s linear both;
	    -webkit-animation: sidebarVoteTrans .5s .5s linear both;
	    -moz-animation: sidebarVoteTrans .5s .5s linear both;
	    -ms-animation: sidebarVoteTrans .5s .5s linear both;
	    -ms-animation: sidebarVoteTrans .5s .5s linear both;
	    z-index: 2;
	}

	@keyframes sidebarVoteTrans {
	    0% {
	        z-index: 2;
	    }
	    5% {
	        z-index: 4;
	    }
	    100% {
	        z-index: 4;
	    }
	}

	@-webkit-keyframes sidebarVoteTrans {
	    0% {
	        z-index: 2;
	    }
	    5% {
	        z-index: 4;
	    }
	    100% {
	        z-index: 4;
	    }
	}
	@-moz-keyframes sidebarVoteTrans {
	    0% {
	        z-index: 2;
	    }
	    5% {
	        z-index: 4;
	    }
	    100% {
	        z-index: 4;
	    }
	}



	.sidebar-vote-tips .play ul li.active .down {
	    z-index: 2;
	    animation: sidebarVoteTurn .5s .5s linear both;
	    -webkit-animation: sidebarVoteTurn .5s .5s linear both;
	    -moz-animation: sidebarVoteTurn .5s .5s linear both;
	    -ms-animation: sidebarVoteTurn .5s .5s linear both;
	    -ms-animation: sidebarVoteTurn .5s .5s linear both;
	}

	@keyframes sidebarVoteTurn {
	    0% {
	        transform: rotateX(90deg);
	        -webkit-transform: rotateX(90deg);
	        -moz-transform: rotateX(90deg);
	        -ms-transform: rotateX(90deg);
	    }
	    100% {
	        transform: rotateX(0deg);
	        -webkit-transform: rotateX(0deg);
	        -moz-transform: rotateX(0deg);
	        -ms-transform: rotateX(0deg);
	    }
	}
	@-webkit-keyframes sidebarVoteTurn {
	    0% {
	        transform: rotateX(90deg);
	        -webkit-transform: rotateX(90deg);
	        -moz-transform: rotateX(90deg);
	        -ms-transform: rotateX(90deg);
	    }
	    100% {
	        transform: rotateX(0deg);
	        -webkit-transform: rotateX(0deg);
	        -moz-transform: rotateX(0deg);
	        -ms-transform: rotateX(0deg);
	    }
	}
	@-moz-keyframes sidebarVoteTurn {
	    0% {
	        transform: rotateX(90deg);
	        -webkit-transform: rotateX(90deg);
	        -moz-transform: rotateX(90deg);
	        -ms-transform: rotateX(90deg);
	    }
	    100% {
	        transform: rotateX(0deg);
	        -webkit-transform: rotateX(0deg);
	        -moz-transform: rotateX(0deg);
	        -ms-transform: rotateX(0deg);
	    }
	}

	.sidebar-vote-tips .play ul li.before .up {
	    z-index: 2;
	    animation: sidebarVoteTurn2 .5s linear both;
	    -webkit-animation: sidebarVoteTurn2 .5s linear both;
	    -moz-animation: sidebarVoteTurn2 .5s linear both;
	    -ms-animation: sidebarVoteTurn2 .5s linear both;
	    -ms-animation: sidebarVoteTurn2 .5s linear both;
	    box-shadow: 0 1px 0 rgba(96,101,109,0.6);
	}

	@keyframes sidebarVoteTurn2 {
	    0% {
	        transform: rotateX(0deg);
	        -webkit-transform: rotateX(0deg);
	        -moz-transform: rotateX(0deg);
	        -ms-transform: rotateX(0deg);
	    }
	    100% {
	        transform: rotateX(-90deg);
	        -webkit-transform: rotateX(-90deg);
	        -moz-transform: rotateX(-90deg);
	        -ms-transform: rotateX(-90deg);
	    }
	}
	@-webkit-keyframes sidebarVoteTurn2 {
	    0% {
	        transform: rotateX(0deg);
	        -webkit-transform: rotateX(0deg);
	        -moz-transform: rotateX(0deg);
	        -ms-transform: rotateX(0deg);
	    }
	    100% {
	        transform: rotateX(-90deg);
	        -webkit-transform: rotateX(-90deg);
	        -moz-transform: rotateX(-90deg);
	        -ms-transform: rotateX(-90deg);
	    }
	}
	@-moz-keyframes sidebarVoteTurn2 {
	    0% {
	        transform: rotateX(0deg);
	        -webkit-transform: rotateX(0deg);
	        -moz-transform: rotateX(0deg);
	        -ms-transform: rotateX(0deg);
	    }
	    100% {
	        transform: rotateX(-90deg);
	        -webkit-transform: rotateX(-90deg);
	        -moz-transform: rotateX(-90deg);
	        -ms-transform: rotateX(-90deg);
	    }
	}

	/* SHADOW */

	.sidebar-vote-tips .play ul li.before .up .shadow {
	    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, .1)), color-stop(100%, rgba(0, 0, 0, 1)));
	    background: linear-gradient(top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    background: -o-linear-gradient(top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    background: -ms-linear-gradient(top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    background: linear-gradient(to bottom, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    animation: show .5s linear both;
	    -webkit-animation: show .5s linear both;
	    -moz-animation: show .5s linear both;
	    -ms-animation: show .5s linear both;
	    -ms-animation: show .5s linear both;
	}

	.sidebar-vote-tips .play ul li.active .up .shadow {
	    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, .1)), color-stop(100%, rgba(0, 0, 0, 1)));
	    background: linear-gradient(top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    background: -o-linear-gradient(top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    background: -ms-linear-gradient(top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    background: linear-gradient(to bottom, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
	    animation: hide .5s .3s linear both;
	    -webkit-animation: hide .5s .3s linear both;
	    -moz-animation: hide .5s .3s linear both;
	    -ms-animation: hide .5s .3s linear both;
	    -ms-animation: hide .5s .3s linear both;
	}

	/*DOWN*/

	.sidebar-vote-tips .play ul li.before .down .shadow {
	    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, 1)), color-stop(100%, rgba(0, 0, 0, .1)));
	    background: linear-gradient(top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    background: -o-linear-gradient(top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    background: -ms-linear-gradient(top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    animation: show .5s linear both;
	    -webkit-animation: show .5s linear both;
	    -moz-animation: show .5s linear both;
	    -ms-animation: show .5s linear both;
	    -ms-animation: show .5s linear both;
	}

	.sidebar-vote-tips .play ul li.active .down .shadow {
	    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(0, 0, 0, 1)), color-stop(100%, rgba(0, 0, 0, .1)));
	    background: linear-gradient(top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    background: -o-linear-gradient(top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    background: -ms-linear-gradient(top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
	    animation: hide .5s .3s linear both;
	    -webkit-animation: hide .5s .3s linear both;
	    -moz-animation: hide .5s .3s linear both;
	    -ms-animation: hide .5s .3s linear both;
	    -ms-animation: hide .5s .3s linear both;
	}

	@keyframes show {
	    0% {
	        opacity: 0;
	    }
	    100% {
	        opacity: 1;
	    }
	}
	@-webkit-keyframes show {
	    0% {
	        opacity: 0;
	    }
	    100% {
	        opacity: 1;
	    }
	}
	@-moz-keyframes show {
	    0% {
	        opacity: 0;
	    }
	    100% {
	        opacity: 1;
	    }
	}

	@keyframes hide {
	    0% {
	        opacity: 1;
	    }
	    100% {
	        opacity: 0;
	    }
	}
	@-webkit-keyframes hide {
	    0% {
	        opacity: 1;
	    }
	    100% {
	        opacity: 0;
	    }
	}
	@-moz-keyframes hide {
	    0% {
	        opacity: 1;
	    }
	    100% {
	        opacity: 0;
	    }
	}
	.sidebar-vote-tips .content{
		margin-left: 75px;
		color: #fff;
	}
	.sidebar-vote-tips .name-container span{
		display: inline-block;
		height: 20px;
		line-height: 20px;
		margin-top: 8px;
		vertical-align: middle;
	}
	.sidebar-vote-tips .name-container .name{
		font-size: 14px;
		width: 38px;
		overflow: hidden;
		font-weight: 800;
	}
	.sidebar-vote-tips .name-container .name2{
		font-size: 12px;
		margin-top: 10px;
		width:120px;
		overflow:hidden;
	}
	.sidebar-vote-tips .des{
		font-weight: 800;
	}
</style>
<div id="sidebarVoteTips" class="sidebar-vote-tips" data-date="2014,4,12">
    <div class="content">
    	<p class="name-container">
    		<span class="name">HARI</span>
        	<span class="name2">MENUJU PEMILU</span>
    	</p>
    	<p class="des">Berita Terbaru Pemilu 2014</p>
    </div>
</div>