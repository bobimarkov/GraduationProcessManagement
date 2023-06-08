<?php

require_once "../src/lib/php-jwt-6.3.2/src/JWT.php";
require_once "../src/lib/php-jwt-6.3.2/src/Key.php";
require_once "../src/database/db_conf.php";
require_once "../src/exception/InvalidIssuerException.php";
require_once "../src/exception/UserNotFoundException.php";
require_once "../src/exception/UnauthorizedAccessException.php";
require_once "../src/lib/aws/aws-autoloader.php";

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Aws\Kms\KmsClient;
use Aws\Exception\AwsException;

echo "HERE 7";

$config = json_decode(file_get_contents("../src/config/config.json"), true);
$issuer = $config["issuer"];

echo "HERE 8";
try {
    $KmsClient = new KmsClient([
        'profile' => 'default',
        'version' => '2014-11-01',
        'region' => 'us-east-1'
    ]);
}
catch (Error $e) {
    echo $e->getTrace();
    echo "\n";
}

echo "HERE 9";
$keyId = 'arn:aws:kms:us-east-1:175668400529:key/ab9e8b5b-ed4b-4383-8391-3267c88de2f7';

echo "HERE 10";
try {
    $result = $KmsClient->describeKey([
        'KeyId' => $keyId,
    ]);
    // var_dump($result);
} catch (AwsException $e) {
    echo $e->getMessage();
    echo "\n";
}

echo "HERE 11";
 

$secret_key = $config["secret_key"];

function generateJWT($email, $role)
{
    global $issuer;
    global $secret_key;

    $now = time();
    $payload = array(
        "sub" => $email,
        "role" => $role,
        "iss" => $issuer,
        "iat" => $now,
        "exp" => $now + (60 * 60), // expires in 1 hour
        "jti" => bin2hex(random_bytes(16)),
    );

    return JWT::encode($payload, $secret_key, "HS256");

}

function validateJWT($jwt, $role) { // В $role задаваш масив от роли, за които ще е достъпна съответната функционалност
    global $issuer;
    global $secret_key;
    $response = array();

    try {
        $decoded = JWT::decode($jwt, new Key($secret_key, "HS256"));

        $database = new Db();
        $conn = $database->getConnection();
        $stmt = $conn->prepare("SELECT role, name 
                                FROM user 
                                WHERE email = :email");

        $stmt->execute(["email" => $decoded->sub]);
        $rows = $stmt->fetchAll();

        if (count($rows) !== 0) {
            if ($decoded->iss !== $issuer) { 
                throw new InvalidIssuerException("Невалиден изпълнител.");
            }
            if (!in_array($decoded->role, $role)) {
                throw new UnauthorizedAccessException("Неоторизиран достъп.");
            }
        } else {
            throw new UserNotFoundException("Потребителят не е намерен.");
        }
        return;
    }
    catch (SignatureInvalidException $e) {
        $response["success"] = false;
        $response["error"] = "Невалиден токен!";

        http_response_code(400);
        echo json_encode($response);
        die;
    }
    catch (ExpiredException $e) {
        $response["success"] = false;
        $response["error"] = "Изтекъл токен.";

        http_response_code(401);
        echo json_encode($response);
        die;
    }
    catch (UnauthorizedAccessException | InvalidIssuerException $e) {
        $response["success"] = false;
        $response["error"] = $e -> getMessage();

        http_response_code(403);
        echo json_encode($response);
        die;
    }
    catch (UserNotFoundException $e) {
        $response["success"] = false;
        $response["error"] = $e -> getMessage();

        http_response_code(404);
        echo json_encode($response);
        die;
    } catch (UnexpectedValueException $e) {
        $response["success"] = false;
        $response["error"] = "Не е открит токен!";

        http_response_code(401);
        echo json_encode($response);
        die;
    }
}

function refreshJWT($jwt) {
    global $secret_key;

    $decoded = JWT::decode($jwt, new Key($secret_key, "HS256"));
    $decoded -> exp = time() + (60 * 60);

    return JWT::encode((array) $decoded, $secret_key, "HS256");
}

function getUserEmailFromJWT($jwt) {
    global $secret_key;

    $decoded = JWT::decode($jwt, new Key($secret_key, "HS256"));

    return $decoded -> sub;
}


function getUserRoleFromJWT($jwt) {
    global $secret_key;

    $decoded = JWT::decode($jwt, new Key($secret_key, "HS256"));

    return $decoded -> role;
}

?>