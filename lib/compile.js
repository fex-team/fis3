/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

/**
 * @type {Function}
 * @param {String|fis.File} file
 */

var CACHE_DIR;
var _ = require('./util.js');
var rType = /\s+type\s*=\s*(['"]?)((?:text|application)\/(.*?))\1/i;

var exports = module.exports = function(file) {
  if (!CACHE_DIR) {
    fis.log.error('uninitialized compile cache directory.');
  }
  file = fis.file.wrap(file);

  if (!file.realpath) {
    error('unable to compile [' + file.subpath + ']: Invalid file realpath.');
  }

  fis.log.debug('compile [' + file.realpath + '] start');
  fis.emit('compile:start', file);
  if (file.isFile()) {
    if (file.useCompile && file.ext && file.ext !== '.') {
      var cache = file.cache = fis.cache(file.realpath, CACHE_DIR),
        revertObj = {};
      if (file.useCache && cache.revert(revertObj)) {
        exports.settings.beforeCacheRevert(file);
        file.revertFromCacheData(revertObj.info);
        if (file.isText()) {
          revertObj.content = revertObj.content.toString('utf8');
        }
        file.setContent(revertObj.content);
        exports.settings.afterCacheRevert(file);
      } else {
        exports.settings.beforeCompile(file);
        file.setContent(fis.util.read(file.realpath));
        process(file);
        exports.settings.afterCompile(file);
        cache.save(file.getContent(), file.getCacheData());
      }
    } else {
      file.setContent(file.isText() ? fis.util.read(file.realpath) : fis.util.fs.readFileSync(file.realpath));
    }
  } else if (file.useCompile && file.ext && file.ext !== '.') {
    process(file);
  }
  if (file.useHash) {
    file.getHash();
  }
  file.compiled = true;
  fis.log.debug('compile [' + file.realpath + '] end');
  fis.emit('compile:end', file);
  file.links.forEach(function(subpath) {
    if (!lockedCheck(file, subpath)) {
      var f = fis.file.wrap(fis.project.getProjectPath() + subpath);
      lock(file, f);
      exports(f);
      unlock(f);
    }
  });
  return file;
};

/**
 * fis.compile.settings
 * @type {Object}
 */
exports.settings = {
  debug: false,
  lint: false,
  test: false,
  beforeCacheRevert: function() {},
  afterCacheRevert: function() {},
  beforeCompile: function() {},
  afterCompile: function() {}
};

/**
 * fis.compile.setup 初始化
 * @param  {Object} opt
 * @return {String}     缓存文件夹路径
 */
exports.setup = function(opt) {
  var settings = exports.settings;
  if (opt) {
    fis.util.map(settings, function(key) {
      if (typeof opt[key] !== 'undefined') {
        settings[key] = opt[key];
      }
    });
  }
  CACHE_DIR = 'compile/';
  if (settings.unique) {
    CACHE_DIR += Date.now() + '-' + Math.random();
  } else {
    CACHE_DIR += '' + (settings.debug ? 'debug' : 'release') + '-' + fis.project.currentMedia();
  }

  return CACHE_DIR;
};

/**
 * fis.compile.clean 清除缓存
 * @param  {String} name 想要清除的缓存目录，缺省为清除默认缓存或全部缓存
 */
exports.clean = function(name) {
  if (name) {
    fis.cache.clean('compile/' + name);
  } else if (CACHE_DIR) {
    fis.cache.clean(CACHE_DIR);
  } else {
    fis.cache.clean('compile');
  }
};

/**
 * 处理
 * @param  {Array}  ) {             var keywords [description]
 * @return {[type]}   [description]
 */
var map = exports.lang = (function() {
  var keywords = [];
  var delim = '\u001F'; // Unit Separator
  var rdelim = '\\u001F';
  var slice = [].slice;
  var map = {
    add: function(type) {
      if (~keywords.indexOf(type)) {
        return this;
      }
      var stack = [];
      keywords.push(type);
      map[type] = {
        wrap: function(value) {
          return this.ld + slice.call(arguments, 0).join(delim) + this.rd;
        }
      };

      // 定义map.ld
      Object.defineProperty(map[type], 'ld', {
        get: function() {
          var depth = stack.length;
          stack.push(depth);
          return delim + type + depth + delim;
        }
      });

      // 定义map.rd
      Object.defineProperty(map[type], 'rd', {
        get: function() {
          return delim + stack.pop() + type + delim;
        }
      });
    }
  };

  Object.defineProperty(map, 'reg', {
    get: function() {
      return new RegExp(
        rdelim + '(' + keywords.join('|') + ')(\\d+?)' + rdelim + '([^' + rdelim + ']*?)(?:' + rdelim + '([^' + rdelim + ']+?))?' + rdelim + '\\2\\1' + rdelim,
        'g'
      );
    }
  });

  ['require', 'jsRequire', 'embed', 'jsEmbed', 'async', 'jsAsync', 'uri', 'dep', 'id', 'xlang', 'info'].forEach(map.add);

  return map;
})();

/**
 * 判断info.query是否为inline
 * @param {Object} info
 * @example
 *   "abc?__inline" return true
 *   "abc?__inlinee" return false
 *   "abc?a=1&__inline'" return true
 *   "abc?a=1&__inline=" return true
 *   "abc?a=1&__inline&" return true
 *   "abc?a=1&__inline"" return true
 */
function isInline(info) {
  return /[?&]__inline(?:[=&'"]|$)/.test(info.query);
}

//analyse [@require id] syntax in comment
function analyseComment(comment, callback) {
  var reg = /(@(require|async)\s+)('[^']+'|"[^"]+"|[^\s;!@#%^&*()]+)/g;
  callback = callback || function(m, prefix, type, value) {
    return prefix + map[type].wrap(value);
  };
  return comment.replace(reg, callback);
}

/**
 * 提取JS文件中的外链
 */
//expand javascript
//[@require id] in comment to require resource
//__inline(path) to embedd resource content or base64 encodings
//__uri(path) to locate resource
//require(path) to require resource
function extJs(content, callback, file) {
  var reg = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(\/\/[^\r\n\f]+|\/\*[\s\S]*?(?:\*\/|$))|\b(__inline|__uri|__require)\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\)/g;
  callback = callback || function(m, comment, type, value) {
    if (type) {
      switch (type) {
        case '__inline':
          m = map.jsEmbed.wrap(value);
          break;
        case '__uri':
          m = map.uri.wrap(value);
          break;
        case '__require':
          m = 'require(' + map.jsRequire.wrap(value) + ')';
          break;
      }
    } else if (comment) {
      m = analyseComment(comment);
    }
    return m;
  };
  content = content.replace(reg, callback);
  var info = {
    file: file,
    content: content
  };

  fis.emit('standard:js', info);
  return info.content;
}

/**
 * 提取css中的外链
 */
//expand css
//[@require id] in comment to require resource
//[@import url(path?__inline)] to embed resource content
//url(path) to locate resource
//url(path?__inline) to embed resource content or base64 encodings
//src=path to locate resource
function extCss(content, callback, file) {
  var reg = /(\/\*[\s\S]*?(?:\*\/|$))|(?:@import\s+)?\burl\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}\s]+)\s*\)(\s*;?)|\bsrc\s*=\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^\s}]+)/g;
  callback = callback || function(m, comment, url, last, filter) {
    if (url) {
      var key = isInline(fis.util.query(url)) ? 'embed' : 'uri';
      if (m.indexOf('@') === 0) {
        if (key === 'embed') {
          m = map.embed.wrap(url) + last.replace(/;$/, '');
        } else {
          m = '@import url(' + map.uri.wrap(url) + ')' + last;
        }
      } else {
        m = 'url(' + map[key].wrap(url) + ')' + last;
      }
    } else if (filter) {
      m = 'src=' + map.uri.wrap(filter);
    } else if (comment) {
      m = analyseComment(comment);
    }
    return m;
  };
  content = content.replace(reg, callback);

  var info = {
    file: file,
    content: content
  };

  fis.emit('standard:css', info);

  return info.content;
}

/**
 * 提取html中的外链，
 */
//expand html
//[@require id] in comment to require resource
//<!--inline[path]--> to embed resource content
//<img|embed|audio|video|link|object ... (data-)?src="path"/> to locate resource
//<img|embed|audio|video|link|object ... (data-)?src="path?__inline"/> to embed resource content
//<script|style ... src="path"></script|style> to locate js|css resource
//<script|style ... src="path?__inline"></script|style> to embed js|css resource
//<script|style ...>...</script|style> to analyse as js|css
function extHtml(content, callback, file) {
    var reg = /(<script(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(?=<\/script\s*>|$)|(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(?=<\/style\s*>|$)|<(img|embed|audio|video|link|object|source)\s+[\s\S]*?["'\s\w\/\-](?:>|$)|<!--inline\[([^\]]+)\]-->|<!--(?!\[)([\s\S]*?)(-->|$)/ig;
    callback = callback || function(m, $1, $2, $3, $4, $5, $6, $7, $8) {
      if ($1) { //<script>
        var embed = '';
        $1 = $1.replace(/(\s(?:data-)?src\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
          if (isInline(fis.util.query(value))) {
            embed += map.embed.wrap(value);
            return '';
          } else {
            return prefix + map.uri.wrap(value);
          }
        });
        if (embed) {
          //embed file
          m = $1 + embed;
        } else {
          m = xLang($1, $2, file, rType.test($1) ? 'html' : 'js');
        }
      } else if ($3) { //<style>
        m = xLang($3, $4, file, 'css');
      } else if ($5) { //<img|embed|audio|video|link|object|source>
        var tag = $5.toLowerCase();
        if (tag === 'link') {
          var inline = '',
            isCssLink = false,
            isImportLink = false;
          var result = m.match(/\srel\s*=\s*('[^']+'|"[^"]+"|[^\s\/>]+)/i);
          if (result && result[1]) {
            var rel = result[1].replace(/^['"]|['"]$/g, '').toLowerCase();
            isCssLink = rel === 'stylesheet';
            isImportLink = rel === 'import';
          }
          m = m.replace(/(\s(?:data-)?href\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(_, prefix, value) {
            if ((isCssLink || isImportLink) && isInline(fis.util.query(value))) {
              if (isCssLink) {
                inline += '<style' + m.substring(5).replace(/\/(?=>$)/, '').replace(/\s+(?:charset|href|data-href|hreflang|rel|rev|sizes|target)\s*=\s*(?:'[^']+'|"[^"]+"|[^\s\/>]+)/ig, '');
              }
              inline += map.embed.wrap(value);
              if (isCssLink) {
                inline += '</style>';
              }
              return '';
            } else {
              return prefix + map.uri.wrap(value);
            }
          });
          m = inline || m;
        } else if (tag === 'object') {
          m = m.replace(/(\sdata\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
            return prefix + map.uri.wrap(value);
          });
        } else {
          m = m.replace(/(\s(?:data-)?src\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
            var key = isInline(fis.util.query(value)) ? 'embed' : 'uri';
            return prefix + map[key].wrap(value);
          });
        }
      } else if ($6) {
        m = map.embed.wrap($6);
      } else if ($7) {
        m = '<!--' + analyseComment($7) + $8;
      }
      return m;
    };
    content = content.replace(reg, callback);

    var info = {
      file: file,
      content: content
    };

    fis.emit('standard:html', info);

    return info.content;
  }
  /**
   * 处理type类型为x-
   * @param  {String} tag        标签
   * @param  {} content    [description]
   * @param  {[type]} file       [description]
   * @param  {[type]} defaultExt [description]
   * @return {[type]}            [description]
   */
function xLang(tag, content, file, defaultExt) {
  var m = rType.exec(tag);
  var ext = defaultExt;
  var isXLang = false;

  if (m) {
    var lang = m[3].toLowerCase();

    switch (lang) {
      case 'javascript':
        ext = 'js';
        break;

      case 'css':
        ext = 'css';
        break;

      default:
        if (lang.substring(0, 2) === 'x-') {
          ext = lang.substring(2);
          isXLang = true;
        }
        break;
    }
  }

  if (isXLang) {
    var mime = _.getMimeType(ext);
    mime && (tag = tag.replace(rType, function(all, quote) {
      return ' type=' + quote + mime + quote;
    }));
  }

  return tag + map.xlang.wrap(content, ext);
}

function process(file) {
  fis.emit('proccess:start', file);
  pipe(file, 'lint', true);
  pipe(file, 'parser');
  pipe(file, 'preprocessor');
  pipe(file, 'standard');
  postStandard(file);
  pipe(file, 'postprocessor');
  pipe(file, 'optimizer');
  fis.emit('proccess:end', file);
}

function pipe(file, type, keep) {
  var processors = [];

  var prop = file[type];


  if (type === 'standard' && 'undefined' === typeof prop) {
    processors.push('builtin');
  }

  if (prop) {
    var typeOf = typeof prop;
    if (typeOf === 'string') {
      prop = prop.trim().split(/\s*,\s*/);
    } else if (!Array.isArray(prop)) {
      prop = [prop];
    }

    processors = processors.concat(prop);
  }

  fis.emit('compile:' + type, file);

  if (processors.length) {
    processors = processors.filter(function(item, idx, arr) {
      return arr.indexOf(item) === idx;
    });

    var callback = function(processor, settings, key) {
      settings.filename = file.realpath;
      var content = file.getContent();
      try {
        fis.log.debug('pipe [' + key + '] start');
        var result = processor(content, file, settings);
        fis.log.debug('pipe [' + key + '] end');
        if (keep) {
          file.setContent(content);
        } else if (typeof result === 'undefined') {
          fis.log.warning('invalid content return of pipe [' + key + ']');
        } else {
          file.setContent(result);
        }
      } catch (e) {
        //log error
        fis.log.debug('pipe [' + key + '] fail');
        var msg = key + ': ' + String(e.message || e.msg || e).trim() + ' [' + (e.filename || file.realpath);
        if (e.hasOwnProperty('line')) {
          msg += ':' + e.line;
          if (e.hasOwnProperty('col')) {
            msg += ':' + e.col;
          } else if (e.hasOwnProperty('column')) {
            msg += ':' + e.column;
          }
        }
        msg += ']';
        e.message = msg;
        error(e);
      }
    };

    processors.forEach(function(processor, index) {
      var typeOf = typeof processor,
        key, options;

      if (typeOf === 'object' && processor.__name) {
        options = processor;
        processor = processor.__name;
        typeOf = typeof processor;
      }

      if (typeOf === 'string') {
        key = type + '.' + processor;
        processor = (type === 'standard' && processor === 'builtin') ? builtinStandard : fis.require(type, processor);
      } else {
        key = type + '.' + index;
      }

      if (typeof processor === 'function') {
        var settings = {};
        _.assign(settings, processor.defaultOptions || processor.options || {});
        _.assign(settings, fis.config.env().get('settings.' + key, {}));
        _.assign(settings, options || {});
        callback(processor, settings, key);
      } else {
        fis.log.warning('invalid processor [modules.' + key + ']');
      }
    });
  }
}

var lockedMap = {};

/**
 * error收集&输出
 * @param  {String} msg 输出的
 * @return {[type]}     [description]
 */
function error(msg) {
  //for watching, unable to exit
  lockedMap = {};
  fis.log.error(msg);
}

/**
 * 检查依赖是否存在闭环
 * @param  {String} from
 * @param  {String} to
 * @return {Boolean}
 */
function lockedCheck(from, to) {
  from = fis.file.wrap(from).realpath;
  to = fis.file.wrap(to).realpath;
  if (from === to) {
    return true;
  } else if (lockedMap[to]) {
    var prev = from;
    var msg = [];

    do {
      msg.unshift(prev);
      prev = lockedMap[prev];
    } while (prev && prev !== to);

    prev && msg.unshift(prev);
    msg.push(to);
    return msg;
  }
  return false;
}

/**
 * 设置 lockedMap 的值，用来 check.
 */
function lock(from, to) {
  from = fis.file.wrap(from).realpath;
  to = fis.file.wrap(to).realpath;

  lockedMap[to] = from;
}

/**
 * 删除的对应的 lockedMap 的值
 * @param  {Object} file
 */
function unlock(file) {
  delete lockedMap[file.realpath];
}

/**
 * 添加依赖
 * @param {Object} a
 * @param {Object} b
 */
function addDeps(a, b) {
  if (a && a.cache && b) {
    if (b.cache) {
      a.cache.mergeDeps(b.cache);
    }
    a.cache.addDeps(b.realpath || b);
  }
}

/**
 *
 * @param  {[type]} content [description]
 * @param  {[type]} file    [description]
 * @param  {[type]} conf    [description]
 * @return {[type]}         [description]
 */
function builtinStandard(content, file, conf) {
  if (typeof content === 'string') {
    fis.log.debug('builtin standard for `%s` start', file.subpath);
    var type;
    if (conf.type && conf.type !== 'auto') {
      type = conf.type;
    } else {
      type = file.isHtmlLike ? 'html' : (file.isJsLike ? 'js' : (file.isCssLike ? 'css' : ''));
    }

    switch (type) {
      case 'html':
        content = extHtml(content, null, file);
        break;

      case 'js':
        content = extJs(content, null, file);
        break;

      case 'css':
        content = extCss(content, null, file);
        break;

      default:
        // unrecognized.
        break;
    }
    fis.log.debug('builtin standard for `%s` end', file.subpath);
  }
  return content;
}

function postStandard(file) {
  fis.emit('standard:restore:start', file);
  var content = file.getContent();

  if (typeof content !== 'string') {
    return;
  }

  fis.log.debug('postStandard start');

  var reg = map.reg;
  // 因为处理过程中可能新生成中间码，所以要拉个判断。
  while (reg.test(content)) {
    reg.lastIndex = 0; // 重置 regxp
    content = content.replace(reg, function(all, type, depth, value, extra) {
      var ret = '',
        info, id;
      try {
        switch (type) {
          case 'id':
            info = fis.project.lookup(value, file);
            ret = info.quote + info.id + info.quote;

            if (info.file && info.file.isFile()) {
              file.addLink(info.file.subpath);
            }
            break;
          case 'require':
          case 'jsRequire':
            info = fis.project.lookup(value, file);
            file.addRequire(info.id);

            if (type === 'jsRequire' && info.moduleId) {
              ret = info.quote + info.moduleId + info.quote;
            } else {
              ret = info.quote + info.id + info.quote;
            }

            if (info.file && info.file.isFile()) {
              file.addLink(info.file.subpath);
            }
            break;

          case 'async':
          case 'jsAsync':
            info = fis.project.lookup(value, file);
            file.addAsyncRequire(info.id);

            if (type === 'jsAsync' && info.moduleId) {
              ret = info.quote + info.moduleId + info.quote;
            } else {
              ret = info.quote + info.id + info.quote;
            }

            if (info.file && info.file.isFile()) {
              file.addLink(info.file.subpath);
            }
            break;
          case 'uri':
            info = fis.project.lookup(value, file);
            if (info.file && info.file.isFile()) {

              file.addLink(info.file.subpath);

              if (info.file.useHash) {
                var locked = lockedCheck(file, info.file);
                if (!locked) {
                  lock(file, info.file);
                  exports(info.file);
                  unlock(info.file);
                  addDeps(file, info.file);
                }
              }
              var query = (info.file.query && info.query) ? '&' + info.query.substring(1) : info.query;
              var url = info.file.getUrl();
              var hash = info.hash || info.file.hash;
              ret = info.quote + url + query + hash + info.quote;
            } else {
              ret = value;
            }
            break;
          case 'dep':
            if (file.cache) {
              info = fis.project.lookup(value, file);
              addDeps(file, info.file);
            } else {
              fis.log.warning('unable to add deps to file [' + path + ']');
            }
            break;
          case 'embed':
          case 'jsEmbed':
            info = fis.project.lookup(value, file);
            var f;
            if (info.file) {
              f = info.file;
            } else if (fis.util.isAbsolute(info.rest)) {
              f = fis.file(info.rest);
            }
            if (f && f.isFile()) {
              file.addLink(f.subpath);
              var locked = lockedCheck(file, info.file);
              if (!locked) {
                lock(file, info.file);
                f.isInline = true;
                exports(f);
                unlock(f);
                addDeps(file, f);
                f.requires.forEach(function(id) {
                  file.addRequire(id);
                });
                if (f.isText()) {
                  ret = f.getContent();
                  if (type === 'jsEmbed' && !f.isJsLike && !f.isJsonLike) {
                    ret = JSON.stringify(ret);
                  }
                } else {
                  ret = info.quote + f.getBase64() + info.quote;
                }
              } else {
                var msg = 'unable to embed file[' + file.realpath + '] into itself.';

                if (locked.splice) {
                  msg = 'circular embed `' + locked.join('` -> `') + '`.';
                }

                error(msg);
              }
            } else {
              fis.log.error('unable to embed non-existent file [' + value + ']');
            }
            break;
          case 'xlang':
            ret = partial(value, file, extra);
            break;

          // 用来存信息的，内容会被移除。
          case 'info':
            ret = '';
            break;
          default:
            if (!map[type]) {
              fis.log.error('unsupported fis language tag [' + type + ']');
            }
        }

        // trigger event.
        var message = {
          ret: ret,
          value: value,
          file: file,
          info: info,
          type: type
        };
        fis.emit('standard:restore', message);
        fis.emit('standard:restore:' + type, message);
        ret = message.ret;
      } catch (e) {
        lockedMap = {};
        e.message = e.message + ' in [' + file.subpath + ']';
        throw e;
      }
      return ret;
    });
  }
  file.setContent(content);
  fis.emit('standard:restore:end', file);
  fis.log.debug('postStandard end');
}

function partial(content, host, info) {
  info = typeof info === 'string' ? {
    ext: info
  } : (info || {});
  var ext = info.ext || host.ext;
  delete info.ext;
  ext[0] === '.' && (ext = ext.substring(1));

  if (content.trim()) {
    var f = fis.file.wrap(host.realpathNoExt + '.partial.' + ext);
    f.cache = host.cache;
    f.isPartial = true;
    f.isInline = true;
    _.assign(f, info);
    f.setContent(content);
    process(f);
    copyInfo(f, host);
    content = f.getContent();
  }

  return content;
}

function copyInfo(src, dst) {
  var addFn = {
    'requires': 'addRequire',
    'asyncs': 'addAsyncRequire',
    'links': 'addLink'
  };

  Object.keys(addFn).forEach(function(key) {
    src[key].forEach(function(item) {
      dst[addFn[key]](item);
    });
  });
}

exports.process = process;
exports.extJs = extJs;
exports.extCss = extCss;
exports.extHtml = extHtml;
exports.xLang = xLang;
exports.partial = partial;
exports.isInline = isInline;
exports.analyseComment = analyseComment;
