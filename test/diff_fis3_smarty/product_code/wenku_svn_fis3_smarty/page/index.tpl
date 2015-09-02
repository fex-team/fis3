<{html class="expanded"}>
<{head}>
    <meta charset="gbk"/>
    <meta content="" name="description">
    <title>book编辑器</title>
    <{require name="bookeditor:static/css/bootstrap.css"}>
    <{require name="bookeditor:static/css/bootstrap-responsive.css"}>
    <{require name="bookeditor:static/js/mod2222.js"}>
    <{require name="bookeditor:static/js/jquery.js"}>
    <{require name="bookeditor:static/js/jquery.color.js"}>
    <{require name="bookeditor:static/js/bootstrap.js"}>
    <{require name="bookeditor:static/js/util.js"}>
    <{require name="bookeditor:static/js/ueditor/ueditor.config.js"}>
    <{require name="bookeditor:static/js/ueditor/ueditor.all.js"}>
    <{require name="bookeditor:static/js/ueditor/lang/zh-cn/zh-cn.js"}>
    <script>
        window.CONFING = {
            book_id: '<{$book_info.book_id}>',
            block_num: parseInt('<{$block_num}>', 10)
        };
    </script>

<{/head}>
<{body}>
    
    <{widget name="bookeditor:widget/nav/nav.tpl"}>

    <div class="container-fluid body">
      <div class="row-fluid">
        <div class="span3">
            <{widget name="bookeditor:widget/sidebar/sidebar.tpl"}>
        </div>
        <div class="span9">
            <{widget name="bookeditor:widget/editor/editor.tpl"}>
        </div>
      </div>
    </div>
    <{require name="bookeditor:page/index.less"}>
<{/body}>
<{/html}>
