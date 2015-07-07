'use strict';

/**
 * 基于路径查找文件，支持相对路径，基于项目的绝对路径以及 fis Id.
 *
 * @example
 * // 基于指定目录的相对路径文件查找。
 * var info = fis.uri('./index.js', root + '/static/');
 *
 * // 基于项目的绝对路径。
 * var info = fis.uri('/static/index.js');
 *
 * // 通过 fis Id 查找，不推荐，因为如果跨模块了，是读取不到文件的。
 * var info = fis.uri('common:static/index.js');
 * @param  {String} path    路径
 * @param  {String} dirname 文件夹名
 * @return {Object}         { file, origin, quote, query, hash, rest, isFISID }
 * @namespace fis.uri
 */
var uri = module.exports = function(path, dirname) {
  var info = fis.util.stringQuote(path),
    qInfo = fis.util.query(info.rest);

  info.query = qInfo.query;
  info.hash = qInfo.hash;
  info.rest = qInfo.rest;

  if (info.rest) {
    path = info.rest;
    var config = fis.media();
    var nsConnector = config.get('namespaceConnector', ':');
    var idx = path.indexOf(nsConnector);
    var file;

    if (~idx) {
      info.isFISID = true;
      var ns = path.substring(0, idx);
      if (ns === config.get('namespace')) {
        file = fis.project.getProjectPath(path);
      }
    } else  if (path[0] === '/') {
      file = fis.project.getProjectPath(path);
    } else if (dirname) {
      file = fis.util(dirname, path);
    } else if (!config.get('namespace')) {
      file = fis.project.getProjectPath(path);
      if (file && fis.util.isFile(file)) {
        info.isFISID = true;
      }
    } else {
      fis.log.error('invalid dirname.');
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
