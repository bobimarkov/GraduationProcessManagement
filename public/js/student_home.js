tokenRefresher();
getStudentData();
var email;

let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    localStorage.removeItem('token');

    window.location.replace("../../");
});

function tokenRefresher() {
    fetch('../../api?endpoint=refresh_token', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then(response => {
            localStorage.setItem('token', response.jwt);
        })
}

function submitRequestSpeechAnswer(email, value) {
    var requestData = {
        "column_name": "speech_response",
        "email": email,
        "value": value
    };
    fetch('../../api?endpoint=submit_student_action', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            if (!data.success) {

            } else {
                location.reload();
            }
        });
}

// LOAD USER DATA
var graduation_time;

function getStudentData() {
    fetch(`../../api?endpoint=get_student_data`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            if (data.error) {
                /* display error to user */
                console.log(data.error);
            } else {
                email = data.users[0].email;
                document.getElementById("users_header").innerHTML = data.users[0].name;

                if (data.users[0].grade < 3) {
                buildContentForNotGraduatingStudent(data.users[0]);
            } else {
                buildContentForGraduatingStudent(data.users[0]);
            }
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
    document.getElementById("grade").innerHTML = 'Оценка: ' + user.grade;

    document.getElementById("is_taken").innerText = 'Взета: ' + (user.is_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("take_in_advance_request").innerHTML = 'Заявена предварително: ' + (user.take_in_advance_request === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("is_taken_in_advance").innerHTML = 'Взета (предварително): ' + (user.is_taken_in_advance === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("taken_at_time").innerText = 'Дата/час на взимане: ' + (user.taken_at_time === null || user.taken_at_time === "" ? "-" : user.taken_at_time);

    document.getElementById("attendance").checked = user.attendance === 1 ? true : false;
    document.getElementById("photos_requested").checked = user.photos_requested === 1 ? true : false;

    document.getElementById("diploma_comment").value = user.diploma_comment === null || user.diploma_comment === "" ? "Няма коментари" : user.diploma_comment;

    if (user.speech_request === 1) {
        document.getElementById("speech_request_section").style.display = "flex";
        document.getElementById("speech_request").innerText = 'Поканен сте да изнесете реч по време на дипломирането. Моля, изберете от падащото меню дали приемате или отказвате поканата.'
        if (user.speech_response !== null) {
            user.speech_response === 1 ? document.getElementById("speech_request_select").value = 1 : document.getElementById("speech_request_select").value = 0;
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

    if (user.hat_requested !== null) {
        document.getElementById("hat_request").innerHTML = "Статус: " + (user.hat_requested === 1 ? "Заявена" : "Отказана");
        document.getElementById("hat_request_select").style.display = "none";
    }
    document.getElementById("hat_taken").innerHTML = 'Взета: ' + (user.hat_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("hat_taken_date").innerHTML = 'Дата/час: ' + (user.hat_taken_date === null || user.hat_taken_date === "" ? "-" : user.hat_taken_date);
    document.getElementById("hat_returned").innerHTML = 'Върната: ' + (user.hat_returned === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("hat_returned_date").innerHTML = 'Дата/час: ' + (user.hat_returned_date === null || user.gown_taken_date === "" ? "-" : user.gown_taken_date);
}

getStartHour();
getDiplomaOrder();


function getStartHour() {
    var start_date_grad = document.getElementById('start_date');
    var start_time_grad = document.getElementById('start_time');
    var auditory_grad = document.getElementById('auditory');
    var start_date_nograd = document.getElementById('start_date_no');
    var start_time_nograd = document.getElementById('start_time_no');
    var auditory_nograd = document.getElementById('auditory_no');

    fetch('../../api?endpoint=get_graduation_time', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            if (!data.success) {
                // order_message.innerHTML = order_message.innerHTML.concat("Начален час: ").concat(data.message).concat('</br>');
                window.graduation_time = null;
            } else {
                start_date_grad.innerHTML = ("Дата: ").concat(data.graduation_time[0].graduation_date);
                start_time_grad.innerHTML = ("Начален час: ").concat(data.graduation_time[0].start_time);
                auditory_grad.innerHTML = ("Аудитория: ").concat(data.graduation_time[0].graduation_place);
                start_date_nograd.innerHTML = ("Дата: ").concat(data.graduation_time[0].graduation_date);
                start_time_nograd.innerHTML = ("Начален час: ").concat(data.graduation_time[0].start_time);
                auditory_nograd.innerHTML = ("Аудитория: ").concat(data.graduation_time[0].graduation_place);
                window.graduation_time = data.graduation_time[0];
                getStudentsOrder();
            }
        });
}

function getStudentsOrder() {
    fetch('../../api?endpoint=get_students_diploma_simplified', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) { }
            else {
                data.users.forEach(user => {
                    if (email === user['email']) {
                        document.getElementById('order_student').innerHTML = ("Вашият ред е: ").concat(user['num_order']).concat(", около ").concat(user['time_diploma']);
                        document.getElementById('color_message').innerHTML = ("Вашият цвят е: ").concat("<i class='fas fa-square' style='color:" + user.color + ";'></i>");

                    }
                })
            }
        });
}

function getDiplomaOrder() {
    fetch('../../api?endpoint=get_diploma_order', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
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
