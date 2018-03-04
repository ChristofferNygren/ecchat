"use strict";
let http = require('http');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fs = require("fs");
let server = http.createServer(app);
let io = require('socket.io').listen(server);
let multer  = require('multer');
let upload = multer({ dest: __dirname + '/images/uploads/' });
//------------------------------
let currentUser = "";
let listOfUsersOnline = [];
let temp2 = [];

let log = [{
    user: "",
    userLog: [],
    status: "",
}];
// -----------------------------

app.use(express.static(__dirname + '/'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


server.listen(50000);

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/html/login.html');
});

io.on('connection', function (socket) {
  //  console.log("Connected...");

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

        // ----------

        fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data) {

            if (err) {
                console.log(err);
            }

            else {
                temp2 = JSON.parse(data);
            }
        });

        console.log(temp2);

        // ----------


        fs.readFile(__dirname + '/data/users.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            }

            else {
                user = JSON.parse(data);


             //   console.log(`Lista: ${user.information[0].username}`);

                let temp = req.body.user.username;
                console.log(temp);

                let counter = 0;

                for (let index in user.information) //(let index in user.information)
                {
                    if (user.information[index].username === req.body.user.username)
                    {

                        for(let test in temp2.online)
                        {
                            if(user.information[index].username === temp2.online[test].username)counter++;
                        }

                        if(counter === 0 && CheckIfOKToTry(req.body.user.username) !== "notAllowedToTry")
                        {

                            if (user.information[index].password === req.body.user.password) {
                                user.information.push({
                                    username: req.body.user.username,
                                    password: req.body.user.password
                                });
                                currentUser = user.information[index].username;
                                ClearLogAttempts(currentUser);
                                console.log(`You have entered correct password for ${currentUser}.`);

                                res.redirect("/chat");
                                return next();
                            }
                        }
                    }
                }
            }

        });

        LogAttempt(req.body.user.username);

        console.log("Access denied!");
    }

});

//-----------------------------
app.get('/chat', function(req, res)
{
  //  console.log(`User signed in as ${currentUser}`);
    if(currentUser==="")  res.status(401).send("You are not authorized.");

    else {

        fs.readFile(__dirname + '/data/usersOnline.json', 'utf8', function readFileCallback(err, data) {

            if (err) {
                console.log(err);
            }

            else {
                listOfUsersOnline = JSON.parse(data);
                listOfUsersOnline.online.push({"username": currentUser});
                let jsonUsersOnline = JSON.stringify(listOfUsersOnline);

                fs.writeFile(__dirname + '/data/usersOnline.json', jsonUsersOnline, 'utf8', function (error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
        });

        res.sendFile(__dirname + "/html/chat.html");
    }
});


app.post('/logout', function(req, res) // logga ut
{
 //   console.log(req.body);
    console.log(req.body.user);




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

        else
        {
            tempListOfOnlineUsers = JSON.parse(data);
            console.log(tempListOfOnlineUsers.online);

            let userToDel = 0;

            for(let i in tempListOfOnlineUsers.online)
            {

                if(listOfUsersOnline.online.indexOf(tempUser)) userToDel = i;
                console.log(tempListOfOnlineUsers.online[i].username);
            }
//tempListOfOnlineUsers.online[i].hasOwnProperty(tempUser)
         //   Reflect.deleteProperty(tempListOfOnlineUsers.online[userToDel], "username");

            console.log(userToDel);

      //      listOfUsersOnline.online.indexOf(tempUser);

           listOfUsersOnline.online.splice(userToDel,1);



            console.log(listOfUsersOnline.online);
            let temp = {
                online: []
            };

            for(let i=0;i<listOfUsersOnline.online.length;i++)
            {
                temp.online.push(listOfUsersOnline.online[i]);
            }

            let jsonUsersOnline = JSON.stringify(temp);

            fs.writeFile(__dirname + '/data/usersOnline.json', jsonUsersOnline, 'utf8', function (error) {
                if (error)
                {
                    return console.log(error);
                }
            });
            currentUser = "";





        }
    });

  //  res.sendFile(__dirname + "/html/login.html");
});

// -----------------------------

app.get('/register', function(req, res)
{
    res.sendFile(__dirname + "/html/newuser.html");
});

app.post('/register', upload.single('UserImage'), function(req,res)
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


function LogAttemptToSignIn(attemptDate)
{
    this.attemptDate = attemptDate;
}


function CheckIfOKToTry(user)
{
    for(let i in log)
    {
        if(user === log[i].user)
        {
            CheckIfLogForUserShouldBeCleared(i);
            if(log[i].userlog.length > 5)
            {
                let seconds = (log[i].userlog[0].attemptDate.getTime() - log[i].userlog[4].attemptDate.getTime()) / 1000;
                if(seconds < 20) log[i].status = "notAllowedToTry";
            }
        }
    }
}

function CheckIfLogForUserShouldBeCleared(userIndex)
{

    if(log[userIndex].userLog.length > 5)
    {
        let differenceInTime = (log[userIndex].userLog[0].attemptDate.getTime() - log[userIndex].userLog[4].attemptDate.getTime());
        if(differenceInTime >= 20) log[userIndex].status = "AllowedToTry";
    }

}

function ClearLogAttempts(user)
{
    for(let i in log)
    {
        if (user === log[i].user)
        {
            log[i].userLog = [];
        }
    }

}

function LogAttempt(user)
{
    for(let i in log)
    {
        if (user === log[i].user)
        {
            let tempDateForAttempt = new Date();
            log[i].userLog = new LogAttemptToSignIn(tempDateForAttempt);
        }
    }
}