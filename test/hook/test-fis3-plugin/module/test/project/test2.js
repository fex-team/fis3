/**
 * Created by wangfangguo on 14-9-3.
 */
/**
 * Created by wangfangguo on 14-9-2.
 */
var cpus = require('os').cpus().length;
var net = require('net');
var child = require('child_process');
var server = net.createServer();
server.listen(8080);
var works = [];

for(var i = 1;i <= cpus;i ++){
  CreateServer();
}

//主进程退出，则杀死所有子进程
process.on('exit',function(){
  for(var i = 1;i <= cpus;i ++){
    works[i].kill();
  }
  console.log('master work has exit');
});

//创建子进程，并添加异常退出的自启动机制，保持健壮性
function CreateServer(){
  var id = getId();
  if(!id) return ;
  var work = child.fork(__dirname+'/work.js');
  work.send('server',server);
  works[id] = work;
  console.log('work process '+id+"has create,wite process id : "+work.pid+'.');
  work.on('message',function(m,tcp){
    // console.log(tcp);
  });
  work.on('exit',function(err){
    console.log(err);
    console.log("work process "+id +"has exit ,with process id : "+work.pid+'.');
    delete works[id];
    CreateServer();
  });
}


function getId(){
  for(var i = 1;i <= cpus;i ++){
    if(!works[i]){
      return i;
    }
  }
  return 0;
}
