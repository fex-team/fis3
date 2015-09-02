<div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner">
    <div class="container-fluid">
      <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="brand" href="#">图书神器</a>

      <div class="nav-collapse collapse">
        <p class="navbar-text pull-right">
          用户名:<{$userInfo.uname}>
          &nbsp;&nbsp;&nbsp;&nbsp;<a href="http://passport.baidu.com/?logout">退出</a>
        </p>
        <ul class="nav">
          <{if $book_info.title}>
          <li class="active"><a href="#">书名: <span><{$book_info.title}></span></a></li>
          <li class="editor-block-count"></li>
          <li class="editor-block"></li>
          <{else}>
          <li><a href="#">图书列表</a></li>

          <{/if}>
        </ul>
        <{if $book_info.title}>
        <div class="submit">
          <input class="text-go" type="text" placeholder="去第几块">
          <a class="btn btn-go" href="#">确定</a>
        &nbsp; &nbsp; &nbsp; &nbsp;
          <a class="btn btn-prev disabled" href="#">载入上一块</a>
          <a class="btn btn-next" href="#">载入下一块</a>
          <a class="btn btn-submit" href="#">保存</a>
           <a class="btn" href="/bookeditor/">返回</a>
          <a class="btn btn-exit" href="http://passport.baidu.com/?logout">退出</a>
         </div>
         <{/if}>
      </div>
    </div>
  </div>
</div>

<{if $book_info.title}>
<{script}>

require.async(['bookeditor:static/js/util.js'], function(util){
    var M = util.mediator,
        D = util.data;
    $('.editor-block-count').html('共有' + CONFING.block_num + '块');
    $('.btn-go').click(function(){
        var val = $('.text-go').val();
        console.log(val)
        if(val.match(/\d+/)){
            M.fire('w:editor:menujump', {
                menu: val + '_0'
            });
        }
        return false;
    });
});
<{/script}>
<{/if}>
