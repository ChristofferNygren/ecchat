"use strict";

const chatRooms = ["Room one", "Room two", "Room three"];

let user = "";

let session = [];

let currentRoom = 0;



let socket = io();

let onlineUsers = [];

let statusForUpdateOfOnlineUsers = true;


//user.session[0] = new NewMessageInChat(0, user.username,createTimeStamp(),`= ONLINE!`);

// *********************************************************************************************************************
function NewMessageInChat(room, user,date,message)
{
    this.room = room;
    this.user = user;
    this.date = date;
    this.message = message;
}

session[0] = new NewMessageInChat(0, user, createTimeStamp(), "NEW USER ONLINE!");


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
    UserOnlineList();
    setInterval(UserOnlineList,1000);


});



// *********************************************************************************************************************
// ----------- CLIENT-SIDE CHAT:


$(document).on("submit", sendMessage);



function sendMessage(e)
{
    e.preventDefault();

    let messageFromClient =  `${createTimeStamp()}|${user}|${document.getElementById("chatmess").value}|${currentRoom}`;

    socket.emit("chat message", messageFromClient);

    newMessages();

    $("#chatmess").val("");

}

function checkWhoIsHere()
{
    user = localStorage.getItem("user");

    $("#this-is-me").text(user);





}

function newMessages()
{

    socket.on("chat message", function(msg)
    {
        let newChatMessage = msg.split("|");

        let tempDate = newChatMessage[0];
        let tempUsername = newChatMessage[1];
        let tempMessage = newChatMessage[2];

        let tempRoom = newChatMessage[3];

        session[session.length] = new NewMessageInChat(tempRoom, tempUsername, tempDate, tempMessage);

/*
            let tempCounter = 0;

            for (let i = 0; i < session.length; i++)
            {

                if (session[i].message === tempMessage) tempCounter++;
                */
            //    else
                 //   session[session.length].message = tempMessage;

           // }

       //     if (tempCounter <= 1) {

                for(let index=0;index < 3;index++) // <<<<
                {
                let tempRoom = parseInt(session[index].room, 10);
                    if(currentRoom === tempRoom)
                    {
                        let messageToDisplay = `${tempUsername} ${tempDate}: ${tempMessage}`;

                        $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
                        console.log(session[length - 1].message); //error, testa ersätt med preventDefault

                    }
                }


         //  }


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

                $("<p></p>").text(tempUser).appendTo("#list-of-users");
            }

        },
        error: () => {
            console.log('An error occured')
        }
    });

}

function ChangeRoom(newRoom)
{

$("#list-of-messages").empty();

currentRoom = newRoom;

    for(let i=0;i<3;i++)
    {

        for (let index in session)
        {
            let tempRoom = parseInt(session[index].room, 10);
            if(currentRoom === tempRoom)
            {

                let messageToDisplay = `${session[i].user} ${session[i].date}: ${session[i].message}`;

                $("<p></p>").text(messageToDisplay).appendTo("#list-of-messages");
                console.log(session[length - 1].message);
            }
        }
    }
}