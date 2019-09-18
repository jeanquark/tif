<template>
    <!-- <v-content id="app"> -->
		<!-- event: {{ event }}<br /><br /> -->
        <v-container text-xs-center style="padding: 0; max-width: 1017px; border-left: 1px solid orangered; border-right: 1px solid orangered" v-if="event.id">
            <div class="backgroundImage" style="position: relative; padding-bottom: 1px">
                <!-- <v-layout grid-list-xs row wrap style="background-color: rgb(0,0,0,0.25)"> -->
                <v-row no-gutters style="background-color: rgb(0,0,0,0.25)">
                    <!-- <v-flex d-flex xs2 sm2 md2> -->
                    <v-col>
                    <!-- </v-flex> -->
                	</v-col>
                    <!-- <v-flex d-flex xs8 sm8 md8 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="infoMatch">
                            <!-- Espagne, Championnat, La Liga<br /> -->
							{{ event.competition_name }}<br />
                            <!-- Journée 1 sur 38 -->
							{{ event.round }}
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs2 sm2 md2> -->
                    <v-col>

                        <div class="text-xs-right retour">
                            <font-awesome-icon :icon="['fas', 'arrow-circle-left']" size="2x" class="icon" @click="goBack" />
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
            	</v-row>
                <!-- <v-layout row wrap style="margin-top: 10px"> -->
                <v-row no-gutters align="center" style="margin-top: 10px">

                    <!-- <v-flex d-flex xs2 sm2 md2 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="drapeau">
                            <img src="/images/switzerland.png" class="imgTeamSmall" />
							<!-- <v-img :src="'/images/teams/${event.homeTeam_slug}.png'"></v-img> -->
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs3 sm3 md3 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="scorePF">
                            10.456 PF
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs2 sm2 md2 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="timeEncours">
                            <!-- en cours...<br /> -->
							{{ event.status }}<br />
                            <!-- 14 minutes -->
							{{ event.elapsed }}
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs3 sm3 md3 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="scorePF">
                            12.456 PF
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs2 sm2 md2 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="drapeau">
                            <img src="/images/switzerland.png" class="imgTeamSmall" />
							<!-- <v-img :src="'/images/teams/${event.visitorTeam_slug}.png'"></v-img> -->
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
            	</v-row>
                <!-- <v-layout row wrap style="margin-top: 10px"> -->
                <v-row no-gutters style="margin-top: 10px">

                    <!-- <v-flex d-flex xs4 sm4 md4 justify-end align-center> -->
                    <v-col justify="center" align="center">

                        <div class="nameTeam">
							{{ event.homeTeam_name }}
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs4 sm4 md4 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="scoreReel">
                            Score réel<br />
                            <!-- 0 à 0 -->
							{{ event.homeTeam_goals }} - {{ event.awayTeam_goals }}
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs4 sm4 md4 justify-start align-center> -->
                    <v-col justify="center" align="center">

                        <div class="nameTeam">
							{{ event.awayTeam_name }}
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
            	</v-row>
                <!-- <v-layout row wrap style="margin-top: 10px"> -->
                <v-row no-gutters style="margin-top: 10px">

                    <!-- <v-flex d-flex xs12 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="scorePlayer">
                            Tu n'es pas encore inscrit<br />
                            à ThisIsFan.com !
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
            	</v-row>
                <!-- <v-layout grid-list-xs row wrap style="background-color: rgb(0, 0, 0, 0.9); border-top: 1px solid darkgrey; border-bottom: 1px solid darkgrey; margin-top: 5px"> -->
                <v-row no-gutters style="background-color: rgb(0, 0, 0, 0.9); border-top: 1px solid darkgrey; border-bottom: 1px solid darkgrey; margin-top: 5px">

                    <!-- <v-flex d-flex xs6 sm6 md6 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <div class="menuMatch" style="border-right: 1px solid darkgrey">
                            Le match
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs6 sm6 md6 justify-center align-center> -->
                    <v-col justify="center" align="center">

                        <nuxt-link to="/joueTif" class="hoverMatchStats" style="text-decoration: none; color: white; width: 100%">
                            <div class="menuTif">
                                Inscris-toi vite !
                            </div>
                        </nuxt-link>
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
            	</v-row>

                <!-- <v-layout grid-list-xs row wrap style="background-color: rgb(0, 0, 0, 0.9); border-top: 1px solid darkgrey; border-bottom: 1px solid darkgrey; margin-top: 5px; margin-bottom: 5px"> -->
                <v-row no-gutters style="background-color: rgb(0, 0, 0, 0.9); border-top: 1px solid darkgrey; border-bottom: 1px solid darkgrey; margin-top: 5px; margin-bottom: 5px">

                    <!-- <v-flex d-flex xs4 sm4 md4 justify-center align-center :class="{ active: activeComponent === 'events' }"> -->
                    <v-col justify="center" align="center" :class="{ active: activeComponent === 'events' }">

                        <div class="menuTif" style="border-right: 1px solid darkgrey" @click="activeComponent = 'events'">
                            Résumé du match
                        </div>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs4 sm4 md4 justify-center align-center :class="{ active: activeComponent === 'teams' }"> -->
                    <v-col justify="center" align="center" :class="{ active: activeComponent === 'teams' }">

                        <!-- <nuxt-link to="/matchEncoursEquipes" class="hoverMatchStats" style="text-decoration: none; color: white; width: 100%">	 -->
                        <div class="menuTif" style="border-right: 1px solid darkgrey" @click="activeComponent = 'teams'">
                            Equipes
                        </div>

                        <!-- </nuxt-link> -->
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex d-flex xs4 sm4 md4 justify-center align-center :class="{ active: activeComponent === 'statistics' }"> -->
                    <v-col justify="center" align="center" :class="{ active: activeComponent === 'statistics' }">

                        <!-- <nuxt-link to="/matchEncoursStats" class="hoverMatchStats" style="text-decoration: none; color: white; width: 100%"> -->
                        <div class="menuTif" @click="activeComponent = 'statistics'">
                            Statistiques
                        </div>
                        <!-- </nuxt-link> -->
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
            	</v-row>
            </div>
            <div>
                <events v-if="activeComponent === 'events'" :eventId="eventId" />
                <!-- <teams v-if="activeComponent === 'teams'" :eventId="eventId" /> -->
                <statistics v-if="activeComponent === 'statistics'" :eventId="eventId" />
            </div>
        </v-container>
    <!-- </v-content> -->
</template>

<script>
	import Events from '~/components/event/Events'
	// import Teams from '~/components/event/Teams'
	import Statistics from '~/components/event/Statistics'
	export default {
		components: { Events, Statistics },
		// layout: 'layoutGamemode',
		layout: 'layoutScoremode',
		async created() {
			// console.log('this.$route.params.id: ', this.$route.params.id)
			this.eventId = this.$route.params.id
			const eventId = this.$route.params.id
			console.log('eventId: ', eventId)
			let event = {}
			// if (this.$store.getters['events/loadedEventsByDay']) {
				// 1) Retrieve event from events by day object
				for (let day in this.$store.getters['events/loadedEventsByDay']) {
					console.log('day: ', day)
					event = this.$store.getters['events/loadedEventsByDay'][day].find(event => event.id === eventId)
				}
				// 2) If not found, retrieve event from events by competition by round object
				// if (!event) {
					for (let competition in this.$store.getters['events/loadedEventsByCompetitionByRound']) {
						console.log('competition: ', competition)
						for (let round in this.$store.getters['events/loadedEventsByCompetitionByRound'][competition]) {
							console.log('round: ', round)
							// event = this.$store.getters['events/loadedEventsByDay'][competition][round].find(event => event.id === eventId)
						}
					}
				// }
				// 3) Lastly, if the page was reloaded, fetch event from database
				// if (!event) {
					const abc = await this.$store.dispatch('events/fetchEventById', eventId)
					console.log('abc: ', abc)
					event = this.$store.getters['events/loadedEventsById'][eventId]
				// }
				console.log('event2: ', event)
				this.event = event
			// }
		},
		data() {
			return {
				// links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us'],
				// action: '',
				// actionsModal: false,
				eventId: '',
				event: {},
				activeComponent: 'events'
			}
		},
		methods: {
			goBack() {
				this.$router.replace('/gamemode')
			}
		}
	}
</script>

<style scoped>
	.active {
		background-color: var(--v-primary-base);
	}
	body {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
	.container {
		width: 100vw;
		min-height: 100vh;
		flex-direction: column;
		font: normal 100%/1 'Acme', Helvetica, sans-serif;
		background-color: light-gray;
	}
	.content {
		background-color: light-gray;
		overflow-x: auto;
		height: 100%;
		position: relative;
	}
	.backgroundImage {
		background-image: url(/images/stade.svg);
		background-size: cover;
		background-color: black;
	}
	.imgTeamSmall {
		width: 70%;
		border-radius: 10px;
	}
	.drapeau {
		padding: 10px;
	}
	.scorePF {
		background-color: rgb(255, 255, 255, 0.9);
		max-width: 80%;
		padding: 10px;
		font-size: 1.2em;
		font-weight: 700;
		border-radius: 5px;
	}
	.timeEncours {
		background-color: rgb(0, 128, 0, 0.9);
		max-width: 70%;
		padding: 10px;
		border-radius: 5px;
		font-size: 1em;
		color: white;
	}
	.nameTeam {
		background-color: rgb(255, 255, 255, 0.9);
		max-width: 75%;
		padding: 10px;
		font-size: 1.5em;
		font-weight: 700;
		border-radius: 5px;
	}
	.scorePlayer {
		background-color: rgb(255, 255, 255, 0.9);
		max-width: 25%;
		padding: 5px;
		border-radius: 5px;
		font-size: 1.3em;
		font-weight: 700;
		margin: 20px 10px;
		border: 2px solid orangered;
		color: orangered;
	}
	.scoreReel {
		background-color: rgb(0, 0, 0, 0.9);
		color: white;
		max-width: 40%;
		padding: 10px;
		border-radius: 5px;
		font-size: 1.1em;
	}
	.retour {
		position: absolute;
		top: 7px;
		right: 11px;
		color: white;
	}
	.icon:hover {
		cursor: pointer;
		color: orangered;
	}
	.infoMatch {
		color: white;
		font-size: 0.9em;
		margin: 10px 0;
	}
	.infosMatch {
		color: black;
		font-size: 1em;
	}
	.hoverMatchStats :hover {
		background-color: orangered;
		color: white;
	}
	.resumeMatch {
		background-color: white;
	}
	.titleResume {
		background-color: #fafafa;
		font-size: 1.1em;
		font-weight: 700;
		margin-bottom: 5px;
	}
	.eventMatch {
		background-color: lightgrey;
	}
	.imgIconSmall {
		width: 25px;
	}
	.tempsFortGaucheTexte {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
		text-align: right;
		font-weight: 700;
	}
	.tempsfortGaucheImage {
		padding: 10px;
		text-align: right;
	}
	.tempsFortGaucheTime {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
	}
	.tempsFortDroiteTime {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
	}
	.tempsFortDroiteImage {
		padding: 10px;
		text-align: left;
	}
	.tempsFortDroiteTexte {
		padding: 10px;
		color: black;
		font-size: 1em;
		text-transform: uppercase;
		text-align: left;
		font-weight: 700;
	}
	.menuMatch {
		border-right: 1px solid darkgrey;
		padding: 15px;
		color: orangered;
		font-size: 1.2em;
		text-transform: uppercase;
	}
	.menuTif {
		padding: 15px;
		color: white;
		font-size: 1.2em;
		text-transform: uppercase;
	}
	.menuTif:hover {
		background: var(--v-primary-base);
		cursor: pointer;
	}
	.tempsFortMargin {
		margin-top: 20px;
	}

	/* Small screens */
	@media only screen and (max-width: 768px) {
		body {
			margin: 0;
			padding: 0;
			overflow: hidden;
		}
		.container {
			width: 100vw;
			height: 100vh;
			flex-direction: column;
			font: normal 90%/1 'Acme', Helvetica, sans-serif;
		}
		.content {
			background-color: light-gray;
			height: 100%;
			overflow-x: auto;
		}
		.scorePF {
			max-width: 90%;
			padding: 5px;
			font-size: 0.8em;
			font-weight: 600;
		}
		.infoMatch {
			margin: 5px 0;
			font-size: 0.8em;
		}
		.retour {
			top: 3px;
			right: 11px;
		}
		.timeEncours {
			max-width: 95%;
			padding: 5px;
			font-size: 0.8em;
		}
		.drapeau {
			padding: 0;
		}
		.imgTeamSmall {
			width: 75%;
			border-radius: 5px;
		}
		.nameTeam {
			max-width: 90%;
			padding: 5px;
			font-size: 1.1em;
			font-weight: 700;
		}
		.scorePlayer {
			max-width: 25%;
			padding: 5px;
			border-radius: 5px;
			font-size: 1em;
			font-weight: 700;
			margin: 5px 5px;
			border: 1px solid orangered;
		}
		.scoreReel {
			max-width: 60%;
			padding: 5px;
			border-radius: 5px;
			font-size: 0.9em;
		}
		.menuMatch {
			padding: 5px;
			font-size: 1em;
		}
		.menuTif {
			padding: 5px;
			font-size: 1em;
		}
		.tempsFortMargin {
			margin-top: 10px;
		}
		.titleResume {
			font-size: 1em;
		}
		.tempsFortGaucheTexte {
			padding: 5px;
			font-size: 0.8em;
		}
		.tempsfortGaucheImage {
			padding: 5px;
			text-align: right;
		}
		.tempsFortGaucheTime {
			padding: 5px;
			font-size: 0.9em;
		}
		.tempsFortDroiteTime {
			padding: 5px;
			font-size: 0.9em;
		}
		.tempsFortDroiteImage {
			padding: 5px;
			text-align: left;
		}
		.tempsFortDroiteTexte {
			padding: 5px;
			font-size: 0.8em;
		}
		.imgIconSmall {
			width: 15px;
		}
		.infosMatch {
			color: black;
			font-size: 0.9em;
		}
	}
</style>