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
        FROM user
        JOIN student ON student.user_id = user.id"
    );
    $update_student_moderators = $conn->prepare(
    "UPDATE student_moderators
     SET moderator_hat_email = :moderator_hat_email,
         moderator_gown_email = :moderator_gown_email,
         moderator_signature_email = :moderator_signature_email
     WHERE student_fn = :fn"
    );

    $update_moderator_range = $conn->prepare(
    "UPDATE moderator_range SET `range` = :range WHERE email = :email"
    );

    $get_moderators->execute();
    $moderators = $get_moderators->fetchAll();
    
    $get_students->execute();
    $students = $get_students->fetchAll();
    $response = array();

    $result = defineModeratorsForAllStudents($students, $moderators, $update_student_moderators, $update_moderator_range, $response);
    $success = is_null($result) ? false : "Модераторите бяха разпределени успешно!";
    $response = array_merge($response,array("success" => $success, "users" => $result));
    echo json_encode($response);
    http_response_code(200);
}

function defineModeratorsForAllStudents($students, $moderators, $update_student_moderators, $update_moderator_range, &$response) {
    $all_ranges = array();
    for($i = 0 ; $i < count($students); $i++) {
        $student_ranges = defineModeratorsForOneStudent($students[$i], $moderators);
        
        $res = $student_ranges["student"];
        $all_ranges[$i] = $student_ranges["ranges"];

        if(is_null($res)) {
            $response["error"] = "Името на студента с факултетен номер: " . $students[$i]["fn"] . " не е на български";
            return null;
        }
        $students[$i] = $res;
    }
    $metModerator = array();
    for($i = 0; $i < count($students); $i++) {
        $student = $students[$i];
        $ranges = $all_ranges[$i];
        $fn = array_keys($student)[0];
        $update_student_moderators->execute([
            "fn" => $fn,
            "moderator_hat_email" => $student[$fn]["moderator_hat"],
            "moderator_gown_email" => $student[$fn]["moderator_gown"],
            "moderator_signature_email" => $student[$fn]["moderator_signature"]
        ]);

        $update_moderator_range->execute([
            "email" => $student[$fn]["moderator_hat"],
            "range" => $ranges["hat"]
        ]);
        $update_moderator_range->execute([
            "email" => $student[$fn]["moderator_gown"],
            "range" => $ranges["gown"]
        ]);
        $update_moderator_range->execute([
            "email" => $student[$fn]["moderator_signature"],
            "range" => $ranges["signature"]
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
    $moderator_hat_and_range = setStudentModerator($student,array_values($moderator_hat));
    $moderator_signature_and_range = setStudentModerator($student,array_values($moderator_signature));
    $moderator_gown_and_range = setStudentModerator($student,  array_values($moderator_gown));

    $moderator_hat = $moderator_hat_and_range[0];
    $range_hat = $moderator_hat_and_range[1];

    $moderator_gown = $moderator_gown_and_range[0];
    $range_gown = $moderator_gown_and_range[1];

    $moderator_signature = $moderator_signature_and_range[0];
    $range_signature = $moderator_signature_and_range[1];

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
    $ranges = array(
        "hat" => $range_hat,
        "gown" => $range_gown,
        "signature" => $range_signature
    );

    return array( "student" => $result, "ranges" => $ranges);
}

function setStudentModerator($student, $moderators)
{
    $student_first_letter = mb_strtoupper(mb_substr($student['name'], 0,1));
    $bulgarian_alphabet = mb_range('А', 'Я');
    $split_alphabet = partition($bulgarian_alphabet, count($moderators));
    var_dump($split_alphabet);
    $i = 0;
    while ($i < count($split_alphabet)) {
        if (in_array($student_first_letter, $split_alphabet[$i])) {
            $split = $split_alphabet[$i];
            $range = "(" . $split[0] . "-" . $split[count($split) - 1 ] . ")";
            return array( $moderators[$i], $range);
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


// function defineRangeForModerators($moderators) {
//     $bulgarian_alphabet = mb_range('А', 'Я');
//     $split_alphabet = partition($bulgarian_alphabet, count($moderators));
//     $split_alphabet = array_map(function ($split, $moderator) {
//         return 
//     })

// }