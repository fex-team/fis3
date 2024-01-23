<?PHP
   class c_socket
   {
	  private $socket           = NULL; /*socket套接字*/
	  private $socket_domain    = NULL; /*socket地址/协议族*/
	  private $socket_type      = NULL; /*socket连接类型*/
	  private $socket_protocol  = NULL; /*socket连接协议*/
	  private $socket_address   = NULL; /*socket连接地址*/
	  private $socket_port      = NULL; /*socket连接端口*/
	  private $socket_read_len  = NULL; /*socket一次读取长度*/
	  private $socket_read_type = NULL; /*socket读模式*/
	  private $socket_timeout   = NULL; /*socket超时发送接收超时*/
	  public  $socket_error     = NULL; /*socket错误信息*/
	  public  $socket_errno     = NULL; /*socket错误代码*/

	  function __construct()
	  {
		 $this->socket_domain    = AF_INET;
		 $this->socket_type      = SOCK_STREAM;
		 $this->socket_protocol  = SOL_TCP;
		 $this->socket_address   = "127.0.0.1";
		 $this->socket_port      = 9120;
		 $this->socket_read_len  = 8192;
		 $this->socket_read_type = PHP_BINARY_READ;
		 $this->socket_timeout   = 200;
		 $this->socket_error     = "";
		 $this->socket_errno     = 0;
	  }

	  function __destruct()
	  {
		 if (!empty($this->socket))
		 {
			if(is_resource($this->socket))
			{
			   socket_close($this->socket);
			}
			$this->socket = NULL;
		 }
		 $this->socket_domain    = NULL;
		 $this->socket_type      = NULL;
		 $this->socket_protocol  = NULL;
		 $this->socket_address   = NULL;
		 $this->socket_port      = NULL;
		 $this->socket_read_len  = NULL;
		 $this->socket_read_type = NULL;
		 $this->socket_timeout   = NULL;
		 $this->socket_error     = NULL;
		 $this->socket_errno     = NULL;
	  }

	  function __set($name, $value)
	  {
		 switch ($name)
		 {
			case "socket_domain":
			if ($value == AF_INET || $value == AF_INET6 || $value == AF_UNIX)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_type":
			if ($value == SOCK_STREAM || $value = SOCK_DGRAM || $value == SOCK_RAW ||
			$value == SOCK_SEQPACKET || $value == SOCK_RDM)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_protocol":
			if ($value == SOL_TCP || $value == SOL_UDP || $value == SOL_SOCKET)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_address":
			preg_match_all("/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/", $value, $match);
			if ($match[0][0] == $value)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_port":
			if ($value > 0 && $value <= 65535)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_read_len":
			if ($value > 0 && $value <= 8192)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_read_type":
			if ($value == PHP_BINARY_READ || $value == PHP_NORMAL_READ)
			{
			   $this->$name = $value;
			}
			break;
			case "socket_timeout":
			if ($value >= 0)
			{
			   $this->$name = $value;
			}
			break;
		 }
	  }

	  function __get($name)
	  {
		 switch ($name)
		 {
			case "socket_domain":
			case "socket_type":
			case "socket_protocol":
			case "socket_address":
			case "socket_port":
			case "socket_read_len":
			case "socket_read_type":
			case "socket_timeout":
			case "socket_error":
			case "socket_errno":
			return $this->$name;
			break;
			default:
			return NULL;
			break;
		 }
	  }

	  function set_vars_from_array($vars_arr)
	  {
		 foreach ($vars_arr as $key => $value)
		 {
			$this->__set($key, $value);
		 }
	  }

	  function get_vars_to_array()
	  {
		 $vars_arr = array(
			'socket_domain'    => $this->socket_domain,
			'socket_type'      => $this->socket_type,
			'socket_protocol'  => $this->socket_protocol,
			'socket_address'   => $this->socket_address,
			'socket_port'      => $this->socket_port,
			'socket_read_len'  => $this->socket_read_len,
			'socket_read_type' => $this->socket_read_type,
			'socket_timeout'   => $this->socket_timeout,
			'socket_error'     => $this->socket_error,
			'socket_errno'     => $this->socket_errno,
		 );
		 return $vars_arr;
	  }

	  // NOTE: this function may report PHP WARNING
	  function tcp_connect($address, $port, $ctimeout = NULL)
	  {
		 $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		 if($socket === false)
		 {
			return 'socket_create() failed, reason: '.socket_strerror(socket_last_error());
		 }

		 if(!socket_set_nonblock($socket))
		 {
			socket_close($socket);
			return 'socket_set_nonblock() failed, reason: '.socket_strerror(socket_last_error());
		 }

		 @ socket_connect($socket, $address, $port);

		 if(!socket_set_block($socket))
		 {
			socket_close($socket);
			return 'socket_set_block() failed, reason: '.socket_strerror(socket_last_error());
		 }

		 $r = array($socket);
		 $w = array($socket);
		 $ret = socket_select($r, $w, $e = NULL, $ctimeout, 0);

		 // select error
		 if($ret === FALSE)
		 {
			socket_close($socket);
			return 'socket_select() failed, reason: '.socket_strerror(socket_last_error());
		 }
		 // select timed out
		 else if($ret == 0)
		 {
			socket_close($socket);
			return 'connect timed out';
		 }
		 // socket error
		 else
		 {
			// refused, unreachable, etc...
			if(!socket_getpeername($socket, &$host))
			{
			   socket_close($socket);
			   return 'refused or unreachable';
			}
		 }

		 return $socket;
	  }

	  function connect($timeout)
	  {
		 $this->socket=$this->tcp_connect($this->socket_address, $this->socket_port, $timeout);
		 if(is_resource($this->socket))
		 {
			$tv_sec = floor($this->socket_timeout / 1000);
			$tv_usec = ($this->socket_timeout % 1000) * 1000;

			socket_set_option($this->socket, SOL_SOCKET, SO_RCVTIMEO,
			array('sec'=>$tv_sec, 'usec'=>$tv_usec));
			socket_set_option($this->socket, SOL_SOCKET, SO_SNDTIMEO,
			array('sec'=>$tv_sec, 'usec'=>$tv_usec));
			return true;
		 }
		 return false;
	  }

	  function close()
	  {
		 if ($this->socket !== false || $this->socket !== NULL)
		 {
			if(is_resource($this->socket))
			{
			   socket_close($this->socket);
			}
			$this->socket = NULL;
		 }
	  }

	  function write($buffer)
	  {
		 while (true)
		 {
			$ret = socket_write($this->socket, $buffer, strlen($buffer));
			if ($ret === false)
			{
			   $this->socket_errno = socket_last_error($this->socket);
			   $this->socket_error = socket_strerror($this->socket_errno);
			   socket_clear_error($this->socket);
			   return false;
			}

			if ($ret == strlen($buffer))
				break;

			$buffer = substr($buffer, $ret);
		 }
		 return true;
	  }

	  function read($len)
	  {
		 $buffer = "";
		 while (@ $temp = socket_read($this->socket, $len, $this->socket_read_type))
		 {
			$buffer .= $temp;
			$len -= strlen($temp);
			if ($len === 0)
				break;
		 }
		 if ($temp === false)
		 {
			$this->socket_errno = socket_last_error($this->socket);
			$this->socket_error = socket_strerror($this->socket_errno);
			socket_clear_error($this->socket);
			return false;
		 }
		 return $buffer;
	  }
   }
?>
