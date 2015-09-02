var util = require('bookeditor:static/js/util.js');

var issue;

$('.btn-issue, .btn-del').click(function(){
    var self = $(this),
        modal = $('#myModal');

    if(self.hasClass('btn-issue')){
        issue = self.attr('href');
        modal.find('#myModalLabel').html('发布');
        modal.find('.modal-body p').html('确认发布吗?');
    } else {
        modal.find('#myModalLabel').html('删除');
        modal.find('.modal-body p').html('确认删除吗?');
    }
    modal.modal("show");
    return false;
});

$('.btn-primary').click(function(e){
    $.get(issue, function(){
        location.reload(true);
    });
    return false;
});
