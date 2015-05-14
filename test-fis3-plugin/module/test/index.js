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
require.del = function (id) {
  try {
    var path = require.resolve(id);
    delete require.cache[path];
  } catch(e) {}
};

describe('index: init', function () {
  var project;

  it('general', function () {
    _.pipe('plugin',function (processor, settings, key, type){
      processor(fis, settings);
      expect(type == 'plugin').to.be.true;
    });
  });

  it("lookup:file", function () {
    fis.config.init(); // @TODO
    fis.media().init(); // @TODO
    project = require('../../../lib/project');
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

  it("standard:js", function () {
    fis.config.init(); // @TODO
    fis.media().init(); // @TODO
    project = require('../../../lib/project');
    var root = path.join(__dirname, 'project');
    project.setProjectRoot(root);
    var filepath = path.join(root, 'test2.js');

    var file = fis.file.wrap(filepath);
    var info = {
      file: file,
      content: file.getContent()
    };
    fis.emit('standard:js',info);
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
