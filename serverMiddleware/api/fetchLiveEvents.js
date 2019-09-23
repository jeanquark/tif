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

function slugify(text) {
    if (text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '_') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-/g, '_') // Replace single - with single _
            .replace(/\-\-+/g, '_') // Replace multiple - with single _
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/ü/, 'u') // Trim - from end of text
            .replace(/ä/, 'a') // Trim - from end of text
            .replace(/é/, 'e') // Trim - from end of text
            .replace(/è/, 'e') // Trim - from end of text
            .replace(/ö/, 'o') // Trim - from end of text
    } else {
        return
    }
}

function getLiveEvents (fixtureId) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/events/${fixtureId}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

function getLiveGameStatistics (fixtureId) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/statistics/fixture/${fixtureId}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

function getLivePlayersStatistics (fixtureId) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/players/fixture/${fixtureId}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

// To be called every minute to retrieve live events, live game statistics and live player statistics
module.exports = app.use(async function (req, res, next) {
    try {
        // Get live matches
        console.log('Hello!')
        const liveMatches = await admin.database().ref('/events').orderByChild('elapsed').startAt('1').endAt('90').once('value');
        // console.log('snapshot: ', snapshot.val());
        let updates = {};
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
        const response = await getLiveGameStatistics('215994');
        // console.log('Object.keys: ', Object.keys(response.body.api.statistics))
        // console.log('Object.values: ', Object.values(response.body.api.statistics))
        console.log('Object.entries: ', Object.entries(response.body.api.statistics))
        for (let [key, value, index] of Object.entries(response.body.api.statistics)) {
            console.log('index: ', index)
            updates[`/jm/eventGameStatistics/fixtureId/${slugify(key)}`] = {
                name: key,
                slug: slugify(key),
                home: value.home,
                away: value.away
            }
        }
        // Object.values(response.body.api.statistics).forEach((gameStatistics, index) => {
        //     console.log('gameStatistics: ', gameStatistics, index)
        //     updates[`/jm/fixtureId/${index}`] = gameStatistics;
        // });


        for (let liveMatch of matchesArray) {
            // console.log('liveGame: ', liveGame);
            const fixtureId = liveMatch.id;
            console.log('fixtureId: ', fixtureId);

            const liveEvents = await getLiveEvents(fixtureId);
            Object.values(liveEvents.body.api.events).forEach((event, index) => {
                updates[`/eventEvents/${fixtureId}/${index}/elapsed`] = event.elasped;
                updates[`/eventEvents/${fixtureId}/${index}/teamId`] = event.team_id;
                updates[`/eventEvents/${fixtureId}/${index}/teamName`] = event.teamName;
                updates[`/eventEvents/${fixtureId}/${index}/playerId`] = event.player_id;
                updates[`/eventEvents/${fixtureId}/${index}/player`] = event.player;
                updates[`/eventEvents/${fixtureId}/${index}/type`] = event.type;
                updates[`/eventEvents/${fixtureId}/${index}/detail`] = event.detail;
            });

            const liveGameStatistics = await getLiveGameStatistics(fixtureId)
            Object.values(liveGameStatistics.body.api.statistics).forEach((gameStatistics, index) => {
                const slug = slugify(gameStatistics)
                updates[`/eventGameStatistics/${fixtureId}/${slug}`] = gameStatistics;
                updates[`/eventGameStatistics/${fixtureId}/${slug}/name`] = gameStatistics;
                updates[`/eventGameStatistics/${fixtureId}/${slug}/slug`] = gameStatistics;
            });

            const livePlayersStatistics = await getLivePlayersStatistics(fixtureId)
            Object.values(livePlayersStatistics.body.api.players).forEach((playersStatistics, index) => {
                updates[`/eventPlayersStatistics/${fixtureId}/${index}`] = playersStatistics;
            });
        }


        console.log('updates: ', updates);
        // await admin.database().ref().update(updates);

        res.status(200).send('GET request to APIFootball to get live events succeeded!');

    } catch(error) {
        console.log('error: ', error)
        res.end(`GET request to APIFootball to fetch live events failed: ${error}`);
    }
})