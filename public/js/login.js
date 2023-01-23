if (sessionStorage.getItem("user") && sessionStorage.getItem("role")) {
    window.location.replace(`./${sessionStorage.getItem("role")}/${sessionStorage.getItem("role")}_home.html`);
}

// ЗАДЪЛЖИТЕЛНО ТРЯБВА ДА ГО ПРЕРАБОТИМ, ИЗПОЛЗВАЙКИ JWT, ЧЕ ИНАЧЕ ИМАМЕ МОЩНО SECURITY VULNERABILITY.
// ЗА МОМЕНТА ТОЗИ ВАРИАНТ Е КОЛКОТО ДА ИМАМЕ ЛОГВАНЕ НЯКАКВО И СВОБОДА ЗА ЗАНИМАВАНЕ С ДРУГИТЕ ФУНКЦИОНАЛНОСТИ
function loadSession(user) {
    sessionStorage.setItem("user", user.email);
    sessionStorage.setItem("role", user.role);
    sessionStorage.setItem("name", user.name);
}

const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    fetch("../api?endpoint=login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((response) => {
            if (response["success"]) {
                loadSession(response["user"]);
                window.location.replace(`./${response["user"].role}/${response["user"].role}_home.html`);
            }
            else {
                document.querySelector("#message-bar-users").innerHTML = response["error"];
            }
        });
});

const closeButton = document.querySelector(".close_button");
closeButton.addEventListener("click", (e) => {
    window.location.replace("../");
});