<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

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
            case "username":
                $data_array["username"] = $v;
                break;
            default:
                $data_array["invalid_field"] = "true";
        }
    }

    if ($errors) {
        $response = array("success" => false, "errors:" => json_encode($errors, JSON_UNESCAPED_UNICODE)); //JSON_UNESCAPED_UNICODE заради съобщенията на кирилица (от php 5.5)
        echo json_encode($response);
        http_response_code(404);
    } else {

        $database = new Db();
        $conn = $database->getConnection();
        $stmt = $conn->prepare("DELETE FROM user WHERE id = :id AND username = :username");

        try {
            $stmt->execute(["id" => $data_array["id"], "username" => $data_array["username"]]);
            if ($stmt) {
                $response = array("success" => true);
                echo json_encode($response);
                http_response_code(200);
            }
        } catch(PDOException $e) {
            if ($stmt->errorCode() == 23000) {
                $response = array("success" => false, "error" => "User with this id and username doesn't exist.");
                echo json_encode($response);
                http_response_code(404);
            } else {
                $response = array("success" => false, "error" => "Unknown error.");
                echo json_encode($response);
                http_response_code(404);
            }
        }
    }
}

function okResponse($data) {
    $response['status_code_header'] = 'HTTP/1.1 200 OK';
    $response['body'] = $data;
    return $response;
}

function notFoundResponse() {
    $response['status_code_header'] = 'HTTP/1.1 404 Not Found';
    $response['body'] = null;
    $response['error'] = null;
    var_dump($response);
    return $response;
}

?>