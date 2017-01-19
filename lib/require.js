/**
 * 用来加载 fis 插件。通过它来加载插件，会优先从本地安装的 node_modules 目录里面找，然后才是 global
 * 全局安装的 node_modules 里面找。
 *
 * @function require
 * @param {String} paths... 去掉 fis 前缀的包名字，可以以多个参数传进来，多个参数会自动通过 `-` 符号连接起来。
 * @memberOf fis
 * @example
 * // 查找顺序
 * // local: fis3-parser-sass
 * // local: fis-parser-sass
 * // global: fis3-parser-sass
 * // global: fis-parser-sass
 * fis.require('parser-sass');
 * @property {Array} prefixes 用来配置 fis.require 前缀的查找规则的。默认：['fis3', 'fis']。
 * @property {Object} _cache 用来缓存模块加载，避免重复查找。
 */
var slice = [].slice;
var flag = false;
var path = require('path');
var fs = require('fs');
var _ = require('./util.js');
var isFile = _.isFile;
var readFileSync = fs.readFileSync;

var exports = module.exports = function() {
  var name = slice.call(arguments, 0).join('-');
  if (exports._cache.hasOwnProperty(name)) return exports._cache[name];

  // 第一次调用的时候做兼容处理老的一些用法。
  if (!flag) {
    flag = true;
    var global = fis.get('system.globalNPMFolder');

    if (global) {
      fis.log.warn('fis.set(\'system.globalNPMFolder\') is deprecated, please set fis.require.paths instead.');
      exports.paths.push(global);
    }

    var local = fis.get('system.localNPMFolder');

    if (local) {
      fis.log.warn('fis.set(\'system.localNPMFolder\') is deprecated, please set fis.require.paths instead.');

      exports.paths.unshift(local);
    }

    // 去重
    exports.paths = exports.paths.filter(function(item, idx, arr) {

      if (!/node_modules$/.test(item)) {
        fis.log.warn('The path `%s` in fis.require.paths is not end with `node_modules`, and it will be skipped.', item);
        return false;
      }


      return arr.indexOf(item) === idx;
    });

    if (!exports.paths.length) {
      exports.paths = [path.join(path.dirname(__dirname), 'node_modules')];
    }
  }

  var resolved = null;
  var paths = gatherAvailableNodePaths(exports.paths);
  var prefixes = exports.prefixes;
  var names = prefixes.map(function(prefix) {
    return prefix + '-' + name;
  });

  paths.every(function(dir) {
    names.every(function(name) {
      var ret = loadAsFileSync(path.join(dir, '/', name)) || loadAsDirectorySync(path.join(dir, '/', name));

      if (ret) {
        resolved = ret;
      }

      return !resolved;
    });

    return !resolved;
  });

  if (!resolved) {

    // 特殊处理 fis-parser-less
    if (name === 'parser-less') {
      names = ['fis-parser-less'];
    }

    fis.log.error('unable to load plugin [%s]', names.join('] or ['));
  }

  fis.log.debug('Resolved module %s to %s', name, resolved);
  return exports._cache[name] = require(resolved);
};

exports.paths = [];
exports._cache = {};
exports.prefixes = ['fis3', 'fis'];
exports.extensions = ['.js'];

function gatherAvailableNodePaths(paths) {
  paths = paths.concat();
  var start = paths.pop();
  var node_modules = paths.concat();

  var prefix = '/';
  if (/^([A-Za-z]:)/.test(start)) {
    prefix = '';
  } else if (/^\\\\/.test(start)) {
    prefix = '\\\\';
  }
  var splitRe = process.platform === 'win32' ? /[\/\\]/ : /\/+/;

  // ensure that `start` is an absolute path at this point,
  // resolving againt the process' current working directory
  start = path.resolve(start);

  var parts = start.split(splitRe);

  var dirs = [];
  for (var i = parts.length - 1; i >= 0; i--) {
    if (parts[i] === 'node_modules') continue;

    dirs = dirs.concat(
      prefix + path.join(
        path.join.apply(path, parts.slice(0, i + 1)),
        'node_modules'
      )
    );
  }

  if (process.platform === 'win32') {
    dirs[dirs.length - 1] = dirs[dirs.length - 1].replace(":", ":\\");
  }

  return node_modules.concat(dirs);
}

function loadAsFileSync(x) {
  if (isFile(x)) {
    return x;
  }

  var extensions = exports.extensions;
  for (var i = 0; i < extensions.length; i++) {
    var file = x + extensions[i];
    if (isFile(file)) {
      return file;
    }
  }
}

function loadAsDirectorySync(x) {
  var pkgfile = path.join(x, '/package.json');
  if (isFile(pkgfile)) {
    var body = readFileSync(pkgfile, 'utf8');
    try {
      var pkg = JSON.parse(body);
      if (pkg.main) {
        var m = loadAsFileSync(path.resolve(x, pkg.main));
        if (m) return m;
        var n = loadAsDirectorySync(path.resolve(x, pkg.main));
        if (n) return n;
      }
    } catch (err) {}
  }

  return loadAsFileSync(path.join(x, '/index'));
}
