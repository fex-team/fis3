<?php
/***************************************************************************
 * 
 * Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
 * $Id: UrlCrypt.php,v 1.0 2012/03/21 12:05:28 wenweidong $ 
 * 
 **************************************************************************/

/**
 * @file Bd/Pic/UrlCrypt.php
 * @author wenwedong(wenweidong@baidu.com)
 * @date 2012/03/21 12:35:23
 * @version 1.0.0.0
 * @brief 生成和解密图片url的库(需要php fcrypt扩展)
 * 
 **/

class Bd_Pic_UrlCrypt
{
    private  $crypt_key = 'space';
    const    _DOMAIN = 'hiphotos.baidu.com';
    private  $_query_string_pre = "?";
    private  $_err_no = 0;
    private  $_err_msg = "";
    function __construct() {
    }
    function __destruct() {

    }
    /**
	 * @brief 批量生成图片url
	 * @param 批量pid数组
	 * @return 批量url数组,err_no不等于0表示错误，err_msg表示错误信息，resps是url的数组
	 * @author wenweidong
	 * @date 2012/03/21 11:31:37
	 * @note
	 */

    public function BatPid2Url($BatPidReqs){
        $BatUrls =  array();
        for($i = 0;$i<count($BatPidReqs);$i++) {
            $pic_url = "";
            if(!$this->Pid2Url($BatPidReqs[$i],$pic_url)) {
                return array("err_no"=>$this->_err_no,"err_msg"=>$this->_err_msg,"resps"=>array());    
            }
            $BatUrls[] = $pic_url;
        }
        return array("err_no"=>$this->_err_no,"err_msg"=>$this->_err_msg,"resps"=>$BatUrls);
    }
    private function Pid2Url($PidReq,&$pic_url) {
        $pic_url = "http://";
        $this->_query_string_pre = "?";
        if(!$this->_check_param($PidReq,$pic_url)) {
            return false;
        }
        if(!$this->_append_domain($PidReq,$pic_url)) {
            return false;
        }
        $pic_url.=$PidReq['product_name']."/";
        if(!$this->_append_spec_sign($PidReq,$pic_url))
        {
            return false;
        }
        if(!$this->_append_pid_sign($PidReq,$pic_url))
        {
            return false;
        }
        if(!$this->_append_private_sign($PidReq,$pic_url))
        {
            return false;
        }
        if(!$this->_append_referer_sign($PidReq,$pic_url))
        {
            return false;                                                                              
        }                                                                                                         
        return true;
    }

    /**
	 * @brief 解密图片id
	 * @param 加密前的字符串
	 * @return 正确返回pic_id,错误返回false
	 * @author wenweidong
	 * @date 2012/03/21 11:31:37
	 * @note
	 */

	public function decode_pic_url_crypt($strCrypt) {
		$data = pack('H*', $strCrypt);
		$data = fcrypt_decode_hmac($this->crypt_key, $data);

		if (strlen($data) == 8) {
			$result = $this->unpackUInt32(substr($data, 0, 4));
			$intID1 = $result;
			$result = $this->unpackUInt32(substr($data, 4, 4));
			$intID2 = $result;
			return $intID2;
		} else if (strlen($data) == 16) {
			$intID1 = $this->unpackUInt64(substr($data, 0, 8));
			$intID2 = $this->unpackUInt64(substr($data, 8, 8));
			return $intID2;
		} else {
			return false;
		}   
	}
	/**
	 * 从一个8字节的二进制(小端编码)串中解析出64位整形数
	 * @param $data
	 */
	private function unpackUInt64($data) {
		$data = strval($data);
		
		$ret = 0;
		$ret += (ord($data[0]) << 0);
		$ret += (ord($data[1]) << 8);
		$ret += (ord($data[2]) << 16);
		$ret += (ord($data[3]) << 24);
		$ret += (ord($data[4]) << 32);
		$ret += (ord($data[5]) << 40);
		$ret += (ord($data[6]) << 48);
		$ret += (ord($data[7]) << 56);
		return $ret;
	}
    
    private function unpackUint32($data){
        $data = strval($data);

        $ret = 0;
        $ret += (ord($data[0]) << 0);
        $ret += (ord($data[1]) << 8);
        $ret += (ord($data[2]) << 16);
        $ret += (ord($data[3]) << 24);

        return $ret;
    }
    private function _check_param($PidReq,&$pic_url){
        if(strlen($PidReq['product_name'])<3) {
            $this->_err_msg = "product_name[".$PidReq['product_name']."] too small,need three char more";
            return false;
        }
        if(isset($PidReq['private_flag'])) {
            if(1 !=$PidReq['private_flag'])
            {
                $this->_err_msg ="have private_flag but 0";
                return false;
            }
            if(!isset($PidReq['visitor_uid']) || !isset($PidReq['timeout']) || !isset($PidReq['force_view_private']) )
            {
                $this->_err_msg = "haven't  visitor_uid,timeout,force_view_private";
                return false;
            }
        }
        return true;
    }
    private function  _append_domain($PidReq,&$pic_url){                                  
        if(isset($PidReq['domain'])) {                                                                           
            $domain = $PidReq['domain'];                                                                        
        }else {                                                                                                   
            if(isset($PidReq['private_flag'])) {                                                                  
                $domain= "priv.".self::_DOMAIN;                                                                         
            }else
            {   
                $pan_domain = "abcdefgh";                                                                              
                $domain = ($pan_domain{$PidReq['pic_id']%8}).".".self::_DOMAIN;                                                                         
            }                                                                                                 
        }                                                                                                         
        $pic_url .=$domain."/";                                                                                     
        return true;                                                                                           
    } 

    private function _append_pid_sign($PidReq,&$pic_url){
        $foreign_key =1;
        if(isset($PidReq['foreign_key'])){
            $foreign_key = intval($PidReq['foreign_key']);
        }
        $strtmp = pack("IIII",$foreign_key&0xFFFFFFFF,$foreign_key>>32,$PidReq['pic_id']&0xFFFFFFFF,$PidReq['pic_id']>>32);
        $pid_sign= (bin2hex(fcrypt_encode_hmac($this->crypt_key,$strtmp)));
        $pic_url .=$pid_sign.".jpg";
        return true;
    } 
    private function _append_spec_sign($PidReq,&$pic_url){                               
        $pic_spec = isset($PidReq['pic_spec'])?$PidReq['pic_spec']:"pic";                                        
        if("pic" == $pic_spec || "mpic" == $pic_spec || "abpic"==$pic_spec) {                                        
            $pic_url .=$pic_spec."/item/";                                                                      
        }else { 
            $pic_spec_tmp = pack("IIa*",$PidReq['pic_id']&0xFFFFFFFF,$PidReq['pic_id']>>32,$pic_spec);
            $sign_data = substr($this->_create_sign($pic_spec_tmp),0,32);                  
            $pic_url .=urlencode($pic_spec)."/sign=".$sign_data."/";
        }                                                                                   
        return true;
    }  
    private function _append_private_sign($PidReq,&$pic_url){                            
        if(isset($PidReq['private_flag'])) {                                                                          
            $visitor_uid = $PidReq['visitor_uid'];                                                     
            $timeout =  $PidReq['timeout'];
            if(1 ==$PidReq['force_view_private'])
            {                                                           
                $visitor_uid=$timeout=0;                                                                
            }    
            $strtmp =
                pack("IIIII",$PidReq['pic_id']&0xFFFFFFFF,$PidReq['pic_id']>>32,$visitor_uid,$timeout,$PidReq['force_view_private']);
            $psign =  (bin2hex(fcrypt_encode_hmac($this->crypt_key,$strtmp)));
            $pic_url .="?psign=$psign";
            $this->_query_string_pre= "&";                                                                          
        }
        return true;
    }
    private function _append_referer_sign($PidReq,&$pic_url){
        if(!isset($PidReq['referer'])) {
            return true;
        }
        $referer_tmp = pack("IIa*",$PidReq['pic_id']&0xFFFFFFFF,$PidReq['pic_id']>>32,$PidReq['referer']);
        $pic_url .=$this->_query_string_pre."referer=".$this->_create_sign($referer_tmp);
        $this->_query_string_pre = "&";
        return true;
    }                                                                                                             
    /**
     * 生成图片sign
     * $sign_str 加密前的字符串
     */
    private function _create_sign($sign_str){
        $s = fcrypt_encode_hmac($this->crypt_key, $sign_str);
        return (bin2hex($s));
    }
}
?>
