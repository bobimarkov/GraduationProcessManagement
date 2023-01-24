<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    validateJWT($jwt, ["admin"]);

    $data = json_decode(file_get_contents("php://input"));

    foreach ($data as $k => $v) {
        if (empty(trim($v))) {
            $response = array("success" => false, "message" => "Грешка: Моля, въведете данни във всички полета.");
            echo json_encode($response);
            die;
        }
        switch ($k) {
            case "fns":
                $data_array["fns"] = $v;
                break;
            case "action_option":
                $data_array["action_option"] = $v;
                break;
            case "action_content":
                $data_array["action_content"] = $v;
                break;
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }
    $fns_split = explode(",", $data_array["fns"]);
    $fns_split = array_map("trim", $fns_split);
    validateFns($fns_split);

    $column_name;
    getColumnByOptionNumber($column_name, $data_array["action_option"]);

    updateUserToDB($fns_split, $column_name, trim($data_array["action_content"]));
}

function getColumnByOptionNumber(&$column_name, $action) {
    switch ($action) {
        case "1":
            $column_name = "has_right";
            break;
        case "2":
            $column_name = "is_ready";
            break;
        case "3":
            $column_name = "is_taken";
            break;
        case "4":
            $column_name = "is_taken_in_advance";
            break;
        case "5":
            $column_name = "diploma_comment";
            break;
        case "6":
            $column_name = "speech_request";
            break;
        case "7":
            $column_name = "grown_taken";
            break;
        case "8":
            $column_name = "grown_returned";
            break;
        case "9":
            $column_name = "hat_taken";
            break;
        case "10":
            $column_name = "hat_returned";
            break;
        default: {
            $response = array("success" => false, "message" => "Грешка: Невалидна опция.");
            echo json_encode($response);
            die;
        }
    }
}

function validateFns(&$fns) {
    foreach($fns as $key => $fn) {
        if($fn == "") {
            unset($fns[$key]);
        } else if ((strlen($fn) == 5 || strlen($fn) == 6) && !is_numeric($fn)) {
            $response = array("success" => false, "message" => "Грешка за студент с ФН $fn - ФН (стар модел) не може да съдържа символи различни от цифрите 0-9!");
            echo json_encode($response);
            die;
        } else if (strlen($fn) == 10 && !ctype_alnum($fn)) {
            $response = array("success" => false, "message" => "Грешка за студент с ФН $fn - ФН (нов модел) може да съдържа само цифри и букви");
            echo json_encode($response);
            die;
        } else if (strlen($fn) != 10 && strlen($fn) != 5 && strlen($fn) != 6) {
            $response = array("success" => false, "message" => "Грешка за студент с ФН $fn - Невалидна дължина на ФН: 5 или 6 (за стар модел) или 10 (за нов модел)!");
            echo json_encode($response);
            die;
        }
    }

    // if (count($values) != 5) {
    //     $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - стойностите трябва да са 5 на брой! \nМоля, отделяйте всеки потребител на нов ред.");
    //     echo json_encode($response);
    //     die;

}

function updateUserToDB($fns, $column_name, $content) {
    $table_name = "";
    if ($column_name == "grown_taken" || $column_name == "grown_returned") {
        $table_name = "student_grown";
    } else if ($column_name == "hat_taken" || $column_name == "hat_returned") {
        $table_name = "student_hat";
    } else {
        $table_name = "student_diploma";
    }

    if ($column_name != "diploma_comment") {
        $content = $content == 'Да' ? 1 : 0;
    }

    $database = new Db();
    $conn = $database->getConnection();
    $stmt_fn_check = $conn->prepare("SELECT fn 
                                    FROM student
                                    WHERE fn = :fn");
    $update_stmt = $conn->prepare("UPDATE $table_name SET $column_name = \"$content\" WHERE student_fn = :fn");

    if(($column_name == "is_taken" || $column_name == "is_taken_in_advance") && $content = 1) {
        checkIfDiplomaIsReady($fns, $conn);
    }

    foreach ($fns as $fn) {
        $stmt_fn_check->execute(["fn" => $fn]);
        $present_fn = $stmt_fn_check->fetchAll();
        if (!count($present_fn)) {
            $response = array("success" => false, "message" => "Грешка за ФН ${fn} - не съществува студент с този факултетен номер!");
            echo json_encode($response);
            die;
        }
    }
    $success = "";
    foreach ($fns as $fn) {
        $success = $update_stmt->execute(["fn" => $fn]);
    }
    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно. Моля, презаредете страницата, за да ги видите.");
        echo json_encode($response);
        die;
    }
}

function checkIfDiplomaIsReady($fns, $conn) {
    $stmt_is_ready_check = $conn->prepare("SELECT is_ready 
                                            FROM student_diploma
                                            WHERE student_fn = :fn");
    
    foreach ($fns as $fn) {
        $stmt_is_ready_check->execute(["fn" => $fn]);
        $is_ready = $stmt_is_ready_check->fetchAll();

        if($is_ready[0]["is_ready"] == 0) {
            $response = array("success" => false, "message" => "Не може да отбележите диплома като 'взета' без да е готова.");
            echo json_encode($response);
            die;
        }
    }
}