import * as firebase from 'firebase/app'
import 'firebase/database'
import Noty from 'noty'
import axios from 'axios'
import moment from 'moment'

export const state = () => ({
	// loadedSubscriptions: [],
	userSubscriptions: []
})

export const mutations = {
	setUserSubscriptions(state, payload) {
		// console.log('def')
		state.userSubscriptions = payload
	},
	// createSubscription(state, payload) {
	//     state.loadedSubscriptions.push(payload)
	// }
}

export const actions = {
	// Load all subscriptions
	loadedSubscriptions_TOBEDELETED({ commit }) {
		// console.log('loadedSubscriptions')
		// firebase.database().ref('/subscriptions/').once('value').then(function (snapshot) {
		firebase
			.database()
			.ref('/subscriptions/')
			.on('value', function (snapshot) {
				const subscriptionsArray = []
				for (const key in snapshot.val()) {
					subscriptionsArray.push({ ...snapshot.val()[key], id: key })
				}
				commit('setsubscriptions', subscriptionsArray)

				// snapshot.forEach(function(childSnapshot) {
				//     let childData = childSnapshot.val()
				// })
				// commit('setsubscriptions', childData)
			})
	},
	loadedUserSubscriptions2_TOBEDELETED({ commit }, endpoint) {
		firebase
			.database()
			.ref('/subscriptions/')
			.orderByChild('endpoint')
			.equalTo(endpoint)
			.once('value')
			.then(function (snapshot) {
				// console.log(snapshot.val())
				const subscriptionsArray = []
				for (const key in snapshot.val()) {
					subscriptionsArray.push({ ...snapshot.val()[key], id: key })
				}
				// console.log(postsArray)
				commit('setUserSubscriptions', subscriptionsArray)
			})
	},
	fetchUserSubscriptions({ commit, rootGetters }, payload) {
		return new Promise((resolve, reject) => {
			try {
				console.log('fetchUserSubscriptions: ', payload)
				// const userId = firebase.auth().currentUser.uid
				// const userId = rootGetters['users/loadedUser'].uid
				// console.log('userId: ', userId)
				firebase
					.database()
					.ref('/subscriptions/')
					.orderByChild('endpoint')
					.equalTo(payload)
					.on('value', function (snapshot) {
						const subscriptionsArray = []

						for (const key in snapshot.val()) {
							subscriptionsArray.push({ ...snapshot.val()[key], id: key })
						}
						console.log('subscriptionsArray: ', subscriptionsArray)
						commit('setUserSubscriptions', subscriptionsArray)
						resolve()
					})
			} catch (error) {
				console.log('error: ', error)
				reject(error)
			}
		})
	},
	async fetchUserSubscriptions2_TOBEDELETED({ commit }, endpoint) {
		try {
			const snapshot = await firebase
				.database()
				.ref('/subscriptions/')
				.orderByChild('endpoint')
				.equalTo(endpoint)
				.once('value')

			const subscriptionsArray = []

			for (const key in snapshot.val()) {
				subscriptionsArray.push({ ...snapshot.val()[key], id: key })
			}
			console.log('subscriptionsArray: ', subscriptionsArray)
			commit('setUserSubscriptions', subscriptionsArray)
			return subscriptionsArray
		} catch (error) {
			console.log('error: ', errror)
			throw new Error(error)
		}
	},
	async createUserSubscriptions({ commit, rootGetters, dispatch }, { userTeams, pushSubscription, deviceIdentifier }) {
		try {
			console.log('createUserSubscriptions action: ', userTeams, JSON.parse(pushSubscription))
			const newSubscription = JSON.parse(pushSubscription)
			// console.log('newSubscription.keys: ', newSubscription.keys)
			const userId = rootGetters['users/loadedUser']['id']
			console.log('userId: ', userId)

			let updates = {}

			userTeams.forEach((team) => {
				const newSubscriptionObject = {
					endpoint: newSubscription.endpoint,
					keys: newSubscription.keys,
					user_id: userId,
					team: {
						name: team.name,
						slug: team.slug
					},
					notifications: {
						goals: true,
						game_starts: true,
						game_ends: true,
						game_starts_in_30_minutes: false
					},
					deviceIdentifier,
					created_at: moment().unix()
				}
				const newSubscriptionKey = firebase
					.database()
					.ref()
					.child('/subscriptions/')
					.push().key
				updates[`/subscriptions/${newSubscriptionKey}`] = newSubscriptionObject
			})
			console.log("updates: ", updates)
			await firebase
				.database()
				.ref()
				.update(updates)
			// dispatch('fetchUserSubscriptions', newSubscription.endpoint)
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
	},
	// Create a new subscription
	async createSubscription_TOBEDELETED({ commit, getters }, payload) {
		// commit('setLoading', true, { root: true })
		let updates = {}

		console.log(payload)
		const teams = payload.teams
		const newSub = payload.newSub
		const userId = firebase.auth().currentUser.uid

		for (let team of teams) {
			const dataObject = {
				endpoint: newSub.endpoint,
				keys: newSub.keys,
				user_id: userId,
				created_at: moment().unix(),
				team: {
					name: team.name,
					slug: team.slug
				}
			}
			console.log('dataObject: ', dataObject)

			const newSubscriptionKey = firebase
				.database()
				.ref()
				.child('/subscriptions/')
				.push().key
			updates['/subscriptions/' + newSubscriptionKey] = dataObject
		}
		console.log('updates: ', updates)

		return
	},
	async updateUserSubscription({ commit }, payload) {
		console.log('updateUserSubscription: ', payload)
		try {
			let updates = {}
			updates[`/subscriptions/${payload.subscriptionId}/notifications`] = payload.subscriptionNotifications
			const abc = await firebase.database().ref().update(updates)
			console.log('abc: ', abc)
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
	},
	// Update a subscription
	updateSubscription_TOBEDELETED({ commit, dispatch }, payload) {
		commit('setLoading', true, { root: true })
		console.log(payload)
		// return

		let updates = {}
		updates['/subscriptions/'] = payload

		firebase
			.database()
			.ref()
			.update(updates)
			.then(() => {
				dispatch('loadedSubscriptions')
				commit('setLoading', false, { root: true })
				new Noty({ type: 'success', text: 'Subscription modifiée avec succès!', timeout: 5000, theme: 'metroui' }).show()
			})
			.catch(error => {
				console.log(error)
				commit('setLoading', false, { root: true })
				commit('setError', error, { root: true })
				new Noty({ type: 'error', text: 'Subscription non modifiée. Erreur: ' + error, timeout: 5000, theme: 'metroui' }).show()
			})
	},
	async deleteUserSubscriptions({ commit, rootGetters }, payload) {
		try {
			// const userId = rootGetters['users/loadedUser']['id']
			console.log('payload: ', payload)
			const userId = firebase.auth().currentUser
			console.log('userId: ', userId)
			let updates = {}

			const subscriptions = await firebase.database().ref('/subscriptions').orderByChild('user_id').equalTo(userId).once('value')

			subscriptions.forEach(subscription => {
				updates[`/subscriptions/${subscription.key}`] = null
			})
			await firebase.database().ref().update(updates)
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
	},
	// Delete a subscription
	async deleteSubscription_TOBEDELETED({ commit, dispatch, rootState }, endpoint) {
		try {
			console.log('endpoint: ', endpoint)
			commit('setLoading', true, { root: true })
			let updates = {}

			const snapshot = await firebase
				.database()
				.ref('/subscriptions')
				.orderByChild('endpoint')
				.equalTo(endpoint)
				.once('value')

			console.log('snapshot: ', snapshot)
			console.log('snapshot.val(): ', snapshot.val())
			const deletedSubscriptions = []
			snapshot.forEach(childSnapshot => {
				console.log('childSnapshot.key: ', childSnapshot.key)
				console.log('childSnapshot2: ', childSnapshot.val())
				console.log('childSnapshot3: ', childSnapshot.val().team)
				deletedSubscriptions.push(childSnapshot.val().team)
				updates['/subscriptions/' + childSnapshot.key] = null
			})

			console.log('updates: ', updates)
			console.log('deletedSubscriptions: ', deletedSubscriptions)

			const snapshot2 = await firebase
				.database()
				.ref()
				.update(updates)
			// console.log('snapshot2: ', snapshot2)
			return deletedSubscriptions
			return snapshot2
		} catch (error) {
			console.log('error: ', error)
			throw new Error(error)
		}
	}
}

export const getters = {
	// loadedSubscriptions(state) {
	//     return state.loadedSubscriptions
	// },
	loadedUserSubscriptions(state) {
		return state.userSubscriptions
	}
}
