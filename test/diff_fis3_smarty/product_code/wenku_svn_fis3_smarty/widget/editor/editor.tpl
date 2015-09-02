<div class="box editor-container">
    <textarea id="editor"></textarea>
</div>
<!-- Modal template-->
<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">保存</h3>
  </div>
  <div class="modal-body">
    <p>确认保存吗?</p>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
    <button class="btn btn-primary">确认</button>
  </div>
</div>
<!-- Modal template-->
<div id="alert" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
    <h3 id="myModalLabel">成功</h3>
  </div>
  <div class="modal-body">
    <p>保存成功</p>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
  </div>
</div>

<{script}>
require.async(['bookeditor:static/js/util.js','bookeditor:widget/editor/editor.js'], function(util, ue){
    var M = util.mediator,
        D = util.data;
        
    if(CONFING.block_num === 1){
        $('.btn_next').addClass('disabled');
    }
    
    D('blockNum', 1);
    
    function loadBlock (num, callback){
        num = num || 1;
        
        $.getJSON('/bookeditor/interface/getblock?book_id=' + CONFING.book_id + '&block_id=' + num, function(data){
            if(data.errstr){
                alert(data.errstr);
                return false;
            }
            ue.setWkContent(data.data);
            $.isFunction(callback) && callback(ue, data);
            $('.editor-block').html('当前在第' + num + '块');
        });
    }

    function creataCatalog(catalog, num){
        var result = [];
        $.each(catalog, function(i, item){
            result.push({
                t: item,
                r: num + '_' + i
            });
        });
        return result;
    }
    
    function saveMenu(catalog, blockNum){
        var menu = D('menu'),
            l;
        if (!$.isArray(menu)) {
            menu = [];
        }
        l = menu.length;
        
        while (l--) {
            if (menu[l].r.split("_")[0] == blockNum) {
                menu.splice(l, 1);
            }
        }
        console.log(menu)
        menu = menu.concat(catalog);
        
        menu.sort(function(a, b){
            var as = a.r.split('_'),
                bs = b.r.split('_');
            if (as[0] === bs[0]) {
                return +as[1] - bs[1];
            }
            return +as[0] - bs[0];
        });
        D('menu', menu);
    }

    var saveBlockData, saveBlockCallback;

    function saveBlock (data, callback){
        
        var modal = $('#myModal');

        saveBlockData = data || {};
        saveBlockCallback = callback || function(){};


        if (window.ue.getContentLength() > 5000) {
            alert('超出最大字数限制');
            return false;
        }
        modal.modal('show');
        return false;
    }

    $('.btn-primary').click(function(e){
        var data = saveBlockData,
            callback = saveBlockCallback;

        data.book_id = CONFING.book_id;
        var block_id = data.block_id = D('blockNum');
        data.bdjson = JSON.stringify(data.bdjson);
        
        var catalog = creataCatalog(data.catalog, block_id);

        data.catalog = JSON.stringify(catalog);
        
        saveMenu(catalog, block_id);

        $.post('/bookeditor/interface/savecacheblock', data, function(xhr){
            $('#myModal').modal('hide');
            callback();
            M.fire('w:editor:menu', {
                ue: ue
            });
            //$('#alert').modal('show');
        });
        
        return false;
    });
    

    M.on('w:editor:ready', function(ue){
        loadBlock(1);
    });
    
    $('.btn-next, .btn-prev').click(function(e){
        var me = $(this);
        
        if(me.hasClass('disabled')){
            return false;
        }
        
        
        var bdjson = ue.getWkJsonContent(),
            catalog = ue.getSectionList();

        saveBlock({
            bdjson: bdjson,
            catalog: catalog
        }, function() {
            var blockNum = D('blockNum'),
                current = me.hasClass('btn-next') ? +blockNum + 1 : +blockNum - 1;
        
            if(1 === current || CONFING.block_num === current){
                me.addClass('disabled');
            } else {
                $('.btn-prev, .btn-next').removeClass('disabled');
            }
        
            D('blockNum', current);
            loadBlock(current);
        });
        return false;
        
    });
    
    $('.btn-submit').click(function(){
        var bdjson = ue.getWkJsonContent(),
            catalog = ue.getSectionList();

        saveBlock({
            bdjson: bdjson,
            catalog: catalog
        });
        return false;
    });

    function fade(num, section){
        var sections = ue.getSections(),
            sectionEl, oldBackground;
            
        if(!sections[num]) {
            M.fire('w:editor:jumpend');
            return false;
        }
        if(+section === 0){
            sectionEl = $(sections[num]['h2']);
        }else{
            sectionEl = $(sections[num]['h3'][section - 1]);
        }
        
        sectionEl.css('background', '#ff0');
        sectionEl.animate({
            'backgroundColor': '#fff'
        }, 1000); 
        
        M.fire('w:editor:jumpend');
    }


    M.on("w:editor:menujump", function(data){
        var menu = data.menu.split('_'),
            block = menu[0],
            position = menu[1],
            section = menu[2];
        
        if (block == D('blockNum')) {
            ue.toSection(position);
            fade(position, section);
            return false;
        }
        
        var bdjson = ue.getWkJsonContent(),
            catalog = ue.getSectionList();

        saveBlock({
            bdjson: bdjson,
            catalog: catalog
        },function() {
            loadBlock(block, function(ue, data) {
                ue.toSection(position, section);
                D('blockNum', block);
                setTimeout(function(){
                    fade(position, section);
                }, 500)
                if (+block > 1) {
                    $('.btn-prev').removeClass('disabled');
                }else {
                    $('.btn-prev').addClass('disabled');
                }
                if(+block < CONFING.block_num){
                    $('.btn-next').removeClass('disabled');
                }else{
                    $('.btn-next').addClass('disabled');
                }
            });
        });        

    });

});

<{/script}>

