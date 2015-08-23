'use strict';

var hookLoaded = false;
var _ = require('./util.js');

var onCompileStart, onCompileEnd;

/**
 * fis 整体编译入口。
 * @param {Object} opt 配置项
 * @param {Array} [opt.srcCache] 需要编译的文件列表，当没有填写时，fis 将通过 {@link fis.project.getSource}() 获取
 * @param {Callback} [opt.beforeEach] 编译开始前执行的回调函数，无论走缓存与否。
 * @param {Callback} [opt.afterEach] 编译完成后执行的回调函数，无论走缓存与否。
 * @param {Callback} [opt.beforeCompile] 编译开始前执行，当采用缓存时不执行。
 * @param {Callback} [opt.afterCompile] 编译完成后执行，当采用缓存时不执行。
 * @param {Callback} [opt.beforeCacheRevert] 在缓存被应用到文件对象前执行。
 * @param {Callback} [opt.afterCacheRevert] 在缓存被应用到文件对象后执行。
 * @param {Callback} callback 当整体编译完成后执行。
 * @function
 * @memberOf fis
 * @name release
 */
var exports = module.exports = function(opt, callback) {
  if (typeof opt === 'function') {
    callback = opt;
    opt = {};
  } else {
    opt = opt || {};
  }

  var src = {};
  if (Array.isArray(opt.srcCache) && opt.srcCache.length) {
    opt.srcCache.forEach(function(path) {
      if (!fis.util.isFile(path)) return;

      var file = fis.file(path);
      if (file.release) {
        src[file.subpath] = file;
      }
    });
  } else {
    src = fis.project.getSource();
  }
  var ret = {
    src: src,
    ids: {},
    pkg: {},
    map: {
      res: {},
      pkg: {}
    }
  };

  // 通过 env 的配置来决定。
  var config = fis.media();
  fis.compile.setup(opt);

  // load hooks
  hookLoaded || (fis.util.pipe('hook', function(processor, settings) {
    processor(fis, settings);
  }), hookLoaded = true);

  fis.emit('release:start', ret);
  var compiled = {};
  var resourceMapFiles = [];

  //@TODO
  function collect(file) {
    if (file.release && file.useMap) {
      //add resource map
      var id = file.getId();
      ret.ids[id] = file;
      if (file.useSameNameRequire) {
        if (file.isJsLike) {
          file.addSameNameRequire('.css');
        } else if (file.isHtmlLike) {
          file.addSameNameRequire('.js');
          file.addSameNameRequire('.css');
        }
      }
      var res = file.map = ret.map.res[id] = {
        uri: file.getUrl(),
        type: file.rExt.replace(/^\./, '')
      };
      for (var key in file.extras) {
        if (file.extras.hasOwnProperty(key)) {
          res.extras = file.extras;
          break;
        }
      }
      if (file.requires && file.requires.length) {
        res.deps = file.requires;
      }
    }
    if (file._isResourceMap) {
      resourceMapFiles.push(file); // the resource map file is special
    }
  }

  onCompileStart && fis.removeListener('compile:start', onCompileStart);
  fis.on('compile:start', (onCompileStart = function(file) {
    compiled[file.subpath] = file;
    opt.beforeEach && opt.beforeEach(file, ret);
  }));

  onCompileEnd && fis.removeListener('compile:end', onCompileEnd);
  fis.on('compile:end', (onCompileEnd = function(file) {
    opt.afterEach && opt.afterEach(file, ret);
    collect(file);

    // 兼容 fis2 中的用法
    if (file.extras && file.extras.derived) {
      file.derived = file.derived.concat(file.extras.derived);
      delete file.extras.derived;
    }

    if (!file.derived || !file.derived.length) {
      return;
    }

    file.derived.forEach(function(obj) {
      obj.__proto__ = file.__proto__;
      compiled[obj.subpath] = obj;
      obj.defineLikes();

      opt.beforeEach && opt.beforeEach(obj);
      opt.afterEach && opt.afterEach(obj, ret);
      collect(obj);
    });
  }));

  var beginning = ret.src;
  ret.src = compiled;
  fis.util.map(beginning, function(subpath, file) {
    file = fis.compile(file);
  });

  //project root
  var root = fis.project.getProjectPath();

  //get pack config
  var conf = config.get('pack');
  if (typeof conf === 'undefined') {
    //from fis-pack.json
    var file = root + '/fis-pack.json';
    if (fis.util.isFile(file)) {
      fis.config.set('pack', conf = fis.util.readJSON(file));
    }
  }

  if (typeof conf === 'undefined') {
    conf = buildPack(ret);
  }

  // package callback
  var cb = function(packager, settings, key, type) {
    fis.log.debug('[' + key + '] start');
    fis.emit(type, ret, conf, opt);
    packager(ret, conf, settings, opt);
    fis.log.debug('[' + key + '] end');
  };

  var packager = _.applyMatches('::package', fis.media().getSortedMatches());

  ['prepackager', 'packager', 'spriter', 'postpackager'].forEach(function(name) {

    if (packager[name]) {
      // fis.match 中配置的优先，所以，这里直接覆盖就行了。
      fis.media().set('modules.' + name, packager[name]);
    }

    fis.util.pipe(name, cb, opt[name]);
  });

  // filling the resource map file, resourceMapFile is a reference file object
  resourceMapFiles.forEach(function(file) {
    file.setContent(
      file.getContent()
      .replace(
        /\b__RESOURCE_MAP__\b/g,
        JSON.stringify(ret.map, null, file.optimizer ? null : 4)
      )
    );
  });
  fis.emit('release:end', ret);

  //done
  if (callback) {
    callback(ret);
  }
};

/*
 * 根据用户配置的 fis.match 生成 pack 表。
 */
function buildPack(ret) {
  var src = ret.src;
  var pack = {};

  Object.keys(src).forEach(function(subpath) {
    var file = src[subpath];
    var packTo = file.packTo;

    if (!packTo || file.release === false || file.isPartial) {
      return;
    }

    pack[packTo] = pack[packTo] || [];
    pack[packTo].push(file.subpath);
  });

  return pack;
}
