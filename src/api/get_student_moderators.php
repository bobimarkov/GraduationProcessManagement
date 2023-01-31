<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-hat","moderator-gown", "moderator-signature","student"]);
    $email = json_decode(file_get_contents("php://input"));

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT * from student_moderators");
    $stmt->execute();

    $rows = $stmt->fetchAll();

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
?>