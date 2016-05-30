var fis = require('../');
var argv = require('minimist')(process.argv.slice(2));
var ipc = require('node-ipc');

ipc.config.id = argv['ipc-id'];
ipc.config.retry = 1500;
ipc.config.rawBuffer = true;
ipc.config.encoding = 'hex';

if (argv.config) {
  require(argv.config);
}

fis.project.setProjectRoot(argv.root);

ipc.serve(
  function() {
    // 别删！！告诉 client，服务已经开启，可以开始尝试连接了。
    console.log('ready');

    ipc.server.on(
      'data',
      function(data, socket) {
        var metaLength = data.readInt32BE(0);
        var infoLength = data.readInt32BE(4);
        var contextLenth = data.readInt32BE(8);


        var info = JSON.parse(data.slice(metaLength, metaLength + infoLength).toString("utf8"));
        var context = JSON.parse(data.slice(metaLength + infoLength, metaLength + infoLength + contextLenth).toString("utf8"));
        var content = data.slice(metaLength + infoLength + contextLenth);

        var file = fis.file(info.realpath);
        file.revertFromCacheData(info);

        if (file.isText()) {
          file.setContent(content.toString('utf8'));
        } else {
          file.setContent(content);
        }

        console.log(file, context);
        // // fis.compile()
      }
    );
  }
);

ipc.server.start();
