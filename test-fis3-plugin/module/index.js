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