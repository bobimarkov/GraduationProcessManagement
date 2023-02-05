<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER["REQUEST_METHOD"] === 'PUT') {
    validateJWT($jwt, ["admin"]);

    if(empty(trim($data["name"])) || empty(trim($data["email"])) || empty(trim($data["phone"]))) {
        $response = array("success" => false, "message" => "Моля, попълнете всички полета!");
        echo json_encode($response);
        die;
    }

    $data["id"] = processInput($data["id"]);
    $data["name"] = processInput($data["name"]);
    $data["email"] = processInput($data["email"]);
    $data["phone"] = processInput($data["phone"]);

    validateInput($data);
    updateStudentsDB($data);
}

function processInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function validateInput($data) {
    if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
        $response = array("success" => false, "message" => "Невалиден имейл адрес!");
        echo json_encode($response);
        die;
    }

    if (!is_numeric($data["phone"])) {
        $response = array("success" => false, "message" => "Телефонът не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    }
}

function updateStudentsDB($data)
{
    $database = new Db();
    $conn = $database->getConnection();

    try {
        $stmt = $conn->prepare("UPDATE user SET name = :name, email = :email , phone = :phone WHERE id = :id");
        $stmt->execute(["name" => $data["name"], "email" => $data["email"], "phone" => $data["phone"], "id" => $data["id"]]);

        $response = array("success" => true, "message" => "Данните на студента са променени успешно.");
        echo json_encode($response);
    }
    catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            $response = array("success" => false, "message" => "Вече съществува потребител с тази поща.");
            echo json_encode($response);
        } else {
            $response = array("success" => false, "message" => "Непозната грешка.");
            echo json_encode($response);
        }
    }
}

?>