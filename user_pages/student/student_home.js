

function submitRequestSpeechAnswer(email, value) {
    // value = 1, 0
    var requestData = {
        "column_name": "speech_response",
        "email": email,
        "value": value
    };
    fetch('../../services/submit_student_action.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {

            }
        });
}

function setAttandance(email, checkbox) {
    var value = checkbox.checked ? 1 : 0;
    console.log(value);
    var requestData = {
        "column_name": "attendance",
        "email": email,
        "value": value
    };
    fetch('../../services/submit_student_action.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {

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
    fetch('../../services/submit_student_action.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {

            }
        });
}

function requestDiplomaInAdvance(email, event, value) {
    // value = 0, 1
    event.preventDefault();
    var form = document.getElementById('request_diploma_in_advance_form');
    var comment = form.request_diploma_in_advance_comment.value;

    var requestData = {
        "column_name": "take_in_advance_request",
        "email": email,
        "comment": comment,
        "value": value
    };

    fetch('../../services/submit_student_action.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
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

                if (document.getElementById("request_diploma_in_advance").style.display == "block") {
                    document.getElementById("request_diploma_in_advance").style.display = "none";
                    document.getElementById("cancel_request_diploma_in_advance").style.display = "block";
                } else {
                    document.getElementById("request_diploma_in_advance").style.display = "block";
                    document.getElementById("cancel_request_diploma_in_advance").style.display = "none";
                }

            }
        });
}

function requestGrown(email, value) {
    // value = 1, 0
    var requestData = {
        "column_name": "grown_requested",
        "email": email,
        "value": value
    };
    console.log(requestData)
    fetch('../../services/submit_student_action.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {
                location.reload();
            }
        });
}

function requestHat(email, value) {
    // value = 1, 0
    var requestData = {
        "column_name": "hat_requested",
        "email": email,
        "value": value
    };
    console.log(requestData);
    fetch('../../services/submit_student_action.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then((data) => {
            if (!data.success) {

            } else {
                location.reload();
            }
        });
}