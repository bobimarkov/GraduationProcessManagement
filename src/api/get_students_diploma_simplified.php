<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();
$errors = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-hat","moderator-gown","moderator-signature", "student"]);

    if ($errors) {
        $response = array("success" => false, "errors:" => json_encode($errors, JSON_UNESCAPED_UNICODE));
        echo json_encode($response);
        http_response_code(404);
    } else {
        $database = new Db();
        $conn = $database->getConnection();


        $order_stmt = $conn->prepare("SELECT student_diploma.*, user.email
                                    FROM student_diploma
                                    RIGHT JOIN student ON student.fn = student_diploma.student_fn 
                                    RIGHT JOIN user ON user.id = student.user_id 
                                    WHERE role='student' and grade >= 3");
        $order_stmt->execute();
        $rows = $order_stmt->fetchAll();

        $response = array("success" => true, "users" => $rows);
        echo json_encode($response);
        http_response_code(200);
    }
}