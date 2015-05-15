/**
 * Created by ryan on 15/5/13.
 */
var fs = require('fs'),
  path   = require('path');
var fis = require('../../..');
var _      = fis.util,
  config = fis.config;
var expect = require('chai').expect;
var amd = require('../lib/amd.js');
var commonJs = require('../lib/commonJs.js');
var fis3_plugin_module = require('fis3-plugin-module');


describe('index:', function () {

  it('standard:js', function () {
    _.pipe('plugin',function (processor, settings, key, type){

      var root = path.join(__dirname, 'project');
      fis.project.setProjectRoot(root);
      settings.type = "";
      settings.type = "amd";
      processor(fis, settings);
      expect(type == 'plugin').to.be.true;

      var filepath = path.join(root, 'test3.js');
      var file = fis.file.wrap(filepath);
      var info = {
        file: file,
        content: file.getContent()
      };
      fis.emit('standard:js',info);
      var str = "define('test3.js', function(require, exports, module) {\n" +
        "var toString = Object.prototype.toString;var _ = module.exports = {};_.mode = {CAPTURE: 1,};" +
        "\n\n" +
        "});";
      expect(info.content.toString()==str).to.be.true;

      var filepath = path.join(root, 'test2.js');
      settings.type = "";
      settings.type = "auto";
      processor(fis, settings);
      var file = fis.file.wrap(filepath);
      var info = {
        file: file,
        content: file.getContent()
      };
      fis.emit('standard:js',info);
      var xstr = info.content.toString();
      expect(xstr.indexOf("jsRequire") == 19).to.be.true;
      expect((xstr.indexOf("jsRequire")-9) == xstr.indexOf("require")).to.be.true;
      expect(xstr.indexOf("jsAsync") == 132).to.be.true;
      expect((xstr.indexOf("jsAsync")-16) == xstr.indexOf("require.async")).to.be.true;

    });
  });

  it("lookup:file", function () {
    var project = fis.project;

    var root = path.join(__dirname, 'project');
    project.setProjectRoot(root);
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
