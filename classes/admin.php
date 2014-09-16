<?php

require_once 'publicFunc.php';

class admin extends publicFunc {

    private function add_admin($con, $name, $user_name, $password, $admin_img) {
        $sql = "INSERT INTO `admin`
(`name`,`user_name`,`password`,`admin_img`)
VALUES
('$name','$user_name','$password','$admin_img');";
        return self::make_query($con, $sql);
    }

    public function addAdmin($con, $name, $user_name, $password, $admin_img) {
        $result = $this->add_admin($con, $name, $user_name, $password, $admin_img);
        return $result;
    }

    private function update_admin($con, $id, $name, $user_name, $password, $admin_img) {
        $sql = "UPDATE `admin`
SET
`name` = '$name',
`user_name` = '$user_name',
`password` = '$password',
`admin_img` ='$admin_img'
WHERE `id` = '$id';";
        return self::make_query($con, $sql);
    }

    public function updateAdmin($con, $id, $name, $user_name, $password, $admin_img) {
        $result = $this->update_admin($con, $id, $name, $user_name, $password, $admin_img);
        return $result;
    }

    private function admin_login($con, $name, $pass) {
        $sql = "SELECT * FROM admin WHERE user_name = '" . $name . "' and password ='" . $pass . "'";
        echo $sql;
        return self::make_select_query($con, $sql);
    }

    public function adminLogin($con, $name, $pass) {
        $result = $this->admin_login($con, $name, $pass);
        return $result;
    }
}

?>