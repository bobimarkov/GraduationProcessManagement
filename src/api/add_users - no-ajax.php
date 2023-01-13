<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

$data_array = array();

$users_data = "";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if username is empty
    if (empty(trim($_POST["addUsers"]))) {
        $_SESSION["error"] = "Грешка: Моля, въведете данни за потребител.";
        redirectHome();
        die;
    } else {
        $users_data = trim($_POST["addUsers"]);
    }


    // разделяме потребителите спрямо PHP_EOL
    $users_arr_1d = explode(PHP_EOL, $users_data);
    if (count($users_arr_1d) > 0) {
        // всеки потребител го разделяме спрямо , получавайки масив от полетата му $values => 
        // накрая имаме масив от потребители $users_arr_2d, където всеки потребител е масив от стойности
        $users_arr_2d = array();
        $i = 1;
        foreach ($users_arr_1d as $user) {
            $user = trim($user);
            $values = explode(",", $user);
            // проверка дали стойностите на потребителя са валидни
            if (count($values) != 5) {
                $_SESSION["error"] = "Грешка за потребител $i ($user) - стойностите трябва да са 5 на брой!";
                redirectHome();
                die;
            }

            $values_trimmed = array_map("trim", $values);
            $values_indexed = array_values($values_trimmed);
            if (empty($values_indexed[0]) || empty($values_indexed[1]) || empty($values_indexed[2]) || empty($values_indexed[3]) || empty($values_indexed[4])) {
                $_SESSION["error"] = "Грешка за потребител $i ($user) - стойностите не трябва да са празни!";
                redirectHome();
                die;
            }
            $email = filter_var($values_indexed[0], FILTER_SANITIZE_EMAIL);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $_SESSION["error"] = "Грешка за потребител $i ($user) - невалиден имейл адрес!";
                redirectHome();
                die;
            }
            $three_names = explode(" ", $values_indexed[2]);
            if (count($three_names) != 3) {
                $_SESSION["error"] = "Грешка за потребител $i ($user) - трябва да съдържа 3 имена!";
                redirectHome();
                die;
            }
            $role = $values_indexed[3];
            if ($role != "admin" && $role != "moderator") {
                $_SESSION["error"] = "Грешка за потребител $i ($user) - ролята може да е или admin, или moderator!";
                redirectHome();
                die;
            }
            $phone = $values_indexed[4];
            if (!is_numeric($phone)) {
                $users_data_SESSION["error"] = "Грешка за потребител $i ($user) - телефонът не може да съдържа символи различни от цифрите 0-9!";
                redirectHome();
                die;
            }
            // край на проверката

            $users_arr_2d += [$i => $values_trimmed];
            $i++;
            // array_push($users_arr_2d, explode(",", $user));
        }

        var_dump($users_arr_2d);

        $database = new Db();
        $conn = $database->getConnection();

        $stmt_email_check = $conn->prepare("SELECT email 
                                                FROM user");
        $stmt_email_check->execute();
        $emails = $stmt_email_check->fetchAll();

        $stmt_register_user = $conn->prepare("INSERT INTO `user` (`email`, `password`, `name`, `role`, `phone`) 
                                    VALUES (:email, :password, :name, :role, :phone)");

        foreach ($users_arr_2d as $user => $values) {
            // проверка дали имейла вече го има в базата
            if (count($emails) > 0) {
                foreach ($emails as $key => $value) {
                    if ($value['email'] == $values[0]) {
                        $_SESSION["error"] = "Грешка за потребител с имейл $values[0] - имейлът вече същестува!";
                        redirectHome();
                        die;
                    }
                }
            }
            $success = $stmt_register_user->execute([
                "email" => $values[0],
                "password" => sha1($values[1]),
                "name" => $values[2],
                "role" => $values[3],
                "phone" => $values[4]
            ]);
        }
        if ($success) {
            $_SESSION["error"] = "";
            redirectHome();
        }
        exit;
    }
}

function redirectHome()
{
    $role = $_SESSION["role"];
    switch ($role) {
        case "admin":
            echo "here";
            header("Location: ../user_pages/admin/admin_home.php");
            break;
        case "moderator":
            header("Location: ../user_pages/admin/moderator_home.php");
            break;
    }
};
