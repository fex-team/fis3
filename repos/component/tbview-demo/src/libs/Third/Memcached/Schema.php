<?php
/***************************************************************************
 * 
 * Copyright (c) 2011 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file Schema.php
 * @author wangweibing(com@baidu.com)
 * @date 2011/02/24 21:24:13
 * @brief 
 *  
 **/

require_once(dirname(__FILE__) . "/Log.php");

class Ak_Schema {
    protected $struct_def = null;

    protected function __construct() {}

    protected static function _isBasicType($type) {
        $basic_types = array('bool', 'int', 'float', 'string', 'array', 'dict', 'object', 'any', 'multi');
        return in_array($type, $basic_types, true);
    }

    protected static function _checkRange($min, $max, $val) {
        if (isset($max) && $val > $max) {
            Ak_Log::warning("value[$val] > max[$max]");
            return false;
        }
        if (isset($min) && $val < $min) {
            Ak_Log::warning("value[$val] < min[$min]");
            return false;
        }
        return true;
    }

    public static function create($struct_def) {
        $struct_def_new = array();
        foreach($struct_def as $type => $def) {
            if (self::_isBasicType($type)) {
                Ak_Log::warning("type[$type] is basic type");
                return null;
            }
            $base_list = array($type);
            while (!self::_isBasicType($def['base'])) {
                if (in_array($def['base'], $base_list)) {
                    Ak_Log::warning("type[{$def['base']}] inherite recursively");
                    return null;
                }
                $base_list[] = $def['base'];

                $base_def = $struct_def[$def['base']];
                if (!is_array($base_def)) {
                    Ak_Log::warning("type[{$def['base']}] not found");
                    return null;
                }

                foreach ($base_def as $k => $v) {
                    switch($k) {
                    case 'base':
                        $def[$k] = $base_def[$k];
                        break;
                    case 'members':
                    case 'alias':
                        if (!is_array($def[$k])) {
                            $def[$k] = array();
                        }
                        foreach ($base_def[$k] as $k2 => $v2) {
                            if (!isset($def[$k][$k2])) {
                                $def[$k][$k2] = $base_def[$k][$k2];
                            }
                        }
                        break;
                    default:
                        if (!isset($def[$k])) {
                            $def[$k] = $base_def[$k];
                        }
                    }
                }
            }
            $struct_def_new[$type] = $def;
        }
        $schema = new Ak_Schema();
        $schema->struct_def = $struct_def_new;
        return $schema;
    }


    public function validate($type, $val, &$return) {
        $return = false;
        if(self::_isBasicType($type)) {
            $def = array('base' => $type);
        } else {
            $def = @$this->struct_def[$type];
        }
        if(!is_array($def)) {
            Ak_Log::warning("type[$type] not exists");
            return null;
        }

        //check if value is null
        if (is_null($val)) {
            if (isset($def['default'])) {
                $val = $def['default'];
            } elseif (@$def['optional']) {
                $return = true;
                return null;
            } else {
                Ak_Log::warning("value is null");
                return null;
            } 
        }

        //check if value matches the type
        switch($def['base']) {
        case 'bool':
            if (!is_bool($val)) {
                Ak_Log::warning("value[$val] is not bool");
                return null;
            }
            break;
        case 'int':
            if (!is_int($val)) {
                Ak_Log::warning("value[$val] is not int");
                return null;
            }
            break;
        case 'float':
            if (!is_float($val)) {
                Ak_Log::warning("value[$val] is not float");
                return null;
            }
            break;
        case 'string':
            if (!is_string($val)) {
                Ak_Log::warning("value[$val] is not string");
                return null;
            }
            break;
        case 'array':
            if (!is_array($val)) {
                Ak_Log::warning("value[$val] is not array");
                return null;
            }
            break;
        case 'dict':
            if (!is_array($val)) {
                Ak_Log::warning("value[$val] is not dict");
                return null;
            }
            break;
        case 'object':
            if (!is_array($val)) {
                Ak_Log::warning("value[$val] is not object");
                return null;
            }
            break;
        case 'any':
            break;
        case 'multi':
            $ret_all = false;
            Ak_Log::beginSub();
            foreach ($def['types'] as $t) {
                $temp_val = $this->validate($t, $val, $ret);
                if ($ret != true) {
                    Ak_Log::warning("value[$val] is not type[$t]");
                } else {
                    $val = $temp_val;
                    $ret_all = true;
                    break;
                }
            }
            if ($ret_all == true) {
                Ak_Log::endSub(false);
            } else {
                Ak_Log::endSub(true);
                return null;
            }
            break;
        default:
            Ak_Log::warning("unknown type[{$def['base']}]");
            return null;
        }

        //check if value in the array
        if (is_array(@$def['in'])) {
            $ret = in_array($val, $def['in']);
            if ($ret != true) {
                Ak_Log::warning("value[$val] not in array");
                return null;
            }
        }

        //check if the value in range
        switch ($def['base']) {
        case 'int':
        case 'float':
            if (!self::_checkRange(@$def['min'], @$def['max'], $val)) {
                Ak_Log::warning("value[$val] is not valid");
                return null;
            }
            break;
        case 'string':
            $len = strlen($val);
            if (!self::_checkRange(@$def['min_size'], @$def['max_size'], $len)) {
                Ak_Log::warning("string len[$len] is not valid");
                return null;
            }
            if (isset($def['regex']) && !preg_match($def['regex'], $val)) {
                Ak_Log::warning("value[$val] not match regex[{$def['regex']}]");
                return null;
            }
            break;
        case 'array':
        case 'dict':
            $len = count($val);
            if (!self::_checkRange(@$def['min_size'], @$def['max_size'], $len)) {
                Ak_Log::warning("item count[$len] is not valid");
                return null;
            }
            break;
        }

        //check children
        switch ($def['base']) {
        case 'array':
            $i = 0;
            foreach ($val as $k => &$v) {
                if (!is_int($k) || $k != $i) {
                    Ak_Log::warning("array index[$i] != key[$k]");
                    return null;
                }
                $v = $this->validate($def['item_type'], $v, $ret);
                if (!$ret) {
                    Ak_Log::warning("item[$k] not valid");
                    return null;
                }
                $i++;
            }
            break;
        case 'dict':
            foreach ($val as $k => &$v) {
                $this->validate($def['key_type'], $k, $ret);
                if (!$ret) {
                    Ak_Log::warning("key[$k] is not type[{$def['key_type']}]");
                    return null;
                }
                $v = $this->validate($def['value_type'], $v, $ret);
                if (!$ret) {
                    Ak_Log::warning("value of key[$k] is not type[{$def['value_type']}]");
                    return null;
                }
            }
            break;
        case 'object':
            if (!is_array(@$def['alias'])) {
                $def['alias'] = array();
            }
            foreach ($def['alias'] as $k1 => $k2) {
                if (!isset($val[$k2])) {
                    $val[$k2] = @$val[$k1];
                    unset($val[$k1]);
                }
            }
            foreach ($def['members'] as $k => $t) {
                $val[$k] = $this->validate($t, @$val[$k], $ret);
                if (!$ret) {
                    Ak_Log::warning("key[$k] is not type[$t]");
                    return null;
                }
            }
            break;
        }


        //user defined check
        $func = @$def['user_def'];
        if (is_callable($func)) {
            $val = $func($val, $ret);
            if ($ret != true) {
                Ak_Log::warning("user check[$func] failed");
                return null;
            }
        }

        $return = true;
        return $val;
    }

}





/* vim: set expandtab ts=4 sw=4 sts=4 tw=100: */
?>
