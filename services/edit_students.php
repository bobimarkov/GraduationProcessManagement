<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../database/db_conf.php';


$users_data = "";
session_start();

if($_SERVER["REQUEST_METHOD"]=='POST'){
    $data = json_decode(file_get_contents("php://input"));
    

    if (empty(trim($data))) {
        $response = array("success" => false, "message" => "Грешка: Моля, въведете данни за студент(и).");
        echo json_encode($response);
        die;
    } else {
        $users_data = trim($data);
    }
    
    
    
    /* ФН,ИМЕЙЛ,тЕЛЕФОН  */

    // махаме всички нови редове >=2
    $users_data_escape_multiple_endlines = preg_replace("/[\r\n]+/", "\n", $users_data);

    $users_arr_1d = preg_split("/\r\n|\r|\n/", $users_data_escape_multiple_endlines);
    
  
    
    if (count($users_arr_1d) > 0) {
        
        // всеки потребител го разделяме спрямо , получавайки масив от полетата му $values => 
        // накрая имаме масив от потребители $users_arr_2d, където всеки потребител е масив от стойности
        $users_arr_2d = array();
        $i = 0;
        foreach ($users_arr_1d as $user) {
            $user = trim($user);
            $values = explode(",", $user);
            // проверка дали стойностите на студента са валидни
            validateInput($values, $user, $i);

            $values_trimmed = array_map("trim", $values);
            $values_indexed = array_values($values_trimmed);

            $users_arr_2d += [$i => $values_trimmed];
            $i++;
        }
        
        
        
        

        updateStudentsDB($users_arr_2d);

        
    }
    
    
    
}

function updateStudentsDB($users_arr_2d){
    $database = new Db();
    $conn = $database->getConnection();
    
    
    $stmt = $conn->prepare("UPDATE user Set email = :email , phone = :phone Where id = ( Select user_id From student Where fn = :fn) ");
         
    foreach ($users_arr_2d as $user) {
                      

        $stmt->execute(["fn"=>$user[0],"email"=>$user[1],"phone"=>$user[2]]);                           
        $result=$stmt->fetchAll();
        

    }
    $response = array("success" => true, "message" => "Данните на студентите са променени успешно. Моля, презаредете страницата, за да ги видите.");
       
    echo json_encode($response);
    
    


}

function validateInput(&$values, $user, $i)
{
    $alpha_numeric_pattern  = "/^[a-zA-Z\p{Cyrillic}0-9\s\-]+$/u";
    $letters_only_pattern  = "/^[a-zA-Z\p{Cyrillic}\s\-]+$/u";

    $values_trimmed = array_map("trim", $values);
    $values_indexed = array_values($values_trimmed);

    if (count($values) != 3) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - стойностите трябва да са 3 на брой! \nМоля, отделяйте всеки студент на нов ред.");
        echo json_encode($response);
        die;
    }

    if (
        empty($values_indexed[0]) || empty($values_indexed[1]) || empty($values_indexed[2]) )
     { 
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - стойностите не трябва да са празни!");
        echo json_encode($response);
        die;
    }

    $fn = $values_indexed[0];
    if ((strlen($fn) == 5 || strlen($fn) == 6) && !is_numeric($fn)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - ФН (стар модел) не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    } else if (strlen($fn) == 10 && !ctype_alnum($fn)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - ФН (нов модел) може да съдържа само цифри и букви");
        echo json_encode($response);
        die;
    } else if (strlen($fn) != 10 && strlen($fn) != 5 && strlen($fn) != 6) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - Невалидна дължина на ФН: 5 или 6 (за стар модел) или 10 (за нов модел)!");
        echo json_encode($response);
        die;
    }


    $email = filter_var($values_indexed[1], FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - невалиден имейл адрес!");
        echo json_encode($response);
        die;
    }

    
    

    $phone = $values_indexed[2];
    if (!is_numeric($phone)) {
        $response = array("success" => false, "message" => "Грешка за студент $i ($user) - телефонът не може да съдържа символи различни от цифрите 0-9!");
        echo json_encode($response);
        die;
    }

    

    
}