let possibleSignsInUsername = new RegExp("^[A-Ba-b0-9_]{2,12}$");
let possibleSignsInPassword = new RegExp("^[A-Ba-b0-9_]{5,12}$");

$(document).ready(function(){
   $("#user").on("input", verifyUser);
   $("#userpass").on("input", verifyPassword);
   $("#userpassverify").on("input", verifyConsistentPassword);
   $("#submit-button").on("click", function(){
       if(checkIfUsed()) $("#register").submit();
       else $("#register").reset();
   });

});



// *********************************************************************************************************************
function verifyUser()
{
    let usernameInputed = $("#user").text();

    if(possibleSignsInUsername.test(usernameInputed))
    {
      //  $("#userpass").removeAttr("disabled");


    }

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

                else
                {
                    $("#infoUser").text("This field is required.");
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

    if(possibleSignsInPassword.test(passwordInputed))
    {
    //...

    }
}
// *********************************************************************************************************************
function verifyConsistentPassword()
{
    let passwordInputed = $("#userpass").text();
    let passwordInputedVerify = $("#userpassverify").val();

    if(passwordInputed === passwordInputedVerify)
    {
        //...

    }
}
// *********************************************************************************************************************