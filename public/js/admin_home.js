tokenRefresher();
showDiplomaSection();
getAllNonStudentUsers();
getAllStudents();
getAllUsers();
getStudentsDiplomaInfo();
getGraduationInfo();
makeArchive();
getClasses();


let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    localStorage.removeItem('token')

    window.location.replace("../../")
});


function generateTableHeaderRow(columnNames, functionName, header_table_id, table_id) {
    var headerCells =
        functionName === undefined ?
            columnNames.reduce(
                (accumulator, currentValue) => accumulator.concat(`<td>${currentValue}</td>`),
                ''
            )
            :
            table_id === undefined ?
                columnNames.reduce(
                    (accumulator, currentValue, currentIndex) => accumulator.concat(`<td onclick=${functionName}(${currentIndex})>${currentValue}</td>`),
                    ''
                )
                :
                columnNames.reduce(
                    (accumulator, currentValue, currentIndex) => accumulator.concat(`<td onclick=${functionName}(${currentIndex},"${table_id}")>${currentValue}</td>`),
                    ''
                )

    return header_table_id === undefined ? `<tr>${headerCells}</tr>` : `<tr id=${header_table_id}>${headerCells}</tr>`;
}


var cPrev = -1;
function sortBy(c, id) {
    let rows = document.getElementById(id).rows.length;
    let columns = document.getElementById(id).rows[0].cells.length;
    let arrTable = new Array(rows);
    for (let i = 0; i < arrTable.length; i++) {
        arrTable[i] = new Array(columns);
    }
    for (let row = 0; row < rows; row++) {
        for (col = 0; col < columns; col++) {
            arrTable[row][col] = document.getElementById(id).rows[row].cells[col].innerHTML;
        }
    }
    let firstLine = arrTable.shift();

    if (c !== cPrev) {
        arrTable.sort(
            function (a, b) {
                if (a[c] === b[c]) {
                    return 0;
                } else {
                    return (a[c] < b[c]) ? -1 : 1;
                }
            }
        );
    } else {
        arrTable.reverse();
    }
    cPrev = c;
    arrTable.unshift(firstLine);
    for (let row = 0; row < rows; row++) {
        for (col = 0; col < columns; col++) {
            document.getElementById(id).rows[row].cells[col].innerHTML = arrTable[row][col];
        }
    }
}


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

/*---- GET_USERS  START ----*/
function getAllNonStudentUsers() {
    fetch(`../../api?endpoint=get_users`, {
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
                buildUsersTable(data);
            }
        })
}

function getAllUsers() {
    fetch(`../../api?endpoint=get_all_users`, {
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
                buildEditAllUsersTable(data);
            }
        })
}

function buildUsersTable(data) {
    var table = document.getElementById("users-table");
    let i = 1;
    let users = data.users;

    var columnNames = ["Име", "Имейл", "Телефон", "Роля"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header-table-users', 'users-table');

    for (const user of users) {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        let row_data = [
            user.name,
            user.email,
            user.phone,
            user.role == 'admin' ? '<i class="fas fa-user-lock user-role-icon"></i>' :
                user.role == 'moderator-hat' ? '<i class="fas fa-user-cog user-role-icon"></i>     <i class="fas fa-graduation-cap user-role-icon"></i>' :
                    user.role == 'moderator-gown' ? '<i class="fas fa-user-cog user-role-icon"></i>     <i class="fas fa-tshirt user-role-icon"></i>' :
                        user.role == 'moderator-signature' ? '<i class="fas fa-user-cog user-role-icon"></i>     <i class="fas fa-pen user-role-icon"></i>' :
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
                buildStudentsTable(data);
            }
        })
}

function buildEditAllUsersTable(data) {
    var table = document.getElementById("edit-users-table");
    let i = 1;
    const users = data.users;

    const columnNames = ["ID", "Име", "Имейл", "Телефон", "Роля"]
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortByEdit', 'header-table-edit', 'edit-users-table');

    for (const user of users) {
        var row = table.insertRow(i);
        row.id = 'user' + user.id;
        let row_data = [
            user.id,
            user.name,
            user.email,
            user.phone,
            user.role == 'admin' ? '<i class="fas fa-user-lock user-role-icon"></i>' :
                user.role == 'moderator-hat' ? '<i class="fas fa-user-cog user-role-icon"></i>     <i class="fas fa-graduation-cap user-role-icon"></i>' :
                    user.role == 'moderator-gown' ? '<i class="fas fa-user-cog user-role-icon"></i>     <i class="fas fa-tshirt user-role-icon"></i>' :
                        user.role == 'moderator-signature' ? '<i class="fas fa-user-cog user-role-icon"></i>     <i class="fas fa-pen user-role-icon"></i>' :
                            '<i class="fas fa-user-graduate user-role-icon"></i>'
        ];
        const number_columns = row_data.length;
        for (var j = 0; j < number_columns; j++) {
            row.insertCell(j).innerHTML = row_data[j];
        }
        row.addEventListener("click", (e) => {
            let edit_modal = document.getElementById("edit_user_modal");
            let message_bar_modal = document.getElementById("message-bar-modal-edit-users");
            let input_name = document.getElementById("user_name");
            let input_email = document.getElementById("user_email");
            let input_phone = document.getElementById("user_phone");
            let input_role = document.getElementById("user_role");

            edit_modal.setAttribute("active", "");
            edit_modal.setAttribute("user_id", user.id);
            message_bar_modal.style.display = "none";

            input_name.value = user.name;
            input_email.value = user.email;
            input_phone.value = user.phone;
            input_role.value = user.role;
        })
        row.style.cursor = "pointer";
        i++;
    }
}

function buildStudentsTable(data) {
    var table = document.getElementById("students-table");
    let i = 1;
    let users = data.users;
    var columnNames = ["Име", "Имейл", "Телефон", "ФН", "Степен", "Спец.", "Група", "Дипломиращ се", "Роля"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header-table-students', 'students-table');

    for (const user of users) {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        let row_data = [
            user.name,
            user.email,
            user.phone,
            user.fn,
            user.degree,
            user.major,
            user.group,
            user.has_diploma_right == 0 ? "Не" : "Да",
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
                buildStudentsDiplomaTable(data.users);
            }
        })
}

function buildStudentsDiplomaTable(users) {
    var table = document.getElementById("diploma-table");

    var columnNames = [
        "ФН", "Име", "Цвят", "Ред на връчване", "Час на връчване", "Степен", "Спец.", "Група", "Успех",
        "Присъствие", "Има право", "Модератор за диплома", "Готова диплома", "Взета", "Заявка взимане предв.", "Коментар (студент)",
        "Взета предв.", "Дата/час", "Коментар (администр.)", "Покана реч", "Отговор", "Снимки", "Модератор за тога", "Заявена тога",
        "Взета", "Дата/час", "Върната", "Дата/час", "Модератор за шапка", "Заявена шапка", "Взета", "Дата/час"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header-table-diploma', 'diploma-table');
    let i = 1;

    for (const user of users) {
        if (user.grade >= 3) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let response;
            switch (user.speech_response) {
                case null: response = '-'; break;
                case 0: response = 'Отказва'; break;
                case 1: response = 'Приема'; break;
            }
            var row_data = [
                user.student_fn,
                user.name,
                user.color = "<i class='fas fa-square' style='color:" + user.color + ";'></i>",
                user.num_order,
                user.time_diploma,
                user.degree,
                user.major,
                user.group,
                user.grade,
                user.attendance == 0 ? 'Не' : 'Да',
                user.has_right == 0 ? 'Не' : 'Да',
                user.moderator_signature_email === null ? 'не е избран' : user.moderator_signature_email,
                user.is_ready == 0 ? 'Не' : 'Да',
                user.is_taken == 0 ? 'Не' : 'Да',
                user.take_in_advance_request == 0 ? 'Не' : 'Да',
                user.take_in_advance_request_comment == null ? "<i class='far fa-comment-alt comment-icon'><span class='studentComm'>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span class='studentComm'>${user.take_in_advance_request_comment}</span></i>`,
                user.is_taken_in_advance == 0 ? 'Не' : 'Да',
                user.taken_at_time,
                user.diploma_comment == null ? "<i class='far fa-comment-alt comment-icon'><span class='userComm'>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span class='userComm'>${user.diploma_comment}</span></i>`,
                user.speech_request = (user.speech_request == 1) ? 'Да' : 'Не',
                user.speech_response = response,
                user.photos_requested == 0 ? 'Не' : 'Да',
                user.moderator_gown_email === null ? 'не е избран' : user.moderator_gown_email,
                //gown_requested
                user.gown_requested == null ? '' : user.gown_requested == 0 ? 'Не' : 'Да',
                //gown_taken
                user.gown_requested != 1 ? '' : user.gown_taken == 0 || user.gown_taken == null ? 'Не' : 'Да',
                user.gown_taken_date,
                //gown_returned
                user.gown_taken != 1 ? '' : user.gown_returned == 0 || user.gown_returned == null ? 'Не' : 'Да',
                user.gown_returned_date,
                user.moderator_hat_email === null ? 'не е избран' : user.moderator_hat_email,
                //hat_requested
                user.hat_requested == null ? '' : user.hat_requested == 0 ? 'Не' : 'Да',
                //hat_taken
                user.hat_requested != 1 ? '' : user.hat_taken == 0 || user.hat_taken == null ? 'Не' : 'Да',
                user.hat_taken_date,
            ];
            const number_columns = row_data.length;
            for (var j = 0; j < number_columns; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
}

/*---- GET_STUDENTS_DIPLOMA  END ----*/

/*---- SWITCH_SECTIONS  START ----*/
function showUsers() {
    tokenRefresher();
    showGivenSection("users_section");
    activeHeader("users_header");

    let errElem = document.getElementById('message-bar-users');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";
    document.getElementById("userTextarea").value = "";
}

function showStudents() {
    tokenRefresher();
    showGivenSection("students_section");
    activeHeader("students_header");

    let errElem = document.getElementById('message-bar-students');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";
    document.getElementById("studentTextarea").value = "";
}

function showEditSection() {
    tokenRefresher();
    showGivenSection("edit_section");
    activeHeader("edit_header");
    getAllNonStudentUsers();
    getAllUsers();
    getAllStudents();
}

function showMessagesSection() {
    tokenRefresher();
    showGivenSection("messages_send_section");
    activeHeader("messages_header");
    getMessages();

    let errElem = document.getElementById('message-bar-export-message');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";
}

function showSettingsSection() {
    tokenRefresher();
    showGivenSection("settings_section");
    activeHeader("settings_header");
    getGraduationInfo();

    let errElem = document.getElementById('message-add-graduation-info');
    errElem.classList.remove(['success']);
    errElem.classList.remove(['error']);
    errElem.innerHTML = "";

}

function showAnalyticsSection() {
    let text = document.getElementById('analytic_text');
    fetch(`../../api?endpoint=get_students_diploma_simplified`, {
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
            tokenRefresher();
            showGivenSection("analytic_section");
            activeHeader("analytic_header");
            if (!data.success) {
                text.innerHTML = '<i class="fa fa-pie-chart"></i> В момента няма данни за дипломиращи се студенти и няма направена статистика! <br> Когато добавите данни, то ще получите статистика за тях!';
                document.getElementById('analytic_section').style = 'height: 1em !important';
                text.style = "text-align : center";
                //console.log(data.error);
            } else {
                // Load google charts
                google.charts.load('current', { 'packages': ['corechart'] });
                text.innerHTML = '<i class="fa fa-pie-chart"></i> Статистиката е на база дипломиращи се студенти!';
                text.style = "text-align : center; height : 1em";
                document.getElementById('analytics1').style = 'margin-top: 1em';
                showAnalyticsSectionHelper();
            }
        })
}

function showAnalyticsSectionHelper() {
    fetch(`../../api?endpoint=statistics`, {
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
                // display error to user 
                console.log(data.error);
            } else {
                //build piecharts from data
                let studentMajorData = dataMajorToArray(data);
                let studentGradeData = dataGradesToArray(data);
                let studentDegreeData = dataDegreeToArray(data);
                let studentHasRightData = dataHasRightToArray(data);
                google.charts.setOnLoadCallback(drawChart(studentMajorData, "analytics1", "рой дипломиращи се студенти от дадена специалност със степен 'Бакалавър'"));
                google.charts.setOnLoadCallback(drawChart(studentGradeData, "analytics2", "Брой дипломиращи се студенти с дадени оценки"));
                google.charts.setOnLoadCallback(drawChart(studentDegreeData, "analytics3", "Брой дипломиращи се студенти с дадени степени на образование"));
                google.charts.setOnLoadCallback(drawChart(studentHasRightData, "analytics4", "Студенти, имащи право на диплома"));
            }
        })
}


function showDiplomaSection() {
    tokenRefresher();
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
        'excellent_order',
        'diploma_order_section',
        'distribute_moderators',
        'analytic_section',
        'messages_send_section',
        'messages_receive_section',
        'settings_section',
        'settings_date_section',
        'settings_archive_section'
    ];

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
    if (sectionToBeDisplayed.localeCompare(sections[7].id) == 0) {
        sections[7].style.display = 'flex';
    } else if (sectionToBeDisplayed.localeCompare(sections[3].id) == 0) {
        sections[3].style.display = 'grid';
        sections[4].style.display = 'grid';
        sections[5].style.display = 'grid';
        sections[6].style.display = 'grid';
    }
    else if (sectionToBeDisplayed.localeCompare(sections[8].id) == 0) {
        sections[8].style.display = 'grid';
        sections[9].style.display = 'grid';
    }
    else if (sectionToBeDisplayed.localeCompare(sections[10].id) == 0) {
        sections[10].style.display = 'grid';
        sections[11].style.display = 'grid';
        sections[12].style.display = 'grid';
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
        'analytic_header',
        'messages_header',
        'settings_header'];

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
    const a = [["Степен на образование", "Брой студенти"], ["Бакалавър", 0], ["Магистър", 0], ["Доктор", 0]];

    let rows = data.users;
    rows.forEach(row_data => {
        if (row_data.grade >= 3) {
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
        }
    });
    return a;
}

function dataGradesToArray(data) {
    const a = [["Оценка", "Брой студенти с такава оценка"], ["[3,4)", 0], ["[4,5)", 0], ["[5,6]", 0]];
    let rows = data.users;
    rows.forEach(row_data => {
        if (row_data.grade >= 3 && row_data.grade < 4) {
            a[1][1]++;
        } else if (row_data.grade >= 4 && row_data.grade < 5) {
            a[2][1]++;
        } else {
            a[3][1]++;
        }
    });
    return a;
}


function dataMajorToArray(data) {

    const a = [["Специалност", "Брой студенти"], ["СИ", 0], ["КН", 0], ["ИС", 0], ["И", 0], ["М", 0], ["С", 0]];

    let rows = data.users;
    rows.forEach(row_data => {
        if (row_data.grade >= 3) {
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
            }
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
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
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
                getAllNonStudentUsers();
            }
        });
}

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

const fileNameUsers = document.getElementById('file-name1');
document.getElementById('fileUsers').addEventListener('change', function () {
    if (this.files.length > 0) {
        let fileNames = [];
        for (let i = 0; i < this.files.length; i++) {
            fileNames.push(this.files[i].name);
        }
        fileNameUsers.innerText = fileNames.join(', ');
    } else {
        fileNameUsers.innerText = "Все още няма избрани файлове";
    }
});

const fileNameStudents = document.getElementById('file-name2');
document.getElementById('fileStudent').addEventListener('change', function () {
    if (this.files.length > 0) {
        let fileNames = [];
        for (let i = 0; i < this.files.length; i++) {
            fileNames.push(this.files[i].name);
        }
        fileNameStudents.innerText = fileNames.join(', ');
    } else {
        fileNameStudents.innerText = "Все още няма избрани файлове";
    }
});

function editUsers(event) {
    event.preventDefault;
    var form = document.getElementById("edit_users_form");
    var usersData = form.editUsersTextarea.value;

    fetch('../../api?endpoint=edit_users', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(usersData)
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
            var errElem = document.getElementById('message-bar-edit-users');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                errElem.style.display = "block";
                document.getElementById("editUsersTextarea").value = "";

                getAllUsers();
                getAllStudents();
                getAllNonStudentUsers();
            }
        }
        );
}

function editSelectedUser(event) {
    event.preventDefault();
    let editModal = document.getElementById("edit_user_modal");
    const editForm = document.getElementById("edit_selected_user_form");
    let editData = new FormData(editForm);
    editData.append("id", editModal.getAttribute("user_id"));
    const userData = Object.fromEntries(editData.entries());

    fetch('../../api?endpoint=edit_user', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then(data => {
            let errElemModal = document.getElementById("message-bar-modal-edit-users");
            let errElem = document.getElementById("message-bar-edit-users");

            if (!data.success) {
                errElemModal.style.display = "block";
                errElemModal.classList.remove(['success']);
                errElemModal.classList.add(['error']);
                errElemModal.innerHTML = data.message;
                errElem.style.display = "none";
            } else {
                editModal.removeAttribute("active");
                
                errElem.style.display = "block";
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                errElemModal.style.display = "none";

                getAllUsers();
                getAllStudents();
                getAllNonStudentUsers();
            }
        });
}

function deleteSelectedUser(event) {
    event.preventDefault();

    let editModal = document.getElementById("edit_user_modal");
    userData = {"id" : editModal.getAttribute("user_id")}

    fetch('../../api?endpoint=delete-user', {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (response.ok)
                return response.json()
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then(data => {
            let errElemModal = document.getElementById("message-bar-modal-edit-users");
            let errElem = document.getElementById("message-bar-edit-users");

            if (!data.success) {
                errElemModal.style.display = "block";
                errElemModal.classList.remove(['success']);
                errElemModal.classList.add(['error']);
                errElemModal.innerHTML = data.message;
                errElem.style.display = "none";
            } else {
                editModal.removeAttribute("active");
                
                errElem.style.display = "block";
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                errElemModal.style.display = "none";

                getAllUsers();
                getAllStudents();
                getAllNonStudentUsers();
            }
        });
}

function submitStudentHelper(bodyData) {
    fetch('../../api?endpoint=add_students', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: bodyData
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
                getAllStudents();
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
    document.getElementById('fileStudent').value = "";
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(action)
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

function sendMessage(event) {
    event.preventDefault();
    let recipient = document.getElementById('textarea-emails');
    let message = document.getElementById('message');

    let actions = {
        "recipient": recipient.value,
        "message": message.value
    };
    fetch('../../api?endpoint=send_message', {
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
            var errElem = document.getElementById('message-bar-export-message');
            if (!data.success) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                errElem.innerHTML = data.message;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                errElem.innerHTML = data.message;
                recipient.value = "";
                message.value = "";
            }
        });
}

var saveCurrOption;

function getCurrOption(selectObj) {
    saveCurrOption = selectObj.value;
}


function removeValueFromOtherLists(selectObject) {
    var value = selectObject.value;
    var selectobject1 = document.getElementById("diploma_order_1");
    var selectobject2 = document.getElementById("diploma_order_2");
    var selectobject3 = document.getElementById("diploma_order_3");
    var selectobject4 = document.getElementById("diploma_order_4");
    var selectobject5 = document.getElementById("diploma_order_5");
    var selectobject6 = document.getElementById("diploma_order_6");

    let name;
    switch (saveCurrOption) {
        case 'fn': name = 'ФН'; break;
        case 'name': name = 'Име'; break;
        case 'degree': name = 'Степен'; break;
        case 'major': name = 'Специалност'; break;
        case 'group': name = 'Група'; break;
        case 'grade': name = 'Успех'; break;
        default: name = ""; break;
    }

    if (saveCurrOption == -1) {
        if (!selectobject1.isEqualNode(selectObject)) {
            for (let i = 0; i < selectobject1.length; i++) {
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
    else {
        if (!selectobject1.isEqualNode(selectObject)) {
            let opt = document.createElement('option');
            opt.value = saveCurrOption;
            opt.innerHTML = name;
            selectobject1.appendChild(opt);
            for (var i = 0; i < selectobject1.length; i++) {
                if (selectobject1.options[i].value == value)
                    selectobject1.remove(i);
            }
        }
        if (!selectobject2.isEqualNode(selectObject)) {
            let opt = document.createElement('option');
            opt.value = saveCurrOption;
            opt.innerHTML = name;
            selectobject2.appendChild(opt);
            for (var i = 0; i < selectobject2.length; i++) {
                if (selectobject2.options[i].value == value)
                    selectobject2.remove(i);
            }
        }
        if (!selectobject3.isEqualNode(selectObject)) {
            let opt = document.createElement('option');
            opt.value = saveCurrOption;
            opt.innerHTML = name;
            selectobject3.appendChild(opt);
            for (var i = 0; i < selectobject3.length; i++) {
                if (selectobject3.options[i].value == value)
                    selectobject3.remove(i);
            }
        }
        if (!selectobject4.isEqualNode(selectObject)) {
            let opt = document.createElement('option');
            opt.value = saveCurrOption;
            opt.innerHTML = name;
            selectobject4.appendChild(opt);
            for (var i = 0; i < selectobject4.length; i++) {
                if (selectobject4.options[i].value == value)
                    selectobject4.remove(i);
            }
        }
        if (!selectobject5.isEqualNode(selectObject)) {
            let opt = document.createElement('option');
            opt.value = saveCurrOption;
            opt.innerHTML = name;
            selectobject5.appendChild(opt);
            for (var i = 0; i < selectobject5.length; i++) {
                if (selectobject5.options[i].value == value)
                    selectobject5.remove(i);
            }
        }
        if (!selectobject6.isEqualNode(selectObject)) {
            let opt = document.createElement('option');
            opt.value = saveCurrOption;
            opt.innerHTML = name;
            selectobject6.appendChild(opt);
            for (var i = 0; i < selectobject6.length; i++) {
                if (selectobject6.options[i].value == value)
                    selectobject6.remove(i);
            }
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(values)
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
            if (!element.querySelectorAll("td")[1].innerHTML.includes(inputDataName)) {
                toAddHidden = true;
            }
            //sort by fn - check if the data in <td> includes inputDataFn
            if (!element.querySelectorAll("td")[0].innerHTML.includes(inputDataFn)) {
                toAddHidden = true;
            }
            element.toggleAttribute("hidden", toAddHidden);
        } else {
            i++;
        }

    })
}

function downloadExportedStudents(event) {
    event.preventDefault();
    let form = document.getElementById("export_files_student");
    let fileFormat = form.format.value;
    let errElem = document.getElementById('message-bar-export-student');
    if (fileFormat === 'no') {
        errElem.classList.remove(['success']);
        errElem.classList.add(['error']);
        errElem.innerHTML = "Не сте избрали файлов формат!"
    }
    else {
        errElem.classList.remove(['error']);
        errElem.innerHTML = "";
        values = { "format": fileFormat }
        if (fileFormat !== 'pdf') {
            fetch('../../api?endpoint=export_students', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.text()
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(data => {
                    const blob = new Blob([data], { type: "application/octet-stream" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "students.".concat(fileFormat);
                    link.click();
                    link.remove();
                });
        }
        else {
            fetch('../../api?endpoint=export_students', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.blob()
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(blob => {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "students.pdf";

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                });
        }
    }
}

function downloadExportedUsers(event) {
    event.preventDefault();
    let form = document.getElementById("export_files_users");
    let fileFormat = form.format.value;
    let errElem = document.getElementById('message-bar-export-users');
    if (fileFormat === 'no') {
        errElem.classList.remove(['success']);
        errElem.classList.add(['error']);
        errElem.innerHTML = "Не сте избрали файлов формат!"
    }
    else {
        errElem.classList.remove(['error']);
        errElem.innerHTML = "";
        values = { "format": fileFormat }
        if (fileFormat !== 'pdf') {
            fetch('../../api?endpoint=export_users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.text()
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(data => {


                    const blob = new Blob([data], { type: "application/octet-stream" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "users.".concat(fileFormat);
                    link.click();
                    link.remove();
                });
        }
        else {
            fetch('../../api?endpoint=export_users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
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
}

function downloadExportedGraduated(event) {
    event.preventDefault();
    let form = document.getElementById("export_graduated");
    let fileFormat = form.format.value;
    let errElem = document.getElementById('message-bar-export-graduated');
    if (fileFormat === 'no') {
        errElem.classList.remove(['success']);
        errElem.classList.add(['error']);
        errElem.innerHTML = "Не сте избрали файлов формат!"
    }
    else {
        errElem.classList.remove(['error']);
        errElem.innerHTML = "";
        values = { "format": fileFormat }
        if (fileFormat !== 'pdf') {
            fetch('../../api?endpoint=export_graduated', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(data => {

                    const blob = new Blob([data], { type: "application/octet-stream" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "graduated.".concat(fileFormat);
                    link.click();
                    link.remove();
                });
        }
        else {
            fetch('../../api?endpoint=export_graduated', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(blob => {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "graduated.pdf";

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                });
        }
    }
}

function downloadExcellentStudent(event) {
    event.preventDefault();
    let form = document.getElementById("export_excellent");
    let fileFormat = form.format.value;
    let errElem = document.getElementById('message-bar-export-excellent');
    if (fileFormat === 'no') {
        errElem.classList.remove(['success']);
        errElem.classList.add(['error']);
        errElem.innerHTML = "Не сте избрали файлов формат!"
    }
    else {
        errElem.classList.remove(['error']);
        errElem.innerHTML = "";
        values = { "format": fileFormat }
        if (fileFormat !== 'pdf') {
            fetch('../../api?endpoint=export_excellent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(data => {

                    const blob = new Blob([data], { type: "application/octet-stream" });
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = "excellent.".concat(fileFormat);
                    link.click();
                    link.remove();
                });
        }
        else {
            fetch('../../api?endpoint=export_excellent', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(values)
            })
                .then(response => {
                    if (response.ok) {
                        return response.blob();
                    }
                    else {
                        localStorage.removeItem('token');
                        window.location.replace("../../");
                    }
                })
                .then(blob => {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = "excellent.pdf";

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                });
        }
    }
}



function sortByEdit(c) {
    let table = document.getElementById('edit-users-table'); 
    let rows = table.rows.length;
    let columns = table.rows[0].cells.length;
    let arrTable = new Array(rows);
    for (let i = 0; i < arrTable.length; i++) {
        arrTable[i] = new Array(columns);
    }
    for (let row = 0; row < rows; row++) {
        for (col = 0; col < columns; col++) {
            arrTable[row][col] = table.rows[row].cells[col].innerHTML;
        }
    }
    for (let row = 1; row < rows; row++) {
        table.deleteRow(1);
    }
    let firstLine = arrTable.shift();

    if (c !== cPrev) {
        arrTable.sort(
            function (a, b) {
                if (a[c] === b[c]) {
                    return 0;
                } else {
                    return (a[c] < b[c]) ? -1 : 1;
                }
            }
        );
    } else {
        arrTable.reverse();
    }
    cPrev = c;
    arrTable.unshift(firstLine);
    
    for (let row = 1; row < rows; row++) {
        let n_row = table.insertRow(row);
        n_row.id = 'user' + arrTable[0];
        for (col = 0; col < columns; col++) {
            n_row.insertCell(col).innerHTML = arrTable[row][col];
        }
        n_row.addEventListener("click", (e) => {
            let edit_modal = document.getElementById("edit_user_modal");
            let message_bar_modal = document.getElementById("message-bar-modal-edit-users");
            let input_name = document.getElementById("user_name");
            let input_email = document.getElementById("user_email");
            let input_phone = document.getElementById("user_phone");
            let input_fn = document.getElementById("user_fn");

            edit_modal.setAttribute("active", "");
            edit_modal.setAttribute("user_id", arrTable[row][0]);
            message_bar_modal.style.display = "none";

            input_name.value = arrTable[row][1];
            input_email.value = arrTable[row][2];
            input_phone.value = arrTable[row][3];
            input_fn.value = arrTable[row][4];
        })
        n_row.style.cursor = "pointer";
    }
}

function searchInTable(table_id, input_id) {
    const table = document.getElementById(table_id);
    const input = document.getElementById(input_id);
    const filter = input.value.toUpperCase();

    let txtValue;
    const rows = table.rows.length;
    const columns = table.rows[0].cells.length;

    let tr = table.getElementsByTagName('tr');//all rows
    for (let row = 1; row < rows; row++) {
        let td = tr[row].getElementsByTagName('td');//all columns of each row
        for (let col = 0; col < columns; col++) {
            if (td) {
                txtValue = td[col].textContent || td[col].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[row].style.display = "";
                    break;
                } else {
                    tr[row].style.display = "none";
                }
            }
        }
    }
}


function buildGradTable(data) {
    var table = document.getElementById("info-graduation-table");

    table.innerHTML = '<tr> <td>Начален час</td> <td>Интервал между студентите</td> <td>Дата на дипломирането</td> <td>Място на дипломирането</td> <td>Година на завършване</td> </tr>';
    let i = 1;
    let row = table.insertRow(i);
    let row_data = [
        data[0].start_time,
        data[0].students_interval,
        data[0].graduation_date,
        data[0].graduation_place,
        data[0].class
    ];
    const number_columns = row_data.length;
    for (let j = 0; j < number_columns; j++) {
        row.insertCell(j).innerHTML = row_data[j];
    }
}


function distributeModerators() {
    fetch('../../api?endpoint=edit_student_moderators', {
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
            var errElem = document.getElementById('message-bar-distribute-moderators');
            if (data.error) {
                errElem.classList.remove(['success']);
                errElem.classList.add(['error']);
                console.log(data.error);
                errElem.innerHTML = data.error;
            } else {
                errElem.classList.remove(['error']);
                errElem.classList.add(['success']);
                console.log(data.success);
                errElem.innerHTML = data.success;
            }
        })
        .finally(() => { });
}

function getGraduationInfo() {
    fetch(`../../api?endpoint=get_graduation_time`, {
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
            if (!data.success) {
                console.log(data.message);
            } else {
                buildGradTable(data.graduation_time);
            }
        })
}

function getMessages() {
    let notifications = document.getElementById("notifications");
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

/*--------------------------------------------------------------------ARCHIVE----------------------------------------------------------------------------------------*/


function getClassArchiveInfo(event) {
    event.preventDefault();
    fetch(`../../api?endpoint=get_last_class_archive`, {
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
            if (!data.success) {
                //console.log(data.message);
            } else {
                sendGraduationInfo(data.class);
            }
        })
}


function sendGraduationInfo(c) {
    let time = document.getElementById('start-time');
    let interval = document.getElementById('students-interval');
    let date = document.getElementById('graduation-date');
    let place = document.getElementById('graduation-place');
    let classes = document.getElementById('class');
    let errElem = document.getElementById('message-add-graduation-info');

    if (time.value != "" && interval.value != "" && date.value != "" && place.value != "" && classes.value != "") {
        let reg1 = /^(0?[0-9]|[01][0-9]|2[0-3]):[0-5][0-9]$/;
        if (!reg1.test(time.value)) {
            errElem.classList.remove(['success']);
            errElem.classList.add(['error']);
            errElem.innerHTML = "Грешка: Некоректен формат на началния час! Трябва да е 'час:минути'!";
            return;
        }
        let reg2 = /^(0?[0-9]|[0-5][0-9]):?([0-5]?[0-9]?)$/;
        if (!reg2.test(interval.value)) {
            errElem.classList.remove(['success']);
            errElem.classList.add(['error']);
            errElem.innerHTML = "Грешка: Некоректен формат на интервала! Трябва да е 'минути:секунди'!";
            return;
        }
        let d = new Date(date.value);
        let year = d.getFullYear();
        if (parseInt(classes.value) + 1 != year) {
            errElem.classList.remove(['success']);
            errElem.classList.add(['error']);
            errElem.innerHTML = "Грешка: Дипломирането е една година след годината на завършване!";
            return;
        }
        else if (c >= parseInt(classes.value)) {
            errElem.classList.remove(['success']);
            errElem.classList.add(['error']);
            errElem.innerHTML = `Грешка: Последният архив е от ${c} година и вие нямате право да добавяте от по-минала година!`;
            return;
        }
        let today = new Date().toISOString().slice(0, 10);
        if (d.toISOString().slice(0, 10) < today) {
            var text = "Сигурни ли сте, че искате да направите тази промяна? Вие сте задали минала дата и това автоматично ще премахне студентите от текущите таблици и ще ги прехвърли в архива!";
        }
        else {
            var text = "Сигурни ли сте, че искате да направите тази промяна?";
        }
        if (confirm(text) == true) {
            let action = {
                "start_time": time.value,
                "students_interval": interval.value,
                "graduation_date": date.value,
                "graduation_place": place.value,
                "class": classes.value
            };

            fetch('../../api?endpoint=add_graduation_info', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(action)
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
                        errElem.classList.remove(['success']);
                        errElem.classList.add(['error']);
                        errElem.innerHTML = data.message;
                    } else {
                        errElem.classList.remove(['error']);
                        errElem.classList.add(['success']);
                        errElem.innerHTML = data.message;
                        time.value = "";
                        interval.value = "";
                        date.value = "";
                        place.value = "";
                        classes.value = "";
                        getGraduationInfo();
                        makeArchive();
                    }
                });
        }
    }
    else {
        errElem.classList.remove(['success']);
        errElem.classList.add(['error']);
        errElem.innerHTML = "Моля, попълнете всички полета!";
    }
}


function makeArchive() {
    fetch('../../api?endpoint=make_archive', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {
                //console.log(data.message);
            } else {
                getClasses();
            }
        });
}


function getClasses() {
    fetch(`../../api?endpoint=get_archive_classes`, {
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
            if (!data.success) {
                console.log(data.message);
            } else {
                let div = document.getElementById('for_buttons');
                while (div.firstChild) {
                    div.removeChild(div.firstChild);
                }
                for (let i = 0; i < data.class.length; i++) {
                    let button = document.createElement('button');
                    let text = document.createTextNode(data.class[i].class);
                    button.appendChild(text);
                    button.setAttribute("id", "but" + data.class[i].class)
                    button.setAttribute("class", "submit-action");
                    button.onclick = function (event) { downloadArchive(event, data.class[i].class); }
                    div.appendChild(button);
                }
            }
        })
}


function downloadArchive(event, id) {
    event.preventDefault();
    let values = { "id": id };
    fetch('../../api?endpoint=export_archives', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
        .then(response => {
            if (response.ok) {
                return response.text()
            }
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then(data => {
            const blob = new Blob([data], { type: "application/octet-stream" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "achieve" + id + ".csv";
            link.click();
            link.remove();
        });
}
