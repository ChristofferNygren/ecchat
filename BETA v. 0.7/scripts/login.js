"use strict";

let socket = io();

$("#SignIn").on("submit",function () {
    let username = $("#user").val();

    localStorage.setItem("user",username);
});