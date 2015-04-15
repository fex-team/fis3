#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var logger = require('../lib/log.js');
var path = require('path');
var nodeVersion = process.versions.node;
var parts = nodeVersion.split(".");

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

  process.env.NODE_ENV = process.env.NODE_ENV || argv.env || 'dev';
  fis.cli.run(argv, env);
});
