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
				const userId = rootGetters['users/loadedUser'].id
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
            console.log('deselectUserTeam: ', payload)
            const userId = rootGetters['users/loadedUser'].id

            // Update userTeams node
            await firebase
                .database()
                .ref(`userTeams/${userId}/${payload.slug}`)
                .remove()

            // Update teamUser node
            await firebase
                .database()
                .ref(`teamUsers/${payload.slug}`)
                .remove()

            // Update team counter through transaction
            const teamRef = firebase.database().ref(`teams/${payload.slug}`)
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
