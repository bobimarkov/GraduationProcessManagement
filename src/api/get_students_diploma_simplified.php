<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

$data_array = array();
$errors = array();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

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
    $stmt = new PDOStatement();
    if(count($order_values) == 0) {
        $stmt = $conn->prepare("SELECT user.email
                                FROM student_diploma
                                RIGHT JOIN student ON student.fn = student_diploma.student_fn 
                                RIGHT JOIN user ON user.id = student.user_id 
                                WHERE user.role='student'
                                ORDER BY student_diploma.id ASC");
    } 
    else if(count($order_values) == 1) {
        $stmt = $conn->prepare("SELECT user.email
                                FROM student_diploma
                                RIGHT JOIN student ON student.fn = student_diploma.student_fn 
                                RIGHT JOIN user ON user.id = student.user_id 
                                WHERE user.role='student'
                                ORDER BY $order_values[0] ASC ");
    } 
    else if(count($order_values) == 2) {
        $stmt = $conn->prepare("SELECT user.email
                                FROM student_diploma
                                RIGHT JOIN student ON student.fn = student_diploma.student_fn 
                                RIGHT JOIN user ON user.id = student.user_id 
                                WHERE user.role='student'
                                ORDER BY $order_values[0] ASC, $order_values[1] ASC");
    } 
    else if(count($order_values) == 3) {
        $stmt = $conn->prepare("SELECT user.email
        FROM student_diploma
        RIGHT JOIN student ON student.fn = student_diploma.student_fn 
        RIGHT JOIN user ON user.id = student.user_id 
        WHERE user.role='student'
        ORDER BY student.$order_values[0] ASC, student.$order_values[1] ASC, student.$order_values[2] ASC");
    } 
    else if(count($order_values) == 4) {
        $stmt = $conn->prepare("SELECT user.email
        FROM student_diploma
        RIGHT JOIN student ON student.fn = student_diploma.student_fn 
        RIGHT JOIN user ON user.id = student.user_id 
        WHERE user.role='student'
        ORDER BY $order_values[0] ASC, $order_values[1] ASC, $order_values[2] ASC, $order_values[3] ASC ");
    } 
    else if(count($order_values) == 5) {
        $stmt = $conn->prepare("SELECT user.email
        FROM student_diploma
        RIGHT JOIN student ON student.fn = student_diploma.student_fn 
        RIGHT JOIN user ON user.id = student.user_id 
        WHERE user.role='student'
        ORDER BY $order_values[0] ASC, $order_values[1] ASC, $order_values[2] ASC, $order_values[3] ASC, $order_values[4] ASC ");
    } 
    else if(count($order_values) == 6) {
        $stmt = $conn->prepare("SELECT user.email
        FROM student_diploma
        RIGHT JOIN student ON student.fn = student_diploma.student_fn 
        RIGHT JOIN user ON user.id = student.user_id 
        WHERE user.role='student'
        ORDER BY $order_values[0] ASC, $order_values[1] ASC, $order_values[2] ASC, $order_values[3] ASC, $order_values[4] ASC, $order_values[5] ASC");
    }

    $stmt->execute();

    $rows = $stmt->fetchAll();

    // var_dump($rows);

    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
