    /*
        Login()
        Attempt login
    */
    async function Login(){
        var email = document.getElementById('input_login');
        var password = document.getElementById('input_password');

        jsonObj = {"user": email.value, "password": password.value};
        const request = await fetch("/login", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonObj)
        });

        var response = await request.text();
        if(response == "Successful Login"){
            localStorage.setItem('user', email.value);
            window.location.href = "../index.html";
        }
        else{
            document.getElementById('incorrect_notif').style.visibility = "visible";
        }
    }

    /*
        Register()
        Attempt register
    */
    async function Register(){
        var email = document.getElementById('input_login');
        var password = document.getElementById('input_password');

        jsonObj = {"user": email.value, "password": password.value};
        const request = await fetch("/register", {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonObj)
        });

        var response = await request.text();

        if(response == "Successful Register"){
            localStorage.setItem('user', email.value);
            window.location.href = "../index.html";
        }
        else{
            var notif = document.getElementById('incorrect_notif'); 
            notif.style.visibility = "visible";
            notif.innerText = "Account Already Exists";
        }
    }