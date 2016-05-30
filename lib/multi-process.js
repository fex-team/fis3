var child_process = require('child_process');
var ipc = require('node-ipc');
var path = require('path');
var spawn = child_process.spawn;
var settings = {};

var exports = module.exports = function(file, context, cb) {
  onIpcClientReady(function(error, client) {
    if (error) {
      return cb(error);
    }

    var info = new Buffer(JSON.stringify(file.getCacheData()), "utf8");
    var contextBuf = new Buffer(JSON.stringify(context || {}), "utf8");
    var content = file.getContent();

    if (typeof content === 'string') {
      content = new Buffer(content, "utf8");
    }

    var buf = Buffer.allocUnsafe(12);
    buf.writeInt32BE(12, 0);
    buf.writeInt32BE(info.length, 4);
    buf.writeInt32BE(contextBuf.length, 8);

    var message = Buffer.concat([buf, info, contextBuf, content], buf.length + info.length + contextBuf.length + content.length);
    client.emit(message);
  });
};

var clientPool = [];
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

  server.stdout.on('data', function(chunk) {
    var fn = arguments.callee;
    chunk = chunk.toString('utf8');

    console.log(chunk);

    if (~chunk.indexOf('ready')) {
      // server.stdout.removeListener('data', fn);
      connectToServer();
    }
  });

  server.on('exit', function() {
    console.log('Server exit!');
  })

  function connectToServer() {
    ipc.config.id = ipcId;
    // ipc.config.silent = true;
    ipc.config.retry= 1500;
    ipc.config.rawBuffer=true;
    ipc.config.encoding='hex';

    ipc.connectTo(ipcId, function() {
      var client = ipc.of[ipcId];

      client.on('connect', function() {
        fis.log.debug('ipc connected');

        cb(null, client);
      })
    });
  }
}

exports.setup = function(opt) {
  fis.util.assign(settings, opt);
};
