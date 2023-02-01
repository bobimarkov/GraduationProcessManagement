<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    validateJWT($jwt, ["student"]);

    $data = json_decode(file_get_contents("php://input"));

    foreach ($data as $k => $v) {
        if (empty(trim($v))) {
            $response = array("success" => false, "message" => "Грешка: Моля, въведете данни във всички полета.");
            echo json_encode($response);
            die;
        }
        switch ($k) {
            case "fn":
                $fn = $v;
                break;
            case "email":
                $email = $v;
                break;
            case "message":
                $message = $v;
                break;
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }
    $sender = getUserEmailFromJWT($jwt);

    validateEmail($email, $fn);
    updateMessageToDB($email, $message, $sender);


}

function validateEmail($email, $fn)
{
    $database = new Db();
    $conn = $database->getConnection();

    $stmt_moderators = $conn->prepare("SELECT `moderator_hat_email`, `moderator_gown_email`, `moderator_signature_email`
                                        FROM `student_moderators`
                                        WHERE `student_fn` = :fn");
    $stmt_moderators->execute(["fn" => $fn]);

    $rows = $stmt_moderators->fetch();

    $hat = $rows['moderator_hat_email'];
    $gown = $rows['moderator_gown_email'];
    $signature = $rows['moderator_signature_email'];
    if (empty($rows)) {
        $response = array("success" => false, "message" => "Грешка в системата!");
        echo json_encode($response);
        die;
    }
    else if($hat != $email && $gown != $email && $signature != $email && $email != "admin@gmail.com") {
        $response = array("success" => false, "message" => "Имейлът, на който изпращате, е грешен, или нямате право да изпращате на него!");
        echo json_encode($response);
        die;
    }
}

function updateMessageToDB($recipient, $content, $sender)
{
    $database = new Db();
    $conn = $database->getConnection();

    $insert_stmt = $conn->prepare("INSERT INTO `messages`(`sender`, `recipient`, `message`)
                                    VALUES(:sender, :recipient, :content)");

    $success = "";   
    $success = $insert_stmt->execute(["sender" => $sender, "recipient" => $recipient, "content" => $content]);    

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}

?>
