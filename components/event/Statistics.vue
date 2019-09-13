<template>
    <div>
        loadedGameStatisticsByEvent: {{ loadedGameStatisticsByEvent }}<br /><br />
        shotsOnGoalHomeTeam: {{ shotsOnGoalHomeTeam }}<br /><br />
        ballPossessionHomeTeam: {{ ballPossessionHomeTeam }}<br /><br />
        <!-- <v-layout grid-list-xs row wrap class="tempsFortMargin" v-if="loadedGameStatisticsByEvent"> -->
        <v-row no-gutters class="" v-for="statistic in loadedGameStatisticsByEvent" :key="statistic.slug">
            <!-- statistic: {{ statistic }} -->
            <p class="red--text">getPercent: {{ getPercent(statistic.home, statistic.away) }}</p>
            <!-- <v-progress-linear :value="getPercent(statistic.home, statistic.away)"></v-progress-linear> -->

        </v-row>
        <v-progress-linear :value="15" height="20" color="success"></v-progress-linear>
        <v-progress-circular :value="20"></v-progress-circular>
            abc
        <v-progress-linear
      v-model="power"
      color="amber"
      height="25"
      reactive
    ></v-progress-linear>
    <v-progress-circular
      :rotate="360"
      :size="100"
      :width="15"
      :value="20"
      color="success"
    >
      {{ 20 }}
    </v-progress-circular>
    </div>
</template>

<script>
	export default {
		props: ['eventId'],
		created() {
			if (!this.$store.getters['eventGameStatistics/loadedGameStatisticsByEvent'] || !this.$store.getters['eventGameStatistics/loadedGameStatisticsByEvent'][this.eventId]) {
				this.$store.dispatch('eventGameStatistics/fetchGameStatisticsByEvent', this.eventId)
			}
		},
		data() {
			return {
                power: 10
				// links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us'],
				// action: '',
				// actionsModal: false
			}
		},
		computed: {
			loadedGameStatisticsByEvent() {
				return this.$store.getters['eventGameStatistics/loadedGameStatisticsByEvent'][this.eventId]
			},
			ballPossessionHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['ball_possession']) {
					return this.loadedGameStatisticsByEvent['ball_possession']['home'].match(/\d+/)[0]
				}
				return []
			},
			goalAttemptsHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['goal_attempts']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['goal_attempts']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['goal_attempts']['home']) + parseInt(this.loadedGameStatisticsByEvent['goal_attempts']['away']))
					)
				}
				return []
			},
			shotsOnGoalHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['shots_on_goal']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['shots_on_goal']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['shots_on_goal']['home']) + parseInt(this.loadedGameStatisticsByEvent['shots_on_goal']['away']))
					)
				}
				return []
			},
			shotsOffGoalHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['shots_off_goal']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['shots_off_goal']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['shots_off_goal']['home']) + parseInt(this.loadedGameStatisticsByEvent['shots_off_goal']['away']))
					)
				}
				return []
			},
			cornerKicksHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['corner_kicks']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['corner_kicks']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['corner_kicks']['home']) + parseInt(this.loadedGameStatisticsByEvent['corner_kicks']['away']))
					)
				}
				return []
			},
			offsidesHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['offsides']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['offsides']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['offsides']['home']) + parseInt(this.loadedGameStatisticsByEvent['offsides']['away']))
					)
				}
				return []
			},
			freeKicksHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['free_kicks']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['free_kicks']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['free_kicks']['home']) + parseInt(this.loadedGameStatisticsByEvent['free_kicks']['away']))
					)
				}
				return []
			},
			blockedShotsHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['blocked_shots']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['blocked_shots']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['blocked_shots']['home']) + parseInt(this.loadedGameStatisticsByEvent['blocked_shots']['away']))
					)
				}
				return []
			},
			throwinsHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['throwins']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['throwins']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['throwins']['home']) + parseInt(this.loadedGameStatisticsByEvent['throwins']['away']))
					)
				}
				return []
			},
			foolsHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['fools']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['fools']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['fools']['home']) + parseInt(this.loadedGameStatisticsByEvent['fools']['away']))
					)
				}
				return []
			},
			yellowCardsHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['yellow_cards']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['yellow_cards']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['yellow_cards']['home']) + parseInt(this.loadedGameStatisticsByEvent['yellow_cards']['away']))
					)
				}
				return []
			},
			redCardsHomeTeam() {
				if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['red_cards']) {
					return (
						parseInt(this.loadedGameStatisticsByEvent['red_cards']['home'] * 100) /
						(parseInt(this.loadedGameStatisticsByEvent['red_cards']['home']) + parseInt(this.loadedGameStatisticsByEvent['red_cards']['away']))
					)
				}
				return []
			}
		},
		methods: {
            getPercent (home, away) {
                if (home && away) {
                    return Math.round(parseInt(home.match(/\d+/)[0]) * 100 / (parseInt(home.match(/\d+/)[0]) + parseInt(away.match(/\d+/)[0])))
                    
                }
            },
		}
	}
</script>

<style scoped>
	
</style>