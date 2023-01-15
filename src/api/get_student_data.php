<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

$data_array = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = json_decode(file_get_contents("php://input"));

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT user.email, user.name, user.phone, student.degree, student.major, student.group,
                                  student_diploma.*, student_grown.*, student_hat.*
                            FROM student_diploma
                            RIGHT JOIN student ON student.fn = student_diploma.student_fn 
                            RIGHT JOIN user ON user.id = student.user_id 
                            LEFT JOIN student_grown ON student.fn = student_grown.student_fn 
                            LEFT JOIN student_hat ON student.fn = student_hat.student_fn 
                            WHERE user.email=:email");
    $stmt->execute(["email" => $email]);

    $rows = $stmt->fetchAll();

    // var_dump($rows);

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
