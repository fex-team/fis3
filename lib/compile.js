'use strict';

var CACHE_DIR;
var _ = require('./util.js');
var rType = /\s+type\s*=\s*(['"]?)((?:text|application)\/(.*?))\1/i;
var memoryCache = {};

// 待编译完成后，清空内存缓存
fis.on('release:end', function() {
  memoryCache = {};
});

function revertFromMemory(file, inCache) {
  file.revertFromCacheData(inCache.getCacheData());
  file.cache = inCache.cache;
  file.setContent(inCache.getContent());
};

/**
 * 编译相关函数入口, 输入为 文件对象，没有输出，直接修改文件对象内容。
 *
 * 默认文件编译会尝试从缓存中读取，如果缓存有效，将跳过编译。
 *
 * @example
 * var file = fis.file(filepath);
 * fis.compile(file);
 * console.log(file.getContent());
 *
 * @function
 * @param {String} file 文件对象
 * @namespace fis.compile
 */
var exports = module.exports = function(file) {
  if (!CACHE_DIR) {
    fis.log.error('uninitialized compile cache directory.');
  }
  file = fis.file.wrap(file);

  if (!file.realpath) {
    error('unable to compile [' + file.subpath + ']: Invalid file realpath.');
  }

  if (file.useCache && memoryCache[file.realpath]) {
    revertFromMemory(file, memoryCache[file.realpath]);
    return file;
  }
  memoryCache[file.realpath] = file;

  // lint 置前，不使用文件缓存
  if (file.isText() && exports.settings.useLint) {
    pipe(file, 'lint', true);
  }

  adjust(file);

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
    var f = fis.file.wrap(fis.project.getProjectPath() + subpath);

    if (f.exists() && !lockedCheck(file, f, 'link')) {
      lock(file, f, 'link');
      exports(f);
      unlock(f, 'link');
    }
  });
  return file;
};

/**
 * fis 编译默认的配置项
 * @property {Boolean} debug 如果设置成了 true, 那么编译缓存将会使用 debug 文件夹来存储缓存。
 * @property {Function} beforeCacheRevert 当文件从缓存中还原回来前执行。
 * @property {Function} afterCacheRevert 当文件从缓存中还原回来后执行。
 * @property {Function} beforeCompile 当文件开始编译前执行。
 * @property {Function} afterCompile 当文件开始编译后执行。
 * @name settings
 * @memberOf fis.compile
 */
exports.settings = {
  debug: false,
  useLint: false,
  beforeCacheRevert: function() {},
  afterCacheRevert: function() {},
  beforeCompile: function() {},
  afterCompile: function() {}
};

/**
 * 在编译前，初始化配置项。关于配置项，请查看 {@link fis.compile.settings}
 * @param  {Object} opt
 * @return {String}     缓存文件夹路径
 * @memberOf fis.compile
 * @name setup
 * @function
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
 * 清除缓存
 * @param  {String} name 想要清除的缓存目录，缺省为清除默认缓存或全部缓存
 * @memberOf fis.compile
 * @name clean
 * @function
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
 * fis 中间码管理器。
 * @namespace fis.compile.lang
 */
var map = exports.lang = (function() {
  var keywords = [];
  var delim = '\u001F'; // Unit Separator
  var rdelim = '\\u001F';
  var slice = [].slice;
  var map = {

    /**
     * 添加其他中间码类型。
     * @param {String} type 类型
     * @function add
     * @memberOf fis.compile.lang
     */
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

  /**
   * 获取能识别中间码的正则
   * @name reg
   * @type {RegExp}
   * @memberOf fis.compile.lang
   */
  Object.defineProperty(map, 'reg', {
    get: function() {
      return new RegExp(
        rdelim + '(' + keywords.join('|') + ')(\\d+?)' + rdelim + '([^' + rdelim + ']*?)(?:' + rdelim + '([^' + rdelim + ']+?))?' + rdelim + '\\2\\1' + rdelim,
        'g'
      );
    }
  });

  // 默认支持的中间码
  [
    'require', // 同步依赖文件。
    'jsRequire', // 同步 js 依赖
    'embed', // 内嵌其他文件
    'jsEmbed', // 内嵌 js 文件内容
    'async', // 异步依赖
    'jsAsync', // js 异步依赖
    'uri', // 替换成目标文件的 url
    'dep', // 简单的标记依赖
    'id', // 替换成目标文件的 id
    'hash', // 替换成目标文件的 md5 戳。
    'moduleId', // 替换成目标文件的 moduleId
    'xlang', // 用来内嵌其他语言
    'info' // 能用来包括其他中间码，包裹后可以起到其他中间码的作用，但是不会修改代码源码。
  ].forEach(map.add);

  return map;
})();

/**
 * 判断info.query是否为inline
 *
 * - `abc?__inline` return true
 * - `abc?__inlinee` return false
 * - `abc?a=1&__inline'` return true
 * - `abc?a=1&__inline=` return true
 * - `abc?a=1&__inline&` return true
 * - `abc?a=1&__inline` return true
 * @param {Object} info
 * @memberOf fis.compile
 */
function isInline(info) {
  return /[?&]__inline(?:[=&'"]|$)/.test(info.query);
}

/**
 * 分析注释中依赖用法。
 * @param {String} comment 注释内容
 * @param {Callback} [callback] 可以通过此参数来替换原有替换回调函数。
 * @memberOf fis.compile
 */
function analyseComment(comment, callback) {
  var reg = /(@(require|async|require\.async)\s+)('[^']+'|"[^"]+"|[^\s;!@#%^&*()]+)/g;
  callback = callback || function(m, prefix, type, value) {
    type = type === 'require' ? type : 'async';

    return prefix + map[type].wrap(value);
  };

  return comment.replace(reg, callback);
}

/**
 * 标准化处理 javascript 内容, 识别 __inline、__uri 和 __require 的用法，并将其转换成中间码。
 *
 * - [@require id] in comment to require resource
 * - __inline(path) to embedd resource content or base64 encodings
 * - __uri(path) to locate resource
 * - require(path) to require resource
 *
 * @param {String} content js 内容
 * @param {Callback} callback 正则替换回调函数，如果不想替换，请传入 null.
 * @param {File} file js 内容所在文件。
 * @memberOf fis.compile
 */
function extJs(content, callback, file) {
  var reg = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(\/\/[^\r\n\f]+|\/\*[\s\S]*?(?:\*\/|$))|\b(__inline|__uri|__require|__id|__moduleId|__hash)\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\)/g;
  callback = callback || function(m, comment, type, value) {
    if (type) {
      switch (type) {
        case '__inline':
          m = map.jsEmbed.wrap(value);
          break;
        case '__uri':
          m = map.uri.wrap(value);
          break;
        case '__id':
          m = map.id.wrap(value);
          break;
        case '__moduleId':
          m = map.moduleId.wrap(value);
          break;
        case '__require':
          m = 'require(' + map.jsRequire.wrap(value) + ')';
          break;
        case '__hash':
          m = map.hash.wrap(value);
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
 * 标准化处理 css 内容, 识别各种外链用法，并将其转换成中间码。
 *
 * - [@require id] in comment to require resource
 * - [@import url(path?__inline)] to embed resource content
 * - url(path) to locate resource
 * - url(path?__inline) to embed resource content or base64 encodings
 * - src=path to locate resource
 *
 * @param {String} content css 内容。
 * @param {Callback} callback 正则替换回调函数，如果不想替换，请传入 null.
 * @param {File} file js 内容所在文件。
 * @memberOf fis.compile
 */
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
 * 标准化处理 html 内容, 识别各种语法，并将其转换成中间码。
 *
 * - `<!--inline[path]-->` to embed resource content
 * - `<img|embed|audio|video|link|object ... (data-)?src="path"/>` to locate resource
 * - `<img|embed|audio|video|link|object ... (data-)?src="path?__inline"/>` to embed resource content
 * - `<script|style ... src="path"></script|style>` to locate js|css resource
 * - `<script|style ... src="path?__inline"></script|style>` to embed js|css resource
 * - `<script|style ...>...</script|style>` to analyse as js|css
 *
 * @param {String} content html 内容。
 * @param {Callback} callback 正则替换回调函数，如果不想替换，请传入 null.
 * @param {File} file js 内容所在文件。
 * @memberOf fis.compile
 */
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
        m = m.replace(/(\s(?:data-)?src(?:set)?\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
          var key = isInline(fis.util.query(value)) ? 'embed' : 'uri';
          if (prefix.indexOf('srcset') != -1) {
            //support srcset
            var info = fis.util.stringQuote(value);
            var srcset = [];
            info.rest.split(',').forEach(function(item) {
              var p;
              item = item.trim();
              if ((p = item.indexOf(' ')) == -1) {
                srcset.push(item);
                return;
              }
              srcset.push(map['uri'].wrap(item.substr(0, p)) + item.substr(p));
            });
            return prefix + srcset.join(', ');
          }
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
 * 处理type类型为 `x-**` 的block标签。
 *
 * ```css
 * <head>
 *   <style type="x-scss">
 *    &commat;import "compass/css3";
 *
 *    #border-radius {
 *      &commat;include border-radius(25px);
 *    }
 *   </style>
 * </head>
 * ```
 * @param  {String} tag        标签
 * @param  {String} content    the content of file
 * @param  {File} file         fis.file instance
 * @param  {String} defaultExt what is ?
 * @return {String}
 * @function
 * @memberOf fis.compile
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
  } else if (file.pipeEmbed === false) {

    switch (ext) {
      case 'html':
        content = extHtml(content, null, file);
        break;

      case 'js':
        content = extJs(content, null, file);
        break;

      case 'css':
        content = extCss(content, null, file);
        break;
    }

    return tag + content;
  }

  return tag + map.xlang.wrap(content, ext);
}

/**
 * 单文件编译入口，与 {@link fis.compile} 不同的是，此方法内部不进行缓存判断。
 * @param  {File} file 文件对象
 * @memberOf fis.compile
 * @name process
 * @function
 */
function process(file) {
  fis.emit('proccess:start', file);
  pipe(file, 'parser');
  pipe(file, 'preprocessor');
  pipe(file, 'standard');
  postStandard(file);
  pipe(file, 'postprocessor');
  pipe(file, 'optimizer');
  fis.emit('proccess:end', file);
}

/**
 * 让文件像管道一样经过某个流程处理。注意，跟 stream 的 pipe 不同，此方法不支持异步，而是同步的处理。
 * @memberOf fis.compile
 * @inner
 * @name pipe
 * @function
 * @param {File} file 文件对象
 * @param {String} type 类型
 * @param {Boolean} [keep] 是否保留文件内容。
 */
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

    // 过滤掉同名的插件, 没必要重复操作。
    processors = processors.filter(function(item, idx, arr) {
      item = item.__name || item;

      return idx === _.findIndex(arr, function(target) {
        target = target.__name || target;

        return target === item;
      });
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
        _.assign(settings, fis.media().get('settings.' + key, {}));
        _.assign(settings, options || {});

        // 删除隐藏配置
        delete settings.__name;
        delete settings.__plugin;
        delete settings.__pos;

        callback(processor, settings, key);
      } else {
        fis.log.warning('invalid processor [modules.' + key + ']');
      }
    });
  }
}

var lockedMap = {};

/*
 * error收集&输出
 * @param  {String} msg 输出的
 */
function error(msg) {
  //for watching, unable to exit
  lockedMap = {};
  fis.log.error(msg);
}

/*
 * 检查依赖是否存在闭环
 * @param  {String} from
 * @param  {String} to
 * @return {Boolean}
 */
function lockedCheck(from, to, group) {
  group = group ? (lockedMap[group] = lockedMap[group] || {}) : lockedMap;
  from = fis.file.wrap(from).realpath;
  to = fis.file.wrap(to).realpath;
  if (from === to) {
    return true;
  } else if (group[to]) {
    var prev = from;
    var msg = [];

    do {
      msg.unshift(prev);
      prev = group[prev];
    } while (prev && prev !== to);

    prev && msg.unshift(prev);
    msg.push(to);
    return msg;
  }
  return false;
}

/*
 * 设置 lockedMap 的值，用来 check.
 */
function lock(from, to, group) {
  group = group ? (lockedMap[group] = lockedMap[group] || {}) : lockedMap;
  from = fis.file.wrap(from).realpath;
  to = fis.file.wrap(to).realpath;

  group[to] = from;
}

/*
 * 删除的对应的 lockedMap 的值
 * @param  {Object} file
 */
function unlock(file, group) {
  group = group ? (lockedMap[group] = lockedMap[group] || {}) : lockedMap;
  delete group[file.realpath];
}

/*
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
 * 内置的标准化处理函数，外部可以覆写此过程。
 *
 * - 对 html 文件进行 {@link fis.compile.extHtml} 处理。
 * - 对 js 文件进行 {@link fis.compile.extjs} 处理。
 * - 对 css 文件进行 {@link fis.compile.extCss} 处理。
 *
 * @param  {String} content 文件内容
 * @param  {File} file    文件对象
 * @param  {Object} conf    标准化配置项
 * @memberOf fis.compile
 * @inner
 */
function builtinStandard(content, file, conf) {
  if (typeof content === 'string') {
    fis.log.debug('builtin standard for [%s] start', file.realpath);
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
    fis.log.debug('builtin standard for [%s] end', file.realpath);
  }
  return content;
}

/**
 * 将中间码还原成源码。
 *
 * 中间码说明：（待补充）
 *
 * @inner
 * @memberOf fis.compile
 * @param  {file} file 文件对象
 */
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
    reg.lastIndex = 0; // 重置 regexp
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
          case 'moduleId':
            info = fis.project.lookup(value, file);
            ret = info.quote + info.moduleId + info.quote;

            if (info.file && info.file.isFile()) {
              file.addLink(info.file.subpath);
            }
            break;
          case 'hash':
            info = fis.project.lookup(value, file);
            if (info.file && info.file.isFile()) {

              file.addLink(info.file.subpath);

              var locked = lockedCheck(file, info.file);
              if (!locked) {
                lock(file, info.file);
                exports(info.file);
                unlock(info.file);
                addDeps(file, info.file);
              }

              var md5 = info.file.getHash();
              ret = info.quote + md5 + info.quote;
            } else {
              ret = value;
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
                copyInfo(f, file);

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
              fis.log.error('unable to embed non-existent file %s', value);
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
              fis.log.error('unsupported fis language tag [%s]', type);
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

/**
 * 编译代码片段。用于在 html 中内嵌其他异构语言。
 * @param {String} content 代码片段。
 * @param {File} host 代码片段所在的文件，用于片段中对其他资源的查找。
 * @param {Object} info 文件信息。
 * @memberOf fis.compile
 * @example
 * var file = fis.file(root, 'static/_nav.tmpl');
 * var content = file.getContent();
 *
 * // tmpl 文件本身是 html 文件，但是会被解析成 js 文件供 js 使用。正常情况下他只有 js 语言能力。但是：
 * content = fis.compile.partial(content, file, {
 *    ext: 'html' // set isHtmlLike
 * });
 *
 * file.setConent(content);
 *
 * // 继续走之后的 js parser 流程。
 */
function partial(content, host, info) {

  // 默认 html 内嵌的 js, css 内容，都会独立走一遍单文件编译流程。
  // 可以通过 pipeEmbed 属性设置成 `false` 来关闭。
  if (host.pipeEmbed === false) {
    return content;
  }

  if (content.trim()) {
    info = typeof info === 'string' ? {
      ext: info
    } : (info || {});
    var ext = info.ext || host.ext;
    ext[0] === '.' && (ext = ext.substring(1));
    info.ext = '.' + ext;
    info.xLang = ':' + ext;

    var f = fis.file(host.realpath, info);
    f.cache = host.cache;
    f.isPartial = true;
    f.isInline = true;
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

function resourceMapFile(file) {
  var content = file.getContent();
  var reg = /\b__RESOURCE_MAP__\b/g;
  // 如果写文档时包含了此字符，不应该替换，所以强制判断一下
  if (content.match(reg) && typeof file._isResourceMap == 'undefined') {
    file._isResourceMap = true; // special file
    file.useCache = false; // disable cache
    return true;
  }
  return false;
}

/*
 * adjust file
 * @param file
 */
function adjust(file) {
  if (file.isText()) {
    resourceMapFile(file);
  }
}

exports.process = process;
exports.extJs = extJs;
exports.extCss = extCss;
exports.extHtml = extHtml;
exports.xLang = xLang;
exports.partial = partial;
exports.isInline = isInline;
exports.analyseComment = analyseComment;
