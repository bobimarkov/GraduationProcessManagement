<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../database/db_conf.php';


$data_array = array();

$email = $password = "";
$email_err = $password_err = $login_err = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if username is empty
    if(empty(trim($_POST["email"]))) {
        $email_err = "Please enter email.";
        header("Location: ../index.php?error=Моля попълнете всички полета.");
        die;
    } else{
        $email = trim($_POST["email"]);
    }
    
    // Check if password is empty
    if(empty(trim($_POST["password"]))){
        $password_err = "Please enter your password.";
        header("Location: ../index.php?error=Моля попълнете всички полета.");
        die;
    } else{
        $password = trim($_POST["password"]);
    }

    if(empty($username_err) && empty($password_err)) {
        $hashed_password = sha1($password);

        $database = new Db();
        $conn = $database->getConnection();
        $stmt = $conn->prepare("SELECT role, name 
                                FROM user 
                                WHERE email = :email AND password = :password");

        $stmt->execute(["email" => $email, "password" => $hashed_password]);
        $rows = $stmt->fetchAll();

        if(count($rows) == 1) {
            $role = $rows[0]["role"];
            $name = $rows[0]["name"];
            //success - found record in database
            session_start();
            $_SESSION['user'] = $email;
            $_SESSION['role'] = $role;    
            $_SESSION['name'] = $name;    
  
            switch ($role) {
             case "admin":
                 header("Location: ../user_pages/admin/admin_home.php");
                 break;
             case "moderator":
                 header("Location: ../user_pages/moderator/moderator_home.php");
                 break;
             case "student":
                 header("Location: ../user_pages/student/student_home.php");
                 break;
            }
        } else {
            header("Location: ../index.php?error=Невалидни входни данни.");
        }
        die;
    } 
}
?>