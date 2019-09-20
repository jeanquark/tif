const express = require('express'),
      bodyParser = require('body-parser'),
      moment = require('moment'),
      admin = require('firebase-admin');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

module.exports = app.use(async function (req, res, next) {
    try {
    	console.log('req.body: ', req.body);
    	const { userId } = req.body;
    	console.log('userId: ', userId);

        // await admin.auth().deleteUser(userId)
        res.status(200).send('POST request to delete user succeeded!')
    } 
    catch (error) {
        // res.status(500).send(`Server error, user could not be registered, ${error}`);
        // res.end(`Server error, user could not be deleted: ${error}`)
        res.status(500).send(`Server error, user could not be deleted: ${error}`)
    }
});