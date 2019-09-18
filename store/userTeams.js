import moment from 'moment'
import * as firebase from 'firebase/app'
import 'firebase/database'

export const strict = false

export const state = () => ({
    userTeams: []
})

export const mutations = {
    setUserTeams(state, payload) {
        state.userTeams = payload
    }
}

export const actions = {
    fetchUserTeams({ commit, rootGetters }) {
		console.log('fetchUserTeams action called')
        return new Promise((resolve, reject) => {
			try {
                const userUid = rootGetters['users/loadedUser']['uid']
                console.log('userUid: ', userUid)
				const userId = rootGetters['users/loadedUser']['id']
                console.log('userId: ', userId)
                firebase
                    .database()
                    .ref(`userTeams/${userId}`)
                    .on('value', function(snapshot) {
						const teamsArray = []
						for (const key in snapshot.val()) {
							teamsArray.push({
								...snapshot.val()[key],
								id: key
							})
						}
                        commit('setUserTeams', teamsArray)
                        resolve()
                    })
            } catch (error) {
                reject(error)
            }
        })
    },
    async selectUserTeam({ commit, getters, rootGetters }, payload) {
        try {
            console.log('selectUserTeams: ', payload)
			const userId = rootGetters['users/loadedUser'].id
			
			if (getters['loadedUserTeams'].find(team => team.id === payload.id)) {
				throw 'team_already_picked'
			}

            // Update userTeams node
            await firebase
                .database()
                .ref(`userTeams/${userId}/${payload.slug}`)
                .update({
                    name: payload.name,
                    slug: payload.slug,
                    image: payload.image,
                    country: payload.country,
                    apifootball_id: payload.apifootball_id,
                    _created_at: moment().unix()
                })

            // Update teamUser node
            await firebase
                .database()
                .ref(`teamUsers/${payload.slug}`)
                .update({
                    [userId]: true
                })

            // Update team counter with a transaction
            await firebase
                .database()
                .ref(`teams/${payload.slug}`)
                .transaction(function(team) {
                    if (team) {
                        if (!team.usersCount) {
                            team.usersCount = 1
                        } else {
                            team.usersCount++
                        }
                    }
                    return team
                })
        } catch (error) {
            throw error
        }
    },
    async deselectUserTeam({ commit, rootGetters }, payload) {
        try {
            const { teamSlug, userSubscriptions } = payload
            const subscription = userSubscriptions.find(subscription => subscription.team_slug === teamSlug)
            console.log('teamSlug: ', teamSlug)
            console.log('userSubscriptions: ', userSubscriptions)
            console.log('subscription: ', subscription)
            // return
            const userId = rootGetters['users/loadedUser']['id']

            // Update userTeams node
            await firebase
                .database()
                .ref(`userTeams/${userId}/${teamSlug}`)
                .remove()

            // Update teamUser node
            await firebase
                .database()
                .ref(`teamUsers/${teamSlug}`)
                .remove()

            // Update subscriptions node
            if (subscription) {
                await firebase.database().ref(`subscriptions/${subscription.id}`).remove()
            }

            // Update team counter through transaction
            const teamRef = firebase.database().ref(`teams/${teamSlug}`)
            await teamRef.transaction(function(team) {
                if (team) {
                    if (!team.usersCount) {
                        team.usersCount = 0
                    } else {
                        team.usersCount--
                    }
                }
                return team
            })
        } catch (error) {
            throw error
        }
    }
}

export const getters = {
    loadedUserTeams(state) {
        return state.userTeams
    }
}
