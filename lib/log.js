/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
var util = require('util');

exports.L_ALL = 0x01111;
exports.L_NOTIC = 0x00001;
exports.L_DEBUG = 0x00010;
exports.L_WARNI = 0x00100;
exports.L_ERROR = 0x01000;
exports.L_NORMAL = 0x01101;

exports.level = exports.L_NORMAL;
exports.throw = false;
exports.alert = false;

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

exports.debug = function(msg) {
  msg = util.format.apply(util, arguments);
  log('debug', exports.now().grey + ' ' + msg, exports.L_DEBUG);
};

exports.notice = exports.info = function(msg) {
  msg = util.format.apply(util, arguments);
  log('notice', msg, exports.L_NOTIC);
};

exports.warning = exports.warn = function(msg) {
  msg = util.format.apply(util, arguments);
  log('warning', msg, exports.L_WARNI);
};

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
