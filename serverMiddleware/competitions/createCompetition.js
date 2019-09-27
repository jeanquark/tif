const express = require('express'),
	  admin = require('firebase-admin'),
	  unirest = require('unirest'),
      moment = require('moment'),
	  bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

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

module.exports = app.use(async function(req, res) {
    try {
		const payload = req.body
		console.log('payload: ', payload)
        const { competition } = payload
        // res.send(competition)
        // for (let i = 0; i < 10; i++) {
        //     console.log(`Season ${i}`)
        //     res.write(`Season ${i}`)
        // }
        // res.end(competition)
		// throw 'error'
		// return

        // 1) Define key from competition slug
        const newCompetitionKey = slugify(competition.country) + '_' + slugify(competition.name) + '_' + parseInt(competition.season) + '_' + (parseInt(competition.season) + 1)
        console.log('newCompetitionKey: ', newCompetitionKey)

        // 2) Define countries object
        const competitionCountries = {}
        competitionCountries[slugify(competition.country)] = {
            name: competition.country,
            slug: slugify(competition.country)
		}
		const competitionName = competition.name
		const competitionSlug = newCompetitionKey
		const competitionImage = `${slugify(competition.country)}_${slugify(competition.name)}.png`
		const competitionType = slugify(competition.type)

		// 3) Define rounds array
		const roundsArray = []
		// const roundsObject = {}

        // 4) Create competition node
        let updates = {}

        updates[`/competitions/${newCompetitionKey}/active`] = false
        updates[`/competitions/${newCompetitionKey}/activity`] = { name: 'Sport', slug: 'sport' }
        updates[`/competitions/${newCompetitionKey}/category`] = { name: 'Football', slug: 'football' }
        updates[`/competitions/${newCompetitionKey}/apifootball_id`] = competition.id
        updates[`/competitions/${newCompetitionKey}/apifootball_country`] = competition.country
		updates[`/competitions/${newCompetitionKey}/apifootball_name`] = competition.name
		updates[`/competitions/${newCompetitionKey}/apifootball_season`] = competition.season
        updates[`/competitions/${newCompetitionKey}/season_start`] = competition.seasonStart
        updates[`/competitions/${newCompetitionKey}/season_end`] = competition.seasonEnd
        updates[`/competitions/${newCompetitionKey}/name`] = competitionName
        updates[`/competitions/${newCompetitionKey}/slug`] = competitionSlug
        updates[`/competitions/${newCompetitionKey}/countries`] = competitionCountries
        updates[`/competitions/${newCompetitionKey}/image`] = competitionImage
        updates[`/competitions/${newCompetitionKey}/season`] = `${competition.season} - ${parseInt(competition.season) + 1}`
		updates[`/competitions/${newCompetitionKey}/type`] = competitionType
        updates[`/competitions/${newCompetitionKey}/_created_at`] = moment().unix()
        updates[`/competitions/${newCompetitionKey}/_updated_at`] = moment().unix()

        // console.log('updates: ', updates)

        // 5) Retrieve all fixtures of the competition
        const leagueId = competition.id
        console.log('leagueId: ', leagueId)
        // const competitionEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}`, {
        //     headers: {
        //         Accept: 'application/json',
        //         'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
        //     }
        // })
        const competitionEvents = await unirest.get(`https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}`).headers({
            'Accept': 'application/json',
            'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
        });
		// console.log('competitionEvents: ', competitionEvents)

	

        // 6) Retrieve all events, all game statistics and all players statistics related to each fixture
        for (let event of competitionEvents.body.api.fixtures) {
        // Object.values(competitionEvents.body.api.fixtures).forEach(event => {
            const eventId = event.fixture_id
            // console.log('eventId: ', eventId)
            // commit('setMessage', `${event.homeTeam.team_name} vs ${event.awayTeam.team_name}`, { root: true })

            const eventDate = moment(event.event_date).format('YYYY-MM-DD')
            // const roundShort = /\d/.test(event.round) ? event.round.substring(event.round.lastIndexOf('-') + 2) : event.round

			if (!roundsArray.find(round => round.slug === slugify(event.round))) {
				roundsArray.push({ name: event.round, slug: slugify(event.round), timestamp: event.event_timestamp })
			}
			// roundsObject[slugify(event.round)] = {
			// 	name: event.round,
			// 	slug: slugify(event.round),
			// 	timestamp: event.event_timestamp,
			// }

            // 6.1) Update dateCompetitions node
            const dateCompetition = {
                name: competitionName,
                slug: competitionSlug,
                countries: competitionCountries,
                image: competitionImage,
				date: eventDate,
				type: competitionType
            }
            updates[`dateCompetitions/${slugify(eventDate)}/${competitionSlug}`] = dateCompetition

			// 6.2) Update events node
			event['competition_name'] = competitionName
			event['competition_slug'] = competitionSlug
            event['competition_round'] = `${competitionSlug}_${slugify(event.round)}`
			event['date_competition'] = `${slugify(eventDate)}_${competitionSlug}`
			event['date'] = moment(event.event_date).format('YYYY-MM-DD')
			event['date_iso8601'] = event.event_date
            event['timestamp'] = event.event_timestamp
			event['time'] = moment(event.event_date).format('HH:mm')
            event['time_utc'] = moment(event.event_date).utc().format('HH:mm')
            event['homeTeam_id'] = event.homeTeam.team_id
            event['homeTeam_name'] = event.homeTeam.team_name
            event['homeTeam_slug'] = slugify(event.homeTeam.team_name)
            event['homeTeam_score'] = event.goalsHomeTeam
            event['awayTeam_id'] = event.awayTeam.team_id
            event['awayTeam_name'] = event.awayTeam.team_name
            event['awayTeam_slug'] = slugify(event.awayTeam.team_name)
			event['awayTeam_score'] = event.goalsAwayTeam
			event['status'] = event.status
			event['statusShort'] = event.statusShort
            event['round'] = event.round
			event['roundShort'] = null
			event['round_slug'] = slugify(event.round)
			event['elapsed'] = event.elapsed
			event['venue'] = event.venue
			event['referee'] = event.referee
            event['notificationScore'] = {
                homeTeam_id: event.homeTeam.team_id,
                homeTeam_name: event.homeTeam.team_name,
                homeTeam_score: event.goalsHomeTeam,
                awayTeam_id: event.awayTeam.team_id,
                awayTeam_name: event.awayTeam.team_name,
                awayTeam_score: event.goalsAwayTeam
            }
            event['notificationStatus'] = {
                homeTeam_id: event.homeTeam.team_id,
                homeTeam_name: event.homeTeam.team_name,
                awayTeam_id: event.awayTeam.team_id,
                awayTeam_name: event.awayTeam.team_name,
                statusShort: event.statusShort,
                score: event.score
            }
            event['date_homeTeamId'] = `${slugify(eventDate)}_${event.homeTeam.team_id}`
            event['date_awayTeamId'] = `${slugify(eventDate)}_${event.awayTeam.team_id}`
            event['homeTeam'] = null
            event['goalsHomeTeam'] = null
            event['awayTeam'] = null
			event['goalsAwayTeam'] = null
			event['event_date'] = null
            event['event_timestamp'] = null

            updates[`/events/${eventId}`] = event
            // throw 'new error'


            // 6.3) Update eventEvents node
            // const eventEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/events/${eventId}`, {
            //     headers: {
            //         Accept: 'application/json',
            //         'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
            //     }
            // })
            const eventEvents = await unirest.get(`https://api-football-v1.p.rapidapi.com/v2/events/${eventId}`).headers({
                'Accept': 'application/json',
                'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
            });

            const events = eventEvents.body.api.events
            updates[`/eventEvents/${eventId}`] = events

            // 6.4) Update eventGameStatistics node
            // const eventGameStatistics = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/statistics/fixture/${eventId}`, {
            //     headers: {
            //         Accept: 'application/json',
            //         'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
            //     }
            // })
            const eventGameStatistics = await unirest.get(`https://api-football-v1.p.rapidapi.com/v2/statistics/fixture/${eventId}`).headers({
                'Accept': 'application/json',
                'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
            });
            const gameStatistics = eventGameStatistics.body.api.statistics
            const statisticsObject = {}
            Object.keys(gameStatistics).forEach(statistic => {
                statisticsObject[slugify(statistic)] = {
                    name: statistic,
                    slug: slugify(statistic),
                    ...gameStatistics[statistic]
                }
            })
            updates[`/eventGameStatistics/${eventId}`] = statisticsObject

            // 6.5) Update event/playerStatistics node
            // const eventPlayersStatistics = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/players/fixture/${eventId}`, {
            //     headers: {
            //         Accept: 'application/json',
            //         'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
            //     }
            // })
            const eventPlayersStatistics = await unirest.get(`https://api-football-v1.p.rapidapi.com/v2/players/fixture/${eventId}`).headers({
                'Accept': 'application/json',
                'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
            });
            const playersStatistics = eventPlayersStatistics.body.api.players
            updates[`/eventPlayersStatistics/${eventId}`] = playersStatistics
        }
		// console.log('updates: ', updates)
		
		// 7) Update competitions with rounds info
		updates[`/competitions/${newCompetitionKey}/rounds`] = roundsArray


        // 8) Retrieve current standings for the new competition
        // const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/leagueTable/${leagueId}`, {
        //     headers: {
        //         Accept: 'application/json',
        //         'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
        //     }
        // })
        const response = await unirest.get(`https://api-football-v1.p.rapidapi.com/v2/leagueTable/${leagueId}`).headers({
            'Accept': 'application/json',
            'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
        });
        console.log('response.data.api: ', response.body.api)
        Object.values(response.body.api.standings).forEach(teams => {
            teams.forEach(team => {
                // console.log('team: ', team)
                updates[`/standings/${newCompetitionKey}/${team.rank}/rank`] = team.rank
                updates[`/standings/${newCompetitionKey}/${team.rank}/team_id`] = team.team_id
                updates[`/standings/${newCompetitionKey}/${team.rank}/team_name`] = team.teamName
                updates[`/standings/${newCompetitionKey}/${team.rank}/team_slug`] = slugify(team.teamName)
                updates[`/standings/${newCompetitionKey}/${team.rank}/all`] = team.all
                updates[`/standings/${newCompetitionKey}/${team.rank}/home`] = team.home
                updates[`/standings/${newCompetitionKey}/${team.rank}/away`] = team.away
                updates[`/standings/${newCompetitionKey}/${team.rank}/goalsDiff`] = team.goalsDiff
                updates[`/standings/${newCompetitionKey}/${team.rank}/points`] = team.points
                updates[`/standings/${newCompetitionKey}/${team.rank}/forme`] = team.forme
                updates[`/standings/${newCompetitionKey}/${team.rank}/description`] = team.description
                updates[`/standings/${newCompetitionKey}/${team.rank}/lastUpdate`] = team.lastUpdate
            });
        });
        

        await admin.database().ref().update(updates);

		
		res.send(`POST request to create competition succeeded!`)
		
    } catch (error) {
        // console.log('error: ', error)
        // res.end(`POST request to create competition failed: ${error}`)
        res.status(500).send(`POST request to create competition failed: ${error}`);
    }
})
