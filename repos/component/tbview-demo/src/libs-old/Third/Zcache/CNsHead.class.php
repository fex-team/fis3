<?php
/***************************************************************************
 * 
 * Copyright (c) 2009 Baidu.com, Inc. All Rights Reserved
 * 
 **************************************************************************/
 
 
 
/**
 * @file 
 * @author baonh(baonenghui@baidu.com)
 * @brief 
 *
 * ��nshead�Ĳ�����PHP�汾
 *
 * nshead C�ṹ��:
 * typedef struct _nshead_t
 * {
 *   unsigned short id;              
 *   unsigned short version;         
 *   unsigned int   log_id;
 *   char           provider[16];
 *   unsigned int   magic_num;
 *   unsigned int   reserved;       
 *   unsigned int   body_len;
 * } nshead_t;
 *
**/
class NsHead
{
    /**
     * ����nshead��
     *
     * �������һ����ʾnshead���ݵ�array
     *
     *  array(
     *       'id'        => 0,
     *       'version'   => 0,
     *       'log_id'    => 0,
     *       'provider'  => ""
     *       'magic_num' => 0xfb709394, #ħ������, ����ⲿ����Ҫ��д�����Զ����
     *       'reserved'  => 0,
     *       'body_len'  => 0
     *   );
     *
     * 
     *
     * ��װһ�����Է��͵�nsheadͷ���ݰ�,���������ݣ��������ⲿƴװ
     *
     * @param $vars_arr ��Ҫ����nsheadͷ���ݰ�,����������
     * @return ����һ�����Է��͵�nsheadͷ���ݰ�,���������ݣ��������ⲿƴװ
     */
    public function build_nshead($vars_arr)
    {
        $nshead_arr = array(
            'id'        => 0,
            'version'   => 0,
            'log_id'    => 0,
            'provider'  => str_pad("", 16, "\0", STR_PAD_BOTH),
            'magic_num' => 0xfb709394, #ħ������
            'reserved'  => 0,
            'body_len'  => 0
        );
        foreach ($vars_arr as $key => $value)
        {
            if (isset($nshead_arr[$key]))
            {
                $nshead_arr[$key] = $value;
            }
        }
        $nshead  = "";
        $nshead  = pack("L*", (($nshead_arr['version'] << 16) + ($nshead_arr['id'])), $nshead_arr['log_id']);
        //���ȡ15���ֽڵ�provider
        $nshead .= str_pad(substr($nshead_arr['provider'], 0, 15), 16, "\0");
        $nshead .= pack("L*", $nshead_arr['magic_num'], $nshead_arr['reserved']);
        $nshead .= pack("L", $nshead_arr['body_len']);
        return $nshead;
    }
    
    /**
     * ����nshead��������buf���뷵�������buf�ֶ���
     * һ���nshead���ݰ����� nshead + buf
     *
     * ����һ��nshead��array, 
     * 
     *  array(
     *       'id'        => 
     *       'version'   => 
     *       'log_id'    => 
     *       'provider'  => 
     *       'magic_num' =>
     *       'reserved'  => 
     *       'body_len'  => 
     *       'buf' =>
     *   );

     *
     * ����'buf' �Ǳ�ʾʵ�ʵ�����
     *
     * @param $head ���յ���nshead ���ݰ�
     * @param $get_buf ��Ҫ���������������ݣ����get_buf == false, 'buf'������
     * @param ����һ��nshead�����array
     */
    public function split_nshead($head, $get_buf = true)
    {
        $ret_arr = array(
            'id'        => 0,
            'version'   => 0,
            'log_id'    => 0,
            'provider'  => "",
            'magic_num' => 0,
            'reserved'  => 0,
            'body_len'  => 0,
            'buf'       => ""
        );
        
        $ret = unpack("v1id/v1version/I1log_id", substr($head, 0, 8));
        foreach ($ret as $key => $value)
        {
            $ret_arr[$key] = $value;
        }
        $ret_arr['provider'] = substr($head, 8, 16);
        $ret = unpack("I1magic_num/I1reserverd/I1body_len", substr($head, 24, 12));
        foreach ($ret as $key => $value)
        {
            $ret_arr[$key] = $value;
        }
        //36��nshead_t�ṹ���С
        if ($get_buf) {
            $ret_arr['buf'] = substr($head, 36, $ret_arr['body_len']);
        }
        return $ret_arr;
    }
    
    /**
     *  �� nshead ͨ��socket $msgsocket ���ͳ�ȥ
     *
     *  @param $msgsocket ��Ҫд��socket
     *  @param $vars_arr ��Ҫ���͵�nsheadͷ
     *  @param $buf ��Ҫ���͵�ʵ������
     *  @return ���͵�ʵ�����ݳ���
     */
    public function nshead_write($msgsocket, $vars_arr, $buf)
    {
        $nshead = $this->build_nshead($vars_arr);
        $nshead .= $buf;
        return fwrite($msgsocket, $nshead, strlen($nshead));
    }
    
    /**
     *  �� socket $msgsocket ��ȡnshead���ݰ�
     *
     *  @param $msgsocket ��Ҫ���յ�socket
     *  @param $nshead_check_magicnum �Ƿ���MAGICNUM, Ĭ�ϼ��
     */
    public function nshead_read($msgsocket, $nshead_check_magicnum = true)
    {
        $temp_out = "";
        $this->socket_read_buf = "";
        //�ȶ�nsheadͷ��
        $temp_out = fread($msgsocket, 36);
        if ($temp_out === false)
        {
            return false;
        }
        $nshead = $this->split_nshead($temp_out, false);
        //��� msgic num
        if ($nshead_check_magicnum == true 
            && $nshead['magic_num'] != 0xfb709394 
            && $nshead['magic_num'] != -76508268) 
        //����php�汾��unpack��ʱ�����bug�������������ж�һ�¸��������
        {
            error_log("magic num mismatch: ret ".$nshead['magic_num']." want 0xfb709394");
            return false;
        }
        #��nshead������
        $left_bytes = $nshead['body_len'];
        while ($left_bytes > 0) {
            $recv_data = fread($msgsocket, $left_bytes);
            $recv_size = strlen($recv_data);
            if ($recv_size > 0 && $recv_size <= $left_bytes) {
                $nshead['buf'] .= $recv_data;
                $left_bytes -= $recv_size;
            } else {
                return false;
            }
        }
        return $nshead;
    }
} 
?>