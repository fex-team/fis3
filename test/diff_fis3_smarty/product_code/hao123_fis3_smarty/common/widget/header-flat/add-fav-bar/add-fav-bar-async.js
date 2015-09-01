var $ = require('common:widget/ui/jquery/jquery.js');
var UT = require('common:widget/ui/ut/ut.js');
var message = require('common:widget/ui/message/src/message.js');

module.exports = function() {
    if (!conf.addFavBar) return;

    var _conf = conf.addFavBar,
        container = $('#addFavBar'),

        init = function() {

            //当PM将showbarTime从非0改为0时，重置cookie。需要排除为空的情况
            if (parseInt(_conf.showbarTime) === 0) {
                $.cookie('Gh_b', 0);
            }

            //cookie中存的都是字符串，!('0') == false,所以需要转换为数字
            !parseInt($.cookie('Gh_b')) && setBar();
        },

        setBar = function() {
            if (_conf.hideBar) return;
            bindEvent();
        },


        // Bind event
        bindEvent = function() {
            container
                .on('click', '.fav-btn', function() {
                    hideBar();
                })
                .on('click', '.fav-close', function(e) {
                    var $kbd = $('#kbd');
                    e.preventDefault();
                    hideBar();
                    $kbd.length && $kbd.animate({
                        top: '130px'
                    }, 400);
                })
                .on('click', 'a', function() {
                    UT.send({
                        position: conf.pageType,
                        sort: $(this).attr('data-val'),
                        type: 'click',
                        modId: 'sethp-bar'
                    });
                });
        },

        // Hide the bar and set cookie
        hideBar = function() {
            container.slideUp(400);
            $.cookie('Gh_b', 1, {
                expires: parseInt(_conf.showbarTime || 1, 10)
            });

            message.send('module.sidebar.changesize');
        };

    setTimeout(function() {
        init();
    }, 1e3);
};