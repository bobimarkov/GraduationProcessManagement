<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../database/db_conf.php';

$data_array = array();

$users_data = "";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));

    if (empty(trim($data))) {
        $response = array("success" => false, "message" => "Грешка: Моля, въведете данни за студент(и).");
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
            // проверка дали стойностите на студента са валидни
            validateInput($values, $user, $i);

            $values_trimmed = array_map("trim", $values);
            $values_indexed = array_values($values_trimmed);

            $users_arr_2d += [$i => $values_trimmed];
            $i++;
        }

        exportStudentsToDB($users_arr_2d);

        exit;
    }
}

function validateInput($values, $user, $i)
{
    $alpha_numeric_pattern  = "/^[a-zA-Z\p{Cyrillic}0-9\s\-]+$/u";
    $letters_only_pattern  = "/^[a-zA-Z\p{Cyrillic}\s\-]+$/u";

    $values_trimmed = array_map("trim", $values);
    $values_indexed = array_values($values_trimmed);

    if (count($values) != 11) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - стойностите трябва да са 9 на брой! \nМоля, отделяйте всеки студент на нов ред.");
        echo json_encode($response);
        die;
    }

    if (
        empty($values_indexed[0]) || empty($values_indexed[1]) || empty($values_indexed[2]) || empty($values_indexed[3]) || empty($values_indexed[4])
        || empty($values_indexed[5]) || empty($values_indexed[6]) || empty($values_indexed[7]) || empty($values_indexed[8])
        || empty($values_indexed[10])
    ) { // без 9 т.к. там може да е 0, а trim на 60 ред ще я изтрие
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - стойностите не трябва да са празни!");
        echo json_encode($response);
        die;
    }

    $email = filter_var($values_indexed[0], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - невалиден имейл адрес!");
        echo json_encode($response);
        die;
    }

    $three_names = explode(" ", $values_indexed[2]);
    if (count($three_names) != 3) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - трябва да съдържа 3 имена!");
        echo json_encode($response);
        die;
    }
    foreach ($three_names as $name) {
        if (!preg_match($letters_only_pattern, $name)) {
            $response = array("success" => false, "message" => "Грешка за студент $i ($user) - имената могат да съдържат само букви!");
            echo json_encode($response);
            die;
        }
    }

    $phone = $values_indexed[3];
    if (!is_numeric($phone)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - телефонът не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    }

    $role = $values_indexed[4];
    if ($role != "student") {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - ролята може да е само student!");
        echo json_encode($response);
        die;
    }

    $fn = $values_indexed[5];
    if ((strlen($fn) == 5 || strlen($fn) == 6) && !is_numeric($fn)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - ФН (стар модел) не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    } else if (strlen($fn) == 10 && !ctype_alnum($fn)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - ФН (нов модел) може да съдържа само цифри и букви");
        echo json_encode($response);
        die;
    } else if (strlen($fn) != 10 && strlen($fn) != 5 && strlen($fn) != 6) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - Невалидна дължина на ФН: 5 или 6 (за стар модел) или 10 (за нов модел)!");
        echo json_encode($response);
        die;
    }

    $degree = $values_indexed[6];
    if ($degree != "Б" && $degree != "Д" && $degree != "М") {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - Степента може да е само Б(бакалавър), М(магистър), Д(доктор)!");
        echo json_encode($response);
        die;
    }

    $major = $values_indexed[7];
    if ($degree == "Б" && $major != "КН" && $major != "СИ" && $major != "ИС" && $major != "И" && $major != "М" && $major != "ПМ" && $major != "С") {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - специалността за степен Б(бакалавър) може да е само една от [КН, СИ, ИС, И, М, ПМ, С]!");
        echo json_encode($response);
        die;
    } else if ($degree != "Б" && !preg_match($letters_only_pattern, $major)) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - специалността за степен M(бакалавър) и Д(доктор) може да съдържа само букви!");
        echo json_encode($response);
        die;
    }

    $group = $values_indexed[8];
    if ($degree == "Б" && $group != "1" && $group != "2" && $group != "3" && $group != "4" && $group != "5" && $group != "6" && $group != "7" && $group != "8") {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - групата за степен Б(бакалавър) може да е само от 1-8!");
        echo json_encode($response);
        die;
    } else if ($degree != "Б" && !is_numeric($group)) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - групата за степен M(бакалавър) и Д(доктор) може да съдържа само цифри!");
        echo json_encode($response);
        die;
    }

    $has_diploma_right = $values_indexed[9];
    if ($has_diploma_right != "" && $has_diploma_right != 0 && $has_diploma_right != 1) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - правото на диплома може да е само 0(НЕ) или 1(ДА)!");
        echo json_encode($response);
        die;
    }
    if ($has_diploma_right != "") {
        $values_indexed[9] = 0;
    }

    $grade = $values_indexed[10];
    // echo $grade;
    if (!is_numeric($grade)) {
        $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - оценката трябва да е двоично число със запетая!");
        echo json_encode($response);
        die;
    }
    if (floatval($grade) < 2.00 || floatval($grade) > 6.00) {
        if (floatval($grade) != 0) {
            $response = array("success" => false, "message" => "Грешка за потребител $i ($user) - оценката трябва да е между 2.00 и 6.00! Ако студентът все още няма оценка, въведете 0.00.");
            echo json_encode($response);
            die;
        }
    }
}

function exportStudentsToDB($users_arr_2d)
{
    $database = new Db();
    $conn = $database->getConnection();

    $stmt_email_check = $conn->prepare("SELECT email 
                                        FROM user
                                        WHERE email = :email");
    $stmt_fn_check = $conn->prepare("SELECT fn 
                                    FROM student
                                    WHERE fn = :fn");
    $stmt_id_extract = $conn->prepare("SELECT id 
                                     FROM user
                                     WHERE user.email = :email");
    $stmt_register_user = $conn->prepare("INSERT INTO `user` (`email`, `password`, `name`, `phone`, `role`) 
                                          VALUES (:email, :password, :name, :phone, :role)");
    $stmt_register_student = $conn->prepare("INSERT INTO `student` (`fn`, `user_id`, `degree`, `major`, `group`) 
                                             VALUES (:fn, :user_id, :degree, :major, :group)");
    $stmt_register_student_diploma = $conn->prepare("INSERT INTO `student_diploma` (`student_fn`, `has_right`, `grade`) 
                                             VALUES (:student_fn, :has_right, :grade)");
    $stmt_register_student_grown = $conn->prepare("INSERT INTO `student_grown` (`student_fn`) 
                                             VALUES (:student_fn)");
    $stmt_register_student_hat = $conn->prepare("INSERT INTO `student_hat` (`student_fn`) 
                                             VALUES (:student_fn)");

    $success = "";
    // check for already existing user with this email or FN
    foreach ($users_arr_2d as $user => $values) {
        //email check
        $stmt_email_check->execute(["email" => $values[0]]);
        $present_email = $stmt_email_check->fetchAll();
        if (count($present_email)) {
            $response = array("success" => false, "message" => "Грешка за потребител с имейл $values[0] - имейлът вече същестува!");
            echo json_encode($response);
            die;
        }
        //FN check
        $stmt_fn_check->execute(["fn" => $values[5]]);
        $present_fn = $stmt_fn_check->fetchAll();
        if (count($present_fn)) {
            $response = array("success" => false, "message" => "Грешка за потребител с имейл $values[0] - вече съществува студент с факултетен номер $values[5]!");
            echo json_encode($response);
            die;
        }
        //register - user part
        $success = $stmt_register_user->execute([
            "email" => $values[0],
            "password" => sha1($values[1]),
            "name" => $values[2],
            "phone" => $values[3],
            "role" => $values[4]
        ]);
        //get the id of the registered user
        $stmt_id_extract->execute(["email" => $values[0]]);
        $id = $stmt_id_extract->fetchAll();
        if ($id[0]["id"]) {
            //register - student part
            $stmt_register_student->execute([
                "fn" => $values[5],
                "user_id" => $id[0]["id"],
                "degree" => $values[6],
                "major" => $values[7],
                "group" => $values[8]
            ]);
            $stmt_register_student_diploma->execute([
                "student_fn" => $values[5],
                "has_right" => $values[9],
                "grade" => $values[10]
            ]);
            $stmt_register_student_grown->execute([
                "student_fn" => $values[5]
            ]);
            $success = $stmt_register_student_hat->execute([
                "student_fn" => $values[5]
            ]);
        }
    }
    if ($success) {
        $response = array("success" => true, "message" => "Студентите са въведени успешно. Моля, презаредете страницата, за да ги видите.");
        echo json_encode($response);
        die;
    }
}
