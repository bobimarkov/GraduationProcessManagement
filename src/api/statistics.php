<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$errors = array();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator"]);

    if ($errors) {
        $response = array("success" => false, "errors:" => json_encode($errors, JSON_UNESCAPED_UNICODE));
        echo json_encode($response);
        http_response_code(404);
    } else {
        $database = new Db();
        $conn = $database->getConnection();

        $order_stmt = $conn->prepare("SELECT major, grade, degree, has_right
                                      FROM student_diploma
                                      JOIN student ON student.fn = student_diploma.student_fn");
        $order_stmt->execute();
        $rows = $order_stmt->fetchAll();

        $response = array("success" => true, "users" => $rows);
        echo json_encode($response);
        http_response_code(200);
    }
}

?>