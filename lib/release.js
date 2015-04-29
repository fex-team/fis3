/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

/**
 * @type {Function}
 * @param {Object} [opt]
 * @param {Function} callback
 * opt = {
 *     include : {RegExp} find include filter,
 *     exclude : {RegExp} find exclude filter,
 *     debug    : {Boolean} debug model,
 *     beforeEach : {Function} before compile each file callback,
 *     afterEach : {Function} after compile each file callback,
 *     beforePack : {Function} before pack file callback,
 *     afterPack : {Function} after pack file callback
 * }
 */

var pluginLoaded = false;
var _ = require('./util.js');

var exports = module.exports = function(opt, callback) {
  if (typeof opt === 'function') {
    callback = opt;
    opt = {};
  } else {
    opt = opt || {};
  }

  var ret = {
    src: _.isEmpty(opt.srcCache) ? fis.project.getSource() : opt.srcCache,
    ids: {},
    pkg: {},
    map: {
      res: {},
      pkg: {}
    }
  };

  // 通过 env 的配置来决定。
  var config = fis.env();
  fis.compile.setup(opt);

  // load plugins
  pluginLoaded || (fis.util.pipe('plugin', function(processor, settings) {
    processor(fis, settings);
  }), pluginLoaded = true);

  fis.emit('release:start', ret);
  var compiled = {};

  function collect(file) {
    if (file.release && file.useMap) {
      //add resource map
      var id = file.getId();
      ret.ids[id] = file;
      if (file.isJsLike) {
        file.addSameNameRequire('.css');
      } else if (file.isHtmlLike) {
        file.addSameNameRequire('.js');
        file.addSameNameRequire('.css');
      }
      var res = ret.map.res[id] = {
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
  }

  fis.on('compile:start', function(file) {
    compiled[file.subpath] = file;
    opt.beforeEach && opt.beforeEach(file, ret);
  });

  fis.on('compile:end', function(file) {
    opt.afterEach && opt.afterEach(file, ret);
    collect(file);

    if (!file.derived || !file.derived.length) {
      return;
    }

    file.derived.forEach(function(obj) {
      obj.__proto__ = file.__proto__;
      compiled[file.subpath] = obj;
      opt.beforeEach && opt.beforeEach(obj);
      opt.afterEach && opt.afterEach(obj, ret);
      collect(obj);
    });
  });
  var begining = ret.src;
  ret.src = compiled;
  fis.util.map(begining, function(subpath, file) {
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

  // prepackage
  fis.util.pipe('prepackager', cb, opt.prepackager);

  // package
  fis.util.pipe('packager', cb, opt.packager);
  // css sprites
  fis.util.pipe('spriter', cb, opt.spriter);

  // postpackage
  fis.util.pipe('postpackager', cb, opt.postpackager);

  // create map.json
  var ns = config.get('namespace');
  var map = fis.file(root, (ns ? ns + '-' : '') + fis.get('mapName', 'map.json'));
  if (map.release) {
    map.setContent(JSON.stringify(ret.map, null, map.optimize ? null : 4));
    ret.pkg[map.subpath] = map;
  }

  fis.emit('release:end', ret);

  //done
  if (callback) {
    callback(ret);
  }
};

function buildPack(ret) {
  var pack = {};
  var keys = Object.keys(ret.src);

  keys.forEach(function(subpath) {
    var file = ret.src[subpath];

    if (file.packTo) {
      pack[file.packTo] = pack[file.packTo] || [];
      pack[file.packTo].push(file.subpath);
    }
  });

  return pack;
}
