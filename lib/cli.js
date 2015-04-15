var cli = module.exports = {};
var path = require('path');

// default settings
fis.config.merge({
  modules: {
    plugin: 'module, components',
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
cli.run = function(argv, env) {
  var argvRaw = process.argv;

  if (fis.env().get('cli.options.color') === false) {
    cli.colors.mode = 'none';
  }

  if (argv.h || argv.help || !argv._.length) {
    cli.help();
  } else if (argv.v || argv.version) {
    cli.version();
  } else {
    fis.set('cli.options', argv);

    // tip
    if (!env.modulePath) {
      logger.warning('Local `fis3` not found, use global version instead.');
    }

    //fix args
    var p = argvRaw.indexOf('--no-color');
    if (~p) argvRaw.splice(p, 1);

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
