<?php

$dbuser = '';
$dbpass = '';
$host = 'localhost';
$dbname = 'furniture';

$con = new mysqli($host, $dbuser, $dbpass, $dbname);

mysqli_query($con, "SET CHARACTER SET 'utf8'");
echo '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />';

function secure_variable($variable) {
    global $con;
    return htmlspecialchars(stripcslashes(mysqli_real_escape_string($con, $variable)));
}

function close($con) {
    mysqli_close($con);
}

function __autoload($class_name) {
    $class_name = strtolower($class_name);
    $path = "classes/{$class_name}.php";
    if (file_exists($path)) {
        require_once($path);
    } else {
        require_once('../' . $path);
    }
}

?>
