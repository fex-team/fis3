<{html class="expanded"}>
<{head}>
    <meta charset="gbk"/>
    <meta content="" name="description">
    <title>图书列表</title>
    <{require name="bookeditor:static/css/bootstrap.css"}>
    <{require name="bookeditor:static/css/bootstrap-responsive.css"}>
    <{require name="bookeditor:static/js/mod.js"}>
    <{require name="bookeditor:static/js/jquery.js"}>
    <{require name="bookeditor:static/js/bootstrap.js"}>
    <{require name="bookeditor:static/js/util.js"}>
<{/head}>
<{body}>
    
    <{widget name="bookeditor:widget/nav/nav.tpl"}>
    <div class="table-data">
        
        <{widget name="bookeditor:widget/list/list.tpl"}>
        <div class="ui-pager pager-center">
            <div class="pager">
                <div class="pager-inner">
                <{$page|page|escape:"none"}>
                </div>
            </div>
        </div>
        <{*
        <div class="pagination">
          <ul>
            <li><a href="#">Prev</a></li>
            <li><a href="#">1</a></li>
            <li><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>
            <li><a href="#">5</a></li>
            <li><a href="#">Next</a></li>
          </ul>
        </div>
        *}>
    </div>

    
    <{require name="bookeditor:page/list.less"}>
    
        <{/body}>
<{/html}>
