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
    $query = new PDOStatement();
    $query = "SELECT student_diploma.*, user.name, student.degree, student.major, student.group, student_grown.*, student_hat.*
    FROM student_diploma
    RIGHT JOIN student ON student.fn = student_diploma.student_fn 
    RIGHT JOIN user ON user.id = student.user_id 
    LEFT JOIN student_grown ON student.fn = student_grown.student_fn 
    LEFT JOIN student_hat ON student.fn = student_hat.student_fn 
    WHERE user.role='student'";

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
            $query .= $type . " ASC";
            if ($i < count($order_values) - 1) {
                $query .= ", ";
            }
        }
    }
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $rows = $stmt->fetchAll();
    $response = array("success" => true, "users" => $rows);
    echo json_encode($response);
    http_response_code(200);
}
