const express = require('express'),
      http = require('http'),
      url = require('url'),
      bodyParser = require('body-parser'),
      admin = require('firebase-admin');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

module.exports = app.use(function (req, res, next) {
    // console.log('SETCUSTOMCLAIMS');
    // console.log(req.body);
    const action = req.body.action;
    const userEmail = req.body.userEmail;

    if (action == 'userToAdmin') {
        // console.log(action);
        admin.auth().getUserByEmail(userEmail).then((user) => {
            console.log(user);
            return admin.auth().setCustomUserClaims(user.uid, {
                admin: true
            }).then(() => {
                // console.log('user: ', user);
                // console.log('USERTOADMIN');
                res.send(user);
            });            
        }).catch((error) => {
            console.log(error);
            res.end();
        });
    }

    if (action == 'adminToUser') {
        // console.log(action);
        return admin.auth().getUserByEmail(userEmail).then((user) => {
            // console.log('user: ', user);
            return admin.auth().setCustomUserClaims(user.uid, null)
                .then(() => {
                    // console.log('ADMINTOUSER');
                    res.send(user);
                }).catch((error) => {
                    console.log(error);
                });
        }).catch((error) => {
            console.log(error);
            res.end();
        });
    }
});