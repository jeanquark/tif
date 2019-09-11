import * as firebase from 'firebase/app'
import 'firebase/database'
import Noty from 'noty'
import axios from 'axios'
import moment from 'moment'

export const state = () => ({
	// loadedSubscriptions: [],
	// userSubscriptions: []
	userSubscriptions: {}
})

export const mutations = {
	setUserSubscriptions(state, payload) {
		// state.userSubscriptions = payload
		state.userSubscriptions = Object.assign({}, state.userSubscriptions, {
			[payload.team]: payload.subscription
		})
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
				const userId = rootGetters['users/loadedUser']['uid']
				console.log('userId: ', userId)
				const userId2 = rootGetters['users/loadedUser']['id']
				console.log('userId2: ', userId2)
				firebase
					.database()
					.ref('/subscriptions/')
					.orderByChild('endpoint')
					.equalTo(payload)
					.on('value', function (snapshot) {
						snapshot.forEach(subscription => {
							commit('setUserSubscriptions', { team: subscription.val().team_slug, subscription: { ...subscription.val(), id: subscription.key }})
						})
						// const subscriptionsArray = []

						// for (const key in snapshot.val()) {
						// 	subscriptionsArray.push({ ...snapshot.val()[key], id: key })
						// }
						// console.log('subscriptionsArray: ', subscriptionsArray)
						// commit('setUserSubscriptions', subscriptionsArray)
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
					team_slug: team.slug,
					team_name: team.name,
					// team: {
					// 	name: team.name,
					// 	slug: team.slug
					// },
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
	
	async updateUserSubscriptions({ commit, rootGetters }, payload) {
		try {
			console.log('updateUserSubscription: ', payload)
			let updates = {}
			if (payload.createNewSubscription) { // Create new subscription
				const newSubscription = JSON.parse(payload.pushSubscription)
				const userId = rootGetters['users/loadedUser']['id']
				console.log('userId: ', userId)
				const newSubscriptionKey = firebase
					.database()
					.ref()
					.child('/subscriptions/')
					.push().key

				const key = `team_${payload.notificationType}`
				
				const newSubscriptionObject = {
					endpoint: newSubscription.endpoint,
					keys: newSubscription.keys,
					user_id: userId,
					team_slug: payload.team.slug,
					team_name: payload.team.name,
					team_apifootball_id: payload.team.apifootball_id,
					notifications: {
						[payload.notificationType]: true
					},
					[key]: `${payload.team.apifootball_id}_${payload.notificationType}`,
					deviceIdentifier: payload.deviceIdentifier,
					created_at: moment().unix()
				}
				console.log('newSubscriptionObject: ', newSubscriptionObject)
				updates[`/subscriptions/${newSubscriptionKey}`] = newSubscriptionObject				
			} else { // Update existing subscription
				console.log('payload2: ', payload)
				const key = `team_${payload.notificationType}`
				let value
				if (payload.value) {
					value = `${payload.team.apifootball_id}_${payload.notificationType}`
				} else {
					value = null
				}
				updates[`/subscriptions/${payload.subscription.id}/notifications/${payload.notificationType}`] = payload.value
				updates[`/subscriptions/${payload.subscription.id}/${key}`] = value
			}
			await firebase.database().ref().update(updates)
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
			// console.log('payload: ', payload)
			const { deviceIdentifier } = payload
			// console.log('deviceIdentifier: ', deviceIdentifier)
			const userUid = rootGetters['users/loadedUser']['uid']
			// const userId = rootGetters['users/loadedUser']['id']
			// const authUser = firebase.auth().currentUser
			console.log('userUid: ', userUid)
			// console.log('userId: ', userId)
			// console.log('authUser: ', authUser)
			let updates = {}

			const subscriptions = await firebase.database().ref('/subscriptions').orderByChild('user_id').equalTo(userUid).once('value')

			subscriptions.forEach(subscription => {
				// console.log('subscription.val().deviceIdentifier: ', subscription.val().deviceIdentifier)
				// console.log('deviceIdentifier: ', deviceIdentifier)
				if (subscription.val().deviceIdentifier === deviceIdentifier) {
					console.log('delete subscription!')
					updates[`/subscriptions/${subscription.key}`] = null	
				}
			})
			await firebase.database().ref().update(updates)
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
	},
	// Delete a subscription
	async TOBEDELETED_deleteSubscription({ commit, dispatch, rootState }, endpoint) {
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
