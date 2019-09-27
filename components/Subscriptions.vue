<template>
	<div>
		<v-row no-gutters justify="center" align="center" class="my-0" v-if="!showSubscribeToPushNotifications">
            <v-col cols="12" sm="6">
                <v-alert dark text color="warning" icon="mdi-exclamation" border="left" prominent>
                    You have disabled push notifications from this site on this device. To receive score notifications for your favorite teams, modify the notifications parameter in your navigator.
                </v-alert>
            </v-col>
        </v-row>

        <v-row no-gutters justify="center" align="center" class="my-0" style="background-color: #ccc;" v-if="showSubscribeToPushNotifications && loadedUserTeams.length > 0">
            <v-col cols="12" class="my-2">
                <h3 class="text-center">Notifications status on this device</h3>
            </v-col>
            <v-col cols="6" sm="4" md="3" v-for="team in loadedUserTeams" :key="team.id">
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
								<v-switch color="primary" label="Goals" @change="toggleSubscription(team, 'goals')" v-model="loadedUserSubscriptionsObject[team.slug]['notifications']['goals']"></v-switch>
                            </v-col>
                            <v-col cols="6">
								<v-switch color="primary" label="Game starts in 30 minutes" @change="toggleSubscription(team, 'game_starts_in_30_minutes')" :disabled="true" v-model="loadedUserSubscriptionsObject[team.slug]['notifications']['game_starts_in_30_minutes']"></v-switch>
                            </v-col>
                            <v-col cols="6">
								<v-switch color="primary" label="Game starts" @change="toggleSubscription(team, 'game_starts')" v-model="loadedUserSubscriptionsObject[team.slug]['notifications']['game_starts']"></v-switch>
                            </v-col>
                            <v-col cols="6">
								<v-switch color="primary" label="Game ends" @change="toggleSubscription(team, 'game_ends')" v-model="loadedUserSubscriptionsObject[team.slug]['notifications']['game_ends']"></v-switch>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
	import Noty from 'noty'
	import slugify from '~/helpers/slugify.js'
	export default {
		created () {

		},
		async mounted () {
			if (!('serviceWorker' in navigator)) {
				// Service Worker isn't supported on this browser, disable or hide UI.
				return
			}

			if (!('PushManager' in window)) {
				// Push isn't supported on this browser, disable or hide UI.
				return
			}
			if (Notification.permission !== 'denied') {
				this.showSubscribeToPushNotifications = true
			}
			await this.checkUserSubscriptions()
		},
		data () {
			return {
				showSubscribeToPushNotifications: false,
			}
		},
		computed: {
			loadedUserTeams() {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedUserSubscriptions() {
				return this.$store.getters['subscriptions/loadedUserSubscriptions']
			},
			loadedUserSubscriptionsObject () {
				return this.loadedUserTeams.reduce((obj, item) => {
					const abc = this.loadedUserSubscriptions.find(subscription => subscription.team_slug == item.slug)
					obj[item.id] = { notifications: abc ? abc.notifications : {} }
					return obj
				}, {})
			}
		},
		methods: {
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
			async checkUserSubscriptions() {
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
			async toggleSubscription(team, notificationType) {
				try {
					console.log('toggleSubscription: ', team, notificationType)
					const subscription = this.loadedUserSubscriptions.find(subscription => subscription.team_slug === team.slug)
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
						const subscriptions = await this.$store.dispatch('subscriptions/createUserSubscriptions', {
							pushSubscription: JSON.stringify(pushSubscription),
							notificationType,
							team,
							deviceIdentifier: `screenWidth=${window.screen.width}&screenHeight=${window.screen.height}&userAgent=${slugify(window.navigator.userAgent)}`,
						})
					} else { // Update existing subscription
						const value = this.loadedUserSubscriptionsObject[team.slug]['notifications'][notificationType]
						// console.log('value: ', value)
						await this.$store.dispatch('subscriptions/updateUserSubscriptions', {
							subscription,
							notificationType,
							team,
							value
						})
					}
					new Noty({
						type: 'success',
						text: `Successfully ${subscription ? 'updated' : 'created new'} subscription!`,
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					console.log('error: ', error)
					new Noty({
						type: 'error',
						text: `Sorry, an error occured and we could not proceed your request.`,
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