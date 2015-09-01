/**
 * 整合基础库，包括jquery 、jQuery常用插件放在一起被外部引用
 * User: ne
 * Date: 13-5-20
 * Time: 下午12:09
 */

//jQuery会导出window.jQuery,window.$作为全变量
// 但是，在这里最后，会回收$这个变量，避免大家继续滥用全局的jQuery
// 为了保证jQuery的插件方便载入，还是留着window.jQuery这个句柄，【禁止业务组件的逻辑中使用】

// support IE
require('common:widget/ui/jquery/1.8.3/jquery.min.js');

// require('common:widget/ui/jquery/2.0.3/jquery.min.js');


//因为jQuery的插件，直接跟window.jQuery句柄进行交互，按顺序载入即可保证插件生效，所以这里不再导出变量;
// Warning: 如果jQuery插件编译不够规范，如用了$作为传入变量，则会出错，需要改为jQuery! 可能还存在其他潜在的不兼容性，暂不确定，如遇到，需修改
require('common:widget/ui/jquery/jquery.cookie.js');  //load plugin
require('common:widget/ui/jquery/jquery.json.js');  //load plugin
require('common:widget/ui/jquery/jquery.mousewheel.js');  //load plugin
require('common:widget/ui/jquery/jquery.ui.core.js');  //load plugin
require('common:widget/ui/jquery/jquery.ui.widget.js');  //load plugin

require('common:widget/ui/cookieless/cookieless.js'); // cookie to localStorage, no support session cookie

//FIS module
var $ = jQuery.noConflict();	//这里执行后，window.$ 被回收了，只留下window.jQuery
module.exports = $;