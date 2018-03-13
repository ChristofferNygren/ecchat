"use strict";

let user = "";
let session = [];
let currentRoom = 0;
let socket = io();
let statusForUpdateOfOnlineUsers = true;
// *********************************************************************************************************************
function UserInRoom(user, room)
{
    this.user = user;
    this.room = room;
}
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
        ChangeRoom(0);
    }
    else if (buttonId === "room1"){
        $(".chatModal").css("background", "url('../images/Fitness.jpg')").css("background-size", "cover");
        title.text("Fitness");
        ChangeRoom(1);
    }
    else{
        $(".chatModal").css("room2", "url('../images/MOL.jpg')").css("background-size", "cover");
        title.text("Meaning of Life");
        ChangeRoom(2);
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

    newInformationToDisplay();

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
    socket.on("chat message", function(msg)
    {
        let newChatMessage = msg.split("|");

        let tempDate = newChatMessage[0];
        let tempUsername = newChatMessage[1];
        let tempMessage = newChatMessage[2];
        let tempRoom = newChatMessage[3];

        session[session.length] = new NewMessageInChat(parseInt(tempRoom,10), tempUsername, tempDate, tempMessage);

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
                messageFromUser.text(tempMessage).appendTo(messageBody);
                messageInfo.appendTo(userMessageBox);
                userName.text(tempUsername).appendTo(messageInfo);
                timeStamp.text(tempDate).appendTo(messageInfo);
                userMessageBox.appendTo("#list-of-messages");
                messageInfo.appendTo("#list-of-messages");
                console.log(session[length - 1].message); // stryk?
            }
        }
        $("#list-of-messages").scrollTop($("#elementToScrollTo").position().bottom);
        console.log(session[length - 1].message);
    });
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
function ChangeRoom(newRoom)
{
    $("#list-of-messages").empty();
    currentRoom = newRoom;

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