### fis3/lib/fis.js
> `require`，若`fis-`与`fis3-`后插件名称重名则无法调用`fis-`组件

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
> `nohup`函数中的回调未能表达执行的成功与否

> `isEmpty`对于`Date`对象、正则对象、`""`,`Number`,`undefined`这几种类型未做处理，均返回true

> `pipe`
```JavaScript
processors.forEach(function(obj, index) {
      var processor = obj.name || obj;// 这里用户传入函数有函数名会产生bug
      var key;
      ...
});
```

> `download`如果`callback`中使用`return`结束执行导致`callback`返回不为`undefined`会导致tmp文件删除失败

### fis3/lib/project.js
> `getSource`
```JavaScript
// 这里传入的rPath和root一样，会导致include和exclude无法正常工作
fis.util.find(root, include, project_exclude, root).forEach(function(file) {
    // 产生对应的 File对象
    file = fis.file(file);
    if (file.release) {
      source[file.subpath] = file;
    }
  });
```

### fis3/lib/file.js
> `defineLikes`
```JavaScript	
set: (function(prop) {
  return function(val) {

    if (val === false) {
      this._likes[v] = false; // v应该为prop
      return;
    }

    var that = this;
    likes.forEach(function(v) {
      if (prop === v) {
        that._likes[v] = true
      } else {
        that._likes[v] = false;
      }
    });
  }
})(v)

// 这类写法是否也可以使fis判断js.less在编译后为js.js的同名文件
// 实际实现不是
fis.match('**.less', {
  rExt: 'css'
});
```

