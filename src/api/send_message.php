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
            case "message":
                $data_array["message"] = $v;
                break;
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }
    $sender = getUserEmailFromJWT($jwt);

    if ($data_array["fns"] != '@всички') {
        $fns_split = explode(",", $data_array["fns"]);
        $fns_split = array_map("trim", $fns_split);
        validateFns($fns_split);
        updateMessageToDB($fns_split, trim($data_array["message"]), $sender);
    }
    else {
        updateAllMessageToDB(trim($data_array["message"]), $sender);
    }

}


function validateFns(&$fns)
{
    $database = new Db();
    $conn = $database->getConnection();

    $select_stmt = $conn->prepare("SELECT email from student
                                    join user on id = user_id
                                    where has_diploma_right = 1 and fn = :fn");
    foreach ($fns as $key => $fn) {
        if ($fn == "") {
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
        $select_stmt->execute(["fn" => $fn]);
        $res = $select_stmt->fetchAll();
        if(empty($res)){
            $response = array("success" => false, "message" => "Грешка за студент с ФН $fn - Не съществува такъв студент, който ще се дипломира!");
            echo json_encode($response);
            die;
        }
    }
}

function updateMessageToDB($fns, $content, $sender)
{
    $database = new Db();
    $conn = $database->getConnection();

    $select_stmt = $conn->prepare("SELECT email from student
                                    join user on id = user_id
                                    where has_diploma_right = 1 and fn = :fn");

    $insert_stmt = $conn->prepare("INSERT INTO messages(sender, recipient, message)
                                    VALUES(:sender, :recipient, :content)");

    $success = "";
    foreach ($fns as $fn) {
        $select_stmt->execute(["fn" => $fn]);
        $recipient = $select_stmt->fetchAll()[0]['email'];
        $success = $insert_stmt->execute(["sender" => $sender, "recipient" => $recipient, "content" => $content]);
        //mail('bomar3110@gmail.com', "Graduation", $content);
    }

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}

function updateAllMessageToDB($content, $sender)
{
    $database = new Db();
    $conn = $database->getConnection();

    $select_stmt = $conn->prepare("SELECT email from student
                                    join user on id = user_id
                                    where has_diploma_right = 1");

    $insert_stmt = $conn->prepare("INSERT INTO messages(sender, recipient, message)
                                    VALUES(:sender, :recipient, :content)");

    $select_stmt->execute();
    $success = "";
    while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
        $success = $insert_stmt->execute(["sender" => $sender, "recipient" => $row['email'], "content" => $content]);
        //mail('bomar3110@gmail.com', "Graduation", $content);
    }

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}
