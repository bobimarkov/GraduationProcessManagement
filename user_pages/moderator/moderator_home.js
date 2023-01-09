showDiplomaSection();
getAllUsers();
getAllStudents();
getStudentsDiplomaInfo();
// Load google charts
google.charts.load('current', {'packages':['corechart']});

/*---- GET_USERS  START ----*/
function getAllUsers() {
     fetch(`../../services/get_users.php`, {
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
                buildUsersTable(data);
            }
        })
}

function buildUsersTable(data) {
    var table = document.getElementById("users-table");
    let i = 1;
    let rows = data.users;
   
   table.innerHTML=" <tr> <td>ID</td> <td>Име</td> <td>Имейл</td> <td>Телефон</td> <td>Роля</td> </tr>";
    rows.forEach(row_data => {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        cell0.innerHTML = row_data.id;
        cell1.innerHTML = row_data.name;
        cell2.innerHTML = row_data.email;
        cell3.innerHTML = row_data.phone;
        switch (row_data.role) {
            case 'admin': cell4.innerHTML = '<i class="fas fa-user-lock user-role-icon"></i>'; break;
            case 'moderator': cell4.innerHTML = '<i class="fas fa-user-cog user-role-icon"></i>'; break;
            case 'student': cell4.innerHTML = '<i class="fas fa-user-graduate user-role-icon"></i>'; break;
        }
        
    })

}

function addDeleteUserListener(button, id, username, row_id) {
    button.addEventListener('click', () => {
        console.log('detele user with id: ' + id + " and username: " + username);

        var data = {
            "id": id,
            "username": username
        };

        fetch('../../endpoints/delete-user.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then((data) => {
                if (data.error) {
                    /* display error to user */
                    console.log(data.error);
                } else {
                    console.log(data.success);
                    deleteRowFromTable(row_id);
                }
            })
    })
}

function deleteRowFromTable(id) {
    let node = document.getElementById(id);
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
/*---- GET_USERS  END ----*/

/*---- GET_STUDENTS  START ----*/
function getAllStudents() {
    fetch(`../../services/get_students.php`, {
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
                buildEditStudentsTable(data);
            }
        })
}

function buildEditStudentsTable(data){
    var table=document.getElementById("edit-students-table");

    let i = 1;
    let rows = data.users;
    table.innerHTML="<tr><td>ID</td><td>Име</td><td>Имейл</td><td>Телефон</td><td>ФН</td></tr>";
    rows.forEach(row_data => {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        cell0.innerHTML = row_data.id;
        cell1.innerHTML = row_data.name;
        cell2.innerHTML = row_data.email;
        cell3.innerHTML = row_data.phone;
        cell4.innerHTML = row_data.fn;
        
        i++;
    })

}

function buildStudentsTable(data) {
    var table = document.getElementById("students-table");
    let i = 1;
    let rows = data.users;
    
    table.innerHTML="<tr> <td>ID</td> <td>Име</td> <td>Имейл</td> <td>Телефон</td> <td>ФН</td> <td>Степен</td> <td>Спец.</td> <td>Група</td> <td>Роля</td> </tr>";
    
    //console.log("table=",table);
    rows.forEach(row_data => {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        var cell7 = row.insertCell(7);
        var cell8 = row.insertCell(8);
        cell0.innerHTML = row_data.id;
        cell1.innerHTML = row_data.name;
        cell2.innerHTML = row_data.email;
        cell3.innerHTML = row_data.phone;
        cell4.innerHTML = row_data.fn;
        cell5.innerHTML = row_data.degree;
        cell6.innerHTML = row_data.major;
        cell7.innerHTML = row_data.group;
        switch (row_data.role) {
            case 'admin': cell8.innerHTML = '<i class="fas fa-user-lock user-role-icon"></i>'; break;
            case 'moderator': cell8.innerHTML = '<i class="fas fa-user-cog user-role-icon"></i>'; break;
            case 'student': cell8.innerHTML = '<i class="fas fa-user-graduate user-role-icon"></i>'; break;
        }
        i++;
    })
   

}
/*---- GET_STUDENTS  END ----*/

/*---- GET_STUDENTS_DIPLOMA  START ----*/
function getStudentsDiplomaInfo() {
    fetch(`../../services/get_students_diploma.php`, {
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
                buildStudentsDiplomaTable(users,null);
            } else {
                var colors_config = data.graduation_colors;
                buildStudentsDiplomaTable(users,colors_config);
            }
        });
}

function buildStudentsDiplomaTable(users, colors_config) {
    var table = document.getElementById("diploma-table");
    
    table.innerHTML="";
    table.innerHTML = "<tr> <td>№</td> <td>ФН</td> <td>Име</td> <td>Степен</td> <td>Спец.</td> <td>Група</td> <td>Успех</td> <td>Присъствие</td> <td>Има право</td> <td>Готова</td> <td>Взета</td> <td>Заявка взимане предв.</td> <td>Коментар (студент)</td> <td>Взета предв.</td> <td>Дата/час</td> <td>Коментар (администр.)</td> <td>Покана реч</td> <td>Отговор</td> <td>Снимки</td> <td>Заявена тога</td> <td>Взета</td> <td>Дата/час</td> <td>Върната</td> <td>Дата/час</td> <td>Заявена шапка</td> <td>Взета</td> <td>Дата/час</td> <td>Върната</td> <td>Дата/час</td></tr>";
    
    let i = 1;
    users.forEach(user => {
        var row = table.insertRow(i);
        row.id = 'user' + i;
        row.setAttribute("onmousedown", "toggleBorderColor(this)")
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        var cell3 = row.insertCell(3);
        var cell4 = row.insertCell(4);
        var cell5 = row.insertCell(5);
        var cell6 = row.insertCell(6);
        var cell7 = row.insertCell(7);
        var cell8 = row.insertCell(8);
        var cell9 = row.insertCell(9);
        var cell10 = row.insertCell(10);
        var cell11 = row.insertCell(11);
        var cell12 = row.insertCell(12);
        var cell13 = row.insertCell(13);
        var cell14 = row.insertCell(14);
        var cell15 = row.insertCell(15);
        var cell16 = row.insertCell(16);
        var cell17 = row.insertCell(17);
        var cell18 = row.insertCell(18);
        var cell19 = row.insertCell(19);
        var cell20 = row.insertCell(20);
        var cell21 = row.insertCell(21);
        var cell22 = row.insertCell(22);
        var cell23 = row.insertCell(23);
        var cell24 = row.insertCell(24);
        var cell25 = row.insertCell(25);
        var cell26 = row.insertCell(26);
        var cell27 = row.insertCell(27);
        var cell28 = row.insertCell(28);
        cell0.innerHTML = i;
        cell1.innerHTML = user.student_fn;
        cell2.innerHTML = user.name.concat(" " + getColor(i, users.length, colors_config));
        cell3.innerHTML = user.degree;
        cell4.innerHTML = user.major;
        cell5.innerHTML = user.group;
        cell6.innerHTML = user.grade;
        cell7.innerHTML = user.attendance == 0 ? 'Не' : 'Да';
        cell8.innerHTML = user.has_right == 0 ? 'Не' : 'Да';
        cell9.innerHTML = user.is_ready == 0 ? 'Не' : 'Да';
        cell10.innerHTML = user.is_taken == 0 ? 'Не' : 'Да';
        cell11.innerHTML = user.take_in_advance_request == 0 ? 'Не' : 'Да';
        cell12.innerHTML = user.take_in_advance_request_comment == null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.take_in_advance_request_comment}</span></i>`;
        cell13.innerHTML = user.is_taken_in_advance == 0 ? 'Не' : 'Да';
        cell14.innerHTML = user.taken_at_time;
        cell15.innerHTML = user.diploma_comment == null ? "<i class='far fa-comment-alt comment-icon'><span>Няма коментари</span></i>" : `<i class='fas fa-comment-alt comment-icon'><span>${user.diploma_comment}</span></i>`
        cell16.innerHTML = user.speech_request == 0 ? 'Не' : 'Да';
        cell17.innerHTML = user.speech_response == null ? '-' : user.speech_response;
        cell18.innerHTML = user.photos_requested == 0 ? 'Не' : 'Да';
        cell19.innerHTML = user.grown_requested == 0 ? 'Не' : 'Да';
        cell20.innerHTML = user.grown_taken == 0 ? 'Не' : 'Да';
        cell21.innerHTML = user.grown_taken_date;
        cell22.innerHTML = user.grown_returned == 0 ? 'Не' : 'Да';
        cell23.innerHTML = user.grown_returned_date;
        cell24.innerHTML = user.hat_requested == 0 ? 'Не' : 'Да';
        cell25.innerHTML = user.hat_taken == 0 ? 'Не' : 'Да';
        cell26.innerHTML = user.hat_taken_date;
        cell27.innerHTML = user.hat_returned == 0 ? 'Не' : 'Да';
        cell28.innerHTML = user.hat_returned_date;
        i++;
    })
}


function getColor(i, n, colors_config) {
    var part = Math.round((colors_config[0].color_interval/100 * n));
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
    switch(color_code) {
        case "#FF0000": return "<i class='fas fa-square' style='color: #FF0000;'></i>"; break;
        case "#FFA500": return "<i class='fas fa-square' style='color: #FFA500;'></i>"; break;
        case "#FFFF00": return "<i class='fas fa-square' style='color: #FFFF00;'></i>"; break;
        case "#228B22": return "<i class='fas fa-square' style='color: #228B22;'></i>"; break;
        case "#0000FF": return "<i class='fas fa-square' style='color: #0000FF;'></i>"; break;
        case "#FF1493": return "<i class='fas fa-square' style='color: #FF1493;'></i>"; break;
        case "#663399": return "<i class='fas fa-square' style='color: #663399;'></i>"; break;
        case "#8B4513": return "<i class='fas fa-square' style='color: #8B4513;'></i>"; break;
        case "#000000": return "<i class='fas fa-square' style='color: #000000;'></i>"; break;
        case "#F0FFFF": return "<i class='fas fa-square' style='color: #F0FFFF;'></i>"; break;
        default: return "<i class='fas fa-square' style='color: #A9A9A9;'></i>"
    }
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
}

function showStudents() {
    showGivenSection("students_section");
    activeHeader("students_header");
    getAllStudents();
}

function showEditSection() {
    showGivenSection("edit_section");
    activeHeader("edit_header");
    getAllUsers();
}


function  showAnalyticsSection() {

    showGivenSection("analytic_section");
    activeHeader("analytic_header");

        fetch(`../../services/get_students_diploma.php`, {
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
                    let studentMajorData= dataMajorToArray(data);
                    let studentGradeData = dataGradesToArray(data); 
                    let studentDegreeData = dataDegreeToArray(data);
                    let studentHasRightData = dataHasRightToArray(data);
                    google.charts.setOnLoadCallback(drawChart(studentMajorData,"analytics1","Брой стундети с дадена специалност"));
                    google.charts.setOnLoadCallback(drawChart(studentGradeData,"analytics2","Брой студенти с дадени оценки"));
                    google.charts.setOnLoadCallback(drawChart(studentDegreeData,"analytics3","Брой студенти с дадени степени на образование"));
                    google.charts.setOnLoadCallback(drawChart(studentHasRightData,"analytics4","Студенти имащи право на диплома"));
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
function showGivenSection(sectionToBeDisplayed){
   
    //get all sections
    sections = [
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

    for(let i=0; i<6;i++){
       sections[i].style.display = 'none';

       if(sections[i].id.localeCompare(sectionToBeDisplayed)==0){

         sections[i].style.display='grid';
       }

    }
}

/*---- SWITCH_SECTIONS  END ----*/
//give class "active_header" to only element with elementid
function activeHeader(elementId){

    headers = [
        'users_header',
        'students_header',
        'edit_header',
        'diploma_header',
        'analytic_header'];
        
    headers = headers.map(x => document.getElementById(x));

    for(let i=0;i<5;i++){
        if(headers[i].id.localeCompare(elementId)==0){
            headers[i].classList.add(['active_header']);
        }else{
            headers[i].classList.remove(['active_header']);
        }
    }

}

//start of converting differnet data to array
function dataHasRightToArray(data){
    const a = [["Имащи право на диплома","Брой студенти"],["Имат право",0],["Нямат право",0]];

    let rows=data.users;
    rows.forEach(row_data =>{
        switch(row_data.has_right){
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

function dataDegreeToArray(data){
    const a = [["Степен на образование","Брой студенти"],["Бакалавър",0],["Магистър",0]];
    
    let rows=data.users;
    rows.forEach(row_data =>{
        switch(row_data.degree){
            case 'Б': 
                a[1][1]++;
                break;
            case 'М':
                a[2][1]++;
                break;
            default:
                break;
        }
    });
    return a;
}
function dataGradesToArray(data){
    const a=[["Оценка","Брой студенти с такава оценка"],["[2-3)",0],["[3,4)",0],["[4,5)",0],["[5,6]",0]];
    let rows=data.users;
    rows.forEach(row_data =>{
        if(row_data.grade>=2 && row_data.grade<3){
            a[1][1]++;
        }else if (row_data.grade>=3 && row_data.grade<4){
            a[2][1]++;
        }else if (row_data.grade>=4 && row_data.grade<5){
            a[3][1]++;
        }else {
            a[4][1]++;
        }
    });
    return a;
}


function dataMajorToArray(data){

    const a = [["Специалност","Брой студенти"],["СИ",0],["КН",0],["ИС",0],["И",0],["М",0],["С",0],["х",0]];

    let rows=data.users;
    rows.forEach(row_data =>{
        switch(row_data.major){
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
function drawChart(majorData, id,titleMessage) {
    
  var data = google.visualization.arrayToDataTable(majorData);

  // Optional; add a title and set the width and height of the chart
  var options = {'title':titleMessage, 'width':550, 'height':400};

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

    fetch('../../services/get_diploma_order.php', {
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
        switch(value) {
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

//removed submitUsers

//removed editStudent

function submitStudents(event) {
    event.preventDefault;
    var form = document.getElementById('add_students_form');
    var studentsData = form.studentTextarea.value;

    fetch('../../services/add_students.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(studentsData)
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

    fetch('../../services/save_action.php', {
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

    fetch('../../services/submit_diploma_order.php', {
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


//Filters Start
function filterActivate(){
    var inputFilterName=document.getElementById("searchByName");
    var inputFilterFn=document.getElementById("searchByFn");
    const inputDataName=inputFilterName.value;
    const inputDataFn=inputFilterFn.value;
    var i=0;
    var tableData = document.getElementById("diploma-table").querySelectorAll("tr");
    tableData.forEach((element)=>{
        var toAddHidden=false;
        if(i!=0){
        
        
       
            //sort by name - check if the data in <td> includes inputDataName
            if(!element.querySelectorAll("td")[2].innerHTML.includes(inputDataName)){
                toAddHidden=true;
            
            }

            //sort by fn - check if the data in <td> includes inputDataFn
            if(!element.querySelectorAll("td")[1].innerHTML.includes(inputDataFn)){
                toAddHidden=true;
            
            }

            element.toggleAttribute("hidden",toAddHidden);


        }else{
            i++;
        }

    })
    
   
}

//Filters End
