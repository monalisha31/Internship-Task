const { urlencoded } = require('express');
const express = require('express');
const fast2sms = require('fast-two-sms')
const app = express();
const cors = require("cors");
const pool = require('./db');
var fileSystem = require("fs");
var fastcsv = require("fast-csv");
const translate = require("translate");
translate.engine = "google";
translate.key = process.env.TRANSLATE_KEY;

require('dotenv').config();
const port = 3000;

app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Task 1

/* One of our clients wanted to search for slangs 
(in local language) for an answer to a text question on the 
basis of cities (which was the answer to a different MCQ question)*/

function task1(req, res, next) {
    console.log(req.query);
    try{
        const text = await translate(req.query.word, req.query.lang);
        res.send(text); 
    }
    catch(err){
        res.send(err.message); 
    }
    next();
};


// Task 2
/*A market research agency wanted to validate responses coming 
in against a set of business rules (eg. monthly savings 
cannot be more than monthly income) and send the 
response back to the data collector to fix it when the rules generate a flag  */

function task2(req, res, next) {
    const { income_per_annum, savings_per_annum, mobile_number } = req.body;

    if (income_per_annum < savings_per_annum) {
        res.send("Please, enter the correct amount!");
    }
    else if (isNaN(mobile_number)) {
        res.send("Please, Enter the correct number!");
    }
    else if (mobile_number.length !== 10) {
        res.send("Phone number should be of 10 digits!");
    }
    next();
};

// Task - 3
/* A very common need for organizations is wanting all their data onto Google Sheets, 
wherein they could connect their CRM, and also generate graphs and charts offered by 
Sheets out of the box. In such cases, each response to the form becomes a row in the 
sheet, and questions in the form become columns.  */

async function task3(req, res) {
    try {
        let data = await pool.query("SELECT * FROM client_income_data");
        data = data.rows;

        var file = fileSystem.createWriteStream("static/db.csv");
        fastcsv
            .write(data, { headers: true })
            .on("finish", function() {
 
                res.send("<a href='/static/db.csv' download='db.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>");
            })
            .pipe(file);

    } catch (err) {
        console.log(err.message);
    }
}

// Task - 4
/* A recent client partner wanted us to send an SMS to the customer whose details 
are collected in the response as soon as the ingestion was complete reliably. 
The content of the SMS consists of details of the customer, which were a part 
of the answers in the response. This customer was supposed to use this as a 
“receipt” for them having participated in the exercise. */

async function task4(req, res) {
    try {
        const {client_email, client_name, mobile_number} = req.body;
        var options = { authorization: process.env.API_KEY, message: ` Thank you for participating in the exercise :\n Email ID :${client_email}\n Name : ${client_name}\n Contact : ${mobile_number}`, numbers: [mobile_number] };
        const response = await fast2sms.sendMessage(options); 
        res.send(response.message);
    } catch (err) {
        res.send("Some Information is missing. Failed to send the SMS!");
    }
}


app.get('/task-1',task1, (req, res) => {});

app.post('/task-2', task2, async (req, res) => {
    try {
        const { email, name, income_per_annum, savings_per_annum, mobile_number } = req.body;
        const newClient = await pool.query("INSERT INTO client_data(email,name,income_per_annum,savings_per_annum,mobile_number) VALUES($1,$2,$3,$4,$5) RETURNING *", [email, name, income_per_annum, savings_per_annum, mobile_number]);
        res.json(newClient.rows[0]);
    } catch (err) {
        res.send(err.message);
    }
});

app.get('/validateAll', async (req, res) => {
    try {
        let inValidRows = await pool.query("SELECT * FROM client_data WHERE savings > income");
        inValidRows = inValidRows.rows;
        if(inValidRows.length === 0)
        {
            res.send("All records are Valid");
        }
        else {
            res.send(inValidRows);
        }
    } catch (err) {
        console.log(err.message);
    }
});

app.get('/task-3', task3, (req, res) => { });

app.post('/task-4', task4, (req, res) => { });

app.listen(port, () => {
    console.log(`Server is listening at port : ${port}`);
});