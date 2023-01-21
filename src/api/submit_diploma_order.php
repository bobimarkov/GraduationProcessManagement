<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';

$data_array = array();

$users_data = "";
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"));
    foreach ($data as $v) {
        if ($v != -1) {
            array_push($data_array, $v);
        }
    }

    // var_dump($data_array);
    submitDiplomaOrder($data_array);
}



function submitDiplomaOrder($parameters)
{
    $database = new Db();
    $conn = $database->getConnection();

    $stmt = new PDOStatement();
    $success = "";
    if (count($parameters) == 0) {
        $response = array("success" => false, "message" => "Грешка: Трябва да има поне един параметър за сортиране.");
        echo json_encode($response);
        die;
    }

    $truncate_stmt = $conn->prepare("TRUNCATE TABLE diploma_order;");
    $truncate_stmt->execute();

    if (count($parameters) == 1) {
        $stmt = $conn->prepare("INSERT INTO `diploma_order` (`param_1`) 
                                       VALUES (:p1)");
        $success = $stmt->execute([
            "p1" => $parameters[0]
        ]);
    } else if (count($parameters) == 2) {
        $stmt = $conn->prepare("INSERT INTO `diploma_order` (`param_1`, `param_2`) 
                                       VALUES (:p1, :p2)");
        $success = $stmt->execute([
            "p1" => $parameters[0],
            "p2" => $parameters[1]
        ]);
    } else if (count($parameters) == 3) {
        $stmt = $conn->prepare("INSERT INTO `diploma_order` (`param_1`, `param_2`, `param_3`) 
                                       VALUES (:p1, :p2, :p3)");
        $success = $stmt->execute([
            "p1" => $parameters[0],
            "p2" => $parameters[1],
            "p3" => $parameters[2]
        ]);
    } else if (count($parameters) == 4) {
        $stmt = $conn->prepare("INSERT INTO `diploma_order` (`param_1`, `param_2`, `param_3`, `param_4`) 
                                       VALUES (:p1, :p2, :p3, :p4)");
        $success = $stmt->execute([
            "p1" => $parameters[0],
            "p2" => $parameters[1],
            "p3" => $parameters[2],
            "p4" => $parameters[3]
        ]);
    } else if (count($parameters) == 5) {
        $stmt = $conn->prepare("INSERT INTO `diploma_order` (`param_1`, `param_2`, `param_3`, `param_4`, `param_5`) 
                                       VALUES (:p1, :p2, :p3, :p4, :p5)");
        $success = $stmt->execute([
            "p1" => $parameters[0],
            "p2" => $parameters[1],
            "p3" => $parameters[2],
            "p4" => $parameters[3],
            "p5" => $parameters[4]
        ]);
    } else if (count($parameters) == 6) {
        $stmt = $conn->prepare("INSERT INTO `diploma_order` (`param_1`, `param_2`, `param_3`, `param_4`, `param_5`, `param_6`) 
                                       VALUES (:p1, :p2, :p3, :p4, :p5, :p6)");
        $success = $stmt->execute([
            "p1" => $parameters[0],
            "p2" => $parameters[1],
            "p3" => $parameters[2],
            "p4" => $parameters[3],
            "p5" => $parameters[4],
            "p6" => $parameters[5]
        ]);
    }


    if ($success) {
        $response = array("success" => true, "message" => "Подредбата е записана успешно. Моля, презаредете страницата, за да се сортира таблицата.");
        echo json_encode($response);
        die;
    }
}
