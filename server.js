//Web framework for NodeJS to creat REST API
const express = require('express');
//To connect and extract database from the database
const db = require('./db');
//To extract the configurations of the file.
const config = require('config');

//Initializing express
const app = express();

//Simple get route to test db functions
app.get('/topActiveUsers?:page', async (req, res) => {
    let { page } = req.params;
    res.send(await db.getUsersByPageNumber(page));
});

//Listening at the appropriate port
app.listen(process.env.PORT || config.get('port'));