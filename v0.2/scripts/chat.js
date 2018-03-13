"use strict";

const chatRooms = ["Nature", "Fitness", "M.o.L."];
let user = "";
let session = [];
let currentRoom = 0;
let socket = io();
let onlineUsers = [];
let tempUsersInWhichRoom = [];
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
    session[0] = new NewMessageInChat(0, user, createTimeStamp(), "NEW USER ONLINE!");
    setInterval(UserOnlineList,1000);
    $("#chatSubmit").on("click", sendMessage);
   // $("#chat").trigger("click");

    $("#log-out-button").on("click", logOutUser);

    $("#room0").click(function(){
        ChangeRoom(0);
    });
    $("#room1").click(function(){

        ChangeRoom(1);
    });
    $("#room2").click(function(){
        ChangeRoom(2);
    });
});



// *********************************************************************************************************************
function sendMessage(e)
{
    e.preventDefault();
    //session[0] = new NewMessageInChat(0, user, createTimeStamp(), "NEW USER ONLINE!");
    let messageFromClient =  `${createTimeStamp()}|${user}|${document.getElementById("chatmess").value}|${currentRoom}`;

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
        //e.preventDefault();
        let newChatMessage = msg.split("|");

        let tempDate = newChatMessage[0];
        let tempUsername = newChatMessage[1];
        let tempMessage = newChatMessage[2];

        let tempRoom = newChatMessage[3];

        session[session.length] = new NewMessageInChat(parseInt(tempRoom,10), tempUsername, tempDate, tempMessage);

        let userMessageBox = $("<div  class='userMessageBox'></div>");
        let messageBody = $("<div class='messageBody'></div>");
        let messageFromUser = $("<p class='messageFromUser'></p>");
        let messageInfo = $("<div class='messageInfo'></div>");
        let userName = $("<p class='userName'></p>");
        let timeStamp = $("<em class='timeStamp'></em>");

        userMessageBox.appendTo("#list-of-messages");
        messageBody.appendTo(userMessageBox);
        messageFromUser.text(tempMessage).appendTo(messageBody);
        messageInfo.appendTo(userMessageBox);
        userName.text(tempUsername).appendTo(messageInfo);
        timeStamp.text(tempDate).appendTo(messageInfo);


        $("#list-of-messages").scrollTop($("#elementToScrollTo").position().top);
        //let messageToDisplay = `${tempUsername} ${tempDate}: ${tempMessage}`;
        /*
        -------------------------------
        Gammal kod!
        -------------------------------

        let userMessageBox =
        $("<div  class='userMessageBox'></div>").prependTo("#list-of-messages");
        $("<div class='messageBody'></div>").appendTo(".userMessageBox");
        $("<p class='messageFromUser'></p>").text(tempMessage).appendTo(".messageBody");
        $("<div class='messageInfo'></div>").appendTo(".userMessageBox");
        $("<p class='userName'></p>").text(tempUsername).appendTo(".messageInfo");
        $("<em class='timeStamp'></em>").text(tempDate).appendTo(".messageInfo");
        */


        //$("<p class='messageFromUser'></p>").text(tempMessage).appendTo("#list-of-messages");
        console.log(session[length - 1].message); // stryk?
    });

    socket.on("new room", function(msg)
    {
        console.log("test if working...");
        LoadUserOnlineList();
        for(let i=0;i<tempUsersInWhichRoom.length;i++)

        $("#list-of-messages").empty();

        for (let index=0;index <session.length;index++)

        {
            let tempRoom = session[index].room;

            if(currentRoom === tempRoom && session[index].message !== "")
            {
                let sessionUser = `${session[index].user}`;
                let sessionDate =  `${session[index].date}`;
                let sessionMessage = `${session[index].message}`;

                let userMessageBox = $("<div  class='userMessageBox'></div>");
                let messageBody = $("<div class='messageBody'></div>");
                let messageFromUser = $("<p class='messageFromUser'></p>");
                let messageInfo = $("<div class='messageInfo'></div>");
                let userName = $("<p class='userName'></p>");
                let timeStamp = $("<em class='timeStamp'></em>");

                userMessageBox.appendTo("#list-of-messages");
                messageBody.appendTo(userMessageBox);
                messageFromUser.text(sessionMessage).appendTo(messageBody);
                messageInfo.appendTo(userMessageBox);
                userName.text(sessionUser).appendTo(messageInfo);
                timeStamp.text(sessionDate).appendTo(messageInfo);
                //$("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
             //    console.log(session[length - 1].message);
            }
        }

        console.log(session[length - 1].message); // stryk?
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
            //$("<h2></h2>").text(chatRooms[currentRoom]).appendTo("#list-of-users");
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
            let sessionUser = `${session[index].user}`;
            let sessionDate =  `${session[index].date}`;
            let sessionMessage = `${session[index].message}`;

            let userMessageBox = $("<div  class='userMessageBox'></div>");
            let messageBody = $("<div class='messageBody'></div>");
            let messageFromUser = $("<p class='messageFromUser'></p>");
            let messageInfo = $("<div class='messageInfo'></div>");
            let userName = $("<p class='userName'></p>");
            let timeStamp = $("<em class='timeStamp'></em>");

            userMessageBox.appendTo("#list-of-messages");
            messageBody.appendTo(userMessageBox);
            messageFromUser.text(sessionMessage).appendTo(messageBody);
            messageInfo.appendTo(userMessageBox);
            userName.text(sessionUser).appendTo(messageInfo);
            timeStamp.text(sessionDate).appendTo(messageInfo);
             console.log(session[length - 1].message);
        }
    }



}
// *********************************************************************************************************************