<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-hat","moderator-gown","moderator-signature", "student"]);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT id, sender, message 
                            FROM messages
                            where recipient = :recipient");

    $recipient = getUserEmailFromJWT($jwt);

    $stmt->execute(["recipient" => $recipient]);

    $rows = $stmt->fetchAll();

    if(count($rows) == 0) {
        $response = array("success" => false, "message" => "В момента нямате никакви известия.");
        echo json_encode($response);
        http_response_code(200);
        die;
    }

    $response = array("success" => true, "order" => $rows);
    echo json_encode($response);
    http_response_code(200);
}