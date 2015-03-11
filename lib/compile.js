/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var CACHE_DIR;

var exports = module.exports = function(file) {
  if (!CACHE_DIR) {
    fis.log.error('uninitialized compile cache directory.');
  }
  file = fis.file.wrap(file);
  if (!file.realpath) {
    error('unable to compile [' + file.subpath + ']: Invalid file realpath.');
  }
  fis.log.debug('compile [' + file.realpath + '] start');
  fis.emitter.emit('compile:start', file);
  if (file.isFile()) {
    if (file.useCompile && file.ext && file.ext !== '.') {
      var cache = file.cache = fis.cache(file.realpath, CACHE_DIR),
        revertObj = {};
      if (file.useCache && cache.revert(revertObj)) {
        exports.settings.beforeCacheRevert(file);
        file.requires = revertObj.info.requires;
        file.extras = revertObj.info.extras;
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
        revertObj = {
          requires: file.requires,
          extras: file.extras
        };
        cache.save(file.getContent(), revertObj);
      }
    } else {
      file.setContent(file.isText() ? fis.util.read(file.realpath) : fis.util.fs.readFileSync(file.realpath));
    }
  } else if (file.useCompile && file.ext && file.ext !== '.') {
    process(file);
  }
  if (exports.settings.hash && file.useHash) {
    file.getHash();
  }
  file.compiled = true;
  fis.log.debug('compile [' + file.realpath + '] end');
  fis.emitter.emit('compile:end', file);
  embeddedUnlock(file);
  return file;
};

exports.settings = {
  unique: false,
  debug: false,
  optimize: false,
  lint: false,
  test: false,
  hash: false,
  domain: false,
  beforeCacheRevert: function() {},
  afterCacheRevert: function() {},
  beforeCompile: function() {},
  afterCompile: function() {}
};

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
    CACHE_DIR += '' + (settings.debug ? 'debug' : 'release') + (settings.optimize ? '-optimize' : '') + (settings.hash ? '-hash' : '') + (settings.domain ? '-domain' : '');
  }
  return CACHE_DIR;
};

exports.clean = function(name) {
  if (name) {
    fis.cache.clean('compile/' + name);
  } else if (CACHE_DIR) {
    fis.cache.clean(CACHE_DIR);
  } else {
    fis.cache.clean('compile');
  }
};

var map = exports.lang = (function() {
  var keywords = ['require', 'embed', 'uri', 'dep', 'jsEmbed'],
    LD = '<<<',
    RD = '>>>',
    qLd = fis.util.escapeReg(LD),
    qRd = fis.util.escapeReg(RD),
    map = {
      reg: new RegExp(
        qLd + '(' + keywords.join('|') + '):([\\s\\S]+?)' + qRd,
        'g'
      )
    };
  keywords.forEach(function(key) {
    map[key] = {};
    map[key]['ld'] = LD + key + ':';
    map[key]['rd'] = RD;
  });
  return map;
})();

//"abc?__inline" return true
//"abc?__inlinee" return false
//"abc?a=1&__inline"" return true
function isInline(info) {
  return /[?&]__inline(?:[=&'"]|$)/.test(info.query);
}

//analyse [@require id] syntax in comment
function analyseComment(comment, callback) {
  var reg = /(@require\s+)('[^']+'|"[^"]+"|[^\s;!@#%^&*()]+)/g;
  callback = callback || function(m, prefix, value) {
    return prefix + map.require.ld + value + map.require.rd;
  };
  return comment.replace(reg, callback);
}

//expand javascript
//[@require id] in comment to require resource
//__inline(path) to embedd resource content or base64 encodings
//__uri(path) to locate resource
//require(path) to require resource
function extJs(content, callback) {
  var reg = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(\/\/[^\r\n\f]+|\/\*[\s\S]*?(?:\*\/|$))|\b(__inline|__uri|require)\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*\)/g;
  callback = callback || function(m, comment, type, value) {
    if (type) {
      switch (type) {
        case '__inline':
          m = map.jsEmbed.ld + value + map.jsEmbed.rd;
          break;
        case '__uri':
          m = map.uri.ld + value + map.uri.rd;
          break;
        case 'require':
          m = 'require(' + map.require.ld + value + map.require.rd + ')';
          break;
      }
    } else if (comment) {
      m = analyseComment(comment);
    }
    return m;
  };
  return content.replace(reg, callback);
}

//expand css
//[@require id] in comment to require resource
//[@import url(path?__inline)] to embed resource content
//url(path) to locate resource
//url(path?__inline) to embed resource content or base64 encodings
//src=path to locate resource
function extCss(content, callback) {
  var reg = /(\/\*[\s\S]*?(?:\*\/|$))|(?:@import\s+)?\burl\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^)}\s]+)\s*\)(\s*;?)|\bsrc\s*=\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|[^\s}]+)/g;
  callback = callback || function(m, comment, url, last, filter) {
    if (url) {
      var key = isInline(fis.util.query(url)) ? 'embed' : 'uri';
      if (m.indexOf('@') === 0) {
        if (key === 'embed') {
          m = map.embed.ld + url + map.embed.rd + last.replace(/;$/, '');
        } else {
          m = '@import url(' + map.uri.ld + url + map.uri.rd + ')' + last;
        }
      } else {
        m = 'url(' + map[key].ld + url + map[key].rd + ')' + last;
      }
    } else if (filter) {
      m = 'src=' + map.uri.ld + filter + map.uri.rd;
    } else if (comment) {
      m = analyseComment(comment);
    }
    return m;
  };
  return content.replace(reg, callback);
}

//expand html
//[@require id] in comment to require resource
//<!--inline[path]--> to embed resource content
//<img|embed|audio|video|link|object ... (data-)?src="path"/> to locate resource
//<img|embed|audio|video|link|object ... (data-)?src="path?__inline"/> to embed resource content
//<script|style ... src="path"></script|style> to locate js|css resource
//<script|style ... src="path?__inline"></script|style> to embed js|css resource
//<script|style ...>...</script|style> to analyse as js|css
function extHtml(content, callback) {
  var reg = /(<script(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(?=<\/script\s*>|$)|(<style(?:(?=\s)[\s\S]*?["'\s\w\/\-]>|>))([\s\S]*?)(?=<\/style\s*>|$)|<(img|embed|audio|video|link|object|source)\s+[\s\S]*?["'\s\w\/\-](?:>|$)|<!--inline\[([^\]]+)\]-->|<!--(?!\[)([\s\S]*?)(-->|$)/ig;
  callback = callback || function(m, $1, $2, $3, $4, $5, $6, $7, $8) {
    if ($1) { //<script>
      var embed = '';
      $1 = $1.replace(/(\s(?:data-)?src\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
        if (isInline(fis.util.query(value))) {
          embed += map.embed.ld + value + map.embed.rd;
          return '';
        } else {
          return prefix + map.uri.ld + value + map.uri.rd;
        }
      });
      if (embed) {
        //embed file
        m = $1 + embed;
      } else if (!/\s+type\s*=/i.test($1) || /\s+type\s*=\s*(['"]?)text\/javascript\1/i.test($1)) {
        //without attrubite [type] or must be [text/javascript]
        m = $1 + extJs($2);
      } else {
        //other type as html
        m = $1 + extHtml($2);
      }
    } else if ($3) { //<style>
      m = $3 + extCss($4);
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
            inline += map.embed.ld + value + map.embed.rd;
            if (isCssLink) {
              inline += '</style>';
            }
            return '';
          } else {
            return prefix + map.uri.ld + value + map.uri.rd;
          }
        });
        m = inline || m;
      } else if (tag === 'object') {
        m = m.replace(/(\sdata\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
          return prefix + map.uri.ld + value + map.uri.rd;
        });
      } else {
        m = m.replace(/(\s(?:data-)?src\s*=\s*)('[^']+'|"[^"]+"|[^\s\/>]+)/ig, function(m, prefix, value) {
          var key = isInline(fis.util.query(value)) ? 'embed' : 'uri';
          return prefix + map[key]['ld'] + value + map[key]['rd'];
        });
      }
    } else if ($6) {
      m = map.embed.ld + $6 + map.embed.rd;
    } else if ($7) {
      m = '<!--' + analyseComment($7) + $8;
    }
    return m;
  };
  return content.replace(reg, callback);
}

function process(file) {
  if (file.useParser !== false) {
    pipe(file, 'parser', file.ext);
  }
  if (file.rExt) {
    if (file.usePreprocessor !== false) {
      pipe(file, 'preprocessor', file.rExt);
    }
    if (file.useStandard !== false) {
      standard(file);
    }
    if (file.usePostprocessor !== false) {
      pipe(file, 'postprocessor', file.rExt);
    }
    if (exports.settings.lint && file.useLint !== false) {
      pipe(file, 'lint', file.rExt, true);
    }
    if (exports.settings.test && file.useTest !== false) {
      pipe(file, 'test', file.rExt, true);
    }
    if (exports.settings.optimize && file.useOptimizer !== false) {
      pipe(file, 'optimizer', file.rExt);
    }
  }
}

function pipe(file, type, ext, keep) {
  var key = type + ext;
  fis.util.pipe(key, function(processor, settings, key) {
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
  });
}

var embeddedMap = {};

function error(msg) {
  //for watching, unable to exit
  embeddedMap = {};
  fis.log.error(msg);
}

function embeddedCheck(main, embedded) {
  main = fis.file.wrap(main).realpath;
  embedded = fis.file.wrap(embedded).realpath;
  if (main === embedded) {
    error('unable to embed file[' + main + '] into itself.');
  } else if (embeddedMap[embedded]) {
    var next = embeddedMap[embedded],
      msg = [embedded];
    while (next && next !== embedded) {
      msg.push(next);
      next = embeddedMap[next];
    }
    msg.push(embedded);
    error('circular dependency on [' + msg.join('] -> [') + '].');
  }
  embeddedMap[embedded] = main;
  return true;
}

function embeddedUnlock(file) {
  delete embeddedMap[file.realpath];
}

function addDeps(a, b) {
  if (a && a.cache && b) {
    if (b.cache) {
      a.cache.mergeDeps(b.cache);
    }
    a.cache.addDeps(b.realpath || b);
  }
}

function standard(file) {
  var path = file.realpath,
    content = file.getContent();
  if (typeof content === 'string') {
    fis.log.debug('standard start');
    //expand language ability
    if (file.isHtmlLike) {
      content = extHtml(content);
    } else if (file.isJsLike) {
      content = extJs(content);
    } else if (file.isCssLike) {
      content = extCss(content);
    }
    content = content.replace(map.reg, function(all, type, value) {
      var ret = '',
        info;
      try {
        switch (type) {
          case 'require':
            info = fis.uri.getId(value, file.dirname);
            file.addRequire(info.id);
            ret = info.quote + info.id + info.quote;
            break;
          case 'uri':
            info = fis.uri(value, file.dirname);
            if (info.file && info.file.isFile()) {
              if (info.file.useHash && exports.settings.hash) {
                if (embeddedCheck(file, info.file)) {
                  exports(info.file);
                  addDeps(file, info.file);
                }
              }
              var query = (info.file.query && info.query) ? '&' + info.query.substring(1) : info.query;
              var url = info.file.getUrl(exports.settings.hash, exports.settings.domain);
              var hash = info.hash || info.file.hash;
              ret = info.quote + url + query + hash + info.quote;
            } else {
              ret = value;
            }
            break;
          case 'dep':
            if (file.cache) {
              info = fis.uri(value, file.dirname);
              addDeps(file, info.file);
            } else {
              fis.log.warning('unable to add deps to file [' + path + ']');
            }
            break;
          case 'embed':
          case 'jsEmbed':
            info = fis.uri(value, file.dirname);
            var f;
            if (info.file) {
              f = info.file;
            } else if (fis.util.isAbsolute(info.rest)) {
              f = fis.file(info.rest);
            }
            if (f && f.isFile()) {
              if (embeddedCheck(file, f)) {
                exports(f);
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
              }
            } else {
              fis.log.error('unable to embed non-existent file [' + value + ']');
            }
            break;
          default:
            fis.log.error('unsupported fis language tag [' + type + ']');
        }
      } catch (e) {
        embeddedMap = {};
        e.message = e.message + ' in [' + file.subpath + ']';
        throw e;
      }
      return ret;
    });
    file.setContent(content);
    fis.log.debug('standard end');
  }
}

exports.extJs = extJs;
exports.extCss = extCss;
exports.extHtml = extHtml;
exports.isInline = isInline;
exports.analyseComment = analyseComment;