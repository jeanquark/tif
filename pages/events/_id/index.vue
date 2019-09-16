<template>
    <v-container style="max-width: 1017px;" v-if="event.id">
		event: {{ event }}<br /><br />
        <div class="background-image">
            <v-row no-gutters style="border: 1px solid red; background-color: rgb(0,0,0,0.25);">
                <v-col cols="12" justify="center" align="center" class="game-info">
                    <span class="text-center">
                        {{ event.competition_name }}<br />
                        {{ event.roundShort }} Round
                    </span>
                </v-col>
            </v-row>

            <v-row no-gutters justify="center" align="center" style="border: 1px solid red;">
                <v-col cols="2" align="center" class="" style="border: 1px dashed orangered;">
                    <v-img src="/images/switzerland.png" class="text-center" max-width="70%" style="margin: auto;"></v-img>
                    <!-- <img src="/images/switzerland.png" class="text-center" max-width="70%" /> -->
                </v-col>
                <v-col cols="3" justify="center" class="text-center">
                    <div class="box-pf" style="border: 1px dashed green;">10.456 PF</div>
                </v-col>
                <v-col cols="2" class="text-center">
                    <div class="box-livestatus" v-if="event.status === '1H' || '2H'">
                        {{ event.status }}
						<span v-if="event.statusShort === '1H' || event.statusShort === '2H'">{{ event.elapsed }} minutes</span>
                    </div>
                </v-col>
                <v-col cols="3" class="text-center">
                    <div class="box-pf" style="border: 1px dashed green;">12.456 PF</div>
                </v-col>
                <v-col cols="2" class="justify-center align-center" style="border: 1px dashed orangered;">
                    <v-img src="/images/switzerland.png" class="" max-width="70%" style="margin: auto;"></v-img>
                </v-col>
            </v-row>

            <v-row no-gutters justify="center" align="center" class="py-2" style="border: 1px solid red;">
                <v-col cols="4" class="" style="text-align: center;">
                    <div class="box-team">
                    	{{ event.homeTeam_name }}
                    </div>
                </v-col>
                <v-col cols="4" class="text-center" style="border: 1px dashed red;">
                    <div class="box-livescore" style="">
                        <span style="text-align: center;" v-if="event.statusShort === 'FT'">
							{{ event.score.fulltime }}
						</span>
						<span style="text-align: center;" v-else>
							{{ event.date }} - {{ event.time }}
						</span>
                    </div>
                </v-col>
                <v-col cols="4" class="text-center">
                    <div class="box-team text-center">
                        {{ event.awayTeam_name }}
                    </div>
                </v-col>
            </v-row>

            <v-row no-gutters justify="center" style="border: 1px solid red;">
                <v-col cols="12" class="box-player" style="">
                    Tu n'es pas encore inscrit
                    à ThisIsFan.com !
                </v-col>
            </v-row>

            <v-row no-gutters style="background-color: rgb(0, 0, 0, 0.9); border-top: 1px solid darkgrey; border-bottom: 1px solid darkgrey; margin-top: 5px; margin-bottom: 5px;">
                <v-col cols="6" :class="{ active: activeComponent === 'game' }">
                    <div class="box-link" @click="activeComponent = 'game'">
                        le match
                    </div>
                </v-col>
                <v-col cols="6">
                    <div class="box-link">
                        inscris-toi vite!
                    </div>
                </v-col>
            </v-row>

            <v-row no-gutters style="background-color: rgb(0, 0, 0, 0.9); border-top: 1px solid darkgrey; border-bottom: 1px solid darkgrey; margin-top: 5px; margin-bottom: 5px;">
                <v-col cols="4" :class="{ active: activeComponent === 'events' }">
                    <div class="box-link" @click="activeComponent = 'events'">
                        résumé du match
                    </div>
                </v-col>
                <v-col cols="4" :class="{ active: activeComponent === 'teams' }">
                    <div class="box-link" @click="activeComponent = 'teams'">
                        <span class="">équipes</span>
                    </div>
                </v-col>
                <v-col cols="4" :class="{ active: activeComponent === 'statistics' }">
                    <div class="box-link" @click="activeComponent = 'statistics'">
                        <span style="">statistiques</span>
                    </div>
                </v-col>
            </v-row>

            <v-row no-gutters style="">
                <v-col cols="12">
                    <game v-if="activeComponent === 'game'" :eventId="eventId" />
					<events v-if="activeComponent === 'events'" :eventId="eventId" :homeTeamId="event.homeTeam_id" :awayTeamId="event.awayTeam_id" />
                	<teams v-if="activeComponent === 'teams'" :eventId="eventId" />
                	<statistics v-if="activeComponent === 'statistics'" :eventId="eventId" />
                </v-col>
            </v-row>

        </div>

    </v-container>
</template>

<script>
	import Game from '~/components/event/Game'
	import Events from '~/components/event/Events'
	import Teams from '~/components/event/Teams'
	import Statistics from '~/components/event/Statistics'
	export default {
		components: { Game, Events, Teams, Statistics },
		layout: 'layoutGamemode',
		// layout: 'layoutScoreMode',
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
		background: var(--v-primary-base);
	}
	.background-image {
		background-image: url(/images/stade.svg);
		background-size: cover;
		background-color: black;
	}
	.game-info {
		color: #FFF;
		font-size: 0.9em;
		margin: 10px 0;
	}
	.box-pf {
		background-color: rgb(255, 255, 255, 0.9);
		max-width: 80%;
		margin: auto;
		padding: 10px;
		font-size: 1.2em;
		font-weight: 700;
		border-radius: 5px;
	}
	.box-livestatus {
		background-color: rgb(0, 128, 0, 0.9);
		max-width: 70%;
		margin: auto;
		padding: 10px;
		border-radius: 5px;
		font-size: 1em;
		color: white;
	}
	.box-team {
		background-color: rgb(255, 255, 255, 0.9);
		max-width: 75%;
		margin: auto;
		padding: 10px;
		font-size: 1.5em;
		font-weight: 700;
		border-radius: 5px;
		/* text-align: center; */
	}
	.box-livescore {
		background-color: rgb(0, 0, 0, 0.9);
		color: white;
		/* max-width: 40%; */
		width: 40%;
		margin: auto;
		padding: 10px;
		border-radius: 5px;
		font-size: 1.1em;
		/* text-align: center; */
	}
	.box-player {
		background-color: rgb(255, 255, 255, 0.9);
		max-width: 25%;
		padding: 5px;
		border-radius: 5px;
		font-size: 1.3em;
		font-weight: 700;
		margin: 20px 10px;
		border: 2px solid var(--v-primary-base);
		color: var(--v-primary-base);
		/* text-align: center; */
	}
	.box-link {
		border-right: 1px solid darkgrey;
		padding: 15px;
		color: #fff;
		font-size: 1.2em;
		text-transform: uppercase;
		text-align: center;
	}
	.box-link:hover {
		cursor: pointer;
		background: var(--v-primary-base);
	}
</style>