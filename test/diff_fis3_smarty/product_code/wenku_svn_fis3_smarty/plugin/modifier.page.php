<?php
          /*
     * 翻页代码
     * xiaoqiang@baidu.com
     * @ 参数: 
     * @ $CURRENT_NUM 当前页起始条目数值 
     * @ $NUM_PER_PAGE 每页显示多少条目 
     * @ $TOTAL_NUM 结果的总条目 
     * @ $TOTAL_NUM_LIMIT 页码最大显示条目 
     * @ $URL url
     */
// 	  function smarty_modifier_page($CURRENT_NUM , $NUM_PER_PAGE =10 , $TOTAL_NUM, $TOTAL_NUM_LIMIT , $URL=false,$MORE='', $PAGE_NUM_LIMIT = 10 , $SHOW_END=true)
 	  function smarty_modifier_page($pageInfo){
		  
		  
		$pageInfo_def=array(
			'pageNumLimit'=>10,
			'numberPerPage'=>10,
			'show_end'=>true,
			'more'=>'',
			'url'=>false
		);
		
		$pageInfo = array_merge($pageInfo_def,$pageInfo);
		
		$CURRENT_NUM = $pageInfo['currentNum'];
		$NUM_PER_PAGE = $pageInfo['numberPerPage'];
		$TOTAL_NUM = $pageInfo['totalNumber'];
		$TOTAL_NUM_LIMIT = $pageInfo['totalNumberLimit'];
		$PAGE_NUM_LIMIT =$pageInfo['pageNumLimit'];
		$URL = $pageInfo['url'];
		$MORE = $pageInfo['more'];
		$SHOW_END = $pageInfo['show_end'];
		
		
		if (!$URL){
			$URL=$_SERVER['REQUEST_URI'];
		}
			
		$arr = parse_url($URL);		
		if($arr['query']){
			parse_str($arr['query'],$query);
			$URL = $arr['path'];

			unset($query['pn']);
			if(count($query)){
				$URL=$URL.'?'.http_build_query($query);
			}

		}
		

        if ( $CURRENT_NUM < 0 || $TOTAL_NUM <= $NUM_PER_PAGE ) return false;

        if ( $TOTAL_NUM_LIMIT != 0 ) {
            $TOTAL_NUM =  ($TOTAL_NUM >= $TOTAL_NUM_LIMIT)? $TOTAL_NUM_LIMIT : $TOTAL_NUM;
        }
		//$CURRENT_PAGE_NUM 当前起始页码
        $CURRENT_PAGE_NUM = intval($CURRENT_NUM / $NUM_PER_PAGE );
		//$TOTAL_PAGE_NUM 总页数
        $TOTAL_PAGE_NUM = intval($TOTAL_NUM / $NUM_PER_PAGE );
        if ( ($TOTAL_PAGE_NUM * $NUM_PER_PAGE) < $TOTAL_NUM ) {
            $TOTAL_PAGE_NUM++;
        }
        $URL = (preg_match("/\?/",$URL))? $URL."&" : $URL."?";
        $output = "";
        $head_offset = 4;     // 当前页向前偏移位置
        $tail_offset = 5;     // 当前页向后偏移位置
       // 总页数小于指定页数
        if ( $TOTAL_PAGE_NUM <= $PAGE_NUM_LIMIT ) {
            $start = 0;
            $end = $TOTAL_PAGE_NUM;
        } else {
            // 当前页靠前
            if ( $CURRENT_PAGE_NUM <= $head_offset) {
                $start = 0;
                $end = $start + $PAGE_NUM_LIMIT;
            }
            // 当前页靠后
            else if ( ($CURRENT_PAGE_NUM + $tail_offset) >= $TOTAL_PAGE_NUM) {
                $start = $TOTAL_PAGE_NUM - $PAGE_NUM_LIMIT;
                $end = $TOTAL_PAGE_NUM;
            }
            // 当前页在中间
            else {
                $start = $CURRENT_PAGE_NUM - $head_offset; 
                $end = $start + $PAGE_NUM_LIMIT;
            }
            // 如果1消失了，需要显示首页
            if ( $CURRENT_PAGE_NUM > $head_offset ) {
                $output .= '<a href="'.$URL.'pn=0'.$MORE.'" class="first">首页</a>';
            }
        }
        // 只要不是第一页，都显示上一页
        if ($start != $CURRENT_PAGE_NUM) {
            $output .= '<a href="'.$URL.'pn='.($CURRENT_NUM - $NUM_PER_PAGE).$MORE.'" class="pre">&lt;&lt;上一页</a>';
        }
        // 显示页码
        for ($i = $start; $i < $end; $i++) {
            $no = strlen("".($i+1));
            if ( $i == $CURRENT_PAGE_NUM ) {
                $output .= '<span class="cur no'.$no.'">'.($i+1).'</span>';
            } else {
                $output .= '<a href="'.$URL.'pn='.($i * $NUM_PER_PAGE).$MORE.'" class="no'.$no.'">'.($i+1).'</a>';
            }
        }
        // 只要不是最后一页，都显示下一页
        if (($CURRENT_PAGE_NUM + 1) != $TOTAL_PAGE_NUM) {
            $output .= '<a href="'.$URL.'pn='.($CURRENT_NUM + $NUM_PER_PAGE).$MORE.'" class="next">下一页&gt;&gt;</a>';
        }
		// 只要尾页没有在页码中显示，都显示尾页
		if ($SHOW_END && $end < $TOTAL_PAGE_NUM){
			$output .= '<a href="'.$URL.'pn='.(($TOTAL_PAGE_NUM-1) * $NUM_PER_PAGE).$MORE.'" class="last">尾页</a>';
		}
        return $output;
    }
