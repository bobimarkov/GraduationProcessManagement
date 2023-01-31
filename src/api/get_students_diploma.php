<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

$errors = array();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    validateJWT($jwt, ["admin", "moderator-hat","moderator-gown","moderator-signature"]);

    if ($errors) {
        $response = array("success" => false, "errors:" => json_encode($errors, JSON_UNESCAPED_UNICODE));
        echo json_encode($response);
        http_response_code(404);
    } else {
        $database = new Db();
        $conn = $database->getConnection();


        $order_stmt = $conn->prepare("SELECT * 
                                      FROM diploma_order");
        $order_stmt->execute();
        $rows = $order_stmt->fetchAll();

        $order_values = array();
        if (count($rows) == 1) {
            foreach ($rows[0] as $key => $value) {
                if ($value != 0 && $value !== NULL) {
                    array_push($order_values, $value);
                }
            }
        }

        executeQuery($order_values, $conn);
    }
}

function executeQuery($order_values, $conn)
{
    $database = new Db();
    $conn = $database->getConnection();
    $query = "SELECT student_diploma.*, user.name, student.degree, student.major, student.group, student_gown.*, student_hat.*
    FROM student_diploma
    RIGHT JOIN student ON student.fn = student_diploma.student_fn 
    RIGHT JOIN user ON user.id = student.user_id 
    LEFT JOIN student_gown ON student.fn = student_gown.student_fn 
    LEFT JOIN student_hat ON student.fn = student_hat.student_fn 
    WHERE user.role='student' and student_diploma.grade >= 3";

    if (count($order_values) > 0) {
        $query .= " ORDER BY ";
        for ($i = 0; $i < count($order_values); $i++) {
            switch ($order_values[$i]) {
                case 'name':
                    $type = 'user.name';
                    break;
                case 'fn':
                    $type = 'student.fn';
                    break;
                case 'degree':
                    $type = 'student.degree';
                    break;
                case 'major':
                    $type = 'student.major';
                    break;
                case 'grade':
                    $type = 'student_diploma.grade';
                    break;
                case 'group':
                    $type = 'student.group';
                    break;
            }
            if ($type == 'student_diploma.grade') {
                $query .= $type . " DESC";
            } else {
                $query .= $type . " ASC";
            }
            if ($i < count($order_values) - 1) {
                $query .= ", ";
            }
        }

    }
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $allRows = $stmt->fetchAll();
    $n = count($allRows);

    //Colors
    $stmtCol = $conn->prepare("SELECT * 
                            FROM graduation_colors");
    $stmtCol->execute();
    $rowsColors = $stmtCol->fetchAll();

    if (count($rowsColors) != 1) {
        $response = array("success" => false, "message" => "Все още няма зададени цветове.");
        echo json_encode($response);
        http_response_code(404);
        die;
    }

    //Graduation_time
    $stmtGrad = $conn->prepare("SELECT *
                                FROM graduation_time
                                LIMIT 1");
    $stmtGrad->execute();
    $gradTime = $stmtGrad->fetchAll();

    $startTime = new DateTime($gradTime[0]['start_time']);
    $interval = new DateTime($gradTime[0]['students_interval']);

    $update_stmt = new PDOStatement();
    $num = 0;
    while ($num < $n) {
        $fn = $allRows[$num]['student_fn'];
        $color = getColor($num, $n, $rowsColors[0], $rowsColors[0]['color_interval']);
        $update_stmt = $conn->prepare("UPDATE student_diploma
                                        SET color = :color, num_order = :num_order, time_diploma = :time_diploma
                                        WHERE student_fn = :fn");

        $update_stmt->execute(["color" => $color, "num_order" => $num + 1, "time_diploma" => $startTime->format('H:i:s'), "fn" => $fn]);

        $min = $interval->format('i');
        $sec = $interval->format('s');
        $startTime->modify("+$min minutes");
        $startTime->modify("+$sec seconds");

        if ($allRows[$num]['speech_response'] == 1) {
            $startTime->modify("+ 90 seconds");
        }
        $num++;
    }

    $query = "SELECT student_diploma.*, user.name, student.degree, student.major, student.group, student_gown.*, student_hat.*
    FROM student_diploma
    RIGHT JOIN student ON student.fn = student_diploma.student_fn 
    RIGHT JOIN user ON user.id = student.user_id 
    LEFT JOIN student_gown ON student.fn = student_gown.student_fn 
    LEFT JOIN student_hat ON student.fn = student_hat.student_fn 
    WHERE user.role='student' and student_diploma.grade >= 3";

    if (count($order_values) > 0) {
        $query .= " ORDER BY ";
        for ($i = 0; $i < count($order_values); $i++) {
            switch ($order_values[$i]) {
                case 'name':
                    $type = 'user.name';
                    break;
                case 'fn':
                    $type = 'student.fn';
                    break;
                case 'degree':
                    $type = 'student.degree';
                    break;
                case 'major':
                    $type = 'student.major';
                    break;
                case 'grade':
                    $type = 'student_diploma.grade';
                    break;
                case 'group':
                    $type = 'student.group';
                    break;
            }
            if ($type == 'student_diploma.grade') {
                $query .= $type . " DESC";
            } else {
                $query .= $type . " ASC";
            }
            if ($i < count($order_values) - 1) {
                $query .= ", ";
            }
        }
    }
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $allRows = $stmt->fetchAll();

    $response = array("success" => true, "users" => $allRows);
    echo json_encode($response);
    http_response_code(200);
}


function getColor($i, $n, $rowColors, $colorInterval)
{
    $part = round(($colorInterval / 100 * $n));
    $current_part = $part;
    $color_index = 1;

    while ($current_part < $n + $part) {
        if ($i <= $current_part) {
            $color = "color$color_index";
            return $rowColors[$color];
        }
        $color_index++;
        $current_part += $part;
    }
}