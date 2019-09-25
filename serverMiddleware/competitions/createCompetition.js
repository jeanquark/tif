const express = require('express'),
	  admin = require('firebase-admin'),
	  unirest = require('unirest'),
	  bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


module.exports = app.use(async function(req, res) {
    try {
		const payload = req.body
		console.log('payload: ', payload)
		throw 'error'
		return

            // 1) Define key from competition slug
            const newCompetitionKey = slugify(payload.country) + '_' + slugify(payload.name) + '_' + parseInt(payload.season) + '_' + (parseInt(payload.season) + 1)
            console.log('newCompetitionKey: ', newCompetitionKey)

            // 2) Define countries object
            const competitionCountries = {}
            competitionCountries[slugify(payload.country)] = {
                name: payload.country,
                slug: slugify(payload.country)
			}
			const competitionName = payload.name
			const competitionSlug = newCompetitionKey
			const competitionImage = `${slugify(payload.country)}_${slugify(payload.name)}.png`
			const competitionType = slugify(payload.type)

			// 3) Define rounds array
			const roundsArray = []
			// const roundsObject = {}

            // 4) Create competition node
            let updates = {}

            updates[`/competitions/${newCompetitionKey}/active`] = false
            updates[`/competitions/${newCompetitionKey}/activity`] = { name: 'Sport', slug: 'sport' }
            updates[`/competitions/${newCompetitionKey}/category`] = { name: 'Football', slug: 'football' }
            updates[`/competitions/${newCompetitionKey}/apifootball_id`] = payload.league_id
            updates[`/competitions/${newCompetitionKey}/apifootball_country`] = payload.country
			updates[`/competitions/${newCompetitionKey}/apifootball_name`] = payload.name
			updates[`/competitions/${newCompetitionKey}/apifootball_season`] = payload.season
            updates[`/competitions/${newCompetitionKey}/season_start`] = payload.season_start
            updates[`/competitions/${newCompetitionKey}/season_end`] = payload.season_end
            updates[`/competitions/${newCompetitionKey}/name`] = competitionName
            updates[`/competitions/${newCompetitionKey}/slug`] = competitionSlug
            updates[`/competitions/${newCompetitionKey}/countries`] = competitionCountries
            updates[`/competitions/${newCompetitionKey}/image`] = competitionImage
            updates[`/competitions/${newCompetitionKey}/season`] = `${payload.season} - ${parseInt(payload.season) + 1}`
			updates[`/competitions/${newCompetitionKey}/type`] = competitionType
            updates[`/competitions/${newCompetitionKey}/_created_at`] = moment().unix()
            updates[`/competitions/${newCompetitionKey}/_updated_at`] = moment().unix()

            // 5) Retrieve all fixtures of the competition
            const leagueId = payload.league_id
            const competitionEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}`, {
                headers: {
                    Accept: 'application/json',
                    'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                }
            })
			console.log('competitionEvents: ', competitionEvents)
		

            // 6) Retrieve all events, all game statistics and all players statistics related to each fixture
            for (let event of competitionEvents.data.api.fixtures) {
                const eventId = event.fixture_id
                commit('setMessage', `${event.homeTeam.team_name} vs ${event.awayTeam.team_name}`, { root: true })

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

                // 6.3) Update eventEvents node
                const eventEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/events/${eventId}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                    }
                })
                const events = eventEvents.data.api.events
                updates[`/eventEvents/${eventId}`] = events

                // 6.4) Update eventGameStatistics node
                const eventGameStatistics = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/statistics/fixture/${eventId}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                    }
                })
                const gameStatistics = eventGameStatistics.data.api.statistics
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
                const eventPlayersStatistics = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/players/fixture/${eventId}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                    }
                })
                const playersStatistics = eventPlayersStatistics.data.api.players
                updates[`/eventPlayersStatistics/${eventId}`] = playersStatistics
            }
			// console.log('updates: ', updates)
			
			// 7) Update competitions with rounds info
			updates[`/competitions/${newCompetitionKey}/rounds`] = roundsArray


            // 8) Retrieve current standings for the new competition
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/leagueTable/${leagueId}`, {
                headers: {
                    Accept: 'application/json',
                    'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                }
            })
            console.log('response.data.api: ', response.data.api)
            Object.values(response.data.api.standings).forEach(teams => {
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
            

            await firebase
                .database()
                .ref()
                .update(updates)

		
		res.send(`POST request to create competition succeeded!`)
		
    } catch (error) {
        console.log('error: ', error)
        res.end(`POST request to create competition failed: ${error}`)
    }
})
