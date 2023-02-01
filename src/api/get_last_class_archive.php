<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../src/database/db_conf_archive.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    validateJWT($jwt, ["admin"]);

    $databaseArchive = new DbA();
    $connArchive = $databaseArchive->getConnection();
    $stmt_select = $connArchive->prepare("SELECT `class`
                                            FROM `student`
                                            ORDER BY `class` DESC
                                            LIMIT 1");
    $stmt_select->execute();
    $existedClass = $stmt_select->fetch(PDO::FETCH_ASSOC);

    if(empty($existedClass)) {
        $response = array("success" => false, "message" => "Няма години за архиви!");
        echo json_encode($response);
        die;
    }
    
    $response = array("success" => true, "class" => $existedClass['class']);
    echo json_encode($response);      
}

?>

