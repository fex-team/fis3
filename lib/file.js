/**
 * 文件操作模块
 */
'use strict';
var _ = require('./util.js');
var path = require('path');

/*
 * 编译文件后缀处理
 * @deprecated 直接在文件属性中设置就好，不要通过 project.ext 来配置了。
 * @param  {String} ext 后缀
 * @return {String}     release时使用的后缀
 */
function getReleaseExt(ext) {
  if (ext) {
    var rExt = fis.media().get('project.ext' + ext);
    if (rExt) {
      ext = normalizeExt(rExt);
    }
  }
  return ext;
}

/*
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

/*
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

/*
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
    onnector = fis.media().get('project.md5Connector', '_'),
    reg = new RegExp(qRExt + '$|' + qExt + '$', 'i');
  return path.replace(reg, '') + onnector + hash + rExt;
}

/*
 * 获取路径对应下的全部domain
 * @param  {String} path 路径
 * @return {Array}      符合的全部domain值
 */
function getDomainsByPath(path) {
  var domain = fis.media().get('project.domain', {}),
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


function getDomain(path, domains) {
  domains = domains || getDomainsByPath(path);

  var hash = fis.util.md5(path),
    len = domains.length,
    domain = '';

  if (len) {
    domain = domains[hash.charCodeAt(0) % len];
  }

  return domain;
}

var slice = [].slice;

/**
 * File，fis 编译过程中，文件会被此类进行封装，对于文件的操作，都是通过此类来完成。
 *
 * @property {String} ext 文件名后缀。
 * @property {String} realpath 文件物理地址。
 * @property {String} realpathNoExt 文件物理地址，没有后缀。
 * @property {String} subpath 文件基于项目 root 的绝对路径。
 * @property {String} subpathNoExt 文件基于项目 root 的绝对路径，没有后缀。
 * @property {Boolean} useCompile 标记是否需要编译。
 * @property {Boolean} useDomain 标记是否使用带domain的地址。
 * @property {Boolean} useCache 编译过程中是否采用缓存。
 * @property {Boolean} useMap 编译后是否将资源信息写入 map.json 表。
 * @property {String} domain 文件的 domain 信息，在 useDomain 为 true 时会被作用在链接上。
 * @property {String} release 文件的发布路径，当值为  false 时，文件不会发布。
 * @property {String} url 文件访问路径。
 * @property {String} id 文件 id 属性，默认为文件在项目中的绝对路径，不建议修改。
 * @property {Array} requires 用来记录文件依赖。
 * @property {Array} asyncs 用来记录异步依赖。
 * @property {Array} links 用来记录此文件用到了哪些文件。
 * @property {Array} derived 用来存放派生的文件，比如 sourcemap 文件。
 * @property {Object} extras 用来存放一些附属信息，注意：此属性将会添加到 map.json 里面。
 * @property {Boolean} isHtmlLike 标记此文件是否为 html 性质的文件。
 * @property {Boolean} isCssLike 标记此文件是否为 css 性质的文件。
 * @property {Boolean} isJsLike 标记此文件是否为 javascript 性质的文件。
 * @property {Boolean} isJsonLike 标记此文件是否为 json 性质的文件。
 *
 *
 *
 * @class
 * @inner
 * @param {String} path... 文件路径，可以作为多个参数输入，多个参数会被 `/` 串联起来。
 * @param {Object} [props] 可以默认给文件添加一些属性
 * @memberOf fis.file
 */
var File = Object.derive(function() {
  // 构造函数
  var args = slice.call(arguments);
  var props = args.pop();

  if (!_.isPlainObject(props)) {
    args.push(props);
    props = null;
  }

  var self = _.assign(this, _.pathinfo(args));

  props && _.assign(this, props);

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
    properties = _.applyMatches(subpath + (this.xLang || ''), fis.media().getSortedMatches());
  }

  var rExt = this.rExt = properties.rExt ? normalizeExt(properties.rExt) : getReleaseExt(ext);
  this.useCompile = true;
  // this.useDomain = false;
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
      case '.es6':
      case '.jsx':
      case '.coffee':
        this.isJsLike = true;
        // this.useDomain = true;
        // this.useHash = true;
        this.useMap = true;
        break;
      case '.css':
      case '.less':
      case '.sass':
      case '.styl':
      case '.scss':
        this.isCssLike = true;
        // this.useDomain = true;
        // this.useHash = true;
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
    // this.useDomain = true;
    // this.useHash = rExt !== '.ico';
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
          fis.log.error('unreleasable file [%s]', self.realpath);
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
        this.charset || fis.media().get('project.charset', 'utf8')
      ).toLowerCase();
    }

    //file id
    var id = this.id || subpath.replace(/^\//, '');
    var ns = fis.media().get('namespace');
    if (ns) {
      id = ns + fis.media().get('namespaceConnector', ':') + id;
    }

    this.id = id;
    this.moduleId = this.moduleId || this.id.replace(new RegExp(_.escapeReg(ext) + '$', 'i'), '');
  }
}, /** @lends fis.file~File.prototype */{

  /**
   * 定义默认的文件类型，如：isHtmlLike、isJsLike、isCssLike。他们是互斥的，当设置其中某个值为 true 时，
   * 其他属性应该为 false.
   *
   * 提取到一个方法里面原因是：isXXXLike 的属性是通过 `Object.defineProperties`
   * 定义的，当 file 对象从文件 cache 里面反序列回来后，isXxxLike 系列的属性都会丢失。 所以这块需要重新调用（定义）一次。
   * @function
   * @return {Undefined}
   */
  defineLikes: function() {
    if (this.hasOwnProperty('isHtmlLike')) {
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
   * 返回文件是否真实存在。
   * @function
   * @return {Boolean}
   */
  exists: function() {
    return fis.util.exists(this.realpath);
  },

  /**
   * 返回文件是否为文本文件。
   * @return {Boolean}
   */
  isText: function() {
    return this._isText;
  },

  /**
   * 返回文件是否为图片文件。
   * @return {Boolean}
   */
  isImage: function() {
    return this._isImage;
  },

  /**
   * 返回真实的物理路径
   * @return {String} 路径
   */
  toString: function() {
    return this.realpath;
  },

  /*
   * 获取文件最近修改时间，注意这里是文件的修改时间，而不是此类内容的修改时间。
   * @return {Date} 最近修改时间
   */
  getMtime: function() {
    return fis.util.mtime(this.realpath) || new Date();
  },

  /**
   * 判断文件路径是否为文件
   * @return {Boolean}
   */
  isFile: function() {
    return fis.util.isFile(this.realpath);
  },

  /**
   * 判断文件路径是否为文件夹
   * @return {Boolean}
   */
  isDir: function() {
    return fis.util.isDir(this.realpath);
  },

  /**
   * 设置文件内容，可以是字符串或者 Buffer 对象。
   * @param {String | Buffer} c 文件内容
   * @return {Object} 返回自身，方便链式调用
   */
  setContent: function(c) {
    this._content = c;
    return this;
  },

  /**
   * 获取文件内容
   * @return {String| Buffer} 文件内容
   */
  getContent: function() {
    if (typeof this._content === 'undefined') {
      this._content = fis.util.read(this.realpath, this.isText());
    }
    return this._content;
  },

  /**
   * 获取文件内容的md5序列，多次调用，尽管文件内容有变化，也只会返回第一次调用时根据当时文件内容计算出来的结果。
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
   * @param {Boolean} prefix  是否需要base64格式头, 默认为 `true`。
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
   * 返回文件 ID
   * @return {String}
   */
  getId: function() {
    return this.id;
  },

  /**
   * 返回文件url, 跟直接获取 url 属性不同，此方法会受 useHash 和 useDomain 设置影响，会对应加上内容。
   * @return {String}
   */
  getUrl: function() {
    var url = this.url;
    if (this.useHash) {
      url = addHash(url, this);
    }
    // if (this.useDomain) {
      if (!this.domain) {
        this.domain = getDomain(this.subpath);
      } else if (Array.isArray(this.domain)) {
        this.domain = getDomain(this.subpath, this.domain);
      }
      url = this.domain + url;
    // }

    return url + this.query;
  },

  /**
   * 获取文件的发布路径，会带上 hash 信息，如果设置了 useHash 的话。
   * @param  {String} release 路径，不指定时使用此对象上的 release 属性。
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
      fis.log.error('unreleasable file [%s]', this.realpath);
    }
  },

  /**
   * 添加新的同步依赖，同一个 ID 只会保留一条记录。
   * @param {String} id 依赖的文件标识(id)
   */
  addRequire: function(id) {
    if (id && (id = id.trim())) {

      // js embend 同名.html 而 同名.html 又开启了依赖同名.js，然后就出现了，自己依赖自己了。
      // 所以这里做了 id !== this.id 的判断
      if (id !== this.id && !~this.requires.indexOf(id)) {
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
   * 添加异步依赖，同一个 ID 只会保留一条记录。
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
   * 处理同名但不同后缀名的require
   * @param {String} ext 可以指定后缀，如果指定了，则添加指定后缀的同名依赖。
   */
  addSameNameRequire: function(ext) {
    var path, map;
    if (fis.util.isFile(this.realpathNoExt + ext)) {
      path = './' + this.filename + ext;
    } else if ((map = fis.media().get('project.ext'))) {
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
   * 获取缓存数据, 文件每次编译都会存储一些属性到文件缓存。
   *
   * 默认除了 _xxxx 私有属性外所有的属性都会存入到缓存。
   *
   * @return {Object}
   */
  getCacheData: function() {
    var obj = {};
    var self = this;

    Object
      .keys(this)

      // 过滤掉私有属性。 _key
      // 但是不过滤 __key
      .filter(function(key) {
        return key !== 'cache' && key !== 'url' && !/^_[^_]/.test(key);
      })
      .forEach(function(key) {
        obj[key] = self[key];
      });

    return obj;
  },

  /**
   * 当缓存有效时，将缓存数据还原到文件对象上。
   * @param  {Object} cached 缓存数据
   */
  revertFromCacheData: function(cached) {
    _.assign(this, cached);
  }
});

/**
 * 用来创建 File 对象， 更多细节请查看 {@link fis.file~File File} 说明。
 *
 * ```js
 * var file = fis.file(root, 'static/xxx.js');
 * ```
 *
 * @see {@link fis.file~File File 类说明}
 * @param {String} filepath... 文件路径
 * @function
 * @namespace fis.file
 */
module.exports = File.factory();

/**
 * 用来包裹文件，输入可以是路径也可以是文件对象，输出统一为文件对象。
 * @param  {Mixed} file 文件路径，或者文件对象
 * @return {@link fis.file~File File 对象}
 * @example
 * var file = fis.file.wrap('path of file');
 * var file2 = fis.file.wrap(file);
 * @memberOf fis.file
 * @name wrap
 */
module.exports.wrap = function(file) {
  if (typeof file === 'string') {
    return new File(file);
  } else if (file instanceof File) {
    return file;
  } else {
    fis.log.error('unable to convert [%s] to [File] object.', (typeof file));
  }
};
