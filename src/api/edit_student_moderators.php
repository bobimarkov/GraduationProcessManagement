<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';

$data_array = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = new PDOStatement();
    $success = true;

    $get_moderators = $conn->prepare(
        "SELECT email, role
        FROM user 
        WHERE role = 'moderator-hat' or role = 'moderator-gown' or role = 'moderator-signature' ");
    $get_students = $conn->prepare(
        "SELECT student.fn, user.name 
        from user
        join student on student.user_id = user.id"
    );
    $update_student_moderators = $conn->prepare(
    "UPDATE student_moderators
     SET moderator_hat_email = :moderator_hat_email,
         moderator_gown_email = :moderator_gown_email,
         moderator_signature_email = :moderator_signature_email
     WHERE student_fn = :fn"
    );

    $get_moderators->execute();
    $moderators = $get_moderators->fetchAll();
    
    $get_students->execute();
    $students = $get_students->fetchAll();
    $response = array();

    $result = defineModeratorsForAllStudents($students, $moderators, $update_student_moderators, $response);
    $success = is_null($result) ? false : "Модераторите бяха разпределени успешно!";
    $response = array_merge($response,array("success" => $success, "users" => $result));
    echo json_encode($response);
    http_response_code(200);
}

function defineModeratorsForAllStudents($students, $moderators, $update_student_moderators, &$response) {
    for($i = 0 ; $i < count($students); $i++) {
        $res = defineModeratorsForOneStudent($students[$i], $moderators);
        if(is_null($res)) {
            $response["error"] = "Името на студента с факултетен номер: " . $students[$i]["fn"] . " не е на български";
            return null;
        }
        $students[$i] = $res;
    }
    foreach($students as $student) {
        $fn = array_keys($student)[0];
        $update_student_moderators->execute([
            "fn" => $fn,
            "moderator_hat_email" => $student[$fn]["moderator_hat"],
            "moderator_gown_email" => $student[$fn]["moderator_gown"],
            "moderator_signature_email" => $student[$fn]["moderator_signature"]
        ]);
    }
    return $students;
}

function defineModeratorsForOneStudent($student, $moderators) {
    $moderator_hat = array_map(
        function ($moderator) {
            return $moderator['email'];
     }, array_filter($moderators, function($key) {
            return $key["role"] == "moderator-hat";}
    ));
    $moderator_gown = array_map(
        function ($moderator) {
            return $moderator['email'];
     }, array_filter($moderators, function($key) {
            return $key["role"] == "moderator-gown";}
    ));
    $moderator_signature = array_map(
        function ($moderator) {
            return $moderator['email'];
     }, array_filter($moderators, function($key) {
            return $key["role"] == "moderator-signature";}
    ));
    $moderator_hat = setStudentModerator($student,array_values($moderator_hat));
    $moderator_signature = setStudentModerator($student,array_values($moderator_signature));
    $moderator_gown = setStudentModerator($student,  array_values($moderator_gown));

    if(is_null($moderator_hat) || is_null($moderator_signature)|| is_null($moderator_gown)) {
        return null;
    }
    
    $result = [
        $student["fn"] => [
            "moderator_hat" => $moderator_hat,
            "moderator_gown" => $moderator_gown,
            "moderator_signature" => $moderator_signature
        ]
    ];
    return $result;
}

function setStudentModerator($student, $moderators)
{
    $student_first_letter = mb_strtolower(mb_substr($student['name'], 0,1));
    $bulgarian_alphabet = mb_range('а', 'я');
    $split_alphabet = partition($bulgarian_alphabet, count($moderators));
    $i = 0;
    while ($i < count($split_alphabet)) {
        if (in_array($student_first_letter, $split_alphabet[$i])) {
            return $moderators[$i];
        }
        $i++;
    }
    return null;
}

function partition( $list, $p ) {
    $listlen = count( $list );
    $partlen = floor( $listlen / $p );
    $partrem = $listlen % $p;
    $partition = array();
    $mark = 0;
    for ($px = 0; $px < $p; $px++) {
        $incr = ($px < $partrem) ? $partlen + 1 : $partlen;
        $partition[$px] = array_slice( $list, $mark, $incr );
        $mark += $incr;
    }
    return $partition;
}

function mb_range($start, $end) {
    // if start and end are the same, well, there's nothing to do
    if ($start == $end) {
        return array($start);
    }
    
    $_result = array();
    // get unicodes of start and end
    list(, $_start, $_end) = unpack("N*", mb_convert_encoding($start . $end, "UTF-32BE", "UTF-8"));
    // determine movement direction
    $_offset = $_start < $_end ? 1 : -1;
    $_current = $_start;
    while ($_current != $_end) {
        $_result[] = mb_convert_encoding(pack("N*", $_current), "UTF-8", "UTF-32BE");
        $_current += $_offset;
    }
    $_result[] = $end;
    return $_result;
}