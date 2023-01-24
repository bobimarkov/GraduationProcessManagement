<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    validateJWT($jwt, ["student"]);
    
    $data = json_decode(file_get_contents("php://input"));

    foreach ($data as $k => $v) {
        switch ($k) {
            case "column_name": {
                if (empty(trim($v))) {
                    $response = array("success" => false, "message" => "Грешка: Възникна технически проблем. Моля да ни извините.");
                    echo json_encode($response);
                    die;
                }
                $data_array["column_name"] = trim($v);
                break;
                }
            case "comment": {
                    if (empty(trim($v))) {
                        $response = array("success" => false, "message" => "Грешка: Моля, въведете причина за вашия избор в текстовото поле.");
                        echo json_encode($response);
                        die;
                    }
                    $data_array["comment"] = trim($v);
                    break;
                }
            case "value":
                if ($v != 0 && $v != 1) {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
                $data_array["value"] = $v;
                break;
            case "email":
                $data_array["email"] = $v;
                break;
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }

    updateUserToDB($data_array);
}

function updateUserToDB($content) {
    $column = $content["column_name"];
    $email = $content["email"];
    $comment = isset($content["comment"]) ? $content["comment"] : "";
    $value = $content["value"];

    $database = new Db();
    $conn = $database->getConnection();
    $get_user_fn_stmt = $conn->prepare("SELECT student.fn
                                        FROM student
                                        RIGHT JOIN user ON user.id = student.user_id 
                                        WHERE user.email = :email");
    $update_stmt = new PDOStatement();
    if ($column == "take_in_advance_request") {
        $update_stmt = $conn->prepare("UPDATE student_diploma 
                                       SET take_in_advance_request = \"$value\", take_in_advance_request_comment = \"$comment\" 
                                       WHERE student_fn = :fn");
    } else if ($column == "photos_requested" || $column == "attendance" || $column == "speech_response") {
        $update_stmt = $conn->prepare("UPDATE student_diploma 
                                       SET $column = \"$value\" 
                                       WHERE student_fn = :fn");
    } else if ($column == "grown_requested") {
        $update_stmt = $conn->prepare("UPDATE student_grown
                                       SET $column = \"$value\" 
                                       WHERE student_fn = :fn");
    } else if ($column == "hat_requested") {
        $update_stmt = $conn->prepare("UPDATE student_hat
                                       SET $column = \"$value\" 
                                       WHERE student_fn = :fn");
    }

    $get_user_fn_stmt->execute(["email" => $email]);
    $fn = $get_user_fn_stmt->fetchAll();


    $success = $update_stmt->execute(["fn" => $fn[0]["fn"]]);
    
    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно. Моля, презаредете страницата, за да ги видите.");
        echo json_encode($response);
        die;
    }
}