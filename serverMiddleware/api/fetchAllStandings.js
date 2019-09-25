const express = require('express'),
	  admin = require('firebase-admin'),
	  unirest = require('unirest');

const app = express();

function getLeagueStanding(league) {
	const url = `https://api-football-v1.p.rapidapi.com/v2/leagueTable/${league}`;
	return unirest.get(url).headers({
		'Accept': 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
	});
}

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
		// console.log('competitionsArray: ', competitionsArray);

        // console.log('competitionsArray: ', competitionsArray);
		let updates = {};

		// 2) Then for each active competition, parse current standing
		for (let competition of competitionsArray) {
			console.log('competition: ', competition);
			const response = await getLeagueStanding(competition.league_id);

			Object.values(response.body.api.standings).forEach(teams => {
				teams.forEach(team => {
					console.log('team: ', team);
					updates[`/standings/${competition.slug}/${team.rank}/rank`] = team.rank;
					updates[`/standings/${competition.slug}/${team.rank}/team_id`] = team.team_id;
					updates[`/standings/${competition.slug}/${team.rank}/team_name`] = team.teamName;
					updates[`/standings/${competition.slug}/${team.rank}/team_slug`] = slugify(team.teamName);
					updates[`/standings/${competition.slug}/${team.rank}/all`] = team.all;
					updates[`/standings/${competition.slug}/${team.rank}/home`] = team.home;
					updates[`/standings/${competition.slug}/${team.rank}/away`] = team.away;
					updates[`/standings/${competition.slug}/${team.rank}/goalsDiff`] = team.goalsDiff;
					updates[`/standings/${competition.slug}/${team.rank}/points`] = team.points;
					updates[`/standings/${competition.slug}/${team.rank}/forme`] = team.forme;
					updates[`/standings/${competition.slug}/${team.rank}/description`] = team.description;
					updates[`/standings/${competition.slug}/${team.rank}/lastUpdate`] = team.lastUpdate;
					updates[`/standings/${competition.slug}/${team.rank}/teamName`] = null;
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