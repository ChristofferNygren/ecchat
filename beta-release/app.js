"use strict";
//----------------------------------------------------------------------------------------------------------------------
let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require("fs");
let server = http.createServer(app);
let io = require('socket.io').listen(server);
//----------------------------------------------------------------------------------------------------------------------
let currentUser = "";
let listOfUsersOnline = [];
let temp2 = [];
//----------------------------------------------------------------------------------------------------------------------
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(50000);

io.on('connection', function (socket) {
    console.log("Connected...");

    socket.on("chat message", function(msg)
    {
        io.emit('chat message', msg);
    });

});
//----------------------------------------------------------------------------------------------------------------------
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/login.html');
});
//----------------------------------------------------------------------------------------------------------------------
app.post('/login', function(req, res, next){

    if (!req.body.user.username || !req.body.user.password)
    {
        res.status(401).send("You are not authorized.");
    }

    else
    {
        let user = {
            information: []
        };

        fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data) {

            if (err)
            {
                console.log(err);
            }

            else
            {
                temp2 = JSON.parse(data);
            }
        });

        fs.readFile(__dirname + '/data/users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            }

            else {
                user = JSON.parse(data);
                let temp = req.body.user.username;
                console.log(temp);

                let counter = 0;

                for (let index in user.information)
                {
                    if (user.information[index].username === req.body.user.username)
                    {
                        for(let test in temp2.online)
                        {
                            if(user.information[index].username === temp2.online[test].username)counter++;
                        }

                        if(counter === 0)
                        {
                            if (user.information[index].password === req.body.user.password) {
                                user.information.push({
                                    username: req.body.user.username,
                                    password: req.body.user.password
                                });
                                currentUser = user.information[index].username;
                                console.log(`You have entered correct password for ${currentUser}.`);
                                res.redirect("/chat");
                                return next();
                            }
                        }
                    }
                }
            }
        });
        console.log("Access denied!");
    }
});
//----------------------------------------------------------------------------------------------------------------------
app.get('/chat', function(req, res)
{
    fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data)
    {
        if (err)
        {
            console.log(err);
        }

        else
        {
            listOfUsersOnline = JSON.parse(data);
            listOfUsersOnline.online.push({"username": currentUser});
            let jsonUsersOnline = JSON.stringify(listOfUsersOnline);

            fs.writeFile(__dirname + '/data/usersOnline.json', jsonUsersOnline, 'utf8', function (error) {
                if (error)
                {
                    return console.log(error);
                }
            });
        }
    });

    res.sendFile(__dirname + "/html/chat.html");
});
//----------------------------------------------------------------------------------------------------------------------
app.post("/chat", function(req, res, next)
{
    console.log(req.body.username);

    let tempListOfOnlineUsers = {
        online: []
    };

    let tempUser = req.body.username;

    fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data)
    {

        if (err)
        {
            console.log(err);
        }

        else
        {
            tempListOfOnlineUsers = JSON.parse(data);
            listOfUsersOnline.online.indexOf(tempUser);
            listOfUsersOnline.online.splice(tempUser,1);

            let jsonUsersOnline = JSON.stringify(listOfUsersOnline);

            fs.writeFile(__dirname + '/data/usersOnline.json', jsonUsersOnline, 'utf8', function (error) {
                if (error)
                {
                    return console.log(error);
                }
            });

            res.redirect("/logout");
            return next();
        }
    });

    res.sendFile(__dirname + "/html/logout.html");
});
//----------------------------------------------------------------------------------------------------------------------
app.post('/logout', function(req, res)
{

    let tempListOfOnlineUsers = {
        online: []
    };

    let tempUser = req.body.user;

    fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data)
    {

        if (err)
        {
            console.log(err);
        }

        else {
            tempListOfOnlineUsers = JSON.parse(data);

            let userToDel = 0;

            for (let i in tempListOfOnlineUsers.online)
            {
                if (listOfUsersOnline.online[i].username === tempUser) userToDel = i;
                console.log(tempListOfOnlineUsers.online[i].username);
            }

            //listOfUsersOnline.online.indexOf(tempUser);
            listOfUsersOnline.online.splice(userToDel, 1);

            let temp = {
                online: []
            };

            for (let i = 0; i < listOfUsersOnline.online.length; i++)
            {
                temp.online.push(listOfUsersOnline.online[i]);
            }

            let jsonUsersOnline = JSON.stringify(temp);

            fs.writeFile(__dirname + '/data/usersOnline.json', jsonUsersOnline, 'utf8', function (error){
                if (error)
                {
                    return console.log(error);
                }
            });
            currentUser = "";
        }
    });
    res.redirect("/");
});
//----------------------------------------------------------------------------------------------------------------------
app.get('/register', function(req, res)
{
    res.sendFile(__dirname + "/html/newuser.html");
});
//----------------------------------------------------------------------------------------------------------------------
app.post('/register', function(req,res)
{
    let user = {
        information: []
    };

    let jsonUser = JSON.stringify(user);

    fs.readFile(__dirname + '/data/users.json', 'utf8', function readFileCallback(err, data)
    {
        if (err)
        {
            console.log(err);
        }

        else
        {
            user = JSON.parse(data);
            user.information.push({username: req.body.user.username, password: req.body.user.password, fullname: req.body.user.fullname, email: req.body.user.email});
            jsonUser = JSON.stringify(user);

            fs.writeFile(__dirname + '/data/users.json', jsonUser, 'utf8', function(error)
            {
                if(error)
                {
                    return console.log(error);
                }
            });
        }});

    res.sendFile(__dirname + "/html/login.html");
});
//----------------------------------------------------------------------------------------------------------------------