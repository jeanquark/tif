const express = require('express'),
    admin = require('firebase-admin'),
    bodyParser = require('body-parser'),
    moment = require('moment')

const app = express()
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

module.exports = app.use(async function(req, res, next) {
    try {
        console.log(req.body)
        const teams = req.body.userTeams
        const newSubscription = req.body.pushSubscription
        const userId = req.body.userId
        // console.log("teams: ", teams);
        // console.log("newSub: ", newSub);
        // const userId = "WRus1acAvkdGPmnxqLOukl9mKM23";
        let updates = {}

        // First get rid of previous registered subscriptions:
        // admin
        //   .database()
        //   .ref("/subscriptions/xamax")
        //   .orderByChild("endpoint")
        //   .equalTo(
        //     "https://fcm.googleapis.com/fcm/send/cQylt1ikRqA:APA91bEOFs8rLPmL06kPy0u6afeIgVyyJKM0F3YhcqAjicFoWbL8HQt9Ynq9ZIjy57WryK0tfLPkTL9lJdIq6Ko0qDiGrLhQ74eM_izFImUDjuhdcfsMtUJjJ1l-VwFU1sctyKmNTbUF"
        //   )
        //   .once("value", function(snapshot) {
        //     console.log("snapshot: ", snapshot.val());
        //   });

        // updates["/subscriptions/xamax/" + "/" + newSubscriptionKey] = dataObject;

        // Then add new subscriptions

        for (let team of teams) {
            const dataObject = {
				endpoint: newSubscription.endpoint,
                keys: newSubscription.keys,
                user_id: userId,
                created_at: moment().unix(),
                team: {
                    name: team.name,
                    slug: team.slug
                },
				// team_slug: team.slug,
				notifications: {
					goals: true,
					game_starts: true,
					game_ends: true,
					game_starts_in_30_minutes: false
				}
            }
            const newSubscriptionKey = admin
                .database()
                .ref()
                .child('/subscriptions/')
                .push().key
            updates[`/subscriptions/${newSubscriptionKey}`] = dataObject
        }
        // console.log("updates: ", updates);
        const snapshot = await admin
            .database()
            .ref()
            .update(updates)

        console.log('snapshot: ', snapshot)
        // const response = Object.assign({}, snapshot)
        res.send(teams)

        // .then(snapshot => {
        //   console.log(
        //     "Successfully updated firebase database with new subscriptions"
        //   );

        // })
        // .catch(error => {
        //   console.log("Firebase error", error);
        //   res.status(500).send('POST request to create-subscription failed...');
        // });

        // res.send("GET request succeeded!");
    } catch (error) {
        console.log(error)
        // res.send("GET request failed...");
        res.status(500).send('POST request to create-subscription failed...')
    }
})
