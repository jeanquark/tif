const express = require('express'),
	//   admin = require('firebase-admin'),
	  admin = require('../services/firebase-admin-init'),
	  unirest = require('unirest');

const app = express();
// const api_key = process.env.APIFOOTBALL_KEY;
// console.log('api_key: ', api_key);
// axios.defaults.headers.common['X-RapidAPI-Key'] = api_key;

// function getLeagueStanding2(league) {
// 	const url = `https://api-football-v1.p.rapidapi.com/leagueTable/${league}`;
// 	return axios.get(url);
// }

function getLeagueStanding(league) {
	const url = `https://api-football-v1.p.rapidapi.com/v2/leagueTable/${league}`;
	return unirest.get(url).headers({
		'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
	});
}

// To be called once a day
module.exports = app.use(async function(req, res, next) {
	try {
		// 1) First grab active competitions
		const competitionsArray = []
        const competitions = await admin.database().ref('/competitions').once('value')
        competitions.forEach(competition => {
            if (competition.val().active === true) {
                competitionsArray.push({
                    name: competition.val().name,
                    slug: competition.val().slug,
                    league_id: competition.val().apifootball_id,
                    active: competition.val().active,
                    countries: competition.val().countries
                })
            }
		});
		console.log('competitionsArray: ', competitionsArray);

        // console.log('competitionsArray: ', competitionsArray);
		let updates = {};

		// 2) Then for each active competition, parse current standing
		for (let competition of competitionsArray) {
			console.log('competition: ', competition);
			const response = await getLeagueStanding(competition.league_id);

			// Object.values(response.data.api.standings).forEach(teams => {
			Object.values(response.body.api.standings).forEach(teams => {
				teams.forEach(team => {
					// console.log('team: ', team);
					updates[`/standings/${competition.slug}/${team.rank}`] = team;
				});
			});
		};
		
		await admin.database().ref().update(updates);

        console.log('GET request to APIFootball to fetch standings succeeded!');
        res.status(200).send('GET request to APIFootball to fetch all standings succeeded!');
	} catch (error) {
		console.log('error: ', error)
		res.end(`GET request to APIFootball to fetch all standings failed: ${error}`);
	}
});