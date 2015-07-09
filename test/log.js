/**
 * Created by ryan on 15/5/11.
 */
var fs = require('fs'),
  path   = require('path');
var fis = require('..');
var _      = fis.util,
   log = fis.log;
var expect = require('chai').expect;

describe('log: on', function () {
  var temp_flag ='';
  var temp_msg ='';
  beforeEach(function () {
    temp_flag == '';
    temp_msg == '';
    log.on.any = function (type, msg) {
      var flag = (type==temp_flag&&msg==temp_msg);
      if(temp_flag=='debug'){
        flag = msg.indexOf(temp_msg)>0;
      }
      expect(flag).to.be.true;

    }
  });

  it('warning', function () {
    temp_flag = "warning";
    temp_msg = "test warning";
    fis.log.warning(temp_msg);
  });

  it('notice', function () {
    temp_flag = "notice";
    temp_msg = "test notice";
    fis.log.notice(temp_msg);
  });

  it('debug', function () {
    temp_flag = "debug";
    temp_msg = "test debug";
    fis.log.level = fis.log.L_ALL;
    fis.log.debug(temp_msg);
  });

  it('error', function () {
    temp_flag = "error";
    temp_msg = "test error";
    fis.log.format();
    fis.log.throw = true;
    try{
      fis.log.error(temp_msg);
    }catch(e){
      expect(!!e).to.be.true;
    }
    fis.log.alert = true;
    try{
      fis.log.error(temp_msg);
    }catch(e){
      expect(!!e).to.be.true;
    }
  });
});
