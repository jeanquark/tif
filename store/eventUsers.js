import * as firebase from 'firebase/app'
import 'firebase/database'

export const state = () => ({
	loadedEventUsers: []
})

export const mutations = {
	setEventUsers(state, payload) {
		state.loadedEventUsers = payload
	},
	addEventUser(state, payload) {
		state.loadedEventUsers.push(...payload)
	}
}

export const actions = {
    fetchEventUsers({ commit }, payload) {
        return new Promise((resolve, reject) => {
			try {
				console.log('fetchEventUsers: ', payload)
				firebase
					.database()
					.ref(`/events/${payload}`)
					.child('users')
					.on('value', function(snapshot) {
						const eventUsersArray = []
						for (const key in snapshot.val()) {
							eventUsersArray.push({ ...snapshot.val()[key] })
						}
						console.log('eventUsersArray: ', eventUsersArray)
						commit('setEventUsers', eventUsersArray)
						resolve()
					})
			
			} catch (error) {
				reject(error)
			}
        })
	},
	addEventUser({ commit, rootGetters }, payload) {
		try {
			const user = rootGetters['users/loadedUser']
			console.log('user: ', user)
			firebase
				.database()
				.ref(`/events/${payload}/users`)
				.child(user.id)
				.set({
					id: user.id,
					username: user.username || null,
					picture: user.picture || null,
					level: user.level ? user.level.value : ''
				})
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
		
	}
}

export const getters = {
    loadedEventUsers(state) {
        return state.loadedEventUsers
    }
}
