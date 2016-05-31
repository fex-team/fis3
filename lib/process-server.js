var fis = require('../');
var argv = require('minimist')(process.argv.slice(2));
var ipc = require('node-ipc');
var async = require('async');

// fis.log.level = fis.log.L_ALL;

ipc.config.id = argv['ipc-id'];
ipc.config.retry = 1500;
ipc.config.rawBuffer = true;
ipc.config.encoding = 'hex';

if (argv.config) {
  require(argv.config);
}

fis.project.setProjectRoot(argv.root);

fis.util.pipe('hook', function(processor, settings) {
  processor(fis, settings);
});

ipc.serve(
  function() {
    // 别删！！告诉 client，服务已经开启，可以开始尝试连接了。
    console.log('ready');

    var cachedBuffer = new Buffer(0);
    var queue = async.queue(function(buf, callback) {
      var data = fis.util.unSeralize(buf);

      if (data[0] === 'init') {
        fis.compile.setup(data[1]);
        callback();
      } else if (data[0] === 'compile') {
        var info = data[1];
        var context = data[2];
        var content = data[3];

        var file = fis.file(info.realpath);
        file.revertFromCacheData(info);

        if (file.isText()) {
          file.setContent(content.toString('utf8'));
        } else {
          file.setContent(content);
        }

        context.fromIPC = true;
        fis.compile.processAsync(file, context, function(error) {
          if (error) {
            return console.log(error);
          }

          ipc.server.emit(socket, fis.util.seralize('compileEnd',
            file.getCacheData(),
            file.getContent()
          ));

          callback();
        });
      }
    }, 1);

    var socket;
    ipc.server.on(
      'data',
      function(buf, _socket) {
        socket = _socket;
        cachedBuffer = Buffer.concat([cachedBuffer, buf], cachedBuffer.length + buf.length);

        while (cachedBuffer.length) {
          var len = cachedBuffer.readUInt32BE(0);
          if (len > cachedBuffer.length) {
            break;
          }

          var subbuf = cachedBuffer.slice(0, len);
          cachedBuffer = cachedBuffer.slice(len, cachedBuffer.length);

          if (fis.util.unSeralizeValid(subbuf)) {
            queue.push(subbuf);
          } else {
            throw new Error('error');
          }
        }


      }
    );
  }
);

ipc.server.start();
