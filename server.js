//Web framework for NodeJS to creat REST API
const express = require('express');
//To connect and extract database from the database
const utils = require('./utils/index');
//To extract the configurations of the file.
const config = require('config');

//Initializing express
const app = express();

//Get route to get a specified page of toActiveUsers
app.get('/topActiveUsers?:page', async (req, res) => {
    //Fetch page number from request query parameters
    const { page } = req.query;

    //If page umber is not a number or less than or equals to 0
    if (!isNaN(page) && page > 0) {
        try {
            //Fetch specified page of topActiveUsers using appropriate utility
            let topActiveUsers = await utils.getTopActiveUsers(page);

            topActiveUsers ?
            //If users exist on the page then send them back with http status code of 200[OK]
            res.status(200).send(topActiveUsers)
            //If no user exists on the page then send an empty array back with http status code of 204[No Content]
            : res.status(204).send([]);;
        }
        catch (err) {
            //If any error occured during database call or utility call then send back the error with stauts code 500[Internal Server Error]
            res.status(500).send(err);
        }
    }
    else{
        //If page number is not a number or is less than or equals to zero then send an error back with status code 400[Bad Request]
        res.status(400).send({ error: 'Ínvalid page number' });
    }
});

app.get('/users?:id', async (req, res) => {
    //Fetch user id from request query parameters
    const { id } = req.query;
    if (!isNaN(id) && id > 0) {
        try {
            //Fetch specified user with all of its details using appropriate utility
            let User = await utils.getUserDetails(id);
            User ?
            //If user exists then send it back with http status code of 200[OK] 
            res.status(200).send(User)
            //If user not exists then send an empty object back with http status code of 204[No Content]
            :res.status(204).send({});
        }
        catch (ex) {
            //If any error occured during database call or utility call then send back the error with stauts code 500[Internal Server Error]
            res.status(500).send(ex);
        }
    }
    else{
        //If id is not a number or less than or equals to zero then send an error back with status code 400[Bad Request]
        res.status(400).send({ error: 'Invalid user ID' });
    }
});




//Listening at the appropriate port
app.listen(process.env.PORT || config.get('port'));