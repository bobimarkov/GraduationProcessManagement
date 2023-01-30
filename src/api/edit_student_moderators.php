<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$data_array = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin"]);

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = new PDOStatement();
    $success = true;

    $get_moderators = $conn->prepare(
        "SELECT email, role
        FROM user 
        WHERE role = 'moderator-hat' or role = 'moderator-gown' or role = 'moderator-signature' "
    );
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
    $response = array_merge($response, array("success" => $success, "users" => $result));
    echo json_encode($response);
    http_response_code(200);
}

function defineModeratorsForAllStudents($students, $moderators, $update_student_moderators, $update_moderator_range, &$response)
{
    $moderators_and_ranges = defineRangeForEachTypeModerator($moderators);
    updateModeratorRange($moderators_and_ranges, $update_moderator_range);
    for ($i = 0; $i < count($students); $i++) {
        $student = defineModeratorsForOneStudent($students[$i], $moderators_and_ranges);

        if (is_null($student)) {
            $response["error"] = "Името на студента с факултетен номер: " . $students[$i]["fn"] . " не е на български";
            return null;
        }
        $students[$i] = $student;
    }
    for ($i = 0; $i < count($students); $i++) {
        $student = $students[$i];
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

function defineModeratorsForOneStudent($student, $moderators_and_ranges)
{
    $moderator_hat = setStudentModerator($student, $moderators_and_ranges["hat"]);
    $moderator_signature = setStudentModerator($student, $moderators_and_ranges["signature"]);
    $moderator_gown = setStudentModerator($student, $moderators_and_ranges["gown"]);

    if (is_null($moderator_hat) || is_null($moderator_signature) || is_null($moderator_gown)) {
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

function setStudentModerator($student, $moderators_and_ranges)
{
    $i = 0;
    $student_first_letter = mb_strtoupper(mb_substr($student['name'], 0, 1));
    $count_moderators = count($moderators_and_ranges);

    while ($i < $count_moderators) {
        $name_range = array_keys($moderators_and_ranges[$i]);
        if (in_array($student_first_letter, $name_range)) {
            $moderator = array_values($moderators_and_ranges[$i])[0];
            return $moderator;
        }
        $i++;
    }
    return null;
}

function partition($list, $p)
{
    $listlen = count($list);
    $partlen = floor($listlen / $p);
    $partrem = $listlen % $p;
    $partition = array();
    $mark = 0;
    for ($px = 0; $px < $p; $px++) {
        $incr = ($px < $partrem) ? $partlen + 1 : $partlen;
        $partition[$px] = array_slice($list, $mark, $incr);
        $mark += $incr;
    }
    return $partition;
}

function mb_range($start, $end)
{
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


function defineRangeForEachTypeModerator($moderators)
{
    $result = array();
    $moderator_hat = array_map(
        function ($moderator) {
            return $moderator['email'];
        },
        array_filter(
            $moderators,
            function ($key) {
                return $key["role"] == "moderator-hat";
            }
        )
    );

    $result["hat"] = defineRangeForOneTypeModerator(array_values($moderator_hat));
    $moderator_gown = array_map(
        function ($moderator) {
            return $moderator['email'];
        },
        array_filter(
            $moderators,
            function ($key) {
                return $key["role"] == "moderator-gown";
            }
        )
    );
    $result["gown"] = defineRangeForOneTypeModerator(array_values($moderator_gown));
    $moderator_signature = array_map(
        function ($moderator) {
            return $moderator['email'];
        },
        array_filter(
            $moderators,
            function ($key) {
                return $key["role"] == "moderator-signature";
            }
        )
    );
    $result["signature"] = defineRangeForOneTypeModerator(array_values($moderator_signature));
    return $result;
}


function defineRangeForOneTypeModerator($moderators)
{
    $bulgarian_alphabet = mb_range('А', 'Я');
    $split_alphabet = partition($bulgarian_alphabet, count($moderators));
    $result = array();
    for ($i = 0; $i < count($moderators); $i++) {
        $split = $split_alphabet[$i];
        $moderator = array_fill(0, count($split), $moderators[$i]);
        $result[$i] = array_combine($split, $moderator);
    }
    return $result;
}

function updateModeratorRange($moderators_range, $update_moderator_range)
{
    $roles = ["hat", "gown", "signature"];
    foreach ($roles as $role) {
        foreach ($moderators_range[$role] as $range) {
            $name_range = array_keys($range);
            $name_range_string = "(" . $name_range[0] . "-" . $name_range[count($name_range) - 1] . ")";
            $update_moderator_range->execute([
                "email" => array_values($range)[0],
                "range" => $name_range_string
            ]);
        }
    }
}