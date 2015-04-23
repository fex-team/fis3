    /*
     * fis
     * http://fis.baidu.com/
     */

    'use strict';
    module.exports = function(content, file, conf) {
        return content + conf.PARAtest;
    };

    module.exports.defaultOptions = {
        PARAtest: '--compile--'
    };

