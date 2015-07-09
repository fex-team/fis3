/*
 * auth:jiangshuguang
 *  问题1：fis.util.escapeReg没有case
 *
 * */

var fs    = require('fs'),
    path  = require('path'),
    _path = __dirname
      .replace(/\\/g, '/')
      .replace(/\/$/, '');

var fis = require('..');
var uri     = fis.uri,
    config  = fis.config,
    project = fis.project;
var expect = require('chai').expect;

describe('uri: uri()', function () {
  beforeEach(function () {
    config.init();
    project.setProjectRoot(_path);
  });

  it('relative path "/"', function () {
    expect(uri("uri/file/a.js?a=a")["origin"]).to.equal("uri/file/a.js?a=a");
    var op = !!(uri("./file/a.js?a=a" , _path + '/uri')["file"]);
    if(op){
      expect(true).to.be.true;
    }else{
      expect(true).to.be.false;
    }
    expect(uri("uri/file/a.js?a=a")["query"]).to.equal("?a=a");
    expect(uri("uri/file/a.js?a=a")["file"]["basename"]).to.equal("a.js");
    //expect(uri("uri/file/a.js?a=a")["file"]["basename"]).to.equal("a.js");
    //fis.config.set("namespace",_path);
    //console.log(uri(_path + ":uri/file/a.js"));
  });

  it("absolute path", function () {

    expect(uri("/uri/file/a.js?a=a")["query"]).to.equal("?a=a");
    expect(uri("/uri/file/a.js?a=a")["rest"]).to.equal("/uri/file/a.js");

    expect(uri("/uri/file/a.js?a=a")["file"]["realpath"]).to.equal(_path + "/uri/file/a.js");
    config.set("namespace",'uri');
    config.env().set("namespaceConnector",'/');
    var c = uri("uri/file/a.js?a=a");
    expect(c.file.origin).to.equal(_path+'/'+c.rest);
  });
});



