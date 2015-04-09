/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

function replaceDefine(value, escape) {
  return value.replace(/\$\{([^\}]+)\}/g, function(all, $1) {
    var val = fis.config.get($1);
    if (typeof val === 'undefined') {
      fis.log.error('undefined property [' + $1 + '].');
    } else {
      return escape ? fis.util.escapeReg(val) : val;
    }
    return all;
  });
}

function replaceMatches(value, matches) {
  return value.replace(/\$(\d+|&)/g, function(all, $1) {
    var key = $1 === '&' ? '0' : $1;
    return matches.hasOwnProperty(key) ? (matches[key] || '') : all;
  });
}

function replaceProperties(source, matches, target) {
  var type = typeof source;
  if (type === 'object') {
    if (fis.util.is(source, 'Array')) {
      target = target || [];
    } else {
      target = target || {};
    }
    fis.util.map(source, function(key, value) {
      target[key] = replaceProperties(value, matches);
    });
    return target;
  } else if (type === 'string') {
    return replaceDefine(replaceMatches(source, matches));
    // TODO support function type
    //    } else if(type === 'function'){
    //        return source(subpath || target.subpath, matches);
  } else {
    return source;
  }
}

function roadmap(subpath, path, obj) {
  var map = fis.config.get('roadmap.' + path, []);
  for (var i = 0, len = map.length; i < len; i++) {
    var opt = map[i],
      reg = opt.reg;
    if (reg) {
      if (typeof reg === 'string') {
        reg = fis.util.glob(replaceDefine(reg, true));
      } else if (!fis.util.is(reg, 'RegExp')) {
        fis.log.error('invalid regexp [' + reg + '] of [roadmap.' + path + '.' + i + ']');
      }
      var matches = subpath.match(reg);
      if (matches) {
        obj = obj || {};
        replaceProperties(opt, matches, obj);
        delete obj.reg;
        return obj;
      }
    } else {
      fis.log.error('[roadmap.' + path + '.' + i + '] missing property [reg].');
    }
  }
  return false;
}

var uri = module.exports = function(path, dirname) {
  var info = fis.util.stringQuote(path),
    qInfo = fis.util.query(info.rest);
  info.query = qInfo.query;
  info.hash = qInfo.hash;
  info.rest = qInfo.rest;
  if (info.rest) {
    path = info.rest;
    if (path.indexOf(':') === -1) {
      var file;
      if (path[0] === '/') {
        file = fis.project.getProjectPath(path);
      } else if (dirname) {
        file = fis.util(dirname, path);
      } else {
        fis.log.error('invalid dirname.');
      }
      if (file && fis.util.isFile(file)) {
        info.file = fis.file(file);
      }
    }
  }

  return info;
};

uri.getId = function(path, dirname) {
  var info = uri(path, dirname);
  if (info.file) {
    info.id = info.file.getId();
  } else {
    info.id = info.rest;
  }
  return info;
};

uri.replaceDefine = replaceDefine;
uri.replaceMatches = replaceMatches;
uri.replaceProperties = replaceProperties;
uri.roadmap = roadmap;
