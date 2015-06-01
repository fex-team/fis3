/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var last = Date.now();

/**
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

var fis = module.exports = {};

//register global variable
Object.defineProperty(global, 'fis', {
  enumerable: true,
  writable: false,
  value: fis
});

fis.emitter = new(require('events').EventEmitter);
['on', 'once', 'removeListener', 'removeAllListeners', 'emit'].forEach(function(key) {
  fis[key] = function() {
    var emitter = fis.emitter;
    return emitter[key].apply(emitter, arguments);
  };
});

//time for debug
fis.time = function(title) {
  console.log(title + ' : ' + (Date.now() - last) + 'ms');
  last = Date.now();
};

//log
fis.log = require('./log.js');

//utils
var _ = fis.util = require('./util.js');

//system config
fis.config = require('./config.js');

//resource location
fis.uri = require('./uri.js');

//project
fis.project = require('./project.js');

//file
fis.file = require('./file.js');

//cache
fis.cache = require('./cache.js');

//compile kernel
fis.compile = require('./compile.js');

//release api
fis.release = require('./release.js');

['get', 'set', 'env', 'media', 'match', 'hook', 'unhook'].forEach(function(key) {
  fis[key] = function() {
    var config = fis.config;
    return config[key].apply(config, arguments);
  };
});

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

//package info
fis.info = fis.util.readJSON(__dirname + '/../package.json');

//kernel version
fis.version = fis.info.version;

//require
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
  var local = fis.get('localNPMFolder');
  var global = fis.get('globalNPMFolder');
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

// fis require的前缀限制
fis.require.prefixes = ['fis3', 'fis'];

fis.cli = require('./cli.js');
