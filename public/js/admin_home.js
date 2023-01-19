showDiplomaSection();
getAllUsers();
getAllStudents();
getStudentsDiplomaInfo();
// Load google charts
google.charts.load('current', { 'packages': ['corechart'] });

let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    sessionStorage.clear();

    window.location.replace("../../");
});

function sessionLoader() {
    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("role") || (sessionStorage.getItem("role") && sessionStorage.getItem("role") !== "admin")) {
        sessionStorage.clear();

        window.location.replace("../../");
    }
}

sessionLoader();

/*---- GET_USERS  START ----*/
function getAllUsers() {
    fetch(`../../api?endpoint=get_users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                buildUsersTable(data);
            }
        })
}

function buildUsersTable(data) {
    var table = document.getElementById("users-table");
    let i = 1;
    let users = data.users;

    table.innerHTML = " <tr> <td>ID</td> <td>Име</td> <td>Имейл</td> <td>Телефон</td> <td>Роля</td> </tr>";

    for (const user of users) {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        let row_data = [
            user.id,
            user.name,
            user.email,
            user.phone,
            user.role == 'admin' ?
             '<i class="fas fa-user-lock user-role-icon"></i>' : user.role = 'moderator' ?
             '<i class="fas fa-user-cog user-role-icon"></i>' :
             '<i class="fas fa-user-graduate user-role-icon"></i>'
        ];
        const number_columns = row_data.length;
        for (var j = 0; j < number_columns; j++) {
            row.insertCell(j).innerHTML = row_data[j];
        }
        i++;
    }
}

/*---- GET_USERS  END ----*/

/*---- GET_STUDENTS  START ----*/
function getAllStudents() {
    fetch(`../../api?endpoint=get_students`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                buildStudentsTable(data);
                buildEditStudentsTable(data);
            }
        })
}

function buildEditStudentsTable(data) {
    var table = document.getElementById("edit-students-table");
    let i = 1;
    let users = data.users;

    table.innerHTML = "<tr><td>ID</td><td>Име</td><td>Имейл</td><td>Телефон</td><td>ФН</td></tr>";

    for (const user of users) {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        let row_data = [
            user.id,
            user.name,
            user.email,
            user.phone,
            user.fn
        ];
        const number_columns = row_data.length;
        for (var j = 0; j < number_columns; j++) {
            row.insertCell(j).innerHTML = row_data[j];
        }
        i++;
    }
}

function buildStudentsTable(data) {
    var table = document.getElementById("students-table");
    let i = 1;
    let users = data.users;
    table.innerHTML = "<tr> <td>ID</td> <td>Име</td> <td>Имейл</td> <td>Телефон</td> <td>ФН</td> <td>Степен</td> <td>Спец.</td> <td>Група</td> <td>Дипломиращ се</td> <td>Роля</td> </tr>";

    for (const user of users) {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        let row_data = [
            user.id,
            user.name,
            user.email,
            user.phone,
            user.fn,
            user.degree,
            user.major,
            user.group,
            user.has_diploma_right == 0 ? "Не" : "Да",
            user.role == 'admin' ?
             '<i class="fas fa-user-lock user-role-icon"></i>' : user.role = 'moderator' ?
             '<i class="fas fa-user-cog user-role-icon"></i>' :
             '<i class="fas fa-user-graduate user-role-icon"></i>'
        ];
        const number_columns = row_data.length;
        for (var j = 0; j < number_columns; j++) {
            row.insertCell(j).innerHTML = row_data[j];
        }
        i++;
    }
}
/*---- GET_STUDENTS  END ----*/

/*---- GET_STUDENTS_DIPLOMA  START ----*/
function getStudentsDiplomaInfo() {
    fetch(`../../api?endpoint=get_students_diploma`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                getColorsConfig(data.users);
            }
        })
}

function getColorsConfig(users) {
    fetch('../../api?endpoint=get_graduation_colors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {
                buildStudentsDiplomaTable(users, null);
            } else {
                var colors_config = data.graduation_colors;
                buildStudentsDiplomaTable(users, colors_config);
            }
        });
}

function buildStudentsDiplomaTable(users, colors_config) {
    var table = document.getElementById("diploma-table");
    
    table.innerHTML = "<tr> <td>№</td> <td>ФН</td> <td>Име</td> <td>Степен</td> <td>Спец.</td> <td>Група</td> <td>Успех</td> <td>Присъствие</td> <td>Има право</td> <td>Готова</td> <td>Взета</td> <td>Заявка взимане предв.</td> <td>Коментар (студент)</td> <td>Взета предв.</td> <td>Дата/час</td> <td>Коментар (администр.)</td> <td>Покана реч</td> <td>Отговор</td> <td>Снимки</td> <td>Заявена тога</td> <td>Взета</td> <td>Дата/час</td> <td>Върната</td> <td>Дата/час</td> <td>Заявена шапка</td> <td>Взета</td> <td>Дата/час</td> <td>Върната</td> <td>Дата/час</td></tr>";
    let i = 1;

    for (const user of users) {
        if (user.grade >= 3) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            // row.setAttribute("onmousedown", "toggleBorderColor(this)")
            var row_data = [
                i,
                user.student_fn,
                user.name.concat(" " + getColor(i, users.length, colors_config)),
                user.degree,
                user.major,
                user.group,
                user.grade,
                user.attendance == 0 ? 'Не' : 'Да',
                user.has_right == 0 ? 'Не' : 'Да',
                user.is_ready == 0 ? 'Не' : 'Да',
                user.is_taken == 0 ? 'Не' : 'Да',
                user.take_in_advance_request == 0 ? 'Не' : 'Да',
                user.take_in_advance_request_comment == null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.take_in_advance_request_comment}</span></i>`,
                user.is_taken_in_advance == 0 ? 'Не' : 'Да',
                user.taken_at_time,
                user.diploma_comment == null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.diploma_comment}</span></i>`,
                user.speech_request == 0 ? 'Не' : 'Да',
                user.speech_response == null ? '-' : user.speech_response,
                user.photos_requested == 0 ? 'Не' : 'Да',
                user.grown_requested == 0 ? 'Не' : 'Да',
                user.grown_taken == 0 ? 'Не' : 'Да',
                user.grown_taken_date,
                user.grown_returned == 0 ? 'Не' : 'Да',
                user.grown_returned_date,
                user.hat_requested == 0 ? 'Не' : 'Да',
                user.hat_taken == 0 ? 'Не' : 'Да',
                user.hat_taken_date,
                user.hat_returned == 0 ? 'Не' : 'Да',
                user.hat_returned_date,

            ];
            const number_columns = row_data.length;
            for (var j = 0; j < number_columns; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
}


function getColor(i, n, colors_config) {
    var part = Math.round((colors_config[0].color_interval / 100 * n));
    var current_part = part;
    var color_index = 1;

    while (current_part < n + part) {
        if (i <= current_part) {
            var color = "color".concat(color_index);
            return extractColor(colors_config[0][`${color}`]);
        }
        color_index++;
        current_part += part;
    }
    return extractColor("silver");
}

function extractColor(color_code) {
    return "<i class='fas fa-square' style='color:" + color_code + ";'></i>";
}

function toggleBorderColor(c) {
    var fn = c.cells[1].innerHTML;
    var fnTextArea = document.getElementById('dashboard_textarea');
    var currentFns = fnTextArea.value;

    if (c.style.backgroundColor == "slategray") {
        c.style.backgroundColor = "transparent";
        c.style.color = "black";
        currentFns = currentFns.replace(`${fn},`, "");
        fnTextArea.value = currentFns
    } else {
        c.style.backgroundColor = "slategray";
        c.style.color = "snow";
        currentFns = currentFns.concat(`${fn},`);
        fnTextArea.value = currentFns
    }
}
/*---- GET_STUDENTS_DIPLOMA  END ----*/

/*---- SWITCH_SECTIONS  START ----*/
function showUsers() {

    showGivenSection("users_section");
    activeHeader("users_header");

    var errElem = document.getElementById('message-bar-users');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";
    document.getElementById("userTextarea").value = "";
}

function showStudents() {

    showGivenSection("students_section");
    activeHeader("students_header");
    getAllStudents();
    var errElem = document.getElementById('message-bar-students');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";
    document.getElementById("studentTextarea").value = "";
}

function showEditSection() {

    showGivenSection("edit_section");
    activeHeader("edit_header");
    getAllUsers();

}


function showAnalyticsSection() {

    showGivenSection("analytic_section");
    activeHeader("analytic_header");

    fetch(`../../api?endpoint=get_students_diploma`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
        .then(response => response.json())
        .then((data) => {
            if (data.error) {
                // display error to user 
                console.log(data.error);
            } else {

                //build piecharts from data
                let studentMajorData = dataMajorToArray(data);
                let studentGradeData = dataGradesToArray(data);
                let studentDegreeData = dataDegreeToArray(data);
                let studentHasRightData = dataHasRightToArray(data);
                google.charts.setOnLoadCallback(drawChart(studentMajorData, "analytics1", "Брой стундети с дадена специалност"));
                google.charts.setOnLoadCallback(drawChart(studentGradeData, "analytics2", "Брой студенти с дадени оценки"));
                google.charts.setOnLoadCallback(drawChart(studentDegreeData, "analytics3", "Брой студенти с дадени степени на образование"));
                google.charts.setOnLoadCallback(drawChart(studentHasRightData, "analytics4", "Студенти имащи право на диплома"));
            }
        })



}


function showDiplomaSection() {

    showGivenSection("diploma_section");
    activeHeader("diploma_header");
    getStudentsDiplomaInfo();
    var errElem = document.getElementById('message-bar-diploma');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";
    document.getElementById("dashboard_textarea").value = "";
    document.getElementById("dashboard_action").selectedIndex = null;

    document.getElementById("textarea_after_select").value = "";
    document.getElementById("textarea_after_select").style.display = 'none';
    document.getElementById("boolean_select_after_select").selectedIndex = null;
    document.getElementById("boolean_select_after_select").style.display = 'none';

    showDiplomaOrderMessage();
}

//make section visible, giving only its name
function showGivenSection(sectionToBeDisplayed) {

    //get all sections
    var sections = [
        'users_section',
        'students_section',
        'edit_section',
        'diploma_section',
        'diploma_order_section',
        'analytic_section'];

    sections = sections.map(x => document.getElementById(x));


    //iterate all sections
    //make all style.display = "none"
    //make the element we want style.display=grid
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';

        if (sections[i].id.localeCompare(sectionToBeDisplayed) == 0) {

            sections[i].style.display = 'grid';
        }

    }


    //the corner cases for flex and make 2 grids at the same time
    if (sectionToBeDisplayed.localeCompare(sections[5].id) == 0) {
        sections[5].style.display = 'flex';
    } else if (sectionToBeDisplayed.localeCompare(sections[3].id) == 0) {
        sections[3].style.display = 'grid';
        sections[4].style.display = 'grid';
    }

}

/*---- SWITCH_SECTIONS  END ----*/
//give class "active_header" to only element with elementid
function activeHeader(elementId) {
    var headers = [
        'users_header',
        'edit_header',
        'students_header',
        'diploma_header',
        'analytic_header'];

    headers = headers.map(x => document.getElementById(x));

    for (let i = 0; i < headers.length; i++) {
        if (headers[i].id.localeCompare(elementId) == 0) {
            headers[i].classList.add(['active_header']);
        } else {
            headers[i].classList.remove(['active_header']);
        }
    }

}

//start of converting differnet data to array
function dataHasRightToArray(data) {
    const a = [["Имащи право на диплома", "Брой студенти"], ["Имат право", 0], ["Нямат право", 0]];

    let rows = data.users;
    rows.forEach(row_data => {
        switch (row_data.has_right) {
            case 1:
                a[1][1]++;
                break;
            case 0:
                a[2][1]++;
                break;
            default:
                break;
        }
    });
    return a;

}

function dataDegreeToArray(data) {
    const a = [["Степен на образование", "Брой студенти"], ["Бакалавър", 0], ["Магистър", 0],["Доктор", 0]];

    let rows = data.users;
    rows.forEach(row_data => {
        switch (row_data.degree) {
            case 'Б':
                a[1][1]++;
                break;
            case 'М':
                a[2][1]++;
                break;
            case 'Д':
                a[3][1]++;
                break;
            default:
                break;
        }
    });
    return a;
}

function dataGradesToArray(data) {
    const a = [["Оценка", "Брой студенти с такава оценка"], ["[2-3)", 0], ["[3,4)", 0], ["[4,5)", 0], ["[5,6]", 0]];
    let rows = data.users;
    rows.forEach(row_data => {
        if (row_data.grade >= 2 && row_data.grade < 3) {
            a[1][1]++;
        } else if (row_data.grade >= 3 && row_data.grade < 4) {
            a[2][1]++;
        } else if (row_data.grade >= 4 && row_data.grade < 5) {
            a[3][1]++;
        } else {
            a[4][1]++;
        }
    });
    return a;
}


function dataMajorToArray(data) {

    const a = [["Специалност", "Брой студенти"], ["СИ", 0], ["КН", 0], ["ИС", 0], ["И", 0], ["М", 0], ["С", 0], ["х", 0]];

    let rows = data.users;
    rows.forEach(row_data => {
        switch (row_data.major) {
            case 'СИ':
                a[1][1]++;
                break;
            case 'КН':
                a[2][1]++;
                break;
            case 'ИС':
                a[3][1]++;
                break;
            case 'И':
                a[4][1]++;
                break;
            case 'М':
                a[5][1]++;
                break;
            case 'С':
                a[6][1]++;
                break;
            default:
                a[7][1]++;
                break;
        }
    });
    return a;


}
//end of converting different data to array



// Draw the chart and set the chart values
function drawChart(majorData, id, titleMessage) {

    var data = google.visualization.arrayToDataTable(majorData);

    // Optional; add a title and set the width and height of the chart
    var options = { 'title': titleMessage, 'width': 550, 'height': 400 };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.PieChart(document.getElementById(id));
    chart.draw(data, options);
}

function showDiplomaOrderMessage() {
    var order_message = document.getElementById('message-bar-diploma-order');
    order_message.classList.remove(['success']);
    order_message.classList.remove(['error']);
    order_message.classList.add(['info']);
    order_message.innerHTML = "";

    fetch('../../api?endpoint=get_diploma_order', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-diploma');
            if (!data.success) {
                order_message.innerHTML = data.message;
            } else {
                displayOrderMessage(data.order[0]);
            }
        });
}

function displayOrderMessage(data) {
    var text = "Текуща подредба: ";
    for (const [key, value] of Object.entries(data)) {
        switch (value) {
            case "fn": text = text.concat("ФН, ");
                break;
            case "name": text = text.concat("Име, ");
                break;
            case "degree": text = text.concat("Степен, ");
                break;
            case "major": text = text.concat("Специалност, ");
                break;
            case "group": text = text.concat("Група, ");
                break;
            case "grade": text = text.concat("Успех, ");
                break;
            default:
                break;
        }
    }
    text = text.slice(0, -1);
    text = text.slice(0, -1);
    document.getElementById('message-bar-diploma-order').innerText = text;

}

function showDashboardAdditionalInputElement(value) {
    document.getElementById("textarea_after_select").value = "";
    document.getElementById("boolean_select_after_select").selectedIndex = null;

    if (value == 5) {
        document.getElementById('boolean_select_after_select').style.display = 'none';
        document.getElementById('textarea_after_select').style.display = 'block';
    } else {
        document.getElementById('boolean_select_after_select').style.display = 'block';
        document.getElementById('textarea_after_select').style.display = 'none';
    }
}

function submitUserHelper(bodyData) {
    fetch('../../api?endpoint=add_users', {
        method: 'POST',
        body: bodyData
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-users');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                document.getElementById("userTextarea").value = "";
                getAllUsers();
            }
        });
}

/*function submitUsers(event) {
    event.preventDefault;
    var form = document.getElementById('add_users_form');
    var usersData = form.userTextarea.value;

    fetch('../../api?endpoint=add_users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(usersData)
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-users');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                document.getElementById("userTextarea").value = "";
                getAllUsers();
            }
        });
}*/

function submitUsers(event) {
    event.preventDefault();
    var form = document.getElementById('add_users_form');
    var usersData = form.userTextarea.value;

    submitUserHelper(JSON.stringify(usersData));

}

function submitUsersFromFile(event) {
    event.preventDefault();
    const files = document.getElementById('fileUsers').files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i]);
    }
    submitUserHelper(formData);
    document.getElementById('fileUsers').value = "";
}

function editStudent(event) {

    event.preventDefault;
    var form = document.getElementById("edit_students_form");
    var usersData = form.editStudentTextarea.value;

    fetch('../../api?endpoint=edit_students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(usersData)
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-edit-students');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                document.getElementById("userTextarea").value = "";
            }
        }
        );
    form.editStudentTextarea.valuе = null;
}

function submitStudentHelper(bodyData) {
    fetch('../../api?endpoint=add_students', {
        method: 'POST',
        body: bodyData

    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-students');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                document.getElementById("studentTextarea").value = "";
                showStudents();
            }
        });
}


function submitStudents(event) {
    event.preventDefault();
    var form = document.getElementById('add_students_form');
    var studentsData = form.studentTextarea.value;

    submitStudentHelper(JSON.stringify(studentsData));

}

function submitStudentsFromFile(event) {
    event.preventDefault();
    const files = document.getElementById('fileStudent').files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i]);
    }
    submitStudentHelper(formData);
<<<<<<< HEAD
    document.getElementById('fileStudent').value = "";
=======
    document.getElementById('file').value = "";    

>>>>>>> c844c4ab5d032de966e3a226155c9a7516f7e5fd
}

function submitAction(event) {
    event.preventDefault();
    var form = document.getElementById('dashboard');
    var fns = form.dashboard_textarea.value;
    var action_option = form.dashboard_action.value;
    var action_content = action_option == 5 ? form.textarea_after_select.value : form.boolean_select_after_select.value

    var action = {
        "fns": fns,
        "action_option": action_option,
        "action_content": action_content
    };

    fetch('../../api?endpoint=save_action', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(action)
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-diploma');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                document.getElementById("dashboard_textarea").value = "";
                document.getElementById("dashboard_action").selectedIndex = null;
                document.getElementById("textarea_after_select").value = "";
                document.getElementById("textarea_after_select").style.display = 'none';
                document.getElementById("boolean_select_after_select").selectedIndex = null;
                document.getElementById("boolean_select_after_select").style.display = 'none';
            }
        });
}

function removeValueFromOtherLists(selectObject) {
    var value = selectObject.value;

    var selectobject1 = document.getElementById("diploma_order_1");
    var selectobject2 = document.getElementById("diploma_order_2");
    var selectobject3 = document.getElementById("diploma_order_3");
    var selectobject4 = document.getElementById("diploma_order_4");
    var selectobject5 = document.getElementById("diploma_order_5");
    var selectobject6 = document.getElementById("diploma_order_6");
    if (!selectobject1.isEqualNode(selectObject)) {
        for (var i = 0; i < selectobject1.length; i++) {
            if (selectobject1.options[i].value == value)
                selectobject1.remove(i);
        }
    }
    if (!selectobject2.isEqualNode(selectObject)) {
        for (var i = 0; i < selectobject2.length; i++) {
            if (selectobject2.options[i].value == value)
                selectobject2.remove(i);
        }
    }
    if (!selectobject3.isEqualNode(selectObject)) {
        for (var i = 0; i < selectobject3.length; i++) {
            if (selectobject3.options[i].value == value)
                selectobject3.remove(i);
        }
    }
    if (!selectobject4.isEqualNode(selectObject)) {
        for (var i = 0; i < selectobject4.length; i++) {
            if (selectobject4.options[i].value == value)
                selectobject4.remove(i);
        }
    }
    if (!selectobject5.isEqualNode(selectObject)) {
        for (var i = 0; i < selectobject5.length; i++) {
            if (selectobject5.options[i].value == value)
                selectobject5.remove(i);
        }
    }
    if (!selectobject6.isEqualNode(selectObject)) {
        for (var i = 0; i < selectobject6.length; i++) {
            if (selectobject6.options[i].value == value)
                selectobject6.remove(i);
        }
    }
}

function submitDiplomaOrder(event) {
    event.preventDefault();
    var form = document.getElementById('diploma_order_form');
    var v1 = form.diploma_order_1.value;
    var v2 = form.diploma_order_2.value;
    var v3 = form.diploma_order_3.value;
    var v4 = form.diploma_order_4.value;
    var v5 = form.diploma_order_5.value;
    var v6 = form.diploma_order_6.value;

    var values = {
        "v1": v1,
        "v2": v2,
        "v3": v3,
        "v4": v4,
        "v5": v5,
        "v6": v6,
    };

    fetch('../../api?endpoint=submit_diploma_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => response.json())
        .then((data) => {
            var errElem = document.getElementById('message-bar-diploma-order');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.remove(['info']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.remove(['info']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
            }
            getStudentsDiplomaInfo();
        });
};


function filterActivate() {
    var inputFilterName = document.getElementById("searchByName");
    var inputFilterFn = document.getElementById("searchByFn");
    const inputDataName = inputFilterName.value;
    const inputDataFn = inputFilterFn.value;
    var i = 0;
    var tableData = document.getElementById("diploma-table").querySelectorAll("tr");
    tableData.forEach((element) => {
        var toAddHidden = false;
        if (i != 0) {
            //sort by name - check if the data in <td> includes inputDataName
            if (!element.querySelectorAll("td")[2].innerHTML.includes(inputDataName)) {
                toAddHidden = true;
            }
            //sort by fn - check if the data in <td> includes inputDataFn
            if (!element.querySelectorAll("td")[1].innerHTML.includes(inputDataFn)) {
                toAddHidden = true;
            }
            element.toggleAttribute("hidden", toAddHidden);
        } else {
            i++;
        }

    })
}


function exportStudents() {
    var allStudentsFromTable = [];
    myTable = document.getElementById("students-table");
    myTableBody = myTable.getElementsByTagName("tbody")[0];
    myRow = myTableBody.getElementsByTagName("tr");
    for (let j = 1; j < myRow.length; j++) {
        myCell = myRow[j].getElementsByTagName("td");
        var students = [];
        for (let i = 0; i < myCell.length - 1; i++) {
            students.push(myCell[i].innerHTML);
        }
        allStudentsFromTable.push(students);
    }
}

function downloadExportedStudents(event) {
    event.preventDefault();
    let form = document.getElementById("export_files_student");
    let fileFormat = form.format.value;

    values = { "format": fileFormat }
    if (fileFormat !== 'pdf' && fileFormat !== 'no') {
        fetch('../../api?endpoint=export_students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => response.text())
            .then(response => {

                const blob = new Blob([response], { type: "application/octet-stream" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "data.".concat(fileFormat);
                link.click();
                link.remove();
            });
    }
    else if (fileFormat === 'pdf') {
        fetch('../../api?endpoint=export_students', {
            method: 'POST',
            body: JSON.stringify(values)
        })
            .then(response => response.blob())
            .then(blob => {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "students.pdf";

<<<<<<< HEAD
                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
            });
    }
}

function downloadExportedUsers(event) {
    event.preventDefault();
    let form = document.getElementById("export_files_users");
    let fileFormat = form.format.value;

    values = { "format": fileFormat }
    if (fileFormat !== 'pdf' && fileFormat !== 'no') {
        fetch('../../api?endpoint=export_users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => response.text())
            .then(response => {

                const blob = new Blob([response], { type: "application/octet-stream" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "data.".concat(fileFormat);
                link.click();
                link.remove();
            });
    }
    else if (fileFormat === 'pdf') {
        fetch('../../api?endpoint=export_users', {
            method: 'POST',
            body: JSON.stringify(values)
        })
            .then(response => response.blob())
            .then(blob => {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = "users.pdf";

                document.body.appendChild(link);
                link.click();

                document.body.removeChild(link);
                window.URL.revokeObjectURL(link.href);
            });
    }
}
=======
            const blob = new Blob([response], { type: "application/octet-stream" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "data.".concat(fileFormat);
            link.click();
            link.remove();
    });
}
>>>>>>> c844c4ab5d032de966e3a226155c9a7516f7e5fd
