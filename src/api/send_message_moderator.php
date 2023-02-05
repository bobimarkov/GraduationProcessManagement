<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    validateJWT($jwt, ["moderator-hat", "moderator-gown", "moderator-signature"]);

    $data = json_decode(file_get_contents("php://input"));

    foreach ($data as $k => $v) {
        if (empty(trim($v))) {
            $response = array("success" => false, "message" => "Грешка: Моля, въведете данни във всички полета.");
            echo json_encode($response);
            die;
        }
        switch ($k) {
            case "recipient":
                $recipient_email = $v;
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
    $sender_email = getUserEmailFromJWT($jwt);
    $role = getUserRoleFromJWT($jwt);

    if ($recipient_email == '@Студенти') {
        sendMessageToYourStudents(trim($message), $sender_email,$role);
    }
    else {
       $rec_split = explode(",", $recipient_email);
       $recipients_email = array_map("trim", $rec_split);
        validateEmail($sender_email, $recipients_email, $role);
        sendMessageTo($recipients_email, $message, $sender_email);
    }

    // validateEmail($sender_email, $recipient_email, $role);
    // updateMessageToDB($recipient_email, $message, $sender_email);


}

function validateEmail($sender_email, $recipients_email, $role)
{
    $database = new Db();
    $conn = $database->getConnection();

    $moderator_column = ($role == 'moderator-hat' ? `moderator_hat_email` :
        $role == 'moderator-gown') ? `moderator_gown_email` :
        `moderator_signature_email`;


    switch ($role) {
        case "moderator-hat":
            $moderator_column = "and moderator_hat_email = :sender_email";
            break;
        case "moderator-gown":
            $moderator_column = "and moderator_gown_email = :sender_email";
            break;
        case "moderator-signature":
            $moderator_column = "and moderator_signature_email = :sender_email";
            break;
        default: {
                $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                echo json_encode($response);
                die;
            }
    }

    
    $stmt_student = $conn->prepare("
        select student.fn, user.email, user.role
        from user 
        left join student on student.user_id = user.id
        left join student_moderators on student_moderators.student_fn = student.fn
        where email = :recipient_email " . $moderator_column);
        
    $stmt_user = $conn->prepare(" 
        select * from user 
        where role in ('admin', 'moderator-hat', 'moderator-gown', 'moderator-signature')
        and email = :recipient_email
        and email != :sender_email");

    foreach($recipients_email as $recipient_email) {
        $stmt_student->execute([
            "recipient_email" => $recipient_email,
            "sender_email" => $sender_email
        ]);
    
        $stmt_user->execute([
            "recipient_email" => $recipient_email,
            "sender_email" => $sender_email
        ]);

        
    $rows_student = $stmt_student->fetch();
    $rows_user = $stmt_user->fetch();

    if (empty($rows_student) && empty($rows_user)) {
        $response = array("success" => false, "message" => "Имейлът, на който изпращате, е грешен, или нямате право да изпращате на него!");
        echo json_encode($response);
        die;
    }
    }

}

function sendMessageTo($recipient, $content, $sender)
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


function sendMessageToYourStudents($content, $sender_email, $role ) {
    $database = new Db();
    $conn = $database->getConnection();

    switch ($role) {
        case "moderator-hat":
            $moderator_responsibility = "where moderator_hat_email = :sender_email and student_hat.hat_requested = 1";
            break;
        case "moderator-gown":
            $moderator_responsibility = "where moderator_gown_email = :sender_email and student_gown.gown_requested = 1";
            break;
        case "moderator-signature":
            $moderator_responsibility = "where moderator_signature_email = :sender_email and (student_diploma.attendance = 1 or student_diploma.take_in_advance_request = 1)";
            break;
        default: {
                $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                echo json_encode($response);
                die;
            }
    }



    $select_stmt = $conn->prepare("
    select distinct student.fn, user.email from student 
    join user on user.id = student.user_id
    join student_diploma on student.fn = student_diploma.student_fn
    join student_hat on student.fn = student_hat.student_fn
    join student_gown on student.fn = student_gown.student_fn
    join student_moderators on student.fn = student_moderators.student_fn " . $moderator_responsibility);

    var_dump($select_stmt);

    $insert_stmt = $conn->prepare("INSERT INTO `messages`(`sender`, `recipient`, `message`)
                                    VALUES(:sender, :recipient, :content)");

    $select_stmt->execute(["sender_email" => $sender_email]);
    $success = "";
    while($row = $select_stmt->fetch(PDO::FETCH_ASSOC)) {
        $success = $insert_stmt->execute(["sender" => $sender_email, "recipient" => $row['email'], "content" => $content]);
    }

    if ($success) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }

}

?>