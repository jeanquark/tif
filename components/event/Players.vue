<template>
	<div class="" style="background: #FFF;">
        eventId: {{ eventId }}<br /><br/>
        homeTeamId: {{ homeTeamId }}<br /><br />
        awayTeamId: {{ awayTeamId }}<br /><br />
        homeTeamSlug: {{ homeTeamSlug }}<br /><br />
        awayTeamSlug: {{ awayTeamSlug }}<br /><br />
		<!-- loadedEventPlayersStatistics: {{ loadedEventPlayersStatistics }}<br /><br /> -->
		<v-row no-gutters>
			<v-col class="mx-2" style="border: 1px dashed red;">
                <v-row no-gutters justify="center">
                    <v-img :src="`/images/teams/${homeTeamSlug}.png`" max-width="60"></v-img>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Goalkeeper</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsHomeTeamGoalkeepers" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Defenders</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsHomeTeamDefenders" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Midfielders</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsHomeTeamMidfielders" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Forwards</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsHomeTeamForwards" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
			</v-col>
            <v-col class="mx-2">
                <v-row no-gutters justify="center">
                    <v-img :src="`/images/teams/${awayTeamSlug}.png`" max-width="60"></v-img>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Goalkeeper</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsAwayTeamGoalkeepers" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Defenders</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsAwayTeamDefenders" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Midfielders</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsAwayTeamMidfielders" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row no-gutters class="py-2">
                    <v-col cols="12">
                        <h3 class="py-1">Forwards</h3>
                        <v-row no-gutters class="lightgrey pa-1" v-for="(player, index) in loadedEventPlayersStatisticsAwayTeamForwards" :key="player.number">
                            <v-col cols="6">
                                {{ player.player_name }}
                            </v-col>
                            <v-col cols="2">
                                {{ player.rating }}/10
                            </v-col>
                            <v-col cols="1">
                                {{ player.minutes_played }}'
                            </v-col>
                            <v-col cols="2">
                                {{ player.passes.total }} ({{ player.passes.accuracy }}%)
                            </v-col>
                            <v-col cols="1">
                                {{ player.goals.total }}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-col>
		</v-row>
	</div>
</template>

<script>
    export default {
    	props: ['eventId', 'homeTeamId', 'awayTeamId', 'homeTeamSlug', 'awayTeamSlug'],
        components: { },
        // layout: 'layoutFront',
        created () {
        	this.$store.dispatch('eventPlayersStatistics/fetchPlayersStatisticsByEvent', this.eventId)
        },
        data () {
            return {
                links: [
                    'Home',
                    'About Us',
                    'Team',
                    'Services',
                    'Blog',
                    'Contact Us'
                ],
                action: '',
                actionsModal: false
            } 
        },
        computed: {
        	loadedEventPlayersStatistics () {
        		return this.$store.getters['eventPlayersStatistics/loadedPlayersStatisticsByEvent']
        	},
            loadedEventPlayersStatisticsHomeTeam () {
                return this.loadedEventPlayersStatistics.filter(statistic => statistic.team_id === this.homeTeamId)
            },
            loadedEventPlayersStatisticsHomeTeamGoalkeepers () {
                return this.loadedEventPlayersStatisticsHomeTeam.filter(player => player.position === 'G')
            },
            loadedEventPlayersStatisticsHomeTeamDefenders () {
                return this.loadedEventPlayersStatisticsHomeTeam.filter(player => player.position === 'D')
            },
            loadedEventPlayersStatisticsHomeTeamMidfielders () {
                return this.loadedEventPlayersStatisticsHomeTeam.filter(player => player.position === 'M')
            },
            loadedEventPlayersStatisticsHomeTeamForwards () {
                return this.loadedEventPlayersStatisticsHomeTeam.filter(player => player.position === 'F')
            },
            loadedEventPlayersStatisticsAwayTeam () {
                return this.loadedEventPlayersStatistics.filter(statistic => statistic.team_id === this.awayTeamId)
            },
            loadedEventPlayersStatisticsAwayTeamGoalkeepers () {
                return this.loadedEventPlayersStatisticsAwayTeam.filter(player => player.position === 'G')
            },
            loadedEventPlayersStatisticsAwayTeamDefenders () {
                return this.loadedEventPlayersStatisticsAwayTeam.filter(player => player.position === 'D')
            },
            loadedEventPlayersStatisticsAwayTeamMidfielders () {
                return this.loadedEventPlayersStatisticsAwayTeam.filter(player => player.position === 'M')
            },
            loadedEventPlayersStatisticsAwayTeamForwards () {
                return this.loadedEventPlayersStatisticsAwayTeam.filter(player => player.position === 'F')
            },
        },
        methods: {
			goBack() {
				this.$router.push("/gamemode")
			}
        }
    }
</script>

<style scoped>
    .lightgrey {
        background-color: lightgrey;
    }
</style>