<?php

class Ak_SpanIdcStrategy {
    protected $m_span_idc_strategy;
    protected $m_resources;

    public function registerStrategy($span_idc_strategy) {
        $this->m_span_idc_strategy = $span_idc_strategy;
    }

    public function registerResource($resource_type, $logic_idc, $resource) {
        $this->m_resources[$resource_type][$logic_idc] = $resource;
    }

    public function getResource($strategy_index, $resource_type, $cur_idc, $need_shuffle = true) {
        $idc_lists = $this->m_span_idc_strategy[$strategy_index][$cur_idc];
        $all_idcs = array();
        foreach ($idc_lists as $idc_list) {
            $tmp_list = $idc_list;
            if ($need_shuffle) {
                shuffle($tmp_list);
            }
            $all_idcs = array_merge($all_idcs, $tmp_list);
        }
        $selected_resources = array();
        foreach ($all_idcs as $idc) {
            foreach ($this->m_resources[$resource_type] as $logic_idc => $resource) {
                if ($logic_idc == $idc) {
                    $selected_resources[] = $resource;
                }
            }
        }
        return $selected_resources;
    }
}

