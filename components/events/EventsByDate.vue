<template>
	<!-- <div style="min-height: 100vh;"> -->
	<v-container>
		<!-- selectedDate: {{ selectedDate }}<br /><br /> -->
		<!-- active_day_tab: {{ active_day_tab }}<br /><br /> -->
		<!-- active_day_tab2: {{ active_day_tab2 }}<br /><br /> -->
		<!-- active_date_panel: {{ active_date_panel }}<br /><br /> -->
		<!-- this.$store.getters['loadedActiveDateTab']: {{ this.$store.getters['loadedActiveDateTab'] }}<br /><br /> -->
		<!-- this.$store.getters['loadedActiveDatePanel']: {{ this.$store.getters['loadedActiveDatePanel'] }}<br /><br /> -->
		<!-- loadedEventsByDateByCompetition: {{ loadedEventsByDateByCompetition }}<br /><br /> -->
		
		<v-tabs center-active centered fixed-tabs color="yellow" slider-color="blue" style="max-width: 1017px;" @change="changeDay()" v-model="active_day_tab">
	        <v-tab v-for="(day, index) in days" :key="index" style="cursor: pointer; width: 150px;">
	            {{ displayDate(day) }}
	        </v-tab>
	        <v-tab-item v-for="(day, index) in days" :key="index" :transition="false" :reverse-transition="false">
				<h3 class="text-center pt-3" v-if="loadedUserEventsByDate[getDate(day)]">My games:</h3>
	        	<v-row no-gutters align="center" class="my-2 pa-2" :class="index % 2 === 0 ? 'background-grey' : ''" v-for="(event, index) in loadedUserEventsByDate[getDate(day)]" :key="index" @click="goToEventPage(event.id)">
	        		<v-col class="">
                    	<v-row no-gutters align="center">
                        	<v-img :src="`/images/teams/${event.homeTeam_slug}_64_64.png`" max-width="40"></v-img>&nbsp;
                        	<span>{{ event.homeTeam_name }}</span>
			                &nbsp;[eventId: {{ event.id }}]
                        </v-row>
                    </v-col>
                    <v-col class="text-center">
                        {{ event.status }}<br />
                        <span v-if="event.statusShort === 'FT'">
                            {{ event.homeTeam_score }} - {{ event.awayTeam_score }}
                        </span>
                        <span v-if="event.statusShort === '1H' || event.statusShort === '2H'">
                        	{{ event.homeTeam_goals }} - {{ event.awayTeam_goals }}
                        </span>
                        <span v-if="event.statusShort === 'NS'">
                        	{{ event.timestamp | moment('HH:mm') }}
                        </span>
                    </v-col>
                    <v-col class="">
                    	<v-row no-gutters justify="end" align="center">
                        	<span>{{ event.awayTeam_name }}</span>&nbsp;
                        	<v-img :src="`/images/teams/${event.awayTeam_slug}_64_64.png`" max-width="40"></v-img>
                        </v-row>
                    </v-col>
	        	</v-row>
				<h3 class="text-center py-3" v-if="loadedUserEventsByDate[getDate(day)]">All games:</h3>
				

	            <v-expansion-panels :multiple="false" :accordion="true" v-model="active_date_panel">
	                <v-expansion-panel class="" v-for="(competition, index) in loadedCompetitionsByDate[getDate(day)]" :key="competition.id" @click="getEventsByDateByCompetition(getDate(day), competition, index)">
	                    <v-expansion-panel-header :ripple="expandedPanel === index ? false : true" style="background: var(--v-primary-base);">
	                        <template v-slot:actions>
	                            <v-icon color="white">$vuetify.icons.expand</v-icon>
	                        </template>
	                        <v-row  no-gutters class="text-left white--text font-weight-bold align-center">
	                            <span class="subtitle mx-2">{{ competition.name }}</span>
	                            <v-img :src="`/images/competitions/${competition.image}`" lazy-src="/images/avatar.png" max-width="30" class="mr-1"></v-img>
	                            <v-row no-gutters class="white--text align-center mx-2" v-for="country in competition.countries" :key="country.slug">
	                                <span class="subtitle mx-2">{{ country.name }}</span>
	                                <v-img :src="`/images/countries/${country.slug}.png`" max-width="30" class="mr-1"></v-img>
	                            </v-row>
	                        </v-row>
	                        <span class="text-right mr-4">
	                            <v-btn small class="mx-2" style="max-width: 150px;" v-if="active_date_panel ===index && standings" @click.stop="getEventsByDateByCompetition(getDate(day), competition)">By day</v-btn>
	                            <v-btn small class="mx-2" style="max-width: 150px;" v-if="active_date_panel ===index && !standings && competition.type === 'league'" @click.stop="getStandingsByCompetition()">Standings</v-btn>
	                            <v-btn small class="mx-2" style="max-width: 150px;" v-if="active_date_panel ===index" @click="switchToRound(competition)">By rounds</v-btn>
	                        </span>
	                    </v-expansion-panel-header>
	                    <v-expansion-panel-content class="ma-0 pa-0" v-if="!standings">
	                        <v-row no-gutters justify="start" align="center" class="pa-2" :class="index % 2 === 0 ? 'background-grey' : ''" v-for="(event, index) in loadedEventsByDateByCompetition" :key="event.id" @click="goToEventPage(event.id)">
	                            <v-col class="">
	                            	<v-row no-gutters align="center">
	                                	<v-img :src="`/images/teams/${event.homeTeam_slug}_64_64.png`" max-width="40"></v-img>&nbsp;
	                                	<span>{{ event.homeTeam_name }}</span>
						                &nbsp;[eventId: {{ event.id }}]
	                                </v-row>
	                            </v-col>
	                            <v-col class="text-center">
	                                {{ event.status }} <br />
	                                <span v-if="event.statusShort === '1H' || event.statusShort === '2H'">
	                                    {{ event.homeTeam_goals }} - {{ event.awayTeam_goals }}
	                                </span>
	                                <span v-if="event.statusShort === 'FT'">
	                                	{{ event.homeTeam_score }} - {{ event.awayTeam_score }}
	                                </span>
	                                <span v-if="event.statusShort === 'NS'">
	                                	{{ event.timestamp | moment('HH:mm') }}
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
	            <div class="py-3" v-if="!loading && (!loadedCompetitionsByDate[getDate(day)] || loadedCompetitionsByDate[getDate(day)].length < 1)">
	            	<h4 class="text-center">No competitions found.</h4>
	            </div>
	            <div class="py-4" v-if="loading">
	            	<h4 class="text-center">loading...</h4>
	            </div>
	        </v-tab-item>
	    </v-tabs>
	</v-container>
</template>

<script>
	import moment from 'moment'
	import slugify from '~/helpers/slugify'
	export default {
		async created () {
			if (this.loadedUser && (!this.loadedUserTeams || this.loadedUserTeams.length < 1)) {
				await this.$store.dispatch('userTeams/fetchUserTeams')
			}
			// console.log('date: ', moment().format('YYYY-MM-DD'))
			// alert(moment().format('YYYY_MM_DD'))
			this.active_day_tab = this.$store.getters['loadedActiveDateTab'] || 10
			this.selectedDate = this.$store.getters['loadedActiveDate'] || moment().format('YYYY_MM_DD')
			this.selectedCompetition = this.$store.getters['loadedActiveCompetition'] || {}
			if (this.loadedEventsByDateByCompetition && this.loadedEventsByDateByCompetition.length > 0) {
				this.active_date_panel = this.$store.getters['loadedActiveDatePanel']
			} else {
				this.active_date_panel = null
			}
			// this.getEventsByDateByCompetition('2019_09_25', { slug: 'switzerland_super_league_2019_2020'}, 1)
			// this.getEventsByDateByCompetition('2019_09_25', this.selectedCompetition, 1)
			this.changeDay()
		},
		data () {
			return {
				days: ['-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '10'],
				days2: ['-10sd', '-9sad hjkhjk', '-8cvvb jj', '-7bvb jkjkl', '-6a', '-5nbvnv', '-4bv jh', '-3bnb', '-2bvn', '-1bvvn', '0nvb', '1bnvbn hj', '2bvnnb', '3vcbvb jkk', '4vbvb', '5 fgfghfgh', '6 dd fg', '7', '8', '9', '10', '10'],
				// active_day_tab: this.$store.getters['loadedActiveDayTab'] || 10,
				active_day_tab: 10,
				active_day_tab2: 10,
				selectedCompetition: {},
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
				],
				panel: [0, 1],
				active_date_panel: null
			}
		},
		computed: {
			loading () {
				return this.$store.getters['loading']
			},
			loadedActiveDate () {
				return this.$store.getters['loadedActiveDate']
			},
			loadedActiveDateTab () {
				return this.$store.getters['loadedActiveDateTab']
			},
			loadedActiveDatePanel() {
				return this.$store.getters['loadedActiveDatePanel']
			},
			loadedUserTeams () {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedUserEventsByDate () {
				return this.$store.getters['events/loadedUserEventsByDate']
			},
			loadedCompetitionsByDate() {
				return this.$store.getters['competitions/loadedCompetitionsByDate']
			},
			loadedEventsByDateByCompetition() {
				// console.log('loadedEventsByDateByCompetition')
				if (this.$store.getters['events/loadedEventsByDateByCompetition'] && this.$store.getters['events/loadedEventsByDateByCompetition'][this.selectedDate]) {
					return this.$store.getters['events/loadedEventsByDateByCompetition'][this.selectedDate][this.selectedCompetition.slug]
				}
				return []
			},
			loadedStandingsByCompetition() {
				if (this.$store.getters['standings/loadedStandingsByCompetition']) {
					return this.$store.getters['standings/loadedStandingsByCompetition'][this.selectedCompetition.slug]
				}
				return []
			}
		},
		methods: {
			displayDate(day) {
				return moment()
					.add(day, 'days')
					.format('ddd, MMM DD')
			},
			getDate(day = 0) {
				return slugify(
					moment()
						.add(day, 'days')
						.format('YYYY-MM-DD')
				)
			},
			goToEventPage(eventId) {
				console.log('Go to event page')
				console.log('$route.path: ', this.$route.path)
				if (this.$route.path === '/scoremode') {
					this.$router.push(`/scoremode/events/${eventId}`)
				} else {
					this.$router.push(`/events/${eventId}`)
				}
			},
			async getEventsByDateByCompetition(date, competition, index) {
				try {
					console.log('getEventsByDateByCompetition: ', date, competition, index)
					this.$store.commit('setActiveDatePanel', index)
					// this.eventsByRound = false
					this.standings = false
					// this.eventsByDay = true
					this.selectedDate = date
					this.selectedCompetition = { name: competition.name, slug: competition.slug, rounds: competition.rounds }
					this.$store.commit('setActiveCompetition', this.selectedCompetition)
					if (
						!this.$store.getters['events/loadedEventsByDateByCompetition'][this.selectedDate] ||
						!this.$store.getters['events/loadedEventsByDateByCompetition'][this.selectedDate][this.selectedCompetition.slug]
					) {
						await this.$store.dispatch('events/fetchEventsByDateByCompetition', { date, competition: competition.slug })
					}

				} catch (error) {
					console.log('error: ', error)
				}
			},
			switchToRound(competition) {
				this.$emit('switchToRound', competition)
			},
			async changeDay() {
				try {
					this.$store.commit('setLoading', true)
					const date = moment()
						.add(this.days[this.active_day_tab], 'days')
						.format('YYYY-MM-DD')
					this.selectedDate = slugify(date)
					console.log('selectedDate: ', this.selectedDate)
					this.$store.commit('setActiveDateTab', this.active_day_tab)
					this.$store.commit('setActiveDate', slugify(date))
					if (this.loadedEventsByDateByCompetition && this.loadedEventsByDateByCompetition.length > 0) {
						// this.active_date_panel = [this.$store.getters['loadedActiveDatePanel']] || []
						this.active_date_panel = this.$store.getters['loadedActiveDatePanel']
					} else {
						// this.active_date_panel = []
						this.active_date_panel = null
					}
					if (!this.$store.getters['competitions/loadedCompetitionsByDate'][this.selectedDate]) {
						await this.$store.dispatch('competitions/fetchCompetitionsByDate', this.selectedDate)
					}
					if (!this.$store.getters['events/loadedUserEventsByDate'][this.selectedDate]) {
						await this.$store.dispatch('events/fetchUserEventsByDate', this.selectedDate)
					}

					this.$store.commit('setLoading', false)
				} catch (error) {
					this.$store.commit('setLoading', false)
					console.log('error from changeDay(): ', error)
				}
			},
			getStandingsByCompetition() {
				try {
					this.standings = true
					if (!this.$store.getters['standings/loadedStandingsByCompetition'][this.selectedCompetition.slug]) {
						this.fetchStandingsByCompetition(this.selectedCompetition.slug)
					}
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