<?php

class Pagnition {

    public $per_page;
    public $total_count;
    public $current_page;

    function __construct($current_page = 1, $total_count = 0, $per_page = 20) {
        $this->current_page = (int) $current_page;
        $this->total_count = (int) $total_count;
        $this->per_page = (int) $per_page;
    }

    public function total_page() {
        return ceil($this->total_count / $this->per_page);
    }

    public function next_page() {
        return $this->current_page + 1;
    }

    public function previous_page() {
        return $this->current_page - 1;
    }

    public function has_previous_page() {
        return $this->previous_page() >= 1 ? TRUE : FALSE;
    }

    public function has_next_page() {
       
        return $this->next_page() <= $this->total_page() ? TRUE : FALSE;
    }

    public function offset() {
        //equation fo calc the offset of the page 
        return ($this->current_page - 1) * $this->per_page;
    }

}
