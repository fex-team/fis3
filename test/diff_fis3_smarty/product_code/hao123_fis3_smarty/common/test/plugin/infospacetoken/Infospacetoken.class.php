<?php

/**
 * infospace获取signer方法，是通过调用InfoSpaceRequestSigner类来运算得出的
 * @Author Frank Feng
 * @2014.7.30
 */

require_once dirname(__FILE__)."/Infospacerequestsigner.class.php";

class Infospacetoken  {

    public function process(&$origin_data, $params){

        // 固定的token
        $token = $params['token'];
        // 搜索query
        $query = $_GET['query'];

        if(empty($token)) {
            return false;
        }

        // 获取signer
        $signer = new InfoSpaceRequestSigner($token);

        $signer = $signer->getSignature($query);

        if(empty($signer) || !empty($origin_data['infoSpaceSigner'])) {
            return false;
        }

        // 将获取到的signer merge进cms数据中
        $origin_data['infoSpaceSigner'] = $signer;
    }
}
