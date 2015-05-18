/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var _ = require('./util.js');
var path = require('path');

/**
 * 编译文件后缀处理
 * @deprecated 直接在文件属性中设置就好，不要通过 project.ext 来配置了。
 * @param  {String} ext 后缀
 * @return {String}     release时使用的后缀
 */
function getReleaseExt(ext) {
  if (ext) {
    var rExt = fis.env().get('project.ext' + ext);
    if (rExt) {
      ext = normalizeExt(rExt);
    }
  }
  return ext;
}

/**
 * 后缀规范函数，保证后缀串第一个字符必为.
 * @param  {String} ext 后缀串
 * @return {String}     若第一个没有.则加上，若有.则去掉
 */
function normalizeExt(ext) {
  if (ext[0] !== '.') {
    ext = '.' + ext;
  }
  return ext;
}

/**
 * 路径规范函数，路径中出现:*?"<>|均被替换为_，支持去掉自定义字符的正则处理
 * @param  {String} path 路径
 * @param  {RegExp} reg  正则
 * @param  {String} rExt 后缀
 * @return {String}
 */
function normalizePath(path, reg, rExt) {
  return path
    .replace(reg, '')
    .replace(/[:*?"<>|]/g, '_') + rExt;
}

/**
 * 给文件添加md5标识符
 * @param {String} path 文件路径
 * @param {Object} file fis File对象
 * @return {String} 带有md5 hash标识的路径
 */
function addHash(path, file) {
  var rExt = file.rExt,
    qRExt = fis.util.escapeReg(rExt),
    qExt = fis.util.escapeReg(file.ext),
    hash = file.getHash(),
    onnector = fis.env().get('project.md5Connector', '_'),
    reg = new RegExp(qRExt + '$|' + qExt + '$', 'i');
  return path.replace(reg, '') + onnector + hash + rExt;
}

/**
 * 获取路径对应下的全部domain
 * @param  {String} path 路径
 * @return {Array}      符合的全部domain值
 */
function getDomainsByPath(path) {
  var domain = fis.env().get('project.domain', {}),
    value = [];
  if (typeof domain === 'string') {
    value = domain.split(/\s*,\s*/);
  } else if (fis.util.is(domain, 'Array')) {
    value = domain;
  } else {
    fis.util.map(domain, function(pattern, domain) {
      if ((pattern === 'image' && fis.util.isImageFile(path)) || fis.util.glob(pattern, path)) {
        if (typeof domain === 'string') {
          value = domain.split(/\s*,\s*/);
        } else if (fis.util.is(domain, 'Array')) {
          value = domain;
        } else {
          fis.log.warning('invalid domain [' + domain + '] of [project.domain.' + pattern + ']');
        }
        return true;
      }
    });
  }
  return value;
}


function getDomain(path) {
  var hash = fis.util.md5(path),
    domains = getDomainsByPath(path),
    len = domains.length,
    domain = '';
  if (len) {
    domain = domains[hash.charCodeAt(0) % len];
  }
  return domain;
}

/**
 * 处理File中
 * @param  {Object} obj     绑定的对象
 * @param  {String} path    路径
 * @param  {Array} matches  matche
 */
function applyMatches(obj, path, matches) {
  matches.forEach(function(item) {
    var properties = item.properties || {};
    var keys = Object.keys(properties);

    if (!keys.length) {
      return;
    }

    var m = item.reg.exec(path);
    var match = !!m;

    if (match !== item.negate) {
      m = m || {
        0: path
      };

      keys.forEach(function(key) {
        var value = properties[key];
        // 将property中$1 $2...替换为本来的值
        if (typeof value === 'string') {
          value = value.replace(/\$(\d+|&)/g, function(_, k) {
            k = k === '&' ? 0 : k;
            return m[k] || '';
          });
        }

        if (typeof value === 'object' && typeof obj[key] === 'object') {
          fis.util.assign(obj[key], value, true);
        } else {
          obj[key] = value;
        }
      });
    }
  });
}

/**
 * File类声明
 */
var File = Object.derive(function() {
  // 构造函数
  var _ = fis.util;
  var self = _.assign(this, _.pathinfo(arguments));
  var ext = self.ext;
  var realpath = this.realpath = _.realpathSafe(self.fullname);
  var realpathNoExt = this.realpathNoExt = self.rest;
  var root = fis.project.getProjectPath();
  var properties = {};

  if (realpath.indexOf(root) === 0) {
    var len = root.length;
    var subpath;
    this.subpath = subpath = realpath.substring(len);
    this.subdirname = self.dirname.substring(len);
    this.subpathNoExt = realpathNoExt.substring(len);
    applyMatches(properties, subpath, fis.env().getSortedMatches());
  }

  var rExt = this.rExt = normalizeExt(properties.rExt || getReleaseExt(ext));
  this.useCompile = true;
  this.useDomain = false;
  this.useCache = true;
  this.useHash = false;
  this.useMap = false;
  this.domain = '';

  this.requires = [];
  this.links = [];
  this.asyncs = [];
  this.derived = [];
  this.extras = {};

  this._isImage = true;
  this._isText = false;
  this._likes = {};
  this.defineLikes();

  if (_.isTextFile(rExt)) {
    this._isImage = false;
    this._isText = true;
    this.charset = null;

    switch (rExt) {
      case '.js':
      case '.jsx':
      case '.coffee':
        this.isJsLike = true;
        this.useDomain = true;
        this.useHash = true;
        this.useMap = true;
        break;
      case '.css':
      case '.less':
      case '.sass':
      case '.styl':
      case '.scss':
        this.isCssLike = true;
        this.useDomain = true;
        this.useHash = true;
        this.useMap = true;
        break;
      case '.html':
      case '.xhtml':
      case '.shtml':
      case '.htm':
      case '.tpl': //smarty template
      case '.ftl': //freemarker template
      case '.vm': //velocity template
      case '.php':
      case '.phtml':
      case '.jsp':
      case '.asp':
      case '.aspx':
      case '.ascx':
      case '.cshtml':
      case '.master':
        this.isHtmlLike = true;
        break;
      case '.json':
        this.isJsonLike = true;
        break;
    }
  } else if (_.isImageFile(rExt)) {
    this.useDomain = true;
    this.useHash = rExt !== '.ico';
  } else {
    this.useCompile = false;
  }

  // 将应用上的属性，复制到文件对象。
  delete properties.rExt;
  _.assign(this, properties);

  if (subpath) {
    if (this.release === false) {
      this.useMap = false;
      var self = this;
      Object.defineProperty(this, 'url', {
        enumerable: true,
        get: function() {
          fis.log.error('unreleasable file [' + self.realpath + ']');
        }
      });
    } else {
      this.useMap = this.isMod ? true : this.useMap;
      //release & url
      var reg = new RegExp(_.escapeReg(ext) + '$|' + _.escapeReg(rExt) + '$', 'i');
      var release;
      if (this.release) {
        release = this.release.replace(/[\/\\]+/g, '/');
        if (release[0] !== '/') {
          release = '/' + release;
        }
      } else {

        // 在没有设置的情况下，内嵌的资源就不 release 了。
        release = this.isInline ? false : this.subpath;
      }
      this.release = release ? normalizePath(release, reg, rExt) : release;
      this.url = this.url ? normalizePath(this.url, reg, rExt) : this.release;
    }

    // charset
    if (this._isText) {
      this.charset = (
        this.charset || fis.env().get('project.charset', 'utf8')
      ).toLowerCase();
    }

    //file id
    var id = this.id || subpath.replace(/^\//, '');
    var ns = fis.env().get('namespace');
    if (ns) {
      id = ns + fis.env().get('namespaceConnector', ':') + id;
    }

    this.id = id;
    this.moduleId = this.moduleId || this.id.replace(new RegExp(_.escapeReg(ext) + '$', 'i'), '');
  }
}, {
  /**
   * 定义默认的文件类型
   *
   * 提取到一个方法里面原因是：当 file 对象从 cache 里面反序列回来后，isLike 系列的属性都会丢失。
   * 所以这块需要重新调用（定义）一次。
   */
  defineLikes: function() {
    if (typeof this.isHtmlLike !== 'undefined') {
      return;
    }

    var likes = ['isHtmlLike', 'isJsLike', 'isCssLike'];
    var props = {};

    likes.forEach(function(v) {
      props[v] = {
        set: function(val) {

          if (val === false) {
            this._likes[v] = false;
            return;
          }

          var that = this;
          likes.forEach(function(v2) {
            if (v === v2) {
              that._likes[v2] = true
            } else {
              that._likes[v2] = false;
            }
          });
        },

        get: function() {
          return this._likes[v];
        }
      };
    });

    Object.defineProperties(this, props);
  },
  /**
   * 返回文件是否真实存在
   * @return {Boolean}
   */
  exists: function() {
    return fis.util.exists(this.realpath);
  },
  /**
   * 返回文件是否为文档
   * @return {Boolean}
   */
  isText: function() {
    return this._isText;
  },
  /**
   * 返回文件是否为图像
   * @return {Boolean}
   */
  isImage: function() {
    return this._isImage;
  },
  /**
   * 返回真实路径
   * @return {String} 路径
   */
  toString: function() {
    return this.realpath;
  },
  /**
   * 返回文件最近修改时间
   * @return {Date} 最近修改时间
   */
  getMtime: function() {
    return fis.util.mtime(this.realpath) || new Date();
  },
  /**
   * 返回文件是否为文件
   * @return {Boolean}
   */
  isFile: function() {
    return fis.util.isFile(this.realpath);
  },
  /**
   * 返回文件是否为文件夹
   * @return {Boolean}
   */
  isDir: function() {
    return fis.util.isDir(this.realpath);
  },
  /**
   * 设置文件内容
   * @param {String} c 文件内容
   * @return {Object} 返回自身，方便链式调用
   */
  setContent: function(c) {
    this._content = c;
    return this;
  },
  /**
   * 返回文件内容
   * @return {String} 文件内容
   */
  getContent: function() {
    if (typeof this._content === 'undefined') {
      this._content = fis.util.read(this.realpath, this.isText());
    }
    return this._content;
  },
  /**
   * 返回文件内容的md5序列
   * @return {String} 文件内容md5序列后的结果
   */
  getHash: function() {
    if (typeof this._md5 === 'undefined') {
      Object.defineProperty(this, '_md5', {
        value: fis.util.md5(this.getContent()),
        writable: false
      });
    }
    return this._md5;
  },
  /**
   * 返回文件内容的base64编码
   * @param {Boolean} prefix  是否需要base64格式头，缺省为是
   * @return {String}
   */
  getBase64: function(prefix) {
    prefix = typeof prefix === 'undefined' ? true : prefix;
    if (prefix) {
      prefix = 'data:' + fis.util.getMimeType(this.rExt) + ';base64,';
    } else {
      prefix = '';
    }
    return prefix + fis.util.base64(this._content);
  },
  /**
   * 返回文件id
   * @return {String}
   */
  getId: function() {
    return this.id;
  },
  /**
   * 返回文件url
   * @return {String}
   */
  getUrl: function() {
    var url = this.url;
    if (this.useHash) {
      url = addHash(url, this);
    }
    if (this.useDomain) {
      if (!this.domain) {
        this.domain = getDomain(this.subpath);
      }
      url = this.domain + url;
    }

    return url + this.query;
  },
  /**
   * 若使用hash表示，则返回release时路径的hash值
   * @param  {String} release 路径
   * @return {String}
   */
  getHashRelease: function(release) {
    release = release || this.release;
    if (release) {
      if (this.useHash) {
        return addHash(release, this);
      } else {
        return release;
      }
    } else {
      fis.log.error('unreleasable file [' + this.realpath + ']');
    }
  },
  /**
   * 添加新的同步依赖
   * @param {String} id 依赖的文件标识(id)
   */
  addRequire: function(id) {
    if (id && (id = id.trim())) {
      if (!~this.requires.indexOf(id)) {
        this.requires.push(id);
      }

      // 如果在异步依赖中，则需要把它删了。
      var idx;
      if (~(idx = this.asyncs.indexOf(id))) {
        this.asyncs.splice(idx, 1);
      }

      return id;
    }
    return false;
  },
  /**
   * 添加异步依赖
   * @param {String} id 依赖的文件标识(id)
   */
  addAsyncRequire: function(id) {
    if (id && (id = id.trim())) {

      // 已经在同步依赖中，则忽略
      if (~this.requires.indexOf(id)) {
        return id;
      }

      if (!~this.asyncs.indexOf(id)) {
        this.asyncs.push(id);
      }

      // 兼容老的用法。
      this.extras.async = this.asyncs.concat();
      return id;
    }
    return false;
  },
  /**
   * 向File.links中追加不重复link连接
   * @param {String} filepath 连接
   */
  addLink: function(filepath) {
    var links = this.links;

    ~links.indexOf(filepath) || links.push(filepath);
  },
  /**
   * 处理重名但不同后缀名的require
   * @param {String} ext 后缀
   */
  addSameNameRequire: function(ext) {
    var path, map;
    if (fis.util.isFile(this.realpathNoExt + ext)) {
      path = './' + this.filename + ext;
    } else if ((map = fis.env().get('project.ext'))) {
      for (var key in map) {
        if (map.hasOwnProperty(key)) {
          var oExt = normalizeExt(key);
          var rExt = normalizeExt(map[key]);
          if (rExt === ext && fis.util.isFile(this.realpathNoExt + oExt)) {
            path = './' + this.filename + oExt;
            break;
          }
        }
      }
    } else {
      // 没有设置 project.ext 且 this.realpathNoExt + ext 也没有找到。
      // 只能把当前目录下面的其他文件列出来了。
      //
      // 推荐像 fis2 中一样设置 project.ext 来提高性能。
      var pattern = this.subpathNoExt + '.*';
      var files = fis.project.getSourceByPatterns(pattern);
      Object.keys(files).every(function(subpath) {
        var file = files[subpath];

        if (file.rExt === ext) {
          path = subpath;
          return false;
        }

        return true;
      });
    }
    if (path) {
      var info = fis.uri.getId(path, this.dirname);
      if (info.file && info.file.useMap && !~this.asyncs.indexOf(info.id)) {
        this.addLink(info.file.subpath);
        this.addRequire(info.id);
      }
    }
  },
  /**
   * 删除同步require路径
   * @param  {String} id 文件id
   */
  removeRequire: function(id) {
    var pos = this.requires.indexOf(id);
    if (pos > -1) {
      this.requires.splice(pos, 1);
    }
  },
  /**
   * 删除异步require路径
   * @param  {String} id 文件id
   */
  removeAsyncRequire: function(id) {
    var pos = this.asyncs.indexOf(id);
    if (pos > -1) {
      this.asyncs.splice(pos, 1);

      // 兼容老的用法。
      this.extras.async = this.asyncs.concat();
    }
  },
  /**
   * 获取缓存数据
   * @return {Object}
   */
  getCacheData: function() {
    var obj = {};
    var self = this;

    Object
      .keys(this)

      // 过滤掉私有属性。
      .filter(function(key) {
        return key[0] !== '_';
      })
      .forEach(function(key) {
        obj[key] = self[key];
      });

    return obj;
  },
  /**
   * 还原缓存数据
   * @param  {Object} cached 缓存数据
   */
  revertFromCacheData: function(cached) {
    _.assign(this, cached);
  }
});

module.exports = File.factory();

/**
 * 文件对象转换，传入参数若为String则返回其fis File对象，无法转换则输出错误信息
 * @param  {String|fis File} file 待处理的目标
 * @return {fis File}      返回fis File对象
 */
module.exports.wrap = function(file) {
  if (typeof file === 'string') {
    return new File(file);
  } else if (file instanceof File) {
    return file;
  } else {
    fis.log.error('unable to convert [' + (typeof file) + '] to [File] object.');
  }
};
