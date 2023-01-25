<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

$data_array = array();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = json_decode(file_get_contents("php://input"));

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("
    select student.fn, user.name, user.email, user.phone,student_diploma.attendance,
    student_diploma.has_right, student_hat.hat_requested,
    student_hat.hat_taken, student_hat.hat_taken_date,
    student_moderators.moderator_hat_email, (select count(DISTINCT moderator_hat_email) from student_moderators) as count_hat_moderators,
    (select `range` from moderator_range where email = :email) as name_range
    from student
    join user on user.id = student.user_id
    join student_hat on student.fn = student_hat.student_fn
    join student_diploma on student.fn = student_diploma.student_fn
    join student_moderators on student_diploma.student_fn = student_moderators.student_fn
    where moderator_hat_email = :email");
    $stmt->execute(["email" => $email]);

    $rows = $stmt->fetchAll();

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
?>