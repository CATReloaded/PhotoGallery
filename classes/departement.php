<?php

require_once 'publicFunc.php';

class departement extends publicFunc {

    private function add_department($con, $name) {
        $sql = "INSERT INTO `departement`
(`depart_name`)
VALUES
('$name');";
        return self::make_query($con, $sql);
    }

    private function update_departement($con, $id, $name) {
        $sql = "UPDATE `departement`
         SET
         `depart_name` ='$name'
          WHERE `depart_id` = '$id'";
//        echo $sql;
        return self::make_query($con, $sql);
    }

    private function delete_departement($con, $id) {
        $sql = "DELETE FROM `departement`
WHERE depart_id='$id';";
//        echo $sql;
        return self::make_query($con, $sql);
    }

    private function get_all_departement($con) {
        $sql = "SELECT * FROM departement;";
//        echo $sql;
        return self::make_select_query($con, $sql);
    }

    private function add_img($con, $name, $title, $content, $depart_id) {
        $sql = "INSERT INTO  `img`
(`name`, `title`,`content`,`departement_depart_id`)
VALUES
('$name','$title','$content','$depart_id');";
        return self::make_query($con, $sql);
    }

    private function update_img($con, $img_id, $name, $title, $content, $depart_id) {
        $sql = "UPDATE `furniture`.`img`
        SET
        `name` = '$name',
        `title` = '$title',
        `content` = '$content',
         `departement_depart_id` = '$depart_id'
          WHERE `img_id` = '$img_id';";
//        echo $sql;
        return self::make_query($con, $sql);
    }

    private function get_all_img($con) {
        $sql = "SELECT * FROM img;";
        return self::make_select_query($con, $sql);
    }

    private function delete_img($con, $id) {
        $sql = "DELETE FROM  `img`
WHERE img_id='$id';";
        return self::make_query($con, $sql);
    }

    private function select_all_depart_info($con) {
        $sql = "select * from img , departement where img.departement_depart_id = departement.depart_id";
        return self::make_select_query($con, $sql);
    }
    private function select_all_depart_info_limited($con,$id ,$perpage ,$offset) {
        $sql = "select * from img , departement where img.departement_depart_id = departement.depart_id and departement.depart_id='".$id."'";
        $sql .=" LIMIT {$perpage}";
        $sql .=" OFFSET {$offset}";
//        echo $sql;
        return self::make_select_query($con, $sql);
    }
    
    
    public function selectAllDepartInfoLimited($con ,$id,$perpage ,$offset) {
        $result=  $this->select_all_depart_info_limited($con ,$id,$perpage ,$offset);
        return $result;
    }

    private function get_img_by_id($con, $id) {
        $sql = "select * from img where img_id= '" . $id . "'";
//        echo $sql;
        return self::make_select_query($con, $sql);
    }

    private function get_departement_by_id($con, $id) {
        $sql = "select * from departement where departement.depart_id='" . $id . "'";
        return self::make_select_query($con, $sql);
    }

    private function get_all_info_img_by_depart_id($con, $id) {
        $sql = "select * from img , departement where img.departement_depart_id = departement.depart_id and departement.depart_id='" . $id . "'";
        return self::make_select_query($con, $sql);
    }

    private function get_count_all_img_by_depart($con, $id) {
        $sql = "select count(img.img_id) as num from img , departement where img.departement_depart_id = departement.depart_id and departement.depart_id='" . $id . "'";
        return self::make_select_query($con, $sql);
    }
    
    
    
    

    public function getCountAllImgByDepart($con, $id) {
        $result = $this->get_count_all_img_by_depart($con, $id);
        return $result;
    }

    public function getAllInfoImagByDepartId($con, $id) {
        $result = $this->get_all_info_img_by_depart_id($con, $id);
        return $result;
    }

    public function getDepartementById($con, $id) {
        $result = $this->get_departement_by_id($con, $id);
        return $result;
    }

    public function getimgById($con, $id) {
        $result = $this->get_img_by_id($con, $id);
        return $result;
    }

    public function selectAllDepartInfo($con) {
        $result = $this->select_all_depart_info($con);
        return $result;
    }

    public function deleteImg($con, $id) {
        $result = $this->delete_img($con, $id);
        return $result;
    }

    public function getAllImg($con) {
        $result = $this->get_all_img($con);
        return $result;
    }

    public function updateImg($con, $img_id, $name, $title, $content, $depart_id) {
        $result = $this->update_img($con, $img_id, $name, $title, $content, $depart_id);
        return $result;
    }

    public function addImg($con, $name, $title, $content, $depart_id) {
        $result = $this->add_img($con, $name, $title, $content, $depart_id);
        return $result;
    }

    public function getAllDepartemnt($con) {
        $result = $this->get_all_departement($con);
        return $result;
    }

    public function deleteDepartement($con, $id) {
        $result = $this->delete_departement($con, $id);
        return $result;
    }

    public function updateDepartement($con, $id, $name) {
        $result = $this->update_departement($con, $id, $name);
        return $result;
    }

    public function addDepartment($con, $name) {
        $result = $this->add_department($con, $name);
        return $result;
    }

}

?>