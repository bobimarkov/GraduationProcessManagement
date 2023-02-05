<?php 
class Db {
    private $connection;
    public function __construct() {
        $config = json_decode(file_get_contents("../src/config/config.json"), true);

        $dbHost = $config["db_host"];
        $dbName = $config["db_name"];
        $userName = $config["db_username"];
        $userPassword = $config["db_password"];
        
        $this->connection = new PDO("mysql:host=$dbHost;dbname=$dbName", $userName, $userPassword,
        [
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8", 
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
    }

    public function getConnection() {
        return $this->connection;
    }
}
?>