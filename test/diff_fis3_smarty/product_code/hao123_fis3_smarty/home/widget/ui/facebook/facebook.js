/**
 * FOR 性能优化
 *
 * 这个文件封装了两个功能组件：FBClient,snsShare
 * 不直接在页面调用这两个组件的原因是，FIS会将它们直接 编译内联到页面，这里经过封装则以库的方式依赖。
 * 下面这种写法，不能实现真正的按需加载，除非写成UI组件。FIS1.0只支持ui组件的按需加载，widget的资源跟widget走
 *
 */
var FBClient = require('home:widget/ui/facebook/fbclient.js');
var snsShare = require('home:widget/ui/facebook/sns-share.js');
module.exports= {
	FBClient: FBClient,
	snsShare: snsShare
};