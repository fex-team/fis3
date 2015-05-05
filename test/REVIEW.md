### fis3/lib/log.js
> `str += '.' + ('00' + d.getMilliseconds()).substr(-4)`应该改为`str += '.' + ('00' + d.getMilliseconds()).substr(-3);`
```JavaScript
exports.now = function(withoutMilliseconds) {
  var d = new Date(),
    str;
  str = [
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ].join(':').replace(/\b\d\b/g, '0$&');
  if (!withoutMilliseconds) {
    str += '.' + ('00' + d.getMilliseconds()).substr(-4);
  }
  return str;
};
```

### fis3/lib/config.js
> `Config._get`函数`var result = this.data || {};`
```JavaScript
_get: function(path) {
	var result = this.data || {};
	(path || '').split('.').forEach(function(key) {
	  if (key && (typeof result !== 'undefined')) {
	    result = result[key];
	  }
	});
	return result;
}
```

### fis3/lib/util.js
> `util.nohup`函数中的回调未能表达执行的成功与否

> `util.isEmpty`对于`Date`对象、正则对象、`""`,`Number`,`undefined`这几种类型未做处理，均返回true