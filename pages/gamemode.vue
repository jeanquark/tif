<template>
    <v-container fluid fill-height style="padding: 0px; max-width: 1017px;">
        <div id="overlay" @click="removeOverlay"></div>
        <v-row no-gutters justify="center" align="center">
            <v-col cols="12" style="background: #EEEEEE;">

                <gamemode-header />

                loadedUserSubscriptions: {{ loadedUserSubscriptions }}<br /><br />
				showSubscribeToPushNotifications: {{ showSubscribeToPushNotifications }}<br /><br />
                <!-- loadedUser: {{ loadedUser }}<br /><br /> -->
                subscribeToPushNotifications: {{ subscribeToPushNotifications }}<br /><br />

                <v-row no-gutters justify="center" align="center" class="my-4">
                    <v-col sm="4" class="text-center">
                        <v-text-field name="username" label="Username" type="text" v-model="loadedUser.username"></v-text-field>
                    </v-col>
                    <v-col sm="4">
                        <v-btn small color="success" @click.stop="updateUsername">Update username</v-btn>
                    </v-col>
                    <v-col sm="12 mb-2" class="text-center">
                        <h2>My Teams</h2>
                    </v-col>
                    <v-col sm="6" md="4" lg="3" class="text-center ma-3" v-for="team in loadedUserTeams" :key="team.slug">
                        <v-card class="ma-3 pt-2">
                            <v-img :src="`/images/teams/${team.image}`" :lazy-src="`/images/teams/${team.image}`" :aspect-ratio="1" class="ma-4 pa-2"></v-img>
                            <v-card-actions>
                                <!-- <v-layout row wrap justify-center align-center> -->
                                <v-row justify="center" align="center">
                                    <!-- <v-flex xs12 class="text-xs-center"> -->
                                    <v-col cols="12" class="text-center">
                                        {{ team.name }}
                                        <!-- </v-flex> -->
                                    </v-col>
                                    <!-- </v-layout> -->
                                </v-row>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row no-gutters justify="center">
                    <v-btn color="success" class="elevation-0" @click="addToHomescreen" v-if="showAddToHomeScreenButton">Install app to homescreen</v-btn>
                </v-row>

                <v-row no-gutters v-if="deniedPushNotifications">
                    You have blocked notifications on this device.
                </v-row>

                <v-row no-gutters justify="center" align="center" class="my-2" v-if="showSubscribeToPushNotifications">
                    <!-- <v-flex xs12>
                        <h3 class="text-xs-center">For a full TIF experience, enable notifications!</h3>
                        <v-checkbox v-model="subscribeToPushNotificationsCheckbox" label="Get notified when your team scores" color="primary" @change="changePushNotificationsStatus()"></v-checkbox>
                        You can then select which event you would like to receive a notification for. You can also disable them anytime by the simple click of a button. Easy as that!
                        <b>Note:</b> Notifications are activated per device. To receive notifications on multiple devices, sign-in on each device, enable notifications, and make sure you're online. However, turning off notifications on one device will turn them off on all devices.
                    </v-flex> -->
                    <v-col cols="12">
                        <v-switch color="primary" label="Enable notifications" class="justify-center" @change="toggleSubscribeToPushNotifications()" v-model="subscribeToPushNotifications"></v-switch>
                    </v-col>
                </v-row>

                <v-row no-gutters justify="center" align="center" class="my-2" style="background-color: #ccc;" v-if="showSubscribeToPushNotifications">
                    <v-col cols="12" class="my-2">
                        <h3 class="text-center">Notifications status on this device</h3>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-for="(team, index) in loadedUserTeams" :key="team.id">
                        <v-card class="ma-2 pa-3">
                            <v-card-title primary-title class="text-xs-center">
                                <v-col cols="6">
                                    <v-img :src="`/images/teams/${team.slug}.png`"></v-img>
                                </v-col>
                                <v-col cols="6">
                                    <h4>{{ team.name }}</h4>
                                </v-col>
                            </v-card-title>
                            <v-card-text>
                                <v-row no-gutters justify="start" align="center">
                                    <v-col cols="6">
                                        <v-switch color="primary" label="Goals" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'goals', team, loadedUserSubscriptions[team.slug]['notifications']['goals'])" v-model="loadedUserSubscriptions[team.slug]['notifications']['goals']" v-if="loadedUserSubscriptions[team.slug] && loadedUserSubscriptions[team.slug]['notifications']['goals']"></v-switch>
                                        <v-switch color="primary" label="Goals" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'goals', team)" v-else></v-switch>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-switch color="primary" label="Game starts in 30 minutes" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'game_starts_in_30_minutes', team, loadedUserSubscriptions[team.slug]['notifications']['game_starts_in_30_minutes'])" v-model="loadedUserSubscriptions[team.slug]['notifications']['game_starts_in_30_minutes']" v-if="loadedUserSubscriptions[team.slug] && loadedUserSubscriptions[team.slug]['notifications']['game_starts_in_30_minutes']"></v-switch>
                                        <v-switch color="primary" label="Game starts in 30 minutes" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'game_starts_in_30_minutes', team)" v-else></v-switch>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-switch color="primary" label="Game starts" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'game_starts', team, loadedUserSubscriptions[team.slug]['notifications']['game_starts'])" v-model="loadedUserSubscriptions[team.slug]['notifications']['game_starts']" v-if="loadedUserSubscriptions[team.slug] && loadedUserSubscriptions[team.slug]['notifications']['game_starts']"></v-switch>
                                        <v-switch color="primary" label="Game starts" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'game_starts', team)" v-else></v-switch>
                                    </v-col>
                                    <v-col cols="6">
                                        <v-switch color="primary" label="Game ends" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'game_ends', team, loadedUserSubscriptions[team.slug]['notifications']['game_ends'])" v-model="loadedUserSubscriptions[team.slug]['notifications']['game_ends']" v-if="loadedUserSubscriptions[team.slug] && loadedUserSubscriptions[team.slug]['notifications']['game_ends']"></v-switch>
                                        <v-switch color="primary" label="Game ends" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'game_ends', team)" v-else></v-switch>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
	import GamemodeHeader from '~/components/GamemodeHeader'
	import Noty from 'noty'
	import axios from 'axios'
	import slugify from '~/helpers/slugify.js'

	// PWA Install to Homescreen
	let deferredPrompt

	export default {
		components: { GamemodeHeader },
		layout: 'layoutGamemode',
		async created() {
			if (!this.loadedUserTeams || this.loadedUserTeams.length < 1) {
				await this.$store.dispatch('userTeams/fetchUserTeams')
			}
		},
		async mounted() {
			window.addEventListener('beforeinstallprompt', e => {
				console.log('beforeinstallprompt called!!!!')
				deferredPrompt = e
				this.showAddToHomeScreenButton = true
			})

			// Configure Web Push Notifications
			if (!('serviceWorker' in navigator)) {
				// Service Worker isn't supported on this browser, disable or hide UI.
				alert('Service Worker is not supported on this browser')
				return
			}

			if (!('PushManager' in window)) {
				// Push isn't supported on this browser, disable or hide UI.
				alert('Push is not supported on this browser')
				return
			}
			if (Notification.permission !== 'denied') {
				this.showSubscribeToPushNotifications = true
			}
			if (Notification.permission === 'default') {
				// this.showSubscribeToPushNotificationsCheckbox = true
				// alert('Notifications default!')
			}
			if (Notification.permission === 'denied') {
				// this.showSubscribeToPushNotificationsCheckbox = true
				// alert('Notifications denied!')
			}
			console.log('screen.width: ', window.screen.width)
			console.log('screen.height: ', window.screen.height)
			console.log('navigator.navigator.userAgent: ', slugify(window.navigator.userAgent))

			const abc = this.$store.getters['users/loadedUser']
			console.log('abc.uid: ', abc.uid)
			await this.checkUserSubscriptions(false)
		},
		data() {
			return {
				showAddToHomeScreenButton: false,
				// userIsSubscribedToPushNotifications: false,
				// subscribeToPushNotificationsCheckbox: false,
				subscribeToPushNotifications: false,
				deniedPushNotifications: false,
				showSubscribeToPushNotifications: false,
				checkSubscriptionButtonLoading: false
			}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			},
			loadedUserTeams() {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedUserSubscriptions() {
				return this.$store.getters['subscriptions/loadedUserSubscriptions']
			}
		},
		methods: {
			addToHomescreen() {
				deferredPrompt.prompt()
				// Wait for the user to respond to the prompt
				deferredPrompt.userChoice.then(choiceResult => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the A2HS prompt')
						this.showButton = false
					} else {
						console.log('User dismissed the A2HS prompt')
						this.showButton = false
					}
					deferredPrompt = null
				})
			},
			async checkUserSubscriptions(displayMessage = true) {
				try {
					console.log('Call to checkSubscription method')
					// console.log('loadedUser: ', this.loadedUser.uid)
					// 1) Check if navigator supports Service Worker and Push notifications
					if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
						// Service Worker isn't supported on this browser, disable or hide UI.
						// Push isn't supported on this browser, disable or hide UI.
						new Noty({
							type: 'warning',
							text: 'Your current navigator does not support push notifications',
							timeout: 5000,
							theme: 'metroui'
						}).show()
						return
					}

					// 2) Check if user has accepted push notifications from the browser
					const permission = Notification.permission
					console.log('permission: ', permission)
					if (permission === 'granted') {
						const serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js')
						console.log('serviceWorkerRegistration: ', serviceWorkerRegistration)
						const pushSubscription = await serviceWorkerRegistration.pushManager.getSubscription()
						console.log('pushSubscription: ', pushSubscription)
						if (pushSubscription && pushSubscription.endpoint) {
							this.$store.dispatch('subscriptions/fetchUserSubscriptions', pushSubscription.endpoint)
							this.userIsSubscribedToPushNotifications = true
							console.log('pushSubscription.endpoint: ', pushSubscription.endpoint)
						} else {
							this.showSubscribeToPushNotifications = true
							console.log('No subscriptions')
							const deviceIdentifier = `screenWidth=${window.screen.width}&screenHeight=${window.screen.height}&userAgent=${slugify(window.navigator.userAgent)}`
							console.log('deviceIdentifier: ', deviceIdentifier)

							await this.$store.dispatch('subscriptions/deleteUserSubscriptions', { deviceIdentifier })
						}
					} else if (permission === 'denied') {
						this.deniedPushNotifications = true
					} else {
						// default
						this.showSubscribeToPushNotifications = true
					}
				} catch (error) {
					console.log('error: ', error)
					// this.$sentry.captureException(new Error('CheckUserSubscriptions error'))
				}
			},
			async updateUsername() {
				try {
					await this.$store.dispatch('users/updateUser', this.loadedUser)
					new Noty({
						type: 'success',
						text: 'Username updated successfully!',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					console.log('error: ', error)
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and your username could not be updated.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			removeOverlay() {
				document.getElementById('overlay').style.display = 'none'
			},
			askPermissionToPushNotifications() {
				return new Promise(function(resolve, reject) {
					const permissionResult = Notification.requestPermission(function(result) {
						resolve(result)
					})

					// console.log('permissionResult: ', permissionResult)
					if (permissionResult) {
						permissionResult.then(resolve, reject)
					}
				}).then(function(permissionResult) {
					return permissionResult
				})
			},
			urlBase64ToUint8Array(base64String) {
				try {
					const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
					const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
					const rawData = window.atob(base64)
					const outputArray = new Uint8Array(rawData.length)
					for (let i = 0; i < rawData.length; ++i) {
						outputArray[i] = rawData.charCodeAt(i)
					}
					return outputArray
				} catch (error) {
					throw error
				}
			},
			async TOBEDELETED_toggleSubscribeToPushNotifications() {
				try {
					// Steps details: https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user
					if (Notification.permission === 'denied') {
						alert('abc')
						return
					}
					document.getElementById('overlay').style.display = 'block'
					const permissionResult = await this.askPermissionToPushNotifications()
					console.log('permissionResult: ', permissionResult)
					document.getElementById('overlay').style.display = 'none'
					if (permissionResult !== 'granted') {
						this.subscribeToPushNotifications = false
					} else {
						// 1) Register Service Worker
						const registration = await navigator.serviceWorker.register('/sw.js')

						// 2) Subscribe a user with PushManager
						const subscribeOptions = {
							userVisibleOnly: true,
							applicationServerKey: this.urlBase64ToUint8Array('BImRhHlpuwUWML_D09_SN1WfBU8XwCpDW8DH20Blrc_xeIl0LLC5rqxhT-P-l-h8RKSnBTiKAJ-4YdDgLh96QxU')
						}

						const pushSubscription = await registration.pushManager.subscribe(subscribeOptions)
						console.log('Received PushSubscription: ', JSON.stringify(pushSubscription))

						// 3) Add subscriptions to database
						const subscriptions2 = await this.$store.dispatch('subscriptions/createUserSubscriptions', {
							pushSubscription: JSON.stringify(pushSubscription),
							userTeams: this.loadedUserTeams,
							deviceIdentifier: {
								screenWidth: window.screen.width,
								screenHeight: window.screen.height,
								userAgent: slugify(window.navigator.userAgent)
							}
						})
						console.log('subscriptions2: ', subscriptions2)
						// subscriptions.forEach(subscription => {
						// 	new Noty({
						// 		type: 'success',
						// 		text: `Subscribed to ${subscription.team.name}`,
						// 		timeout: 5000,
						// 		theme: 'metroui'
						// 	}).show()
						// })

						// TODO: replace dispatch by commit on the store
						// this.$store.dispatch('subscriptions/fetchUserSubscriptions', pushSubscription.endpoint)
					}
				} catch (error) {
					throw error
				}
			},
			async toggleSubscription(subscription, notificationType, team, value = true) {
				try {
					console.log('toggleSubscription: ', subscription, notificationType, team)
					if (Notification.permission === 'default') {
						// this.showSubscribeToPushNotificationsCheckbox = true
						// alert('Notifications denied!')
						document.getElementById('overlay').style.display = 'block'
						const permissionResult = await this.askPermissionToPushNotifications()
						console.log('permissionResult: ', permissionResult)
						document.getElementById('overlay').style.display = 'none'
						return
					}
					// console.log('abc')
					if (!subscription) {
						// Create new subscription
						// 1) Register Service Worker
						const registration = await navigator.serviceWorker.register('/sw.js')

						// 2) Subscribe a user with PushManager
						const subscribeOptions = {
							userVisibleOnly: true,
							applicationServerKey: this.urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY)
						}

						const pushSubscription = await registration.pushManager.subscribe(subscribeOptions)
						console.log('pushSubscription: ', JSON.stringify(pushSubscription))

						// 3) Add subscriptions to database
						const subscriptions = await this.$store.dispatch('subscriptions/updateUserSubscriptions', {
							pushSubscription: JSON.stringify(pushSubscription),
							// notificationsType: 'goals',
							notificationType,
							team,
							deviceIdentifier: `screenWidth=${window.screen.width}&screenHeight=${window.screen.height}&userAgent=${slugify(window.navigator.userAgent)}`,
								// screenWidth: window.screen.width,
								// screenHeight: window.screen.height,
								// userAgent: slugify(window.navigator.userAgent)
							// },
							createNewSubscription: true
						})
						console.log('subscriptions: ', subscriptions)
					} else {
						await this.$store.dispatch('subscriptions/updateUserSubscriptions', { subscription, notificationType, team, value })
					}
					new Noty({
						type: 'success',
						text: 'Successfully updated subscription!',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and your subscription could not be updated.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			}
		}
	}
</script>

<style scoped>
	.hover {
		border: 2px solid var(--v-primary-base);
		cursor: pointer;
	}
	#overlay {
		position: fixed; /* Sit on top of the page content */
		display: none; /* Hidden by default */
		width: 100%; /* Full width (cover the whole page) */
		height: 100%; /* Full height (cover the whole page) */
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5); /* Black background with opacity */
		z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
		cursor: pointer; /* Add a pointer on hover */
	}
</style>
