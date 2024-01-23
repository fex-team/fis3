<?php
/**
 * ��JSON��ʽ�����ļ���֧�֡�
 * �Ա�׼��JSON���÷�ʽ��֧�֡�֧�����ġ�
 * ע��֮�䲻֧��Ƕ��
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2011-03-04
 */
require_once 'Bingo/Config/Abstract.php';
class Bingo_Config_Json extends Bingo_Config_Abstract
{
    /**
     * json�����ļ��ı����ʽ
     * @var string
     */
    protected $_strFromEncode     = 'GBK';
    /**
     * ������ݵı����ʽ
     * @var string
     */
    protected $_strToEncode       = 'GBK';
    /**
     * Ĭ�ϵı���ת����ʽ
     * @var unknown_type
     */
    protected $_strEncodeEngine   = 'uconv';
    /**
     * �Ƿ�������ע�ͣ���Ҫ�Ƕ�"//","#"��ע�͵�֧�֣�������ҪJson�����в��ܺ���//��#�ļ�
     * @var bool
     */
    protected $_bolSingleLineComment = true;
    
    public function __construct($arrConfig=array())
	{
		$this->setOptions($arrConfig);
	}
    
	public function setOptions($arrConfig)
    {
        if (isset($arrConfig['fileName'])) {
	        $this->setFileName($arrConfig['fileName']);
	    }
	    if (isset($arrConfig['fromEncode'])) {
	        $this->_strFromEncode = trim($arrConfig['fromEncode']);
	    }
        if (isset($arrConfig['toEncode'])) {
	        $this->_strToEncode = trim($arrConfig['toEncode']);
	    }
        if (isset($arrConfig['encodeEngine'])) {
	        $this->_strEncodeEngine = $arrConfig['encodeEngine'];
	    }
	    if (isset($arrConfig['singleLineComment'])) {
	        $this->_bolSingleLineComment = (bool) $arrConfig['singleLineComment'];
	    }
	    $this->_setOptions($arrConfig);        
    }
    
    public function load($strFileName=NULL)
    {
        if (is_null($strFileName))
	    {
	        $strFileName = $this->_strFileName;
	    }
	    parent::_cacheLoad($strFileName, array($this, 'parseFile'));
	    return $this->_arrData;
    }
    
    public function parseFile($strFileName)
    {
        $this->_arrData = null;
        $strJson = file_get_contents($strFileName);
        if ($strJson === false) {
            trigger_error('Config parse json failure[file_get_contents]!fileName['.
                $this->_strFileName.']', E_USER_WARNING);
            return true;
        }
        //��ش��������ע�͵ȵ�
        $strJson = preg_replace('/(\/\*)([\s\S]*?)(\*\/)/', '', $strJson);
        if ($this->_bolSingleLineComment) {
            $strJson = preg_replace("/\/\/(.*)\r/", '', $strJson);
            $strJson = preg_replace("/#(.*)\r/", '', $strJson);
        }
        //����ת�� 
        if (strcasecmp($this->_strFromEncode, Bingo_Encode::ENCODE_UTF8) != 0) {
            $strJson = Bingo_Encode::convert($strJson, Bingo_Encode::ENCODE_UTF8, 
                $this->_strFromEncode, $this->_strEncodeEngine);
        }
        //Json���
        $arrRet = Bingo_String::json2array($strJson, Bingo_Encode::ENCODE_UTF8, true);
        if ($arrRet === NULL || $arrRet == false) {
            trigger_error('Config parse json failure[Bingo_String::json2array]!fileName['.
                $this->_strFileName.']', E_USER_WARNING);
            return true;
        }
        //�������ת��
        if (strcasecmp($this->_strToEncode, Bingo_Encode::ENCODE_UTF8) != 0 ) {
            $arrRet = Bingo_Encode::convert($arrRet, $this->_strToEncode, 
                Bingo_Encode::ENCODE_UTF8, $this->_strEncodeEngine);
        }
        $this->_arrData = $arrRet;
        return true;
    }
    /**
     * TODO
     */
    public function save($fileName=NULL)
    {
        
    }
}