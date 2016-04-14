/**
 * Created by ryan on 15/7/9.
 */
var fs = require('fs'),
  path   = require('path');
var fis = require('..');
var cli = fis.cli;
var project = fis.project;
var _      = fis.cache,
  config = fis.config;
var expect = require('chai').expect;
var root = fis.util(__dirname);

describe('cache: save(content, info)', function () {
  project.setProjectRoot(root);
  project.setTempRoot(root);
  var cwd1 = root + "/fis3_test";
  var cwd2 = root.substring(0,root.lastIndexOf("/")) + "/bin/fis.js";
  it('general', function () {
    this.timeout(15000);
    process.argv = [ 'node', cwd2, '-h' ];
    var argv = { _: [], h: true };
    var env = { cwd: cwd1,
      require: [],
      configNameSearch: [ 'fis-conf.js' ],
      configPath: null,
      configBase: undefined,
      modulePath: undefined,
      modulePackage: {} };
    cli.run(argv, env);

    process.argv = [ 'node', cwd2, '-v' ];
    var argv = { _: [], v: true };
    cli.run(argv, env);

    process.argv = [ 'node', cwd2, 'release' ];
    var argv = { _: [ 'release' ] };
    var env = { cwd: cwd1,
      require: [],
      configNameSearch: [ 'fis-conf.js' ],
      configPath: cwd1 + '/fis-conf.js',
      configBase: cwd1,
      modulePath: undefined,
      modulePackage: {} };
    cli.run(argv, env);

    process.argv = [ 'node', cwd2, '--verbose' ];
    var argv = { _: [], verbose: true };
    cli.run(argv, env);
  });
});
