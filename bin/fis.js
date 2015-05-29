#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
  name: 'fis3',
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
  var location = path.dirname(env.modulePath);
  if (!env.modulePath) {
    fis = require('../');
    location = path.join(__dirname, '../');
  } else {
    fis = require(env.modulePath);
  }
  fis.log.info('Currently running %s (%s)', cli.name, location);
  fis.set('localNPMFolder', path.join(env.cwd, 'node_modules/fis3'));
  fis.set('globalNPMFolder', path.dirname(__dirname));
  fis.cli.run(argv, env);
});
