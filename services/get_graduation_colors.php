<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include '../database/db_conf.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT * 
                            FROM graduation_colors");
    $stmt->execute();

    $rows = $stmt->fetchAll();

    if(count($rows) != 1) {
        $response = array("success" => false, "message" => "Все още няма зададени цветове.");
        echo json_encode($response);
        http_response_code(404);
        die;
    }

    $response = array("success" => true, "graduation_colors" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
