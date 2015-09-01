var $ = require("common:widget/ui/jquery/jquery.js");

;;(function(){
    var feedbackText = $("#feedbackText"),
        textLength = $("#feedback-word-count-l"),
        feedbackLabel = $("#feedback-way-label"),
        errorTip =  $("#feedback-error-tip"),
        timer;
    var feedbackWay = $('#feedback-way');
    var feedbackTip = $('.feedback-way-tip');
    var feedbackCat = $('#feedback-cat');
    // 邮箱校验
    function checkEmail(str) {
        var re = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        var state = false;
        if (re.test(str)) {
            state = true;
        } else {
            state = false;
        }
        return state;
    }
    //初始化
    feedbackText.keydown( function(){
        var val = feedbackText.val(),
            l =  val.length;
        textLength.get(0).innerHTML = l;
        if (l > 0) {
            errorTip.hide();
        }
        if (l >= 1000) {
            this.value = val.substring(0, 1000);
        }
        timer = setTimeout(arguments.callee, 150);
    }).blur(function(){
        clearTimeout(timer);
    }).focus(function(){
        errorTip.hide();
    });
    feedbackCat.find('input').change(function () {
        $('.catTitle').css('color', '');
        $('.feedbackContainer').val(feedbackCat.find('input').index(this) + 1);
    })
    $('.feedback-emotion').find('input').change(function () {
        $('.emotionContainer').val($('.feedback-emotion').find('input[type="radio"]:checked').val());
    });
    $("#feedback-form").submit(function(e){    
      var key_hash = CryptoJS.MD5("hao123"),
          key = CryptoJS.enc.Utf8.parse(key_hash),
          iv  = CryptoJS.enc.Utf8.parse('1234567812345678'),
          submitForm = $(".encryption-form");
        var errorState = false;
        // 没有选择故障原因
        if (feedbackCat.css('visibility') !== 'hidden' && feedbackCat.find('input:checked').length === 0) {
            $('.catTitle').css('color', '#FF0000');
            window.location.href = '#feedback-cat';
            errorState = true;
        }
        if (!checkEmail(jQuery.trim(feedbackWay.val()))) {
            feedbackTip.show();
            errorState = true;
        } else {
            feedbackTip.hide();
        }
        if (!errorState) {
            var formData = $(this).serializeArray();
            var obj = {};
            var result = {};
            for (var i = 0; i < formData.length; i++) {
                var name = formData[i].name;
                var value = formData[i].value;
                // 产品线字段单独提出来
                if (name === 'product_line') {
                    result[name] = value;
                    continue;
                }
                // emotion是空值时候不传
                if (name === 'emotion' && value === '') {
                    continue;
                }
                obj[name] = value;
            }
        result["encode_data"] = obj;
  
        var encrypted = CryptoJS.AES.encrypt(JSON.stringify(result["encode_data"]), key, { iv: iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
        
        e.preventDefault();

        submitForm.find(".productline").attr("value",result.product_line);
        submitForm.find(".encodedata").attr("value",encrypted.toString().replace(/[\n\s]/g,""));
        submitForm.submit();
        } else {
            e.preventDefault();
        }
    });
    $('#feedback-way').focus(function () {
        feedbackLabel.hide();
    })
    .blur(function () {
        if (jQuery.trim(this.value) === '') {
            feedbackLabel.show();
        }
    });
    feedbackText.focus(function () {
        errorTip.hide();
    })
    .blur(function () {
        if (jQuery.trim(this.value) === '') {
            errorTip.show();
        }
    });
})();
