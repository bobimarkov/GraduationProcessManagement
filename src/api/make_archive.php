<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/database/db_conf_archive.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    validateJWT($jwt, ["admin"]);
    
    $database = new Db();
    $conn = $database->getConnection();

    $stmt_class = $conn->prepare("SELECT `graduation_date`, `class`
                                FROM `graduation_time`
                                LIMIT 1");
    $stmt_class->execute();
    $rowGrad = $stmt_class->fetch(PDO::FETCH_ASSOC);
    $date = $rowGrad['graduation_date']; //Y-M-D
    $class = $rowGrad['class'];
    $date1 = strtotime("yesterday");
    $yesterday = date("Y-m-d", $date1);
    //$yesterday = "2023-02-04";

    $databaseArchive = new DbA();
    $connArchive = $databaseArchive->getConnection();
    $stmt_select = $connArchive->prepare("SELECT `class`
                                        FROM `student`
                                        ORDER BY `class` DESC
                                        LIMIT 1");
    $stmt_select->execute();
    $existedClass = $stmt_select->fetch(PDO::FETCH_ASSOC);

    if ($yesterday <= $date && (empty($existedClass['class']) || $existedClass['class'] < $class)) {

        $stmt = $conn->prepare("SELECT `id`, `fn`, `email`, `name`, `phone`, `degree`, `major`, `group` 
                            FROM `user` 
                            JOIN `student` ON `user_id` = `id`
                            WHERE `has_diploma_right` = 1");
        $stmt->execute();

        $stmt_delete = $conn->prepare("DELETE FROM user
                                        WHERE id = :id");


        $stmt_insert = $connArchive->prepare("INSERT INTO student(`fn`, `email`, `name`, `phone`, `degree`, `major`, `group`, `class`)
                                        VALUES (:fn, :email, :name, :phone, :degree, :major, :group, :class)");       


        $successInsert = "";
        $successDelete = "";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $successInsert = $stmt_insert->execute(["fn" => $row['fn'], "email" => $row['email'], "name" => $row['name'], "phone" => $row['phone'], "degree" => $row['degree'], "major" => $row['major'], "group" => $row['group'], "class" => $class]);
            $successDelete = $stmt_delete->execute(["id" => $row['id']]);
        }

        $stmt_message = $conn->prepare("SELECT *
                                        FROM `messages`");
        $stmt_message->execute();

        $stmt_insert_messages = $connArchive->prepare("INSERT INTO messages (`sender`, `recipient`, `message`, `class`)
                                                    VALUES(:sender, :recipient, :messages, :class)");
        $successInsertMessage = "";
        while($row = $stmt_message->fetch(PDO::FETCH_ASSOC)) {
            $successInsertMessage = $stmt_insert_messages->execute(["sender" => $row['sender'], "recipient" => $row['recipient'], "messages" => $row['message'], "class" => $class]);
        }
        $stmt_delete_messages = $conn->prepare("DELETE FROM `messages`");
        $stmt_delete_messages->execute();

        if (($successInsert && $successDelete) || $successInsertMessage) {
            $response = array("success" => true, "message" => "Успешен архив на дипломиращите се студенти!");
            echo json_encode($response);
            die;
        }
    }
    else {
        $response = array("success" => false, "message" => "Още не е време за архив!");
        echo json_encode($response);
        die;
    }
}
?>