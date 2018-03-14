"use strict";

let user = "";
let session = [];
let currentRoom = 0;
let socket = io();
let statusForUpdateOfOnlineUsers = true;
let intervalForMessages;
// *********************************************************************************************************************
function NewMessageInChat(room, user,date,message)
{
    this.room = room;
    this.user = user;
    this.date = date;
    this.message = message;
}
// *********************************************************************************************************************
$(document).ready(function(){
    checkWhoIsHere();
    UserOnlineList();
    setInterval(UserOnlineList,1000);
    $("#chatMessSend").on("click", sendMessage);
    $("#log-out-button").on("click", logOutUser);
});

let userBoard = $("#userBoard");

$("#profile").click(function(){
    let userFullname = "";
    let userEmail = "";
    $.ajax({
        url: "../data/users.json",
        success: (response) => {

            for(let i in response.information)
            {
                if(response.information[i].username === user)
                {
                    userFullname = response.information[i].fullname;
                    userEmail = response.information[i].email;
                    $("#userFullName").text(userFullname);
                    $("#userEmail").text(userEmail);
                }
            }
        },
        error: () => {
            console.log('An error occured')
        }
    });


    $("#userUsername").text(user);
    userBoard.css("display","flex");
});

$("#closeUserBoard").click(function(){
    userBoard.hide();
    clearInterval(intervalForMessages);
});

$("#closeModal").click(function(){
    $(".overlay").css("display", "none");
});

$(".openChat").click(function(){
    let buttonId = $(this).attr("id");
    let messageArea = $("#list-of-messages");
    let title = $(".chatRoomTitle");
    console.log(buttonId);
    $(".overlay").css("height", $("#wrapper").height()).css("display", "flex");



    if (buttonId === "room0"){
        $(".chatModal").css("background", "url('../images/Nature.jpg')").css("background-size", "cover");
        title.text("Nature");
        currentRoom = 0;
        intervalForMessages = setInterval(newInformationToDisplay, 200);

    }
    else if (buttonId === "room1"){
        $(".chatModal").css("background", "url('../images/Fitness.jpg')").css("background-size", "cover");
        title.text("Fitness");
        currentRoom = 1;
        intervalForMessages = setInterval(newInformationToDisplay, 200);
    }
    else{
        $(".chatModal").css("background", "url('../images/MOL.jpg')").css("background-size", "cover");
        title.text("Meaning of Life");
        currentRoom = 2;
        intervalForMessages = setInterval(newInformationToDisplay, 200);
    }

    messageArea.scrollTop($("#elementToScrollTo").position().top);
});


// *********************************************************************************************************************
function sendMessage(e)
{
    e.preventDefault();
    let tempMessage = $("#chatmess").val();    // ---
    let messageFromClient =  `${createTimeStamp()}|${user}|${tempMessage}|${currentRoom}`;

    socket.emit("chat message", messageFromClient);

    //newInformationToDisplay();

    $("#chatmess").val("");
}
// *********************************************************************************************************************
function checkWhoIsHere()
{
    user = localStorage.getItem("user");
    $("#this-is-me").text(user);
}
// *********************************************************************************************************************
function newInformationToDisplay()
{
    $("#list-of-messages").empty();

    for (let index=0;index <session.length;index++)
    {
        let tempRoom = session[index].room;

        if(currentRoom === tempRoom && session[index].message !== "")
        {
            let userMessageBox = $("<div  class='userMessageBox'></div>");
            let messageBody = $("<div class='messageBody'></div>");
            let messageFromUser = $("<p class='messageFromUser'></p>");
            let messageInfo = $("<div class='messageInfo'></div>");
            let userName = $("<p class='userName'></p>");
            let timeStamp = $("<em class='timeStamp'></em>");

            messageBody.appendTo(userMessageBox);
            messageFromUser.text(session[index].message).appendTo(messageBody);
            messageInfo.appendTo(userMessageBox);
            userName.text(session[index].user).appendTo(messageInfo);
            timeStamp.text(session[index].date).appendTo(messageInfo);

            userMessageBox.appendTo("#list-of-messages");
            messageInfo.appendTo("#list-of-messages");
        }
    }
}
// *********************************************************************************************************************
function createTimeStamp()
{
    let currentDate = new Date().toLocaleString('en-GB');
    return `${currentDate}`;
}
// *********************************************************************************************************************
function logOutUser()
{
    window.location.assign("/html/logout.html");
}
// *********************************************************************************************************************
function UserOnlineList()
{
    if(statusForUpdateOfOnlineUsers) $.ajax({
        url: "../data/usersOnline.json",
        success: (response) => {
            $("#list-of-users").empty();

            for(let i in response.online)
            {
                let tempUser = response.online[i].username;

                $("<li></li>").text(tempUser).appendTo("#list-of-users");
            }

        },
        error: () => {
            console.log('An error occured')
        }
    });
}
// *********************************************************************************************************************
socket.on("chat message", function(msg)
{
    let newChatMessage = msg.split("|");

    let tempDate = newChatMessage[0];
    let tempUsername = newChatMessage[1];
    let tempMessage = newChatMessage[2];
    let tempRoom = newChatMessage[3];

    session[session.length] = new NewMessageInChat(parseInt(tempRoom,10), tempUsername, tempDate, tempMessage);

});