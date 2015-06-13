/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

/**
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

  options: {}
};

var rVariable = /\$\{([^\}]+)\}/g;
var _ = require('./util.js');

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
 * Config构造方法
 * @constructor constructor
 *         @see init
 * @method init     Config初始化函数，初始化成员变量
 *         @param {Object}  将n(n >= 0)个对象参数与成员变量data合并
 * @method get      向上查找模块path，若没有返回def
 *         @param {String} path 模块路径
 *         @param {String} def 默认值
 *         @see _get
 * @method _get     遍历data中是否存在模块
 *         @param {String} path 模块路径
 *         @example
 *           get('obj')
 *           get('obj.a.b.c')
 * @method set      设置对应模块索引和值
 *         @param {String} path 模块索引
 *         @param {String/Object} value 对应模块的值
 *         @example
 *           set('obj', {a: b: {c: 12}}) === set('obj.a.b.c', 12)
 * @method del      清除对应path的模块的值
 *         @param {String} path 模块路径
 * @method merge    合并对象
 * @method require  加载对应路径的node模块
 * @method media    获得groups上挂载的模块树(分支)，或创建新的分支
 *         @param {String} group 分支名称，若不存创建新的分支，病返回；若缺省则返回当前使用分支
 *         @return {Object} group分支
 * @method env      @see media
 * @method match    处理匹配文件名时的正则，支持glob语法和分组功能
 *         @param {String} pattern glob语法的字符串
 *         @param {Object} properties 配置属性
 *         @param {Number} weight 优先级权重，缺省为0
 *         @return {Object} 返回Config对象自己，方便链式使用
 * @method getMatches  返回由global分支和当前使用分支下的全部match对象
 * @method getSortedMatches 返回weight由大到小的match序列
 */
var Config = Object.derive({
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
  env: function() {
    return this.media.apply(this, arguments);
  },
  _addMatch: function(match) {
    match.index = this._matches.length;
    this._matches.push(match);
    this._sortedMatches = null;

    this._forks.forEach(function(forked) {
      forked._sortedMatches = null;
    });
  },
  match: function(pattern, properties, weight) {
    if (!pattern) {
      fis.log.error('Invalid selector, must be a `RegExp` or `glob`');
    }

    if (!fis.util.is(properties, 'Object')) {
      fis.log.error('Invalid Properties, must be an `Object`');
    }

    var match = {
      pattern: pattern,
      properties: properties || {},
      weight: weight === true ? 1 : (parseInt(weight, 10) || 0),
      media: this._media
    };
    this._addMatch(match);
    this.parent && this.parent._addMatch(match);

    return this;
  },

  getMatches: function() {
    if (this.parent) {
      var that = this;
      return this.parent._matches.filter(function (match) {
        if ((match.media !== 'GLOBAL') && (match.media !== that._media)) {
          return false;
        }
        return true;
      });
    } else {
      return this._matches;
    }
  },

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

    return this._sortedMatches;
  },

  hook: function(name, settings) {
    var key = 'modules.hook';
    var origin = this.get(key);

    if (origin) {
      origin = typeof origin === 'string' ? origin.split(/\s*,\s*/) : (Array.isArray(origin) ? origin : [origin]);
    }

    origin.push(fis.plugin(name, settings));

    return this.set(key, origin);
  },

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

module.exports = (new Config).init(DEFAULT_SETTINGS);
module.exports.Config = Config;
module.exports.DEFALUT_SETTINGS = DEFAULT_SETTINGS;
