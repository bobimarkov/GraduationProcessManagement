<?php

include_once "../src/utils/JWTUtils.php";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    validateJWT($jwt, ["admin", "moderator", "student"]);

    $new_jwt = refreshJWT($jwt);
    $response = ["success" => true, "jwt" => $jwt];

    echo json_encode($response);
}

?>