tokenRefresher();
showDiplomaSection();
getAllUsers();
getAllStudents();
getStudentsDiplomaInfo();
getMessages();
// Load google charts
google.charts.load('current', { 'packages': ['corechart'] });

let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    localStorage.removeItem('token');

    window.location.replace("../../");
});

function generateTableHeaderRow(columnNames, functionName, header_table_id, table_id) {
    var headerCells =
        functionName == undefined ?
            columnNames.reduce(
                (accumulator, currentValue) => accumulator.concat(`<td>${currentValue}</td>`),
                ''
            )
            :
            table_id == undefined ?
                columnNames.reduce(
                    (accumulator, currentValue, currentIndex) => accumulator.concat(`<td onclick=${functionName}(${currentIndex})>${currentValue}</td>`),
                    ''
                )
                :
                columnNames.reduce(
                    (accumulator, currentValue, currentIndex) => accumulator.concat(`<td onclick=${functionName}(${currentIndex},"${table_id}")>${currentValue}</td>`),
                    ''
                )

    return header_table_id == undefined ? `<tr>${headerCells}</tr>` : `<tr id=${header_table_id}>${headerCells}</tr>`;
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

    if (c != cPrev) {
        arrTable.sort(
            function (a, b) {
                if (a[c] == b[c]) {
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

function tokenRefresher() {
    fetch('../../api.php?endpoint=refresh_token', {
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

function getAllUsers() {
    fetch(`../../api.php?endpoint=get_users`, {
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
    fetch(`../../api.php?endpoint=get_students`, {
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
                /* display error to user */
                console.log(data.error);
            } else {
                /* redirect to a page based on the user role, passing the id of the user in the url */
                buildStudentsTable(data);
            }
        })
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
    fetch(`../../api.php?endpoint=get_students_diploma`, {
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
                /* display error to user */
                console.log(data.error);
            } else {
                buildStudentsDiplomaTable(data.users);
            }
        })
}

function buildStudentsDiplomaTable(users) {
    var table = document.getElementById('diploma-table');

        var columnNames = [
            "ФН", "Име", "Степен", "Спец.", "Група", "Успех",
            "Присъствие", "Има право", "Модератор за диплома", "Готова диплома", "Взета", "Заявка взимане предв.", "Коментар (студент)",
            "Взета предв.", "Коментар (администр.)", "Покана реч", "Отговор", "Снимки", "Модератор за тога", "Заявена тога",
            "Взета", "Върната", "Модератор за шапка", "Заявена шапка", "Взета"];
    

    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header-table-diploma', 'diploma-table');
    let i = 1;

    for (const user of users) {
        if (user.grade >= 3) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let response;
            if (user.speech_response == 1) {
                response = 'Приема';
            }
            else if (user.speech_response == 0) {
                response = 'Отказва';
            }
            else if (user.speech_response == null) {
                response = '-';
            }
            var row_data = [
                user.student_fn,
                user.name,
                user.degree,
                user.major,
                user.group,
                user.grade,
                user.attendance == null ? '' : user.attendance == 0 ? 'Не' : 'Да',
                user.has_right == 0 ? 'Не' : 'Да',
                user.moderator_signature_email == null ? 'не е избран' : user.moderator_signature_email,
                user.is_ready == 0 ? 'Не' : 'Да',
                user.is_taken == 0 ? 'Не' : 'Да',
                user.take_in_advance_request == 0 ? 'Не' : 'Да',
                user.take_in_advance_request_comment == null ? "<i class='far fa-comment-alt comment-icon'><span class='studentComm'>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span class='studentComm'>${user.take_in_advance_request_comment}</span></i>`,
                user.is_taken_in_advance == 0 ? 'Не' : 'Да',
                user.diploma_comment == null ? "<i class='far fa-comment-alt comment-icon'><span class='userComm'>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span class='userComm'>${user.diploma_comment}</span></i>`,
                user.speech_request = (user.speech_request == 1) ? 'Да' : 'Не',
                user.speech_response = response,
                user.photos_requested == 0 ? 'Не' : 'Да',
                user.moderator_gown_email == null ? 'не е избран' : user.moderator_gown_email,
                user.gown_requested == null ? '' : user.gown_requested == 0 ? 'Не' : 'Да',
                user.gown_requested != 1 ? '' : user.gown_taken == 0 || user.gown_taken == null ? 'Не' : 'Да',
                //gown_returned
                user.gown_taken != 1 ? '' : user.gown_returned == 0 || user.gown_returned == null ? 'Не' : 'Да',
                user.moderator_hat_email == null ? 'не е избран' : user.moderator_hat_email,
                user.hat_requested == null ? '' : user.hat_requested == 0 ? 'Не' : 'Да',
                //hat_taken
                user.hat_requested != 1 ? '' : user.hat_taken == 0 || user.hat_taken == null ? 'Не' : 'Да'
            ];
            const number_columns = row_data.length;
            for (var j = 0; j < number_columns; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
}


/*---- SWITCH_SECTIONS  START ----*/
function showUsers() {
    tokenRefresher();
    showGivenSection("users_section");
    activeHeader("users_header");
}

function showStudents() {
    tokenRefresher();
    showGivenSection("students_section");
    activeHeader("students_header");
    getAllStudents();
}

function showMessagesSection() {
    tokenRefresher();
    showGivenSection("messages_send_section");
    activeHeader("messages_header");
}

function showAnalyticsSection() {
    let text = document.getElementById('analytic_text');
    fetch(`../../api.php?endpoint=get_students_diploma_simplified`, {
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
                text.style = "text-align : center";
                //console.log(data.error);
            } else {
                // Load google charts
                google.charts.load('current', { 'packages': ['corechart'] });
                text.innerHTML = '<i class="fa fa-pie-chart"></i> Статистиката е на база дипломиращи се студенти!';
                text.style = "text-align : center; height : 1em";
                showAnalyticsSectionHelper();
            }
        })
}

function showAnalyticsSectionHelper() {
    fetch(`../../api.php?endpoint=statistics`, {
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
                google.charts.setOnLoadCallback(drawChart(studentMajorData, "analytics1", "Брой дипломиращи се студенти от дадена специалност със степен 'Бакалавър'"));
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
}

//make section visible, giving only its name
function showGivenSection(sectionToBeDisplayed) {

    //get all sections
    var sections = [
        'users_section',
        'students_section',
        'diploma_section',
        'analytic_section',
        'responsibilities_section',
        'messages_send_section',
        'messages_receive_section'];
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

    if (sectionToBeDisplayed.localeCompare(sections[5].id) == 0) {
        sections[5].style.display = 'grid';
        sections[6].style.display = 'grid';
    }
    if (sectionToBeDisplayed.localeCompare(sections[3].id) == 0) {
        sections[3].style.display = 'flex';
    } 
}

/*---- SWITCH_SECTIONS  END ----*/
//give class "active_header" to only element with elementid
function activeHeader(elementId) {

    var headers = [
        'users_header',
        'students_header',
        'diploma_header',
        'analytic_header',
        'responsibilities_header',
        'messages_header'];

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
        if (row_data.has_right == 1) {
            a[1][1]++;
        }
        else if (row_data.has_right == 0) {
            a[2][1]++;
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

function responsibilitiesByModeratorRole() {
    fetch(`../../api.php?endpoint=get_user_role`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            switch (data.role) {
                case "moderator-hat":
                    responsibilitiesForModeratorHat();
                    break;
                case "moderator-gown":
                    responsibilitiesForModeratorGown();
                    break;
                case "moderator-signature":
                    responsibilitiesForModeratorSignature();
                    break;
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally();
}

function responsibilitiesForModeratorHat() {
    showGivenSection("responsibilities_section");
    activeHeader("responsibilities_header");
    fetchDataForStudents(buildResponsibilitiesSectionForModeratorHat, "get_students_hat");
}

function responsibilitiesForModeratorGown() {
    showGivenSection("responsibilities_section");
    activeHeader("responsibilities_header");
    fetchDataForStudents(buildResponsibilitiesSectionForModeratorGown, "get_students_gown");
}
function responsibilitiesForModeratorSignature() {
    showGivenSection("responsibilities_section");
    activeHeader("responsibilities_header");
    fetchDataForStudents(buildResponsibilitiesSectionForModeratorSignature, "get_students_signature");
}


function fetchDataForStudents(moderatorFunction, endpoint) {

    fetch(`../../api.php?endpoint=${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                console.error(error);
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            moderatorFunction(data.users);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => { });
}


function createParagraphForModerator(text, data, dataId) {
    let paragraph = document.createElement('p');
    paragraph.setAttribute('id', dataId);
    paragraph.setAttribute('class', 'sum-paragraph');
    paragraph.appendChild(document.createTextNode(text + data));
    return paragraph.outerHTML;
}
function createSumDivForModerator(parentId, sums_text, sum_values) {
    let paragraphs_parent = document.getElementById(parentId);
    paragraphs_parent.innerHTML = '';
    for (let j = 0; j < sum_values.length; j++) {
        paragraphs_parent.innerHTML += createParagraphForModerator(sums_text[j], sum_values[j], "sum" + j);
    }
}


function buildResponsibilitiesSectionForModeratorHat(users) {
    var resp_beginning = document.getElementById("responsibilities_beginning");
    var name_range = users[0] == undefined ? '' : users[0].name_range;
    resp_beginning.innerHTML = '<i class="fas fa-graduation-cap"> </i>' + " " + " Отговорност: Шапки " + name_range;
    var table = document.getElementById("responsibilities_table");
    var sums = {
        has_right: 0,
        attendance: 0,
        hat_requested: 0,
        hat_declined: 0
    }
    var sums_text = ["Студенти с право на диплома: ", "Студенти заявили присъствие: ", "Студенти заявили шапка: ", "Студенти отказали шапка: "];
    for (const user of users) {
        if (user.hat_requested == 1) sums.hat_requested++;
        if (user.hat_requested == 0) sums.hat_declined++;
        if (user.has_right == 1) sums.has_right++;
        if (user.attendance == 1) sums.attendance++;
    }
    createSumDivForModerator("sums-div", sums_text, Object.values(sums));

    tableheader = document.getElementById("header_responsibilities_table");
    tableheader.innerHTML = '<i class=\"fas fa-list\"></i>' + " Студенти заявили шапка";


    let i = 1;
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Взета"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header_responsibilities_table', 'responsibilities_table');
    for (const user of users) {
        if (user.hat_requested == 1) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.hat_taken == null ? '' : user.hat_taken == 0 ? 'Не' : 'Да'
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
    tableheader = document.getElementById("header_responsibilities_table2");
    tableheader.style.display = "none";
    table = document.getElementById("responsibilities_table2")
    table.style.display = "none";

    text = 'Формат: \n"ФН, Взета"\n\nФН - Факултетният номер на студента\nВзета - Да или Не';
    var student_placeholder = document.getElementById("updateResponsibilitiesForStudents");
    student_placeholder.setAttribute("placeholder", text );
}


function buildResponsibilitiesSectionForModeratorGown(users) {
    var resp_beginning = document.getElementById("responsibilities_beginning");
    var name_range = users[0] == undefined ? '' : users[0].name_range;
    resp_beginning.innerHTML = '<i class="fas fa-tshirt"></i>' + " Отговорност: Тоги " + name_range;
    var table = document.getElementById("responsibilities_table");
    var sums = {
        has_right: 0,
        attendance: 0,
        gown_requested: 0,
        gown_declined: 0
    }
    var sums_text = ["Студенти с право на диплома: ", "Студенти заявили присъствие: ", "Студенти заявили тога: ", "Студенти отказали тога: "];
    for (const user of users) {
        if (user.gown_requested == 1) sums.gown_requested++;
        if (user.gown_requested == 0) sums.gown_declined++;
        if (user.has_right == 1) sums.has_right++;
        if (user.attendance == 1) sums.attendance++;
    }
    createSumDivForModerator("sums-div", sums_text, Object.values(sums));

    tableheader = document.getElementById("header_responsibilities_table");
    tableheader.innerHTML = "<i class=\"fas fa-list\"></i>" + " Студенти заявили тога";

    let i = 1;
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Взета", "Върната"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header_responsibilities_table', 'responsibilities_table');
    for (const user of users) {
        if (user.gown_requested == 1) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.gown_taken == null ? '' : user.gown_taken == 0 ? 'Не' : 'Да',
                user.gown_returned == null ? '' : user.gown_returned == 0 ? 'Не' : 'Да',
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
    tableheader = document.getElementById("header_responsibilities_table2");
    tableheader.style.display = "none";
    table = document.getElementById("responsibilities_table2")
    table.style.display = "none";

    text = 'Формат: \n"ФН, Взета, Върната"\n"Въведете стойност за всеки елемент. За да не се промени елемент, оставете стойността празна."\n\nФН - Факултетният номер на студента\nВзета - Да или Не\nВърната - Да или Не';
    var student_placeholder = document.getElementById("updateResponsibilitiesForStudents");
    student_placeholder.setAttribute("placeholder", text );
}


function buildResponsibilitiesSectionForModeratorSignature(users) {
    var resp_beginning = document.getElementById("responsibilities_beginning");
    var name_range = users[0] == undefined ? '' : users[0].name_range;
    resp_beginning.innerHTML = '<i class="fas fa-pen"></i>' + " Отговорност: Дипломи " + name_range;
    var sums = {
        has_right: 0,
        attendance: 0,
        take_in_advance: 0,
        taken: 0
    }
    var sums_text = ["Студенти с право на диплома: ", "Студенти заявили присъствие: ", "Студенти искащи дипломата си предварително: ", "Студенти взели дипломите си: "];
    for (const user of users) {
        if (user.is_taken == 1) sums.taken++;
        if (user.has_right == 1) sums.has_right++;
        if (user.take_in_advance_request == 1) sums.take_in_advance++;
        if (user.attendance == 1) sums.attendance++;
    }
    createSumDivForModerator("sums-div", sums_text, Object.values(sums));

    var tableheader = document.getElementById("header_responsibilities_table");
    tableheader.innerHTML = "<i class=\"fas fa-list\"></i>" + " Студенти заявили присъствие на дипломирането:";

    let i = 1;
    var table = document.getElementById("responsibilities_table");
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Цвят","Ред на връчване", "Час на връчване", "Взета"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header_responsibilities_table', 'responsibilities_table');
    for (const user of users) {
        if (user.attendance == "1" ) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.color = "<i class='fas fa-square' style='color:" + user.color + ";'></i>",
                user.num_order,
                user.time_diploma,
                user.is_taken == null ? '' : user.is_taken == 0 ? 'Не' : 'Да'
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
    tableheader = document.getElementById("header_responsibilities_table2");
    tableheader.innerHTML = "<i class=\"fas fa-list\"></i>" + " Студенти, искащи дипломата си предварително:";

    i = 1;
    table = document.getElementById("responsibilities_table2");
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Коментар (студент)", "Взета", "Коментар (администр.)"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy', 'header_responsibilities_table2', 'responsibilities_table2');
    for (const user of users) {
        if (user.take_in_advance_request == 1) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.take_in_advance_request_comment == null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.take_in_advance_request_comment}</span></i>`,
                user.is_taken_in_advance == null ? '' : user.is_taken_in_advance == 0 ? 'Не' : 'Да',
                user.diploma_comment == null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.diploma_comment}</span></i>`,
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }

    text = 'Формат: \n"ФН, Взета (на дипломирането), Взета (предварително)"\n"Въведете стойност за всеки елемент. За да не се промени елемент, оставете стойността празна. Въведете стойност или за Взета (на дипломирането) или за Взета (предварително). Не и двете."\n\nФН - Факултетният номер на студента\nВзета (на дипломирането) - Да или Не\nВзета (предварително) - Да или Не';
    var student_placeholder = document.getElementById("updateResponsibilitiesForStudents");
    student_placeholder.setAttribute("placeholder", text );
}

function getExportEndpointByModeratorRole(event, export_files_id, message_bar) {
    event.preventDefault();
    fetch(`../../api.php?endpoint=get_user_role`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            let endpoint;
            let file_name;
            switch (data.role) {
                case "moderator-hat":
                    endpoint = 'export_students_for_hat';
                    file_name = 'students_for_hat';
                    break;
                case "moderator-gown":
                    endpoint = 'export_students_for_gown';
                    file_name = 'students_for_gown';
                    break;
                case "moderator-signature":
                    endpoint = 'export_students_for_signature';
                    file_name = 'students_for_signature';
                    break;
            }
            downloadExportedModeratorResponsibilities(endpoint, export_files_id, message_bar, file_name);
        })
        .catch((error) => {
            console.error(error);
        });
}

function downloadExportedModeratorResponsibilities(endpoint, export_files_id, message_bar, file_name) {
    let form = document.getElementById(export_files_id);
    let fileFormat = form.format.value;
    let errElem = document.getElementById(message_bar);
    if (fileFormat == 'no') {
        errElem.classList.remove(['success']);
        errElem.classList.add(['error']);
        errElem.innerHTML = "Не сте избрали файлов формат!"
    }
    else {
        errElem.classList.remove(['error']);
        errElem.innerHTML = "";
        values = { "format": fileFormat }
        if (fileFormat != 'pdf') {
            fetch(`../../api.php?endpoint=${endpoint}`, {
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
                    link.download = file_name.concat('.', fileFormat);
                    link.click();
                    link.remove();
                });
        }
        else {
            fetch(`../../api.php?endpoint=${endpoint}`, {
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
                    link.download = file_name.concat(".pdf");

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                });
        }
    }
}



function sendMessage(event) {
    event.preventDefault();
    let recipient = document.getElementById('textarea-emails');
    let message = document.getElementById('message');

    let actions = {
        "recipient": recipient.value,
        "message": message.value
    };
    fetch('../../api.php?endpoint=send_message_moderator', {
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

function getMessages() {
    let notifications = document.getElementById("notifications");
    fetch('../../api.php?endpoint=get_messages', {
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
                text.innerHTML = "В момента нямате никакви известия.";
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


function updateStudentsByModeratorRole(event) {
    event.preventDefault();
    fetch(`../../api.php?endpoint=get_user_role`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            else {
                localStorage.removeItem('token');
                window.location.replace("../../");
            }
        })
        .then((data) => {
            let endpoint;
            switch (data.role) {
                case "moderator-hat":
                    endpoint = 'update_students_hat';
                    text = 'Формат: \n"ФН, Взета"\n\nФН - Факултетният номер на студента\nВзета - Да или Не';
                    break;
                case "moderator-gown":
                    endpoint = 'update_students_gown';
                    text = 'Формат: \n"ФН, Взета, Върната"\n"Въведете стойност за всеки елемент. За да не се промени елемент, оставете стойността празна."\n\nФН - Факултетният номер на студента\nВзета - Да или Не\nВърната - Да или Не';
                    break;
                case "moderator-signature":
                    endpoint = 'update_students_signature';
                    text = 'Формат: \n"ФН, Взета (на дипломирането), Взета (предварително)"\n"Въведете стойност за всеки елемент. За да не се промени елемент, оставете стойността празна. Въведете стойност или за Взета (на дипломирането) или за Взета (предварително). Не и двете."\n\nФН - Факултетният номер на студента\nВзета (на дипломирането) - Да или Не\nВзета (предварително) - Да или Не';
                    break;
            }
            updateStudents(endpoint, text);
        })
        .catch((error) => {
            console.error(error);
        });
}

function updateStudents(endpoint, text) {
    var form = document.getElementById("students_responsibilities_form");

    var studentsData = form.updateResponsibilitiesForStudents.value;

    fetch(`../../api.php?endpoint=${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(studentsData)
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
            var message_bar = document.getElementById('message-bar-update-responsibilities');
            if (!data.success) {
                message_bar.classList.remove(['success']);
                message_bar.classList.add(['error']);
                message_bar.style.display = "block";
                message_bar.innerHTML = data.message;
            } else {
                message_bar.classList.remove(['error']);
                message_bar.classList.add(['success']);
                message_bar.innerHTML = data.message;
                message_bar.style.display = "block";
                var student_placeholder = document.getElementById("updateResponsibilitiesForStudents");
                student_placeholder.value = "";
                responsibilitiesByModeratorRole();
            }
        })
        .finally(() => {
            setTimeout(() => {
                var message_bar = document.getElementById('message-bar-update-responsibilities');
                message_bar.style.display = "none";
            }, 5000);
        });
}






