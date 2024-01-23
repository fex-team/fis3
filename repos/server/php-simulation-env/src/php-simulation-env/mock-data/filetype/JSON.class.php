<?php

class JSON extends File {
    public function getData() {
        $content = file_get_contents($this->filepath);
        $ret = json_decode($content, true);
        return Util::arrayConvertEncoding($ret, $this->encoding);
    }
}
