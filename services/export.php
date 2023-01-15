<?php

if (isset($_POST["export"])) {

    include_once '../database/db_conf.php';

    $format = $_POST['format'];
    $name = "data." . $format;

    $database = new Db();
    $conn = $database->getConnection();
    $stmt = $conn->prepare("SELECT user.name, email, phone, fn, degree, major, student.group, has_diploma_right
    FROM `user`
    join student
    on user_id = id");
    $stmt->execute();

    if ($format !== 'pdf') {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . basename($name));

        $output = fopen("php://output", "w");
        fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));
        fputcsv($output, array('Име', 'Имейл', 'Телефон', 'ФН', 'Степен', 'Специалност', 'Група', 'Дипломиране'));

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['has_diploma_right'] = ($row['has_diploma_right'] === 1) ? 'Да' : 'Не';
            fputcsv($output, $row);
        }

        fclose($output);
    } else {
        require_once('../tcpdf/tcpdf.php');
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="data.pdf"');

        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        $pdf->setFontSubsetting(false); //cyrillic
        $pdf->SetFont('dejavusans', '', 11, '', true);

        $pdf->AddPage();
        
        $pdf->Cell(0,0,implode(', ', array('Име', 'Имейл', 'Телефон', 'ФН', 'Степен', 'Специалност', 'Група', 'Дипломиране')),0,1);
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row['has_diploma_right'] = ($row['has_diploma_right'] === 1) ? 'Да' : 'Нe';
            $pdf->Cell(0, 0, implode(', ', $row), 0, 1);
        }
        $pdf->Output('data.pdf', 'D'); //D = download
    }
}


?>