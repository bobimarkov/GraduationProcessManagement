tokenRefresher();
getStudentData();
var email;
var fn;

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

function setAttendance(email, value) {
    if (value == 1) {
        updateGownAndHatValue(email);
    }
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
                getStudentsAttendanceInfo();
                getStudentsOrder();
            }
        });
}

function updateGownAndHatValue(email) {
    var requestData = {
        "email": email
    };
    fetch('../../api?endpoint=update_default_gown_hat', {
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
                getStudentData();
            }
        });
}

function requestDiplomaInAdvance(email, event, value) {
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


function requestGown(email, value) {
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
                        .then((data1) => {
                            if (!data1.success) {
                                // order_message.innerHTML = order_message.innerHTML.concat("Начален час: ").concat(data.message).concat('</br>');
                                window.graduation_time = null;
                            } else {
                                buildContentForGraduatingStudent(data.users[0], data1.graduation_time[0].deadline_gown, data1.graduation_time[0].deadline_hat, data1.graduation_time[0].deadline_attendance);
                            }
                        });
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
    document.querySelector(".messages_send_section").style.display = 'none';

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

function getStudentsAttendanceInfo() {
    fetch(`../../api?endpoint=get_student_attendance`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
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
                console.log(data.error);
            } else {
                getStudentData();
            }
        })
}


function buildContentForGraduatingStudent(user, deadline_gown, deadline_hat, deadline_attendance) {
    let today = new Date();
    document.querySelector(".non_graduating_warning_section").style.display = 'none';
    document.querySelector(".graduation_info_section").style.display = 'none';

    document.getElementById("name").innerText = 'Имена: ' + user.name;
    document.getElementById("email").innerText = 'Имейл: ' + user.email;
    document.getElementById("phone").innerText = 'Телефон: ' + user.phone;

    document.getElementById("degree").innerText = 'Степен: ' + (user.degree === 'Б' ? 'Бакалавър' : (user.degree === 'М' ? 'Магистър' : 'Доктор'));
    document.getElementById("major").innerText = 'Специалност: ' + user.major;
    document.getElementById("group").innerText = 'Група: ' + user.group;
    document.getElementById("fn").innerText = 'Факултетен номер: ' + user.student_fn;
    fn = user.student_fn;

    document.getElementById("has_right").innerHTML = 'Право на диплома: ' + (user.has_right === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("is_ready").innerHTML = 'Готова диплома: ' + (user.is_ready === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("grade").innerHTML = 'Оценка: ' + user.grade;

    document.getElementById("is_taken").innerText = 'Взета: ' + (user.is_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("take_in_advance_request").innerHTML = 'Заявена предварително: ' + (user.take_in_advance_request === 1 ? '<i class="far fa-check-square"></i>' : "Не");
    document.getElementById("taken_at_time").innerText = 'Дата/час на взимане: ' + (user.taken_at_time === null || user.taken_at_time === "" ? "-" : user.taken_at_time);
    document.getElementById("signature_moderator").innerHTML = 'Модератор за диплома: ' + (user.moderator_signature_email === null || user.attendance !== 1 ? '-' : user.moderator_signature_email);

    let messageGownAndHat = document.getElementById("message-bar-gown-hat-request");
    let gownRequestedMessage = document.getElementById("gown_request");
    let hatRequestedMessage = document.getElementById("hat_request");
    let gownRequestDiv = document.getElementById("request_gown_hat_content_1");
    let hatRequestDiv = document.getElementById("request_gown_hat_content_2");
    let hatGownRequest = document.getElementById("request_gown_hat_content");

    if (today <= new Date(deadline_attendance)) {
        let comment = document.getElementById("request_diploma_in_advance_form");
        let selectAttendance = document.getElementById("attendance_request_select");
        let speech_request_section = document.getElementById("speech_request_section");
        let speech_request = document.getElementById("speech_request");
        let speech_request_select = document.getElementById("speech_request_select");

        if (user.attendance === null) {
            if (user.speech_request === 1) {
                speech_request_section.style.display = "flex";
                speech_request.innerText = 'Поканен сте да изнесете реч по време на дипломирането. За да имате опция да потвърдите/откажете, моля първо отбележете ще присъствате ли на дипломирането!'
                speech_request_select.style.display = "none";
            }
            selectAttendance.value = -1;
            comment.style.display = "none";
            gownRequestDiv.style.display = "none";
            hatRequestDiv.style.display = "none";
            messageGownAndHat.style.display = "flex";
        }
        else {
            if (user.attendance === 0) {
                comment.style.display = "flex";
                selectAttendance.value = 0;
                hatGownRequest.style.display = "none";               
                messageGownAndHat.style.display = "flex";

                let errElem = document.getElementById('message-bar-diploma-request');
                errElem.classList.remove(['success']);
                errElem.classList.remove(['error']);
                errElem.innerHTML = "";

                if (user.speech_request === 1) {
                    speech_request_section.style.display = "flex";
                    speech_request.innerText = 'Поканен сте да изнесете реч по време на дипломирането. Щом няма да присъствате на дипломирането, то вие нямате право да потвърдите/откажете!'
                    speech_request_select.style.display = "none";
                }
            }
            else {
                comment.style.display = "none";
                selectAttendance.value = 1;
                messageGownAndHat.style.display = "none";
                hatGownRequest.style.display = "flex";

                if (user.speech_request === 1) {
                    speech_request_section.style.display = "flex";
                    speech_request.innerText = 'Поканен сте да изнесете реч по време на дипломирането. Моля, изберете от падащото меню дали приемате или отказвате поканата.'
                    speech_request_select.style.display = "flex";
                    if (user.speech_response !== null) {
                        user.speech_response === 1 ? speech_request_select.value = 1 : speech_request_select.value = 0;
                    }
                }
                if (today <= new Date(deadline_gown)) {
                    let gownRequest = document.getElementById("gown_request_select");
                    if (user.gown_requested === null) {
                        gownRequest.value = -1;
                    }
                    else if (user.gown_requested === 0) {
                        gownRequestedMessage.innerHTML = "Статус: Отказана";
                        gownRequest.value = 0;
                    }
                    else {
                        gownRequestedMessage.innerHTML = "Статус: Заявена";
                        gownRequest.value = 1;
                        document.getElementById("gown_taken").innerHTML = 'Взета: ' + (user.gown_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
                        document.getElementById("gown_taken_date").innerHTML = 'Дата/час: ' + (user.gown_taken_date === null || user.gown_taken_date === "" ? "-" : user.gown_taken_date);
                        document.getElementById("gown_returned").innerHTML = 'Върната: ' + (user.gown_returned === 1 ? '<i class="far fa-check-square"></i>' : "Не");
                        document.getElementById("gown_returned_date").innerHTML = 'Дата/час: ' + ((user.gown_returned_date === null || user.gown_returned_date === "") ? "-" : user.gown_returned_date);
                        document.getElementById("gown_moderator").innerHTML = 'Модератор за тога: ' + (user.moderator_gown_email === null || user.gown_requested !== 1 ? '-' : user.moderator_gown_email);
                    }
                }
                else {
                    gownRequestDiv.style.display = "none";
                    if (user.gown_requested === null) {
                        gownRequestedMessage.innerHTML = "Не сте подали заявка за тога!";
                    }
                    else if (user.gown_requested === 0) {
                        gownRequestedMessage.innerHTML = "Статус: Отказана";
                    }
                    else {
                        gownRequestedMessage.innerHTML = "Статус: Заявена";
                        document.getElementById("gown_moderator").innerHTML = 'Модератор за тога: ' + (user.moderator_gown_email === null || user.gown_requested !== 1 ? '-' : user.moderator_gown_email);
                    }
                }

                if (today <= new Date(deadline_hat)) {
                    let hatRequest = document.getElementById("hat_request_select");
                    if (user.hat_requested === null) {
                        hatRequest.value = -1;
                    }
                    else if (user.hat_requested === 0) {
                        hatRequestedMessage.innerHTML = "Статус: Отказана";
                        hatRequest.value = 0;
                    }
                    else {
                        hatRequestedMessage.innerHTML = "Статус: Заявена";
                        hatRequest.value = 1;
                        document.getElementById("hat_taken").innerHTML = 'Взета: ' + (user.hat_taken === 1 ? '<i class="far fa-check-square"></i>' : "Не");
                        document.getElementById("hat_taken_date").innerHTML = 'Дата/час: ' + (user.hat_taken_date === null || user.hat_taken_date === "" ? "-" : user.hat_taken_date);
                        document.getElementById("hat_moderator").innerHTML = 'Модератор за шапка: ' + (user.moderator_hat_email === null || user.hat_requested !== 1 ? '-' : user.moderator_hat_email);
                    }
                }
                else {
                    hatRequestDiv.style.display = "none";
                    if (user.hat_requested === null) {
                        hatRequestedMessage.innerHTML = "Не сте подали заявка за шапка!";
                    }
                    else if (user.hat_requested === 0) {
                        hatRequestedMessage.innerHTML = "Статус: Отказана";
                    }
                    else {
                        hatRequestedMessage.innerHTML = "Статус: Заявена";
                        document.getElementById("hat_moderator").innerHTML = 'Модератор за шапка: ' + (user.moderator_hat_email === null || user.hat_requested !== 1 ? '-' : user.moderator_hat_email);
                    }
                }
            }
        }
    }
    else {
        document.getElementById('attendance_section').style.display = "none";
        gownRequestDiv.style.display = "none";
        hatRequestDiv.style.display = "none";
        messageGownAndHat.style.display = "none";
        let messAtt = document.getElementById('messageAttendance');

        if (user.attendance === null) {
            messAtt.innerHTML = "Крайният срок изтече! Вие не сте заявили дали искате да присъствате на дипломирането!"
        }
        else if (user.attendance === 0) {
            messAtt.innerHTML = "Крайният срок изтече! Вие сте заявили, че няма да присъствате на дипломирането!"
        }
        else {
            messAtt.innerHTML = "Крайният срок изтече! Вие  сте заявили, че ще присъствате на дипломирането!"
        }

        if (user.gown_requested === null) {
            gownRequestedMessage.innerHTML = "Не сте подали заявка за тога!"
        }
        else if (user.gown_requested === 0) {
            gownRequestedMessage.innerHTML = "Статус: Отказана";
        }
        else {
            gownRequestedMessage.innerHTML = "Статус: Заявена";
            document.getElementById("gown_moderator").innerHTML = 'Модератор за тога: ' + (user.moderator_gown_email === null || user.gown_requested !== 1 ? '-' : user.moderator_gown_email);
        }

        if (user.hat_requested === null) {
            hatRequestedMessage.innerHTML = "Не сте подали заявка за шапка!";
        }
        else if (user.hat_requested === 0) {
            hatRequestedMessage.innerHTML = "Статус: Отказана";
        }
        else {
            hatRequestedMessage.innerHTML = "Статус: Заявена";
            document.getElementById("hat_moderator").innerHTML = 'Модератор за шапка: ' + (user.moderator_hat_email === null || user.hat_requested !== 1 ? '-' : user.moderator_hat_email);
        }
    }

    document.getElementById("photos_requested").checked = user.photos_requested === 1 ? true : false;

    document.getElementById("diploma_comment").value = user.diploma_comment === null || user.diploma_comment === "" ? "Няма коментари" : user.diploma_comment;
    getMessages();
    getStartHour();
    getDiplomaOrder();
}


function getStartHour() {
    let start_date_grad = document.getElementById('start_date');
    let start_time_grad = document.getElementById('start_time');
    let auditory_grad = document.getElementById('auditory');
    let start_date_nograd = document.getElementById('start_date_no');
    let start_time_nograd = document.getElementById('start_time_no');
    let auditory_nograd = document.getElementById('auditory_no');
    let deadline_gown = document.getElementById('deadline_gown');
    let deadline_hat = document.getElementById('deadline_hat');
    let deadline_attendance = document.getElementById('deadline_attendance');

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
                auditory_grad.innerHTML = ("Местоположение: ").concat(data.graduation_time[0].graduation_place);
                start_date_nograd.innerHTML = ("Дата: ").concat(data.graduation_time[0].graduation_date);
                start_time_nograd.innerHTML = ("Начален час: ").concat(data.graduation_time[0].start_time);
                auditory_nograd.innerHTML = ("Местоположение: ").concat(data.graduation_time[0].graduation_place);
                deadline_gown.innerHTML = ("Краен срок за заявка за тога: ").concat(data.graduation_time[0].deadline_gown);
                deadline_hat.innerHTML = ("Краен срок за заявка за шапка: ").concat(data.graduation_time[0].deadline_hat);
                deadline_attendance.innerHTML = ("Краен срок за заявка за присъствие: ").concat(data.graduation_time[0].deadline_attendance);

                getStudentsOrder();
                window.graduation_time = data.graduation_time[0];
            }
        });
}

function getStudentsOrder() {
    fetch('../../api?endpoint=get_students_diploma_simplified', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
                        if (user.attendance === 1) {
                            document.getElementById('order_student').innerHTML = ("Вашият ред е: ").concat(user['num_order']).concat(", около ").concat(user['time_diploma']);
                            document.getElementById('color_message').innerHTML = ("Вашият цвят е: ").concat("<i class='fas fa-square' style='color:" + user.color + ";'></i>");
                        }
                        else {
                            document.getElementById('order_list').innerHTML = "Вие не сте заявили присъствие и не сте включени в списъците!";
                            document.getElementById('order_student').style.display = "none";
                            document.getElementById('color_message').style.display = "none";
                        }
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


function getMessages() {
    let notifications = document.getElementById("no-notifications");
    fetch('../../api?endpoint=get_messages', {
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
            notifications.style.display = "block";
            while (notifications.firstChild) {
                notifications.removeChild(notifications.firstChild);
            }
            if (!data.success) {
                let text = document.createElement("p");
                text.innerHTML = data.message;
                notifications.appendChild(text);
            } else {
                for (let i = 0; i < data.order.length; i++) {
                    let div = document.createElement("div");
                    div.setAttribute("class", "received_messages");
                    let text = document.createElement("p");
                    text.innerHTML = `${i + 1}) От ${data.order[i].sender} - ${data.order[i].message}`;
                    div.appendChild(text);
                    notifications.appendChild(div);
                }
            }
        });
}

function sendMessage(fn, event) {
    event.preventDefault();
    let email = document.getElementById('textarea-email');
    let message = document.getElementById('message');
    let actions = {
        "fn": fn,
        "email": email.value,
        "message": message.value
    };
    fetch('../../api?endpoint=send_message_student', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(actions)
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
            let errElem = document.getElementById('message-bar-export-message');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                email.value = "";
                message.value = "";
            }
        });
}


