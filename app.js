const express = require('express');
const path = require('path');
const fs = require('fs');
const mySql = require('mysql');

const app = express();
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const PORT = 8000;

const index = fs.readFileSync('public/index.html');
const registerEvent = fs.readFileSync('public/registerEvent.html');
const registerCandidate = fs.readFileSync('public/registerCandidate.html');
const manageEvent = fs.readFileSync('public/manageEvent.html');

function log(logMessage) {
    console.log(logMessage);
}

var connection = mySql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'quest',

        multipleStatements: true
    }
);

connection.connect(function (error) {
    if (error) {
        log('Connection failed');
    } else {
        log('Connected');
    }   
});

var candidateRegistration = (req, res) => {
    var fullName = req.body.fullName;
    var contactNumber = req.body.mobileNumber;
    var registeringContest = req.body.contestNames;

    var insertQuery = "INSERT INTO candidates (candidateId, candidateName, candidateContact) VALUES ('', '"+fullName+"', '"+contactNumber+"'); ";
    var getCandidateIdQuery = "SELECT candidateId FROM candidates WHERE candidateName = '"+ fullName +"'";

    /* connection.query(insertQuery, (err, result) => {

        if(!err){
            connection.query(getCandidateIdQuery, (err, result2) => {
                if(!err){
                    
                    var updateRegistersQuery = "INSERT INTO registers (eventCode, candidateId) VALUES ('"+ registeringContest +"', '"+ result2.candidateId +"')";
                    connection.query(updateRegistersQuery, (err, result3) => {
                        if(!err){
                            
                        }
                    });
                }
            });
        }

        if (err) {
            log("Error while registering for contest");
            res.status(500).send(err);
            log(err);
        }
        else{
            log("Candidate registered succesfully");
            log(result);
        }
    }); */

    connection.query(insertQuery, (err, result) => {
        if (err) {
            log("Error while registering for contest");
            res.status(500).send(err);
            log(err);
        }
        else{
            log("Candidate registered succesfully");
            log(result);
        }
    });

    /* var candidateId;

    connection.query(getCandidateIdQuery, (err, result) => {
        if(!err){
            candidateId = result[0].candidateId;
        }else{
            log("err");
        }
    });

    log(registeringContest + " " + candidateId); */

    

    /* connection.query(updateRegistersQuery, (err, result) => {
        if(!err){
            log(result);
        }
    }); */

    return res.redirect('/registerCandidate');
};

var eventRegistration = (req, res) => {
    var eventName = req.body.eventName;
    var eventId = req.body.eventId;
    var eventDate = req.body.eventDate;
    var eventTime = req.body.eventTime;

    var insertQuery = "INSERT INTO events (eventId, eventName, eventDate, eventTime) VALUES ('"+eventId+"', '"+eventName+"', '"+eventDate+"', '"+eventTime+"'); ";
    connection.query(insertQuery, (err, result) => {
        if (err) {
            log("Error while registering for event");
            res.status(500).send(err);

            log(err);
            throw err;  
        }
        else{
            log("Event registered succesfully");
            log(result);
        }

       return res.redirect('/registerEvent');
    });
};

app.get("/", (req, res) => {
    res.write(index);
    res.end();
});

app.post('/candidateRegistration', candidateRegistration);

app.get("/registerCandidate", (req, res) => {
    var selectionQuery = 'SELECT eventId, eventName FROM events';
    connection.query(selectionQuery, (err, result) => {
        if (err) {
            log(err);  
            throw err;
        }
        else{
            res.render('registerCandidate.html', {contests: result});
            log(result);
        }
    });
});

app.post('/eventRegistration', eventRegistration);

app.get('/registerEvent', (req,res)=>{
    res.write(registerEvent);
    res.end();
});

app.get('/manageEvent', (req, res) => {
    var selectionQuery = 'SELECT * FROM events';
    connection.query(selectionQuery, (err, result) => {
        if (err) {
            log(err);  
            throw err;
        }
        else{
            res.render('manageEvent.html', {contests: result});
            log(result);
        }
    });
});

app.listen(PORT, () => {
    console.log("Connected at port:" + PORT);
});