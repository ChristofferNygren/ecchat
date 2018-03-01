"use strict";

const chatRooms = ["Room one", "Room two", "Room three"];

let user = {username: "New user enters chat", session: [{room: chatRooms[0], user: "", date: "", message: ""}]};

let socket = io();

let onlineUsers = new Array();

// *********************************************************************************************************************
function NewMessageInChat(room,user,date,message)
{
    this.room = room;
    this.user = user;
    this.date = date;
    this.message = message;
}

user.session[0] = new NewMessageInChat("ddd","ddd","ddd","User online!");

let logOutButton = document.getElementById("log-out-button");
logOutButton.addEventListener("click", logOutUser);
/*
document.addEventListener("load",function(){
    let tempUser = localStorage.getItem("user");
    if(!tempUser) window.location.href="login.html"; // titta på!
});
*/
window.addEventListener("load",checkWhoIsHere);

// *********************************************************************************************************************
// ----------- CLIENT-SIDE CHAT:

document.addEventListener("submit", sendMessage);

function sendMessage(e)
{
    e.preventDefault();

    let messageFromClient =  `${createTimeStamp()}|${user.username}|${document.getElementById("chatmess").value}`;

    socket.emit("chat message", messageFromClient);

    // socket.emit("user active", messageFromClient);

    newMessages();

    document.getElementById("chatmess").value = "";
}

function checkWhoIsHere() //uppdatera med setInterval istället!
{
    user.username = localStorage.getItem("user");
    console.log(`${user.username} online!`);
    document.getElementById("this-is-me").innerText = user.username;
}

function newMessages()
{
    socket.on("chat message", function(msg)
    {
        let newChatMessage = msg.split("|");
        let tempDate = newChatMessage[0];
        let tempUsername = newChatMessage[1];
        let tempMessage = newChatMessage[2];



        let tempCounter=0;

        for(let i=0;i < user.session.length;i++)
        {

            if(user.session[i].message === tempMessage) tempCounter++;
            else user.session[length].message = tempMessage;

        }

        if(tempCounter <= 1)
        {

            let messageToDisplay = `${tempUsername} ${tempDate}:
            ${tempMessage}`;
            let paragraph = document.createElement("p");
            let chatMessage = document.createTextNode(messageToDisplay);
            paragraph.appendChild(chatMessage);
            document.getElementById("list-of-messages").appendChild(paragraph);
            console.log(user.session[length-1].message);

        }

    });

}

// *********************************************************************************************************************
function createTimeStamp()
{
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;

    let day = currentDate.getDay();

    let hours = currentDate.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = currentDate.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${year}/${month}/${day} ${hours}:${minutes}`;
}


// *********************************************************************************************************************
function logOutUser()
{
    console.log(`${user.username} loged out.`);
    let logoutUser = onlineUsers.indexOf(user.username);
    if(logoutUser >= 0) onlineUsers.splice(logoutUser,1);
    for(let i=0;i<onlineUsers.length;i++) console.log(onlineUsers[i].username);

    // skriv ÖVER (uppdatera) onlineUser.json = ta bort user.username från listan...

    user = "";
    document.getElementById("login").style.display = "block";
    document.getElementById("chat-wrapper").style.display = "none";
    window.location.href="login.html";
}
// *********************************************************************************************************************
