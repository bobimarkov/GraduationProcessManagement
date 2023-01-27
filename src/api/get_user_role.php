<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator", "student"]);

    $email = getUserEmailFromJWT($jwt);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT user.role
                            FROM user
                            WHERE user.email=:email");
    $stmt->execute(["email" => $email]);

    $rows = $stmt->fetchAll();

    // var_dump($rows);

    $response = array("success" => true, "role" => $rows[0]["role"]);
    echo json_encode($response);
    http_response_code(200);
}
