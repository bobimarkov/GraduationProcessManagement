<?php
  
  $headers = apache_request_headers();
  $jwt = "";
  if (isset($headers['Authorization'])) {
    $auth_header = $headers['Authorization'];
    $exploded = explode(" ", $auth_header);
    
    if ($exploded[0] !== "Bearer") {
      http_response_code(400);
      die;
    }
    
    $jwt = $exploded[1];
  }
  
  $endpoint = $_GET['endpoint'];
  $data = json_decode(file_get_contents("php://input"), true);
  
  include_once "../src/api/$endpoint.php";
?>