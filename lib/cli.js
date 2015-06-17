/**
 * fis命令行操作处理
 */

/** @module fis.cli */

var cli = module.exports = {};
var path = require('path');
var _ = require('./util.js');
var util = require('util');
var lolcat = require('fis-lolcat');

cli.name = 'fis3';

//colors
cli.colors = require('colors');

//commander object
cli.commander = null;

//package.json
cli.info = fis.util.readJSON(path.dirname(__dirname) + '/package.json');

/**
 * 帮助模式
 * @param  {String} cmdName  命令名称
 * @param  {Object} options  配置
 * @param  {Object} commands 支持命令
 */
cli.help = function(cmdName, options, commands) {
  var strs = [
    '',
    ' Usage: ' + cli.name + ' ' + (cmdName ? cmdName : '<command>')
  ];

  if (!cmdName) {
    commands = {};
    fis.media().get('modules.commands', []).forEach(function(name) {
      var cmd = fis.require('command', name);
      name = cmd.name || name;
      name = fis.util.pad(name, 12);
      commands[name] = cmd.desc || '';
    });

    options =  {
      '-h, --help': 'print this help message',
      '-v, --version': 'print product version and exit',
      '-r, --root <path>': 'specify project root',
      '-f, --file <filename>': 'specify the file path of `fis-conf.js`',
      '--no-color': 'disable colored output',
      '--verbose': 'enable verbose mode'
    };
  }

  options = options || {};
  commands = commands || {};
  var optionsKeys = Object.keys(options);
  var commandsKeys = Object.keys(commands);
  var maxWidth;

  if (commandsKeys.length) {
    maxWidth = commandsKeys.reduce(function(prev, curr) {
      return curr.length > prev ? curr.length : prev;
    }, 0) + 4;

    strs.push(null, ' Commands:', null);

    commandsKeys.forEach(function(key) {
      strs.push(util.format('   %s %s', _.pad(key, maxWidth), commands[key]));
    });
  }

  if (optionsKeys.length) {
    maxWidth = optionsKeys.reduce(function(prev, curr) {
      return curr.length > prev ? curr.length : prev;
    }, 0) + 4;

    strs.push(null, ' Options:', null);

    optionsKeys.forEach(function(key) {
      strs.push(util.format('   %s %s', _.pad(key, maxWidth), options[key]));
    });

    strs.push(null);
  }

  console.log(strs.join('\n'));
};

fis.set('modules.commands', ['init', 'install', 'release', 'server', 'inspect']);

//output version info
cli.version = function() {
  var content = ['',
    '  v' + cli.info.version,
    ''
  ].join('\n');

  var logo;

  if (fis.util.isWin()) {
    logo = [
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
  } else {
    logo = [
      '   /\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\  /\\\\\\\\\\\\\\\\\\\\\\     /\\\\\\\\\\\\\\\\\\\\\\   ',
      '   \\/\\\\\\///////////  \\/////\\\\\\///    /\\\\\\/////////\\\\\\        ',
      '    \\/\\\\\\                 \\/\\\\\\      \\//\\\\\\      \\///  ',
      '     \\/\\\\\\\\\\\\\\\\\\\\\\         \\/\\\\\\       \\////\\\\\\              ',
      '      \\/\\\\\\///////          \\/\\\\\\          \\////\\\\\\          ',
      '       \\/\\\\\\                 \\/\\\\\\             \\////\\\\\\      ',
      '        \\/\\\\\\                 \\/\\\\\\      /\\\\\\      \\//\\\\\\  ',
      '         \\/\\\\\\              /\\\\\\\\\\\\\\\\\\\\\\ \\///\\\\\\\\\\\\\\\\\\\\\\/   ',
      '          \\///              \\///////////    \\///////////     ',
      ''
    ].join('\n');
  }

  if (fis.get('options.color') !== false) {
    logo = lolcat(logo);
  }
  console.log(content + '\n' + logo);
};

/**
 * fis由命令行到内核执行的入口
 * @param  {Array} argv process.argv
 * @param  {Array} env  liftoff env
 */
cli.run = function(argv, env) {
  // [node, realPath(bin/fis.js)]
  var argvRaw = process.argv;

  process.title = 'fis ' + process.argv.slice(2).join(' ') + ' [ ' + env.cwd + ' ]';

  if (argv.verbose) {
    fis.log.level = fis.log.L_ALL;
  }

  fis.set('options', argv);
  fis.project.setProjectRoot(env.cwd);

  if (env.configPath) {
    try {
      require(env.configPath);
    } catch (e) {
      fis.log.error('Load %s error: %s \n %s', env.configPath, e.message, e.stack);
    }

    fis.emit('conf:loaded');
  }

  if (fis.media().get('options.color') === false) {
    cli.colors.mode = 'none';
  }

  if (!argv._.length) {
    cli[argv.v || argv.version ? 'version' : 'help']();
  } else {

    // tip
    if (argvRaw[2] === 'release' && !env.modulePath) {
      //fis.log.warning('Local `fis3` not found, use global version instead.');
    }

    //fix args
    var p = argvRaw.indexOf('--no-color');
    ~p && argvRaw.splice(p, 1);

    p = argvRaw.indexOf('--media');
    ~p && argvRaw.splice(p, argvRaw[p + 1][0] === '-' ? 1 : 2);

    //register command
    var commander = cli.commander = require('commander');
    var cmd = fis.require('command', argvRaw[2]);

    if (cmd.register) {
      // 兼容旧插件。
      cmd.register(
        commander
        .command(cmd.name || first)
        .usage(cmd.usage)
        .description(cmd.desc)
      );
      commander.parse(argvRaw);
    } else {
      cmd.run(argv, cli, env);
    }
  }
};
