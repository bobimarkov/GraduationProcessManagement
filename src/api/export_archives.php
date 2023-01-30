<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf_archive.php';
include_once '../src/utils/JWTUtils.php';

if ($_SERVER["REQUEST_METHOD"] === 'POST') {

    validateJWT($jwt, ["admin", "moderator"]);

    $data = (array) $data; //id

    $database = new DbA();
    $conn = $database->getConnection();

    $stmt_all = $conn->prepare("SELECT `fn`, `email`, `name`, `phone`, `degree`, `major`, `group`
                                FROM `student`
                                WHERE class = :class");

    $stmt_all->execute(["class" => $data['id']]);

    $name = "archieve" . $data['id'] . ".csv";
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . basename($name));
    $output = fopen($name, "w");

    fwrite($output, "\xEF\xBB\xBF");
    fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

    fputcsv($output, array('ФН', 'Имейл', 'Име', 'Телефон', 'Степен', 'Специалност', 'Група'));
    while ($row = $stmt_all->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, $row);
    }
    fclose($output);
    readfile($name);
    unlink($name);
}
?>