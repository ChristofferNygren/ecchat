"use strict";

let socket = io();

document.getElementById("SignIn").addEventListener("submit",function () {
    let username = document.getElementById("user").value;
    console.log(username);
    localStorage.setItem("user",username);
});