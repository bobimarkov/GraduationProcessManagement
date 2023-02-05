<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin"]);

    getStudentDB();    
}

function processInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function getStudentDB()
{
    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT user.id, user.name, user.email, user.phone, user.role
                            FROM user");
    $stmt->execute();

    $row = $stmt->fetchAll();

    $response = array("success" => true, "users" => $row);
    echo json_encode($response);
    http_response_code(200);
}
?>