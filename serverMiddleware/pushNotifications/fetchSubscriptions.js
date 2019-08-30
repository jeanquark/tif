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
		let teams = []

		// 1) Get all teams the user is subscribed to:
		const snapshot = await admin
			.database()
			.ref("/subscriptions")
			.orderByChild('endpoint')
  			.equalTo(currentEndpoint)
			.once("value");

		const response = Object.assign({}, snapshot.val());
		console.log('response: ', response)
		res.send(response);
		// console.log('snapshot.val(): ', snapshot.val())

		// snapshot.forEach(childSnapshot => {
		// 	teams.push(childSnapshot.val())
		// }
		// console.log('teams: ', teams)
		// res.send(JSON.stringify(snapshot.val()))
		// return snapshot.val()
    	// res.send("FETCH subscription succeeded!");
  	} catch (error) {
		console.log(error);
		res.status(500).send('GET request failed...');
  	}
});
