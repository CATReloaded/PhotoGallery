<?php

require_once 'publicFunc.php';

class client extends publicFunc {

    private function add_client($con, $name, $email, $telephone) {
        $sql = "INSERT INTO `client`
(`name`,`email`,`telephone`)
VALUES
(
'$name',
'$email',
'$telephone');";
        return self::make_query($con, $sql);
    }

    private function update_client($con, $id, $name, $email, $telephone) {
        $sql = "UPDATE `client`
SET
`name` = '$name',
`email` = '$email',
`telephone` = '$telephone'
WHERE `client_id` = '$id'";
        return self::make_query($con, $sql);
    }

    private function delete_client($con, $id) {
        $sql = "DELETE FROM `client`
            WHERE client_id='$id';";

        return self::make_query($con, $sql);
    }

    private function get_all_client($con) {
        $sql = "select * from client";
        return self::make_select_query($con, $sql);
    }

    private function insert_order($con, $description, $client_id) {
        $sql = "INSERT INTO `orders`
(`description`,`client_client_id`)
VALUES
(
'$description',
'$client_id');";
        return self::make_query($con, $sql);
    }

    private function delete_order($con, $id) {
        $sql = "DELETE FROM `orders`
        WHERE order_id='$id';";
        return self::make_query($con, $sql);
    }

    private function get_all_value($con, $id) {
        $sql = "select * from orders ,client where orders.client_client_id = client.client_id and client.client_id ='" . $id . "'";
        return self::make_select_query($con, $sql);
    }

    public function getAllValue($con, $id) {
        $result = $this->get_all_value($con, $id);
        return $result;
    }

    public function insertOrder($con, $description, $client_id) {
        $result = $this->insert_order($con, $description, $client_id);
        return $result;
    }

    public function getAllClients($con) {
        $result = $this->get_all_client($con);
        return $result;
    }

    public function deleteClient($con, $id) {
        $result = $this->delete_client($con, $id);
        return $result;
    }

    public function updateClient($con, $id, $name, $email, $telephone) {
        $result = $this->update_client($con, $id, $name, $email, $telephone);
        return $result;
    }

    public function addClient($con, $name, $email, $telephone) {
        $result = $this->add_client($con, $name, $email, $telephone);
        return $result;
    }

}

?>