showDiplomaSection();
getAllUsers();
getAllStudents();
getStudentsDiplomaInfo();
// Load google charts
google.charts.load('current', { 'packages': ['corechart'] });

let logoutHeader = document.getElementById("logout_header");
logoutHeader.addEventListener("click", (e) => {
    sessionStorage.clear();

    window.location.replace("../../index.html");
});

function sessionLoader() {
    if (!sessionStorage.getItem("user") || !sessionStorage.getItem("role") || (sessionStorage.getItem("role") && sessionStorage.getItem("role") !== "moderator")) {
        sessionStorage.clear();

        window.location.replace("../../index.html");
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
                /* display error to user */
                console.log(data.error);
            } else {
                /* redirect to a page based on the user role, passing the id of the user in the url */
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

/*---- GET_STUDENTS_DIPLOMA  END ----*/

/*---- SWITCH_SECTIONS  START ----*/
function showUsers() {
    showGivenSection("users_section");
    activeHeader("users_header");
}

function showStudents() {
    showGivenSection("students_section");
    activeHeader("students_header");
    getAllStudents();
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
}

//make section visible, giving only its name
function showGivenSection(sectionToBeDisplayed) {

    //get all sections
    var sections = [
        'users_section',
        'students_section',
        'diploma_section',
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
}

/*---- SWITCH_SECTIONS  END ----*/
//give class "active_header" to only element with elementid
function activeHeader(elementId) {
    
    var headers = [
        'users_header',
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

//Filters Start
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

//Filters End


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
