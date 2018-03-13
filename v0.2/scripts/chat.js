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
    $("#chat").on("click", sendMessage);
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



    ChangeRoom(0);
});



// *********************************************************************************************************************
function sendMessage(e)
{
    e.preventDefault();
    session[0] = new NewMessageInChat(0, user, createTimeStamp(), "NEW USER ONLINE!");
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

        $("#list-of-messages").empty();

        for (let index=0;index <session.length;index++)
        {
            let tempRoom = session[index].room;

            if(currentRoom === tempRoom && session[index].message !== "")
            {
                let messageToDisplay = `${session[index].user} ${session[index].date} ${session[index].message}`;

                $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
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
            $("<h2></h2>").text(chatRooms[currentRoom]).appendTo("#list-of-users");
            for(let i in response.online)
            {
                let tempUser = response.online[i].username;

                $("<p></p>").text(tempUser).appendTo("#list-of-users");
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
            let messageToDisplay = `${session[index].user} ${session[index].date} ${session[index].message}`;

            $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
             console.log(session[length - 1].message);
        }
    }



}
// *********************************************************************************************************************