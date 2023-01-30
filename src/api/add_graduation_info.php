<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    validateJWT($jwt, ["admin"]);

    $data = json_decode(file_get_contents("php://input"));

    $database = new Db();
    $conn = $database->getConnection();

    $stmt_year = $conn->prepare("SELECT `class`
                            FROM `graduation_time`
                            LIMIT 1");
    $stmt_year->execute();
    $year = $stmt_year->fetch(PDO::FETCH_ASSOC);
    foreach ($data as $k => $v) {
        if (empty(trim($v))) {
            $response = array("success" => false, "message" => "Грешка: Моля, въведете данни във всички полета.");
            echo json_encode($response);
            die;
        }
        switch ($k) {
            case "start_time":
                if(preg_match('/^(0?[0-9]|[01][0-9]|2[0-3]):[0-5][0-9]$/', $v)) {
                    $data_array["start_time"] = $v;
                }
                else {
                    $response = array("success" => false, "message" => "Грешка: Некоректен формат на началния час! Трябва да е 'час:минути'!");
                    echo json_encode($response);
                    die;
                }
                break;
            case "students_interval":
                if (preg_match('/^(0?[0-9]|[0-5][0-9]):?([0-5]?[0-9]?)$/', $v)) {
                    $data_array["students_interval"] = 00 . ':' . $v;
                }
                else {
                    $response = array("success" => false, "message" => "Грешка: Некоректен формат на интервала! Трябва да е 'минути:секунди'!");
                    echo json_encode($response);
                    die;
                }
                break;
            case "graduation_date":
                $data_array["graduation_date"] = $v;
                $timestamp = strtotime($v); 
                $yearGrad=date('Y',$timestamp);
                break;
            case "graduation_place":
                $data_array["graduation_place"] = $v;
                break;
            case "class":
                if($v + 1 != $yearGrad) {
                    $response = array("success" => false, "message" => "Грешка: Дипломирането е една година след годината на завършване!");
                    echo json_encode($response); 
                    die; 
                }
                else {
                    $data_array['class'] = $v;
                }
                break;        
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }

    $update_stmt = $conn->prepare("UPDATE `graduation_time`
                                SET `start_time` = :start_time, `students_interval` = :students_interval, `graduation_date` = :graduation_date, `graduation_place` = :graduation_place, `class` = :class
                                WHERE `id` = 1");
    
    $success = $update_stmt->execute(["start_time" => $data_array['start_time'], "students_interval" => $data_array['students_interval'], "graduation_date" => $data_array['graduation_date'], "graduation_place" => $data_array['graduation_place'], "class" => $data_array['class']]);

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}

?>