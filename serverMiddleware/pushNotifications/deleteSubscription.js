const express = require("express"),
    admin = require("firebase-admin"),
    cookieParser = require("cookie-parser")(),
    webpush = require("web-push"),
    bodyParser = require("body-parser");

const app = express();
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

module.exports = app.use(async function(req, res, next) {
    try {
        console.log(req.body);
        const currentEndpoint = req.body.endpoint;
        console.log("currentEndpoint: ", currentEndpoint);
        let teamsArray = [];
        let updates = {};

    //     admin.database().ref('/subscriptions').orderByChild('endpoint').equalTo(currentEndpoint).once('value', function ())
    //   .update(updates)




    // 1) First get all teams:
    const snapshot = await admin.database().ref("/subscriptions").once("value");

    // 2) Then check for each team if current endpoint is registered among subscriptions
    // If so, delete it
    snapshot.forEach(function(childSnapshot) {
      // For each team
      console.log("childSnapshot: ", childSnapshot.val());
      const team = childSnapshot.key;
      // console.log("team: ", team);
      childSnapshot.forEach(function(grandChildSnapshot) {
        // For each subscribed user of this team
        const endpoint = grandChildSnapshot.val().endpoint;
        // console.log("endpoint: ", endpoint);
        if (endpoint === currentEndpoint) {
          updates[
            "/subscriptions/" + team + "/" + grandChildSnapshot.key
          ] = null;
        }
      });
    });
    console.log("updates: ", updates);
    admin
      .database()
      .ref()
      .update(updates)
      .then(snapshot => {
        console.log("Successfully deleted firebase old subscriptions");
      })
      .catch(error => {
        console.log("Firebase error", error);
      });
    res.send("DELETE subscription succeeded!");
  } catch (error) {
    console.log(error);
    res.send("GET request failed...");
  }
});
