checkAlreadyLoggedIn();

function checkAlreadyLoggedIn() {
    if (localStorage.getItem('token') !== null) {
        fetch(`../api.php?endpoint=get_user_role`, {
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
                }
            })
            .then(data => {
                window.location.replace(`./${data.role}/${data.role}_home`);
            })

    }
}

const loginForm = document.getElementById("login_form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    fetch("../api.php?endpoint=login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((response) => {
            if (response.success) {
                localStorage.setItem("token", response.jwt);
                const moderator_roles = ["moderator-hat", "moderator-gown", "moderator-signature"];
                if (moderator_roles.includes(response.role)) {
                    window.location.replace(`./moderator/moderator_home`);
                }
                else {
                    window.location.replace(`./${response.role}/${response.role}_home`);
                }
            }
            else {
                document.querySelector("#message-bar-users").innerHTML = response.error;
            }
        });
});

const closeButton = document.querySelector(".close_button");
closeButton.addEventListener("click", (e) => {
    window.location.href = "../";
});