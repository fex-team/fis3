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
    logger.warning('Local `fis3` not found, use global version instead.');
    fis = require('../');
  } else {
    fis = require(env.modulePath);
    fis.set('globalNPMFolder', path.dirname(__dirname));
  }

  process.env.NODE_ENV = process.env.NODE_ENV || argv.env || 'dev';

  // default settings
  fis.config.merge({
    modules: {
      plugin: 'components, module',
      packager: 'map',
      deploy: 'default'
    },
    project: {
      files: ['*.html', '!output/**', '!node_modules/**'],
      watch: {
        exclude: /^\/(?:output|node_modules).*$/i,
      }
    }
  });

  fis.match('*.js', {
    postprocessor: fis.plugin('jswrapper'),
  });

  fis.env('production')
    .match('*.js', {
      optimizer: fis.plugin('uglify-js')
    })
    .match('*.css', {
      optimizer: fis.plugin('clean-css')
    })
    .match('*.png', {
      optimizer: fis.plugin('png-compressor')
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
      '    --env          set env, default value is `dev`.',
      ''
    ]);

    console.log(content.join('\n'));
  };

  fis.cli.help.commands = ['init', 'release', 'install', 'server'];

  //output version info
  fis.cli.version = function() {
    var content = ['',
      '  v' + fis.cli.info.version,
      ''
    ].join('\n');

    var logo = [
      ' __/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\_____/\\\\\\\\\\\\\\\\\\\\\\___',
      '  _\\/\\\\\\///////////__\\/////\\\\\\///____/\\\\\\/////////\\\\\\_       ',
      '   _\\/\\\\\\_________________\\/\\\\\\______\\//\\\\\\______\\///__',
      '    _\\/\\\\\\\\\\\\\\\\\\\\\\_________\\/\\\\\\_______\\////\\\\\\_________     ',
      '     _\\/\\\\\\///////__________\\/\\\\\\__________\\////\\\\\\______    ',
      '      _\\/\\\\\\_________________\\/\\\\\\_____________\\////\\\\\\___   ',
      '       _\\/\\\\\\_________________\\/\\\\\\______/\\\\\\______\\//\\\\\\__',
      '        _\\/\\\\\\______________/\\\\\\\\\\\\\\\\\\\\\\_\\///\\\\\\\\\\\\\\\\\\\\\\/___',
      '         _\\///______________\\///////////____\\///////////_____',
      ''
    ].join('\n');

    if (fis.get('cli.options.color') !== false) {
      logo = fis.lolcat(logo);
    }
    console.log(content + '\n' + logo);
  };

  //run cli tools
  fis.cli.run = function(argv) {

    if (fis.get('cli.options.color') === false) {
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

      //fix args
      var p = argv.indexOf('--no-color');
      if (~p) argv.splice(p, 1);

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

  fis.set('cli.options', argv);
  fis.cli.run(process.argv);
});
