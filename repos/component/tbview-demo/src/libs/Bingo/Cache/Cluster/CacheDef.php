<?php 

//Ĭ�������ļ���Ϣ
define('DEFAULT_CONF_PATH','./conf/');
define('DEFAULT_CONF_FILENAME','cache_conf.php');


//����Ŷ���
define('CACHE_OK' , 0);
define('CACHE_ERR_PARAM' , 1);                       //��������
define('CACHE_ERR_NOT_AUTH' , 2);                    //û����֤
define('CACHE_ERR_BUF_NOT_ENOUGH' , 3);              //���buf�ռ䲻��
define('CACHE_ERR_EXIST' , 4);                       //�Ѵ���
define('CACHE_ERR_NOT_EXIST' , 5);                   //������
define('CACHE_ERR_BLOCK_NOT_EXIST' , 6);             //�鲻���ڣ����ܷ���Ǩ����
define('CACHE_ERR_PRODUCT_NOT_EXIST' , 7);           //��Ʒ�߲����� 
define('CACHE_ERR_BUSY' , 8);                        //����˷�æ
define('CACHE_ERR_FROZEN_DELETE' , 9);               //ɾ����ʱ���Ա�����
define('CACHE_ERR_BLOCK_UPDATED' , 10);              //��������ʱ��ı���
define('CACHE_ERR_TIMEOUT' , 11);                    //����ʱ
define('CACHE_ERR_NET' , 12);                        //�������
define('CACHE_ERR_MEM' , 13);                        //�ڴ����
define('CACHE_ERR_DISK' , 14);                       //���̴���
define('CACHE_ERR_METASERVER' , 15);
define('CACHE_ERR_CACHESERVER' , 16);
define('CACHE_ERR_LIB' , 17);
define('CACHE_ERR_PART_SUC' , 18);                   //����������ֳɹ�
define('CACHE_ERR_BLOCK_WRONG_STATE' , 19);          //��״̬����ȷ
define('CACHE_APIPLUS_INIT_FAIL' , 20);              //api��ʼ������
define('CACHE_ERR_NOTSUPPORT' , 21);                 //��֧�ָò���
define('CACHE_FAIL' , 22);                           //����ʧ��