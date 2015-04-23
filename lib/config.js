/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var DEFALUT_SETTINGS = {

  project: {
    charset: 'utf8',
    md5Length: 7,
    md5Connector: '_',
    files: ['**'],
    ignore: ['node_modules/**', 'output/**'],
    watch: {
      exclude: /^\/(?:output|node_modules).*$/i,
    }
  },

  component: {
    skipRoadmapCheck: true,
    protocal: 'github',
    author: 'fis-components'
  },

  modules: {
    plugin: 'module, components',
    packager: 'map',
    deploy: 'default'
  },

  opitions: {}
};

var groups = {};

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
  return a.weight - b.weight;
}

var Config = Object.derive({
  constructor: function() {
    this.init.apply(this, arguments);
  },
  init: function() {
    this.data = {};
    this._matches = [];
    this._media = 'GLOBAL';
    if (arguments.length > 0) {
      this.merge.apply(this, arguments);
    }
    return this;
  },
  toString: function () {
    return process.env.NODE_ENV;
  },
  get: function(path, def) {
    var ret = this._get(path);

    if (typeof ret === 'undefined' && this.parent) {
      ret = this.parent._get(path);
    }

    return typeof ret === 'undefined' ? def : ret;
  },
  _get: function(path) {
    var result = this.data || {};
    (path || '').split('.').forEach(function(key) {
      if (key && (typeof result !== 'undefined')) {
        result = result[key];
      }
    });
    return result;
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
            fis.log.error('forbidden to set property[' + key + '] of [' + type + '] data');
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
    group = group || process.env.NODE_ENV || 'dev';

    if (!groups[group]) {
      var forked = groups[group] = new Config();
      forked._media = group;
      forked.parent = module.exports;
    }

    return groups[group];
  },
  env: function() {
    return this.media.apply(this, arguments);
  },
  match: function(pattern, properties, weight) {
    var matches = this._matches;
    var negate = false;

    if (typeof pattern === 'string') {
      if (pattern[0] === '!') {
        negate = true;
        pattern = pattern.substring(1);
      }

      pattern = fis.util.glob(pattern);
    }

    var match = {
      reg: pattern,
      negate: negate,
      properties: properties,
      media: this._media,
      weight: weight === true ? 1 : (parseInt(weight, 10) || 0)
    };

    matches.push(match);
    if (this.parent) {
      this.parent._matches.push(match);
    }

    // need reset the config of the current media
    this.media()._sortedMatches = null;
    return this;
  },

  getMatches: function() {
    if (this.parent) {
      var that = this;
      return this.parent._matches.filter(function (match) {
        if ((match.media !== 'GLOBAL') && (match.media !== fis.project.currentMedia()))
        {
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
      this._sortedMatches = this.getMathes().sort(sortByWeight);
    }

    return this._sortedMatches;
  }
});

module.exports = (new Config).init(DEFALUT_SETTINGS);
module.exports.Config = Config;
module.exports.DEFALUT_SETTINGS = DEFALUT_SETTINGS;
