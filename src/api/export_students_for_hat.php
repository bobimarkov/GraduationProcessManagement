<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
include_once '../src/utils/JWTUtils.php';


if ($_SERVER["REQUEST_METHOD"] === 'POST') {
    validateJWT($jwt, ["admin", "moderator-hat"]);
    $email = getUserEmailFromJWT($jwt);

    $data = (array) $data;
    if (isset($data["format"])) {

        $format = $data["format"];
        $name = "students_for_hat." . $format;

        $database = new Db();
        $conn = $database->getConnection();

        $stmt = $conn->prepare("
            select student.fn, user.name, user.email, user.phone,student_diploma.attendance,student_hat.hat_taken, student_hat.hat_taken_date
            from student
            join user on user.id = student.user_id
            join student_hat on student.fn = student_hat.student_fn
            join student_diploma on student.fn = student_diploma.student_fn
            join student_moderators on student_diploma.student_fn = student_moderators.student_fn
            where moderator_hat_email = :email
            and hat_requested = 1");
        $stmt->execute(["email" => $email]);

        if ($format !== 'pdf' && $format !== 'no') {
            header('Content-Type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename="' . basename($name));
            $output = fopen($name, "w");

            fwrite($output, "\xEF\xBB\xBF");
            fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($output, array("ФН", "Име", "Имейл", "Телефон", "Присъствие", "Взета", "Дата на вземане"));
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                //Тук ще оправя повторението на код след като оправим кои ще са null по default
                $row['attendance'] = ($row['attendance'] == 0) ? 'Не' : 'Да';
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
            $pdf->Cell(0, 0, implode(",", array("ФН", "Име", "Имейл", "Телефон", "Присъствие", "Взета", "Дата на вземане")), 0, 1);
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                //Тук ще оправя повторението на код след като оправим кои ще са null по default
                $row['attendance'] = ($row['attendance'] == 0) ? 'Не' : 'Да';
                $row['hat_taken'] = ($row['hat_taken'] == 0) ? 'Не' : 'Да';
                fputcsv($output, $row);
                $pdf->Cell(0, 0, implode(",", $row), 0, 1);
            }
            $pdf->Output("students_for_hat.pdf", 'D');
        }
    }
}
?>