const express = require('express'),
    //   moment = require("moment"),
    admin = require('firebase-admin'),
    //   slugifyFunction = require("../../helpers/slugify"),
	// activeCompetitions2 = require('../../helpers/activeCompetitions2'),
	// activeCompetitions3 = require('../../helpers/activeCompetitions3'),
	fs = require('fs'),
	util = require('util'),
    unirest = require('unirest')

const app = express()

function getLiveScore() {
    const url = 'https://api-football-v1.p.rapidapi.com/fixtures/live'
    return unirest.get(url).headers({
        Accept: 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    })
}

// To be called every minute
module.exports = app.use(async function(req, res, next) {
    try {
        // 1) First, retrieve all competitions
		// console.log('activeCompetitions2: ', activeCompetitions2)
		// console.log('activeCompetitions3: ', activeCompetitions3)

		const competitionsArray = [
            {
                england_premier_league_2019_2020: {
                    apifootball_id: 524
                },
                france_ligue_1_2019_2020: {
                    apifootball_id: 525
                },
                germany_bundesliga_1_2019_2020: {
                    apifootball_id: 754
                },
                spain_primera_division_2019_2020: {
                    apifootball_id: 775
                },
                spain_segunda_division_2019_2020: {
                    apifootball_id: 776
                },
                switzerland_super_league_2019_2020: {
                    apifootball_id: 576
                },
                switzerland_challenge_league_2019_2020: {
                    apifootball_id: 585
                }
            }
		]
		
		const readFile = util.promisify(fs.readFile)
		const competitions = await readFile('./helpers/activeCompetitions4.json', 'utf8')
		console.log('competitions: ', JSON.parse(competitions))
		const abc = JSON.parse(competitions)
		abc.forEach(competition => {
			console.log('competition: ', competition)
		})

		// let competitions = []
		// try {
		// 	fs.readFile('./helpers/activeCompetitions4.json', 'utf8', (err, jsonString) => {
		// 	if (err) {
		// 		console.log("Error reading file from disk:", err)
		// 		return
		// 	}
		// 	try {
		// 		competitions = JSON.parse(jsonString)
		// 		console.log("competition.apifootball_id is: ", competitions[0].england_premier_league_2019_2020) 
		// } catch(err) {
		// 		console.log('Error parsing JSON string:', err)
		// 	}
		// })
		// console.log('competitions: ', competitions)

		fs.writeFile("./helpers/activeCompetitions4.json", JSON.stringify(competitionsArray, null, 4), function(err) {
			if (err) {
				return console.log('err: ', err);
			}
		
			console.log("The file was saved!");
		}); 

		// const abc = competitionsArray.forEach(function (competition) {
		// 	console.log('competition2: ', competition)
		// 	return parseInt(competition.apifootball_id) === 524
		// })
        
        // const competitionsArray = [];
        // const competitions = await admin.database().ref('/competitions').once('value');
        // competitions.forEach(competition => {
        //     if (competition.val().status === 'active') {
        //         // competitionIdsArray.push(String(competition.val().livescore_api_id))
        //         competitionsArray.push({
        //             name: competition.val().name,
        //             slug: competition.val().slug,
        //             apifootball_id: competition.val().apifootball_id,
        //             status: competition.val().status,
        //             countries: competition.val().countries
        //         });
        //     }
        // });
        // console.log('competitionsArray: ', competitionsArray)

        // const response = await getLiveScore()
        res.status(200).send('GET request to APIFootball to fetch live scores succeeded!')		

        // console.log('response.status: ', response.status);
		// console.log('response.body.api.fixtures: ', response.body.api.fixtures);
		// const abc = competitionsArray.forEach(function (competition) {
		// 	console.log('competition2: ', competition)
		// 	return parseInt(competition.apifootball_id) === 524
		// })
		// console.log('abc: ', abc)
		// const abc2 = activeCompetitions2.find(function (competition) {
		// 	return parseInt(competition.apifootball_id) === 524
		// })
		// console.log('abc2: ', abc2)

        let updates = {}

        for (let match of Object.values(response.body.api.fixtures)) {
            // console.log('match: ', match);
            // console.log('match.league_id: ', match.league_id);
            if (competitionsArray.find(competition => competition.apifootball_id == match.league_id)) {
                console.log('match: ', match)
                const id = match.fixture_id
                updates[`/events/${id}/status`] = match.status
                updates[`/events/${id}/statusShort`] = match.statusShort
                // updates[`/events/${id}/goalsHomeTeam`] = match.goalsHomeTeam;
                updates[`/events/${id}/homeTeam_goals`] = match.goalsHomeTeam
                // updates[`/events/${id}/goalsVisitorTeam`] = match.goalsAwayTeam;
                updates[`/events/${id}/visitorTeam_goals`] = match.goalsAwayTeam
                updates[`/events/${id}/halftime_score`] = match.score.halftime
				updates[`/events/${id}/final_score`] = match.score.final
				updates[`/events/${id}/penalty`] = match.score.penalty
                updates[`/events/${id}/extratime`] = match.score.extratime
                updates[`/events/${id}/elapsed`] = match.elapsed
            }
        }

        await admin
            .database()
            .ref()
            .update(updates)

        console.log('End of request!')

        res.status(200).send('GET request to APIFootball to fetch live scores succeeded!')
    } catch (error) {
        console.log('error: ', error)
        res.end(`GET request to APIFootball to fetch live scores failed: ${error}`)
    }
})
