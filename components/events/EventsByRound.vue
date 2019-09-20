<template>
	<div>
		<h2>Events by round</h2>
		<!-- competition: {{ competition }}<br /><br /> -->
        <!-- loadedUserTeams: {{ loadedUserTeams }}<br /><br /> -->
        <!-- active_round_tab: {{ active_round_tab }}<br /><br /> -->
        <!-- loadedActiveRoundTab: {{ loadedActiveRoundTab }}<br /><br /> -->
        <!-- loadedActiveCompetition: {{ loadedActiveCompetition }}<br /><br /> -->
		<v-tabs center-active color="yellow" slider-color="blue" style="max-width: 1017px;" v-model="active_round_tab" @change="changeRound()">
            <v-tab v-for="(round) in loadedActiveCompetition.rounds" :key="round" style="cursor: pointer;">
                {{ round }}
            </v-tab>
            <v-tab-item v-for="(round, index) in loadedActiveCompetition.rounds" :key="index" :transition="false" :reverse-transition="false">
                <v-expansion-panels :accordion="true" :value="0">
                    <v-expansion-panel>
                        <v-expansion-panel-header :ripple="true" style="background: var(--v-primary-base);">
							<template v-slot:actions>
                                <v-icon color="white">$vuetify.icons.expand</v-icon>
                            </template>
                            <v-row class="text-left white--text font-weight-bold align-center">
                                <span class="subtitle mx-2">{{ loadedActiveCompetition.name }}</span>
                                <v-img :src="`/images/competitions/${loadedActiveCompetition.image}`" max-width="30" class="mr-2"></v-img>
                                <v-row class="white--text align-center mx-2" v-for="country in loadedActiveCompetition.countries" :key="country.slug">
                                    <span class="subtitle mx-2">{{ country.name }}</span>
                                    <v-img :src="`/images/countries/${country.slug}.png`" max-width="30" class="mr-2"></v-img>
                                </v-row>
                            </v-row>
                            <span class="text-right mr-4">
                                <v-btn class="mx-2" style="max-width: 150px;" @click.stop="switchToDate()">By day</v-btn>
                                <v-btn class="mx-2" style="max-width: 150px;" v-if="!standings" @click.stop="getStandingsByCompetition()">Standings</v-btn>
                                <v-btn class="mx-2" style="max-width: 150px;" v-if="standings" @click="getEventsByRound(competition)">By rounds</v-btn>
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content style="" v-if="!standings">
                            <v-row no-gutters justify="start" align="center" class="py-2" :class="index % 2 === 0 ? 'background-grey' : ''" v-for="(event, index) in loadedEventsByCompetitionByRound" :key="index" @click="goToEventPage(event.id)">
                                <v-col class="">
                                	<v-row no-gutters align="center">
                                    	<v-img :src="`/images/teams/${event.homeTeam_slug}_64_64.png`" max-width="40"></v-img>&nbsp;
                                    	<span>{{ event.homeTeam_name }}</span>
                                    	[round: {{ event.roundShort }}]
                                    </v-row>
                                </v-col>
                                <v-col class="text-center">
                                    {{ event.date | moment('LL') }}<br />
                                    <span v-if="event.statusShort !== 'NS'">
                                    	{{ event.homeTeam_score }} - {{ event.awayTeam_score }}
                                    </span>
                                    <!-- <span v-else> -->
                                    <!-- </span> -->
                                </v-col>
                                <v-col class="">
                                	<v-row no-gutters justify="end" align="center">
                                    	<span>{{ event.awayTeam_name }}</span>&nbsp;
                                    	<v-img :src="`/images/teams/${event.awayTeam_slug}_64_64.png`" max-width="40"></v-img>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                        <v-expansion-panel-content style="border: 1px solid dashed pink;" v-else>
                        	<v-data-table
							    :items="loadedStandingsByCompetition"
							    :items-per-page="100"
							    :disabled-pagination="true"
							    hide-default-footer
							    class="elevation-1"
							>
								<template v-slot:header="{ headers }">
									<thead>
										<tr align="center">
											<th class="text-center" v-for="header in standingsHeader" :key="header.text">
												{{ header.text }}
											</th>
										</tr>
									</thead>
								</template>

								<template v-slot:body="{ items }">
									<tbody>
							          	<tr v-for="item in items" :key="item.name">
							            	<td class="text-center">{{ item.rank }}</td>
							            	<td class="text-center">
							            		<v-img :src="`/images/teams/${item.team_slug}_64_64.png`" max-width="40"></v-img>
							            	</td>
							            	<td class="text-center">
							            		{{ item.team_name }}
							           		</td>
							            	<td class="subtitle-1 text-center"><b>{{ item.points }}</b></td>
							            	<td class="text-center">{{ item.all.matchsPlayed }}</td>
							            	<td class="text-center">{{ item.all.win }}</td>
							            	<td class="text-center">{{ item.all.draw }}</td>
							            	<td class="text-center">{{ item.all.lose }}</td>
							            	<td class="text-center">{{ item.all.goalsFor }}</td>
							            	<td class="text-center">{{ item.all.goalsAgainst }}</td>
							            	<td>
							            		<span v-if="item.goalsDiff > 0" class="success--text">
							            			+ {{ item.goalsDiff }}
							            		</span>
							            		<span v-if="item.goalsDiff < 0" class="error--text">
							            			{{ item.goalsDiff }}
							            		</span>
							            		<span v-if="item.goalsDiff === 0">
							            			{{ item.goalsDiff }}
							            		</span>
							            	</td>
							            	<td>
							            		<v-icon small :color="game === 'W' ? 'success' : game === 'L' ? 'error' : 'default'" v-for="(game, index) in item.forme.split('')" :key="index">
							            			mdi-circle
							            		</v-icon>
							            	</td>
							          	</tr>
							          	<tr>
							          		<td colspan="12" class="text-right" v-if="items[0]">
							          			last update: {{ items[0]['lastUpdate'] | moment('LL') }}
											</td>
							          	</tr>
							        </tbody>

								</template>
							</v-data-table>                                    
                    	</v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-tab-item>
        </v-tabs>
	</div>
</template>

<script>
	import moment from 'moment'
	import slugify from '~/helpers/slugify'
	export default {
		// props: ['competition'],
		async created () {
			if (!this.loadedUserTeams || this.loadedUserTeams.length < 1) {
				await this.$store.dispatch('userTeams/fetchUserTeams')
			}
			await this.fetchEventsByCompetitionByRound(this.loadedActiveCompetition.slug, this.active_round_tab + 1)
			this.active_round_tab = this.$store.getters['loadedActiveRoundTab'] || 0
			// await this.fetchEventsByCompetitionByRound(this.competitionSlug, this.active_round_tab + 1)
		},
		data () {
			return {
				// days: ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
				// active_day_tab: 10,
				active_round_tab: 0,
				selectedDate: '',
				// eventsByDay: true,
				// eventsByRound: false,
				standings: false,
				expandedPanel: '',
				standingsHeader: [
					{ text: 'Rank', sortable: true, value: 'rank' },
			        { text: '', sortable: false },
			        { text: 'Team', value: 'team_name' },
			        { text: 'Points', value: 'points' },
			        { text: 'Played', value: 'all.matchsPlayed' },
			        { text: 'Wins', value: 'all.win' },
			        { text: 'Draws', value: 'all.draw' },
			        { text: 'Losses', value: 'all.lose' },
			        { text: 'Goals for', value: 'all.goalsFor' },
			        { text: 'Goals against', value: 'all.goalsAgainst' },
			        { text: 'Diff', value: 'goalsDiff' },
			        { text: 'Last 5 games', value: 'forme' }
				]
			}
		},
		computed: {
			loadedActiveRoundTab () {
				return this.$store.getters['loadedActiveRoundTab']
			},
			loadedActiveCompetition () {
				return this.$store.getters['loadedActiveCompetition']
			},
			loadedUserTeams () {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedEventsByCompetitionByRound() {
				console.log('loadedEventsByCompetitionByRound')
				console.log('this.active_round_tab3: ', this.active_round_tab)
				if (this.$store.getters['events/loadedEventsByCompetitionByRound'] && this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug]) {
					return this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug][parseInt(this.active_round_tab) + 1]
				}
				return []
			},
			loadedStandingsByCompetition() {
				if (this.$store.getters['standings/loadedStandingsByCompetition']) {
					return this.$store.getters['standings/loadedStandingsByCompetition'][this.loadedActiveCompetition.slug]
				}
				return []
			},
		},
		methods: {
			goToEventPage(eventId) {
				console.log('Go to event page')
				this.$router.push(`/events/${eventId}`)
			},
			async getEventsByRound(competition) {
				try {
					console.log('getResultsByRound: ', competition)
					// this.active_round_tab = parseInt(this.loadedEventsByDateByCompetition[0]['roundShort']) + 1
					this.standings = false
					this.active_round_tab = 0
					// console.log('loadedEventsByDateByCompetition[0][roundShort]: ', this.loadedEventsByDateByCompetition[0]['roundShort'])
					this.changeRound()
				} catch (error) {
					console.log('error: ', error)
				}
			},
			switchToDate() {
				this.$emit('switchToDate')
			},
			async changeRound() {
				try {
					console.log('changeRound')
					this.$store.commit('setActiveRoundTab', this.active_round_tab)
					if (!this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug] || !this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug][parseInt(this.active_round_tab + 1)]) {
						this.fetchEventsByCompetitionByRound(this.loadedActiveCompetition.slug, parseInt(this.active_round_tab) + 1)	
					}
				} catch (error) {
					console.log('error from changeRound(): ', error)
				}
			},
			getStandingsByCompetition() {
				try {
					this.standings = true
					if (!this.$store.getters['standings/loadedStandingsByCompetition'][this.loadedActiveCompetition.slug]) {
						this.fetchStandingsByCompetition(this.loadedActiveCompetition.slug)
					}
				} catch (error) {
					console.log('error: ', error)
				}
			},
			async fetchEventsByCompetitionByRound(competitionSlug, round) {
				try {
					console.log('competitionSlug: ', competitionSlug, 'round: ', round)
					this.$store.commit('setLoading', true)
					await this.$store.dispatch('events/fetchEventsByCompetitionByRound', { competitionSlug, round })
					// setTimeout(() => {
					this.$store.commit('setLoading', false)
					// }, 2000)
					// console.log('Done fetching events by competition & round. [fetchEventsByCompetitionByRound]')
				} catch (error) {
					this.$store.commit('setLoading', false)
					console.log('error: ', error)
				}
			},
			async fetchStandingsByCompetition(competitionSlug) {
				try {
					await this.$store.dispatch('standings/fetchStandingsByCompetition', competitionSlug)
					console.log('Done fetching standings by competition. [fetchStandingsByCompetition]')
				} catch (error) {
					console.log('error: ', error)
				}
			}
		}
	}
</script>

<style scoped>
	.background-grey {
		background: #EEEEEE;
	}
	.row:hover {
        cursor: pointer;
        background: var(--v-primary-base);
        color: #FFF;
    }
	>>>.v-expansion-panel-content__wrap {
		padding: 0px;
	}
</style>