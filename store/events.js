import * as firebase from 'firebase/app'
import 'firebase/database'
import Noty from 'noty'
import moment from 'moment'

export const state = () => ({
    loadedEventsById: {},
    userEventsByDate: {},
    eventsByDateByCompetition: {},
    eventsByCompetitionByRound: {},
    loadedEventActionsUserNotification: {}
})

export const mutations = {
    setEmptyEvents(state) {
        state.loadedEvents = []
    },
    setEventsById(state, payload) {
        state.loadedEventsById = Object.assign({}, state.loadedEventsById, {
            [payload.id]: payload
        })
    },
    setUserEventsByDate(state, payload) {
        // console.log('setUserEventsByDate: ', payload)
        state.userEventsByDate = Object.assign({}, state.userEventsByDate, {
            [payload.date]: payload.events
        })
    },
    setEventsByDateByCompetition(state, payload) {
        // console.log('Call to event/setEventsByDateByCompetition mutation', payload)
        state.eventsByDateByCompetition = Object.assign({}, state.eventsByDateByCompetition, {
			[payload.date]: Object.assign({}, state.eventsByDateByCompetition[payload.date], {
				[payload.competition]: payload.events
            })
		})
    },
    setEventsByCompetitionByRound(state, payload) {
        // console.log('setEventsByCompetitionByRound: ', payload)
        // console.log('competitionId: ', payload.competition)
        const competition = payload.competition
        // console.log('competition: ', competition)
        const round = payload.round
        // console.log('round: ', round)
        state.eventsByCompetitionByRound = Object.assign({}, state.eventsByCompetitionByRound, {
            [competition]: Object.assign({}, state.eventsByCompetitionByRound[competition], {
				[round]: payload.events
            })
        })
    },
    setEventActionsUserNotification(state, payload) {
        state.loadedEventActionsUserNotification = payload
    },
    clearEvents(state) {
        state.loadedEvents = {}
	}
}

export const actions = {
    async fetchEventById({ commit }, payload) {
        console.log('fetchEventById action: ', payload)
        return new Promise((resolve, reject) => {
            try {
                firebase
                    .database()
                    .ref('/events')
                    .child(payload)
                    .on('value', function(snapshot) {
                        const event = { ...snapshot.val(), id: snapshot.key }
                        commit('setEventsById', event)
                        resolve()
                    })

                // Also add a listener
                // firebase
                //     .database()
                //     .ref(`events/${payload}`)
                //     .on('child_added', function(data) {
                //         console.log('CHILD ADDED! ', data)
                //     })
                // firebase
                //     .database()
                //     .ref(`events/${payload}`)
                //     .on('child_removed', function(data) {
                //         console.log('CHILD REMOVED! ', data)
                //     })
            } catch (error) {
                console.log('error: ', error)
                reject(error)
            }
        })
    },
    fetchEventsByDateByCompetition({ commit }, payload) {
		return new Promise((resolve, reject) => {
			try {
				console.log('Call to fetchEventsByDateByCompetition action: ', payload)
				const date_competition = `${payload.date}_${payload.competition}`
				firebase
					.database()
					.ref('/events/')
					.orderByChild('date_competition')
					.equalTo(date_competition)
					.on('value', function(snapshot) {
						const eventsArray = []
						snapshot.forEach(event => {
							if (event.val().competition_active !== false) {
								eventsArray.push({ ...event.val(), id: event.key })
							}
						})
						const sortedEventsArray = eventsArray.sort((a, b) => a.timestamp - b.timestamp)
						// const events = { date: date, events: sortedEventsArray }
						const events = { date: payload.date, competition: payload.competition, events: sortedEventsArray }
						console.log('events: ', events)
						commit('setEventsByDateByCompetition', events)
						resolve()
					})
			} catch (error) {
				console.log('error: ', error)
				reject(error)
			}
		})
	},
	fetchEventsByCompetitionByRound({ commit }, payload) {
		console.log('fetchEventsByCompetitionByRound action: ', payload.competitionSlug, payload.roundSlug)
		return new Promise((resolve, reject) => {
			try {
				firebase
					.database()
					.ref('/events/')
					.orderByChild('competition_round')
					// .equalTo('switzerland_super_league_2019_2020_1')
					.equalTo(`${payload.competitionSlug}_${payload.roundSlug}`)
					.on('value', function(snapshot) {
						const eventsArray = []
						snapshot.forEach(event => {
							// if (event.val().competition_active !== false) {
								eventsArray.push({ ...event.val(), id: event.key })
							// }
						})
						const sortedEventsArray = eventsArray.sort((a, b) => a.timestamp - b.timestamp)
						// const events = { date: date, events: sortedEventsArray }
						console.log('sortedEventsArray: ', sortedEventsArray)
						const events = { round: payload.roundSlug, competition: payload.competitionSlug, events: sortedEventsArray }
						console.log('events: ', events)
						commit('setEventsByCompetitionByRound', events)
						resolve()
					})
			} catch (error) {
				console.log('error: ', error)
				reject(error)
			}
		})
	},
    async fetchUserEventsByDate ({ commit, rootGetters }, payload) {
        try {
            console.log('[Call to fetchUserEventsByDate action:] ', payload)
            // 1) Get user teams
            const userTeams = rootGetters['userTeams/loadedUserTeams']
            // console.log('userTeams: ', userTeams)
            const date = payload
            // console.log('date: ', date)

            // 2) For each team, retrieve events for the selected day
            for (let team of userTeams) {
                // console.log('team: ', team)
                const date_homeTeamId = `${date}_${team.apifootball_id}`
                const date_awayTeamId = `${date}_${team.apifootball_id}`
                // console.log('date_homeTeamId: ', date_homeTeamId)
                // console.log('date_awayTeamId: ', date_awayTeamId)
                firebase.database().ref('/events').orderByChild('date_homeTeamId').equalTo(date_homeTeamId).on('value', function(snapshot) {
                    const eventsObject = {}
                    snapshot.forEach(event => {
                        console.log('event.key: ', event.key)
                        if (event && event.key) {
                            eventsObject[event.key] = { ...event.val(), id: event.key }
                            console.log('commit!')
                            commit('setUserEventsByDate', { date, events: eventsObject})
                        }
                    })
                })
                firebase.database().ref('/events').orderByChild('date_homeTeamId').equalTo(date_homeTeamId).on('value', function(snapshot) {
                    const eventsObject = {}
                    snapshot.forEach(event => {
                        console.log('event.key: ', event.key)
                        if (event && event.key) {
                            eventsObject[event.key] = { ...event.val(), id: event.key }
                            console.log('commit!')
                            commit('setUserEventsByDate', { date, events: eventsObject})
                        }
                    })
                })
            }
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },
    async addUserToEvent({ commit, rootGetters }, payload) {
        try {
            console.log('addUserToEvent: ', payload)
            const user = rootGetters['users/loadedUser']
			console.log('user: ', user)
			let updates = {}

			updates[`/events/${payload.eventId}/users/${user.id}`] = {
				id: user.id,
				username: user.username || null,
				picture: user.picture || null,
				level: user.level ? user.level.value : '',
				team: payload.teamId,
				active: true
			}

			// Provide a notification to the rest of the players
			if (payload['isFanHomeTeam']) {
				updates[`/events/${payload.eventId}/homeTeam_notification`] = `${user.username} has joined the game`
			} else {
				updates[`/events/${payload.eventId}/visitorTeam_notification`] = `${user.username} has joined the game`
			}
			firebase.database().ref().update(updates)
			
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },
    async removeUserFromEvent({ commit }, payload) {
        try {
			console.log('removeUserFromEvent: ', payload)
			let updates = {}

			updates[`/events/${payload.eventId}/users/${payload.user.id}/active`] = false

			// Provide a notification to the rest of the players
			if (payload['isFanHomeTeam']) {
				updates[`/events/${payload.eventId}/homeTeam_notification`] = `${payload.user.username} left the game`
			} else {	
				updates[`/events/${payload.eventId}/visitorTeam_notification`] = `${payload.user.username} left the game`
			}
			firebase.database().ref().update(updates)
			
        } catch (error) {
			console.log('error: ', error)
			throw error
        }
    },
    async addActionToEvent({ commit, rootGetters }, payload) {
        try {
            console.log('addActionToEvent: ', payload)
            // const user = { id: rootGetters['users/loadedUser']['id'], username: rootGetters['users/loadedUser']['username'] }
            const user = rootGetters['users/loadedUser']

            // 1) Generate a random ID that, for ordering purposes, is the remaining seconds until December 1st, 2050 and today appended by a random number between 1 and 1000
            const newNode = 2553465600 - moment().unix() + '_' + Math.floor(Math.random() * 1000)
            // const newNode = moment().add(10, 'years').unix() - moment().unix() + '_' + Math.floor(Math.random() * 1000)

            // 2) Add new action to event node
            delete payload.action.id
            const min_participants_count = Math.ceil((payload.usersCount * payload.action.min_participants_percent || 0) / 100)
            await firebase
                .database()
                .ref(`/events/${payload.eventId}/actions/${newNode}`)
                .set({
                    id: newNode,
                    userId: user.id,
                    username: user.username,
					usersCount: 1,
					completed: false,
                    users: {
						[user.id]: {
							userId: user.id,
                            username: user.username,
                            picture: user.picture
                        }
                    },
					_created_at: moment().unix(),
                    min_participants_count,
                    // progress: 0,
                    // completed: false,
                    ...payload.action
                })

            // 3) Also, add a listener to be notified when users join in
            firebase
                .database()
                .ref(`events/${payload.eventId}/actions/${newNode}/users`)
                .on('child_added', function(data) {
                    let user = data.val()
                    console.log('user: ', user)
                    user.action = payload.action['name']
                    console.log('CHILD ADDED! ', user)
                    if (user.userId !== rootGetters['users/loadedUser'].id) {
                        commit('setEventActionsUserNotification', user)
                        new Noty({
                            type: 'info',
                            text: `${user.username} has joined your action.`,
                            timeout: 5000,
                            theme: 'metroui'
                        }).show()
                    }
                })
        } catch (error) {
            console.log('error: ', error)
            throw error
        }
    },
    joinAction({ commit, rootGetters }, payload) {
        try {
            console.log('joinAction: ', payload)
            const user = rootGetters['users/loadedUser']
            const userId = user.id

            // 1) Add user to action
            let updates = {}

			updates[`/events/${payload.eventId}/actions/${payload.action.id}/users/${userId}`] = { userId, username: user.username, picture: user.picture }
			
			// 2) Check if action is completed
            if (payload.usersCount + 1 >= payload.action.min_participants_count) {
				updates[`/events/${payload.eventId}/actions/${payload.action.id}/completed`] = true
				updates[`/events/${payload.eventId}/homeTeam_pf`] = payload.homeTeam_pf + (payload.action.gain_pf / 2)
				updates[`/events/${payload.eventId}/visitorTeam_pf`] = payload.visitorTeam_pf + (payload.action.gain_pf / 2)
            }

            firebase
                .database()
                .ref()
                .update(updates)

            // 3) Update action users counter
            firebase
                .database()
                .ref(`events/${payload.eventId}/actions/${payload.action.id}`)
                .transaction(function(action) {
                    if (action) {
                        if (!action.usersCount) {
                            action.usersCount = 1
                        } else {
                            action.usersCount++
                        }
                    }
                    return action
                })
        } catch (error) {
			console.log('error: ', error)
            throw error
        }
    }
}

export const getters = {
    loadedEventsById(state) {
        return state.loadedEventsById
    },
    loadedUserEventsByDate(state) {
        return state.userEventsByDate
    },
    loadedEventsByDateByCompetition(state) {
        return state.eventsByDateByCompetition
    },
    loadedEventsByCompetitionByRound(state) {
        return state.eventsByCompetitionByRound
    },
    loadedEventActionsUserNotification(state) {
        return state.loadedEventActionsUserNotification
    }
}
