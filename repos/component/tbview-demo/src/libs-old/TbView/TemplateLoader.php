<?php
/***
 * 模板加载器
 * $_data 的储存格式为 array('name', array('type', 'value'))		type: 1 普通变量; 2 引用文件
 * @method		clearData		清空数据
 * @method		blockDataStart	开始设置一个block数据
 * @method		blockDataEnd	结束设置一个block数据
 * @method		setData			设置数据
 * @method		load			加载一个模板
 */
class TbView_TemplateLoader
{
	private $_tempVarName;	//临时变量
	protected $_data;			//保存数据
	protected $_dataType;		//保存每个键值的数据类型
	protected $_defaultData;	//默认的数据
	/***
	 * 构造函数
	 * @param		$template_dir		模板目录
	 * @param		$compile_dir		编译后目录
	 * @param		$defaultData		view对象
	 */
	public function __construct($defaultData=NULL)
	{
		$this->_tempVarName = '';
		$this->_data = array();
		$this->_dataType = array();
		if(isset($defaultData) && is_array($defaultData))
			$this->_defaultData=$defaultData;
	}
	/***
	 * 清空数据
	 */
	public function clearData()
	{
		$this->_data = array();
		$this->_dataType = array();
	}
	public function blockDataStart($varName)
	{
		$this->_tempVarName = $varName;
		ob_start();
	}
	public function blockDataEnd()
	{
		$_buffer = ob_get_clean();
		$this->setData($this->_tempVarName, $_buffer);
	}
	/***
	 * 设置数据
	 * @param	array or string		$key
	 * @param	string				$value
	 * @param	int					$type		1 : 普通变量	2 : 需要include的文件
	 */
	public function setData($key, $value=1, $type=1)
	{
		if(is_array($key)) {
            foreach ($key as $_key => $_val) {
            	$this->_data[$_key] = $_val;
				$this->_dataType[$_key] = 1;
            }
        } elseif (is_string($key)) {
            $this->_data[$key] = $value;
			$this->_dataType[$key] = $type;
        } else{
			trigger_error('TemplateLoader::setData : Type is invalid!', E_USER_WARNING);
		}
	}
	/***
	 * @desc 将数据extract到当前字符表 并对特定的$type做处理 仅在$this->load中调用
	 * @param {String} $fileName 需要load的模板名
	 * @param {Boolean} $needRequire 是否采用require
	 * @param {Boolean} $autoClearData 在load完以后是否自动清除数据
	 */
	public function loadTemplate($____fileName, $____needRequire=false, $____autoClearData=true)
	{	
		//echo "[TbView][Load]script : ${____fileName};";
		//var_dump($this->_defaultData);
		//var_dump($this->_data);
		if(!is_file($____fileName)){//容错处理
			trigger_error("[TbView][Load]Error, script : ${____fileName} is not a file!", E_USER_WARNING);
			return false;
		}
		if(!empty($this->_dataType)){
			foreach($this->_dataType as $____key => $____val){
				if($____val == 2){ //变量表示需要引用的文件
					$this->blockDataStart($____key);
					include($this->_data[$____key]);
					$this->blockDataEnd();
				}
			}
		}
		
		//Import 默认内置的变量 
		if(isset($this->_defaultData) && is_array($this->_defaultData)){
			extract($this->_defaultData, EXTR_OVERWRITE);
		}
		//Import 运行期设置的变量
		extract($this->_data, EXTR_OVERWRITE);
		
		if($____autoClearData === true){
			//清除数据，避免多次load带来的数据污染
			$this->clearData();
		}
		
		try{
			if($____needRequire === true){
				require_once($____fileName);
			}else{
				include($____fileName);
			}
		}
		catch(Exception $____e){
			$____msg = $____e->getMessage();
			trigger_error("[TbView][Load]script execute error!File : ${____fileName} ;Message : $____msg !", E_USER_WARNING);
		}
		
		
		return true;
	}
}

/** end of file TbView/TemplateLoader.php **/