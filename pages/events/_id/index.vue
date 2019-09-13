<template>
    <v-container style="max-width: 1017px;" v-if="event.id">
    	<v-row no-gutters style="border: 1px solid red;">
    		<v-col cols="12" justify="center" align="center" class="">
    			<span class="text-center">
    				Premier League<br />
					Regular Season - 1
				</span>
    		</v-col>
	    </v-row>

	    <v-row no-gutters align-self="stretch" style="border: 1px solid red;">
    		<v-col cols="3">
    			<v-img src="/images/switzerland.png" class=""></v-img>
    		</v-col>
    		<v-col cols="2" class="d-flex justify-center align-self-center">
    			<span style="border: 1px dashed green;">10.456 PF</span>
    		</v-col>
    		<v-col cols="2" justify="center" align-self="center">
    			<span style="border: 1px dashed green;">
    				en cours...
					14 minutes
				</span>
    		</v-col>
    		<v-col cols="2">
    			<span class="d-flex justify-center align-center" style="border: 1px dashed green;">12.456 PF</span>
    		</v-col>
    		<v-col cols="3">
    			<v-img src="/images/switzerland.png" class=""></v-img>
    		</v-col>
	    </v-row>

	    <v-row no-gutters justify="center" style="border: 1px solid red;">
    		<v-col>
    			<h2>Deportivo Alavés</h2>
    		</v-col>
    		<v-col>
    			Bientôt
    		</v-col>
    		<v-col>
    			<h2>Espanyol Barcelone</h2>
    		</v-col>
	    </v-row>

	    <v-row no-gutters justify="center" style="border: 1px solid red;">
    		<v-col cols="12">
    			Tu n'es pas encore inscrit
				à ThisIsFan.com !
    		</v-col>
	    </v-row>
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
	
</style>