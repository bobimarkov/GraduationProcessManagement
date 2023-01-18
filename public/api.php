<?php
  $endpoint = $_GET['endpoint'];
  $data = json_decode(file_get_contents("php://input"));
  
  include_once "../src/api/$endpoint.php";
?>