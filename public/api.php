<?php
  echo "HERE 2";
  
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
  
  echo "HERE 3";
  $endpoint = $_GET['endpoint'];
  $data = json_decode(file_get_contents("php://input"), true);
  
  echo "HERE 4";
  
  include_once "../src/api/$endpoint.php";
  echo "HERE 5";
?>