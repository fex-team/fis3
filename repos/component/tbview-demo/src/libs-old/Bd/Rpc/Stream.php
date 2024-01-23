<?php
/**
 * stream_socket rpc 
 * TODO
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package baidu
 * @since 2010-06-09
 */
require_once 'Bd/Rpc/Abstract.php';
require_once 'Bingo/Http/Request.php';
class Bd_Rpc_Stream extends Bd_Rpc_Abstract
{
    protected $_recConn = null;
    
    protected $_intConnectTimeout = 200;
    
    protected $_intReadTimeout = 200;
    
    protected $_intWriteTimeout = 200;
    
    protected $_objBalance = null;
    
    protected $_arrServers = array();
    
    protected $_arrNowServer = array();
    
    public function __construct($strServerName, $arrServers=array())
    {
        //TODO
    }
}