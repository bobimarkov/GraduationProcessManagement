
make();

function make() {
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
                location.reload();
                //console.log(data.message);
            }
        });
}