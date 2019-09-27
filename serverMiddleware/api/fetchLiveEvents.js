const express = require('express'),
      moment = require('moment'),
      admin = require('firebase-admin'),
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
        // const liveMatches = await admin.database().ref('/events').orderByChild('elapsed').startAt('0').endAt('90').once('value');
        // const liveMatches = await admin.database().ref('/events').orderByChild('elapsed').equalTo(0).once('value');
        const liveMatches = await admin.database().ref('/events').orderByChild('elapsed').startAt(1).endAt(89).once('value');
        
        let updates = {};
        const matchesArray = [];

        liveMatches.forEach(match => {
            console.log('match: ', match)
            matchesArray.push({
                id: match.key
            });
        });
        console.log('matchesArray: ', matchesArray);
        // return
        // throw 'new_error'

        // const fixtureId = '167014'
        // const liveEvents = await getLiveEvents(fixtureId);
        // for (let [key, value, index] of Object.entries(liveEvents.body.api.events)) {
        //     updates[`/jm/eventEvents/${fixtureId}/${slugify(key)}`] = value
        // }

        // const liveGameStatistics = await getLiveGameStatistics(fixtureId);
        // for (let [key, value, index] of Object.entries(liveGameStatistics.body.api.statistics)) {
        //     console.log('index: ', index)
        //     updates[`/jm/eventGameStatistics/${fixtureId}/${slugify(key)}`] = {
        //         name: key,
        //         slug: slugify(key),
        //         home: value.home,
        //         away: value.away
        //     }
        // }
        
        // const livePlayersStatistics = await getLivePlayersStatistics(fixtureId)
        // for (let [key, value] of Object.entries(livePlayersStatistics.body.api.players)) {
        //     updates[`/jm/eventPlayersStatistics/${fixtureId}/${slugify(key)}`] = value;
        // }


        for (let liveMatch of matchesArray) {
            const fixtureId = liveMatch.id;
            const liveEvents = await getLiveEvents(fixtureId)
            for (let [key, value] of Object.entries(liveEvents.body.api.events)) {
                updates[`/eventEvents/${fixtureId}/${slugify(key)}`] = value
            }

            const liveGameStatistics = await getLiveGameStatistics(fixtureId);
            for (let [key, value] of Object.entries(liveGameStatistics.body.api.statistics)) {
                updates[`/eventGameStatistics/${fixtureId}/${slugify(key)}`] = {
                    name: key,
                    slug: slugify(key),
                    home: value.home,
                    away: value.away
                }
            }
            
            const livePlayersStatistics = await getLivePlayersStatistics(fixtureId)
            for (let [key, value] of Object.entries(livePlayersStatistics.body.api.players)) {
                updates[`/eventPlayersStatistics/${fixtureId}/${slugify(key)}`] = value
            }
            
        }


        console.log('updates: ', updates);
        // await admin.database().ref().update(updates);

        res.status(200).send('GET request to APIFootball to get live events succeeded!');

    } catch(error) {
        console.log('error: ', error)
        res.end(`GET request to APIFootball to fetch live events failed: ${error}`);
    }
})