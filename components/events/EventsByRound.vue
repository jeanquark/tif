<template>
	<!-- <div style="min-height: 100vh;"> -->
		<!-- <h2>Events by round</h2> -->
        <!-- active_round_tab: {{ active_round_tab }}<br /><br /> -->
        <!-- loading: {{ loading }}<br /><br /> -->
		<!-- active_round_slug: {{ active_round_slug }}<br /><br /> -->
		<!-- loadedCompetitionsById: {{ loadedCompetitionsById['switzerland_super_league_2019_2020']['rounds'].sort((a, b) => b.timestamp - a.timestamp) }}<br /><br /> -->
        <!-- loadedActiveCompetition: {{ loadedActiveCompetition }}<br /><br /> -->
		<!-- loadedEventsByCompetitionByRound: {{ loadedEventsByCompetitionByRound }}<br /><br /> -->
		<v-tabs center-active centered color="yellow" slider-color="blue" style="max-width: 1017px;" v-model="active_round_tab" v-if="loadedCompetitionsById[loadedActiveCompetition.slug]">
            <v-tab v-for="round in loadedCompetitionsById[loadedActiveCompetition.slug]['rounds']" :key="round.slug" style="cursor: pointer;" @change="changeRound(round.slug)">
                Round {{ round.slug.match(/\d+/g).map(Number)[0] }} 
            </v-tab>
            <v-tab-item v-for="(round, index) in loadedCompetitionsById[loadedActiveCompetition.slug]['rounds']" :key="index" :transition="false" :reverse-transition="false" v-if="!loading">
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
                                <v-btn class="mx-2" style="max-width: 150px;" v-if="!standings && loadedCompetitionsById[loadedActiveCompetition.slug]['type'] === 'league'" @click.stop="getStandingsByCompetition()">Standings</v-btn>
                                <v-btn class="mx-2" style="max-width: 150px;" v-if="standings" @click="getEventsByRound(competition)">By rounds</v-btn>
                            </span>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content v-if="!standings">
                        	<!-- [panel is open] -->
                            <v-row no-gutters justify="start" align="center" class="py-2" :class="index % 2 === 0 ? 'background-grey' : ''" v-for="(event, index) in loadedEventsByCompetitionByRound" :key="index" @click="goToEventPage(event.id)">
                                <v-col class="">
                                	<v-row no-gutters align="center">
                                    	<v-img :src="`/images/teams/${event.homeTeam_slug}_64_64.png`" max-width="40"></v-img>&nbsp;
                                    	<span>{{ event.homeTeam_name }}</span>
                                    	[round: {{ round.slug.match(/\d+/g).map(Number)[0] }}]
                                    </v-row>
                                </v-col>
                                <v-col class="text-center">
                                    {{ event.date | moment('LL') }}<br />
                                    <span v-if="event.statusShort !== 'NS'">
                                    	{{ event.homeTeam_score }} - {{ event.awayTeam_score }}
                                    </span>
                                </v-col>
                                <v-col class="">
                                	<v-row no-gutters justify="end" align="center">
                                    	<span>{{ event.awayTeam_name }}</span>&nbsp;
                                    	<v-img :src="`/images/teams/${event.awayTeam_slug}_64_64.png`" max-width="40"></v-img>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                        <v-expansion-panel-content style="border: 1px solid dashed pink;" v-if="standings">
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
                    	<!-- <v-expansion-panel-content v-if="loading">
                    		<h4 class="text-center pa-3">loading...</h4>
                    	</v-expansion-panel-content> -->
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-tab-item>
        </v-tabs>
	<!-- </div> -->
</template>

<script>
	import moment from 'moment'
	import slugify from '~/helpers/slugify'
	export default {
		async created () {
			try {
				if (this.loadedUser && (!this.loadedUserTeams || this.loadedUserTeams.length < 1)) {
					await this.$store.dispatch('userTeams/fetchUserTeams')
				}
				await this.$store.dispatch('competitions/fetchCompetitionsById', this.loadedActiveCompetition.slug)
				this.active_round_tab = this.$store.getters['loadedActiveRoundTab'] || 0
				this.active_round_slug = this.loadedCompetitionsById[this.loadedActiveCompetition.slug]['rounds'][this.active_round_tab]['slug']
				await this.fetchEventsByCompetitionByRound(this.loadedActiveCompetition.slug, this.active_round_slug)
			} catch (error) {
				console.log('error: ', error)
			}
		},
		data () {
			return {
				active_round_tab: 0,
				active_round_slug: '',
				selectedDate: '',
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
				],
			}
		},
		computed: {
			loading () {
				return this.$store.getters['loading']
			},
			loadedUser () {
				return this.$store.getters['users/loadedUser']
			},
			loadedActiveRoundTab () {
				return this.$store.getters['loadedActiveRoundTab']
			},
			loadedCompetitionsById () {
				return this.$store.getters['competitions/loadedCompetitionsById']
			},
			loadedActiveCompetition () {
				return this.$store.getters['loadedActiveCompetition']
			},
			loadedUserTeams () {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedEventsByCompetitionByRound() {
				// console.log('loadedEventsByCompetitionByRound')
				// console.log('this.active_round_tab3: ', this.active_round_tab)
				if (this.$store.getters['events/loadedEventsByCompetitionByRound'] && this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug]) {
					return this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug][this.active_round_slug]
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
					// console.log('getResultsByRound: ', competition)
					this.standings = false
					this.active_round_tab = 0
					this.changeRound()
				} catch (error) {
					console.log('error: ', error)
				}
			},
			switchToDate() {
				this.$emit('switchToDate')
			},
			async changeRound(roundSlug) {
				try {
					console.log('changeRound: ', roundSlug)
					this.$store.commit('setActiveRoundTab', parseInt(this.active_round_tab) + 1)
					this.active_round_slug = roundSlug
					if (!this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug] || !this.$store.getters['events/loadedEventsByCompetitionByRound'][this.loadedActiveCompetition.slug][roundSlug]) {
						this.$store.commit('setLoading', true)
						await this.fetchEventsByCompetitionByRound(this.loadedActiveCompetition.slug, this.active_round_slug)
						this.$store.commit('setLoading', false)
					}
				} catch (error) {
					console.log('error from changeRound(): ', error)
					this.$store.commit('setLoading', false)
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
			async fetchEventsByCompetitionByRound(competitionSlug, roundSlug) {
				try {
					console.log('competitionSlug: ', competitionSlug, 'roundSlug: ', roundSlug)
					await this.$store.dispatch('events/fetchEventsByCompetitionByRound', { competitionSlug, roundSlug })
				} catch (error) {
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