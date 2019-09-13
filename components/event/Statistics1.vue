<template>
    <div class="resumeMatch">
        loadedGameStatisticsByEvent: {{ loadedGameStatisticsByEvent }}<br /><br />
        shotsOnGoalHomeTeam: {{ shotsOnGoalHomeTeam }}<br /><br />
        ballPossessionHomeTeam: {{ ballPossessionHomeTeam }}<br /><br />
        <!-- <v-layout grid-list-xs row wrap class="tempsFortMargin" v-if="loadedGameStatisticsByEvent"> -->
        <v-row class="" v-if="loadedGameStatisticsByEvent">
            <!-- <v-flex xs12 justify-center align-center class="title font-weight-bold py-2"> -->
            <v-col class="justify-center align-center title font-weight-bold py-2">
                Possessions
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex xs12 justify-start class="cadreGeneral"> -->
            <v-col class="justify-start">
                <!-- <v-layout grid-list-xs row wrap align-center v-if="loadedGameStatisticsByEvent['ball_possession']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['ball_possession']">                
                    <!-- <v-flex xs12 justify-center class="subheading font-weight-medium primary--text"> -->
                    <v-col class="justify-center subheading font-weight-medium primary--text">
                        Possession de balle
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-center title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['ball_possession']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="ballPossessionHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-center title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['ball_possession']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex d-flex xs12 sm12 md12 justify-center align-center class="titleResume"> -->
            <v-col class="justify-center align-center">
                <div>
                    Attaques
                </div>
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex xs12 sm12 md12 justify-start align-start class="cadreGeneral"> -->
            <v-col class="justify-start align-start">
                <!-- <v-layout row wrap align-center v-if="loadedGameStatisticsByEvent['goal_attempts']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['goal_attempts']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Tirs au total
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-center title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['goal_attempts']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="goalAttemptsHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-center title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['goal_attempts']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout row wrap align-center v-if="loadedGameStatisticsByEvent['shots_on_goal']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['shots_on_goal']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Tirs cadrés
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['shots_on_goal']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 md10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="shotsOnGoalHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end align-center class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-center align-center title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['shots_on_goal']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout row wrap align-center v-if="loadedGameStatisticsByEvent['shots_off_goal']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['shots_off_goal']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Tirs non cadrés
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['shots_off_goal']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="shotsOffGoalHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['shots_off_goal']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout row wrap align-center v-if="loadedGameStatisticsByEvent['corner_kicks']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['corner_kicks']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Corners
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['corner_kicks']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="cornerKicksHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['corner_kicks']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout row wrap align-center v-if="loadedGameStatisticsByEvent['offsides']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['offsides']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Hors-jeu
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['offsides']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="offsidesHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['offsides']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout row wrap align-center v-if="loadedGameStatisticsByEvent['free_kicks']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['free_kicks']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Coups-francs
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-center title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['free_kicks']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="freeKicksHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['free_kicks']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex xs12 sm12 justify-center class="titleResume"> -->
            <v-col class="justify-center">
                <div>
                    Défenses
                </div>
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex xs12 justify-start align-start class="cadreGeneral"> -->
            <v-col class="justify-start align-start">
                <!-- <v-layout grid-list-xs row wrap align-center v-if="loadedGameStatisticsByEvent['blocked_shots']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['blocked_shots']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Tirs bloqués
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['blocked_shots']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="blockedShotsHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['blocked_shots']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout grid-list-xs row wrap align-center v-if="loadedGameStatisticsByEvent['throwins']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['throwins']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Touches
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-center title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['throwins']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="throwinsHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['throwins']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex xs12 justify-center class="titleResume"> -->
            <v-col class="justify-center">
                <div>
                    Cartons
                </div>
            <!-- </v-flex> -->
            </v-col>
            <!-- <v-flex xs12 justify-start class="cadreGeneral"> -->
            <v-col class="justify-start">
                <!-- <v-layout grid-list-xs row wrap align-center v-if="loadedGameStatisticsByEvent['fools']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['fools']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Fautes
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['fouls']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="foolsHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['fouls']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout grid-list-xs row wrap align-center v-if="loadedGameStatisticsByEvent['yellow_cards']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['yellow_cards']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Cartons jaunes
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['yellow_cards']['home'] }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="yellowCardsHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['yellow_cards']['away'] }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
                <!-- <v-layout grid-list-xs row wrap align-center v-if="loadedGameStatisticsByEvent['red_cards']"> -->
                <v-row no-gutters class="align-center" v-if="loadedGameStatisticsByEvent['red_cards']">
                    <!-- <v-flex xs12 justify-center class="titleResumeCentre"> -->
                    <v-col class="justify-center">
                        Cartons rouges
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-start class="title font-weight-bold text-xs-right pr-2"> -->
                    <v-col class="justify-start title font-weight-bold text-xs-right pr-2">
                        {{ loadedGameStatisticsByEvent['red_cards']['home'] || 0 }}
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs8 sm10 justify-center> -->
                    <v-col class="justify-center">
                        <v-progress-linear color="warning" height="15" :value="redCardsHomeTeam"></v-progress-linear>
                    <!-- </v-flex> -->
                    </v-col>
                    <!-- <v-flex xs2 sm1 justify-end class="title font-weight-bold text-xs-left pl-2"> -->
                    <v-col class="justify-end title font-weight-bold text-xs-left pl-2">
                        {{ loadedGameStatisticsByEvent['red_cards']['away'] || 0 }}
                    <!-- </v-flex> -->
                    </v-col>
                <!-- </v-layout> -->
                </v-row>
            <!-- </v-flex> -->
            </v-col>
        <!-- </v-layout> -->
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
		}
	}
</script>

<style scoped>
	
</style>