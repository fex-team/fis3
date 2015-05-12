/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var _ = require('./util.js');
var glob = require('glob');

exports.DEFAULT_REMOTE_REPOS = 'http://fis.baidu.com/repos';

/**
 * 获取项目目录下符合配置检索标准的文件，config中若配置了project.files(默认配置为['**'])，则使用该检索规则检索；
 * project.files被强制声明为空，则使用project.include和project.exclude进行检索，同时一定不检索output*和fis-*
 * @return {Object} 项目目录下符合检索标准的文件及相应的fis File对象
 */
exports.getSource = function() {
  var patterns = fis.env().get('project.files');

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
 * 返回项目目录下符合检索规则的文件。以project.files为匹配规则，project.ignore为排除规则进行检索
 * @param  {String} patterns 匹配规则，glob文法
 * @param  {Object} opts     配置 @see glob.sync options
 * @return {Object}          返回
 */
exports.getSourceByPatterns = function(patterns, opts) {
  patterns = patterns || fis.env().get('project.files');

  if (!Array.isArray(patterns)) {
    patterns = [patterns];
  }

  opts = _.assign({
    cwd: exports.getProjectPath(),
    matchBase: true,
    ignore: fis.env().get('project.ignore')
  }, opts || {});

  opts.nodir = true;
  opts.sync = true;

  var ret = [];
  var source = {};

  patterns.forEach(function(pattern, index) {
    var exclude = pattern.substring(0, 1) === '!';

    if (exclude) {
      pattern = pattern.substring(1);
      (index === 0) && (ret = glob.sync('**', opts)); // 这里暂时这么修改，处理第一个match为！模式的情况。需要多次调用glob，性能较差
    }

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

/**
 * 返回由root和args拼接成的标准路径
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

/**
 * 初始化文件夹
 * @param  {String} path  文件夹路径
 * @param  {String} title 
 * @return {String}       若文件夹已存在返回其觉得对路径，若不存在新建病返回绝对路径，若为文件则打印错误信息，返回path绝对路径
 */
function initDir(path, title) {
  if (fis.util.exists(path)) {
    if (!fis.util.isDir(path)) {
      fis.log.error('unable to set path[' + path + '] as ' + title + ' directory.');
    }
  } else {
    fis.util.mkdir(path);
  }
  path = fis.util.realpath(path);
  if (path) {
    return path;
  } else {
    fis.log.error('unable to create dir [' + path + '] for ' + title + ' directory.');
  }
}

/**
 * 若项目根目录已存在，则返回所需路径的绝对项目路径
 * @param {String|Array} 子目录路径
 * @return {String} 
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
 */
exports.setProjectRoot = function(path) {
  if (fis.util.isDir(path)) {
    PROJECT_ROOT = fis.util.realpath(path);
  } else {
    fis.log.error('invalid project root path [' + path + ']');
  }
};

/**
 * 设置并创建临时文件夹
 * @param {String} tmp 临时文件夹路径
 */
exports.setTempRoot = function(tmp) {
  TEMP_ROOT = initDir(tmp);
};

/**
 * 获取临时文件夹路径，若未手动设置，则遍历用户环境变量中['FIS_TEMP_DIR', 'LOCALAPPDATA', 'APPDATA', 'HOME']这几项是否有设置，有则作为临时目录path，没有则以fis3/.fis-tmp作为临时文件夹
 * @return {[type]} [description]
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
 */
exports.getCachePath = function() {
  return getPath(exports.getTempPath('cache'), arguments);
};

//@TODO
exports.lookup = function(path, file) {
  var info = fis.uri(path, file ? file.dirname : exports.getProjectPath());
  fis.emit('lookup:file', info, file);
  if (!info.id) {
    info.id = info.file ? info.file.id : info.rest;
  }

  if (!info.moduleId) {
    info.moduleId = info.file && info.file.moduleId || info.id;
  }

  return info;
};

/**
 * 返回当前用户所在的分支
 * @return {String} 当前用户所在分支
 */
exports.currentMedia = function () {
  return process.env.NODE_ENV || 'dev';
};
