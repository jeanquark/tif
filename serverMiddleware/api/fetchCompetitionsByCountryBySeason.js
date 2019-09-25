const express = require('express'),
      moment = require('moment'),
      admin = require('firebase-admin'),
      bodyParser = require('body-parser'),
	  slugify = require('../../helpers/slugify.js'),
      unirest = require('unirest');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function getCompetitionsByCountryBySeason (country, season) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/leagues/country/${country}/${season}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}


// To be called once a year to get new competitions for the upcoming season with year as body data
module.exports = app.use(async function(req, res) {
    try {
    	// console.log('req.body: ', req.body)
		const { country, season } = req.body
		// console.log('country: ', country)
		// console.log('season: ', season);
		

		// 1) Make external request to APIFootball to retrieve all competitions of a given country for a given season and push them to an array
		const competitions = []
		const response = await getCompetitionsByCountryBySeason(country, season)
		Object.values(response.body.api.leagues).forEach(league => {
			competitions.push({ 
				id: league.league_id,
				name: league.name,
				country: league.country,
				season: league.season,
				seasonStart: league.season_start,
				seasonEnd: league.season_end,
				standings: league.standings,
				isCurrent: league.is_current
			})
		})
		// console.log('competitions: ', competitions)

        res.send(competitions);
        
    } catch (error) {
        console.log("APIFootball error: ", error);
        res.end(`POST request to API-Football to fetch competitions by county {country} and by season ${season} failed: ${error}`);
    }
});