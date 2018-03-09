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
tempUsersInWhichRoom[0] = new UserInRoom("Invisible Man", 0);
// *********************************************************************************************************************
function NewMessageInChat(room, user,date,message)
{
    this.room = room;
    this.user = user;
    this.date = date;
    this.message = message;
}
session[0] = new NewMessageInChat(0, user, createTimeStamp(), "NEW USER ONLINE!");
// *********************************************************************************************************************

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

$(document).ready(function(){
    checkWhoIsHere();
    setInterval(LoadUserOnlineList,1000); //jämför den med onlineUsers med temp..?
    UserOnlineList();
});

$(document).on("submit", sendMessage);
// *********************************************************************************************************************
function sendMessage(e)
{
    e.preventDefault();

    let messageFromClient =  `${createTimeStamp()}|${user}|${document.getElementById("chatmess").value}|${currentRoom}`;

    socket.emit("chat message", messageFromClient);

    let tempChatroom = currentRoom + user;

    socket.emit("new room", tempChatroom);

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
function newInformationToDisplay(e)
{
// e.preventDefault();

    socket.on("chat message", function(msg)
    {


        let newChatMessage = msg.split("|");

        let tempDate = newChatMessage[0];
        let tempUsername = newChatMessage[1];
        let tempMessage = newChatMessage[2];

        let tempRoom = newChatMessage[3];

        session[session.length] = new NewMessageInChat(parseInt(tempRoom,10), tempUsername, tempDate, tempMessage);

        let messageToDisplay = `${tempUsername} ${tempDate}: ${tempMessage}`;

        $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
        console.log(session[length - 1].message); // stryk?
    });

    socket.on("new room", function(msg)
    {
        LoadUserOnlineList();
        for(let i=0;i<tempUsersInWhichRoom.length;i++)
        {
            if(tempUsersInWhichRoom[i].user === msg.substring(1))
            {
                for(let index=0;index < onlineUsers.length; index++)
                {
                    if(tempUsersInWhichRoom[i].user === onlineUsers[index])
                    {
                        tempUsersInWhichRoom[i].room = parseInt(msg[0]);
                    }
                }
            }
        }
        UserOnlineList();
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
$("#list-of-users").empty();

    let tempCounter = new Array(onlineUsers.length);
    for(let reset=0;reset<tempCounter.length;reset++) tempCounter[reset] = 0;
$("<h2></h2>").text(chatRooms[currentRoom]).appendTo("#list-of-users");

    for(let index=0;index<tempUsersInWhichRoom.length;index++)
    {
        if(currentRoom === tempUsersInWhichRoom[index].room)
        {
            for(let i=0;i < onlineUsers.length;i++)
            {
                if(tempUsersInWhichRoom[index] === onlineUsers[i])
                {
                    tempCounter[i]++;

                    if(tempCounter[i] === 1)
                    {
                        let tempUser = onlineUsers[index];
                        $("<p></p>").text(tempUser).appendTo("#list-of-users");
                        //   console.log(session[length - 1].message); //error, testa ersätt med preventDefault
                    }
                }
            }


        }
    }
}
// *********************************************************************************************************************
function LoadUserOnlineList()
{
    if(statusForUpdateOfOnlineUsers) $.ajax({
        url: "../data/usersOnline.json",
        success: (response) => {
            $("#list-of-users").empty();

            for(let i in response.online)
            {
                let tempUser = response.online[i].username;
                onlineUsers[onlineUsers.length] = tempUser;

                tempUsersInWhichRoom[tempUsersInWhichRoom.length] = new UserInRoom(tempUser, 0);
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

    for(let index=0;index<tempUsersInWhichRoom.length;index++)
    {
        if(user === tempUsersInWhichRoom[index].user)
        {
            tempUsersInWhichRoom[index].room = currentRoom;
        }
    }

    for (let index=0;index <session.length;index++)
    {
        let tempRoom = session[index].room;

        if(currentRoom === tempRoom)
        {
            let messageToDisplay = `${session[index].user} ${session[index].date} ${session[index].message}`;

            $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
            // console.log(session[length - 1].message);
        }
    }
}
// *********************************************************************************************************************