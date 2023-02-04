<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$users_data = "";

if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    validateJWT($jwt, ["admin"]);

    $data = json_decode(file_get_contents("php://input"));

    if (empty(trim($data))) {
        $response = array("success" => false, "message" => "Грешка: Моля, въведете данни за потребител(и).");
        echo json_encode($response);
        die;
    } else {
        $users_data = trim($data);
    }

    // махаме всички нови редове >=2
    $users_data_escape_multiple_endlines = preg_replace("/[\r\n]+/", "\n", $users_data);

    $users_arr_1d = preg_split("/\r\n|\r|\n/", $users_data_escape_multiple_endlines);

    if (count($users_arr_1d) > 0) {

        // всеки потребител го разделяме спрямо , получавайки масив от полетата му $values => 
        // накрая имаме масив от потребители $users_arr_2d, където всеки потребител е масив от стойности
        $users_arr_2d = array();
        $i = 0;
        foreach ($users_arr_1d as $user) {
            $user = trim($user);
            $values = explode(",", $user);
            // проверка дали стойностите на студента са валидни
            validateInput($values, $user, ($i + 1));

            $values_trimmed = array_map("trim", $values);
            $values_indexed = array_values($values_trimmed);

            $users_arr_2d += [$i => $values_trimmed];
            $i++;
        }

        updateStudentsDB($users_arr_2d);
    }
}

function updateStudentsDB($users_arr_2d)
{
    $database = new Db();
    $conn = $database->getConnection();


    $stmt = $conn->prepare("UPDATE user SET name = :name, email = :email , phone = :phone WHERE id = :id ");

    foreach ($users_arr_2d as $user) {
        $stmt->execute(["id" => $user[0], "name" => $user[1], "email" => $user[2], "phone" => $user[3]]);
    }
    $response = array("success" => true, "message" => "Данните на потребителите са променени успешно.");

    echo json_encode($response);

}

function validateInput(&$values, $user, $i)
{
    $values_trimmed = array_map("trim", $values);
    $values_indexed = array_values($values_trimmed);

    if (count($values) != 4) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($user) - стойностите трябва да са 4 на брой! \nМоля, отделяйте всеки студент на нов ред.");
        echo json_encode($response);
        die;
    }

    if (empty($values_indexed[0]) || empty($values_indexed[1]) || empty($values_indexed[2]) || empty($values_indexed[3])) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($user) - стойностите не трябва да са празни!");
        echo json_encode($response);
        die;
    }
    $email = filter_var($values_indexed[2], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($user) - невалиден имейл адрес!");
        echo json_encode($response);
        die;
    }

    $phone = $values_indexed[3];
    if (!is_numeric($phone)) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($user) - телефонът не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    }
}