<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT graduation_time.start_time, graduation_time.students_interval 
                            FROM graduation_time");
    $stmt->execute();

    $rows = $stmt->fetchAll();

    if(count($rows) != 1) {
        $response = array("success" => false, "message" => "Все още няма зададен начален час.");
        echo json_encode($response);
        http_response_code(200);
        die;
    }

    $response = array("success" => true, "graduation_time" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
