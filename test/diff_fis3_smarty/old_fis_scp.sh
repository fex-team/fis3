cd#!/home/work/.jumbo/bin/expect
TEST_PATH=/home/work/repos/fis3.0/test/diff_fis3_smarty/old_node_modules
#TEST_PATH=/Users/ryan/workspace/fis-plus/test/old_node_modules
cd ${TEST_PATH}
npm install fis3@3.1

#set timeout 60
#set p [lindex $argv 0]
#spawn su - fis -c "sh /home/fis/npm/lib/upload.sh"
#expect "Password:"
#send $p\r
#expect "fis@fe's password:"
#send $p\r
#expect eof
exit
