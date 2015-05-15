/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var util = require('util');

/**
 * 打印输出标识码定义
 * @type {[type]}
 */
exports.L_ALL = 0x01111;
exports.L_NOTIC = 0x00001;
exports.L_DEBUG = 0x00010;
exports.L_WARNI = 0x00100;
exports.L_ERROR = 0x01000;
exports.L_NORMAL = 0x01101;

exports.level = exports.L_NORMAL;
exports.throw = false;
exports.alert = false;

/**
 * 获取当前时间
 * @param  {Boolean} withoutMilliseconds 是否不显示豪秒
 * @return {String}                     HH:MM:SS.ms
 */
exports.now = function(withoutMilliseconds) {
  var d = new Date(),
    str;
  str = [
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ].join(':').replace(/\b\d\b/g, '0$&');
  if (!withoutMilliseconds) {
    str += '.' + ('00' + d.getMilliseconds()).substr(-3);
  }
  return str;
};

/**
 * 打印输出
 * @param  {String} type [打印输出类型]
 * @param  {String} msg  [打印输出内容]
 * @param  {String} code [打印输出标识码]
 */
function log(type, msg, code) {
  code = code || 0;
  if ((exports.level & code) > 0) {
    var listener = exports.on[type];
    if (listener) {
      listener(msg);
    }
    exports.on.any(type, msg);
  }
}

/**
 * debug 打印代理函数
 * @param  {String} msg 消息内容
 * @return {[type]}     [description]
 */
exports.debug = function(msg) {
  msg = util.format.apply(util, arguments);
  log('debug', exports.now().grey + ' ' + msg, exports.L_DEBUG);
};

/**
 * notice/info 打印代理函数
 * @param  {String} msg 消息内容
 * @return {[type]}     [description]
 */
exports.notice = exports.info = function(msg) {
  msg = util.format.apply(util, arguments);
  log('notice', msg, exports.L_NOTIC);
};

/**
 * warn 打印代理函数
 * @param  {String} msg 消息内容
 * @return {[type]}     [description]
 */
exports.warning = exports.warn = function(msg) {
  msg = util.format.apply(util, arguments);
  log('warning', msg, exports.L_WARNI);
};

/**
 * error 打印代理函数
 * @param  {String} err 消息内容
 * @return {[type]}     [description]
 */
exports.error = function(err) {
  if (!(err instanceof Error)) {
    err = new Error(err.message || util.format.apply(util, arguments));
  }
  if (exports.alert) {
    err.message += '\u0007';
  }
  if (exports.throw) {
    throw err
  } else {
    log('error', err.message, exports.L_ERROR);
    exports.debug(err.stack);
    process.exit(1);
  }
};

/**
 * 打印实际执行方法集合
 * @type {Object}
 */
exports.on = {
  any: function(type, msg) {},
  debug: function(msg) {
    process.stdout.write('\n ' + '[DEBUG]'.grey + ' ' + msg + '\n');
  },
  notice: function(msg) {
    process.stdout.write('\n ' + '[INFO]'.cyan + ' ' + msg + '\n');
  },
  warning: function(msg) {
    process.stdout.write('\n ' + '[WARNI]'.yellow + ' ' + msg + '\n');
  },
  error: function(msg) {
    process.stdout.write('\n '+ '[ERROR]'.red +' ' + msg + '\n');
  }
};
