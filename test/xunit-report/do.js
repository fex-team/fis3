/* 用来删除写到xunit report里的install信息 */

 var fs = require('fs');
 var file = "report.xml";
 var content = fs.readFileSync(file,'utf-8');
 content = content.replace(/\binstall.*\n/gi,'');
 fs.writeFileSync(file, content,"utf-8");