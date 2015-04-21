#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
  name: 'fis',
  processTitle: 'fis',
  moduleName: 'fis3',
  configName: 'fis-conf',

  // only js supported!
  extensions: {
    '.js': null
  }
});

cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, function(env) {
  var fis;

  if (!env.modulePath) {
    fis = require('../');
  } else {
    fis = require(env.modulePath);
    fis.set('globalNPMFolder', path.dirname(__dirname));
  }

  process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'dev';
  fis.cli.run(argv, env);
});

cli.on('error', function (err) {
  throw err;
});
