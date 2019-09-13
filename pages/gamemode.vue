<template>
    <v-container fluid fill-height style="padding: 0px; max-width: 1017px;">
        <div id="overlay" @click="removeOverlay"></div>
        <v-row no-gutters justify="center" align="center">
            <v-col cols="12" style="background: #EEEEEE;">

                <gamemode-header />

                loadedUserSubscriptions: {{ loadedUserSubscriptions }}<br /><br />
				showSubscribeToPushNotifications: {{ showSubscribeToPushNotifications }}<br /><br />
                <!-- loadedUser: {{ loadedUser }}<br /><br /> -->

                <v-progress-linear
        color="amber"
        height="25"
        value="50"
        reactive
      ></v-progress-linear>

                <v-row no-gutters justify="center" align="center" class="my-4">
                    <v-col cols="12" sm="4" class="text-center">
                        <v-text-field name="username" label="Username" type="text" v-model="loadedUser.username"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-btn small color="success" @click.stop="updateUsername">Update username</v-btn>
                    </v-col>
                    <v-col cols="12" class="mb-2 text-center">
                        <h2>My Teams</h2>
                    </v-col>
                    <v-col cols="4" sm="3" class="text-center" v-for="team in loadedUserTeams" :key="team.slug">
                        <v-card class="ma-3 pt-2">
                            <v-img :src="`/images/teams/${team.image}`" :lazy-src="`/images/teams/${team.image}`" :aspect-ratio="1" class="ma-4 pa-2"></v-img>
                            <v-card-actions>
                                <v-row justify="center" align="center">
                                    <v-col cols="12" class="text-center">
                                        {{ team.name }}
                                    </v-col>
                                </v-row>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row no-gutters justify="center">
                    <v-btn color="success" class="elevation-0" @click="addToHomescreen" v-if="showAddToHomeScreenButton">Install app to homescreen</v-btn>
                </v-row>

                <v-row no-gutters justify="center" align="center" class="my-2" v-if="!showSubscribeToPushNotifications">
                	<v-col cols="12" sm="6">
                		<v-alert
                			dark
                			text
                			color="warning"
                			icon="mdi-exclamation"
      						border="left"
      						prominent
      					>
      						You have disabled push notifications from this site on this device. To receive score notifications for your favorite teams, modify the notifications parameter in your navigator.
  						</v-alert>
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
                                        <v-switch color="primary" label="Goals exists" @change="toggleSubscription(team, 'goals')" v-model="loadedUserSubscriptions[team.slug]['notifications']['goals']" v-if="loadedUserSubscriptions[team.slug]"></v-switch>
                                        <v-switch color="primary" label="Goals new" @change="toggleSubscription(team, 'goals')" v-else></v-switch>

                                        <!-- <v-switch color="primary" label="Goals" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'goals', team, loadedUserSubscriptions[team.slug]['notifications']['goals'], false)" v-model="loadedUserSubscriptions[team.slug]['notifications']['goals']" v-if="loadedUserSubscriptions[team.slug] && loadedUserSubscriptions[team.slug]['notifications']['goals']"></v-switch>
                                        <v-switch color="primary" label="Goals" @change="toggleSubscription(loadedUserSubscriptions[team.slug], 'goals', team, true)" v-else></v-switch> -->
                                    </v-col>
                                    <v-col cols="6">
                                    	<v-switch color="primary" label="Game starts in 30 minutes exists" @change="toggleSubscription(team, 'goals')" v-model="loadedUserSubscriptions[team.slug]['notifications']['game_starts_in_30_minutes']" v-if="loadedUserSubscriptions[team.slug]"></v-switch>
                                        <v-switch color="primary" label="Game starts in 30 minutes new" @change="toggleSubscription(team, 'game_starts_in_30_minutes')" v-else></v-switch>
                                        
                                    </v-col>
                                    <v-col cols="6">
                                    	<v-switch color="primary" label="Game starts exists" @change="toggleSubscription(team, 'goals')" v-model="loadedUserSubscriptions[team.slug]['notifications']['game_starts']" v-if="loadedUserSubscriptions[team.slug]"></v-switch>
                                        <v-switch color="primary" label="Game starts new" @change="toggleSubscription(team, 'game_starts')" v-else></v-switch>
                                    </v-col>
                                    <v-col cols="6">
                                    	<v-switch color="primary" label="Game ends exists" @change="toggleSubscription(team, 'goals')" v-model="loadedUserSubscriptions[team.slug]['notifications']['game_ends']" v-if="loadedUserSubscriptions[team.slug]"></v-switch>
                                        <v-switch color="primary" label="Game ends new" @change="toggleSubscription(team, 'game_ends')" v-else></v-switch>
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
				showSubscribeToPushNotifications: false,
				checkSubscriptionButtonLoading: false,
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
					} else if (permission === 'default') {
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
			async toggleSubscription(team, notificationType) {
				try {
					console.log('toggleSubscription: ', team, notificationType)
					const subscription = this.loadedUserSubscriptions[team.slug]
					console.log('subscription: ', subscription)

					if (Notification.permission === 'default') {
						document.getElementById('overlay').style.display = 'block'
						const permissionResult = await this.askPermissionToPushNotifications()
						console.log('permissionResult: ', permissionResult)
						if (permissionResult === 'denied') {
							this.showSubscribeToPushNotifications = false
						}
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
							notificationType,
							team,
							deviceIdentifier: `screenWidth=${window.screen.width}&screenHeight=${window.screen.height}&userAgent=${slugify(window.navigator.userAgent)}`,
							createNewSubscription: true
						})
						// console.log('subscriptions: ', subscriptions)
					} else {
						const value = subscription['notifications'][notificationType]
						console.log('value: ', value)
						await this.$store.dispatch('subscriptions/updateUserSubscriptions', { 
							subscription, 
							notificationType, 
							team,
							value
						})
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
