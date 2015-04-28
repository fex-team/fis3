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
    expect(uri("uri/file/a.js?a=a", "/common")["origin"]).to.equal("uri/file/a.js?a=a");
    expect(uri("uri/file/a.js?a=a", "/common")["query"]).to.equal("?a=a");
  });

  it("absolute path", function () {

    expect(uri("/uri/file/a.js?a=a")["query"]).to.equal("?a=a");
    expect(uri("/uri/file/a.js?a=a")["rest"]).to.equal("/uri/file/a.js");
    console.log(uri("/uri/file/a.js?a=a"));
    expect(uri("/uri/file/a.js?a=a")["file"]["realpath"]).to.equal(_path + "/uri/file/a.js");

  });
});


/*
 *  将变量${var}替换成 config中的值
 * */
describe('uri: replaceDefine()', function () {
  it('${var} replace config value', function () {
    fis.config.set('123', '<{11');
    fis.config.set('var', 'var_var');
    expect(uri.replaceDefine("hh${123}hh", true)).to.equal("hh\\<\\{11hh");
    expect(uri.replaceDefine("hh${123}hh", false)).to.equal("hh<{11hh");
    expect(uri.replaceDefine("hh{123}hh", false)).to.equal("hh{123}hh");
    expect(uri.replaceDefine("hh${var}hh", false)).to.equal("hhvar_varhh");
    expect(uri.replaceDefine("hh${var}hh", true)).to.equal("hhvar_varhh");
  });
});

/*
 * $& 或者 $\d替换成matches的键值
 * */
describe('uri: replaceMatches()', function () {
  it('relative path "/"', function () {
    var source = "$&hh$11hh",
        matches = {
          "&": "test1",
          "11": "test2"
        };
    expect(uri.replaceMatches(source, matches)).to.equal("$&hhtest2hh");
    source = "$11hh$22hh";
    matches = {
      "11": "test1",
      "22": "test2"
    };
    expect(uri.replaceMatches(source, matches)).to.equal("test1hhtest2hh");
    source = "$&hh$22hh";
    matches = ["test1"];
    expect(uri.replaceMatches(source, matches)).to.equal("test1hh$22hh");
  });
});

/*
 * 数组和对象的属性值递归替换
 *
 * */
describe('uri: replaceProperties()', function () {
  it('replaceProperties', function () {
    fis.config.set('123', '<{11');
    var source, matches, expectResult;
    source = "hh$&hh${123}hh";
    matches = [
      "test1"
    ];
    expect(uri.replaceProperties(source, matches)).to.equal("hhtest1hh<{11hh");
//            source = "hh$&hh${123}hh";
//            matches = [
//                "test1"
//            ];
//            fis.config.set('123', '$&');
//            expect(uri.replaceProperties(source,matches)).to.equal("hhtest1hhtest1hh");

    source = "hh$&hh${123}hh";
    matches = [
      "test1${123}"
    ];
    expect(uri.replaceProperties(source, matches)).to.equal("hhtest1<{11hh<{11hh");

    fis.config.set('123', '<{11');
    source = [
      "hh$&hh${123}hh",
      "aa$aa"
    ];
    matches = [
      "test1"
    ];
    expectResult = [
      "hhtest1hh<{11hh",
      "aa$aa"
    ];
    expect(uri.replaceProperties(source, matches)).to.deep.equal(expectResult);

    source = {
      aa: "hh$&hh${123}hh",
      bb: "aa$aa"
    };
    matches = [
      "test1"
    ];
    expectResult = {
      aa: "hhtest1hh<{11hh",
      bb: "aa$aa"
    };
    expect(uri.replaceProperties(source, matches)).to.deep.equal(expectResult);

    source = {
      aa: "hh$&hh${123}hh",
      bb: {
        aa: "hh$&hh${123}hh",
        bb: "aa$aa"
      }
    };
    matches = [
      "test1"
    ];
    expectResult = {
      aa: "hhtest1hh<{11hh",
      bb: {
        aa: "hhtest1hh<{11hh",
        bb: "aa$aa"
      }
    };
    expect(uri.replaceProperties(source, matches)).to.deep.equal(expectResult);

    source = {
      aa: "hh$&hh${123}hh",
      bb: {
        aa: "hh$&hh${123}hh",
        bb: "aa$aa"
      }
    };
    matches = [
      "test1${123}"
    ];
    expectResult = {
      aa: "hhtest1<{11hh<{11hh",
      bb: {
        aa: "hhtest1<{11hh<{11hh",
        bb: "aa$aa"
      }
    };
    expect(uri.replaceProperties(source, matches)).to.deep.equal(expectResult);
  });
});


describe('uri: roadmap()', function () {
  it('relative path "/"', function () {
    var subpath, pth, obj = {};
    subpath = "";
    pth = "path";

    fis.config.set('roadmap.path', [
      {
        reg: "/demo\/index1.*",
        page: "index1.tpl"
      }
    ]);
    subpath = "/demo/index1.tpl";
    expect(uri.roadmap(subpath, pth, obj)).to.deep.equal({page: "index1.tpl"});

  });
});

describe('uri: bug #93', function () {
  it('replaceMatches bug', function () {


    var source = "$1$&",
        matches = {
          "&": "test1",
          "1": ""
        };
    expect(uri.replaceMatches(source, matches)).to.equal("$&");
  });
});