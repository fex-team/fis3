#!/home/work/.jumbo/bin/expect

set timeout 360
set p [lindex $argv 0]
set o [lindex $argv 1]
spawn su - fis -c "sh /Users/ryan/workspace/fis-plus/test/util/diff/release$o.sh old"
expect "Password:"
send $p\r
expect eof
exit
