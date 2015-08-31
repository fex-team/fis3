<aside class="sidebar">
	<h2 class="hd">目录</h2>
	<ul class="bd nav nav-list bs-docs-sidenav nav-stacked menu">
		
	</ul>
</aside>

<{script}>

require.async(['bookeditor:static/js/util.js'], function(util){
    var M = util.mediator,
        D = util.data;

    M.on('w:editor:menu', function(data){
        // $.getJSON('/bookeditor/interface/getcatalog?book_id=' + CONFING.book_id, function(data){
//             createMenu(data.catalog)
//         });

        var menu = D('menu');
        createMenu(menu);
    });
    
    
    var getByteLength = function (source) {
        return String(source).replace(/[^\x00-\xff]/g, "ci").length;
    };
    var subByte = function (source, length, tail) {
        source = String(source);
        tail = tail || '';
        if (length < 0 || getByteLength(source) <= length) {
            return source + tail;
        }
        
        //thanks 加宽提供优化方法
        source = source.substr(0,length).replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
            .substr(0,length)//截取长度
            .replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
            .replace(/([^\x00-\xff]) /g,"\x241");//还原
        return source + tail;

    };

    function createMenu(data){
        var result = [];
        $.each(data, function(i, item){
            if (item) {
                $.each(item.t, function(key, val){
                    if(key === 'h2' && val !== ''){
                        result.push('<li class="h2"><a href="#" data-menu="' + item.r + '_0"><i class="icon-chevron-right"></i>' + subByte(val, 36) + '</a></li>');
                    }

                    if(key === 'h3' && $.isArray(val)){
                        $.each(val, function(j, catalog){
                            if(catalog !== ''){
                                result.push('<li class="h3"><a href="#" data-menu="' + item.r + '_' + (j + 1) +'"><i class="icon-chevron-right"></i>' + subByte(catalog, 36) + '</a></li>');
                            }
                        });
                    }
                });
            }
        });
        
        $('.menu').html(result.join(''));
        setTimeout(function(){
        
            highlight();
        }, 10);
    }

    $.getJSON('/bookeditor/interface/getcatalog?book_id=' + CONFING.book_id, function(data){
        createMenu(data.catalog);
        D('menu', data.catalog);
    });

    $('.menu').delegate('li>a', 'click', function(e){
        var me = $(this),
            menu = me.attr('data-menu');

        if (menu) {
            M.fire('w:editor:menujump', {
                menu: menu
            });
        };
        return false;
    });

    function highlight(){
        var blockNum = D('blockNum');

        $('.menu li a').each(function(){
            var me = $(this),
                r = me.attr('data-menu');
            r = r.split('_');
            me.parent().removeClass('e-active')
            if(+r[0] === +blockNum){
                me.parent().addClass('e-active');
            }
        });
    }

    M.on('w:editor:jumpend', function(e){
        highlight();    
    });

});

<{/script}>
