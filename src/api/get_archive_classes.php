<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf_archive.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new DbA();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT DISTINCT `class`
                            FROM `student`
                            ORDER BY class");
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if(count($rows) < 1) {
        $response = array("success" => false, "message" => "Все още няма данни за минали дипломиращи се!");
        echo json_encode($response);
        http_response_code(200);
        die;
    }

    $response = array("success" => true, "class" => $rows);
    echo json_encode($response);
    http_response_code(200);
}

?>