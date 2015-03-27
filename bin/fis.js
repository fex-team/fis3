#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var logger = require('../lib/log.js');
var v8flags = require('v8flags');
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
  },

  v8flags: v8flags
});

cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, function(env) {
  var fis;

  if (!env.modulePath) {
    logger.warning('Local `fis3` not found, use global version instead.');
    fis = require('../');
  } else {
    fis = require(env.modulePath);
  }

  // chdir before requiring gulpfile to make sure
  // we let them chdir as needed
  // if (process.cwd() !== env.cwd) {
  //   process.chdir(env.cwd);
  //   logger.notice('Working directory changed to `%s`.', env.cwd);
  // }
  //

  process.env.NODE_ENV = process.env.NODE_ENV || argv.env || 'dev';

  //merge standard conf
  fis.config.merge({
    modules: {
      preprocessor: {
        js: 'components',
        css: 'components',
        html: 'components'
      },
      postprocessor: {
        js: 'jswrapper'
      },
      optimizer: {
        js: 'uglify-js',
        css: 'clean-css',
        png: 'png-compressor'
      },
      spriter: 'csssprites',
      packager: 'map',
      deploy: 'default'
    }
  });

  //exports cli object
  fis.cli = {};

  fis.cli.name = 'fis';

  //colors
  fis.cli.colors = require('colors');

  //commander object
  fis.cli.commander = null;

  //package.json
  fis.cli.info = fis.util.readJSON(path.dirname(__dirname) + '/package.json');

  //output help info
  fis.cli.help = function() {
    var content = [
      '',
      '  Usage: ' + fis.cli.name + ' <command>',
      '',
      '  Commands:',
      ''
    ];

    fis.cli.help.commands.forEach(function(name) {
      var cmd = fis.require('command', name);
      name = cmd.name || name;
      name = fis.util.pad(name, 12);
      content.push('    ' + name + (cmd.desc || ''));
    });

    content = content.concat([
      '',
      '  Options:',
      '',
      '    -h, --help     output usage information',
      '    -v, --version  output the version number',
      '    --no-color     disable colored output',
      ''
    ]);
    console.log(content.join('\n'));
  };

  fis.cli.help.commands = ['release', 'install', 'server'];

  //output version info
  fis.cli.version = function() {
    var content = [
      '',
      '  v' + fis.cli.info.version,
      '',
      ' __' + '/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'.bold.red + '__' + '/\\\\\\\\\\\\\\\\\\\\\\'.bold.yellow + '_____' + '/\\\\\\\\\\\\\\\\\\\\\\'.bold.green + '___',
      '  _' + '\\/\\\\\\///////////'.bold.red + '__' + '\\/////\\\\\\///'.bold.yellow + '____' + '/\\\\\\/////////\\\\\\'.bold.green + '_' + '       ',
      '   _' + '\\/\\\\\\'.bold.red + '_________________' + '\\/\\\\\\'.bold.yellow + '______' + '\\//\\\\\\'.bold.green + '______' + '\\///'.bold.green + '__',
      '    _' + '\\/\\\\\\\\\\\\\\\\\\\\\\'.bold.red + '_________' + '\\/\\\\\\'.bold.yellow + '_______' + '\\////\\\\\\'.bold.green + '_________' + '     ',
      '     _' + '\\/\\\\\\///////'.bold.red + '__________' + '\\/\\\\\\'.bold.yellow + '__________' + '\\////\\\\\\'.bold.green + '______' + '    ',
      '      _' + '\\/\\\\\\'.bold.red + '_________________' + '\\/\\\\\\'.bold.yellow + '_____________' + '\\////\\\\\\'.bold.green + '___' + '   ',
      '       _' + '\\/\\\\\\'.bold.red + '_________________' + '\\/\\\\\\'.bold.yellow + '______' + '/\\\\\\'.bold.green + '______' + '\\//\\\\\\'.bold.green + '__',
      '        _' + '\\/\\\\\\'.bold.red + '______________' + '/\\\\\\\\\\\\\\\\\\\\\\'.bold.yellow + '_' + '\\///\\\\\\\\\\\\\\\\\\\\\\/'.bold.green + '___',
      '         _' + '\\///'.bold.red + '______________' + '\\///////////'.bold.yellow + '____' + '\\///////////'.bold.green + '_____',
      ''
    ].join('\n');
    console.log(content);
  };

  function hasArgv(argv, search) {
    var pos = argv.indexOf(search);
    var ret = false;
    while (pos > -1) {
      argv.splice(pos, 1);
      pos = argv.indexOf(search);
      ret = true;
    }
    return ret;
  }

  //run cli tools
  fis.cli.run = function(argv) {

    if (hasArgv(argv, '--no-color')) {
      fis.cli.colors.mode = 'none';
    }

    var first = argv[2];
    if (argv.length < 3 || first === '-h' || first === '--help') {
      fis.cli.help();
    } else if (first === '-v' || first === '--version') {
      fis.cli.version();
    } else if (first[0] === '-') {
      fis.cli.help();
    } else {
      //register command
      var commander = fis.cli.commander = require('commander');
      var cmd = fis.require('command', argv[2]);
      cmd.register(
        commander
        .command(cmd.name || first)
        .usage(cmd.usage)
        .description(cmd.desc)
      );
      commander.parse(argv);
    }
  };

  fis.cli.run(process.argv);
});
