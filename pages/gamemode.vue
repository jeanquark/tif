<template>
    <v-container style="padding: 0px; max-width: 1017px;">
        <div id="overlay" @click="removeOverlay"></div>
        <v-row no-gutters justify="center" align="center">
            <v-col cols="12" style="background: #EEEEEE;">

                <gamemode-header />

                <div>
					<!-- loadedUserSubscriptions: {{ loadedUserSubscriptions }}<br /><br /> -->
					<!-- loadedUserSubscriptionsObject: {{ loadedUserSubscriptionsObject }}<br /><br /> -->
                	<!-- showSubscribeToPushNotifications: {{ showSubscribeToPushNotifications }}<br /><br /> -->
                	<!-- loadedUser: {{ loadedUser }}<br /><br /> -->
                	<!-- loadedActiveTab: {{ loadedActiveTab }}<br /><br /> -->
                	<!-- eventsByDate: {{ eventsByDate }}<br /><br /> -->
                	<!-- eventsByRound: {{ eventsByRound }}<br /><br /> -->
                	nodeEnv: {{ nodeEnv }}<br /><br />
                	abcKey: {{ abcKey }}<br /><br />
                	vapidPublicKey: {{ vapidPublicKey }}<br /><br />
                	<!-- apiFootballKey: {{ apiFootballKey }}<br /><br /> -->
				</div>

				<div class="my-5" style="min-height: 200px;">
					<h2 class="text-center">Page principale gamemode</h2><br />
					<h4 class="text-center">Ici se trouve la partie "gamemode solo" avec les actions quotidiennes du joueur destinées à faire progresser son fan (travail, loisirs, ...)</h4>
				</div>
				
				<v-row no-gutters class="mt-5">
					<v-col cols="12" class="my-2">
                        <h3 class="text-center" v-if="eventsByDate">Events by day</h3>
                        <h3 class="text-center" v-if="eventsByRound">Events by round</h3>
                    </v-col>
                	<events-by-date @switchToRound="onSwitchToRound" v-if="eventsByDate"/>
                	<events-by-round @switchToDate="onSwitchToDate" v-if="eventsByRound"/>
                </v-row>

                <v-row no-gutters justify="center" class="my-5" v-if="showAddToHomeScreenButton">
                	<br /><br /><br />
                    <v-btn color="success" class="elevation-0" @click="addToHomescreen()">Install app to homescreen</v-btn>
                </v-row>

                <!--<v-row no-gutters justify="center" align="center" class="my-2" v-if="!showSubscribeToPushNotifications">
                    <v-col cols="12" sm="6">
                        <v-alert dark text color="warning" icon="mdi-exclamation" border="left" prominent>
                            You have disabled push notifications from this site on this device. To receive score notifications for your favorite teams, modify the notifications parameter in your navigator.
                        </v-alert>
                    </v-col>
                </v-row>

                <v-row no-gutters justify="center" align="center" class="my-2" style="background-color: #ccc;" v-if="showSubscribeToPushNotifications">
                    <v-col cols="12" class="my-2">
                        <h3 class="text-center">Notifications status on this device</h3>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" v-for="team in loadedUserTeams" :key="team.id">
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
                </v-row>-->
            </v-col>
        </v-row>
		
		<v-bottom-sheet v-model="showSubscriptions" v-if="loadedUserTeams && loadedUserTeams.length > 0">
	      	<template v-slot:activator="{ on }">
		      	<v-row justify="center">
			        <v-btn
			          color="primary"
			          dark
			          v-on="on"
			        >
			          My notifications
			        </v-btn>
		    	</v-row>
	      	</template>
	      	<v-sheet class="text-center" style="max-height: 80vh; overflow: auto;">
		        <v-btn
		          class="my-2"
		          text
		          @click="showSubscriptions = !showSubscriptions"
		        >
		        	<v-icon color="primary">mdi-close</v-icon>
		        </v-btn>
	        	<subscriptions />
	      	</v-sheet>
	    </v-bottom-sheet>
    </v-container>
</template>

<script>
	import Noty from 'noty'
	// import axios from 'axios'
	// import slugify from '~/helpers/slugify.js'
	import GamemodeHeader from '~/components/GamemodeHeader'
	import EventsByDate from '~/components/events/EventsByDate'
	import EventsByRound from '~/components/events/EventsByRound'
	import Subscriptions from '~/components/Subscriptions'

	// PWA Install to Homescreen
	let deferredPrompt

	export default {
		components: { GamemodeHeader, Subscriptions, EventsByDate, EventsByRound },
		layout: 'layoutGamemode',
		async created() {
			if (!this.loadedUserTeams || this.loadedUserTeams.length < 1) {
				await this.$store.dispatch('userTeams/fetchUserTeams')
			}
			this.eventsByDate = this.$store.getters['loadedActiveTab'] === 'date'
			this.eventsByRound = this.$store.getters['loadedActiveTab'] === 'round'
		},
		async mounted() {
			window.addEventListener('beforeinstallprompt', e => {
				console.log('beforeinstallprompt called!!!!')
				deferredPrompt = e
				this.showAddToHomeScreenButton = true
			})

			// Configure Web Push Notifications
			// if (!('serviceWorker' in navigator)) {
			// 	// Service Worker isn't supported on this browser, disable or hide UI.
			// 	alert('Service Worker is not supported on this browser')
			// 	return
			// }

			// if (!('PushManager' in window)) {
			// 	// Push isn't supported on this browser, disable or hide UI.
			// 	alert('Push is not supported on this browser')
			// 	return
			// }
			// if (Notification.permission !== 'denied') {
			// 	this.showSubscribeToPushNotifications = true
			// }
			// console.log('screen.width: ', window.screen.width)
			// console.log('screen.height: ', window.screen.height)
			// console.log('navigator.navigator.userAgent: ', slugify(window.navigator.userAgent))

			// const loadedUser = this.$store.getters['users/loadedUser']
			// console.log('loadedUser.id: ', loadedUser['id'])
			// console.log('loadedUser.uid: ', loadedUser['uid'])
			// await this.checkUserSubscriptions()
		},
		data() {
			return {
				showAddToHomeScreenButton: false,
				eventsByDate: true,
				eventsByRound: false,
				showSubscriptions: false,
				abcKey: process.env.ABC_KEY,
				nodeEnv: process.env.NODE_ENV,
				vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
				apiFootballKey: process.env.APIFOOTBALL_KEY
				// selectedCompetition: {}
			}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			},
			loadedActiveTab () {
				return this.$store.getters['loadedActiveTab']
			},
			loadedUserTeams () {
				return this.$store.getters['userTeams/loadedUserTeams']
			}
		},
		methods: {
			removeOverlay() {
				document.getElementById('overlay').style.display = 'none'
			},
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
			onSwitchToRound(competition) {
				console.log('onSwitchToRound: ', competition)
				this.eventsByDate = false
				this.eventsByRound = true
				// this.selectedCompetition = competition
				this.$store.commit('setActiveTab', 'round')
				this.$store.commit('setActiveCompetition', competition)
			},
			onSwitchToDate() {
				console.log('onSwitchToDate')
				this.eventsByRound = false
				this.eventsByDate = true
				this.$store.commit('setActiveTab', 'date')
			}
		}
	}
</script>

<style scoped>

</style>
