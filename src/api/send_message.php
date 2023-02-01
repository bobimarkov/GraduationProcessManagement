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
            case "recipient":
                $data_array['recipient'] = $v;
                break;
            case "message":
                $data_array['message'] = $v;
                break;
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }
    $sender = getUserEmailFromJWT($jwt);

    if ($data_array["recipient"] == '@Студенти') {
        updateAllMessageToDB(trim($data_array["message"]), $sender);
    }
    else if($data_array["recipient"] == '@Шапки') {
        updateAllMessageForModeratorsToDB(trim($data_array["message"]), $sender, 'moderator-hat');
    }
    else if($data_array["recipient"] == '@Тоги') {
        updateAllMessageForModeratorsToDB(trim($data_array["message"]), $sender, 'moderator-gown');
    }
    else if($data_array["recipient"] == '@Подписи') {
        updateAllMessageForModeratorsToDB(trim($data_array["message"]), $sender, 'moderator-signature');
    }
    else {
        $rec_split = explode(",", $data_array["recipient"]);
        $rec_split = array_map("trim", $rec_split);
        validateEmails($rec_split);
        updateMessageToDB($rec_split, trim($data_array["message"]), $sender);
    }
}

function validateEmails($emails)
{
    $database = new Db();
    $conn = $database->getConnection();

    $stmt_emails_students = $conn->prepare("SELECT * from `student`
                                    JOIN `user` ON `id` = `user_id`
                                    WHERE `email` = :email AND `has_diploma_right` = 1");

    $stmt_emails_others = $conn->prepare("SELECT `email` from `user`
                                            WHERE `role` != 'student' AND `email` = :email");

    foreach ($emails as $key => $email) {
        $stmt_emails_students->execute(["email" => $email]);
        $student = $stmt_emails_students->fetch();

        $stmt_emails_others->execute(["email" => $email]);
        $other = $stmt_emails_others->fetch();

        if (empty($student) && empty($other)) {
            $response = array("success" => false, "message" => "Не съществува такъв имейл - $email - проверете дали се опитвате да изпратите съобщение на дипломиращ се студент или на модератор!");
            echo json_encode($response);
            die;
        }
    }
}

function updateMessageToDB($recipient, $content, $sender)
{
    $database = new Db();
    $conn = $database->getConnection();

    $insert_stmt = $conn->prepare("INSERT INTO `messages`(`sender`, `recipient`, `message`)
                                    VALUES(:sender, :recipient, :content)");

    $success = "";
    foreach ($recipient as $key => $email) {
        $success = $insert_stmt->execute(["sender" => $sender, "recipient" => $email, "content" => $content]);   
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

    $select_stmt = $conn->prepare("SELECT `email` FROM `student`
                                    JOIN `user` ON `id` = `user_id`
                                    WHERE `has_diploma_right` = 1");

    $insert_stmt = $conn->prepare("INSERT INTO `messages`(`sender`, `recipient`, `message`)
                                    VALUES(:sender, :recipient, :content)");

    $select_stmt->execute();
    $success = "";
    while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
        $success = $insert_stmt->execute(["sender" => $sender, "recipient" => $row['email'], "content" => $content]);
    }

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}

function updateAllMessageForModeratorsToDB($content, $sender, $moderator)
{
    $database = new Db();
    $conn = $database->getConnection();

    $select_stmt = $conn->prepare("SELECT `email` FROM `user`
                                    WHERE `role` = '$moderator'");

    $insert_stmt = $conn->prepare("INSERT INTO `messages`(`sender`, `recipient`, `message`)
                                    VALUES(:sender, :recipient, :content)");

    $select_stmt->execute();
    $success = "";
    while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
        $success = $insert_stmt->execute(["sender" => $sender, "recipient" => $row['email'], "content" => $content]);
    }

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}

?>