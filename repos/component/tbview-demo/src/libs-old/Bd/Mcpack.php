<?php
/**
 * mcpack
 * @author xuliqiang <xuliqiang@baidu.com>
 * @TODO mcpack1 and mcpack2
 * @package baidu
 * @since 2010-05-24
 *
 */
class Bd_Mcpack
{
    public static function array2pack($arrInput)
    {
        $strRet = mc_pack_array2pack($arrInput);
        if (! $strRet) $strRet = '';
        return $strRet;
    }
    
    public static function pack2array($strPack)
    {
        $arrRet = array();
        if (! empty($strPack)) {
            $arrRet = mc_pack_pack2array($strPack);
        }
        return $arrRet;
    }
    
    public static function pack2text($strPack)
    {
        //TODO
        
    }
    
    public static function text2pack($strText)
    {
        //TODO
    }
}