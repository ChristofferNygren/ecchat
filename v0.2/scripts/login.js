"use strict";

let socket = io();

$("#SignIn").on("submit",function () {
    let username = $("#user").text();

    localStorage.setItem("user",username);
});