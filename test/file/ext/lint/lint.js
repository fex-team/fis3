'use strict';

module.exports = function(content){
//    <[{require("../optmizer/js.js")}]
    return content + '--lint--';
};