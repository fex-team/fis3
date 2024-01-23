<?php
/***
 * ģ�������
 * $_data �Ĵ����ʽΪ array('name', array('type', 'value'))		type: 1 ��ͨ����; 2 �����ļ�
 * @method		clearData		�������
 * @method		blockDataStart	��ʼ����һ��block����
 * @method		blockDataEnd	��������һ��block����
 * @method		setData			��������
 * @method		load			����һ��ģ��
 */
class TbView_TemplateLoader
{
	private $_tempVarName;	//��ʱ����
	protected $_data;			//��������
	protected $_dataType;		//����ÿ����ֵ����������
	protected $_defaultData;	//Ĭ�ϵ�����
	/***
	 * ���캯��
	 * @param		$template_dir		ģ��Ŀ¼
	 * @param		$compile_dir		�����Ŀ¼
	 * @param		$defaultData		view����
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
	 * �������
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
	 * ��������
	 * @param	array or string		$key
	 * @param	string				$value
	 * @param	int					$type		1 : ��ͨ����	2 : ��Ҫinclude���ļ�
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
	 * @desc ������extract����ǰ�ַ��� �����ض���$type������ ����$this->load�е���
	 * @param {String} $fileName ��Ҫload��ģ����
	 * @param {Boolean} $needRequire �Ƿ����require
	 * @param {Boolean} $autoClearData ��load���Ժ��Ƿ��Զ��������
	 */
	public function loadTemplate($____fileName, $____needRequire=false, $____autoClearData=true)
	{	
		//echo "[TbView][Load]script : ${____fileName};";
		//var_dump($this->_defaultData);
		//var_dump($this->_data);
		if(!is_file($____fileName)){//�ݴ���
			trigger_error("[TbView][Load]Error, script : ${____fileName} is not a file!", E_USER_WARNING);
			return false;
		}
		if(!empty($this->_dataType)){
			foreach($this->_dataType as $____key => $____val){
				if($____val == 2){ //������ʾ��Ҫ���õ��ļ�
					$this->blockDataStart($____key);
					include($this->_data[$____key]);
					$this->blockDataEnd();
				}
			}
		}
		
		//Import Ĭ�����õı��� 
		if(isset($this->_defaultData) && is_array($this->_defaultData)){
			extract($this->_defaultData, EXTR_OVERWRITE);
		}
		//Import ���������õı���
		extract($this->_data, EXTR_OVERWRITE);
		
		if($____autoClearData === true){
			//������ݣ�������load������������Ⱦ
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