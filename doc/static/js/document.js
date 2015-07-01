(function(){
    function getToc(parent){
        var id;
        var toc = $(parent).find("h2").map(function(index, h2){
            h2 = $(h2);
            id = h2.text().replace(/[@|#|\.]/g,'');
            h2.attr('data-id', id);
            h2.before(["<i class='anchor' id='", id ,"'></i>"].join(''));
            var h3s = h2.nextUntil("h2", "h3").map(function(index, h3){
                h3 = $(h3);
                id = h3.text().replace(/[@|#|\.]/g,'');
                h3.attr('data-id', id);
                h3.before(["<i class='anchor' id='", id ,"'></i>"].join(''));
                return {
                    id: id,
                    name: h3.text()
                };
            });
            return {
                name: h2.text(),
                id: h2.attr('data-id'),
                child: h3s
            };
        });
        return toc;
    }

    function renderToc(toc, target){
        $(target).append(toMenu(toc, function(h2, li){
            if (h2.child.length !== 0){
                li.append(toMenu(h2.child));
            }
        })).append("<a href='#' class='back'>回到顶部</a>");

        function toMenu(list, each){
            var ul = $("<ul class='nav'></ul>");
            list.each(function(index, item){
                var li = $(["<li><a href='#", item.id, "'>", item.name, "</a></li>"].join(''));
                each && each(item, li);
                ul.append(li);
            });
            return ul;
        }
    }

    function fixAffixPosition(){
        var docRight = $(window).width()- ($(".doc-content").position().left+$(".doc-content").width()+255);
        $(".toc").css('right', docRight);
    }

    $(document).ready(function(){
        function setScrollSpy(){
            $(".doc-content h2, .doc-content h3").each(function(i){
                var me = $(this);
                var top = i === 0 ? 0: me.position().top - 60;
                var next = me.nextUntil(me[0].tagName).last().next();
                var end = next.length === 0 ? $(document).height() : me.nextUntil(me[0].tagName).last().next().position().top - 60;
                me.scrollspy({
                    min: top,
                    max: end,
                    onEnter: function(element, position) {
                        $(".toc a[href='#" + $(element).attr('data-id') + "']").parent('li').addClass('active');
                    },
                    onLeave: function(element, position) {
                        $(".toc a[href='#" + $(element).attr('data-id') + "']").parent('li').removeClass('active');
                    }
                });
            });
        }
        renderToc(getToc($(".doc-content")), $(".toc"));
        window.location.hash = window.location.hash;
        if (window.respond && !window.respond.mediaQueriesSupported) {
            setTimeout(setScrollSpy, 3000);
        }else{
            setTimeout(setScrollSpy, 300);
        }
        fixAffixPosition();
        $(window).resize(fixAffixPosition);
    });
})();

