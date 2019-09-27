import * as firebase from 'firebase/app'
import 'firebase/database'
import axios from 'axios'
import slugify from '../helpers/slugify.js'
import moment from 'moment'
import { reject } from 'q';

export const state = () => ({
	competitions: [],
    competitionsById: {},
	loadedCompetitionsByCountry: [],
	competitionsByDate: {}
})

export const mutations = {
    setCompetitions(state, payload) {
        console.log('payload: ', payload)
		state.competitions = payload
    },
    setCompetitionsById(state, payload) {
        console.log('payload: ', payload)
        state.competitionsById = Object.assign({}, state.competitionsById, {
            [payload.id]: payload
        })
    },
    setCompetitionsByCountry(state, payload) {
        state.loadedCompetitionsByCountry = Object.assign({}, state.loadedCompetitionsByCountry, {
            [payload.country]: payload.competitions
        })
    },
    createCompetition(state, payload) {
        state.loadedCompetitions.push(payload)
    },
	setCompetitionsByDate(state, payload) {
		state.competitionsByDate = Object.assign({}, state.competitionsByDate, {
			[payload.date]: payload.competitions
		})
	}
}

export const actions = {
	fetchCompetitionsById({ commit }, payload) {
		return new Promise((resolve, reject) => {
			try {
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
					commit('setCompetitionsById', competition)
					resolve()
				})
			} catch (error) {
				reject(error)
			}
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
		return new Promise((resolve, reject) => {
			try {
				// console.log('Call  to fetchCompetitionsByCountry action: ', payload)
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
			} catch (error) {
				reject(error)
			}
        })
    },
    async fetchCompetitionsByDate({ commit }, payload) {
        console.log('[Call to fetchCompetitionsByDate action:] ', payload)
        const dateCompetitions = await firebase
            .database()
            .ref(`/dateCompetitions/${payload}`)
            .once('value')

        async function isActive (competitionId) {
            const competition = await firebase.database().ref(`/competitions/${competitionId}`).once('value')
            if (competition.val().active) {
                return true
            }
            return false
        }

        const competitionsArray = []
        for (const key in dateCompetitions.val()) {
            const isActiveCompetition = await isActive(key)
            if (isActiveCompetition) {
                competitionsArray.push({
                    ...dateCompetitions.val()[key],
                    id: key
                })
            }
        }

        commit('setCompetitionsByDate', { date: payload, competitions: competitionsArray })
    },
    async TOBEDELETED_createCompetition({ commit }, payload) {
        try {
            const { competition } = payload
            console.log('competition: ', competition)
            const abc = await axios.post('/competitions/create-competition', { competition })
            console.log('abc: ', abc)
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },
    // Create a new competition
    async createCompetition({ commit }, payload) {
        try {
            console.log('payload: ', payload)
            const { competition } = payload
            console.log('competition: ', competition)

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
            updates[`/competitions/${newCompetitionKey}/apifootball_id`] = competition.league_id
            updates[`/competitions/${newCompetitionKey}/apifootball_country`] = competition.country
			updates[`/competitions/${newCompetitionKey}/apifootball_name`] = competition.name
			updates[`/competitions/${newCompetitionKey}/apifootball_season`] = competition.season
            updates[`/competitions/${newCompetitionKey}/season_start`] = competition.season_start
            updates[`/competitions/${newCompetitionKey}/season_end`] = competition.season_end
            updates[`/competitions/${newCompetitionKey}/name`] = competitionName
            updates[`/competitions/${newCompetitionKey}/slug`] = competitionSlug
            updates[`/competitions/${newCompetitionKey}/countries`] = competitionCountries
            updates[`/competitions/${newCompetitionKey}/image`] = competitionImage
            updates[`/competitions/${newCompetitionKey}/season`] = `${competition.season} - ${parseInt(competition.season) + 1}`
			updates[`/competitions/${newCompetitionKey}/type`] = competitionType
            updates[`/competitions/${newCompetitionKey}/_created_at`] = moment().unix()
            updates[`/competitions/${newCompetitionKey}/_updated_at`] = moment().unix()

            // 5) Retrieve all fixtures of the competition
            const leagueId = competition.id
            console.log('leagueId: ', leagueId)
            // return
            // throw 'new error'
            const competitionEvents = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${leagueId}`, {
                headers: {
                    // Accept: 'application/json',
                    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
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
                        // Accept: 'application/json',
                        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
                        'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                    }
                })
                const events = eventEvents.data.api.events
                updates[`/eventEvents/${eventId}`] = events

                // 6.4) Update eventGameStatistics node
                const eventGameStatistics = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/statistics/fixture/${eventId}`, {
                    headers: {
                        // Accept: 'application/json',
                        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
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
                        // Accept: 'application/json',
                        "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
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
                    // Accept: 'application/json',
                    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
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

        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },
    // async fetchTeamsByCompetition({ commit }, payload) {
    //     const { competitionSlug } = payload
    //     console.log('competitionSlug: ', competitionSl)
    //     const teams = await firebase.database().ref(`/teams/competitions`).once('value')
    //     console.log('teams: ', teams)
    // },
    async setTeamsByCompetition({ commit }, payload) {
        try {
            console.log('setTeamsByCompetition action', payload)
            const { leagueId, competitionSlug } = payload
            
            const fetchedTeams = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/teams/league/${leagueId}`, {
                headers: {
                    Accept: 'application/json',
                    'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
                }
            })
            console.log('fetchedTeams: ', fetchedTeams)
            let updates = {}
            fetchedTeams.data.api.teams.forEach(team => {
                const teamSlug = slugify(team.name)
                updates[`/teams/${teamSlug}/slug`] = teamSlug
                updates[`/teams/${teamSlug}/apifootball_id`] = team.team_id
                updates[`/teams/${teamSlug}/apifootball_name`] = team.name
                updates[`/teams/${teamSlug}/image`] = `${teamSlug}.png`
                updates[`/teams/${teamSlug}/competitions/${competitionSlug}`] = true
            })
            await firebase
                .database()
                .ref()
                .update(updates)
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },

    // Update a competition
    async toggleCompetitionActiveStatus({ commit, dispatch }, payload) {
        try {
			// console.log('payload: ', payload)
            const { competitions, competition } = payload

            // 1) Update active competitions file on the server
			await axios.post('/competitions/update-competitions-file', { competitions })
			
            competition['_updated_at'] = moment().unix()

            let updates = {}

            // 2) Update all events that are part of the competition
            const competitionEvents = await firebase
                .database()
                .ref('/events')
                .orderByChild('competition_slug')
                .equalTo(competition.slug)
                .once('value')

            // console.log('competitionEvents: ', competitionEvents)
            competitionEvents.forEach(event => {
                if (event.val() && event.val().competition_active) {
                    updates[`/events/${event.key}/competition_active`] = false
                } else {
                    updates[`/events/${event.key}/competition_active`] = true
                }
            })

            // 3) Update competitions node
            updates[`/competitions/${competition.slug}`] = competition
            // console.log('updates: ', updates)

            await firebase
                .database()
                .ref()
                .update(updates)
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
    loadedCompetitions(state) {
        return state.competitions
    },
    loadedCompetitionsById(state) {
        return state.competitionsById
    },
    loadedCompetitionsByCountry(state) {
        return state.loadedCompetitionsByCountry
	},
	loadedCompetitionsByDate(state) {
		return state.competitionsByDate
	}
}
