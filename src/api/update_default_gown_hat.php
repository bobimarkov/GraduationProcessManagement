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
        switch ($k) {
            case "email":
                $email = $v;
                break;
            default: {
                    $response = array("success" => false, "message" => "Грешка: Невалидни входни данни. Възможно е да има техническа грешка.");
                    echo json_encode($response);
                    die;
                }
        }
    }

    updateUserToDB($email);
}

function updateUserToDB($email)
{
    $database = new Db();
    $conn = $database->getConnection();
    $get_user_fn_stmt = $conn->prepare("SELECT student.fn
                                        FROM student
                                        RIGHT JOIN user ON user.id = student.user_id 
                                        WHERE user.email = :email");
 
    $update_stmt_gown = $conn->prepare("UPDATE student_gown
                                       SET gown_requested = null 
                                       WHERE student_fn = :fn");
    
    $update_stmt_hat = $conn->prepare("UPDATE student_hat
                                       SET hat_requested = null
                                       WHERE student_fn = :fn");
    

    $get_user_fn_stmt->execute(["email" => $email]);
    $fn = $get_user_fn_stmt->fetchAll();


    $success1 = $update_stmt_gown->execute(["fn" => $fn[0]["fn"]]);
    $success2 = $update_stmt_hat->execute(["fn" => $fn[0]["fn"]]);


    if ($success1 && $success2) {
        $response = array("success" => true, "message" => "Промените са запаметени успешно.");
        echo json_encode($response);
        die;
    }
}

?>