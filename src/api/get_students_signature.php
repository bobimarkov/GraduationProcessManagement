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
    select student.fn, user.name, user.email, user.phone,student_diploma.attendance, student_diploma.has_right, student_diploma.is_ready,
    student_diploma.is_taken, student_diploma.take_in_advance_request, student_diploma.take_in_advance_request_comment, student_diploma.is_taken_in_advance,
    student_diploma.taken_at_time, student_diploma.diploma_comment,
    student_moderators.moderator_signature_email, (select count(DISTINCT moderator_signature_email) from student_moderators) as count_signature_moderators,
    (select `range` from moderator_range where email = :email) as name_range
    from student
    join user on user.id = student.user_id
    join student_diploma on student.fn = student_diploma.student_fn
	join student_moderators on student_diploma.student_fn = student_moderators.student_fn
    where moderator_signature_email = :email");
    $stmt->execute(["email" => $email]);

    $rows = $stmt->fetchAll();

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
?>