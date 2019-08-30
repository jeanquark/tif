const express = require('express'),
      admin = require('firebase-admin'),
      bodyParser = require('body-parser'),
      slugify = require('../../helpers/slugify'),
      unirest = require('unirest');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

function getTeamsByLeague (league_id) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/teams/league/${league_id}`;
    return unirest.get(url).headers({
        'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    });
}

module.exports = app.use(async function(req, res, next) {
    try {
		// 1) First fetch all active competitions
		const competitionsArray = [];
        const competitions = await admin.database().ref('/competitions').once('value');
        competitions.forEach(competition => {
            if (competition.val().active === true) {
                competitionsArray.push({
                    name: competition.val().name,
                    slug: competition.val().slug,
                    apifootball_id: competition.val().apifootball_id,
                    status: competition.val().status,
                    countries: competition.val().countries
                });
            }
		});
		

		// 2) Then update teams node for every active competition
		let updates = {};
		for (let competition of competitionsArray) {
			console.log('competition: ', competition);
			if (competition.apifootball_id) {
				const response = await getTeamsByLeague(competition.apifootball_id);
				Object.values(response.body.api.teams).forEach(team => {
					const id = team.team_id;
					const slug = slugify(team.name);
					const countrySlug = slugify(team.country);
					updates[`/teams/${slug}/apifootball_id`] = id;
					updates[`/teams/${slug}/apifootball_name`] = team.name || null;
					updates[`/teams/${slug}/apifootball_slug`] = team.slug || null;
					updates[`/teams/${slug}/name`] = team.name || null;
					updates[`/teams/${slug}/slug`] = team.slug || null;
					updates[`/teams/${slug}/country/name`] = team.country || null;
					updates[`/teams/${slug}/country/slug`] = countrySlug || null;
					updates[`/teams/${slug}/founded`] = team.founded || null;
					updates[`/teams/${slug}/venue_name`] = team.venue_name || null;
					updates[`/teams/${slug}/venue_city`] = team.venue_city || null;
					updates[`/teams/${slug}/venue_capacity`] = team.venue_capacity || null;
					updates[`/teams/${slug}/venue_surface`] = team.venue_surface || null;
					updates[`/teams/${slug}/venue_address`] = team.venue_address || null;
					updates[`/teams/${slug}/competitions/${competition.slug}`] = true;
					updates[`/teams/${slug}/image`] = `${slug}.png`;
				})
			}
		}


		await admin.database().ref().update(updates);


        res.send(`POST request to API-Football to fetch teams by league succeeded!`);
    } catch (error) {
        console.log("APIFootball error: ", error);
        res.end(`POST request to API-Football to fetch teams by league failed: ${error}`);
    }
});