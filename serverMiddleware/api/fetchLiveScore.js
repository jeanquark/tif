const express = require('express'),
      admin = require('firebase-admin'),
	  fs = require('fs'),
	  util = require('util'),
      unirest = require('unirest');

const app = express()

function getLiveScore() {
    const url = 'https://api-football-v1.p.rapidapi.com/v2/fixtures/live'
    return unirest.get(url).headers({
        Accept: 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    })
}

// To be called every minute
module.exports = app.use(async function(req, res, next) {
    try {
        // 1) First, retrieve all competitions		
    	const readFile = util.promisify(fs.readFile)
		const competitions = await readFile('./static/activeCompetitions.json', 'utf8')
		const activeCompetitions = JSON.parse(competitions)

        let updates = {}

        const response = await getLiveScore()
        
        for (let match of Object.values(response.body.api.fixtures)) {            
            if (activeCompetitions.find(competition => competition.apifootball_id == match.league_id)) {
                const id = match.fixture_id
                updates[`/events/${id}/status`] = match.status
                updates[`/events/${id}/statusShort`] = match.statusShort
                updates[`/events/${id}/homeTeam_goals`] = match.goalsHomeTeam
                updates[`/events/${id}/awayTeam_goals`] = match.goalsAwayTeam
                updates[`/events/${id}/score`] = match.score
                updates[`/events/${id}/elapsed`] = match.elapsed
                updates[`/events/${id}/notificationScore/homeTeam_score`] = match.goalsHomeTeam
                updates[`/events/${id}/notificationScore/awayTeam_score`] = match.goalsAwayTeam
                updates[`/events/${id}/notificationStatus/statusShort`] = match.statusShort
            }
        }

        await admin
            .database()
            .ref()
            .update(updates)

        res.status(200).send('GET request to APIFootball to fetch live scores succeeded!')
    } catch (error) {
        console.log('error: ', error)
        res.end(`GET request to APIFootball to fetch live scores failed: ${error}`)
    }
})
