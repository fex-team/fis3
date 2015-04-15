/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var _ = require('./util.js');
var glob = require('glob');

exports.DEFAULT_REMOTE_REPOS = 'http://fis.baidu.com/repos';

exports.getSource = function() {
  var parttens = fis.config.get('project.files');

  if (parttens && parttens.length) {
    return exports.getSourceByParttens(parttens);
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
    file = fis.file(file);
    if (file.release) {
      source[file.subpath] = file;
    }
  });
  return source;
};

exports.getSourceByParttens = function(parttens) {
  parttens = parttens || fis.config.get('project.files');

  if (!Array.isArray(parttens)) {
    parttens = [parttens];
  }

  var opts = {
    sync: true,
    cwd: exports.getProjectPath(),
    nodir: true,
    matchBase: true
  };

  var ret = [];
  var source = {};

  parttens.forEach(function(pattern) {
    var exclude = pattern.substring(0, 1) === '!';

    if (exclude) {
      pattern = pattern.substring(1);
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

function getPath(root, args) {
  if (args && args.length > 0) {
    args = root + '/' + Array.prototype.join.call(args, '/');
    return fis.util(args);
  } else {
    return fis.util(root);
  }
}

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

exports.getProjectPath = function() {
  if (PROJECT_ROOT) {
    return getPath(PROJECT_ROOT, arguments);
  } else {
    fis.log.error('undefined project root');
  }
};

exports.setProjectRoot = function(path) {
  if (fis.util.isDir(path)) {
    PROJECT_ROOT = fis.util.realpath(path);
  } else {
    fis.log.error('invalid project root path [' + path + ']');
  }
};

exports.setTempRoot = function(tmp) {
  TEMP_ROOT = initDir(tmp);
};

exports.getTempPath = function() {
  if (!TEMP_ROOT) {
    var list = ['FIS_TEMP_DIR', 'LOCALAPPDATA', 'APPDATA', 'HOME'];
    var name = fis.cli && fis.cli.name ? fis.cli.name : 'fis';
    var tmp;
    for (var i = 0, len = list.length; i < len; i++) {
      if (tmp = process.env[list[i]]) {
        break;
      }
    }
    tmp = tmp || __dirname + '/../';
    exports.setTempRoot(tmp + '/.' + name + '-tmp');
  }
  return getPath(TEMP_ROOT, arguments);
};

exports.getCachePath = function() {
  return getPath(exports.getTempPath('cache'), arguments);
};

exports.lookup = function(path, file) {
  var info = fis.uri(path, file ? file.dirname : exports.getProjectPath());

  // 丢给插件去处理。
  fis.emitter.emit('lookup:file', info, file);

  if (!info.id) {
    info.id = info.file ? info.file.id : info.rest;
  }

  if (!info.moduleId) {
    info.moduleId = info.file ? info.file.moduleId : info.id;
  }

  return info;
};
