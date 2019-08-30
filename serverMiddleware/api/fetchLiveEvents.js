const express = require('express'),
      moment = require('moment'),
      admin = require('firebase-admin'),
      slugifyFunction = require('../../helpers/slugify'),
      unirest = require('unirest');

const app = express();
// const api_key = process.env.LIVESCORE_API_KEY
// const api_key = process.env.APIFOOTBALL_KEY
// const api_secret = process.env.LIVESCORE_API_SECRET

// Fetch all events that are about to start
// const today = moment().format('YYYY-MM-DD');
// console.log('today: ', today);

function getLiveEvents (fixture) {
    const url = `https://api-football-v1.p.rapidapi.com/events/${fixture}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

// To be called every minute
module.exports = app.use(async function (req, res, next) {
    try {
        // Get live games
        // const liveGames = await admin.database().ref('/events_new3').orderByChild('status').equalTo('Kick Off').once('value');
        // const snapshot = await admin.database().ref('/events_new3').orderByChild('statusShort').startAt('1H').endAt('2H').once('value');
        // const liveMatches = await admin.database().ref('/events_new3').orderByChild('statusShort').startAt('NS').endAt('NS').once('value');
        const liveMatches = await admin.database().ref('/events_new3').orderByChild('elapsed').startAt('1').endAt('90').once('value');
        // console.log('snapshot: ', snapshot.val());
        let updates = {};

        // Object.values(snapshot.val().forEach(event => {
        //     console.log('event: ', event);
        // });

        // for (let liveGame of snapshot) {
        //     console.log('liveGame: ', liveGame);
        // }

        const matchesArray = [];
        liveMatches.forEach(match => {
            matchesArray.push({
                id: match.val().id
            });
        });
        console.log('matchesArray: ', matchesArray);


        // liveMatches.forEach((match) => { async match2 => {
        // liveMatches.forEach(function wrapper (){ 
        //     async match => {
        //         await console.log('abc: ', match);
        //     }
        // });


        for (let liveGame of matchesArray) {
            // console.log('liveGame: ', liveGame);
            const id = liveGame.id;
            console.log('id: ', id);
            const response = await getLiveEvents(id);
            // console.log('response: ', response);

            Object.values(response.body.api.events).forEach((event, index) => {
                updates[`/events_new3/${id}/events/${index}/elapsed`] = event.elasped;
                updates[`/events_new3/${id}/events/${index}/teamName`] = event.teamName;
                updates[`/events_new3/${id}/events/${index}/player`] = event.player;
                updates[`/events_new3/${id}/events/${index}/type`] = event.type;
                updates[`/events_new3/${id}/events/${index}/detail`] = event.detail;
            });
        }


        await admin.database().ref().update(updates);

        res.status(200).send('GET request to APIFootball to get live events succeeded!');

    } catch(error) {
        console.log('error2: ', error)
        res.end(`GET request to APIFootball to fetch live events failed: ${error}`);
        // res.send('GET request failed...')
    }
})