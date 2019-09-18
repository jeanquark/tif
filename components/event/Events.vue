<template>
    <!-- <h2>Events component</h2> -->
    <div style="background: lightgrey;">
        <!-- eventId: {{ eventId }}<br /><br /> -->
        <!-- homeTeamId: {{ homeTeamId }}<br /><br /> -->
        <!-- awayTeamId: {{ awayTeamId }}<br /><br /> -->
        loadedEventsByEvent: {{ loadedEventsByEvent }}<br /><br />

        <v-row no-gutters justify="center" align="center" class="" style="color: #FFF;">
            <v-col cols="12" class="py-2">
                <h3 class="text-center">
                    Temps forts du match
                </h3>
            </v-col>
        </v-row>
        <v-row no-gutters class="my-0 py-1" v-for="(event, index) in loadedEventsByEvent" :key="index" v-if="loadedEventsByEvent && loadedEventsByEvent.length > 0">
            <!-- :class="index % 2 === 0 ? 'white' : ''" -->
            <!-- <v-col cols="12" class="py-2">
                <h3 class="text-center">
                    Temps forts du match
                </h3>
            </v-col> -->
			<!--  -->
            <v-col cols="6" v-if="event.team_id === homeTeamId" style="">
                <v-row no-gutters align="center">
                    <v-col cols="8" class="text-right" style="border: 0px dashed red;">
                        {{ event.player }}
                    </v-col>
                    <v-col cols="2" class="" style="border: 0px dashed red;">
                        <v-img :src="`/images/${event.type}.png`" max-width="30" class="text-center" style="margin: auto;"></v-img>
                    </v-col>
                    <v-col cols="2" class="text-center" style="border: 0px dashed red;">
                        {{ event.elapsed }}'
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="6" offset="6" v-if="event.team_id === awayTeamId" style="">
                <v-row no-gutters align="center">
                    <v-col cols="2" class="text-center" style="border: 0px dashed red;">
                        {{ event.elapsed }}'
                    </v-col>
                    <v-col cols="2" class="" style="border: 0px dashed red;">
                        <!-- {{ event.type }} -->
                        <v-img :src="`/images/${event.type}.png`" max-width="30" style="margin: auto;"></v-img>
                    </v-col>
                    <v-col cols="8" class="text-left" style="border: 0px dashed red;">
                        {{ event.player }}
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-row no-gutters v-else>
            <v-col cols="12">
                <h2 class="text-center">No events for this game yet</h2>
            </v-col>
        </v-row>
    </div>
</template>

<script>
	export default {
		props: ['eventId', 'homeTeamId', 'awayTeamId'],
		created() {
			this.$store.dispatch('eventEvents/fetchEventsByEvent', this.eventId)
		},
		data() {
			return {}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			},
			// loadedEvent () {

			// },
			loadedEventsByEvent() {
				return this.$store.getters['eventEvents/loadedEventsByEvent'][this.eventId]
			}
		}
	}
</script>

<style scoped>
	.white {
		background: #fff;
	}
</style>