<?php

class publicFunc {

    public static function make_query($con, $q) {
        $r = $con->query($q);
        if ($r) {
            return 'done';
        } else {
            return 'fail';
        }
    }

    public static function make_select_query($con, $q) {
        $r = $con->query($q);
        return $r;
    }

}

?>