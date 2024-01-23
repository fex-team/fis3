<?php
/**
 * 规则路由库
 * @author xuliqiang <xuliqiang@baidu.com>
 * @since 2009-12-07
 * @example 
 * $ruleRouter = new Bingo_Router_Rule();
 * $ruleRouter->add('test',array(
 *     'rule' => array('test', ':key', 'here'),
 *     'regex' => array(
 *         ':key' => '[0-9]',
 *     ),
 * ));

 * $ruleRouter->add('test2',array(
 *     'rule' => array('test', ':key',),
 * ));

 * $ruleRouter->add('test3',array(
 *     'rule' => array(':value', ':key',),
 * ));

 * $testStr = 'test/1/here';
 * var_dump($ruleRouter->getDispatchRouter($testStr));
 * print_r($ruleRouter->getRouterParams());
 * 
 * $testStr = 'test/tt';
 * var_dump($ruleRouter->getDispatchRouter($testStr));
 * print_r($ruleRouter->getRouterParams());
 * 
 * $testStr = 'other/tt';
 * var_dump($ruleRouter->getDispatchRouter($testStr));
 * print_r($ruleRouter->getRouterParams());
 * @tutorial 
 * 
 * rule
 * {
 * 		rule : array()
 * 		regex : array()
 * }
 */
require_once 'Bingo/Router/Interface.php';
require_once 'Bingo/Http/Request.php';
class Bingo_Router_Rule implements Bingo_Router_Interface 
{
    /**
     * 用于标识这个节点是够是变量
     *
     */
    protected $_strVarNodeFlag = ':';
    /**
     * 规则库
     * router=>rule
     *
     * @var 数组
     */
	protected $_arrRouterRules = array();
	/**
	 * router的分隔符
	 *
	 * @var string
	 */
	protected $_strSepOfRouter = '/';
	public function __construct($arrConfig=array())
	{
		if (! empty($arrConfig)) $this->setConfig($arrConfig);
	}
	/**
	 * 设置配置信息
	 * @param array $arrConfig
	 * {
	 * 		sepOfRouter : string router之间的分隔符
	 * }
	 */ 
	public function setConfig( $arrConfig )
	{
		if ( isset( $arrConfig[ 'sepOfRouter' ] ) ) {
			$this->_strSepOfRouter = $arrConfig[ 'sepOfRouter' ];
		}
		if (isset($arrConfig['varNodeFlag'])) {
			$this->_strVarNodeFlag = $arrConfig['varNodeFlag'];
		}
		if (isset($arrConfig['routerRules']) && is_array($arrConfig['routerRules'])) {
			$this->_arrRouterRules = $arrConfig['routerRules'];
		}
	}
	/**
	 * 解析$strRouterKey,获取router
	 * @param string $strRouterKey
	 * @return false/router
	 * 
	 */
	public function getDispatchRouter( $strRouter )
	{
		if ( empty( $strRouter ) || empty( $this->_arrRouterRules )) {
			return false;
		}	
		$strRouter = strtolower( $strRouter );		
		$_arrRouterNodes = Bingo_Http_Request::arrayFilterEmpty( explode( $this->_strSepOfRouter, $strRouter ) );
		$_intNodeSize = count( $_arrRouterNodes );
		if (! empty( $_arrRouterNodes )) {
			foreach ( $this->_arrRouterRules as $_strDispatchRouter => $_rule ) {
				if ($this->_isMatch($_arrRouterNodes, $_intNodeSize, $_rule)) {					
					Bingo_Http_Request::setDispatchRouter($_strDispatchRouter);
				    return $_strDispatchRouter;
				}
			}//end foreach
		}
		return false;
	}
	/**
	 * 添加一条规则，如果存在，则覆盖
	 * @param string $strRouterKey
	 * @param array $rule
	 * {
	 * 		rule : array
	 * 		regex : array
	 * }
	 * 
	 */ 
	public function add( $strDispatchRouter, $rule )
	{
	    if (is_array( $rule ) && isset( $rule['rule'] ) ) {
	        $this->_arrRouterRules [ $strDispatchRouter ] = $rule;
	    }
	}
	
	private function _isMatch( $arrNodes, $nodeSize, $rule)
	{
	    $arrRuleNodes = $rule[ 'rule' ];
	    $arrNodeRegexs = array();
	    if ( count($arrRuleNodes) == $nodeSize ) {
	    	Bingo_Http_Request::emptyRouterParams();
	        if (isset($rule[ 'regex' ])) $arrNodeRegexs = $rule[ 'regex' ];
	        for ($i = 0; $i < $nodeSize; $i ++) {
	            if ($this->_nodeIsVar( $arrRuleNodes[ $i ] )) {
	                //is var
	                if ($this->_checkMatch($arrRuleNodes[ $i ], $arrNodeRegexs, $arrNodes[$i])) {
	                    //match
	                    Bingo_Http_Request::addRouterParams( ltrim($arrRuleNodes[$i], $this->_strVarNodeFlag), $arrNodes[ $i ] );
	                } else {
	                    return false;
	                }
	            } elseif ( $arrNodes[ $i ] != $arrRuleNodes[$i] ) {
	                return false;
	            }
	        }
	        return true;
	    }
		return false;
	}
	
	private function _nodeIsVar( $strRuleNode ) 
	{
	    if ($strRuleNode[0] == $this->_strVarNodeFlag) {
	        return true;
	    }
	    return false;
	}
	
	private function _checkMatch($strRegexName, $arrRegexs, $strNode)
	{
		if (isset($arrRegexs[$strRegexName])) {
			$mixRegex = $arrRegexs[$strRegexName];
			if (is_array($mixRegex)) {
				//规则是数组
				return (bool)in_array($strNode, $mixRegex);
			} else {
				$mixRegex = strval($mixRegex);
				return (bool)preg_match('/' . $mixRegex . '/i', $strNode);
			}
		}
		return true;
	}
}