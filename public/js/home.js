getGraduationInfo();

button = document.getElementById("to_login_button");
button.addEventListener("click", (e) => {
    window.location.href = "./pages/login.html";
});

function getWeekDay(weekDay) {
    switch (weekDay) {
        case 1: return "Понеделник";
        case 2: return "Вторник";
        case 3: return "Сряда";
        case 4: return "Четвъртък";
        case 5: return "Петък";
        case 6: return "Събота";
        case 7: return "Неделя";
    }
}

async function getGraduationInfo() {
    let graduationInfo = document.querySelector(".graduation_info_section");

    await fetch('./api?endpoint=get_graduation_time', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                let date = new Date(data.graduation_time[0].graduation_date + " " + data.graduation_time[0].start_time);

                graduationInfo.innerHTML = `На ${date.toLocaleDateString("ro-ro")} г. (${getWeekDay(date.getDay())}) от
                 ${date.toLocaleTimeString("ro-ro", { hour: "2-digit", minute: "2-digit" })} ч. в ${data.graduation_time[0].graduation_place} на Софийски университет
                \"Св. Климент Охридски\" ще се състои тържествено връчване на дипломите за висше
                образование на абсолвентите от випуск ${data.graduation_time[0].class} г. на ФМИ.`;
            }
            else {
                graduationInfo.innerHTML = "Все още няма информация относно церемонията по дипломиране."
            }
        });
}