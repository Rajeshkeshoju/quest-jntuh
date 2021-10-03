const express = require('express');
const path = require('path');
const fs = require('fs');
const mySql = require('mysql');

const app = express();
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/', express.static(__dirname + '/'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const PORT = 8000;

const index = fs.readFileSync('public/index.html');
const registerEvent = fs.readFileSync('public/registerEvent.html');

function log(logMessage) {
    console.log(logMessage);
}

var connection = mySql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'quest',

        multipleStatements: true,
        dateStrings: 'date'
    }
);

connection.connect(function (error) {
    if (error) {
        log('Database Connection failed');
    } else {
        log('Connected to Database');
    }   
});


var resultsUpdate = (req, res) => {

    var firstPlace = req.body.firstPlace;

    var secondPlace = "";
    if(secondPlace != undefined){
        secondPlace = req.body.secondPlace;
    }

    var thirdPlace = "";
    if(thirdPlace != undefined){
        thirdPlace = req.body.thirdPlace;
    }

     var eventId = req.body.eventCode;

    var insertQuery = "INSERT INTO winners VALUES ('"+ eventId +"', '"+ firstPlace +"', '1')";
    connection.query(insertQuery, (err, res) => {
        if(!err){
            log("Updated results");
        }else{
            log("Update error");
        }
    });

    // var insertQuery = "INSERT INTO winners(eventId, candidateId) VALUES ('"+ eventId +"', '"+ candidateId +"')";
    // connection.query(insertQuery, (err, res) => {
    //     if(!err){
    //         log("Updated results");
    //     }else{
    //         log("Update error");
    //     }
    // });

    return res.redirect('/' + eventId + '/eventResults');
}

app.post('/resultsUpdate', resultsUpdate);

app.get('/:eventCode/eventResults', (req, res) => {
    var selectionQuery = "SELECT * FROM candidates WHERE candidateId IN (SELECT candidateId FROM registers WHERE eventCode = '"+ req.params.eventCode +"')";
    
    connection.query(selectionQuery, (err, result) => {
        if(!err){
            res.render('eventResults.html', {winners: result, eventId: req.params.eventCode});
        }else{
            log(err);  
            throw err; 
        }
    });
});

app.get('/event/:eventCode', (req, res) => {
    var selectionQuery = "SELECT * FROM events WHERE eventId = '"+ req.params.eventCode +"'";
    connection.query(selectionQuery, (err, result) => {
        if(!err){
            res.render('event.html', {events: result});
        }else{
            log(err);  
            throw err; 
        }
    });
});

app.get('/manageEvent', (req, res) => {
    var selectionQuery = "SELECT * FROM events ORDER BY eventDate";
    connection.query(selectionQuery, (err, result) => {
        if (err) {
            log(err);  
            throw err;
        }
        else{
            res.render('manageEvent.html', {contests: result});
        }
    });
});

var candidateRegistration = (req, res) => {
    var fullName = req.body.fullName;
    var contactNumber = req.body.mobileNumber;
    var registeringContest = req.body.contestNames;

    var insertQuery = "INSERT INTO candidates (candidateId, candidateName, candidateContact) VALUES ('', '"+fullName+"', '"+contactNumber+"'); ";
    var getCandidateIdQuery = "SELECT candidateId FROM candidates WHERE candidateName = '"+ fullName +"'";

    connection.query(insertQuery, (err, result) => {

        if(!err){
            connection.query(getCandidateIdQuery, (err2, result2) => {
                if(!err2){
                    var updateRegistersQuery = "INSERT INTO registers (eventCode, candidateId) VALUES ('"+ registeringContest +"', '"+ result2[0].candidateId +"')";
                    connection.query(updateRegistersQuery, (err3, result3) => {
                        if(!err3){
                            log(result2[0].candidateId + "Registered for event succesfully");
                        }
                    });
                }
            });
        }

        if (err) {
            log("Error while registering for contest");
            log(err);
        }
        else{
            log("Candidate registered succesfully");
        }
    });

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
            log(err);
            throw err;  
        }
        else{
            log("Event registered succesfully");
        }

       return res.redirect('/registerEvent');
    });
};

app.post('/candidateRegistration', candidateRegistration);

app.get("/registerCandidate", (req, res) => {
    var selectionQuery = 'SELECT * FROM events';
    connection.query(selectionQuery, (err, result) => {
        if (err) {
            log(err);  
            throw err;
        }
        else{
            res.render('registerCandidate.html', {contests: result});
        }
    });
});

app.post('/eventRegistration', eventRegistration);

app.get('/registerEvent', (req,res)=>{
    res.write(registerEvent);
    res.end();
});

app.get("/", (req, res) => {
    var selectionQuery = 'SELECT * FROM fest';
    connection.query(selectionQuery, (err, result) => {
        if(!err){
            res.render('index.html', {fest: result});
        }else{
            log(err);  
            throw err; 
        }
    });
});

app.listen(PORT, () => {
    console.log('Application running at http://localhost:' + PORT);
});