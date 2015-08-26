'use strict';

var minimatch = require('minimatch');
var lodash = require('lodash');
var fs = require('fs'),
  pth = require('path'),
  crypto = require('crypto'),
  Url = require('url'),
  _exists = fs.existsSync || pth.existsSync,
  toString = Object.prototype.toString,
  iconv, tar;

var IS_WIN = process.platform.indexOf('win') === 0;

/*
 * 后缀类型HASH
 * @type {Array}
 */
var TEXT_FILE_EXTS = [
    'css', 'tpl', 'js', 'php',
    'txt', 'json', 'xml', 'htm',
    'text', 'xhtml', 'html', 'md',
    'conf', 'po', 'config', 'tmpl',
    'coffee', 'less', 'sass', 'jsp',
    'scss', 'manifest', 'bak', 'asp',
    'tmp', 'haml', 'jade', 'aspx',
    'ashx', 'java', 'py', 'c', 'cpp',
    'h', 'cshtml', 'asax', 'master',
    'ascx', 'cs', 'ftl', 'vm', 'ejs',
    'styl', 'jsx', 'handlebars'
  ],
  IMAGE_FILE_EXTS = [
    'svg', 'tif', 'tiff', 'wbmp',
    'png', 'bmp', 'fax', 'gif',
    'ico', 'jfif', 'jpe', 'jpeg',
    'jpg', 'woff', 'cur', 'webp',
    'swf', 'ttf', 'eot', 'woff2'
  ],
  MIME_MAP = {
    //text
    'css': 'text/css',
    'tpl': 'text/html',
    'js': 'text/javascript',
    'jsx': 'text/javascript',
    'php': 'text/html',
    'asp': 'text/html',
    'jsp': 'text/jsp',
    'txt': 'text/plain',
    'json': 'application/json',
    'xml': 'text/xml',
    'htm': 'text/html',
    'text': 'text/plain',
    'md': 'text/plain',
    'xhtml': 'text/html',
    'html': 'text/html',
    'conf': 'text/plain',
    'po': 'text/plain',
    'config': 'text/plain',
    'coffee': 'text/javascript',
    'less': 'text/css',
    'sass': 'text/css',
    'scss': 'text/css',
    'styl': 'text/css',
    'manifest': 'text/cache-manifest',
    //image
    'svg': 'image/svg+xml',
    'tif': 'image/tiff',
    'tiff': 'image/tiff',
    'wbmp': 'image/vnd.wap.wbmp',
    'webp': 'image/webp',
    'png': 'image/png',
    'bmp': 'image/bmp',
    'fax': 'image/fax',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'jfif': 'image/jpeg',
    'jpg': 'image/jpeg',
    'jpe': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'eot': 'application/vnd.ms-fontobject',
    'woff': 'application/font-woff',
    'ttf': 'application/octet-stream',
    'cur': 'application/octet-stream'
  };

function getIconv() {
  if (!iconv) {
    iconv = require('iconv-lite');
  }
  return iconv;
}

function getTar() {
  if (!tar) {
    tar = require('tar');
  }
  return tar;
}

/**
 * fis 中工具类操作集合。{@link https://lodash.com/ lodash} 中所有方法都挂载在此名字空间下面。
 * @param  {String} path
 * @return {String}
 * @example
 *   /a/b//c\d/ -> /a/b/c/d
 * @namespace fis.util
 */
var _ = module.exports = function(path) {
  var type = typeof path;
  if (arguments.length > 1) {
    path = Array.prototype.join.call(arguments, '/');
  } else if (type === 'string') {
    //do nothing for quickly determining.
  } else if (type === 'object') {
    path = Array.prototype.join.call(path, '/');
  } else if (type === 'undefined') {
    path = '';
  }
  if (path) {
    path = pth.normalize(path.replace(/[\/\\]+/g, '/')).replace(/\\/g, '/');
    if (path !== '/') {
      path = path.replace(/\/$/, '');
    }
  }
  return path;
};

// 将lodash内部方法的引用挂载到utils上，方便使用
lodash.assign(_, lodash);

_.is = function(source, type) {
  return toString.call(source) === '[object ' + type + ']';
};

/**
 * 对象枚举元素遍历，若merge为true则进行_.assign(obj, callback)，若为false则回调元素的key value index
 * @param  {Object}   obj      源对象
 * @param  {Function|Object} callback 回调函数|目标对象
 * @param  {Boolean}   merge    是否为对象赋值模式
 * @memberOf fis.util
 * @name map
 * @function
 */
_.map = function(obj, callback, merge) {
  var index = 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (merge) {
        callback[key] = obj[key];
      } else if (callback(key, obj[key], index++)) {
        break;
      }
    }
  }
};

/**
 * 固定长度字符前后缀填补方法(fillZero)
 * @param  {String} str  初始字符串
 * @param  {Number} len  固定长度
 * @param  {String} fill 填补的缀
 * @param  {Boolean} pre  前缀还是后缀
 * @return {String}      填补后的字符串
 * @memberOf fis.util
 * @name pad
 * @function
 */
_.pad = function(str, len, fill, pre) {
  if (str.length < len) {
    fill = (new Array(len)).join(fill || ' ');
    if (pre) {
      str = (fill + str).substr(-len);
    } else {
      str = (str + fill).substring(0, len);
    }
  }
  return str;
};

/**
 * 将target合并到source上，新值为undefiend一样会覆盖掉原有数据
 * @param  {Object} source 源对象
 * @param  {Object} target 目标对象
 * @return {Object}        合并后的对象
 * @memberOf fis.util
 * @name merge
 * @function
 */
_.merge = function(source, target) {
  if (_.is(source, 'Object') && _.is(target, 'Object')) {
    _.map(target, function(key, value) {
      source[key] = _.merge(source[key], value);
    });
  } else {
    source = target;
  }
  return source;
};

/**
 * clone一个变量
 * @param  {any} source 变量
 * @return {any}     clone值
 * @memberOf fis.util
 * @name clone
 * @function
 */
/*_.clone = function(source) {
  var ret;
  switch (toString.call(source)) {
    case '[object Object]':
      ret = {};
      _.map(source, function(k, v) {
        ret[k] = _.clone(v);
      });
      break;
    case '[object Array]':
      ret = [];
      source.forEach(function(ele) {
        ret.push(_.clone(ele));
      });
      break;
    default:
      ret = source;
  }
  return ret;
};*/

/**
 * 正则串编码转义
 * @param  {String} str 正则串
 * @return {String}     普通字符串
 * @memberOf fis.util
 * @name escapeReg
 * @function
 */
_.escapeReg = function(str) {
  return str.replace(/[\.\\\+\*\?\[\^\]\$\(\){}=!<>\|:\/]/g, '\\$&');
};

/**
 * shell命令编码转义
 * @param  {String}  命令
 * @memberOf fis.util
 * @name escapeShellCmd
 * @function
 */
_.escapeShellCmd = function(str) {
  return str.replace(/ /g, '"$&"');
};

/**
 * shell编码转义
 * @param  {String} 命令
 * @memberOf fis.util
 * @name escapeShellArg
 * @function
 */
_.escapeShellArg = function(cmd) {
  return '"' + cmd + '"';
};

/**
 * 提取字符串中的引号和一对引号包围的内容
 * @param  {String} str    待处理字符串
 * @param  {String} quotes 初始引号可选范围，缺省为[',"]
 * @return {Object}        {
 *                           origin: 源字符串
 *                           rest: 引号包围的文字内容
 *                           quote: 引号类型
 *                         }
 * @memberOf fis.util
 * @name stringQuote
 * @function
 */
_.stringQuote = function(str, quotes) {
  var info = {
    origin: str,
    rest: str = str.trim(),
    quote: ''
  };
  if (str) {
    quotes = quotes || '\'"';
    var strLen = str.length - 1;
    for (var i = 0, len = quotes.length; i < len; i++) {
      var c = quotes[i];
      if (str[0] === c && str[strLen] === c) {
        info.quote = c;
        info.rest = str.substring(1, strLen);
        break;
      }
    }
  }
  return info;
};

/**
 * 匹配文件后缀所属MimeType类型
 * @param  {String} ext 文件后缀
 * @return {String}     MimeType类型
 * @memberOf fis.util
 * @name getMimeType
 * @function
 */
_.getMimeType = function(ext) {
  if (ext[0] === '.') {
    ext = ext.substring(1);
  }
  return MIME_MAP[ext] || 'application/x-' + ext;
};

/**
 * 判断文件是否存在。
 * @param {String} filepath 文件路径。
 * @memberOf fis.util
 * @name exist
 * @function
 */
_.exists = _exists;
_.fs = fs;

/**
 * 返回path的绝对路径，若path不存在则返回false
 * @param  {String} path 路径
 * @return {String}      绝对路径
 * @memberOf fis.util
 * @name realpath
 * @function
 */
_.realpath = function(path) {
  if (path && _exists(path)) {
    path = fs.realpathSync(path);
    if (IS_WIN) {
      path = path.replace(/\\/g, '/');
    }
    if (path !== '/') {
      path = path.replace(/\/$/, '');
    }
    return path;
  } else {
    return false;
  }
};

/**
 * 多功能path处理
 * @param  {String} path 路径
 * @return {String}      处理后的路径
 * @memberOf fis.util
 * @name realpathSafe
 * @function
 */
_.realpathSafe = function(path) {
  return _.realpath(path) || _(path);
};

/**
 * 判断路径是否为绝对路径
 * @param  {String}  path 路径
 * @return {Boolean}      true为是
 * @memberOf fis.util
 * @name isAbsolute
 * @function
 */
_.isAbsolute = function(path) {
  if (IS_WIN) {
    return /^[a-z]:/i.test(path);
  } else {
    if (path === '/') {
      return true;
    } else {
      var split = path.split('/');
      if (split[0] === '~') {
        return true;
      } else if (split[0] === '' && split[1]) {
        return _.isDir('/' + split[1] + '/' + split[2]);
      } else {
        return false;
      }
    }
  }
};

/**
 * 是否为一个文件
 * @param  {String}  path 路径
 * @return {Boolean}      true为是
 * @memberOf fis.util
 * @name isFile
 * @function
 */
_.isFile = function(path) {
  return _exists(path) && fs.statSync(path).isFile();
};

/**
 * 是否为文件夹
 * @param  {String}  path 路径
 * @return {Boolean}      true为是
 * @memberOf fis.util
 * @name isDir
 * @function
 */
_.isDir = function(path) {
  return _exists(path) && fs.statSync(path).isDirectory();
};

/**
 * 获取路径最近修改时间
 * @param  {String} path 路径
 * @return {Date}      时间(GMT+0800)
 * @memberOf fis.util
 * @name mtime
 * @function
 */
_.mtime = function(path) {
  var time = 0;
  if (_exists(path)) {
    time = fs.statSync(path).mtime;
  }
  return time;
};

/**
 * 修改文件时间戳
 * @param  {String} path  路径
 * @param  {Date|Number} mtime 时间戳
 * @memberOf fis.util
 * @name touch
 * @function
 */
_.touch = function(path, mtime) {
  if (!_exists(path)) {
    _.write(path, '');
  }
  if (mtime instanceof Date) {
    //do nothing for quickly determining.
  } else if (typeof mtime === 'number') {
    var time = new Date();
    time.setTime(mtime);
    mtime = time;
  } else {
    fis.log.error('invalid argument [mtime]');
  }
  fs.utimesSync(path, mtime, mtime);
};

/**
 * 是否为windows系统
 * @return {Boolean}
 * @memberOf fis.util
 * @name isWin
 * @function
 */
_.isWin = function() {
  return IS_WIN;
};

/*
 * 生成对应文件类型判断的正则
 * @param  {String} type 文件类型
 * @return {RegExp}      对应判断的正则表达式
 */
function getFileTypeReg(type) {
  var map = [],
    ext = fis.config.get('project.fileType.' + type);
  if (type === 'text') {
    map = TEXT_FILE_EXTS;
  } else if (type === 'image') {
    map = IMAGE_FILE_EXTS;
  } else {
    fis.log.error('invalid file type [%s]', type);
  }
  if (ext && ext.length) {
    if (typeof ext === 'string') {
      ext = ext.split(/\s*,\s*/);
    }
    map = map.concat(ext);
  }
  map = map.join('|');
  return new RegExp('\\.(?:' + map + ')$', 'i');
}

/**
 * 是否为配置中的text文件类型
 * @param  {String}  path 路径
 * @return {Boolean}
 * @memberOf fis.util
 * @name isTextFile
 * @function
 */
_.isTextFile = function(path) {
  return getFileTypeReg('text').test(path || '');
};

/**
 * 是否为配置中的image文件类型
 * @param  {String}  path 路径
 * @return {Boolean}
 * @memberOf fis.util
 * @name isImageFile
 * @function
 */
_.isImageFile = function(path) {
  return getFileTypeReg('image').test(path || '');
};

/**
 * 按位数生成md5串
 * @param  {String|Buffer} data 数据源
 * @param  {Number} len  长度
 * @return {String}      md5串
 * @memberOf fis.util
 * @name md5
 * @function
 */
_.md5 = function(data, len) {
  var md5sum = crypto.createHash('md5'),
    encoding = typeof data === 'string' ? 'utf8' : 'binary';
  md5sum.update(data, encoding);
  len = len || fis.config.get('project.md5Length', 7);
  return md5sum.digest('hex').substring(0, len);
};

/**
 * 生成base64串
 * @param  {String|Buffer|Array} data 数据源
 * @return {String}      base64串
 * @memberOf fis.util
 * @name base64
 * @function
 */
_.base64 = function(data) {
  if (data instanceof Buffer) {
    //do nothing for quickly determining.
  } else if (data instanceof Array) {
    data = new Buffer(data);
  } else {
    //convert to string.
    data = new Buffer(String(data || ''));
  }
  return data.toString('base64');
};

/**
 * 递归创建文件夹
 * @param  {String} path 路径
 * @param  {Number} mode 创建模式
 * @memberOf fis.util
 * @name mkdir
 * @function
 */
_.mkdir = function(path, mode) {
  if (typeof mode === 'undefined') {
    //511 === 0777
    mode = 511 & (~process.umask());
  }
  if (_exists(path)) return;
  path.split('/').reduce(function(prev, next) {
    if (prev && !_exists(prev)) {
      fs.mkdirSync(prev, mode);
    }
    return prev + '/' + next;
  });
  if (!_exists(path)) {
    fs.mkdirSync(path, mode);
  }
};

/**
 * 字符串编码转换
 * @param  {String|Number|Array|Buffer} str      待处理的字符串
 * @param  {String} encoding 编码格式
 * @return {String}          编码转换后的字符串
 * @memberOf fis.util
 * @name toEncoding
 * @function
 */
_.toEncoding = function(str, encoding) {
  return getIconv().toEncoding(String(str), encoding);
};

/**
 * 判断Buffer是否为utf8
 * @param  {Buffer}  bytes 待检数据
 * @return {Boolean}       true为utf8
 * @memberOf fis.util
 * @name isUtf8
 * @function
 */
_.isUtf8 = function(bytes) {
  var i = 0;
  while (i < bytes.length) {
    if (( // ASCII
        0x00 <= bytes[i] && bytes[i] <= 0x7F
      )) {
      i += 1;
      continue;
    }

    if (( // non-overlong 2-byte
        (0xC2 <= bytes[i] && bytes[i] <= 0xDF) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF)
      )) {
      i += 2;
      continue;
    }

    if (
      ( // excluding overlongs
        bytes[i] == 0xE0 &&
        (0xA0 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      ) || ( // straight 3-byte
        ((0xE1 <= bytes[i] && bytes[i] <= 0xEC) ||
          bytes[i] == 0xEE ||
          bytes[i] == 0xEF) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      ) || ( // excluding surrogates
        bytes[i] == 0xED &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x9F) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF)
      )
    ) {
      i += 3;
      continue;
    }

    if (
      ( // planes 1-3
        bytes[i] == 0xF0 &&
        (0x90 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      ) || ( // planes 4-15
        (0xF1 <= bytes[i] && bytes[i] <= 0xF3) &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0xBF) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      ) || ( // plane 16
        bytes[i] == 0xF4 &&
        (0x80 <= bytes[i + 1] && bytes[i + 1] <= 0x8F) &&
        (0x80 <= bytes[i + 2] && bytes[i + 2] <= 0xBF) &&
        (0x80 <= bytes[i + 3] && bytes[i + 3] <= 0xBF)
      )
    ) {
      i += 4;
      continue;
    }
    return false;
  }
  return true;
};

/**
 * 处理Buffer编码方式
 * @param  {Buffer} buffer 待读取的Buffer
 * @return {String}        判断若为utf8可识别的编码则去掉bom返回utf8编码后的String，若不为utf8可是别编码则返回gbk编码后的String
 * @memberOf fis.util
 * @name readBuffer
 * @function
 */
_.readBuffer = function(buffer) {
  if (_.isUtf8(buffer)) {
    buffer = buffer.toString('utf8');
    if (buffer.charCodeAt(0) === 0xFEFF) {
      buffer = buffer.substring(1);
    }
  } else {
    buffer = getIconv().decode(buffer, 'gbk');
  }
  return buffer;
};

/**
 * 读取文件内容
 * @param  {String} path    路径
 * @param  {Boolean} convert 是否使用text方式转换文件内容的编码 @see readBuffer
 * @return {String}         文件内容
 * @memberOf fis.util
 * @name read
 * @function
 */
_.read = function(path, convert) {
  var content = false;
  if (_exists(path)) {
    content = fs.readFileSync(path);
    if (convert || _.isTextFile(path)) {
      content = _.readBuffer(content);
    }
  } else {
    fis.log.error('unable to read file[%s]: No such file or directory.', path);
  }
  return content;
};

/**
 * 写文件，若路径不存在则创建
 * @param  {String} path    路径
 * @param  {String} data    写入内容
 * @param  {String} charset 编码方式
 * @param  {Boolean} append  是否为追加模式
 * @memberOf fis.util
 * @name write
 * @function
 */
_.write = function(path, data, charset, append) {
  if (!_exists(path)) {
    _.mkdir(_.pathinfo(path).dirname);
  }
  if (charset) {
    data = getIconv().encode(data, charset);
  }
  if (append) {
    fs.appendFileSync(path, data, null);
  } else {
    fs.writeFileSync(path, data, null);
  }
};

/**
 * str过滤处理，判断include中匹配str为true，exclude中不匹配str为true
 * @param  {String} str     待处理的字符串
 * @param  {Array} include include匹配规则
 * @param  {Array} exclude exclude匹配规则
 * @return {Boolean}         是否匹配
 * @memberOf fis.util
 * @name filter
 * @function
 */
_.filter = function(str, include, exclude) {
// pattern处理，若不为正则则调用glob处理生成正则
  function normalize(pattern) {
    var type = toString.call(pattern);
    switch (type) {
      case '[object String]':
        return _.glob(pattern);
      case '[object RegExp]':
        return pattern;
      default:
        fis.log.error('invalid regexp [%s].', pattern);
    }
  }
// 判断str是否符合patterns中的匹配规则
  function match(str, patterns) {
    var matched = false;
    if (!_.is(patterns, 'Array')) {
      patterns = [patterns];
    }
    patterns.every(function(pattern) {
      if (!pattern) {
        return true;
      }
      matched = matched || str.search(normalize(pattern)) > -1;
      return !matched;
    });
    return matched;
  }

  var isInclude, isExclude;

  if (include) {
    isInclude = match(str, include);
  } else {
    isInclude = true;
  }

  if (exclude) {
    isExclude = match(str, exclude);
  }

  return isInclude && !isExclude;
};

/**
 * 若rPath为文件夹，夹遍历目录下符合include和exclude规则的全部文件；若rPath为文件，直接匹配该文件路径是否符合include和exclude规则
 * @param  {String} rPath   要查找的目录
 * @param  {Array} include 包含匹配正则集合，可传null
 * @param  {Array} exclude 排除匹配正则集合，可传null
 * @param  {String} root    根目录
 * @return {Array}         符合规则的文件路径的集合
 * @memberOf fis.util
 * @name find
 * @function
 */
_.find = function(rPath, include, exclude, root) {
  var list = [],
    path = _.realpath(rPath),
    filterPath = root ? path.substring(root.length) : path;
  if (path) {
    var stat = fs.statSync(path);
    if (stat.isDirectory() && (include || _.filter(filterPath, include, exclude))) {
      fs.readdirSync(path).forEach(function(p) {
        if (p[0] != '.') {
          list = list.concat(_.find(path + '/' + p, include, exclude, root));
        }
      });
    } else if (stat.isFile() && _.filter(filterPath, include, exclude)) {
      list.push(path);
    }
  } else {
    fis.log.error('unable to find [%s]: No such file or directory.', rPath);
  }
  return list.sort();
};

/**
 * 删除指定目录下面的文件。
 * @memberOf fis.util
 * @name del
 * @function
 */
_.del = function(rPath, include, exclude) {
  var removedAll = true;
  var path;
  if (rPath && _.exists(rPath)) {
    var stat = fs.lstatSync(rPath);
    var isFile = stat.isFile() || stat.isSymbolicLink();

    if (stat.isSymbolicLink()) {
      path = rPath;
    } else {
      path = _.realpath(rPath);
    }

    if (/^(?:\w:)?\/$/.test(path)) {
      fis.log.error('unable to delete directory [%s].', rPath);
    }

    if (stat.isDirectory()) {
      fs.readdirSync(path).forEach(function(name) {
        if (name != '.' && name != '..') {
          removedAll = _.del(path + '/' + name, include, exclude) && removedAll;
        }
      });
      if (removedAll) {
        fs.rmdirSync(path);
      }
    } else if (isFile && _.filter(path, include, exclude)) {
      fs.unlinkSync(path);
    } else {
      removedAll = false;
    }
  } else {
    //fis.log.error('unable to delete [' + rPath + ']: No such file or directory.');
  }
  return removedAll;
};

/**
 * 复制符合include和exclude规则的文件到目标目录，若rSource为文件夹则递归其下属每个文件
 * @param  {String} rSource 源路径
 * @param  {String} target  目标路径
 * @param  {Array} include 包含匹配规则
 * @param  {Array} exclude 排除匹配规则
 * @param  {Boolean} uncover 是否覆盖
 * @param  {Boolean} move    是否移动
 * @memberOf fis.util
 * @name copy
 * @function
 */
_.copy = function(rSource, target, include, exclude, uncover, move) {
  var removedAll = true,
    source = _.realpath(rSource);
  target = _(target);
  if (source) {
    var stat = fs.statSync(source);
    if (stat.isDirectory()) {
      fs.readdirSync(source).forEach(function(name) {
        if (name != '.' && name != '..') {
          removedAll = _.copy(
            source + '/' + name,
            target + '/' + name,
            include, exclude,
            uncover, move
          ) && removedAll;
        }
      });
      if (move && removedAll) {
        fs.rmdirSync(source);
      }
    } else if (stat.isFile() && _.filter(source, include, exclude)) {
      if (uncover && _exists(target)) {
        //uncover
        removedAll = false;
      } else {
        _.write(target, fs.readFileSync(source, null));
        if (move) {
          fs.unlinkSync(source);
        }
      }
    } else {
      removedAll = false;
    }
  } else {
    fis.log.error('unable to copy [%s]: No such file or directory.', rSource);
  }
  return removedAll;
};

/**
 * path处理
 * @param  {String} str 待处理的路径
 * @return {Object}
 * @example
 * str = /a.b.c/f.php?kw=%B2%E5%BB%AD#addfhubqwek
 *                      {
 *                         origin: '/a.b.c/f.php?kw=%B2%E5%BB%AD#addfhubqwek',
 *                         rest: '/a.b.c/f',
 *                         hash: '#addfhubqwek',
 *                         query: '?kw=%B2%E5%BB%AD',
 *                         fullname: '/a.b.c/f.php',
 *                         dirname: '/a.b.c',
 *                         ext: '.php',
 *                         filename: 'f',
 *                         basename: 'f.php'
 *                      }
 * @memberOf fis.util
 * @name ext
 * @function
 */
_.ext = function(str) {
  var info = _.query(str),
    pos;
  str = info.fullname = info.rest;
  if ((pos = str.lastIndexOf('/')) > -1) {
    if (pos === 0) {
      info.rest = info.dirname = '/';
    } else {
      info.dirname = str.substring(0, pos);
      info.rest = info.dirname + '/';
    }
    str = str.substring(pos + 1);
  } else {
    info.rest = info.dirname = '';
  }
  if ((pos = str.lastIndexOf('.')) > -1) {
    info.ext = str.substring(pos).toLowerCase();
    info.filename = str.substring(0, pos);
    info.basename = info.filename + info.ext;
  } else {
    info.basename = info.filename = str;
    info.ext = '';
  }
  info.rest += info.filename;
  return info;
};

/**
 * path处理，提取path中rest部分(?之前)、query部分(?#之间)、hash部分(#之后)
 * @param  {String} str 待处理的url
 * @return {Object}     {
 *                         origin: 原始串
 *                         rest: path部分(?之前)
 *                         query: query部分(?#之间)
 *                         hash: hash部分(#之后)
 *                      }
 * @memberOf fis.util
 * @name query
 * @function
 */
_.query = function(str) {
  var rest = str,
    pos = rest.indexOf('#'),
    hash = '',
    query = '';
  if (pos > -1) {
    hash = rest.substring(pos);
    rest = rest.substring(0, pos);
  }
  pos = rest.indexOf('?');
  if (pos > -1) {
    query = rest.substring(pos);
    rest = rest.substring(0, pos);
  }
  rest = rest.replace(/\\/g, '/');
  if (rest !== '/') {
    // 排除由于.造成路径查找时因filename为""而产生bug，以及隐藏文件问题
    rest = rest.replace(/\/\.?$/, '');
  }
  return {
    origin: str,
    rest: rest,
    hash: hash,
    query: query
  };
};

/**
 * 生成路径信息
 * @param  {String|Array} path 路径，可使用多参数传递：pathinfo('a', 'b', 'c')
 * @return {Object}      @see ext()
 * @memberOf fis.util
 * @name pathinfo
 * @function
 */
_.pathinfo = function(path) {
  //can not use _() method directly for the case _.pathinfo('a/').
  var type = typeof path;
  if (arguments.length > 1) {
    path = Array.prototype.join.call(arguments, '/');
  } else if (type === 'string') {
    //do nothing for quickly determining.
  } else if (type === 'object') {
    path = Array.prototype.join.call(path, '/');
  }
  return _.ext(path);
};

/**
 * 驼峰写法转换
 * @param  {String} str 待转换字符串
 * @return {String}     转换后的字符串
 * @memberOf fis.util
 * @name camelcase
 * @function
 */
_.camelcase = function(str) {
  var ret = '';
  if (str) {
    str.split(/[-_ ]+/).forEach(function(ele) {
      ret += ele[0].toUpperCase() + ele.substring(1);
    });
  } else {
    ret = str;
  }
  return ret;
};

/**
 * 加载处理fis模块下的全部插件，如fis3-plugin-*
 * @param  {String}   type     模块名
 * @param  {Function} callback 回调
 * @param  {Object}   def      模块获取的默认值 @see fis.config.get def
 * @memberOf fis.util
 * @name pipe
 * @function
 */
_.pipe = function(type, callback, def) {
  var processors = fis.media().get('modules.' + type, def);
  if (processors) {
// 兼容处理[]、String、'String1, String2, ...'的配置写法
    if ('string' === typeof processors) {
      processors = processors.trim().split(/\s*,\s*/);
    } else if (!Array.isArray(processors)) {
      processors = [processors];
    }

    // 过滤掉同名的插件, 没必要重复操作。
    processors = processors.filter(function(item, idx, arr) {
      item = item.__name || item;

      return idx === _.findIndex(arr, function(target) {
        target = target.__name || target;

        return target === item;
      });
    });

// 若type为多层级(ex: 'a.b')，获取fis.config中groups[defaultGroup]['modules']下一层配置项的名称
    type = type.split('.')[0];
    processors.forEach(function(obj, index) {
      var processor = obj.__name || obj;
      var key;

      if (typeof processor === 'string') {
        key = type + '.' + processor;
        processor = fis.require(type, processor);
      } else {
        key = type + '.' + index;
      }
      if (typeof processor === 'function') {
        var settings = {};

        _.assign(settings, processor.defaultOptions || processor.options || {});
        _.assign(settings, fis.config.get('settings.' + key, {}));
        typeof obj === 'object' && _.assign(settings, obj);

        // 删除隐藏配置
        delete settings.__name;
        delete settings.__plugin;
        delete settings.__pos;

        callback(processor, settings, key, type);
      } else {
        fis.log.warning('invalid processor [modules.' + key + ']');
      }
    });
  }
};

/**
 * url解析函数，规则类似require('url').parse
 * @param  {String} url 待解析的url
 * @param  {Object} opt 解析配置参数 { host|hostname, port, path, method, agent }
 * @return {Object}     { protocol, host, port, path, method, agent }
 * @memberOf fis.util
 * @name parseUrl
 * @function
 */
_.parseUrl = function(url, opt) {
  opt = opt || {};
  url = Url.parse(url);
  var ssl = url.protocol === 'https:';
  opt.host = opt.host || opt.hostname || ((ssl || url.protocol === 'http:') ? url.hostname : 'localhost');
  opt.port = opt.port || (url.port || (ssl ? 443 : 80));
  opt.path = opt.path || (url.pathname + (url.search ? url.search : ''));
  opt.method = opt.method || 'GET';
  opt.agent = opt.agent || false;
  return opt;
};

/**
 * 下载功能实现
 * @param  {String}   url      下载的url
 * @param  {Function} callback 回调
 * @param  {String}   extract  压缩提取路径
 * @param  {Object}   opt      配置
 * @memberOf fis.util
 * @name download
 * @function
 */
_.download = function(url, callback, extract, opt) {
  opt = _.parseUrl(url, opt || {});
  var http = opt.protocol === 'https:' ? require('https') : require('http'),
    name = _.md5(url, 8) + _.ext(url).ext,
    tmp = fis.project.getTempPath('downloads', name),
    data = opt.data;
  delete opt.data;
  _.write(tmp, '');
  var writer = fs.createWriteStream(tmp),
    http_err_handler = function(err) {
      writer.destroy();
      fs.unlinkSync(tmp);
      var msg = typeof err === 'object' ? err.message : err;
      if (callback) {
        callback(msg);
      } else {
        fis.log.error('request error [%s]', msg);
      }
    },
    req = http.request(opt, function(res) {
      var status = res.statusCode;
      res
        .on('data', function(chunk) {
          writer.write(chunk);
        })
        .on('end', function() {
          if (status >= 200 && status < 300 || status === 304) {
            if (extract) {
              fs
                .createReadStream(tmp)
                .pipe(getTar().Extract({
                  path: extract
                }))
                .on('error', function(err) {
                  if (callback) {
                    callback(err);
                  } else {
                    fis.log.error('extract tar file [%s] fail, error [%s]', tmp, err);
                  }
                })
                .on('end', function() {
                  if (callback && (typeof callback(null, tmp, res) === 'undefined')) {
                    fs.unlinkSync(tmp);
                  }
                });
            } else if (callback && (typeof callback(null, tmp, res) === 'undefined')) {
              fs.unlinkSync(tmp);
            }
          } else {
            http_err_handler(status);
          }
        })
        .on('error', http_err_handler);
    });
  req.on('error', http_err_handler);
  if (data) {
    req.write(data);
  }
  req.end();
};

/**
 * 遵从RFC规范的文件上传功能实现
 * @param  {String}   url      上传的url
 * @param  {Object}   opt      配置
 * @param  {Object}   data     要上传的formdata，可传null
 * @param  {String}   content  上传文件的内容
 * @param  {String}   subpath  上传文件的文件名
 * @param  {Function} callback 上传后的回调
 * @memberOf fis.util
 * @name upload
 * @function
 */
_.upload = function(url, opt, data, content, subpath, callback) {
  if (typeof content === 'string') {
    content = new Buffer(content, 'utf8');
  } else if (!(content instanceof Buffer)) {
    fis.log.error('unable to upload content [%s]', (typeof content));
  }
  data = data || {};
  var endl = '\r\n';
  var boundary = '-----np' + Math.random();
  var collect = [];
  _.map(data, function(key, value) {
    collect.push('--' + boundary + endl);
    collect.push('Content-Disposition: form-data; name="' + key + '"' + endl);
    collect.push(endl);
    collect.push(value + endl);
  });
  collect.push('--' + boundary + endl);
  collect.push('Content-Disposition: form-data; name="file"; filename="' + subpath + '"' + endl);
  collect.push(endl);
  collect.push(content);
  collect.push('--' + boundary + '--' + endl);

  var length = 0;
  collect.forEach(function(ele) {
    length += ele.length;
  });

  opt = opt || {};
  opt.method = opt.method || 'POST';
  opt.headers = {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': length
  };
  opt = _.parseUrl(url, opt);
  var http = opt.protocol === 'https:' ? require('https') : require('http');
  var req = http.request(opt, function(res) {
    var status = res.statusCode;
    var body = '';
    res
      .on('data', function(chunk) {
        body += chunk;
      })
      .on('end', function() {
        if (status >= 200 && status < 300 || status === 304) {
          callback(null, body);
        } else {
          callback(status);
        }
      })
      .on('error', function(err) {
        callback(err.message || err);
      });
  });
  collect.forEach(function(d) {
    req.write(d);
    if (d instanceof Buffer) {
      req.write(endl);
    }
  });
  req.end();
};

/**
 * 读取fis组件安装
 * @param  {String} name    组件名称
 * @param  {String} version 版本标识
 * @param  {Object} opt     安装配置 { remote, extract, before, error, done,  }
 * @memberOf fis.util
 * @name install
 * @function
 */
_.install = function(name, version, opt) {
  version = version === '*' ? 'latest' : (version || 'latest');
  var remote = opt.remote.replace(/^\/$/, '');
  var url = remote + '/' + name + '/' + version + '.tar';
  var extract = opt.extract || process.cwd();
  if (opt.before) {
    opt.before(name, version);
  }
  _.download(url, function(err) {
    if (err) {
      if (opt.error) {
        opt.error(err);
      } else {
        fis.log.error('unable to download component [%s@%s] from [%s], error [%s].', name, version, url, err);
      }
    } else {
      if (opt.done) {
        opt.done(name, version);
      }
      process.stdout.write('install [' + name + '@' + version + ']\n');
      var pkg = _(extract, 'package.json');
      if (_.isFile(pkg)) {
        var info = _.readJSON(pkg);
        fs.unlinkSync(pkg);
        _.map(info.dependencies || {}, function(depName, depVersion) {
          _.install(depName, depVersion, opt);
        });
      }
    }
  }, extract);
};

/**
 * 读取JSON文件
 * @param  {String} path 路径
 * @return {Object}      JSON文件内容JSON.parse后得到的对象
 * @memberOf fis.util
 * @name readJson
 * @function
 */
_.readJSON = function(path) {
  var json = _.read(path),
    result = {};
  try {
    result = JSON.parse(json);
  } catch (e) {
    fis.log.error('parse json file[%s] fail, error [%s]', path, e.message);
  }
  return result;
};

/**
 * 模拟linux glob文法实现，但()为捕获匹配模式
 * @param  {String} pattern 符合fis匹配文法的正则串
 * @param  {String} str     待匹配的字符串
 * @param  {Object} options 匹配设置参数  @see minimatch.makeRe
 * @return {Boolean|RegExp}         若str参数为String则返回str是否可被pattern匹配
 *                                  若str参数不为String，则返回正则表达式
 * @memberOf fis.util
 * @name glob
 * @function
 */
_.glob = function(pattern, str, options) {
  var regex;

  // 推荐使用 ::text 和 ::image
  // text 和 image 后续也许不会再支持。
  if (~['::text', '::image', 'text', 'image'].indexOf(pattern)) {
    regex = getFileTypeReg(pattern.replace(/^::/, ''));
  } else {

    // 由于minimatch提供的glob支持中()语法不符合fis glob的需求，因此只针对()单独处理
    var hasBracket = ~pattern.indexOf('(');

    // 当用户配置 *.js 这种写法的时候，需要让其命中所有所有目录下面的。
    if (/^(\(*?)(?!\:|\/|\(|\*\*)(.*)$/.test(pattern)) {
      pattern = '**/' + pattern;
    }

    // support special global star
    // 保留原来的 **/ 和 /** 用法，只扩展 **.ext 这种用法。
    pattern = pattern.replace(/\*\*(?!\/|$)/g, '\uFFF0gs\uFFF1');
    if (hasBracket) {
      pattern = pattern.replace(/\(/g, '\uFFF0/').replace(/\)/g, '/\uFFF1');
    }

    regex = minimatch.makeRe(pattern, options || {
      matchBase: true,
      // nocase: true
    });

    pattern = regex.source;
    pattern = pattern.replace(/\uFFF0gs\uFFF1/g, '(?!\\.)(?=.).*');

    if (hasBracket) {
      pattern = pattern.replace(/\uFFF0\\\//g, '(').replace(/\\\/\uFFF1/g, ')');
    }

    regex = new RegExp(pattern, regex.ignoreCase ? 'i' : '');
  }

  if (typeof str === 'string') {
    return regex.test(str);
  }

  return regex;
};

/**
 * 调起nohup命令
 * @param  {String}   cmd      执行的语句
 * @param  {Object}   options  配置参数，可传可不传 @see [child_process.exec options](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
 * @param  {Function} callback nohup执行完毕的回调函数
 * @memberOf fis.util
 * @name nohup
 * @function
 */
_.nohup = function(cmd, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }
  var exec = require('child_process').exec;
  if (IS_WIN) {
    var cmdEscape = cmd.replace(/"/g, '""'),
      file = fis.project.getTempPath('nohup-' + _.md5(cmd) + '.vbs'),
      script = '';
    script += 'Dim shell\n';
    script += 'Set shell = Wscript.CreateObject("WScript.Shell")\n';
    script += 'ret = shell.Run("cmd.exe /c start /b ' + cmdEscape + '", 0, TRUE)\n';
    script += 'WScript.StdOut.Write(ret)\n';
    script += 'Set shell = NoThing';
    _.write(file, script);
    return exec('cscript.exe /nologo "' + file + '"', options, function(error, stdout) {
      if (stdout != '0') {
        fis.log.error('exec command [%s] fail.', cmd);
      }
      fs.unlinkSync(file);
      if (typeof callback === 'function') {
        callback();
      }
    });
  } else {
    return exec('nohup ' + cmd + ' > /dev/null 2>&1 &', options, function(error, stdout) {
      if (error !== null) {
        fis.log.error('exec command [%s] fail, stdout [%s].', cmd, stdout);
      }
      if (typeof callback === 'function') {
        callback();
      }
    });
  }
};

/**
 * 判断对象是否为null,[],{},0
 * @param  {Object}  obj 待测对象
 * @return {Boolean}     是否为空
 * @memberOf fis.util
 * @name isEmpty
 * @function
 */
_.isEmpty = function(obj) {
  if (obj == null) return true;
  if (_.is(obj, 'Array')) return obj.length == 0;
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true
};

/**
 * 将 matches 规则应用到某个对象上面。
 *
 * @param {String}  path 路径。用来与 match 规则匹配
 * @param {Array} matches 规则数组
 * @param {Array} allowed 可以用来过滤掉不关心的字段。
 * @memberOf fis.util
 * @name applyMatches
 * @function
 */
_.applyMatches = function(path, matches, allowed) {
  var obj = {};

  matches.forEach(function(item, index) {
    var properties = item.properties || {};
    var keys = Object.keys(properties);

    if (!keys.length) {
      return;
    }

    var m = item.reg.exec(path);
    var match = !!m;

    if (match !== item.negate) {

      // 当用 negate 模式时，排除命中特殊选择器
      if (item.negate && ~path.indexOf(':')) {
        return;
      }

      m = m || {
        0: path
      };

      keys.forEach(function(key) {

        // 如果指定了允许的属性名，走白名单规则规则。
        if (allowed && !~allowed.indexOf(key)) {
          return;
        }

        var value = typeof properties[key] === 'object' ? fis.util.cloneDeep(properties[key]) : properties[key];

        // 将 property 中 $1 $2... 替换为本来的值
        if (typeof value === 'string') {
          value = value.replace(/\$(\d+|&)/g, function(_, k) {
            k = k === '&' ? 0 : k;
            return m[k] || '';
          });
        } else if (typeof(value) === 'function' && ~['release', 'url', 'relative'].indexOf(key)) {
          value = value.call(null, m, path);
        }

        // 记录是命中的 match 的位置。
        obj['__' + key + 'Index'] = index;

        // 调整 plugin 顺序
        if (value && value.__plugin && value.__pos) {
          if (!obj[key]) {
            obj[key] = value;
          } else {
            if (!Array.isArray(obj[key])) {
              obj[key] = [obj[key]];
            }

            var pos = value.__pos;
            pos = pos === 'prepend' ? 0 : (pos === 'append' ? obj[key].length : (parseInt(pos) || 0));
            obj[key].splice(pos, 0, value);
          }
        } else if (_.isPlainObject(value) && _.isPlainObject(obj[key])) {
          fis.util.assign(obj[key], value);
        } else {
          obj[key] = value;
        }
      });
    }
  });

  return obj;
};
