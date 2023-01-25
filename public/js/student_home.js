var email;

let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    sessionStorage.clear();

    window.location.replace("../../");
});

function sessionLoader() {
    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("role") || (sessionStorage.getItem("role") && sessionStorage.getItem("role") !== "student")) {
        sessionStorage.clear();

        window.location.replace("../../");
        return;
    }
    email = sessionStorage.getItem("user");
    document.getElementById("users_header").innerHTML = sessionStorage.getItem("name");
}

sessionLoader();

function submitRequestSpeechAnswer(email, value) {
    // value = 1, 0
    var requestData = {
        "column_name": "speech_response",
        "email": email,
        "value": value
    };
    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {

            }
        });
}

function setAttandance(email, checkbox) {
    var value = checkbox.checked ? 1 : 0;
    var requestData = {
        "column_name": "attendance",
        "email": email,
        "value": value
    };
    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {

            }
        });
}

function requestPhotos(email, checkbox) {
    var value = checkbox.checked ? 1 : 0;
    var requestData = {
        "column_name": "photos_requested",
        "email": email,
        "value": value
    };
    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {

            }
        });
}

function requestDiplomaInAdvance(email, event, value) {
    // value = 0, 1
    event.preventDefault();
    var form = document.getElementById('request_diploma_in_advance_form');
    var comment = form.request_diploma_in_advance_comment.value;

    var requestData = {
        "column_name": "take_in_advance_request",
        "email": email,
        "comment": comment,
        "value": value
    };

    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-diploma-request');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;

                document.getElementById("request_diploma_in_advance_comment").value = "";

                if (document.getElementById("request_diploma_in_advance").style.display === "block") {
                    document.getElementById("request_diploma_in_advance").style.display = "none";
                    document.getElementById("cancel_request_diploma_in_advance").style.display = "block";
                } else {
                    document.getElementById("request_diploma_in_advance").style.display = "block";
                    document.getElementById("cancel_request_diploma_in_advance").style.display = "none";
                }

            }
        });
}

function requestGown(email, value) {
    // value = 1, 0
    var requestData = {
        "column_name": "gown_requested",
        "email": email,
        "value": value
    };
    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {
                location.reload();
            }
        });
}

function requestHat(email, value) {
    // value = 1, 0
    var requestData = {
        "column_name": "hat_requested",
        "email": email,
        "value": value
    };

    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {
                location.reload();
            }
        });
}

// LOAD USER DATA
getStudentData(email);
var graduation_time;

function getStudentData(email) {
    fetch(`../../api?endpoint=get_student_data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(email)
    })
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                /* display error to user */
                console.log(data.error);
            } else if (data.users[0].grade < 3) {
                buildContentForNotGraduatingStudent(data.users[0]);
            } else {
                buildContentForGraduatingStudent(data.users[0]);
            }
        })
}

function buildContentForNotGraduatingStudent(user) {
    document.querySelector(".diploma_info_section").style.display = 'none';
    document.querySelector(".notifications_section").style.display = 'none';
    document.querySelector(".request_diploma_in_advance_section").style.display = 'none';
    document.querySelector(".request_gown_hat_section").style.display = 'none';
    document.querySelector(".diploma_order_section").style.display = 'none';

    document.getElementById("name").innerText = 'Имена: ' + user.name;
    document.getElementById("email").innerText = 'Имейл: ' + user.email;
    document.getElementById("phone").innerText = 'Телефон: ' + user.phone;

    document.getElementById("degree").innerText = 'Степен: ' + (user.degree === 'Б' ? 'Бакалавър' : (user.degree === 'М' ? 'Магистър' : 'Доктор'));
    document.getElementById("major").innerText = 'Специалност: ' + user.major;
    document.getElementById("group").innerText = 'Група: ' + user.group;
    document.getElementById("fn").innerText = 'Факултетен номер: ' + user.student_fn;

    document.getElementById("attendance").checked = user.attendance === 1 ? true : false;
    document.getElementById("photos_requested").checked = user.photos_requested === 1 ? true : false;

}


function buildContentForGraduatingStudent(user) {
    document.querySelector(".non_graduating_warning_section").style.display = 'none';
    document.querySelector(".graduation_info_section").style.display = 'none';

    document.getElementById("name").innerText = 'Имена: ' + user.name;
    document.getElementById("email").innerText = 'Имейл: ' + user.email;
    document.getElementById("phone").innerText = 'Телефон: ' + user.phone;

    document.getElementById("degree").innerText = 'Степен: ' + (user.degree === 'Б' ? 'Бакалавър' : (user.degree === 'М' ? 'Магистър' : 'Доктор'));
    document.getElementById("major").innerText = 'Специалност: ' + user.major;
    document.getElementById("group").innerText = 'Група: ' + user.group;
    document.getElementById("fn").innerText = 'Факултетен номер: ' + user.student_fn;

    document.getElementById("has_right").innerHTML = 'Право на диплома: ' + (user.has_right === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("is_ready").innerHTML = 'Готова диплома: ' + (user.is_ready === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("grade").innerHTML = 'Оценка: ' + (user.grade === 1 ? '<i class="far fa-check-square"></i>' : "Не");

    document.getElementById("is_taken").innerText = 'Взета: ' + (user.is_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("take_in_advance_request").innerHTML = 'Заявена предварително: ' + (user.take_in_advance_request === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("is_taken_in_advance").innerHTML = 'Взета (предварително): ' + (user.is_taken_in_advance === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("taken_at_time").innerText = 'Дата/час на взимане: ' + (user.taken_at_time === null || user.taken_at_time === "" ? "-" : user.taken_at_time);
    document.getElementById("signature_moderator").innerHTML = 'Модератор за диплома: ' + (user.moderator_signature_email === null ?  'Не е избран' : user.moderator_signature_email);

    document.getElementById("attendance").checked = user.attendance === 1 ? true : false;
    document.getElementById("photos_requested").checked = user.photos_requested === 1 ? true : false;

    document.getElementById("diploma_comment").value = user.diploma_comment === null || user.diploma_comment === "" ? "Няма коментари" : user.diploma_comment;

    if (user.speech_request === 1) {
        document.getElementById("speech_request_section").style.display = "flex";
        document.getElementById("speech_request").innerText = 'Поканен сте да изнесете реч по време на дипломирането. Моля, изберете от падащото меню дали приемате или отказвате поканата.'
        if (user.speech_response !== -1) {
            user.speech_response === 1 ? document.getElementById("speech_request_select").value = 1 : 0;
        }
    } else {
        document.getElementById("speech_request_section").style.display = "none";
        document.getElementById("no-notifications").style.display = "block";
    }

    if (user.take_in_advance_request === 0) {
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

    if (user.gown_requested !== null) {
        document.getElementById("gown_request").innerHTML = "Статус: " + (user.gown_requested === 1 ? "Заявена" : "Отказана");
        document.getElementById("gown_request_select").style.display = "none";
    }
    document.getElementById("gown_taken").innerHTML = 'Взета: ' + (user.gown_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("gown_taken_date").innerHTML = 'Дата/час: ' + (user.gown_taken_date === null || user.gown_taken_date === "" ? "-" : user.gown_taken_date);
    document.getElementById("gown_returned").innerHTML = 'Върната: ' + (user.gown_returned === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("gown_returned_date").innerHTML = 'Дата/час: ' + ((user.gown_returned_date === null || user.gown_returned_date === "") ? "-" : user.gown_returned_date);
    document.getElementById("gown_moderator").innerHTML = 'Модератор за тога: ' + (user.moderator_gown_email === null ? 'Не е избран' : user.moderator_gown_email);

    if (user.hat_requested !== null) {
        document.getElementById("hat_request").innerHTML = "Статус: " + (user.hat_requested === 1 ? "Заявена" : "Отказана");
        document.getElementById("hat_request_select").style.display = "none";
    }
    document.getElementById("hat_taken").innerHTML = 'Взета: ' + (user.hat_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("hat_taken_date").innerHTML = 'Дата/час: ' + (user.hat_taken_date === null || user.hat_taken_date === "" ? "-" : user.hat_taken_date);
    document.getElementById("hat_returned").innerHTML = 'Върната: ' + (user.hat_returned === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("hat_returned_date").innerHTML = 'Дата/час: ' + (user.hat_returned_date === null || user.gown_taken_date === "" ? "-" : user.gown_taken_date);
    document.getElementById("hat_moderator").innerHTML = 'Модератор за шапка: ' + (user.moderator_hat_email === null ? 'Не е избран' : user.moderator_hat_email);
}

getStartHour();
getDiplomaOrder();


function getStartHour() {
    var start_time = document.getElementById('start_time');

    fetch('../../api?endpoint=get_graduation_time', {
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
    fetch('../../api?endpoint=get_diploma_order', {
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
    fetch('../../api?endpoint=get_graduation_colors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) { } else {
                var colors_config = data.graduation_colors;
                getStudentsOrder(colors_config);
            }
        });
}

// ОТ ТУК НАТАТЪК Е КОД, КОЙТО ТРЯБВА ДА СЕ ИЗПЪЛНЯВА В БЕКЕНДА
// ВЪЗМОЖНИЯТ ВАРИАНТ Е АДМИНЪТ ДА ЗАДАВА КОГА ДА СЕ РАЗПРЕДЕЛЯ РЕД И СПИСЪЦИ, ЦВЕТОВЕ
// В ТАКЪВ СЛУЧАЙ ТОВА СЕ ВОДИ НОВА ФУНКЦИОНАЛНОСТ ЗА АДМИНЪТ И ЩЕ БЪДЕ НАПРАВЕНО ДОПЪЛНИТЕЛНО

function getStudentsOrder(colors_config) {
    var startTime;
    var interval;
    if (graduation_time !== null) {
        startTime = graduation_time.start_time;
        interval = graduation_time.students_interval;
    }
    fetch('../../api?endpoint=get_students_diploma_simplified', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) { } else {
                showGraduationOrder(data.users, startTime, interval, colors_config);
            }
        });
}

function showGraduationOrder(users, startTime, interval, colors_config) {
    var user_email = email;
    var order_message = document.getElementById('order_student');
    var dummy_date = "2012-12-12"
    var start_object = new Date(`${dummy_date} ${startTime}`);
    var interval_object = new Date(`${dummy_date} ${interval}`);
    var i = 1;

    users.forEach(user => {
        var next = interval_object.getSeconds();
        start_object.setSeconds(start_object.getSeconds() + next);
        if (user_email === user.email) {
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
        case "#FF0000":
            return "червен <i class='fas fa-square' style='color: #FF0000;'></i>";
            break;
        case "#FFA500":
            return "оранжев <i class='fas fa-square' style='color: #FFA500;'></i>";
            break;
        case "#FFFF00":
            return "жълт <i class='fas fa-square' style='color: #FFFF00;'></i>";
            break;
        case "#228B22":
            return "зелен <i class='fas fa-square' style='color: #228B22;'></i>";
            break;
        case "#0000FF":
            return "син <i class='fas fa-square' style='color: #0000FF;'></i>";
            break;
        case "#FF1493":
            return "розов <i class='fas fa-square' style='color: #FF1493;'></i>";
            break;
        case "#663399":
            return "лилав <i class='fas fa-square' style='color: #663399;'></i>";
            break;
        case "#8B4513":
            return "кафяв <i class='fas fa-square' style='color: #8B4513;'></i>";
            break;
        case "#000000":
            return "черен <i class='fas fa-square' style='color: #000000;'></i>";
            break;
        case "#F0FFFF":
            return "бял <i class='fas fa-square' style='color: #F0FFFF;'></i>";
            break;
        default:
            return "сив <i class='fas fa-square' style='color: #A9A9A9;'></i>"
    }
}