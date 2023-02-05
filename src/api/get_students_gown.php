<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-gown"]);
    $email = getUserEmailFromJWT($jwt);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("
    select student.fn, user.name, user.email, user.phone,student_diploma.attendance,
    student_diploma.has_right, student_gown.gown_requested, student_gown.gown_taken, student_gown.gown_returned, 
    student_moderators.moderator_gown_email, (select `range` from moderator_range where email = :email) as name_range
    from student
    join user on user.id = student.user_id
    join student_gown on student.fn = student_gown.student_fn
    join student_diploma on student.fn = student_diploma.student_fn
    join student_moderators on student_diploma.student_fn = student_moderators.student_fn
    where moderator_gown_email = :email");
    $stmt->execute(["email" => $email]);

    $rows = $stmt->fetchAll();

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
?>