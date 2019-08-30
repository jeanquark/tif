const express = require('express'),
    moment = require('moment'),
    admin = require('firebase-admin'),
    bodyParser = require('body-parser'),
    // slugify = require('../../helpers/slugify'),
    unirest = require('unirest')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

console.log('APIFOOTBALL_KEY: ', process.env.APIFOOTBALL_KEY);

// const today = moment().format('YYYY-MM-DD');
// const in1day = moment().add(1, 'days').format('YYYY-MM-DD');
// const in12days = moment().add(12, 'days').format('YYYY-MM-DD');
// const in13days = moment().add(13, 'days').format('YYYY-MM-DD');
// const in14days = moment().add(14, 'days').format('YYYY-MM-DD');

// const days = [today, in1day, in12days, in13days, in14days];

function getDailyMatches(day) {
    const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/date/${day}`
    return unirest.get(url).headers({
        Accept: 'application/json',
        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
    })
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

// To be called once a day to get tomorrow matches as well as matches in 2 weeks time
module.exports = app.use(async function(req, res, next) {
    try {
        // 1) First, define time window
        const days = []
        const until = req.body.until || 15
        console.log('until: ', until)
        for (let i = 0; i < until; i++) {
            days.push(
                moment()
                    .add(i, 'days')
                    .format('YYYY-MM-DD')
            )
        }
        console.log('days: ', days)

        // 2) Second, fetch all active competitions
        const competitionsArray = []
        // const competitions = await admin.database().ref('/competitions').once('value');
        const competitions = await admin
            .database()
            .ref('/competitions')
            .orderByChild('active')
            .equalTo(true)
            .once('value')
        competitions.forEach(competition => {
            // console.log('competition.val(): ', competition.val())
            // if (competition.val().active === true) {
            competitionsArray.push({
                name: competition.val().name,
                slug: competition.val().slug,
                apifootball_id: competition.val().apifootball_id,
                status: competition.val().status,
                countries: competition.val().countries
            })
            // }
        })
        // console.log('competitionsArray: ', competitionsArray)

        // 3) Finally, make external request to API-football to fetch fixtures
        let updates = {}
        for (let day of days) {
            const response = await getDailyMatches(day)
            Object.values(response.body.api.fixtures).forEach(match => {
                const competition = competitionsArray.find(competition => competition.apifootball_id == match.league_id)
                if (competition) {
                    // console.log('match: ', match)

                    // Define teams data
                    // const homeTeamData = teamsArray.find(team => parseInt(team.apifootball_id) === parseInt(match.homeTeam.team_id));
                    // let homeTeam_slug = '';
                    // if (!homeTeamData) {
                    //     console.log('No homeTeamData!');
                    //     homeTeam_slug = slugify(match.homeTeam.team_name);
                    // } else {
                    //     homeTeam_slug = homeTeamData.apifootball_slug;
                    // }

                    // const visitorTeamData = teamsArray.find(team => parseInt(team.apifootball_id) === parseInt(match.awayTeam.team_id));
                    // let awayTeam_slug = '';
                    // if (!visitorTeamData) {
                    //     console.log('No visitorTeamData!')
                    //     awayTeam_slug = slugify(match.awayTeam.team_name);
                    // } else {
                    //     awayTeam_slug = visitorTeamData.apifootball_slug;
                    // }

                    const id = match.fixture_id
					// const roundShort = match.round.substring(match.round.lastIndexOf('-') + 2)
					const roundShort =  /\d/.test(match.round) ? match.round.substring(match.round.lastIndexOf('-') + 2) : match.round
					
                    // updates[`/events/${id}/id`] = id;
                    updates[`/events/${id}/date_iso8601`] = match.event_date
                    updates[`/events/${id}/date`] = moment(match.event_date).format('YYYY-MM-DD')
                    updates[`/events/${id}/time`] = moment(match.event_date).format('HH:mm')
                    updates[`/events/${id}/time_utc`] = moment(match.event_date)
                        .utc()
                        .format('HH:mm')
                    updates[`/events/${id}/timestamp`] = match.event_timestamp
                    updates[`/events/${id}/league_id`] = match.league_id
                    updates[`/events/${id}/round`] = match.round
                    updates[`/events/${id}/round_short`] = roundShort
                    updates[`/events/${id}/homeTeam_id`] = match.homeTeam.team_id
                    updates[`/events/${id}/homeTeam_name`] = match.homeTeam.team_name
                    // updates[`/events/${id}/homeTeam_slug`] = homeTeam_slug;
                    updates[`/events/${id}/homeTeam_slug`] = slugify(match.homeTeam.team_name)
                    updates[`/events/${id}/homeTeam_score`] = match.goalsHomeTeam
                    updates[`/events/${id}/visitorTeam_id`] = match.awayTeam.team_id
                    updates[`/events/${id}/visitorTeam_name`] = match.awayTeam.team_name
                    // updates[`/events/${id}/visitorTeam_slug`] = awayTeam_slug;
                    updates[`/events/${id}/visitorTeam_slug`] = slugify(match.awayTeam.team_name)
                    updates[`/events/${id}/visitorTeam_score`] = match.goalsAwayTeam
                    updates[`/events/${id}/score`] = match.score
                    updates[`/events/${id}/elapsed`] = match.elapsed
                    updates[`/events/${id}/venue`] = match.venue
                    updates[`/events/${id}/referee`] = match.referee
                    updates[`/events/${id}/status`] = match.status
                    updates[`/events/${id}/statusShort`] = match.statusShort
                    updates[`/events/${id}/competition_id`] = match.league_id
                    updates[`/events/${id}/competition_name`] = competition.name
					updates[`/events/${id}/competition_slug`] = competition.slug
					updates[`/events/${id}/competition_round`] = `${competition.slug}_${roundShort}`					
                }
            })
        }

        await admin
            .database()
            .ref()
            .update(updates)

        res.send('POST request to API-Football to fetch daily matches succeeded!')
    } catch (error) {
        console.log('APIFootball error: ', error)
        res.end('POST request to API-Football to fetch daily matches failed: ', error.toString())
    }
})
