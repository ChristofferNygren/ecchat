/*
- Behandling av full name, email, image(?)

exempel:

let possibleSignsInUsername="^[A-Ba-b0-9_]{2,12}$";

let tempUsernameInput = document .... value;
if(possibleSignsInUsername.test(tempUsernameInput))
{
//valid username
}
else
{
output: rules for username samt loopa igenom strängen och undersök
tecken för tecken vilka tecken som var otillåtna i det angivna användarnamnet.
}


*/


let checkUser = document.getElementById("user");
checkUser.addEventListener("input",verifyUser,false);

let checkPassword = document.getElementById("userpass");
checkPassword.addEventListener("input",verifyPassword, false);

let userpassverify = document.getElementById("userpassverify");
userpassverify.addEventListener("input",verifyConsistentPassword, false);
// *********************************************************************************************************************
function verifyUser()
{
    let usernameInputed = document.getElementById("user").value;

    if(usernameInputed.length >= 3 && checkIfUsed())
    {
        document.getElementById("userpass").removeAttribute("disabled");

    }
}
// *********************************************************************************************************************
function checkIfUsed()
{
    let xmlhttp = new XMLHttpRequest();
    let users;

    xmlhttp.onreadystatechange = function ()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            users = JSON.parse(this.responseText);

            for (let index in users.information)
            {

                if(users.information[index].username === checkUser.value)
                {
                    document.getElementById("infoUser").innerHTML = "Username is taken.";
                    return false;
                }

                else
                {
                    document.getElementById("infoUser").innerHTML = "";
                }

            }
        }
    };
    xmlhttp.open("GET", "users.json", true);
    xmlhttp.send();

    return true;
}
// *********************************************************************************************************************
function verifyPassword()
{
    let passwordInputed = document.getElementById("userpass").value;
    if(passwordInputed.length >= 3)
    {
        document.getElementById("userpassverify").removeAttribute("disabled");

    }
}
// *********************************************************************************************************************
function verifyConsistentPassword()
{
    let passwordInputed = document.getElementById("userpass").value;
    let passwordInputedVerify = document.getElementById("userpassverify").value;

    if(passwordInputed === passwordInputedVerify)
    {
        document.getElementById("submit-button").removeAttribute("disabled");

    }
}
// *********************************************************************************************************************