<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';


$data_array = array();
$errors = array();

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    validateJWT($jwt, ["admin"]);
    
    $data = json_decode(file_get_contents("php://input"));

    foreach ($data as $k => $v) {
        switch ($k) {
            case "id":
                $data_array["id"] = $v;
                break;
            default:
                $data_array["invalid_field"] = "true";
        }
    }

    $email = getUserEmailByID($data_array["id"]);
    $logged_email = getUserEmailFromJWT($jwt);

    if ($email === $logged_email) {
        $response = array("success" => false, "message" => "Не може да премахнете вашият потребителски профил."); 
        echo json_encode($response);
        die;
    }
    
    if ($errors) {
        $response = array("success" => false, "message" => json_encode($errors, JSON_UNESCAPED_UNICODE)); 
        echo json_encode($response);
    } else {

        $database = new Db();
        $conn = $database->getConnection();
        $stmt = $conn->prepare("DELETE FROM user WHERE id = :id");

        try {
            $stmt->execute(["id" => $data_array["id"]]);
            if ($stmt) {
                $response = array("success" => true, "message" => "Потребителят беше успешно премахнат.");
                echo json_encode($response);
                http_response_code(200);
            }
        } catch(PDOException $e) {
            if ($stmt->errorCode() == 23000) {
                $response = array("success" => false, "message" => "Потребител с това id не съществува.");
                echo json_encode($response);
            } else {
                $response = array("success" => false, "message" => "Непозната грешка.");
                echo json_encode($response);
            }
        }
    }
}

function getUserEmailByID($id) {
    $database = new Db();
    $conn = $database->getConnection();

    $stmt = $conn->prepare("SELECT email FROM user WHERE id = :id");
    $stmt->execute(["id" => $id]);

    return $stmt->fetch()["email"];
}

?>