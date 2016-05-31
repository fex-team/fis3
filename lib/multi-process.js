var child_process = require('child_process');
var ipc = require('node-ipc');
var path = require('path');
var spawn = child_process.spawn;

var exports = module.exports = function(file, context, cb) {
  onIpcClientReady(function(error, client) {
    if (error) {
      return cb(error);
    }

    var cachedBuffer = new Buffer(0);

    client.on('data', function(buf) {

      cachedBuffer = Buffer.concat([cachedBuffer, buf], cachedBuffer.length + buf.length);
      if (!fis.util.unSeralizeValid(cachedBuffer)) {
        return;
      }
      buf = cachedBuffer;
      cachedBuffer = new Buffer(0);

      var data = fis.util.unSeralize(buf);

      if (data[0] === 'compileEnd') {
        file.revertFromCacheData(data[1]);
        file.setContent(data[2]);

        file.ipcId = parseInt(client.id.replace(/\D+/g, ''), 10);

        client.off('data', arguments.callee);
        clientPool.push(client);

        // console.log('End compile', file.subpath);
        cb(null);
      }
    });

    // console.log('Start compile', file.subpath);
    // console.log('Emit file to %s', client.id);
    client.emit(fis.util.seralize(
      'compile',
      file.getCacheData(),
      context,
      file.getContent()
    ));
  });
};

exports.killAll = function() {
  while (clientPool.length) {
    var client = clientPool.shift();
    ipc.disconnect(client.id);
  }

  while (serverPool.length) {
    var server = serverPool.shift();
    process.kill(server.pid);
  }
}

var clientPool = [];
var serverPool = [];
var ipcIdIndex = 1;
function onIpcClientReady(cb) {
  if (clientPool.length) {
    return cb(null, clientPool.shift());
  }

  var ipcId = 'fis-compile-' + ipcIdIndex++;
  var args = [
    path.join(__dirname, 'process-server.js'),
    '--ipc-id',
    ipcId,
    '--config',
    fis.get('configPath'),
    '--root',
    fis.project.getProjectPath()
  ];

  var server = spawn(process.execPath, args, {
    cwd: __dirname
  });

  // var fs = require('fs');
  // server.stdout.pipe(fs.createWriteStream('debug_' + ipcId + '.info'));
  // server.stderr.pipe(fs.createWriteStream('debug_' + ipcId + '.info'));

  server.stdout.on('data', function(chunk) {
    var fn = arguments.callee;
    chunk = chunk.toString('utf8');

    // console.log(chunk);

    if (~chunk.indexOf('ready')) {
      server.stdout.removeListener('data', fn);

      server.stdout.pipe(process.stdout);
      server.stderr.pipe(process.stderr);
      connectToServer();
    }
  });

  server.on('exit', function(code) {
    // console.log('Server exit with code %s!', code);
  });

  serverPool.push(server);

  function connectToServer() {
    ipc.config.id = ipcId;
    ipc.config.silent = true;
    ipc.config.retry= 1500;
    ipc.config.rawBuffer=true;
    ipc.config.encoding='hex';

    ipc.connectTo(ipcId, function() {
      var client = ipc.of[ipcId];

      client.on('connect', function() {
        fis.log.debug('ipc connected');
        // console.log('ipc connected %s', ipcId);

        client.emit(fis.util.seralize('init', fis.compile.settings));
        cb(null, client);
      })
    });
  }
}
