<%require name="lv2:widget/sa-spread/`$head.dir`/`$head.dir`.css"%>

<div class="mod-sa-spread">
    <div class="hd">
    	<a href="<%$body.saSpreadConf.imageBigUrl%>" class="image-big">
    		<img src="<%$body.saSpreadConf.imageBigSrc%>">
    	</a>
    	<a href="<%$body.saSpreadConf.imageMidUrl%>" class="image-mid">
    		<img src="<%$body.saSpreadConf.imageMidSrc%>">
    	</a>
    	<a href="<%$body.saSpreadConf.imageSmallUrl%>" class="image-small">
    		<img src="<%$body.saSpreadConf.imageSmallSrc%>">
    	</a>
    </div>
    <div class="bd">
    	<a href="<%$body.saSpreadConf.logoUrl%>" class="logo">
            <img src="<%$body.saSpreadConf.logoSrc%>">
        </a>
        <a href="<%$body.saSpreadConf.btnUrl%>" class="btn"><%$body.saSpreadConf.btnText%></a>
    </div>
</div>