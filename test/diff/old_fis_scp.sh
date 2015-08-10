cd#!/home/work/.jumbo/bin/expect

TEST_PATH=/Users/ryan/workspace/fis-plus/test/old_node_modules
cd ${TEST_PATH}
npm install fis-plus@0.7.2

#set timeout 60
#set p [lindex $argv 0]
#spawn su - fis -c "sh /home/fis/npm/lib/upload.sh"
#expect "Password:"
#send $p\r
#expect "fis@fe's password:"
#send $p\r
#expect eof
exit
