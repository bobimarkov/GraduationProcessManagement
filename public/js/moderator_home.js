tokenRefresher();
showDiplomaSection();
getAllUsers();
getAllStudents();
getStudentsDiplomaInfo();
// Load google charts
google.charts.load('current', { 'packages': ['corechart'] });

let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    localStorage.removeItem('token');

    window.location.replace("../../");
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
    
    return  header_table_id === undefined ? `<tr>${headerCells}</tr>` : `<tr id=${header_table_id}>${headerCells}</tr>`;
}

var cPrev = -1;
function sortBy(c,id) {
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

function searchInTable(table_id,input_id) {
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

function getAllUsers() {
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

function buildUsersTable(data) {
    var table = document.getElementById("users-table");
    let i = 1;
    let users = data.users;

    var columnNames = ["Име", "Имейл", "Телефон", "Роля"];
    table.innerHTML = generateTableHeaderRow(columnNames,'sortBy','header-table-users','users-table');

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
    table.innerHTML = generateTableHeaderRow(columnNames,'sortBy', 'header-table-students','students-table');

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
                /* display error to user */
                console.log(data.error);
            } else {
                buildStudentsDiplomaTable(data.users);
            }
        })
}

function buildStudentsDiplomaTable(users) {
    var table = document.getElementById("diploma-table");
    var columnNames = [
        "ФН", "Име","Цвят","Ред на връчване","Час на връчване", "Степен", "Спец.", "Група", "Успех",
        "Присъствие", "Има право", "Модератор за диплома", "Готова диплома", "Взета", "Заявка взимане предв.", "Коментар (студент)",
        "Взета предв.", "Дата/час", "Коментар (администр.)", "Покана реч", "Отговор", "Снимки", "Модератор за тога","Заявена тога",
        "Взета", "Дата/час", "Върната", "Дата/час","Модератор за шапка", "Заявена шапка", "Взета", "Дата/час"];
    table.innerHTML = generateTableHeaderRow(columnNames, 'sortBy','header-table-diploma','diploma-table');
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
}

function showStudents() {
    tokenRefresher();
    showGivenSection("students_section");
    activeHeader("students_header");
    getAllStudents();
}

function showAnalyticsSection() {
    tokenRefresher();
    showGivenSection("analytic_section");
    activeHeader("analytic_header");

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
        'responsibilities_section'];
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
}

/*---- SWITCH_SECTIONS  END ----*/
//give class "active_header" to only element with elementid
function activeHeader(elementId) {

    var headers = [
        'users_header',
        'students_header',
        'diploma_header',
        'analytic_header',
        'responsibilities_header'];

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

function responsibilitiesByModeratorRole() {
    fetch(`../../api?endpoint=get_user_role`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if(response.ok) {
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

    fetch(`../../api?endpoint=${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if(response.ok) {
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
        .finally(() => {});
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
    var name_range = users[0] === undefined ? '' :  users[0].name_range;
    resp_beginning.innerHTML = '<i class="fas fa-graduation-cap"> </i>' + " " +  " Отговорност: Шапки " + name_range ;
    var table = document.getElementById("responsibilities_table");
    var sums = {
        has_right: 0,
        attendance: 0,
        hat_requested: 0,
        hat_declined: 0
    }
    var sums_text = ["Студенти с право на диплома: ", "Студенти заявили присъствие: ", "Студенти заявили шапка: ", "Студенти отказали шапка: "];
    for (const user of users) {
        sums.hat_requested += user.hat_requested === 1;
        sums.hat_declined += user.hat_requested === 0;
        sums.has_right += user.has_right === 1;
        sums.attendance += user.attendance === 1;
    }

    createSumDivForModerator("sums-div", sums_text, Object.values(sums));

    tableheader = document.getElementById("header_responsibilities_table");
    tableheader.innerHTML = '<i class=\"fas fa-list\"></i>' + " Студенти заявили шапка";


    let i = 1;
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Присъствие", "Взета", "Дата на вземане"];
    table.innerHTML = generateTableHeaderRow(columnNames,'sortBy','header_responsibilities_table','responsibilities_table');
    for (const user of users) {
        if (user.hat_requested == 1) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.attendance === 0 ? 'Не' : 'Да',
                user.hat_taken === null ? '' : user.hat_taken === 0 ? 'Не' : 'Да',
                user.hat_taken === 1 ? user.hat_taken_date : ''
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }

    tableheader = document.getElementById("header_responsibilities_table2");
    tableheader.style.display ="none";
    table = document.getElementById("responsibilities_table2")
    table.style.display = "none";
}


function buildResponsibilitiesSectionForModeratorGown(users) {
    var resp_beginning = document.getElementById("responsibilities_beginning");
    var name_range = users[0] === undefined ? '' :  users[0].name_range;
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
        sums.gown_requested += user.gown_requested === 1;
        sums.gown_declined += user.gown_requested === 0;
        sums.has_right += user.has_right === 1;
        sums.attendance += user.attendance === 1;
    }
    createSumDivForModerator("sums-div", sums_text, Object.values(sums));

    tableheader = document.getElementById("header_responsibilities_table");
    tableheader.innerHTML = "<i class=\"fas fa-list\"></i>" + " Студенти заявили тога";

    let i = 1;
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Присъствие", "Взета", "Дата на вземане", "Върната", "Дата на връщане"];
    table.innerHTML =  generateTableHeaderRow(columnNames,'sortBy','header_responsibilities_table','responsibilities_table');
    for (const user of users) {
        if (user.gown_requested === 1) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.attendance === 0 ? 'Не' : 'Да',
                user.gown_taken === null ? '' : user.gown_taken === 0 ? 'Не' : 'Да',
                user.gown_taken === 1 ? user.gown_taken_date : '',
                user.gown_returned === null ? '' : user.gown_returned === 0 ? 'Не' : 'Да',
                user.gown_returned_date === 1 ? user.gown_returned_date : ''
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }

    tableheader = document.getElementById("header_responsibilities_table2");
    tableheader.style.display ="none";
    table = document.getElementById("responsibilities_table2")
    table.style.display = "none";
}


function buildResponsibilitiesSectionForModeratorSignature(users) {
    var resp_beginning = document.getElementById("responsibilities_beginning");
    var name_range = users[0] === undefined ? '' :  users[0].name_range;
    resp_beginning.innerHTML = '<i class="fas fa-pen"></i>' + " Отговорност: Дипломи " + name_range;
    var sums = {
        has_right: 0,
        attendance: 0,
        take_in_advance: 0,
        taken: 0
    }
    var sums_text = ["Студенти с право на диплома: ", "Студенти заявили присъствие: ", "Студенти искащи дипломата си предварително: ", "Студенти взели дипломите си: "];
    for (const user of users) {
        sums.taken += user.is_taken;
        sums.has_right += user.has_right;
        sums.take_in_advance += user.take_in_advance_request;
        sums.attendance += user.attendance;
    }
    createSumDivForModerator("sums-div", sums_text, Object.values(sums));

    var tableheader = document.getElementById("header_responsibilities_table");
    tableheader.innerHTML = "<i class=\"fas fa-list\"></i>" + " Студенти с право на диплома:";

    let i = 1;
    var table = document.getElementById("responsibilities_table");
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Присъствие", "Взета", "Заявка взимане предв.", "Коментар (студент)", "Взета предв.", "Дата/час", "Коментар (администр.)"];
    table.innerHTML = generateTableHeaderRow(columnNames,'sortBy','header_responsibilities_table','responsibilities_table');
    for (const user of users) {
        if (user.has_right) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.attendance === 0 ? 'Не' : 'Да',
                user.is_taken === 0 ? 'Не' : 'Да',
                user.take_in_advance_request === 0 ? 'Не' : 'Да',
                user.take_in_advance_request_comment === null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.take_in_advance_request_comment}</span></i>`,
                user.is_taken_in_advance === 0 ? 'Не' : 'Да',
                user.taken_at_time,
                user.diploma_comment === null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.diploma_comment}</span></i>`,
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
    var columnNames = ["ФН", "Име", "Имейл", "Телефон", "Присъствие", "Заявка взимане предв.", "Коментар (студент)", "Взета предв.","Коментар (администр.)"];
    table.innerHTML =  generateTableHeaderRow(columnNames,'sortBy','header_responsibilities_table2','responsibilities_table2');
    for (const user of users) {
        if (user.take_in_advance_request) {
            var row = table.insertRow(i);
            row.id = 'user' + i;
            let row_data = [
                user.fn,
                user.name,
                user.email,
                user.phone,
                user.attendance === 0 ? 'Не' : 'Да',
                user.take_in_advance_request === 0 ? 'Не' : 'Да',
                user.take_in_advance_request_comment === null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.take_in_advance_request_comment}</span></i>`,
                user.is_taken_in_advance === 0 ? 'Не' : 'Да',
                user.diploma_comment === null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.diploma_comment}</span></i>`,
            ]
            for (var j = 0; j < row_data.length; j++) {
                row.insertCell(j).innerHTML = row_data[j];
            }
            i++;
        }
    }
}

function getExportEndpointByModeratorRole(event,export_files_id,message_bar) {
        event.preventDefault();
    fetch(`../../api?endpoint=get_user_role`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if(response.ok) {
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
            downloadExportedModeratorResponsibilities(endpoint,export_files_id,message_bar,file_name);
        })
        .catch((error) => {
            console.error(error);
        });
}

function downloadExportedModeratorResponsibilities(endpoint,export_files_id,message_bar,file_name) {
    let form = document.getElementById(export_files_id);
    let fileFormat = form.format.value;
    let errElem = document.getElementById(message_bar);
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
            fetch(`../../api?endpoint=${endpoint}`, {
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
                    link.download = file_name.concat('.',fileFormat);
                    link.click();
                    link.remove();
                });
        }
        else {
            fetch(`../../api?endpoint=${endpoint}`, {
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
                    console.log(link.download);

                    document.body.appendChild(link);
                    link.click();

                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(link.href);
                });
        }
    }
}




