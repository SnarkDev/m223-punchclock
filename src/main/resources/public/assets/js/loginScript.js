const createUser = (e) => {
    jQuery("#loginBtn").click(function () {
        getData($("#username").val(), $("#password").val());
    });

    jQuery("#loginClass").ready(function () {
        jQuery("#username").val(entry.checkIn.substring(0, 10))

        fetch("http://localhost:8081/users/sign-up", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        })
    });


}
const getData = (username, password) => {
    alert(username +' '+ password);
}