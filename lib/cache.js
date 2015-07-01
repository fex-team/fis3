'use strict';
/**
 * Cache 构造器，在 fis 中主要用于缓存目标文件的编译信息和编译结果。
 *
 * @param {String} path 需要被缓存的文件路径。
 * @param {String} dir 缓存目录。
 * @inner
 * @class
 * @memberOf fis.cache
 */
var Cache = Object.derive(function(path, dir) {
  var file = fis.util.realpath(path);
  if (!fis.util.isFile(file)) {
    fis.log.error('unable to cache file[%s]: No such file.', path);
  }
  this.timestamp = fis.util.mtime(file).getTime();
  this.deps = {};
  this.version = fis.version;

  var info = fis.util.pathinfo(file);
  var basename = fis.project.getCachePath(dir, info.basename);
  var hash = fis.util.md5(file, 10);
  this.cacheFile = basename + '-c-' + hash + '.tmp';
  this.cacheInfo = basename + '-o-' + hash + '.json';
},

  /** @lends fis.cache~Cache.prototype */
  {

  /**
   * 保存内容以及信息。
   * @param  {String | Buffer} content 文件内容
   * @param  {Object} info 数据信息。
   */
  save: function(content, info) {
    var infos = {
      version: this.version,
      timestamp: this.timestamp,
      deps: this.deps,
      info: info
    };
    fis.util.write(this.cacheInfo, JSON.stringify(infos));
    fis.util.write(this.cacheFile, content);
  },

  /**
   * 从缓存目录中读取缓存内容。
   * @param  {Object} [file] 如果传入了此参数，从缓存文件中读取的内容将会赋值到 `file.content` 以及数据信息会被赋值到 `file.info`.
   * @return {Boolean} 返回 true, 如果缓存有效，否则返回 false.
   */
  revert: function(file) {
    fis.log.debug('revert cache');
    if (
      exports.enable && fis.util.exists(this.cacheInfo) && fis.util.exists(this.cacheFile)
    ) {
      fis.log.debug('cache file exists');
      var infos = fis.util.readJSON(this.cacheInfo);
      fis.log.debug('cache info read');
      if (infos.version == this.version && infos.timestamp == this.timestamp) {
        var deps = infos['deps'];
        for (var f in deps) {
          if (deps.hasOwnProperty(f)) {
            var d = fis.util.mtime(f);
            if (d == 0 || deps[f] != d.getTime()) {
              fis.log.debug('cache is expired');
              return false;
            }
          }
        }
        this.deps = deps;
        fis.log.debug('cache is valid');
        if (file) {
          file.info = infos.info;
          file.content = fis.util.fs.readFileSync(this.cacheFile);
        }
        fis.log.debug('revert cache finished');
        return true;
      }
    }
    fis.log.debug('cache is expired');
    return false;
  },

  /**
   * 添加依赖，依赖将会被用来判断缓存是否有效，依赖中，任何一个文件修改时间发生变化，缓存失效。
   * @param {String} filepath 依赖的文件路径。
   */
  addDeps: function(file) {
    var path = fis.util.realpath(file);
    if (path) {
      this.deps[path] = fis.util.mtime(path).getTime();
    } else {
      fis.log.warning('unable to add dependency file[' + file + ']: No such file.');
    }
    return this;
  },

  /**
   * 删除依赖。
   * @param {String} filepath 依赖的文件路径。
   */
  removeDeps: function(file) {
    var path = fis.util.realpath(file);
    if (path && this.deps[path]) {
      delete this.deps[path];
    }
    return this;
  },

  /**
   * 合并 cache 中的依赖列表。
   * @param {mixed} cache 此对象中的依赖会被合入到该事例依赖中。
   */
  mergeDeps: function(cache) {
    var deps = {};
    if (cache instanceof Cache) {
      deps = cache.deps;
    } else if (typeof cache === 'object') {
      deps = cache;
    } else {
      fis.log.error('unable to merge deps of data[%s]', cache);
    }
    fis.util.map(deps, this.deps, true);
  }
});

/**
 * 用来创建 ~Cache 对象， 更多细节请查看 {@link fis.cache~Cache ~Cache} 说明。
 *
 * @example
 * // 检查该文件是否启用缓存
 * if (file.useCache) {
 *
 *   // 如果启用，则创建 cache 对象
 *   file.cache = fis.cache(file.realpath, CACHE_DIR);
 *
 *   // 保存内容以及信息到缓存中。
 *   file.cache.save('body', {
 *     foo: 1
 *   });
 * }
 * @see {@link fis.cache~Cache Cache 类说明}
 * @param {String} path 需要被缓存的文件路径。
 * @param {String} dir 缓存目录。
 * @function
 * @namespace fis.cache
 */
var exports = module.exports = Cache.factory();

/**
 * 是否开启缓存。当设置为 false 后, fis 编译将不会启用缓存。
 * @type {Boolean}
 * @defaultValue true
 * @memberOf fis.cache
 * @name enable
 */
exports.enable = true;

/**
 * 指向 {@link fis.cache~Cache ~Cache 类}。
 * @see {@link fis.cache~Cache Cache 类说明}
 * @memberOf fis.cache
 * @name Cache
 */
exports.Cache = Cache;

/**
 * 清除缓存目录下面指定的目录。
 * @example
 *
 * // 当命令行中设置了 --clean 属性后，开始之前，先清除之前编译产生的缓存文件。
 * if (options.clean) {
 *   fis.cache.clean('compile');
 * }
 * @param  {String} name 需要清除的目录名
 * @memberOf fis.cache
 * @name clean
 * @function
 */
exports.clean = function(name) {
  name = name || '';
  var path = fis.project.getCachePath(name);
  if (fis.util.exists(path)) {
    fis.util.del(path);
  }
};
