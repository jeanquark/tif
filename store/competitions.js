import * as firebase from 'firebase/app'
import 'firebase/database'
import Noty from 'noty'
import axios from 'axios'
import slugify from '../helpers/slugify.js'
import moment from 'moment'

export const state = () => ({
	competitions: [],
    competitionsObject: {},
	// allCompetitions: [],
	loadedCompetitionsByCountry: [],
	competitionsByDate: {}
})

export const mutations = {
    // setEmptyCompetitions(state) {
    //     state.loadedCompetitions = []
	// },
	// setAllCompetitions(state, payload) {
	// 	state.allCompetitions = payload
 //    },
    setCompetitions(state, payload) {
        console.log('payload: ', payload)
		state.competitions = payload
    },
    setCompetitionsObject(state, payload) {
        console.log('payload: ', payload)
        state.competitionsObject = Object.assign({}, state.competitionsObject, {
            [payload.id]: payload
        })
    },
    setCompetitionsByCountry(state, payload) {
        // state.loadedCompetitions = payload
        state.loadedCompetitionsByCountry = Object.assign({}, state.loadedCompetitionsByCountry, {
            [payload.country]: payload.competitions
        })
    },
    createCompetition(state, payload) {
        state.loadedCompetitions.push(payload)
    },
    // updateCompetition (state, payload) {
    //     state.loadedCompetitions = payload
    // },
    // deleteCompetition (state, competitionId) {
    //     const loadedCompetitions = state.loadedCompetitions
    //     state.loadedCompetitions.splice(loadedCompetitions.findIndex(competition => competition.id === competitionId), 1)
	// }
	setCompetitionsByDate(state, payload) {
		// state.competitionsByDate = payload
		state.competitionsByDate = Object.assign({}, state.competitionsByDate, {
			[payload.date]: payload.competitions
		})
	}
}

export const actions = {
	fetchCompetition({ commit }, payload) {
		console.log('Call to fetchCompetition action: ', payload)
		firebase
            .database()
			.ref('/competitions')
			.orderByChild('slug')
            .equalTo(payload)
            .on('value', function(snapshot) {
				let competition = {}
                for (const key in snapshot.val()) {
                    competition = {
                        ...snapshot.val()[key],
                        id: key
                    }
				}
				// console.log('competition: ', competition)
				commit('setCompetitionsObject', competition)
            })
	},
	fetchCompetitions({ commit }) {
        console.log('Call to fetchCompetitions action')
        firebase
            .database()
            .ref('/competitions/')
            .on('value', function(snapshot) {
                const competitionsArray = []
                for (const key in snapshot.val()) {
                    competitionsArray.push({
                        ...snapshot.val()[key],
                        id: key
                    })
				}
				console.log('competitionsArray: ', competitionsArray)
                commit('setCompetitions', competitionsArray)
            })
    },
    fetchCompetitionsByCountry({ commit }, payload) {
        return new Promise(resolve => {
            firebase
                .database()
                .ref('/competitions')
                .orderByChild(`countries/${payload}/slug`)
                .equalTo(payload)
                .on('value', function(snapshot) {
                    const competitionsArray = []
                    for (const key in snapshot.val()) {
                        if (snapshot.val()[key].active === true) {
                            competitionsArray.push({
                                ...snapshot.val()[key],
                                id: key
                            })
                        }
                    }
                    const orderedCompetitions = competitionsArray.sort((a, b) => a.ranking_country - b.ranking_country)
                    commit('setCompetitionsByCountry', {
                        country: payload,
                        competitions: orderedCompetitions
                    })
                    resolve()
                })
        })
    },
    async fetchCompetitionsByDate({ commit }, payload) {
        console.log('Call to fetchCompetitionsByDay action: ', payload)
        const snapshot = await firebase
            .database()
            .ref(`/dateCompetitions/${payload}`)
            .once('value')

        const competitionsArray = []
        snapshot.forEach(competition => {
            competitionsArray.push({ ...competition.val(), id: competition.key })
        })

        commit('setCompetitionsByDate', { date: payload, competitions: competitionsArray })
    },

    // Create a new competition
    async createCompetition({ commit }, payload) {
        try {
            // commit('setLoading', true, { root: true })
            console.log('payload: ', payload)
            // commit('setMessage', 'Ceci est un message 4', { root: true })
            // return
            // throw 'error'

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

            // 3) Create competition node
            let updates = {}

            // const newCompetition = {
            //     active: false,
            //     activity: {
            //         name: 'Sport',
            //         slug: 'sport'
            //     },
            //     category: {
            //         name: 'Football',
            //         slug: 'football'
            //     },
            //     apifootball_id: payload.league_id,
            //     apifootball_country: payload.country,
            //     apifootball_name: payload.name,
            //     apifootball_season: payload.season,
            //     season_start: payload.season_start,
            //     season_end: payload.season_end,
            //     name: payload.name,
            //     slug: newCompetitionKey,
            //     countries,
            //     image: `${slugify(payload.country)}_${slugify(payload.name)}.png`,
			// 	season: `${payload.season} - ${parseInt(payload.season) + 1}`,
			// 	type: slugify(payload.type),
            //     _created_at: moment().unix(),
            //     _updated_at: moment().unix()
            // }
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
			updates[`/competitions/${newCompetitionKey}/rounds`] = parseInt(payload.rounds)
            updates[`/competitions/${newCompetitionKey}/_created_at`] = moment().unix()
            updates[`/competitions/${newCompetitionKey}/_updated_at`] = moment().unix()

            // 4) Retrieve all fixtures of the competition
            const leagueId = payload.league_id
            const competitionEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}`, {
                headers: {
                    Accept: 'application/json',
                    'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                }
            })
            console.log('competitionEvents: ', competitionEvents)

            // 5) Retrieve all events, all game statistics and all players statistics related to each fixture
            for (let event of competitionEvents.data.api.fixtures) {
                const eventId = event.fixture_id
                commit('setMessage', `${event.homeTeam.team_name} vs ${event.awayTeam.team_name}`, { root: true })

                const eventDate = moment(event.event_date).format('YYYY-MM-DD')
                const roundShort = /\d/.test(event.round) ? event.round.substring(event.round.lastIndexOf('-') + 2) : event.round

                // 5.1) Update dateCompetitions node
                const dateCompetition = {
                    name: competitionName,
                    slug: competitionSlug,
                    countries: competitionCountries,
                    image: competitionImage,
					date: eventDate,
					type: competitionType,
                    rounds: parseInt(payload.rounds)
                }
                updates[`dateCompetitions/${slugify(eventDate)}/${competitionSlug}`] = dateCompetition

				// 5.2) Update events node
				event['competition_name'] = competitionName
				event['competition_slug'] = competitionSlug
                event['competition_round'] = `${competitionSlug}_${roundShort}`
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
				event['roundShort'] = roundShort
				event['elapsed'] = event.elapsed
				event['venue'] = event.venue
				event['referee'] = event.referee
                event['notificationScore'] = {
                    homeTeam_id: event.homeTeam.team_id,
                    // homeTeam_short: ,
                    homeTeam_name: event.homeTeam.team_name,
                    homeTeam_score: event.goalsHomeTeam,
                    awayTeam_id: event.awayTeam.team_id,
                    // awayTeam_short: ,
                    awayTeam_name: event.awayTeam.team_name,
                    awayTeam_score: event.goalsAwayTeam
                }
                event['notificationStatus'] = {
                    homeTeam_id: event.homeTeam.team_id,
                    // homeTeam_short: ,
                    homeTeam_name: event.homeTeam.team_name,
                    awayTeam_id: event.awayTeam.team_id,
                    // awayTeam_short: ,
                    awayTeam_name: event.awayTeam.team_name,
                    statusShort: event.statusShort,
                    score: event.score
                }
                event['homeTeam'] = null
                event['goalsHomeTeam'] = null
                event['awayTeam'] = null
				event['goalsAwayTeam'] = null
				event['event_date'] = null
                event['event_timestamp'] = null

                updates[`/events/${eventId}`] = event

                // 5.3) Update eventEvents node
                const eventEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/events/${eventId}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                    }
                })
                const events = eventEvents.data.api.events
                updates[`/eventEvents/${eventId}`] = events

                // 5.4) Update eventGameStatistics node
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

                // 5.5) Update event/playerStatistics node
                const eventPlayersStatistics = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/players/fixture/${eventId}`, {
                    headers: {
                        Accept: 'application/json',
                        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                    }
                })
                const playersStatistics = eventPlayersStatistics.data.api.players
                updates[`/eventPlayersStatistics/${eventId}`] = playersStatistics
            }
            console.log('updates: ', updates)

            await firebase
                .database()
                .ref()
                .update(updates)
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },
    async fetchTeamsByCompetition({ commit }, payload) {
        try {
            // console.log('fetchTeamsByCompetition', payload)
            const league_id = payload.apifootball_id
            // const league_id = payload
            const fetchedTeams = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/teams/league/${league_id}`, {
                headers: {
                    Accept: 'application/json',
                    'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                }
            })
            console.log('fetchedTeams: ', fetchedTeams)
            let updates = {}
            fetchedTeams.data.api.teams.forEach(team => {
                const teamSlug = slugify(team.name)
                team['slug'] = teamSlug
                team['apifootball_id'] = team.team_id
                team['apifootball_name'] = team.name
                team['competitions'] = Object.assign({}, team['competitions'], {
                    [payload.slug]: true
                })
                team['image'] = `${teamSlug}.png`
                delete team['logo']
                delete team['team_id']
                updates[`/teams/${teamSlug}`] = team
            })
            // console.log('updates: ', updates)
            await firebase
                .database()
                .ref()
                .update(updates)
            return
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },

    // Update a competition
    async toggleCompetitionActiveStatus({ commit, dispatch }, payload) {
        try {
            console.log(payload)
            payload['_updated_at'] = moment().unix()

            let updates = {}
            // 1) Update all events that are part of the competition
            const competitionEvents = await firebase
                .database()
                .ref('/events')
                .orderByChild('competition_slug')
                .equalTo(payload.slug)
                .once('value')
            competitionEvents.forEach(event => {
                // console.log('event.val(): ', event.val())
                if (event.val().competition_active) {
                    updates[`/events/${event.key}/competition_active`] = false
                } else {
                    updates[`/events/${event.key}/competition_active`] = true
                }
            })
            // 2) Update competitions node
            updates[`/competitions/${payload.slug}`] = payload

            await firebase
                .database()
                .ref()
                .update(updates)

            // dispatch('loadedCompetitions')
        } catch (error) {
            throw error
        }
    },
    // Delete a competition
    async deleteCompetition({ commit }, payload) {
        try {
            console.log('payload: ', payload)
            const competition = payload
            let updates = {}

            // 1) Delete competition for each team that takes part of the competition in teams node
            const teamsArray = []
            const snapshot = await firebase
                .database()
                .ref('/teams/')
                .orderByChild(`competitions/${competition.id}`)
                .equalTo(true)
                .once('value')

            snapshot.forEach(team => {
                teamsArray.push({
                    id: team.key,
                    ...team.val()
                })
            })
            console.log('teamsArray: ', teamsArray)
            teamsArray.forEach(team => {
                updates[`/teams/${team.id}/competitions/${competition.id}`] = null
            })

            // 2) Delete competition in competitions node
            updates[`/competitions/${competition.id}`] = null

            console.log('updates: ', updates)
            await firebase
                .database()
                .ref()
                .update(updates)
            return
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    }
}

export const getters = {
	// loadedAllCompetitions(state) {
	// 	return state.allCompetitions
	// },
    loadedCompetitions(state) {
        return state.competitions
    },
    loadedCompetitionsObject(state) {
        return state.competitionsObject
    },
    loadedCompetitionsByCountry(state) {
        return state.loadedCompetitionsByCountry
	},
	loadedCompetitionsByDate(state) {
		return state.competitionsByDate
	}
}
