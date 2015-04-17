var cli = module.exports = {};
var path = require('path');

cli.name = 'fis';

//colors
cli.colors = require('colors');

//commander object
cli.commander = null;

//package.json
cli.info = fis.util.readJSON(path.dirname(__dirname) + '/package.json');

//output help info
cli.help = function() {
  var content = [
    '',
    '  Usage: ' + cli.name + ' <command>',
    '',
    '  Commands:',
    ''
  ];

  cli.help.commands.forEach(function(name) {
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

cli.help.commands = ['init', 'release', 'install', 'server'];

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

//run cli tools
cli.run = function(argv, env) {
  var argvRaw = process.argv;

  if (fis.env().get('cli.options.color') === false) {
    cli.colors.mode = 'none';
  }

  if (!argv._.length) {
    cli[argv.v || argv.version ? 'version' : 'help']();
  } else {
    fis.set('cli.options', argv);

    // tip
    if (argvRaw[2] === 'release' && !env.modulePath) {
      fis.log.warning('Local `fis3` not found, use global version instead.');
    }

    //fix args
    var p = argvRaw.indexOf('--no-color');
    ~p && argvRaw.splice(p, 1);

    p = argvRaw.indexOf('--env');
    ~p && argvRaw.splice(p, argvRaw[p + 1][0] === '-' ? 1 : 2);

    //register command
    var commander = cli.commander = require('commander');
    var cmd = fis.require('command', argvRaw[2]);
    cmd.register(
      commander
      .command(cmd.name || first)
      .usage(cmd.usage)
      .description(cmd.desc)
    );
    commander.parse(argvRaw);
  }
};

// default settings
fis.env('dev')
  .set('cli.options', {
    optimize: false,
    md5: 0,
    lint: false,
    test: false
  })
  .match('**', {
    useHash: false,
    useDomain: false
  });

fis.env('production')
  .set('cli.options', {
    optimize: true,
    md5: 5,
    lint: false,
    test: false
  })
  .match('**.js', {
    optimizer: fis.plugin('uglify-js')
  })
  .match('**.css', {
    optimizer: fis.plugin('clean-css')
  })
  .match('**.png', {
    optimizer: fis.plugin('png-compressor')
  });
