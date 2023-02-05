<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';


if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    validateJWT($jwt, ["admin", "moderator-hat", "moderator-gown", "moderator-signature"]);

    $data = (array) $data;
    if (isset($data["format"])) {

        $format = $data["format"];
        $name = "excellent." . $format;

        $database = new Db();
        $conn = $database->getConnection();

        $stmt = $conn->prepare("SELECT student.fn, user.name, student.degree, student.major, student.group, student_diploma.grade, student_diploma.attendance, student_diploma.has_right, student_diploma.is_ready, student_diploma.is_taken, student_diploma.take_in_advance_request, student_diploma.take_in_advance_request_comment, student_diploma.is_taken_in_advance, student_diploma.diploma_comment, student_diploma.speech_request, student_diploma.speech_response, student_diploma.photos_requested, student_gown.gown_requested, student_gown.gown_taken, student_gown.gown_returned, student_hat.hat_requested, student_hat.hat_taken
        FROM student_diploma
        RIGHT JOIN student ON student.fn = student_diploma.student_fn 
        RIGHT JOIN user ON user.id = student.user_id 
        LEFT JOIN student_gown ON student.fn = student_gown.student_fn 
        LEFT JOIN student_hat ON student.fn = student_hat.student_fn 
        WHERE user.role='student' and student_diploma.grade >= 5.5
        ORDER BY student_diploma.grade DESC");

        $stmt->execute();

        if ($format !== 'pdf' && $format !== 'no') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . basename($name));
            $output = fopen($name, "w");

            fwrite($output, "\xEF\xBB\xBF");
            fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($output, array('ФН', 'Име', 'Степен', 'Спец.', 'Група', 'Успех', 'Присъствие', 'Има право', 'Готова', 'Взета', 'Заявка взимане предв.', 'Коментар(студент)', 'Взета предв.', 'Коментар(администр.)', 'Покана реч', 'Отговор', 'Снимки', 'Заявена тога', 'Взета', 'Върната', 'Заявена шапка', 'Взета'));
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $row['attendance'] = ($row['attendance'] == null) ? '-' : ($row['attendance'] == 0 ? 'Не' : 'Да');
                $row['has_right'] = ($row['has_right'] == 0) ? 'Не' : 'Да';
                $row['is_ready'] = ($row['is_ready'] == 0) ? 'Не' : 'Да';
                $row['is_taken'] = ($row['is_taken'] == 0) ? 'Не' : 'Да';
                $row['take_in_advance_request'] = ($row['take_in_advance_request'] == 0) ? 'Не' : 'Да';
                $row['take_in_advance_request_comment'] = ($row['take_in_advance_request_comment'] == NULL) ? 'Няма коментари' : $row['take_in_advance_request_comment'];
                $row['is_taken_in_advance'] = ($row['is_taken_in_advance'] == 0) ? 'Не' : 'Да';
                $row['diploma_comment'] = ($row['diploma_comment'] == NULL) ? 'Няма коментари' : $row['diploma_comment'];
                $row['speech_request'] = ($row['speech_request'] == 0) ? 'Не' : 'Да';
                $row['photos_requested'] = ($row['photos_requested'] == 0) ? 'Не' : 'Да';
                $row['speech_response'] = ($row['speech_response'] == NULL) ? '-' : (($row['speech_response'] == 0) ? 'Отказва' : 'Приема');
                $row['gown_taken'] = ($row['gown_taken'] == 0) ? 'Не' : 'Да';
                $row['gown_returned'] = ($row['gown_returned'] == 0) ? 'Не' : 'Да';
                $row['hat_taken'] = ($row['hat_taken'] == 0) ? 'Не' : 'Да';
                fputcsv($output, $row);
            }
            fclose($output);
            readfile($name);
            unlink($name);
        } else if ($format === 'pdf') {
            require_once('../src/lib/tcpdf/tcpdf.php');
            $data = json_decode(file_get_contents('php://input'), true);

            $pdf = new TCPDF('L', PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
            $pdf->setFontSubsetting(false); //cyrillic
            $pdf->SetFont('dejavusans', '', 10, '', true);
            $pdf->AddPage();
            $pdf->Cell(0, 0, implode(",", array('ФН', 'Име', 'Степен', 'Спец.', 'Група', 'Успех', 'Присъствие', 'Има право', 'Готова', 'Взета', )), 0, 1);
            $pdf->Cell(0, 0, implode(",", array('Заявка взимане предв.', 'Коментар(студент)', 'Взета предв.', 'Коментар(администр.)', 'Покана реч', 'Отговор', 'Снимки')), 0, 1);
            $pdf->Cell(0, 0, implode(",", array('Заявена тога', 'Взета', 'Върната', 'Заявена шапка', 'Взета')), 0, 1);
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $row['attendance'] = ($row['attendance'] == null) ? '-' : ($row['attendance'] == 0 ? 'Не' : 'Да');
                $row['has_right'] = ($row['has_right'] == 0) ? 'Не' : 'Да';
                $row['is_ready'] = ($row['is_ready'] == 0) ? 'Не' : 'Да';
                $row['is_taken'] = ($row['is_taken'] == 0) ? 'Не' : 'Да';
                $row['take_in_advance_request'] = ($row['take_in_advance_request'] == 0) ? 'Не' : 'Да';
                $row['take_in_advance_request_comment'] = ($row['take_in_advance_request_comment'] == NULL) ? 'Няма коментари' : $row['take_in_advance_request_comment'];
                $row['is_taken_in_advance'] = ($row['is_taken_in_advance'] == 0) ? 'Не' : 'Да';
                $row['diploma_comment'] = ($row['diploma_comment'] == NULL) ? 'Няма коментари' : $row['diploma_comment'];
                $row['speech_request'] = ($row['speech_request'] == 0) ? 'Не' : 'Да';
                $row['speech_response'] = ($row['speech_response'] == NULL) ? '-' : (($row['speech_response'] == 0) ? 'Отказва' : 'Приема');
                $row['photos_requested'] = ($row['photos_requested'] == 0) ? 'Не' : 'Да';
                $row['gown_taken'] = ($row['gown_taken'] == 0) ? 'Не' : 'Да';
                $row['gown_returned'] = ($row['gown_returned'] == 0) ? 'Не' : 'Да';
                $row['hat_taken'] = ($row['hat_taken'] == 0) ? 'Не' : 'Да';
                $pdf->Cell(0, 0, implode(",", $row), 0, 1);
            }
            $pdf->Output("students.pdf", 'D');
        }
    }
}


?>