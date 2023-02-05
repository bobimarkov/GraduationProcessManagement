<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT `start_time`, `students_interval`, `graduation_date`, `graduation_place`, `class`, `deadline_gown`, `deadline_hat`, `deadline_attendance`
                            FROM `graduation_time`");
    
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

?>