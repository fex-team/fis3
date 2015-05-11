/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

/**
 * 将fis配置中glob表达的中${ ... }替换为config中相应的配置设置
 * @param  {String} value  glob表达式
 * @param  {Boolean} escape 是否需要转义
 * @return {String}        替换后的字符串
 */
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

/**
 * 将fis配置中glob表达中的替换表达式替换为对应在config.matches里面的值
 * @param  {String} value   glob串
 * @param  {Array} matches  对应的字符串分割组
 * @return {String}         处理后的字符串
 */
function replaceMatches(value, matches) {
  return value.replace(/\$(\d+|&)/g, function(all, $1) {
    var key = $1 === '&' ? '0' : $1;
    return matches.hasOwnProperty(key) ? (matches[key] || '') : all;
  });
}

/**
 * 替换属性值，递归按照replaceDefine和replaceNatches方式处理fis的配置对象
 * @param  {Object|String} source  配置对象，若传入其他类型变量直接返回source本身
 * @param  {Array} matches  对应的字符串分割组
 * @param  {Object} target  目标值
 * @return {Any}         若传入参数不为Object或者String，则返回source；否则返回为Object|Array之一
 */
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

/**
 * 对fis.config.roadmap下某类别属性的全部值进行replaceProperties处理
 * @param  {String} subpath 路径
 * @param  {String} path    roadmap下的属性，(path|ext|domain ...)
 * @param  {Object} obj     产出对象
 * @return {Object|Boolean}         若roadmap下没有对应的path则返回false，否则返回处理后的对象
 */
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

/**
 * fis.uri
 * @param  {String} path    路径
 * @param  {String} dirname 文件夹名
 * @return {Object}         { file, origin, quote, query, hash, rest, isFISID }
 */
var uri = module.exports = function(path, dirname) {
  var info = fis.util.stringQuote(path),
    qInfo = fis.util.query(info.rest);

  info.query = qInfo.query;
  info.hash = qInfo.hash;
  info.rest = qInfo.rest;

  if (info.rest) {
    path = info.rest;
    var config = fis.config.env();
    var nsConnector = config.get('namespaceConnector', ':');
    var idx = path.indexOf(nsConnector);
    var file;

    if (~idx) {
      info.isFISID = true;
      var ns = path.substring(0, idx);
      if (ns === config.get('namespace')) {
        file = fis.project.getProjectPath(path);
      }
    } else {
      if (path[0] === '/') {
        file = fis.project.getProjectPath(path);
      } else if (dirname) {
        file = fis.util(dirname, path);
      } else {
        fis.log.error('invalid dirname.');
      }
    }

    if (file && fis.util.isFile(file)) {
      info.file = fis.file(file);
    }
  }

  return info;
};

/**
 * 获取目录id表识
 * @param  {String} path    路径
 * @param  {String} dirname 文件夹
 * @return {Object}         { id, file, origin, quote, query, hash, rest, isFISID }
 */
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
