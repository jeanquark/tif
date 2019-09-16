<template>
    <div style="background: #FFF;" class="py-3">
        <!-- loadedGameStatisticsByEvent: {{ loadedGameStatisticsByEvent }}<br /><br /> -->
		<v-row no-gutters justify="center" align="center" class="my-4" v-for="statistic in loadedGameStatisticsByEvent" :key="statistic.slug">
			<div v-if="statistic.home">
			<v-col cols="12" class="text-center primary--text py-2">
				{{ statistic.name }}
			</v-col>
			<v-col cols="1" class="text-right pr-2">
				{{ statistic.home }}
			</v-col>
			<v-col cols="10" class="text-center">
			<v-progress-linear :value="getPercent(statistic.home, statistic.away)" height="20" color="amber">
			</v-progress-linear>
			</v-col>
			<v-col cols="1" class="text-left pl-2">
				{{ statistic.away }}
			</v-col>
			</div>
		</v-row>
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
			}
		},
		computed: {
			loadedGameStatisticsByEvent() {
				return this.$store.getters['eventGameStatistics/loadedGameStatisticsByEvent'][this.eventId]
			},
			// ballPossessionHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['ball_possession']) {
			// 		return this.loadedGameStatisticsByEvent['ball_possession']['home'].match(/\d+/)[0]
			// 	}
			// 	return []
			// },
			// goalAttemptsHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['goal_attempts']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['goal_attempts']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['goal_attempts']['home']) + parseInt(this.loadedGameStatisticsByEvent['goal_attempts']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// shotsOnGoalHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['shots_on_goal']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['shots_on_goal']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['shots_on_goal']['home']) + parseInt(this.loadedGameStatisticsByEvent['shots_on_goal']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// shotsOffGoalHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['shots_off_goal']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['shots_off_goal']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['shots_off_goal']['home']) + parseInt(this.loadedGameStatisticsByEvent['shots_off_goal']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// cornerKicksHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['corner_kicks']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['corner_kicks']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['corner_kicks']['home']) + parseInt(this.loadedGameStatisticsByEvent['corner_kicks']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// offsidesHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['offsides']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['offsides']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['offsides']['home']) + parseInt(this.loadedGameStatisticsByEvent['offsides']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// freeKicksHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['free_kicks']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['free_kicks']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['free_kicks']['home']) + parseInt(this.loadedGameStatisticsByEvent['free_kicks']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// blockedShotsHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['blocked_shots']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['blocked_shots']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['blocked_shots']['home']) + parseInt(this.loadedGameStatisticsByEvent['blocked_shots']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// throwinsHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['throwins']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['throwins']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['throwins']['home']) + parseInt(this.loadedGameStatisticsByEvent['throwins']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// foolsHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['fools']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['fools']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['fools']['home']) + parseInt(this.loadedGameStatisticsByEvent['fools']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// yellowCardsHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['yellow_cards']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['yellow_cards']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['yellow_cards']['home']) + parseInt(this.loadedGameStatisticsByEvent['yellow_cards']['away']))
			// 		)
			// 	}
			// 	return []
			// },
			// redCardsHomeTeam() {
			// 	if (this.loadedGameStatisticsByEvent && this.loadedGameStatisticsByEvent['red_cards']) {
			// 		return (
			// 			parseInt(this.loadedGameStatisticsByEvent['red_cards']['home'] * 100) /
			// 			(parseInt(this.loadedGameStatisticsByEvent['red_cards']['home']) + parseInt(this.loadedGameStatisticsByEvent['red_cards']['away']))
			// 		)
			// 	}
			// 	return []
			// }
		},
		methods: {
			getPercent(home, away) {
				if (home && away) {
					return Math.round((parseInt(home.match(/\d+/)[0]) * 100) / (parseInt(home.match(/\d+/)[0]) + parseInt(away.match(/\d+/)[0])))
				}
			}
		}
	}
</script>

<style scoped>
</style>