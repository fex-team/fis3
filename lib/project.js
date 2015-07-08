'use strict';
var _ = require('./util.js');
var glob = require('glob');
var path = require('path');

/**
 * fis 项目相关
 * @namespace fis.project
 */

exports.DEFAULT_REMOTE_REPOS = 'http://fis.baidu.com/repos';

/**
 * 获取项目目录中，需要编译的文件集合，返回格式为对象，`key` 为文件基于项目目录的绝对路径， `value` 为文件对象。
 *
 * 当前 media 环境下面设置有 `project.files` 列表时，走 {@link fis.project.getSourceByPatterns}， 否则兼容 fis 2 中
 * 的用法，基于 `project.include` 和 `fis.exclude` 走 {@link fis.util.find} 查找。
 *
 * @name getSource
 * @function
 * @memberOf fis.project
 */
exports.getSource = function() {
  var patterns = fis.media().get('project.files');

  if (patterns && patterns.length) {
    return exports.getSourceByPatterns(patterns);
  }

  var root = exports.getProjectPath(),
    source = {},
    project_exclude = /^(\/output\b|\/fis-[^\/]+)$/,
    include = fis.config.get('project.include'),
    exclude = fis.config.get('project.exclude');
  if (fis.util.is(exclude, 'Array')) {
    project_exclude = [project_exclude].concat(exclude);
  } else if (exclude) {
    project_exclude = [project_exclude, exclude];
  }
  fis.util.find(root, include, project_exclude, root).forEach(function(file) {
    // 产生对应的 File对象
    file = fis.file(file);
    if (file.release) {
      source[file.subpath] = file;
    }
  });
  return source;
};

/**
 * 返回项目目录下符合检索规则的文件。以 `project.files` 为匹配规则，`project.ignore` 为排除规则进行检索
 * @param  {String} patterns 匹配规则，glob文法
 * @param  {Object} opts     配置 @see glob.sync options
 * @return {Object}          返回
 * @memberOf fis.project
 * @name getSourceByPatterns
 */
exports.getSourceByPatterns = function(patterns, opts) {
  patterns = patterns || fis.media().get('project.files');

  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }

  opts = _.assign({
    cwd: exports.getProjectPath(),
    matchBase: true,
    ignore: fis.media().get('project.ignore', []).map(function(pattern) {
      return pattern[0] === '/' ? pattern.substring(1) : pattern;
    })
  }, opts || {});

  opts.nodir = true;
  opts.sync = true;

  var ret = [];
  var source = {};

  patterns.forEach(function(pattern, index) {
    var exclude = pattern.substring(0, 1) === '!';

    if (exclude) {
      pattern = pattern.substring(1);

      // 如果第一个规则就是排除用法，都没有获取结果就排除，这是不合理的用法。
      // 不过为了保证程序的正确性，在排除之前，通过 `**` 先把所有文件获取到。
      // 至于性能问题，请用户使用时规避。
      (index === 0) && (ret = glob.sync('**', opts));
    }

    // glob 列文件规则带 / 表现不对。
    pattern[0] === '/' && (pattern = pattern.substring(1));

    var mathes = glob.sync(pattern, opts);

    ret = _[exclude ? 'difference' : 'union'](ret, mathes);
  });

  ret.forEach(function(file) {
    file = fis.file(opts.cwd, file);
    if (file.release) {
      source[file.subpath] = file;
    }
  });
  return source;
};

//paths
var PROJECT_ROOT;
var TEMP_ROOT;

/*
 * 返回由 root 和 args 拼接成的标准路径。
 * @param  {String} root rootPath
 * @param  {String|Array} args 后续路径
 * @return {String}      标准路径格式
 * @example
 *   getPath('/Users/', ['apple', '/someone/', '/Destop/']) === getPath('/Users/', 'apple/someone//Destop/')
 *   /Users/apple/someone/Destop
 */
function getPath(root, args) {
  if (args && args.length > 0) {
    args = root + '/' + Array.prototype.join.call(args, '/');
    return fis.util(args);
  } else {
    return fis.util(root);
  }
}

/*
 * 初始化文件夹
 * @param  {String} path  文件夹路径
 * @param  {String} title
 * @return {String}       若文件夹已存在返回其觉得对路径，若不存在新建病返回绝对路径，若为文件则打印错误信息，返回path绝对路径
 */
function initDir(path, title) {
  if (fis.util.exists(path)) {
    if (!fis.util.isDir(path)) {
      fis.log.error('unable to set path[%s] as %s directory.', path, title);
    }
  } else {
    fis.util.mkdir(path);
  }
  path = fis.util.realpath(path);
  if (path) {
    return path;
  } else {
    fis.log.error('unable to create dir [%s] for %s directory.', path, title);
  }
}

/**
 * 获取项目所在目录。
 * 注意：返回的文件路径，已经被 normalize 了。
 * @param {String} [subpath] 如果指定了子目录，将返回子目录路径。
 * @return {String}
 * @function
 * @memberOf fis.project
 * @name getProjectPath
 */
exports.getProjectPath = function() {
  if (PROJECT_ROOT) {
    return getPath(PROJECT_ROOT, arguments);
  } else {
    fis.log.error('undefined project root');
  }
};

/**
 * 设置项目根目录
 * @param {String} path 项目根目录
 * @function
 * @memberOf fis.project
 * @name setProjectRoot
 */
exports.setProjectRoot = function(path) {
  if (fis.util.isDir(path)) {
    PROJECT_ROOT = fis.util.realpath(path);
  } else {
    fis.log.error('invalid project root path [%s]', path);
  }
};

/**
 * 设置并创建临时文件夹
 * @param {String} tmp 临时文件夹路径
 * @function
 * @memberOf fis.project
 * @name setTempRoot
 */
exports.setTempRoot = function(tmp) {
  TEMP_ROOT = initDir(tmp);
};

/**
 * 获取临时文件夹路径，若未手动设置，则遍历用户环境变量中['FIS_TEMP_DIR', 'LOCALAPPDATA', 'APPDATA', 'HOME']这几项是否有设置，有则作为临时目录path，没有则以fis3/.fis-tmp作为临时文件夹
 * @return {String}
 * @function
 * @memberOf fis.project
 * @name getTempPath
 */
exports.getTempPath = function() {
  if (!TEMP_ROOT) {
    var list = ['FIS_TEMP_DIR', 'LOCALAPPDATA', 'APPDATA', 'HOME'];
    var name = fis.cli && fis.cli.name ? fis.cli.name : 'fis';
    var tmp;
    for (var i = 0, len = list.length; i < len; i++) {
      if ((tmp = process.env[list[i]])) {
        break;
      }
    }
    tmp = tmp || __dirname + '/../';
    exports.setTempRoot(tmp + '/.' + name + '-tmp');
  }
  return getPath(TEMP_ROOT, arguments);
};

/**
 * 获取对应缓存的文件路径，缓存存放在 TEMP_ROOT/cache 下
 * @return {String} 对应缓存的路径
 * @function
 * @memberOf fis.project
 * @name getCachePath
 */
exports.getCachePath = function() {
  return getPath(exports.getTempPath('cache'), arguments);
};

/**
 * 根据路径查找路径，支持相对路径和基于项目文件夹的绝对路径。
 *
 * @param  {string} path 文件路径。
 * @param  {File} file 文件对象，当路径为相对路径时，此文件对象所在目录将用于查找目标文件。
 * @return {Object}      返回查找结果对象。
 * @function
 * @memberOf fis.project
 * @name lookup
 */
exports.lookup = function(path, file) {
  var info = fis.uri(path, file ? file.dirname : exports.getProjectPath());

  /**
   * 当查找文件时派送, 可以扩展 fis 默认的查找文件功能。如：支持无后缀文件查找，支持 components 文件查找。
   * @event lookup:file
   * @property {Object} info 包含查找路径信息。
   * @property {File} file 文件对象。
   * @memberOf fis
   */
  fis.emit('lookup:file', info, file);
  if (!info.id) {
    info.id = info.file ? info.file.id : info.rest;
  }

  if (!info.moduleId) {
    info.moduleId = info.file && info.file.moduleId || info.id;
  }

  return info;
};

var mediaName;

/**
 * 返回当前用户所在的 media 名称。
 * @return {String} 当前用户所在分支
 * @function
 * @memberOf fis.project
 * @name currentMedia
 */
exports.currentMedia = function (value) {
  if (arguments.length) {
    mediaName = value;
  }

  return mediaName || 'dev';
};
