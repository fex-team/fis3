var cli = module.exports = {};
var path = require('path');
var _ = require('./util.js');
var util = require('util');

cli.name = 'fis';

//colors
cli.colors = require('colors');

//commander object
cli.commander = null;

//package.json
cli.info = fis.util.readJSON(path.dirname(__dirname) + '/package.json');

//output help info
cli.help = function(cmdName, options, commands) {
  var strs = [
    '',
    ' Usage: ' + cli.name + ' ' + (cmdName ? cmdName : '<command>')
  ];

  if (!cmdName) {
    commands = {};
    fis.env().get('modules.commands', []).forEach(function(name) {
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
      '-M, --media': 'specify the meida state.',
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

    strs.push(' Commands:', null);

    commandsKeys.forEach(function(key) {
      strs.push(util.format('   %s %s', _.pad(key, maxWidth), commands[key]));
    });

    strs.push(null);
  }

  if (optionsKeys.length) {
    maxWidth = optionsKeys.reduce(function(prev, curr) {
      return curr.length > prev ? curr.length : prev;
    }, 0) + 4;

    strs.push(' Options:', null);

    optionsKeys.forEach(function(key) {
      strs.push(util.format('   %s %s', _.pad(key, maxWidth), options[key]));
    });

    strs.push(null);
  }

  console.log(strs.join('\n'));
};

fis.set('modules.commands', ['init', 'install', 'release', 'server']);

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

  if (fis.get('cli.options.color') !== false) {
    logo = fis.lolcat(logo);
  }
  console.log(content + '\n' + logo);
};

function findConfigFile(filename, root) {
  if (!filename) return;
  var conf;

  if (fis.util.isFile(filename)) {
    conf = fis.util.realpath(filename);
  } else {
    fis.log.error('invalid fis config file path [' + filename + ']');
  }

  if (root) {
    root = fis.util.realpath(root);
    if (fis.util.isFile(root)) {
      if (!conf && fis.util.isFile(path.join(root, filename))) {
        conf = path.join(root, filename);
      }
    } else {
      fis.log.error('invalid project root path [' + root + ']');
    }

  } else {
    root = fis.util.realpath(process.cwd());
    if(!conf){
      //try to find fis-conf.js
      var cwd = root, pos = cwd.length;
      do {
        cwd  = cwd.substring(0, pos);
        conf = cwd + '/' + filename;
        if(fis.util.exists(conf)){
          root = cwd;
          break;
        } else {
          conf = false;
          pos = cwd.lastIndexOf('/');
        }
      } while(pos > 0);
    }
  }

  return {
    root: root,
    conf: conf
  }
}

//run cli tools
cli.run = function(argv, env) {
  var argvRaw = process.argv;

  process.title = 'fis ' + process.argv.slice(2).join(' ') + ' [ ' + env.cwd + ' ]';
  process.env.NODE_ENV = argv.media || argv.M || process.env.NODE_ENV || 'dev';
  if (argv.verbose) {
    fis.log.level = fis.log.L_ALL;
  }

  fis.set('options', argv);
  var info = findConfigFile(env.configPath, argv.root || argv.r);
  fis.project.setProjectRoot(info.root);
  if (info.conf) {
    var cache = fis.cache(info.conf, 'conf');
    if(!cache.revert()){
      options.clean = true;
      cache.save();
    }
    try {
      require(info.conf);
      //@TODO
      //fis.log.info('Project root [%s]', info.root);
      //fis.log.info('config file [%s]', info.conf);
    } catch (e) {
      fis.log.warn('Load %s error: %s', env.configPath, e.message);
      fis.log.debug(e.stack);
    }
  } else {
    fis.log.warning('missing config file [%s]', env.configPath);
  }

  if (fis.env().get('options.color') === false) {
    cli.colors.mode = 'none';
  }

  if (!argv._.length) {
    cli[argv.v || argv.version ? 'version' : 'help']();
  } else {

    // tip
    if (argvRaw[2] === 'release' && !env.modulePath) {
      fis.log.warning('Local `fis3` not found, use global version instead.');
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
      cmd.run(argv, cli);
    }
  }
};
