let possibleSignsInUsername = new RegExp("^[A-Ba-b0-9_]{2,12}$");
let possibleSignsInPassword = new RegExp("^[A-Ba-b0-9_]{5,12}$");

$(document).ready(function(){
   $("#user").on("input", verifyUser);
   $("#userpass").on("input", verifyPassword);
   $("#userpassverify").on("input", verifyConsistentPassword);
   $("#submit-button").on("click", function(){
       if(verifyUser() && verifyPassword() && verifyConsistentPassword() && checkIfUsed())
       {
           $("#register").submit();
       }
       else $("#register").reset();
   });

});



// *********************************************************************************************************************
function verifyUser()
{
    let usernameInputed = $("#user").text();

    return !possibleSignsInUsername.test(usernameInputed);
}
// *********************************************************************************************************************
function checkIfUsed()
{



    $.ajax({
        url: "../data/users.json",
        success: (users) => {
            for (let index in users.information)
            {

                if(users.information[index].username === $("#user").text())
                {
                    $("#infoUser").text("Username is busy.");
                    return false;
                }

            }
        },
        error: () => {
            console.log('An error occured')
        }
    });


    return true;
}
// *********************************************************************************************************************
function verifyPassword()
{
    let passwordInputed = $("#userpass").text();

    return !possibleSignsInPassword.test(passwordInputed);
}
// *********************************************************************************************************************
function verifyConsistentPassword()
{
    let passwordInputed = $("#userpass").text();
    let passwordInputedVerify = $("#userpassverify").val();

    return passwordInputed === passwordInputedVerify;
}
// *********************************************************************************************************************