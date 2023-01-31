<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-hat", "moderator-gown", "moderator-signature", "student"]);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT `id`, `sender`, `message` 
                            FROM `messages`
                            where `recipient` = :recipient");

    $recipient = getUserEmailFromJWT($jwt);
    $stmt->execute(["recipient" => $recipient]);

    $stmt_name = $conn->prepare("SELECT `name`
                                FROM `user`
                                WHERE `email` = :email");

    $rows = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $stmt_name->execute(["email" => $row['sender']]);
        $name = $stmt_name->fetch(PDO::FETCH_ASSOC);
        $row['sender'] = $name['name'] . '(' . $row['sender'] . ')';
        array_push($rows, $row);
    }

    $response = array("success" => true, "order" => $rows);
    echo json_encode($response);
    http_response_code(200);

}

?>