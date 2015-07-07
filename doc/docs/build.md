## 工作原理

FIS3 是基于文件对象进行构建的，每个进入 FIS3 的文件都会实例化成一个 File 对象，整个构建过程都对这个对象进行操作完成构建任务。以下通过伪码来阐述 FIS3 的构建流程。

### 构建流程

```js
fis.release = function (opt) {
  var src = fis.util.find(fis.project.root);
  var files = {};
  src.forEach(function (f) {
    var file = new File(f);
    files[file.subpath] = fis.compile(file);
  });
  var packager = fis.matchRules('::package');
  var keys = Object.keys(packager);
  var ret = {
    files: files,
    map: {}
  };
  if (packager.indexOf('prepackager') > -1) {
    pipe('prepackager', ret);
  }
  
  if (packager.indexOf('packager') > -1) {
    pipe('packager', ret);
  }

  files.forEach(function (f) {
    // 打包阶段产出的 map 表替换到文件
    if (f._isResourceMap) {
      f._content = f._content.replace(/\b__RESOURCE_MAP__\b/g, JSON.stringify(ret.map));
    }
  });

  if (packager.indexOf('spriter') > -1) {
    pipe('spriter', ret);
  }
  if (packager.indexOf('postpackager') > -1) {
    pipe('postpackager', ret);
  } 
}
```

如上述代码，整个 FIS3 的构建流程大题概括分为三个阶段。

0. 扫项目目录拿到文件并初始化出一个文件对象的列表
1. 对文件对象中每一个文件进行[单文件编译](#单文件编译流程)
2. 获取用户设置的 `package` 插件，进行打包处理（包括合并图片）

其中打包处理开了四个扩展点，通过用户配置启用某些插件。

- **prepackager** 打包前处理插件扩展点
- **packager**  打包插件扩展点，通过此插件收集文件依赖信息、合并信息产出静态资源映射表
- **spriter** 图片合并扩展点，如 csssprites
- **postpackager** 打包后处理插件扩展点

### 单文件编译流程

```js
fis.compile = function (file) {
  if (file.isFile()) {
    if (exports.useLint && file.lint) {
      pipe('lint', file);
    }
    if (!file.hasCache) {
      process(file);
    } else {
      file.revertCache();
    }
  } else {
    process(file);
  }
};

function process(file) {
  if (file.parser) {
    pipe('parser', file);
  }
  if (file.preprocessor) {
    pipe('preprocessor', file);
  }
  if (file.standard) {
    standard(file); // 标准化处理
  }
  if (file.postprocessor) {
    pipe('postprocessor', file);
  }
  if (file.optimizer) {
    pipe('optimizer', file);
  }
}
```

其中插件扩展点包括

- lint 代码校验检查，比较特殊，所以需要 `release` 命令命令行添加 `-l` 参数
- parser 预处理阶段，比如 less、sass、es6、react、前端模板等都在此处预编译处理
- preprocessor 标准化前处理插件
- standard 标准化插件，处理[内置语法](./user-dev/inline.md)
- postprocessor 标准化后处理插件

单文件阶段通过读取文件属性，来执行对应扩展点插件。

### File 对象

```js
function File(filepath) {
  var props = path.info(filepath);
  merge(props, fis.matchRules(filepath)); // merge 分配到的属性
  assign(this, props); // merge 属性到对象
}
```
