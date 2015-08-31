<table class="table table-striped table-hover">
    <caption class="caption">
        图书列表
    </caption>

    <col width="10%">
    <col width="50%">
    <col width="20%">
    <col width="20%">

    <thead>
        <tr>
            <th>id</th>
            <th>书名</th>
            <th>更新日期</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        <{foreach $booklist as $item}>
        <tr>
            <td><{$item.id}></td>
            <td><a href="/bookeditor/editor?book_id=<{$item.book_id}>"><{$item.title}></a></td>
            <td><{$item.create_time|date_format:"%Y-%m-%d"}></td>
            <td><a class="btn btn-issue" href="/bookeditor/interface/publish?book_id=<{$item.book_id}>">发布</a>
            <a class="btn btn-edit" href="/bookeditor/editor?book_id=<{$item.book_id}>">编辑</a>
        </tr>
        <{/foreach}>
    </tbody>
</table>


<!-- Modal template-->
<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">发布</h3>
  </div>
  <div class="modal-body">
    <p>确认发布吗?</p>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
    <button class="btn btn-primary">确认</button>
  </div>
</div>
<{script}>
    require.async('bookeditor:widget/list/list.js');
<{/script}>
