<?php 
$error = "";
if (isset($_GET['error'])) {

    $error = $_GET['error']; 
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Вход</title>
    <link href="style_login.css" rel="stylesheet">
    <script src="./login.js"></script>
    <script src="https://kit.fontawesome.com/ee112817f8.js" crossorigin="anonymous"></script>

</head>
<div class="container" id="container">
    <div class="form-container sign-in-container">
        <form name="login_form" action="./services/login.php" method="POST">
            <img src="su-logo.png" />
            <h1>Вход</h1>
            <input type="email" name="email"   placeholder="Email" required/>
            <input type="password" name="password"  placeholder="Password" required/>
           <!-- <input type="submit" id="login-button" value="Влез"></input> -->
           <button>Вход</button>
        </form>
        <p class="<?php echo isset($_GET['error']) ? 'message-bar' : '' ?>" id='message-bar-users'><?php echo $error?></p>
    </div>
    <div class="overlay-container">
        <div class="overlay">
            <div class="overlay-panel">
                <h1>Здравей!</h1>
                <p>Въведи своите данни, за да продължиш :)</p>
            </div>
        </div>
    </div>
</div>

</html>