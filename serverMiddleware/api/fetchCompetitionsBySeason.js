const express = require('express'),
      moment = require('moment'),
      admin = require('firebase-admin'),
      bodyParser = require('body-parser'),
	  slugify = require('../../helpers/slugify.js'),
      unirest = require('unirest');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function getCompetitionsBySeason (season) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/leagues/season/${season}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

// API-Football league IDs:
// England Premier League: 2
// Spain La Liga: 87
// Germany Bundesliga: 8
// Italy Serie A: 94
// France Ligue 1: 4
// Switzerland Super League 2019-2020: 576
// UEFA Champions League: 132
// UEFA Europa League: 137
// UEFA Nations League: 136

// To be called once a year to get new competitions for the upcoming season with year as body data
module.exports = app.use(async function(req, res) {
    try {
		const season = req.body.season;
		console.log('season: ', season);
		

		// 1) Make external request to APIFootball to retrieve all competitions of a given season and push them to an array
		const apiFootballData = []
		if (season) {
			const response = await getCompetitionsBySeason(season);
			Object.values(response.body.api.leagues).forEach(league => {
				apiFootballData.push({ 
					id: league.league_id,
					name: league.name,
					country: league.country,
					season: league.season,
					seasonStart: league.season_start,
					seasonEnd: league.season_end
				})
			});
		}

        // 2) Duplicate all current competitions and update apifootball_id value when found
		let updates = {};
        const snapshot = await admin.database().ref('/competitions').once('value');
		for (const key in snapshot.val()) {
			const name = snapshot.val()[key].apifootball_name;
			const country = snapshot.val()[key].apifootball_country;

			const newKey = `${slugify(country)}_${slugify(name)}_${parseInt(season)}_${ parseInt(season) + 1}`;
			if (!newKey.includes('undefined')) {
				const league = apiFootballData.find(competition => competition.name === name && competition.country === country && competition.season == season);
				if (league) {
					updates[`/competitions/${newKey}`] = {
						...snapshot.val()[key],
						slug: newKey,
						apifootball_id: league.id,
						season: league.season,
						seasonStart: league.season_start,
						seasonEnd: league.season_end
					};
				}
			}
		}
		await admin.database().ref().update(updates);

        res.send(`POST request to API-Football to fetch competitions by season ${season} succeeded!`);
        
    } catch (error) {
        console.log("APIFootball error: ", error);
        res.end(`POST request to API-Football to fetch competitions by season ${season} failed: ${error}`);
    }
});