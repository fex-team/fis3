/**
 * 命令行相关的信息和工具类方法暴露在此模块中。
 * @namespace fis.cli
 */
var cli = module.exports = {};

var path = require('path');
var _ = require('./util.js');
var util = require('util');
var lolcat = require('fis-lolcat');

/**
 * 命令行工具名字
 * @memberOf fis.cli
 * @name name
 * @defaultValue fis3
 */
cli.name = 'fis3';

/**
 * 指向 {@link https://www.npmjs.com/package/colors colors} 模块。
 * @memberOf fis.cli
 * @name colors
 */
cli.colors = require('colors');

//commander object
cli.commander = null;

/**
 * package.json 中的信息
 * @memberOf fis.cli
 * @name info
 */
cli.info = fis.util.readJSON(path.dirname(__dirname) + '/package.json');

/**
 * 显示帮助信息，主要用来格式化信息，处理缩进等。fis command 插件，可以用此方法来输出帮助信息。
 *
 * @param  {String} [cmdName]  命令名称
 * @param  {Object} [options]  配置
 * @param  {Array} [commands] 支持的命令集合
 * @memberOf fis.cli
 * @name help
 * @function
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

/**
 * 输出 fis 版本信息。
 *
 * ```
 * v3.0.0
 *
 * /\\\\\\\\\\\\\\\  /\\\\\\\\\\\     /\\\\\\\\\\\
 * \/\\\///////////  \/////\\\///    /\\\/////////\\\
 *  \/\\\                 \/\\\      \//\\\      \///
 *   \/\\\\\\\\\\\         \/\\\       \////\\\
 *    \/\\\///////          \/\\\          \////\\\
 *     \/\\\                 \/\\\             \////\\\
 *      \/\\\                 \/\\\      /\\\      \//\\\
 *       \/\\\              /\\\\\\\\\\\ \///\\\\\\\\\\\/
 *        \///              \///////////    \///////////
 * ```
 *
 * @memberOf fis.cli
 * @name version
 * @function
 */
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
 * fis命令行执行入口。
 * @param  {Array} argv 由 {@link https://github.com/substack/minimist minimist} 解析得到的 argv, 已经转换成了对象。
 * @param  {Array} env  liftoff env
 * @name run
 * @memberOf fis.cli
 * @function
 */
cli.run = function(argv, env) {
  // [node, realPath(bin/fis.js)]
  var argvRaw = process.argv;

  process.title = cli.name +' ' + process.argv.slice(2).join(' ') + ' [ ' + env.cwd + ' ]';

  if (argv.verbose) {
    fis.log.level = fis.log.L_ALL;
  }

  fis.set('options', argv);
  fis.project.setProjectRoot(env.cwd);

   // 如果指定了 media 值
  if (['release', 'inspect'].indexOf(argv._[0]) > -1 && argv._[1]) {
    fis.project.currentMedia(argv._[1]);
  }

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

  var location = env.modulePath ? path.dirname(env.modulePath) : path.join(__dirname, '../');
  fis.log.info('Currently running %s (%s)', cli.name, location);

  if (!argv._.length) {
    cli[argv.v || argv.version ? 'version' : 'help']();
  } else {

    // tip
    // if (argvRaw[2] === 'release' && !env.modulePath) {
    //   fis.log.warning('Local `fis3` not found, use global version instead.');
    // }

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
