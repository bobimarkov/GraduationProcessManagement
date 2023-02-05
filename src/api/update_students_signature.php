<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$students_data = "";

if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    validateJWT($jwt, ["moderator-signature"]);

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
            $values = array("fn" => trim($values[0]), "taken_graduation" => trim($values[1]),"taken_in_advance" => trim($values[2]));
 
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

    if ((empty($values["taken_graduation"]) && empty($values["taken_in_advance"]))) {
        $text_taken = 'Взета (на дипломирането)'; $text_returned = 'Взета (предварително)';
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - Не може и $text_taken и $text_returned да бъдат празни!");
        echo json_encode($response);
        die;
    }

    if(!empty($values["taken_graduation"])) {
        if (!in_array(mb_strtoupper($values["taken_graduation"]), ["ДА", "НЕ"])) {
            $text = 'Взета (на дипломирането)';
            $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - $text може да е само Да или Не !");
            echo json_encode($response);
            die;
        }
    }

    if(!empty($values["taken_in_advance"])) {
        if (!in_array(mb_strtoupper($values["taken_in_advance"]), ["ДА", "НЕ"])) {
            $text = 'Взета (предварително)';
            $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - $text може да е само Да или Не !");
            echo json_encode($response);
            die;
        }
    }

    
    if ((!empty($values["taken_graduation"]) && !empty($values["taken_in_advance"]))) {
        $text_taken = 'Взета (на дипломирането)'; $text_returned = 'Взета (предварително)';
        $response = array("success" => false, "message" => "Грешка за потребител на ред $i ($student) - Не могат и $text_taken и $text_returned да бъдат зададени, защото е противоречиво!");
        echo json_encode($response);
        die;
    }


    $stmt = $connection->prepare("
        select student.fn
        from student
        join user on user.id = student.user_id
        join student_diploma on student.fn = student_diploma.student_fn
        join student_moderators on student_diploma.student_fn = student_moderators.student_fn
        where moderator_gown_email = :email and student.fn = :fn 
        and student_diploma.attendance = 1 
        or student_diploma.take_in_advance_request = 1");

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
        if(!empty($student["taken_graduation"]) && !empty($student["taken_in_advance"]) ) {
            $variables["taken_graduation"] = mb_strtoupper($student["taken_graduation"]) === 'НЕ' ? 0 : 1;
            $variables["taken_in_advance"] = mb_strtoupper($student["taken_in_advance"]) === 'НЕ' ? 0 : 1;
            $column_set = 'SET is_taken = :taken_graduation, is_taken_in_advance = :taken_in_advance';
        }
        else if(!empty($student["taken_graduation"])) {
            $variables["taken_graduation"] = mb_strtoupper($student["taken_graduation"]) === 'НЕ' ? 0 : 1;
            $column_set = 'SET is_taken = :taken_graduation';
        }
        else  if(!empty($student["taken_in_advance"])) {
            $variables["taken_in_advance"] = mb_strtoupper($student["taken_in_advance"]) === 'НЕ' ? 0 : 1;
            $column_set = 'SET is_taken_in_advance = :taken_in_advance';
        }
        $stmt = $conn->prepare("
            UPDATE student_diploma " . $column_set . " WHERE student_fn = :fn");
        $stmt->execute($variables);
    }
    $response = array("success" => true, "message" => "Данните на студентите са променени успешно.");
    echo json_encode($response);
    http_response_code(200);
}
?>