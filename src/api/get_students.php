<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-hat","moderator-gown","moderator-signature"]);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT user.id, user.name, user.email, user.phone, student.fn, student.degree, student.major, student.group, student.has_diploma_right, user.role 
                            FROM user
                            RIGHT JOIN student ON user.id = student.user_id 
                            WHERE user.role='student'
                            ORDER BY id ASC");
    $stmt->execute();

    $rows = $stmt->fetchAll();

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
