#!/home/work/.jumbo/bin/expect

set timeout 360
set p [lindex $argv 0]
set o [lindex $argv 1]
spawn su "npm install fis3-smarty --registry https://registry.npm.taobao.org"
expect "Password:"
send $p\r
expect eof

spawn su - fis -c "sh /home/work/repos/fis3.0/test/diff_fis3_smarty/release$o.sh old"
expect "Password:"
send $p\r
expect eof
exit
