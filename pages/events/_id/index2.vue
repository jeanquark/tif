<template>
    <v-container style="padding: 0px; max-width: 1017px;">
        <v-row no-gutters justify="center" align="center">
            <v-col cols="12" style="background: #EEEEEE;">
            	Espagne, Championnat, La Liga<br />
				Journée 1 sur 38
         	</v-col>
        </v-row>
        <!-- <v-row no-gutters class="backgroundImage" style="border: 2px solid pink;"> -->
        <div class="backgroundImage" style="position: relative; border: 2px solid pink;">
	        <v-row no-gutters align="center" style="border: 1px solid orange;">
	         	<!-- <div class="backgroundImage" style="position: relative; padding-bottom: 1px"></div> -->
	         	<v-col justify="end">
	         		<v-img src="/images/teams/liverpool.png" max-width="128" class="text-right"></v-img>
	         	</v-col>
	         	<v-col>
	         		<div class="scorePF">10.456 PF</div>
	         	</v-col>
	         	<v-col>
	         		<div class="timeEncours">en cours...14 minutes</div>
	         	</v-col>
	         	<v-col>
	         		<div class="scorePF">12.456 PF</div>
	         	</v-col>
	         	<v-col class="justify-end">
	         		<v-img src="/images/teams/liverpool.png" max-width="128" class="text-right justify-end"></v-img>
	         	</v-col>
	        </v-row>
	        <v-row no-gutters align="center" style="border: 2px solid pink;">
	         	<!-- <div class="backgroundImage" style="position: relative; padding-bottom: 1px"></div> -->
	         	<v-col justify="end">
	         		<v-img src="/images/teams/liverpool.png" max-width="128" class="text-right"></v-img>
	         	</v-col>
	         	<v-col>
	         		<div class="scorePF">10.456 PF</div>
	         	</v-col>
	         	<v-col>
	         		<div class="timeEncours">en cours...14 minutes</div>
	         	</v-col>
	         	<v-col>
	         		<div class="scorePF">12.456 PF</div>
	         	</v-col>
	         	<v-col class="justify-end">
	         		<v-img src="/images/teams/liverpool.png" max-width="128" class="text-right justify-end"></v-img>
	         	</v-col>
	        </v-row>
	    <!-- </v-row> -->
		</div>
    </v-container>
</template>

<script>
	import Events from '~/components/event/Events'
	import Teams from '~/components/event/Teams'
	import Statistics from '~/components/event/Statistics'
	export default {
		components: { Events, Teams, Statistics },
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
	.backgroundImage {
		background-image: url(/images/stade.svg);
		background-size: cover;
		background-color: black;
	}
	.scorePF {
		background-color: rgb(255, 255, 255, 0.9);
		/*background-color: rgb(0, 128, 0, 0.9);*/
		text-align: center;
		max-width: 80%;
		padding: 10px;
		font-size: 1.2em;
		font-weight: 700;
		border-radius: 5px;
	}
	.timeEncours {
		background-color: rgb(0, 128, 0, 0.9);
		text-align: center;
		max-width: 70%;
		padding: 10px;
		border-radius: 5px;
		font-size: 1em;
		color: white;
	}
</style>