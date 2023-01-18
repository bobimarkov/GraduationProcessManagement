<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

$users_data = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    // Check if username is empty
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
        $i = 1;
        foreach ($users_arr_1d as $user) {
            $user = trim($user);
            $values = explode(",", $user);
            // проверка дали стойностите на потребителя са валидни
            validateInput($values, $user, $i);

            $values_trimmed = array_map("trim", $values);
            $values_indexed = array_values($values_trimmed);

            $users_arr_2d += [$i => $values_trimmed];
            $i++;
        }

        exportUsersToDB($users_arr_2d);
    
        exit; 
    }
}

function validateInput($values, $user, $i) {
    $letters_only_pattern  = "/^[a-zA-Z\p{Cyrillic}\s\-]+$/u";
    $values_trimmed = array_map("trim", $values);
    $values_indexed = array_values($values_trimmed);

    if (count($values) != 5) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - стойностите трябва да са 5 на брой! \nМоля, отделяйте всеки потребител на нов ред.");
        echo json_encode($response);
        die;
    }
    if (empty($values_indexed[0]) || empty($values_indexed[1]) || empty($values_indexed[2]) || empty($values_indexed[3]) || empty($values_indexed[4])) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - стойностите не трябва да са празни!");
        echo json_encode($response);
        die;
    }

    $email = filter_var($values_indexed[0], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - невалиден имейл адрес!");
        echo json_encode($response);
        die;
    }

    $three_names = explode(" ", $values_indexed[2]);
    if (count($three_names) != 3) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - трябва да съдържа 3 имена!");
        echo json_encode($response);
        die;
    }
    foreach($three_names as $name) {
        if (!preg_match($letters_only_pattern, $name)) {
            $response = array("success" => false, "message" => "Грешка за студент $i ($user) - имената могат да съдържат само букви!");
            echo json_encode($response);
            die;
        }
    }

    $phone = $values_indexed[3];
    if (!is_numeric($phone)) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - телефонът не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    }

    $role = $values_indexed[4];
    if ($role != "admin" && $role != "moderator") {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - ролята може да е или admin, или moderator!");
        echo json_encode($response);
        die;
    }
}

function exportUsersToDB($users_arr_2d) {
    $database = new Db();
    $conn = $database->getConnection();

    $stmt_email_check = $conn->prepare("SELECT email 
                                        FROM user
                                        WHERE email = :email");
    $stmt_register_user = $conn->prepare("INSERT INTO `user` (`email`, `password`, `name`, `phone`, `role`) 
                                          VALUES (:email, :password, :name, :phone, :role)");
    $success = "";
    // check for already existing user with this email
    foreach ($users_arr_2d as $user => $values) {
        $stmt_email_check->execute(["email" => $values[0]]);
        $present_email = $stmt_email_check->fetchAll();
        if(count($present_email)) {
            $response = array("success" => false, "message" => "Грешка за потребител с имейл $values[0] - имейлът вече същестува!");
                    echo json_encode($response);
                    die;
        }

        $success = $stmt_register_user->execute([
            "email" => $values[0],
            "password" => sha1($values[1]),
            "name" => $values[2],
            "phone" => $values[3],
            "role" => $values[4]
            
        ]);
    }
    if ($success) {
        $response = array("success" => true, "message" => "Потребителите са въведени успешно. Моля, презаредете страницата, за да ги видите.");
        echo json_encode($response);
        die;
    }
}