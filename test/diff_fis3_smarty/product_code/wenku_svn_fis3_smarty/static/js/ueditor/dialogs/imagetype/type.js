(function(){

    var _dialogObj = editor.ui._dialogs.insertimagetypeDialog,
        imgAlt = null,
        TYPE_MAP = {
            0: 'plain',
            1: 'cover'
        };

    window.onload = function(){

        var types = document.forms['imag-type']['type'],
            altInput = document.forms['imag-type']['title'];

        if( !_dialogObj.__img ) {
            return;
        }

        imgAlt = document.getElementById("imgAlt");

        //清理错误信息
        altInput.onfocus = clearError;

        altInput.value = _dialogObj.__img.title || '';

        types[0].addEventListener("change", changeHandler);

        types[1].addEventListener("change", changeHandler);

        dialog.onok = function () {

            var type = null;

            for( var i=0, len=types.length; i<len; i++ ) {

                if( types[i].checked ) {
                    type = types[i].value;
                    break;
                }

            }

            _dialogObj.__img[0].alt = document.forms['imag-type']['title'].value;

            //如果插入的图片是封面， 则必须有alt属性
            if( type === '1' && !_dialogObj.__img[0].alt ) {
                altInput.blur();
                showError();
                return false;
            }

            editor.fireEvent('beforeInsertImage', _dialogObj.__img);
            editor.execCommand("insertImage", _dialogObj.__img, -type ? TYPE_MAP[type]:null);

            _dialogObj.__img = null;

        };

        dialog.oncancel = function(){
            _dialogObj.__img = null;
        };


    };

    function changeHandler( e ) {

        if( this.value === '1' ) {
            imgAlt.style.display = '';
        } else {
            imgAlt.style.display = 'none';
        }

    }

    function clearError() {
        document.getElementById("fieldError").innerHTML = '';
    }

    function showError() {
        document.getElementById("fieldError").innerHTML = '请输入标题文字';
    }


})();