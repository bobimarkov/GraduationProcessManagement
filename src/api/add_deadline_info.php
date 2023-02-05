<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    validateJWT($jwt, ["admin"]);

    $data = json_decode(file_get_contents("php://input"));

    $database = new Db();
    $conn = $database->getConnection();

    $stmt_date = $conn->prepare("SELECT `graduation_date`
                            FROM `graduation_time`");
    $stmt_date->execute();
    $date = $stmt_date->fetch(PDO::FETCH_ASSOC);

    foreach ($data as $k => $v) {
        if (empty(trim($v))) {
            $response = array("success" => false, "message" => "Грешка: Моля, въведете данни във всички полета.");
            echo json_encode($response);
            die;
        }
        switch ($k) {
            case "deadline_gown":
                if($v >= $date['graduation_date']) {
                    $response = array("success" => false, "message" => "Грешка: Не може да зададете дата, която е след дипломирането!");
                    echo json_encode($response); 
                    die; 
                }
                $gown = $v;
                break;
            case "deadline_hat":
                if($v >= $date['graduation_date']) {
                    $response = array("success" => false, "message" => "Грешка: Не може да зададете дата, която е след дипломирането!");
                    echo json_encode($response); 
                    die; 
                }
                $hat = $v;
                break;
            case "deadline_attendance":
                if($v >= $date['graduation_date']) {
                    $response = array("success" => false, "message" => "Грешка: Не може да зададете дата, която е след дипломирането!");
                    echo json_encode($response); 
                    die; 
                }
                $attendance = $v;
                break;     
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }

    $update_stmt = $conn->prepare("UPDATE `graduation_time`
                                SET `deadline_gown` = :deadline_gown, `deadline_hat` = :deadline_hat, `deadline_attendance` = :deadline_attendance");
    
    $success = $update_stmt->execute(["deadline_gown" => $gown, "deadline_hat" => $hat, "deadline_attendance" => $attendance]);

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}


?>