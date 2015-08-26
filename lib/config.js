'use strict';

/*
 * Config默认设置
 * @type {Object}
 */
var DEFAULT_SETTINGS = {

  project: {
    charset: 'utf8',
    md5Length: 7,
    md5Connector: '_',
    files: ['**'],
    ignore: ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']
  },

  component: {
    skipRoadmapCheck: true,
    protocol: 'github',
    author: 'fis-components'
  },

  modules: {
    hook: 'components',
    packager: 'map'
  },

  options: {},

  system : {
    repos : 'http://fis.baidu.com/repos'
  }
};

var rVariable = /\$\{([^\}]+)\}/g;
var _ = require('./util.js');
var matchIndex = 0;

//You can't use merge in util.js
function merge(source, target) {
  if (typeof source === 'object' && typeof target === 'object') {
    for (var key in target) {
      if (target.hasOwnProperty(key)) {
        source[key] = merge(source[key], target[key]);
      }
    }
  } else {
    source = target;
  }
  return source;
}

function sortByWeight(a, b) {
  if (a.weight === b.weight) {
    return a.index - b.index;
  }

  return a.weight - b.weight;
}

/**
 * 配置类。
 * @class
 * @memberOf fis.config
 * @param {Object} [initialOpitions] 初始配置。
 * @example
 * var Config = fis.confilg.Config;
 * var config = new Config({
 *   a: 1
 * });
 * console.log(config.get('a')); // => 1
 *
 * config.set('b.c', 2);
 * console.log(config.get('b')); // => {c: 2}
 */
var Config = Object.derive(/** @lends fis.config.Config.prototype */{
  constructor: function() {
    this.init.apply(this, arguments);
  },

  init: function() {
    this.data = {};
    this._matches = [];
    this._forks = [];
    this._groups = {};
    this._sortedMatches = null;
    this._media = 'GLOBAL';
    if (arguments.length > 0) {
      this.merge.apply(this, arguments);
    }
    return this;
  },

  /**
   * 通过路径获取配置值。
   */
  get: function(path, def) {
    var ret = this._get(path);

    if (typeof ret === 'undefined' && this.parent) {
      ret = this.parent._get(path);
    }

    return typeof ret === 'undefined' ? def : this._filter(ret);
  },
  _get: function(path) {
    var result = this.data;
    (path || '').split('.').forEach(function(key) {
      if (key && (typeof result !== 'undefined')) {
        result = result[key];
      }
    });
    return result;
  },

  _filter: function(string) {
    // 可能有 Maximum call stack size exceeded
    // 不过，这就应该报错。
    if ('string' === typeof string && rVariable.test(string)) {
      rVariable.lastIndex = 0;
      var self = this;

      return string.replace(rVariable, function(all, key) {
        var val = self.get(key);

        if(typeof val === 'undefined'){
            fis.log.error('undefined property [%s].', key);
        } else {
            return val || '';
        }
      });
    }

    return string;
  },

  /**
   * 通过路径设置配置项。
   *
   * 注意：当设置路径时，如果目标路径已经存在，则会被覆盖。如果是多级路径，同时上级目录存在且值不为对象，则会报错。
   *
   * 如：
   *
   * ```
   * fis.config.set('a', 'sting');
   *
   * // 如果这样设置会报错。
   * fis.config.set('a.subpath', 2);
   * ```
   *
   * @param {String} path  配置项路径。
   * @param {Mixed} value 值
   * @example
   * fis.config.set('xxxx', 1);
   */
  set: function(path, value) {
    if (typeof value === 'undefined') {
      this.data = path;
    } else {
      path = String(path || '').trim();
      if (path) {
        var paths = path.split('.'),
          last = paths.pop(),
          data = this.data || {};
        paths.forEach(function(key) {
          var type = typeof data[key];
          if (type === 'object') {
            data = data[key];
          } else if (type === 'undefined') {
            data = data[key] = {};
          } else {
            fis.log.error('forbidden to set property[%s] of [%s] data', key, type);
          }
        });
        data[last] = value;
      }
    }
    return this;
  },

  /**
   * 删除指定路径的配置。
   * @param {String} path  配置项路径。
   */
  del: function(path) {
    path = String(path || '').trim();
    if (path) {
      var paths = path.split('.'),
        data = this.data,
        last = paths.pop(),
        key;
      for (var i = 0, len = paths.length; i < len; i++) {
        key = paths[i];
        if (typeof data[key] === 'object') {
          data = data[key];
        } else {
          return this;
        }
      }
      if (typeof data[last] !== 'undefined') {
        delete data[last];
      }
    }
    return this;
  },

  /**
   * 将目标配置项合并到当前配置中，类似于 jQuery.extend.
   * @param {Object} target 其他配置对象
   */
  merge: function() {
    var self = this;
    [].slice.call(arguments).forEach(function(arg) {
      if (typeof arg === 'object') {
        merge(self.data, arg);
      } else {
        fis.log.warning('unable to merge data[' + arg + '].');
      }
    });
    return this;
  },

  require: function(name) {
    fis.require('config', name);
    return this;
  },

  /**
   * 分组配置项。
   * @param  {String} group 组名
   * @return {Config} 返回一个新的 Config 对象，用来分割配置项。
   */
  media: function(group) {
    group = group || fis.project.currentMedia() || 'dev';
    var groups = this.parent ? this.parent._groups : this._groups;

    if (!groups[group]) {
      var forked = groups[group] = new Config();
      forked._media = group;
      forked.parent = module.exports;
      this._forks.push(forked);
    }

    return groups[group];
  },

  /*
   * 等价于 media 方法
   */
  env: function() {
    return this.media.apply(this, arguments);
  },

  /**
   * 添加文件属性。
   * @param {Glob | RegExp} pattern 匹配文件路径规则。
   * @param {Object} properties 属性对象。
   * @param {Boolean | int} [weight] 规则的权重，数字越大优先级越高。
   * @example
   * fis.config.match('*.js', {
   *   release: 'static/$0'
   * });
   */
  match: function(pattern, properties, weight) {
    if (!pattern) {
      fis.log.error('Invalid selector, must be a `RegExp` or `glob`');
    } else if (pattern === '::packager') {
      // 兼容处理，原来我们叫 ::packager
      // 现在改名叫 ::package 了，为了老用法。
      pattern = '::package';
    }

    if (!fis.util.is(properties, 'Object')) {
      fis.log.error('Invalid Properties, must be an `Object`');
    }

    var match = {
      pattern: pattern,
      properties: properties || {},
      weight: weight === true ? 1 : (parseInt(weight, 10) || 0),
      media: this._media,
      index: matchIndex++
    };

    this._matches.push(match);
    this._sortedMatches = null;

    this._forks.forEach(function(forked) {
      forked._sortedMatches = null;
    });

    return this;
  },

  /**
   * 获取所有 matches 表。
   */
  getMatches: function() {
    if (this.parent) {
      return this.parent._matches.concat(this._matches);
    } else {
      return this._matches;
    }
  },

  /**
   * 获取根据 weight 排序后的 matches 表。
   */
  getSortedMatches: function() {
    if (!this._sortedMatches) {
      var self = this;
      this._sortedMatches = this.getMatches().map(function(match) {
        var negate = false;
        var pattern = self._filter(match.pattern);
        var raw = pattern;
        var properties = match.properties;

        if (typeof pattern === 'string') {
          if (pattern[0] === '!') {
            negate = true;
            pattern = pattern.substring(1);
          }

          pattern = fis.util.glob(pattern);
        }

        Object.keys(properties).forEach(function(key) {
          var val = properties[key];

          if (typeof val === 'string') {
            properties[key] = self._filter(val);
          }
        });

        return {
          reg: pattern,
          raw: raw,
          negate: negate,
          properties: properties,
          media: match.media,
          weight: match.weight,
          index: match.index
        };
      }).sort(sortByWeight);
    }

    return fis.util.clone(this._sortedMatches);
  },

  /**
   * 挂载 {@link https://github.com/search?q=fis3-hook&ref=opensearch hook} 插件
   * @param  {string} name     插件名称
   * @param  {Object} settings 插件配置项
   * @example
   * fis.config.hook('module');
   */
  hook: function(name, settings) {
    var key = 'modules.hook';
    var origin = this.get(key);

    if (origin) {
      origin = typeof origin === 'string' ? origin.split(/\s*,\s*/) : (Array.isArray(origin) ? origin : [origin]);
    }

    origin.push(fis.plugin(name, settings));

    return this.set(key, origin);
  },

  /**
   * 取消 hook 插件
   */
  unhook: function(name) {
    var key = 'modules.hook';
    var origin = this.get(key);

    if (origin) {
      origin = typeof origin === 'string' ? origin.split(/\s*,\s*/) : (Array.isArray(origin) ? origin : [origin]);
    }

    _.remove(origin, function(item) {
      return name === (item.__name || item);
    });

    return this.set(key, origin);
  }
});

/**
 * config 配置对象，该对象为 {@link fis.config.Config} 实例，详情请查看 {@link fis.config.Config Config 类}说明。
 * @namespace fis.config
 */
var exports = module.exports = (new Config).init(DEFAULT_SETTINGS);
exports.Config = Config;
exports.DEFALUT_SETTINGS = DEFAULT_SETTINGS;

// exports.media('dev').match('*', {
//   useHash: false
// });
