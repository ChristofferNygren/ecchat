"use strict";
let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require("fs");
let server = http.createServer(app);
let io = require('socket.io').listen(server);

//------------------------------
let currentUser = "";
let listOfUsersOnline = [];
// -----------------------------

app.use(express.static(__dirname + '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


server.listen(50000);

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/html/login.html');
});

io.on('connection', function (socket) {
    console.log("Connected...");

    socket.on("chat message", function(msg)
    {
        io.emit('chat message', msg);
    });

});

// -----------------------------

app.post('/', function(req, res, next) {

    if (!req.body.user.username || !req.body.user.password)  // Lägg till motsvarande RegExp som finns på klientsidan.
    {
        res.status(401).send("You are not authorized.");    // 401 = Unauthorized
    }

    else {

        let user = {
            information: []
        };

        //  let jsonUser = JSON.stringify(user);

        fs.readFile(__dirname + '/data/users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            }

            else {
                user = JSON.parse(data);
                user.information.push({username: req.body.user.username, password: req.body.user.password});


                for (let index in user.information) //(let index in user.information)
                {
                    if (user.information[index].username === req.body.user.username) {

                        if (user.information[index].password === req.body.user.password) {

                            currentUser = user.information[index].username;
                            console.log(`You have entered correct password for ${currentUser}.`);
                            listOfUsersOnline[listOfUsersOnline.length]=currentUser;

                            res.redirect("/chat");
                            return next();
                        }
                    }
                }
            }

        });

        console.log("Access denied!");
    }

});

//-----------------------------
app.get('/chat', function(req, res)
{
    console.log(`User signed in as ${currentUser}`);

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

app.post("/chat", function(req, res, next) // logga ut
{
    console.log(req.body.username);

    let tempListOfOnlineUsers = {
        online: []
    };




    let tempUser = req.body.username;
    console.log(tempUser);

    fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data)
    {

        if (err)
        {
            console.log(err);
        }

        else
        {
            tempListOfOnlineUsers = JSON.parse(data);

            ;
            let userToDel = 0;

            for(let i=0;i<tempListOfOnlineUsers.online.length;i++)
            {
                if(listOfUsersOnline.online[i].hasOwnProperty(tempUser)) userToDel = i;
            }

            Reflect.deleteProperty(listOfUsersOnline.online[i], "username");

      //      listOfUsersOnline.online.indexOf(tempUser);

      //      listOfUsersOnline.online.splice(tempUser,1);

            let jsonUsersOnline = JSON.stringify(listOfUsersOnline);

            fs.writeFile(__dirname + '/data/usersOnline.json', jsonUsersOnline, 'utf8', function (error) {
                if (error)
                {
                    return console.log(error);
                }
            });

        return next();

        }
    });

});
// -----------------------------
app.get('/logout', function(req, res)
{
    res.sendFile(__dirname + "/html/logout.html");
});

// -----------------------------

app.get('/register', function(req, res)
{
    res.sendFile(__dirname + "/html/newuser.html");
});

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
        user.information.push({username: req.body.user.username, password: req.body.user.password});
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


