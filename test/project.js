// fis.baidu.com

var assert = require('assert');
var fis = require('..');
var path = require('path');
var root = path.join(__dirname, 'project');

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
    assert.equal(project.getTempPath(), pth);
  });

  it ('getTempPath', function () {
    var tempPath = project.getTempPath();
    if (fis.util.isWin()) {
      //@TODO
    } else {
      assert.equal(tempPath, process.env['HOME'] + '/.fis-tmp');
    }
  })
});

describe('project: projectPath', function () {
  var project;
  beforeEach(function () {
    require.del('../lib/project');
    project = require('../lib/project');
  });

  //@TODO
  /*
  it('getProjectPath', function () {
    try {
      project.getProjectPath();
    }  catch (e) {
      //
    }
  });
  */

  it('setProjectRoot', function () {
    project.setProjectRoot(root);
    assert.equal(project.getProjectPath(), root);
  });
});