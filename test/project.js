// fis.baidu.com

var assert = require('assert');
var fis = require('..');
var fs = require('fs');
var path = require('path');
var root = path.join(__dirname, 'project');
var expect = require('chai').expect;

require.del = function (id) {
  try {
    var path = require.resolve(id);
    delete require.cache[path];
  } catch(e) {}
};

describe('project: const variable', function () {
  var project = require('../lib/project');
  it ('DEFAULT_REMOTE_REPOS', function () {
    assert.equal(project.DEFAULT_REMOTE_REPOS, 'http://fis.baidu.com/repos');
  });
});

describe('project: tempPath', function () {
  var project;
  beforeEach(function () {
    require.del('../lib/project');
    project = require('../lib/project');
  });

  it ('setTempRoot', function () {
    var pth = path.join(root, '.fis-tmp');
    project.setTempRoot(pth);
    assert.equal(path.normalize(project.getTempPath()), path.normalize(pth));
    fs.rmdirSync(pth);
  });

  it ('getTempPath', function () {
    var tempPath = project.getTempPath();
    if (fis.util.isWin()) {
      //@TODO
    } else {
      assert.equal(tempPath, process.env['HOME'] + '/.fis3-tmp');
    }
  })
});

describe('project: projectPath', function () {
  var project;
  beforeEach(function () {
    require.del('../lib/project');
    project = require('../lib/project');
  });

  it('getProjectPath', function () {
    fis.log.throw = true;
    try {
      project.getProjectPath();
    }  catch (e) {
      assert(/undefined project root/.test(e.message));
    }
  });

  it('setProjectRoot', function () {
    project.setProjectRoot(root);
    assert.equal(path.normalize(project.getProjectPath()), path.normalize(root));
  });
});

describe('project: getSource', function () {
  var project;
  beforeEach(function () {
    fis.config.init(); // @TODO
    fis.media().init(); // @TODO
    require.del('../lib/project');
    project = require('../lib/project');
    fis.project.setProjectRoot(root);
  });

  //@TODO
  it('getSource', function () {
    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '/qfis-test.js,/test.css,/test.html');
  });

  it('getSource', function () {
    fis.config.set('project.include','qfis-test.js');
    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '/qfis-test.js');
  });

  it('getSource', function () {
    fis.config.set('project.exclude','qfis-test.js');
    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '/test.css,/test.html');
  });

  it('getSource', function () {
    fis.config.set('project.exclude',['test.html','test.css','qfis-test.js']);
    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '');
  });

  it('getSource', function () {
    fis.config.set('project.include',['test.js','qfis-test.js']);
    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '/qfis-test.js');
  });

  it('getSource', function () {
    fis.config.set('project.exclude','qfis-test.js');
    fis.config.set('project.include',['test.js','qfis-test.js']);
    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '');
  });

  it('project.files: [!**.js]', function() {
    fis.config.set('project.ignore', ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js']);
    fis.config.set('project.files', ['!**.js']);

    var xc = fis.project.getSource();
    var keyd = [];
    for(var key in xc){
      keyd.push(key);
    }
    assert.equal(keyd.join(','), '/test.css,/test.html');
  });
});

describe('project: lookup', function () {
  var project;
  beforeEach(function () {
    fis.config.init(); // @TODO
    fis.media().init(); // @TODO
    require.del('../lib/project');
    project = require('../lib/project');
    project.setProjectRoot(root);
  });

  it("not event", function () {
    var info = project.lookup('/qfis-test.js');
    assert.deepEqual({id: info.id, moduleId: info.moduleId}, {id: 'qfis-test.js', moduleId: 'qfis-test'});
  });
});
