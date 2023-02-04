<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin"]);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt_new_students = $conn->prepare("
        select user.email from student
        join user on user.id = student.user_id
        join student_moderators on student.fn = student_moderators.student_fn
        where moderator_hat_email is null 
        or moderator_gown_email is null
        or moderator_signature_email is null");
    $stmt_new_students ->execute();

    $stmt_new_moderators = $conn->prepare("
        SELECT user.email from user
        join moderator_range on user.email = moderator_range.email
        where moderator_range.range is null
    ");

    $rows_new_students = $stmt_new_students->fetchAll();
    $rows_new_moderators = $stmt_new_moderators->fetchAll();

    $response = array("success" => true, "students" => $rows_new_students, "moderators" => $rows_new_moderators);
    echo json_encode($response);
    http_response_code(200);
}
?>