<?php

//Това ще правя сега
include_once '../src/utils/JWTUtils.php';

validateJWT($jwt, ["admin", "moderator"]); // Да не се забравя

?>