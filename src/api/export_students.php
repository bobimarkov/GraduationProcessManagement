<?php

$data = (array) $data;

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';

validateJWT($jwt, ["admin", "moderator"]);
if (isset($data["format"])) {
    
    $format = $data["format"];
    $name = "students." . $format;

    $database = new Db();
    $conn = $database->getConnection();

    $stmt = $conn->prepare("SELECT user.name, email, phone, fn, degree, major, student.group, has_diploma_right
    FROM `user`
    join student
    on user_id = id");

    $stmt->execute();
    
    if ($format !== 'pdf' && $format !== 'no') {

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . basename($name));
        $output = fopen($name, "w");

        fwrite($output, "\xEF\xBB\xBF");
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

        fputcsv($output, array('Име', 'Имейл', 'Телефон', 'ФН', 'Степен', 'Специалност', 'Група', 'Дипломиране'));
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['has_diploma_right'] = ($row['has_diploma_right'] === 1) ? 'Да' : 'Не';
            if ($format === 'csv' || $format === 'xls') {
                $row['phone'] = "'{$row['phone']}'";
            }
            fputcsv($output, $row);
        }
        fclose($output);
        readfile($name);
        unlink($name);

    } else if ($format === 'pdf') {

        require_once('../src/lib/tcpdf/tcpdf.php');
        $data = json_decode(file_get_contents('php://input'), true);

        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
        $pdf->setFontSubsetting(false); //cyrillic
        $pdf->SetFont('dejavusans', '', 11, '', true);
        $pdf->AddPage();
        $pdf->Cell(0, 0, implode(",", array('Име', 'Имейл', 'Телефон', 'ФН', 'Степен', 'Специалност', 'Група', 'Дипломиране')), 0, 1);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['has_diploma_right'] = ($row['has_diploma_right'] === 1) ? 'Да' : 'Нe';
            $pdf->Cell(0, 0, implode(",", $row), 0, 1);
        }

        $pdf->Output("students.pdf", 'D');

    }
}
?>