const express = require("express"),
  admin = require("firebase-admin"),
  cookieParser = require("cookie-parser")(),
  webpush = require("web-push"),
  bodyParser = require("body-parser");

const app = express();
global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// module.exports = function (req, res, next) {
module.exports = app.use(async function(req, res, next) {
  try {
    console.log("sendNotifications page called");
    console.log(req.body);

    const vapidPublicKey = "BBPCbckxl1U6mg1xxPhZCu2nAx0g2Gbh7iio-fi1_jU_CFGYH5XQ97XDuEBIXibz1ySDhsnTTGfeNuCYQgHR59k";
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    webpush.setVapidDetails(
      "mailto:thisisfan2018@gmail.com",
      vapidPublicKey,
      vapidPrivateKey
    );

    // 1) First get all events that are finished & where notification_sent is false
    const snapshot = await admin
      .database()
      .ref("/events/")
      // .orderByChild("status")
      .orderByChild('notification_sent')
      // .equalTo("FINISHED")
      .equalTo(false)
      .once("value");

    console.log("Step 1 done!");
    let teams = [];
    let updates = {};
    snapshot.forEach(function(childSnapshot) {
      // if (!childSnapshot.val().notification_sent) {
      if (childSnapshot.val().status === 'FINISHED') {
        if (childSnapshot.val().home_team) {
          teams.push({
            slug : childSnapshot.val().home_team.slug,
            home_team: childSnapshot.val().home_team,
            visitor_team: childSnapshot.val().visitor_team,
            score: childSnapshot.val().score
          });
        }
        if (childSnapshot.val().visitor_team.slug) {
          teams.push({
            slug: childSnapshot.val().visitor_team.slug,
            home_team: childSnapshot.val().home_team,
            visitor_team: childSnapshot.val().visitor_team,
            score: childSnapshot.val().score
          });
        }
        const id = childSnapshot.key;
        updates["/events/" + id + "/notification_sent"] = true;
      }
    });
    // console.log("teams: ", teams);
    // console.log("updates: ", updates);

    // 2) Update notification_sent status to true for these events 
    await admin
      .database()
      .ref()
      .update(updates);

    console.log("Step 2 done!");

    // 3) Send a notification to all subscribers

    for (let team of teams) {
      console.log("team: ", team);
      // console.log("team.home_team: ", team.home_team);
      // console.log("team.home_team.name: ", team.home_team.name);
      // console.log('team.slug: ', team.slug)

      // const subscriptions = await admin.database().ref("/subscriptions/" + team.slug).once("value")
      const subscriptions = await admin.database().ref("/subscriptions").orderByChild('team_slug').equalTo(team.slug).once("value")
      console.log("subscriptions: ", subscriptions)
      subscriptions.forEach(function(sub) {
        // console.log("sub: ", sub);
        const pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh
          }
        };
        // console.log("pushConfig: ", pushConfig);
        webpush
          .sendNotification(
            pushConfig,
            JSON.stringify({
              title: `${team.home_team.name.substring(0, 3).toUpperCase()} vs ${team.visitor_team.name.substring(0, 3).toUpperCase()}: ${team.score}`,
              content: "Congratulations, you've earned 20$fans!",
              icon: "/static/images/icons/icon_256x256.png",
              badge: "/static/images/icons/icon_96x96.png",
              vibrate: [ 100, 50, 100 ]
            })
          )
          .catch(function(error) {
            console.log("Send notification error: ", error);
          });
      });

      // admin
      //   .database()
      //   // .ref("subscriptions/" + team)
      //   .ref("subscriptions/" + team.slug)
      //   .once("value")
      //   .then(function(subscriptions) {
      //     // console.log("subscriptions: ", subscriptions);s
      //     subscriptions.forEach(function(sub) {
      //       // console.log("sub: ", sub);
      //       var pushConfig = {
      //         endpoint: sub.val().endpoint,
      //         keys: {
      //           auth: sub.val().keys.auth,
      //           p256dh: sub.val().keys.p256dh
      //         }
      //       };
      //       console.log("pushConfig: ", pushConfig);
      //       webpush
      //         .sendNotification(
      //           pushConfig,
      //           JSON.stringify({
      //             title: `${team.home_team.name} vs ${team.visitor_team.name}: ${team.score}`,
      //             content: "Congratulations, you've earned 30$fans!",
      //             icon: "/static/images/icons/icon_256x256.png",
      //             badge: "/static/images/icons/icon_96x96.png"
      //             vibrate: [ 100, 50, 100 ]
      //           })
      //         )
      //         .catch(function(err) {
      //           console.log("err1: ", err);
      //         });
      //     });
      // });
    }
    console.log('Step 3 done!')
    res.send("GET request to /api/send-notification succeeded!");

    // return admin
    //   .database()
    //   .ref("subscriptions/lausanne")
    //   .once("value")
    //   .then(function(subscriptions) {
    //     console.log("subscriptions: ", subscriptions);
    //     subscriptions.forEach(function(sub) {
    //       console.log("sub: ", sub);
    //       var pushConfig = {
    //         endpoint: sub.val().endpoint,
    //         keys: {
    //           auth: sub.val().keys.auth,
    //           p256dh: sub.val().keys.p256dh
    //         }
    //       };
    //       console.log("pushConfig: ", pushConfig);
    //       webpush
    //         .sendNotification(
    //           pushConfig,
    //           JSON.stringify({
    //             title: `${teams[0]} vs ${teams[1]}: 2-0`,
    //             content: "You've earned 31$fans, well done!"
    //           })
    //         )
    //         .catch(function(err) {
    //           console.log("err1: ", err);
    //         });
    //     });
    // res.send("GET request succeeded!");
    // });
  } catch (error) {
    console.log(error);
    res.send("GET request to /api/send-notification failed...");
  }
});
