/**
 * Created by ryan on 15/5/13.
 */
var fs = require('fs'),
    path   = require('path');
var fis = require('../../..');
var _      = fis.util,
    config = fis.config;
var expect = require('chai').expect;
var fis3_plugin_module = require('fis3-plugin-module');

describe('index: init', function () {
  var project;
  beforeEach(function () {
    fis.config.init(); // @TODO
    fis.media().init(); // @TODO
  });

  it("lookup:file", function () {
    var root = path.join(__dirname, 'project');
    fis.project.setProjectRoot(root);
    var filepath = path.join(root, 'test.js');
    fis.util.write(filepath, 'console.log("hello, world.");');
    var info = project.lookup('/test.js');
    expect(info.id == "test.js").to.be.true;
    expect(info.moduleId == "test.js").to.be.true;

    var info2 = project.lookup('/test');
    expect(info.id == "test.js").to.be.true;
    expect(info.moduleId == "test.js").to.be.true;

    fis.config.env().set('namespaceConnector', '/');
    fis.config.env().set('namespace','project')
    var info2 = project.lookup('project/test');
    expect(info.id == "test.js").to.be.true;
    expect(info.moduleId == "test.js").to.be.true;
  });

  it("lookup:file", function () {
    var root = path.join(__dirname, 'project');
    fis.project.setProjectRoot(root);
    var path = '/test.js';
    var file='';
    var info = fis.uri(path);
    var vfile = info.file;
    var file2 = fis.file.wrap("/test.js");
    fis.emit('lookup:file', file2);

    expect(info.id == "test.js").to.be.true;
    expect(info.moduleId == "test.js").to.be.true;
  });
});

describe('fis3-plugin-module compile:postprocessor', function() {
  beforeEach(function() {
    fis3_plugin_module(fis, { type: 'auto' });
    fis.match('**/*.js', {});
  });

  it('compile non-AMD JS file', function() {
    var file = fis.file(__dirname + '/project/math.js');
    file.isMod = true;
    var content = file.getContent();
    fis.emit('compile:postprocessor', file);
    expect(file.getContent()).to.equal('define(\'' + (file.moduleId || file.id) + '\', function(require, exports, module) {\n\n' + content + '\n\n});\n');
  });    

  it('compile AMD JS file', function() {
    var file = fis.file(__dirname + '/project/dmath.js');
    file.isMod = true;
    var content = file.getContent();
    fis.emit('compile:postprocessor', file);
    expect(file.getContent()).to.equal(content);
  });
});