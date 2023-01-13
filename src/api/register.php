<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';


$data_array = array();
$errors = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    // var_dump($data);

    foreach ($data as $k => $v) {
        switch ($k) {
            case "name":
                $data_array["name"] = $v;
                break;
            case "username":
                $data_array["username"] = $v;
                break;
            case "password":
                $data_array["password"] = $v;
                break;
            case "role":
                $data_array["role"] = $v;
                break;    
            case "fn":
                $data_array["fn"] = $v;
                break;
            case "major":
                $data_array["major"] = $v;
                break;
            default:
                $data_array["invalid_field"] = "true";
        }
    }
    
    if ($errors) {
        $response = array("success" => false, "errors:" => json_encode($errors, JSON_UNESCAPED_UNICODE));
        echo json_encode($response);
        http_response_code(404);
    } else {
        $database = new Db();
        $conn = $database->getConnection();
        $stmt = $conn->prepare("INSERT INTO `user` (`username`, `password`, `name`, `role`) VALUES (:username, :password, :name, :role);");

        try {
            $stmt->execute(["username" => $data_array["username"], "password" => $data_array["password"], "name" => $data_array["name"], "role" => $data_array["role"]]);
            if ($stmt) {
                $response = array("success" => true);
                echo json_encode($response);
                http_response_code(200);
            }
        } catch(PDOException $e) {

            if ($stmt->errorCode() == 23000) {
                $response = array("success" => false, "error" => "User with this username already exists.");
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
