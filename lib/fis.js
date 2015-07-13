'use strict';

var last = Date.now();

/*
 * Object.derive，产生一个Class的工厂方法
 * @param  {Function} constructor 构造函数
 * @param  {Object} proto     对象共有变量
 * @return {Function}      构造方法
 * @example
 *   var class1 = Object.derive(function(){ console.log(this.name) }, {name: 'class1'});
 *   var class2 = Object.derive({
 *     constructor: function() {
 *       console.log(this.name)
 *     }
 *   }, {name: 'class2'})
 */
Function.prototype.derive = function(constructor, proto) {
  if (typeof constructor === 'object') {
    proto = constructor;
    constructor = proto.constructor || function() {};
    delete proto.constructor;
  }
  var parent = this;
  var fn = function() {
    parent.apply(this, arguments);
    constructor.apply(this, arguments);
  };
  var tmp = function() {};
  tmp.prototype = parent.prototype;
  var fp = new tmp(),
    cp = constructor.prototype,
    key;
  for (key in cp) {
    if (cp.hasOwnProperty(key)) {
      fp[key] = cp[key];
    }
  }
  proto = proto || {};
  for (key in proto) {
    if (proto.hasOwnProperty(key)) {
      fp[key] = proto[key];
    }
  }
  fp.constructor = constructor.prototype.constructor;
  fn.prototype = fp;
  return fn;
};

//factory
Function.prototype.factory = function() {
  var clazz = this;

  function F(args) {
    clazz.apply(this, args);
  }
  F.prototype = clazz.prototype;
  return function() {
    return new F(arguments);
  };
};

/**
 * fis 名字空间，fis 中所有工具和方法都是通过此变量暴露给外部使用。
 * @namespace fis
 */
var fis = module.exports = {};

// register global variable
Object.defineProperty(global, 'fis', {
  enumerable: true,
  writable: false,
  value: fis
});

/**
 * 事件监听器, fis 中所有的事件都通过它来监听和触发。
 * @name emitter
 * @type {EventEmitter}
 * @namespace fis.emitter
 * @see {@link https://nodejs.org/api/events.html#events_class_events_eventemitter}
 */
fis.emitter = new(require('events').EventEmitter);
['on', 'once', 'removeListener', 'removeAllListeners', 'emit'].forEach(function(key) {
  fis[key] = function() {
    var emitter = fis.emitter;
    return emitter[key].apply(emitter, arguments);
  };
});

/**
 * 用来监听 fis 中的事件。每次添加都不会有额外的检测工作，也就是说重复添加有可能被调用多次。
 *
 * 注意：以下示例中 type 为 `project:lookup`, 但是它没有多余的意思，就是一段字符串，跟 namespace 没有一点关系。
 *
 * 代理 fis.emitter.on.
 *
 * @example
 * fis.on('project:lookup', function(uri, file) {
 *   // looking for uri from file.
 *   console.log('Looking for %s from $s', uri, file.subpath);
 * });
 * @see {@link https://nodejs.org/api/events.html}
 * @param {Sring} type 事件类型
 * @param {Function} handler 响应函数
 * @function on
 * @memberOf fis
 */

/**
 * 跟 fis.on 差不多，但是只会触发一次。
 *
 * 代理 fis.emitter.once.
 *
 * @example
 * fis.once('compile:start', function(file) {
 *   console.log('The file %s is gona compile.', file.subpath);
 * });
 * @see fis.on
 * @see {@link https://nodejs.org/api/events.html}
 * @param {Sring} type 事件类型
 * @param {Function} handler 响应函数
 * @function once
 * @memberOf fis
 */

/**
 * 取消监听某事件。注意，如果同一个事件类型和同一响应函数被监听了多次，此函数一次只会移除一次。
 *
 * 代理 fis.emitter.removeListener.
 *
 * @example
 * fis.on('project:lookup', function onLookup(uri, file) {
 *   // looking for uri from file.
 *   console.log('Looking for %s from $s', uri, file.subpath);
 * });
 *
 * fis.removeListener('project:lookup', onLookup);
 * @see {@link https://nodejs.org/api/events.html}
 * @function removeListener
 * @param {String} type 事件类型
 * @param {Function} handler 响应函数
 * @memberOf fis
 */

/**
 * 取消监听所有事件监听，如果指定了事件类型，那么只会取消掉指定的事件类型的所有监听。
 *
 * 代理 fis.emitter.removeAllListeners.
 *
 * @see {@link https://nodejs.org/api/events.html}
 * @function removeAllListeners
 * @param {String} [type] 事件类型
 * @memberOf fis
 */

/**
 * 发送事件，将所有监听此事件名的响应函数挨个执行一次，并把消息体参数 args.. 带过去。
 *
 * 代理 fis.emitter.emit.
 *
 * @example
 * fis.emit('donthing', {
 *   foo: 1
 * });
 * @see {@link https://nodejs.org/api/events.html}
 * @param {Sring} type 事件类型
 * @param {Mixed} args... 消息体数据，任意多个，所有参数都可以在 `handler` 中获取到。
 * @function emit
 * @return {Boolean} 如果有事件响应了，则返回 `true` 否则返回 `false`.
 * @memberOf fis
 */


/**
 * 输出时间消耗，单位为 ms.
 * @example
 * fis.time('Comiple cost');
 * // => compile cost 56ms
 * @param  {String} title 描述内容
 * @return {Undefined}
 * @function time
 * @memberOf fis
 */
fis.time = function(title) {
  console.log(title + ' : ' + (Date.now() - last) + 'ms');
  last = Date.now();
};


fis.log = require('./log.js');

// utils
var _ = fis.util = require('./util.js');

// config
fis.config = require('./config.js');

// resource location
fis.uri = require('./uri.js');

// project
fis.project = require('./project.js');

// file
fis.file = require('./file.js');

// cache
fis.cache = require('./cache.js');

// compile kernel
fis.compile = require('./compile.js');

// release api
fis.release = require('./release.js');

['get', 'set', 'env', 'media', 'match', 'hook', 'unhook'].forEach(function(key) {
  fis[key] = function() {
    var config = fis.config;
    return config[key].apply(config, arguments);
  };
});


/**
 * 仅限于 fis-conf.js 中使用，用来包装 fis 插件配置。
 *
 * 需要在对应的插件扩展点中配置才有效，否则直接执行 fis.plugin 没有任何意义。
 *
 * 单文件扩展点：
 * - lint
 * - parser
 * - preprocess
 * - standard
 * - postprocess
 * - optimizer
 *
 * 打包阶段扩展点：
 * - prepacakger
 * - sprite
 * - packager
 * - postpackager
 *
 * @example
 * fis.match('*.scss', {
 *   parser: fis.plugin('sass', {
 *     include_paths: [
 *       './static/scss/libaray'
 *     ]
 *   })
 * });
 *
 * fis.match('::packager', {
 *   postpackager: fis.plugin('loader', {
 *     allInOne: true
 *   });
 * })
 * @memberOf fis
 * @param {String} pluginName 插件名字。
 *
 * 说明：pluginName 不是对应的 npm 包名，而是对应 npm 包名去掉 fis 前缀，去掉插件扩展点前缀。
 *
 * 如：fis-parser-sass 包，在这里面配置就是:
 *
 * ```js
 * fis.match('*.scss', {
 *   parser: fis.plugin('sass')
 * });
 * ```
 * @param {Object} options 插件配置项，具体请参看插件说明。
 * @param {String} [position] 可选：'prepend' | 'append'。默认为空，当给某类文件配置插件时，都是覆盖式的。而通过设置此插件可以做到，往前追加和往后追加。
 *
 * 如：
 *
 * ```js
 * fis.match('*.xxx', {
 *   parser: fis.plugin('a')
 * });
 *
 * // 保留 plugin a 同时，之后再执行 plugin b
 * fis.matach('*.xxx', {
 *   parser: fis.plugin('b', null, 'append')
 * });
 * ```
 */
fis.plugin = function(key, options, position) {
  if (arguments.length === 2 && !_.isPlainObject(options)) {
    position = options;
    options = null;
  }

  options = options || {};
  options.__name = options.__plugin = key;
  options.__pos = position;
  return options;
};

/**
 * fis 的 npm 包信息。
 * @memberOf fis
 */
fis.info = fis.util.readJSON(__dirname + '/../package.json');

/**
 * fis 版本号
 * @memberOf fis
 */
fis.version = fis.info.version;

/**
 * 用来加载 fis 插件。通过它来加载插件，会优先从本地安装的 node_modules 目录里面找，然后才是 global
 * 全局安装的 node_modules 里面找。
 *
 * @function require
 * @param {String} paths... 去掉 fis 前缀的包名字，可以以多个参数传进来，多个参数会自动通过 `-` 符号连接起来。
 * @memberOf fis
 * @example
 * // 查找顺序
 * // local: fis3-parser-sass
 * // global: fis3-parser-sass
 * // local: fis-parser-sass
 * // global: fis-parser-sass
 * fis.require('parser-sass');
 * @property {Array} prefixes 用来配置 fis.require 前缀的查找规则的。默认：['fis3', 'fis']。
 * @property {Object} _cache 用来缓存模块加载，避免重复查找。
 */
fis.require = function() {
  var name = Array.prototype.slice.call(arguments, 0).join('-');
  if (fis.require._cache.hasOwnProperty(name)) return fis.require._cache[name];

  var names = [];
  for (var i = 0, len = fis.require.prefixes.length; i < len; i++) {
    var pluginName = fis.require.prefixes[i] + '-' + name;
    try {
      names.push(pluginName);
      try {
        return fis.require._cache[name] = _require(pluginName);
      } catch (e) {
        if(e.code !== 'MODULE_NOT_FOUND' || !~e.message.indexOf(pluginName)) {
          throw e;
        }
      }
    } catch (e) {
      fis.log.error('load plugin [%s] config error : %s.', pluginName, e.message);
    }
  }

  fis.log.error('unable to load plugin [%s]', names.join('] or ['));
};

var resolve = require('resolve');
function _require(modulename) {
  var local = fis.get('system.localNPMFolder');
  var global = fis.get('system.globalNPMFolder');
  var paths = [local];

  if (local !== global) {
    paths.push(global);
  }
  var resolved;
  paths.every(function(dir) {
    try {
      resolved = resolve.sync(modulename, { basedir: dir });
    } catch (e) {}
    if (resolved) {
      return false;
    }
    return true;
  });

  return resolved ? require(resolved) : require(modulename);
}

// fis require缓存
fis.require._cache = {};
fis.require.prefixes = ['fis3', 'fis'];

fis.cli = require('./cli.js');
