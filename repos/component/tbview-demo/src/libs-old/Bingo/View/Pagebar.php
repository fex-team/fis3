<?php
/**
 * 分页组件
 * @author xuliqiang <xuliqiang@baidu.com>
 * @package bingo
 * @since 2010-05-17
 */

abstract class Bingo_View_Pagebar
{
    protected $_intTotal = 0;
    
    protected $_intTotalPage = 1;
    
    protected $_intPageSize = 20;
    
    protected $_intPageno = 1;
    
    protected $_intOffset = 0;
    
    protected $_strLeftFormat = '[';
    
    protected $_strRightFormat = ']';
    
    public function __construct($intTotal, $intPagesize=20, $intPageno = 1)
    {
        if ($intTotal > 0)$this->_intTotal = intval($intTotal);
        if ($intPagesize > 0)$this->_intPageSize = intval($intPagesize);
        if ($intPageno > 1) $this->_intPageno = intval($intPageno);        
        $this->_intTotalPage = ceil($this->_intTotal / $this->_intPageSize);
        if ($this->_intTotalPage <=0 ) $this->_intTotalPage = 1;
        $this->_intOffset = ($this->_intPageno - 1) * $this->_intPageSize;
    }
    
    public function getOffset()
    {
        return $this->_intOffset;
    }
    
    abstract public function getUrl($intPageno);
    
    abstract public function get();
    
    public function getFirst($strClassName = '', $strPageText = '首页', $bolAlwaysDisplay = false)
    {
    	if($this->_intTotal == 0) return '';
    	if($this->_intPageno == 1){
    	    if (! $bolAlwaysDisplay) return '';
    		return $this->getNoLinkItem(1, $strClassName, $strPageText);
    	}
    	return $this->getLinkItem(1, $strClassName, $strPageText);
    }
    
    public function getLast($strClassName = '', $strPageText = '尾页',  $bolAlwaysDisplay = false)
    {
    	if($this->_intTotal == 0) return '';
    	if($this->_intPageno == $this->_intTotalPage){
    	    if (! $bolAlwaysDisplay) return '';
    		return $this->getNoLinkItem($this->_intTotalPage, $strClassName, $strPageText);
    	}
    	return $this->getLinkItem($this->_intTotalPage, $strClassName, $strPageText);
    }
    
    public function getNext($className='', $strPageText = '下一页', $alwaysDisplay = false)
    {
    	if($this->_intTotal==0)return '';
    	if(($alwaysDisplay)||($this->_intPageno < $this->_intTotalPage))
    	{
    		if($this->_intPageno < $this->_intTotalPage) return $this->getLinkItem($this->_intPageno+1, $className, $strPageText);
    		return $this->getLinkItem($this->_intTotalPage, $className, $strPageText);
    	}
    	return '';
    }
    
    public function getPre($className='', $strPageText = '上一页', $alwaysDisplay = false)
    {
    	if($this->_intTotal==0)return '';
    	if(($alwaysDisplay)||($this->_intPageno > 1))
    	{
    		if($this->_intPageno>1)return $this->getLinkItem($this->_intPageno - 1,$className, $strPageText);
    		return $this->getLinkItem(1,$className, $strPageText);
    	}
    	return '';
    }
    
    public function getBar($intNum = 10, $strClassName = '', $strNowPageClassName = 'tp', $bolNowPageNoLink = true)
    {
    	if($this->_intTotal == 0) return '';
    	$plus = ceil($intNum/2);
    	if( $intNum - $plus + $this->_intPageno > $this->_intTotalPage )
    		$plus = ($intNum - $this->_intTotalPage + $this->_intPageno);
        $begin = $this->_intPageno - $plus + 1;
        $begin = ($begin>=1)?$begin:1;
        
        $return = '';
        $tmpPageText = ''; 
        for($i = $begin ; $i < $begin + $intNum ; $i ++) 
        { 
        	if($i <= $this->_intTotalPage){
        		$tmpPageText = $this->_strLeftFormat . $i . $this->_strRightFormat;     
        		if($i == $this->_intPageno){
        			if($bolNowPageNoLink){
        				$return .= $this->getNoLinkItem($i, $strNowPageClassName, $tmpPageText);
        			}else{
        				$return .= $this->getLinkItem($i, $strNowPageClassName, $tmpPageText);
        			}
        		}else{
        			$return .= $this->getLinkItem($i, $strClassName, $tmpPageText);
        		}
            }else{ 
                break; 
            } 
        } 
        unset($begin); 
        return $return;         
    }
    
    public function getLinkItem($intPageno, $strClassName='', $strPageText='')
    {
    	if(empty($strPageText)) $strPageText = $intPageno;
    	$strRet = '<a href="' . $this->getUrl($intPageno).'"';
    	if(!empty($strClassName)) $strRet .= ' class="' . $strClassName . '"';
    	$strRet .= '>' . $strPageText . '</a>' . "\n";
    	return $strRet;
    }
    
    public function getNoLinkItem($intPageno, $strClassName='', $strPageText='')
    {
    	if(empty($strPageText)) $strPageText = $intPageno;
    	$strRet = '<span';
    	if(!empty($strClassName)) $strRet .= ' class="' . $strClassName . '"';
    	$strRet .= '>' . $strPageText . '</span>' . "\n";
    	return $strRet;
    }
    
}