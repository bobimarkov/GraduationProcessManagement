<?php
session_start();

if (!isset($_SESSION["user"]) || !isset($_SESSION["role"]) || (isset($_SESSION["role"]) && $_SESSION["role"] != "student")) {
    header('Location: ../../index.php');
    exit;
}
$name = $_SESSION["name"];
$email = $_SESSION["user"];
?>

<!DOCTYPE HTML>
<html>

<head>
    <link href="student_style.css" rel="stylesheet">
    <script defer src="student_home.js" async></script>

    <script src="https://kit.fontawesome.com/ee112817f8.js" crossorigin="anonymous"></script>
    <meta charset="UTF-8">
</head>

<body>
</body>

</html>


<script>
    // LOAD USER DATA
    email = "<?php echo $email ?>";
    getStudentData(email);
    var graduation_time;

    function getStudentData(email) {
        fetch(`../../services/get_student_data.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(email)
        })
            .then(response => response.json())
            .then((data) => {
                // console.log(data);
                if (data.error) {
                    /* display error to user */
                    console.log(data.error);
                }
                else if (data.users[0].grade < 3) {
                    buildContent1(data.users[0]);
                }
                else {
                    buildContent(data.users[0]);
                }
            })
    }

    function buildContent1(user) {
        const box = ` 
        <img class="logo" src="../../Images/su-logo.png" alt="su-logo">
    <p class="su-header">СУ "СВ. КЛИМЕНТ ОХРИДСКИ"</p>
    <div class="navigation">
        <h2 class="navigation_element" id="students_header">ДОБРЕ ДОШЪЛ,</h2>
        <h2 class="navigation_element active_header" id="users_header">
            <?php echo $name ?>
        </h2>
        <h2 class="navigation_element"><i class="fas fa-user-graduate"></i></h2>
        <div class="vertical_line"></div>
        <h2 class="navigation_element" id="logout_header"><a href="../../services/logout.php"
                class="logout_header_link">ИЗХОД <i class="fas fa-sign-out-alt"></i></a></h2>
    </div> 
        <div class="row">
            <div class="notifications_section">
                <h3> <i class="fa fa-bell-o" aria-hidden="true"></i> Известия</h3>
                <p>Вие нямате право на диплома!</p>
            </div>

            <div class="profile_info_section">
                <h3> <i class="fa fa-user-o" aria-hidden="true"></i> Информация за потребителя</h3>
                <div class="profile_info_section_content">
                    <div id="profile_info_section_content_1_wrapper">
                        <div id="profile_info_section_content_1">
                            <p id="name"></p>
                            <p id="email"></p>
                            <p id="phone"></p>
                        </div>
                    </div>
                    <div id="profile_info_section_content_2_wrapper">
                        <div id="profile_info_section_content_2">
                            <p id="degree"></p>
                            <p id="major"></p>
                            <p id="group"></p>
                            <p id="fn"></p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="diploma_info_section">
            <h3><i class="fa fa-file-text-o" aria-hidden="true"></i> Информация за дипломомирането</h3>
                <div id="diploma_info_section_content_3_wrapper">
                    <div id="diploma_info_section_content_3">
                        <p>Ще присъствам на дипломирането: <input type="checkbox" id="attendance" onchange="setAttandance('<?php echo $email ?>', this)"></p>
                        <p>Искам снимки: <input type="checkbox" id="photos_requested" onchange="requestPhotos('<?php echo $email ?>', this)"></p>
                    </div>
                </div>              
            </div>
        </div>`
        document.body.innerHTML = box;

        document.getElementById("name").innerText = 'Имена: ' + user.name;
        document.getElementById("email").innerText = 'Имейл: ' + user.email;
        document.getElementById("phone").innerText = 'Телефон: ' + user.phone;

        document.getElementById("degree").innerText = 'Степен: ' + (user.degree == 'Б' ? 'Бакалавър' : (user.degree == 'М' ? 'Магистър' : 'Доктор'));
        document.getElementById("major").innerText = 'Специалност: ' + user.major;
        document.getElementById("group").innerText = 'Група: ' + user.group;
        document.getElementById("fn").innerText = 'Факултетен номер: ' + user.student_fn;

        document.getElementById("attendance").checked = user.attendance == 1 ? true : false;
        document.getElementById("photos_requested").checked = user.photos_requested == 1 ? true : false;

    }


    function buildContent(user) {
        const box = `
        <img class="logo" src="../../Images/su-logo.png" alt="su-logo">
    <p class="su-header">СУ "СВ. КЛИМЕНТ ОХРИДСКИ"</p>
    <div class="navigation">
        <h2 class="navigation_element" id="students_header">ДОБРЕ ДОШЪЛ,</h2>
        <h2 class="navigation_element active_header" id="users_header">
            <?php echo $name ?>
        </h2>
        <h2 class="navigation_element"><i class="fas fa-user-graduate"></i></h2>
        <div class="vertical_line"></div>
        <h2 class="navigation_element" id="logout_header"><a href="../../services/logout.php"
                class="logout_header_link">ИЗХОД <i class="fas fa-sign-out-alt"></i></a></h2>
    </div>
        <div class="row">
        <div class="notifications_section">
            <h3> <i class="fa fa-bell-o" aria-hidden="true"></i> Известия</h3>
            <p id="no-notifications">В момента нямате никакви известия.</p>
            <div id="speech_request_section" class="speech_request_section">
                <p id="speech_request"></p>
                <select class="speech_request_select" id="speech_request_select" onchange="submitRequestSpeechAnswer('<?php echo $email ?>', this.value)">
                    <option value="-1" selected disabled hidden>Отговор ...</option>
                    <option value="1">Приемам</option>
                    <option value="0">Отказвам</option>
                </select>
            </div>

        </div>
        <div class="profile_info_section">
            <h3> <i class="fa fa-user-o" aria-hidden="true"></i> Информация за потребителя</h3>
            <div class="profile_info_section_content">
                <div id="profile_info_section_content_1_wrapper">
                    <div id="profile_info_section_content_1">
                        <p id="name"></p>
                        <p id="email"></p>
                        <p id="phone"></p>
                    </div>
                </div>
                <div id="profile_info_section_content_2_wrapper">
                    <div id="profile_info_section_content_2">
                        <p id="degree"></p>
                        <p id="major"></p>
                        <p id="group"></p>
                        <p id="fn"></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="diploma_info_section">
            <h3><i class="fa fa-file-text-o" aria-hidden="true"></i> Информация за диплома</h3>
            <div class="diploma_info_section_content">
                <div id="diploma_info_section_content_1_wrapper">
                    <div id="diploma_info_section_content_1">
                        <p id="has_right"></p>
                        <p id="is_ready"></p>
                        <p id="grade"></p>
                    </div>
                </div>
                <div id="diploma_info_section_content_2_wrapper">
                    <div id="diploma_info_section_content_2">
                        <p id="take_in_advance_request"></p>
                        <p id="is_taken"></p>
                        <p id="is_taken_in_advance"></p>
                        <p id="taken_at_time"></p>
                    </div>
                </div>
                <div id="diploma_info_section_content_3_wrapper">
                    <div id="diploma_info_section_content_3">
                        <p>Ще присъствам на дипломирането: <input type="checkbox" id="attendance" onchange="setAttandance('<?php echo $email ?>', this)"></p>
                        <p>Искам снимки: <input type="checkbox" id="photos_requested" onchange="requestPhotos('<?php echo $email ?>', this)"></p>
                    </div>
                </div>
                <div id="diploma_info_section_content_4_wrapper">
                    <div id="diploma_info_section_content_4">
                        <p>Административен коментар:</p>
                        <textarea class="diploma_comment" id="diploma_comment" disabled></textarea>
                    </div>
                </div>
            </div>
        </div>

        <div class="request_diploma_in_advance_section">
            <h3><i class="fa fa-paper-plane-o" aria-hidden="true"></i> Заяви вземане на диплома предварително</h3>
            <div class="request_diploma_in_advance_content">
                <form class="request_diploma_in_advance_form" id="request_diploma_in_advance_form">
                    <textarea class="request_diploma_in_advance_comment" name="request_diploma_in_advance_comment" id="request_diploma_in_advance_comment" placeholder="Причина..."></textarea>
                    <button type="submit" class="request_diploma_in_advance_submit_button" id="request_diploma_in_advance" onclick="requestDiplomaInAdvance('<?php echo $email ?>', event, 1)">Заяви</button>
                    <button type="submit" class="request_diploma_in_advance_submit_button" id="cancel_request_diploma_in_advance" onclick="requestDiplomaInAdvance('<?php echo $email ?>', event, 0)">Отмени</button>
                    <p class="message-bar" id='message-bar-diploma-request'></p>
                </form>
            </div>
        </div>

        <div class="request_grown_hat_section">
            <h3><i class="fa fa-graduation-cap" aria-hidden="true"></i> Заяви тога и шапка</h3>
            <div class="request_grown_hat_content">
                <div id="request_grown_hat_content_1_wrapper">
                    <div id="request_grown_hat_content_1">
                        <p id="grown_request"><i>Веднъж въведено, отговорът Ви не може да бъде променен.</i></p>
                        <select class="grown_request_select" id="grown_request_select" onchange="requestGrown('<?php echo $email ?>', this.value)">
                            <option value="-1" selected disabled hidden>Тога</option>
                            <option value="1">Желая да взема тога.</option>
                            <option value="0">Не желая.</option>
                        </select>
                        <p id="grown_taken"></p>
                        <p id="grown_taken_date"></p>
                        <p id="grown_returned"></p>
                        <p id="grown_returned_date"></p>
                    </div>
                </div>
                <div id="request_grown_hat_content_2_wrapper">
                    <div id="request_grown_hat_content_2">
                        <p id="hat_request"><i>Веднъж въведено, отговорът Ви не може да бъде променен.</i></p>
                        <select class="hat_request_select" id="hat_request_select" onchange="requestHat('<?php echo $email ?>', this.value)">
                            <option value="-1" selected disabled hidden>Шапка</option>
                            <option value="1">Желая да взема шапка.</option>
                            <option value="0">Не желая.</option>
                        </select>
                        <p id="hat_taken"></p>
                        <p id="hat_taken_date"></p>
                        <p id="hat_returned"></p>
                        <p id="hat_returned_date"></p>
                    </div>
                </div>
            </div>
        </div>

        <div class="diploma_order_section">
            <h3><i class="fas fa-user-graduate"></i> Пореден списък за връчване на дипломи</h3>
            <p class="message-bar no-margin" id="start_time">Все още няма начален час.</p>
            <p class="message-bar no-margin" id="order_list">Все още няма наредба.</p>
            <p class="message-bar no-margin" id="order_student">Все още няма пореден списък.</p>
            <p class="message-bar no-margin" id="color_message">Все още няма зададени цветове.</p>
        </div>
        </div>`
        document.body.innerHTML = box;
        document.getElementById("name").innerText = 'Имена: ' + user.name;
        document.getElementById("email").innerText = 'Имейл: ' + user.email;
        document.getElementById("phone").innerText = 'Телефон: ' + user.phone;

        document.getElementById("degree").innerText = 'Степен: ' + (user.degree == 'Б' ? 'Бакалавър' : (user.degree == 'М' ? 'Магистър' : 'Доктор'));
        document.getElementById("major").innerText = 'Специалност: ' + user.major;
        document.getElementById("group").innerText = 'Група: ' + user.group;
        document.getElementById("fn").innerText = 'Факултетен номер: ' + user.student_fn;

        document.getElementById("has_right").innerHTML = 'Право на диплома: ' + (user.has_right == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("is_ready").innerHTML = 'Готова диплома: ' + (user.is_ready == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("grade").innerHTML = 'Оценка: ' + (user.grade == 1 ? '<i class="far fa-check-square"></i>' : "Не");

        document.getElementById("is_taken").innerText = 'Взета: ' + (user.is_taken == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("take_in_advance_request").innerHTML = 'Заявена предварително: ' + (user.take_in_advance_request == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("is_taken_in_advance").innerHTML = 'Взета (предварително): ' + (user.is_taken_in_advance == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("taken_at_time").innerText = 'Дата/час на взимане: ' + (user.taken_at_time == null || user.taken_at_time == "" ? "-" : user.taken_at_time);

        document.getElementById("attendance").checked = user.attendance == 1 ? true : false;
        document.getElementById("photos_requested").checked = user.photos_requested == 1 ? true : false;

        document.getElementById("diploma_comment").value = user.diploma_comment == null || user.diploma_comment == "" ? "Няма коментари" : user.diploma_comment;

        if (user.speech_request == 1) {
            document.getElementById("speech_request_section").style.display = "flex";
            document.getElementById("speech_request").innerText = 'Поканен сте да изнесете реч по време на дипломирането. Моля, изберете от падащото меню дали приемате или отказвате поканата.'
            if (user.speech_response != -1) {
                user.speech_response == 1 ? document.getElementById("speech_request_select").value = 1 : 0;
            }
        } else {
            document.getElementById("speech_request_section").style.display = "none";
            document.getElementById("no-notifications").style.display = "block";
        }

        if (user.take_in_advance_request == 0) {
            document.getElementById("request_diploma_in_advance").style.display = "block";
            document.getElementById("cancel_request_diploma_in_advance").style.display = "none";
        } else {
            document.getElementById("request_diploma_in_advance").style.display = "none";
            document.getElementById("cancel_request_diploma_in_advance").style.display = "block";
        }

        var errElem = document.getElementById('message-bar-diploma-request');
        errElem.classList.remove(['success']);
        errElem.classList.remove(['error']);
        errElem.innerHTML = "";

        if (user.grown_requested != null) {
            document.getElementById("grown_request").innerHTML = "Статус: " + (user.grown_requested == 1 ? "Заявена" : "Отказана");
            document.getElementById("grown_request_select").style.display = "none";
        }
        document.getElementById("grown_taken").innerHTML = 'Взета: ' + (user.grown_taken == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("grown_taken_date").innerHTML = 'Дата/час: ' + (user.grown_taken_date == null || user.grown_taken_date == "" ? "-" : user.grown_taken_date);
        document.getElementById("grown_returned").innerHTML = 'Върната: ' + (user.grown_returned == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("grown_returned_date").innerHTML = 'Дата/час: ' + ((user.grown_returned_date == null || user.grown_returned_date == "") ? "-" : user.grown_returned_date);

        if (user.hat_requested != null) {
            document.getElementById("hat_request").innerHTML = "Статус: " + (user.hat_requested == 1 ? "Заявена" : "Отказана");
            document.getElementById("hat_request_select").style.display = "none";
        }
        document.getElementById("hat_taken").innerHTML = 'Взета: ' + (user.hat_taken == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("hat_taken_date").innerHTML = 'Дата/час: ' + (user.hat_taken_date == null || user.hat_taken_date == "" ? "-" : user.hat_taken_date);
        document.getElementById("hat_returned").innerHTML = 'Върната: ' + (user.hat_returned == 1 ? '<i class="far fa-check-square"></i>' : "Не");
        document.getElementById("hat_returned_date").innerHTML = 'Дата/час: ' + (user.hat_returned_date == null || user.grown_taken_date == "" ? "-" : user.grown_taken_date);
    }

    getStartHour();
    getDiplomaOrder();


    function getStartHour() {
        var start_time = document.getElementById('start_time');

        fetch('../../services/get_graduation_time.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (!data.success) {
                    // order_message.innerHTML = order_message.innerHTML.concat("Начален час: ").concat(data.message).concat('</br>');
                    window.graduation_time = null;
                } else {
                    start_time.innerHTML = ("Начален час: ").concat(data.graduation_time[0].start_time);
                    window.graduation_time = data.graduation_time[0];
                    getColorsConfig();
                }
            });
    }

    function getDiplomaOrder() {
        fetch('../../services/get_diploma_order.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (!data.success) {
                    // няма наредба все още
                } else {
                    displayOrderMessage(data.order[0]);
                }
            });
    }

    function displayOrderMessage(data) {
        var text = "Текуща подредба: ";
        for (const [key, value] of Object.entries(data)) {
            switch (value) {
                case "fn":
                    text = text.concat("ФН, ");
                    break;
                case "name":
                    text = text.concat("Име, ");
                    break;
                case "degree":
                    text = text.concat("Степен, ");
                    break;
                case "major":
                    text = text.concat("Специалност, ");
                    break;
                case "group":
                    text = text.concat("Група, ");
                    break;
                case "grade":
                    text = text.concat("Успех, ");
                    break;
                default:
                    break;
            }
        }
        text = text.slice(0, -1);
        text = text.slice(0, -1);
        document.getElementById('order_list').innerHTML = text;
    }

    function getColorsConfig() {
        fetch('../../services/get_graduation_colors.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (!data.success) {
                } else {
                    var colors_config = data.graduation_colors;
                    getStudentsOrder(colors_config);
                }
            });
    }

    function getStudentsOrder(colors_config) {
        var startTime;
        var interval;
        if (graduation_time != null) {
            startTime = graduation_time.start_time;
            interval = graduation_time.students_interval;
        }
        fetch('../../services/get_students_diploma_simplified.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (!data.success) {
                } else {
                    showGraduationOrder(data.users, startTime, interval, colors_config);
                }
            });
    }

    function showGraduationOrder(users, startTime, interval, colors_config) {
        var user_email = "<?php echo $email ?>";
        var order_message = document.getElementById('order_student');
        var dummy_date = "2012-12-12"
        var start_object = new Date(`${dummy_date} ${startTime}`);
        var interval_object = new Date(`${dummy_date} ${interval}`);
        var i = 1;

        users.forEach(user => {
            var next = interval_object.getSeconds();
            start_object.setSeconds(start_object.getSeconds() + next);
            if (user_email == user.email) {
                order_message.innerHTML = ("Вашият ред е: ").concat(i).concat(", около ").concat(start_object.toTimeString().split(' ')[0]);

                getColor(i, users.length, colors_config);
            }
            i++;
        })
    }

    function getColor(i, n, colors_config) {
        var part = Math.round((colors_config[0].color_interval / 100 * n));
        var current_part = part;
        var color_index = 1;

        while (current_part < n + part) {
            if (i <= current_part) {
                var color = "color".concat(color_index);
                document.getElementById('color_message').innerHTML = "Вашият цвят е: ".concat(extractColor(colors_config[0][`${color}`]));
                break;
            }
            color_index++;
            current_part += part;
        }
        if (current_part > n + part) {
            document.getElementById('color_message').innerHTML = "Вашият цвят е: ".concat(extractColor("silver"));
        }
    }

    function extractColor(color_code) {
        switch (color_code) {
            case "#FF0000": return "червен <i class='fas fa-square' style='color: #FF0000;'></i>"; break;
            case "#FFA500": return "оранжев <i class='fas fa-square' style='color: #FFA500;'></i>"; break;
            case "#FFFF00": return "жълт <i class='fas fa-square' style='color: #FFFF00;'></i>"; break;
            case "#228B22": return "зелен <i class='fas fa-square' style='color: #228B22;'></i>"; break;
            case "#0000FF": return "син <i class='fas fa-square' style='color: #0000FF;'></i>"; break;
            case "#FF1493": return "розов <i class='fas fa-square' style='color: #FF1493;'></i>"; break;
            case "#663399": return "лилав <i class='fas fa-square' style='color: #663399;'></i>"; break;
            case "#8B4513": return "кафяв <i class='fas fa-square' style='color: #8B4513;'></i>"; break;
            case "#000000": return "черен <i class='fas fa-square' style='color: #000000;'></i>"; break;
            case "#F0FFFF": return "бял <i class='fas fa-square' style='color: #F0FFFF;'></i>"; break;
            default: return "сив <i class='fas fa-square' style='color: #A9A9A9;'></i>"
        }
    }
</script>