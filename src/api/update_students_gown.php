<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$students_data = "";

if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    validateJWT($jwt, ["moderator-gown"]);

    $data = json_decode(file_get_contents("php://input"));
    $email = getUserEmailFromJWT($jwt);

    $database = new Db();
    $conn = $database->getConnection();

    if (empty(trim($data))) {
        $response = array("success" => false, "message" => "Грешка: Моля, въведете данни за студент(ите).");
        echo json_encode($response);
        die;
    } else {
        $students_data = trim($data);
    }

    // махаме всички нови редове >=2
    $students_data_escape_multiple_endlines = preg_replace("/[\r\n]+/", "\n", $students_data);

    $students_arr_1d = preg_split("/\r\n|\r|\n/", $students_data_escape_multiple_endlines);

    if (count($students_arr_1d) > 0) {

        // всеки потребител го разделяме спрямо , получавайки масив от полетата му $values => 
        // накрая имаме масив от потребители $students_arr_2d, където всеки потребител е масив от стойности
        $students_arr_2d = array();
        $i = 0;
        foreach ($students_arr_1d as $student) {
            $student = trim($student);
            $values = array_values(explode(",", $student));
            $values = array("fn" => trim($values[0]), "gown_taken" => trim($values[1]),"gown_returned" => trim($values[2]));
 
            validateInput($values, $student, ($i + 1), $conn, $email);
            $students_arr_2d += [$i => array_map("trim", $values)];
            $i++;
        }
        updateStudentsDB($conn, $students_arr_2d);
    }
}


function validateInput($values, $student, $i, $connection, $email)
{
    if (count($values) != 3) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - стойностите трябва да са 3 на брой! \nМоля, отделяйте всеки студент на нов ред.");
        echo json_encode($response);
        die;
    }

    if (empty($values["fn"])) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - Фн не може да е празна стойност!");
        echo json_encode($response);
        die;
    }

    if ((empty($values["gown_taken"]) && empty($values["gown_returned"]))) {
        $text_taken = 'Взета'; $text_returned = 'Върната';
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - Не може и $text_taken и $text_returned да бъдат празни!");
        echo json_encode($response);
        die;
    }

    if(!empty($values["gown_taken"])) {
        if (!in_array(mb_strtoupper($values["gown_taken"]), ["ДА", "НЕ"])) {
            $text = 'Взета';
            $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - $text може да е само Да или Не !");
            echo json_encode($response);
            die;
        }
    }

    if(!empty($values["gown_returned"])) {
        if (!in_array(mb_strtoupper($values["gown_returned"]), ["ДА", "НЕ"])) {
            $text = 'Върната';
            $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - $text може да е само Да или Не !");
            echo json_encode($response);
            die;
        }
    }


    $stmt = $connection->prepare("
        select student.fn
        from student
        join user on user.id = student.user_id
        join student_diploma on student.fn = student_diploma.student_fn
        join student_gown on student.fn = student_gown.student_fn
        join student_moderators on student_diploma.student_fn = student_moderators.student_fn
        where moderator_gown_email = :email and student.fn = :fn and student_gown.gown_requested = 1");

    $stmt->execute(["email" => $email, "fn" => $values["fn"]]);

    if(empty($stmt->fetch())) {
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - нямате права да актуализирате данните за този потребител!");
        echo json_encode($response);
        die;
    }
}


function updateStudentsDB($conn, $students_arr_2d)
{
    foreach ($students_arr_2d as $student) {
        $variables = array("fn" => $student["fn"]);
        $column_set = '';
        if(!empty($student["gown_taken"]) && !empty($student["gown_returned"]) ) {
            $taken = mb_strtoupper($student["gown_taken"]) === 'НЕ' ? 0 : 1;
            $returned = mb_strtoupper($student["gown_returned"]) === 'НЕ' ? 0 : 1;
            $variables["taken"] = $taken;
            $variables["returned"] = $returned;
            $column_set = 'SET gown_taken = :taken, gown_returned = :returned';
        }
        else if(!empty($student["gown_taken"])) {
            $taken = mb_strtoupper($student["gown_taken"]) === 'НЕ' ? 0 : 1;
            $variables["taken"] = $taken;
            $column_set = 'SET gown_taken = :taken';
        }
        else  if(!empty($student["gown_returned"])) {
            $returned = mb_strtoupper($student["gown_returned"]) === 'НЕ' ? 0 : 1;
            $variables["returned"] = $returned;
            $column_set = 'SET gown_returned = :returned';
        }

        $stmt = $conn->prepare("
            UPDATE student_gown " . $column_set . " WHERE student_fn = :fn");
        $stmt->execute($variables);
    }
    $response = array("success" => true, "message" => "Данните на студентите са променени успешно.");
    echo json_encode($response);
    http_response_code(200);
}
?>