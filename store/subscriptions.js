import * as firebase from 'firebase/app'
import 'firebase/database'
import Noty from 'noty'
import axios from 'axios'
import moment from 'moment'

export const state = () => ({
	userSubscriptions: []
	// userSubscriptions: {}
})

export const mutations = {
	setUserSubscriptions(state, payload) {
		state.userSubscriptions = payload
		// state.userSubscriptions = Object.assign({}, state.userSubscriptions, {
		// 	[payload.team]: payload.subscription
		// })
	}
}

export const actions = {
	fetchUserSubscriptions({ commit, rootGetters }, payload) {
		return new Promise((resolve, reject) => {
			try {
				console.log('fetchUserSubscriptions: ', payload)
				// const userId = firebase.auth().currentUser.uid
				const userUid = rootGetters['users/loadedUser']['uid']
				console.log('userUid: ', userUid)
				const userId = rootGetters['users/loadedUser']['id']
				console.log('userId: ', userId)
				firebase
					.database()
					.ref('/subscriptions/')
					.orderByChild('endpoint')
					.equalTo(payload)
					.on('value', function (snapshot) {
						// snapshot.forEach(subscription => {
						// 	commit('setUserSubscriptions', { team: subscription.val().team_slug, subscription: { ...subscription.val(), id: subscription.key }})
						// })

						const subscriptionsArray = []
						snapshot.forEach(subscription => {
							subscriptionsArray.push({ ...subscription.val(), id: subscription.key })
						})
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
	async TOBEDELETED_createUserSubscriptions({ commit, rootGetters, dispatch }, { userTeams, pushSubscription, deviceIdentifier }) {
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
	async createUserSubscriptions({ commit, rootGetters, dispatch }, payload) {
		try {
			// console.log('createUserSubscription: ', payload)
			const { pushSubscription, notificationType, team, deviceIdentifier } = payload
			const newSubscription = JSON.parse(payload.pushSubscription)
			// console.log('newSubscription: ', newSubscription)

			let updates = {}
			const userId = rootGetters['users/loadedUser']['id']
			// console.log('userId: ', userId)
			const newSubscriptionKey = firebase
				.database()
				.ref()
				.child('/subscriptions/')
				.push().key

			const key = `team_${notificationType}`
			
			const newSubscriptionObject = {
				endpoint: newSubscription.endpoint,
				keys: newSubscription.keys,
				user_id: userId,
				team_slug: team.slug,
				team_name: team.name,
				team_apifootball_id: team.apifootball_id,
				notifications: {
					[notificationType]: true
				},
				[key]: `${team.apifootball_id}_${notificationType}`,
				deviceIdentifier: deviceIdentifier,
				created_at: moment().unix()
			}
			// console.log('newSubscriptionObject: ', newSubscriptionObject)
			updates[`/subscriptions/${newSubscriptionKey}`] = newSubscriptionObject				
			await firebase.database().ref().update(updates)
			dispatch('fetchUserSubscriptions', newSubscription.endpoint)
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
	},
	async updateUserSubscriptions({ commit, rootGetters, dispatch }, payload) {
		try {
			// console.log('updateUserSubscription: ', payload)
			const { subscription, notificationType, team, value } = payload
			const key = `team_${notificationType}`
			let updates = {}
			let newValue
			if (value) {
				newValue = `${payload.team.apifootball_id}_${payload.notificationType}`
			} else {
				newValue = null
			}
			updates[`/subscriptions/${subscription.id}/notifications/${notificationType}`] = value
			updates[`/subscriptions/${subscription.id}/${key}`] = newValue
			await firebase.database().ref().update(updates)
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
	},
	async deleteUserSubscriptions({ commit, rootGetters }, payload) {
		try {
			// console.log('payload: ', payload)
			const { deviceIdentifier } = payload
			// console.log('deviceIdentifier: ', deviceIdentifier)
			const userUid = rootGetters['users/loadedUser']['uid']
			const userId = rootGetters['users/loadedUser']['id']
			const authUser = firebase.auth().currentUser
			console.log('userUid: ', userUid)
			console.log('userId: ', userId)
			console.log('authUser: ', authUser)
			let updates = {}

			const subscriptions = await firebase.database().ref('/subscriptions').orderByChild('user_id').equalTo(userId).once('value')

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
	}
}

export const getters = {
	loadedUserSubscriptions(state) {
		return state.userSubscriptions
	}
}
