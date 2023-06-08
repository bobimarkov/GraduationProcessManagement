
<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

include_once '../src/database/db_conf.php';
echo "HERE 6";
include_once '../src/utils/JWTUtils.php';

echo "HERE 7";

$data = (array) $data;
$email = $password = "";

$response = ["success" => true];
$error = "";
$user = [];


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if username is empty
    if(empty(trim($data["email"]))) {
        $error = "Моля попълнете всички полета";
        $response["error"] = $error;
        $response["success"] = false;
        die;
    } else{
        $email = trim($data["email"]);
    }
    
    // Check if password is empty
    if(empty(trim($data["password"]))){
        $error = "Моля попълнете всички полета";
        $response["error"] = $error;
        $response["success"] = false;
        die;
    } else{
        $password = trim($data["password"]);
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

        if(count($rows) === 1) {
            $role = $rows[0]["role"];

            $response["role"] = $role;
            $response["jwt"] = generateJWT($email, $role);
        } else {
            $error = "Грешно потребителско име или парола!";
            $response["error"] = $error;
            $response["success"] = false;
        }
        echo json_encode($response, true);
        if ($response["success"]) {
            http_response_code(200);
        } else {
            http_response_code(400);
        }
        die;
    } 
}

?>