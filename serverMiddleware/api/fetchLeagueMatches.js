const express = require("express"),
      moment = require("moment"),
      admin = require("firebase-admin"),
      bodyParser = require('body-parser'),
      unirest = require("unirest");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

function getLeagueMatches (league_id) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${league_id}`;
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


// To be called when new competition is added as a POST request with league_id as body data
module.exports = app.use(async function(req, res, next) {
    try {
		let updates = {};
		const league_id = parseInt(req.body.league_id);
		console.log('league_id: ', league_id);
		
        // 1) First, fetch competitions
        const competitionsArray = []
        const competitions = await admin
            .database()
            .ref('/competitions')
            .orderByChild('apifootball_id')
            .equalTo(league_id)
            .once('value')
        competitions.forEach(competition => {
            competitionsArray.push({
                name: competition.val().name,
                slug: competition.val().slug,
                apifootball_id: competition.val().apifootball_id,
                status: competition.val().status,
                countries: competition.val().countries
            })
        })


		// 2) Second, make external request to API-Football to fetch fixtures
        const response = await getLeagueMatches(league_id);

        Object.values(response.body.api.fixtures).forEach(match => {
            // Only add present and future fixtures to database
			const yesterday = moment().subtract(1, 'days').unix();
			// console.log('yesterday: ', yesterday);
			const competition = competitionsArray.find(competition => competition.apifootball_id == match.league_id)

            // if (match.event_timestamp > yesterday) {
				const id = match.fixture_id
				// console.log('id: ', id);
				const roundShort =  /\d/.test(match.round) ? match.round.substring(match.round.lastIndexOf('-') + 2) : match.round
				updates[`/events/${id}/date_iso8601`] = match.event_date
				updates[`/events/${id}/date`] = moment(match.event_date).format('YYYY-MM-DD')
				updates[`/events/${id}/time`] = moment(match.event_date).format('HH:mm')
				updates[`/events/${id}/time_utc`] = moment(match.event_date)
					.utc()
					.format('HH:mm')
				updates[`/events/${id}/timestamp`] = match.event_timestamp
				// updates[`/events/${id}/league_id`] = match.league_id
				updates[`/events/${id}/round`] = match.round
				updates[`/events/${id}/round_short`] = roundShort
				updates[`/events/${id}/homeTeam_id`] = match.homeTeam.team_id
				updates[`/events/${id}/homeTeam_name`] = match.homeTeam.team_name
				updates[`/events/${id}/homeTeam_slug`] = slugify(match.homeTeam.team_name)
				updates[`/events/${id}/homeTeam_score`] = match.goalsHomeTeam
				updates[`/events/${id}/visitorTeam_id`] = match.awayTeam.team_id
				updates[`/events/${id}/visitorTeam_name`] = match.awayTeam.team_name
				updates[`/events/${id}/visitorTeam_slug`] = slugify(match.awayTeam.team_name)
				updates[`/events/${id}/visitorTeam_score`] = match.goalsAwayTeam
				updates[`/events/${id}/score`] = match.score
				updates[`/events/${id}/elapsed`] = match.elapsed
				updates[`/events/${id}/venue`] = match.venue
				updates[`/events/${id}/referee`] = match.referee
				updates[`/events/${id}/status`] = match.status
				updates[`/events/${id}/statusShort`] = match.statusShort
				updates[`/events/${id}/competition_apifootball_id`] = match.league_id
				updates[`/events/${id}/competition_name`] = competition.name
				updates[`/events/${id}/competition_slug`] = competition.slug
				updates[`/events/${id}/competition_round`] = `${competition.slug}_${roundShort}`
				updates[`/events/${id}/date_competition`] = `${slugify(match.event_date)}_${competition.slug}`
			// }
        });
		// console.log('updates: ', updates);

        await admin.database().ref().update(updates);

        res.send(`POST request to API-Football to fetch league ${league_id} matches succeeded!`);
        
    } catch (error) {
        console.log("APIFootball error: ", error);
        res.end(`POST request to API-Football to fetch league ${league_id} matches failed: ${error}`);
    }
});