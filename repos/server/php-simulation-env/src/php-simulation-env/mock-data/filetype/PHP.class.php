<?php

class PHP extends File {
    public function getData() {
        $ret = require($this->filepath);
        if (isset($fis_data)) {
            $ret = $fis_data;
        }
        return $ret;
    }
}
