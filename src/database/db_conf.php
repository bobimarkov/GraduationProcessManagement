<?php
require_once "../src/lib/aws/aws-autoloader.php";

use Aws\Exception\AwsException;
use Aws\SecretsManager\SecretsManagerClient;
use Aws\Credentials\CredentialProvider;

class Db {
    private $connection;
    public function __construct() {
        $secret_name = "MySQL/GPM-S-TEST-1";

        $credentials = CredentialProvider::defaultProvider();
        var_dump($credentials);

        $SMClient = new SecretsManagerClient([
            'version' => '2017-10-17',
            'region' => 'us-east-1',
            // 'credentials  ' => $credentials
        ]);

        try {        
            $result = $SMClient -> getSecretValue([
                  "SecretId" => $secret_name,
                  "VersionStage" => "AWSCURRENT" 
            ]);
            $dbData = json_decode($result["SecretString"], true);
        } catch (Exception | Error $e) {
            echo $e->getMessage();
            echo "\n";
        }

        $dbHost = $dbData["host"];
        $dbName = $dbData["dbname"];
        $userName = $dbData["username"];
        $userPassword = $dbData["password"];
        
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
