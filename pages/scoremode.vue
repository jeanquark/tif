<template>
    <v-container fluid fill-height style="padding: 0px; max-width: 1017px;">
        <v-row no-gutters>
            <v-col cols="12" style="background: #EEEEEE;">
                <scoremode-header />

                <!-- loadedAllEventsByDay: {{ loadedAllEventsByDay }}<br /><br /> -->
                <!-- loading: {{ loading }}<br /><br /> -->
                <!-- eventsByDay: {{ eventsByDay }}<br /><br /> -->
                <!-- loadedCompetitionsByCountry: {{ loadedCompetitionsByCountry }}<br /><br /> -->
                <!-- selectedConfederation: {{ selectedConfederation }}<br /><br /> -->
                <!-- selectedCountry: {{ selectedCountry }}<br /><br /> -->
                <!-- selectedCompetition.slug: {{ selectedCompetition.slug }}<br /><br /> -->
                <!-- active_round_tab: {{ active_round_tab }}<br /><br /> -->
                <!-- loadedEventsByDateByCompetition: {{ loadedEventsByDateByCompetition }}<br /><br /> -->
                <!-- loadedEventsByCompetitionByRound: {{ loadedEventsByCompetitionByRound }}<br /><br /> -->
                <!-- <v-btn small class="success" @click="toggleEvents">{{ eventsByDay ? 'Events by round' : 'Events by day' }}</v-btn> -->
                <!-- loadedActiveCompetitions: {{ loadedActiveCompetitions }}<br /><br /> -->
                <!-- loadedCompetitionsByDate: {{ loadedCompetitionsByDate }}<br /><br /> -->
                loadedCompetitions: {{ loadedCompetitions }}<br /><br />
                selectedDate: {{ selectedDate }}<br /><br />
                selectedCompetition: {{ selectedCompetition }}<br /><br />
                expandedPanel: {{ expandedPanel }}<br /><br />
                <!-- loadedEventsByDateByCompetition: {{ loadedEventsByDateByCompetition }}<br /><br /> -->

                <!-- <div style="height: 200px;"></div> -->
                <!-- <v-row no-gutters style="border: 2px solid green;" v-if="eventsByDay"> -->
                <!-- <v-col> -->
                <!-- Events by day -->
                <v-tabs center-active color="yellow" slider-color="blue" @change="changeDay()" v-model="active_day_tab" style="max-width: 1017px;" v-if="eventsByDay">
                    <v-tab v-for="(day, index) in days" :key="index" style="cursor: pointer;">
                        {{ displayDate(day) }}
                    </v-tab>
                    <v-tab-item v-for="(day, index) in days" :key="index" :transition="false" :reverse-transition="false">
                        <v-expansion-panels :accordion="true" v-model="expandedPanel">
                            <v-expansion-panel v-for="(competition, index) in loadedCompetitionsByDate[getDate(day)]" :key="competition.id" @click="getEventsByDateByCompetition(getDate(day), competition)">
                                <v-expansion-panel-header :ripple="expandedPanel === index ? false : true" style="background: var(--v-primary-base);">
                                    <template v-slot:actions>
                                        <v-icon color="white">$vuetify.icons.expand</v-icon>
                                    </template>
                                    <v-flex row class="text-left white--text font-weight-bold align-center">
                                        <span class="subtitle mx-2">{{ competition.name }}</span>
                                        <v-img :src="`/images/competitions/${competition.image}`" max-width="30" class="mr-2"></v-img>
                                        <v-flex row class="white--text align-center mx-2" v-for="country in competition.countries" :key="country.slug">
                                            <span class="subtitle mx-2">{{ country.name }}</span>
                                            <v-img :src="`/images/countries/${country.slug}.png`" max-width="30" class="mr-2"></v-img>
                                        </v-flex>
                                    </v-flex>
                                    <span class="text-right mr-4" v-if="competition.type === 'league'">
                                        <v-btn class="mx-2" style="max-width: 150px;" v-if="expandedPanel === index" @click.stop="getStandingsByCompetition()">Standings</v-btn>
                                        <v-btn class="mx-2" style="max-width: 150px;" v-if="expandedPanel === index" @click.stop="getEventsByRound()">By rounds</v-btn>
                                    </span>
                                </v-expansion-panel-header>
                                <v-expansion-panel-content style="border: 1px dashed pink;">
                                    <!-- <competitionResults></competitionResults>
									<competitionStandings></competitionStandings> -->
                                    <v-row no-gutters align="center" v-for="(event, index) in loadedEventsByDateByCompetition" :key="index" style="border: 1px solid green;">
                                        <v-col class="text-left">
                                            {{ event.homeTeam_name }}
                                        </v-col>
                                        <v-col class="text-center">
                                            {{ event.status }}<br />
                                            {{ event.homeTeam_score }} - {{ event.awayTeam_score }}
                                        </v-col>
                                        <v-col class="text-right">
                                            {{ event.awayTeam_name }}
                                        </v-col>
                                    </v-row>
                                    <v-row align="center" v-for="team in loadedStandingsByCompetition" :key="team.slug" style="border: 1px solid purple;">
                                        team: {{ team }}
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-tab-item>
                </v-tabs>

                <!-- Events by round -->
                <hr>
                <v-btn @click="switchEvents">Switch events</v-btn>
                selectedCountry: {{ this.selectedCountry }}<br /><br />
                selectedCompetition: {{ this.selectedCompetition }}<br /><br />
                eventsByRound: {{ eventsByRound }}<br /><br />
                active_round_tab: {{ active_round_tab }}<br /><br />
                <!-- loadedEventsByCompetitionByRound: {{ loadedEventsByCompetitionByRound }}<br /><br /> -->
                <v-tabs center-active color="yellow" slider-color="blue" v-model="active_round_tab" style="max-width: 1017px;" @change="changeRound()" v-if="eventsByRound">
                    <v-tab v-for="(round, index) in selectedCompetition.rounds" :key="index" style="cursor: pointer;">
                        {{ round }}
                    </v-tab>
                    <v-tab-item v-for="(round, index) in selectedCompetition.rounds" :key="index" :transition="false" :reverse-transition="false">
                        <!-- round: {{ round }} -->
                        <v-expansion-panels :accordion="true" v-model="expandedPanel">
                            <v-expansion-panel>
                                <v-expansion-panel-header :ripple="expandedPanel === index ? false : true" style="background: var(--v-primary-base);">
									{{ selectedCompetition.name }}
                                </v-expansion-panel-header>
                                <v-expansion-panel-content style="border: 1px dashed pink;">
                                    <v-row no-gutters align="center" v-for="(event, index) in loadedEventsByCompetitionByRound" :key="index" style="border: 1px solid green;">
                                        <v-col class="text-left">
                                            {{ event.homeTeam_name }}
                                            Round: {{ event.roundShort }}
                                        </v-col>
                                        <v-col class="text-center">
                                            {{ event.status }} | {{ event.data }}<br />
                                            {{ event.homeTeam_score }} - {{ event.awayTeam_score }}
                                        </v-col>
                                        <v-col class="text-right">
                                            {{ event.awayTeam_name }}
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-tab-item>
                </v-tabs>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
	import moment from 'moment'
	import ScoremodeHeader from '~/components/ScoremodeHeader'
	import { ContentLoader } from 'vue-content-loader'
	import slugify from '~/helpers/slugify'
	export default {
		components: { ScoremodeHeader, ContentLoader },
		layout: 'layoutScoreMode',
		async created() {
			this.$store.commit('setLoading', true, { root: true })
			const today = moment().format('YYYY-MM-DD')
			await this.$store.dispatch('competitions/fetchCompetitionsByDate', slugify(today))
			// if (!this.loadedAllEventsByDay) {
			// await this.$store.dispatch('events/fetchEventsByDay', today)
			await this.$store.dispatch('events/fetchEventsByDateByCompetition', { date: slugify(today), competition: 'switzerland_super_league_2019_2020' })
			// }
			console.log('this.selectedCompetition.slug: ', this.selectedCompetition.slug)
			console.log('this.active_round_tab: ', this.active_round_tab)
			// await this.$store.dispatch('events/fetchEventsByCompetitionByRound', this.selectedCompetition.slug, this.active_round_tab + 1)
			await this.fetchEventsByCompetitionByRound(this.selectedCompetition.slug, this.active_round_tab + 1)

			setTimeout(() => {
				this.$store.commit('setLoading', false, { root: true })
			}, 2000)
		},
		data() {
			return {
				days: ['-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
				active_day_tab: 7,
				active_confederation_tab: 0,
				active_country_tab: 0,
				active_competition_tab: 0,
				active_round_tab: 0,
				selectedConfederation: { name: 'UEFA', slug: 'uefa' },
				// selectedConfederation: {},
				selectedCountry: { name: 'Spain', slug: 'spain' },
				// selectedCountry: {},
				selectedCompetition: { name: 'Spanish Laliga', slug: 'spain_primera_division_2019_2020', rounds: 36 },
				selectedDate: '',
				// selectedCompetition: {},
				// loading: true,
				eventsByDay: true,
				eventsByRound: false,
				// rounds: [1, 2, 3, 4]
				expandedPanel: ''
			}
		},
		computed: {
			loading() {
				return this.$store.getters['loading']
			},
			loadedUserTeams() {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedCompetitions() {
				// return this.$store.getters['competitions/loadedCompetitions'].filter(competition => competition.active === true)
				return this.$store.getters['competitions/loadedCompetitions']
			},
			loadedEventsByDateByCompetition() {
				if (this.$store.getters['events/loadedEventsByDateByCompetition'] && this.$store.getters['events/loadedEventsByDateByCompetition'][this.selectedDate]) {
					return this.$store.getters['events/loadedEventsByDateByCompetition'][this.selectedDate][this.selectedCompetition.slug]
				}
				return []
			},
			loadedEventsByCompetitionByRound() {
				console.log('loadedEventsByCompetitionByRound')
				console.log('this.selectedCompetition.slug3: ', this.selectedCompetition.slug)
				console.log('this.active_round_tab3: ', this.active_round_tab)
				// if (this.$store.getters['events/loadedEventsByCompetitionByRound'] && this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug]) {
				return this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug][parseInt(this.active_round_tab) + 1]
				// }
				return []
			},
			loadedStandingsByCompetition() {
				if (this.$store.getters['standings/loadedStandingsByCompetition']) {
					return this.$store.getters['standings/loadedStandingsByCompetition'][this.selectedCompetition.slug]
				}
				return []
			},
			confederations() {
				return [
					{
						name: 'UEFA',
						slug: 'uefa',
						continent: {
							name: 'Europe',
							slug: 'europe'
						},
						image: 'europe.png'
					},
					{
						name: 'CONCACAF',
						slug: 'concacaf',
						continent: {
							name: 'America',
							slug: 'america'
						},
						image: 'north_and_central_america.png'
					},
					{
						name: 'CONMEBOL',
						slug: 'conmebol',
						continent: {
							name: 'America',
							slug: 'america'
						},
						image: 'south_america.png'
					},
					{
						name: 'CAF',
						slug: 'caf',
						continent: {
							name: 'Africa',
							slug: 'africa'
						},
						image: 'africa.png'
					},
					{
						name: 'AFC',
						slug: 'afc',
						continent: {
							name: 'Asia',
							slug: 'asia'
						},
						image: 'asia.png'
					},
					{
						name: 'OFC',
						slug: 'ofc',
						continent: {
							name: 'Oceania',
							slug: 'oceania'
						},
						image: 'oceania.png'
					}
				]
			},
			loadedCountriesByConfederation() {
				return this.$store.getters['countries/loadedCountriesByConfederation']
			},
			loadedCompetitionsByCountry() {
				return this.$store.getters['competitions/loadedCompetitionsByCountry']
			},
			loadedCompetitionsByDate() {
				return this.$store.getters['competitions/loadedCompetitionsByDate']
			}
		},
		methods: {
			displayDate(day) {
				return moment()
					.add(day, 'days')
					.format('ddd, MMM DD')
			},
			getDate(day) {
				return slugify(
					moment()
						.add(day, 'days')
						.format('YYYY-MM-DD')
				)
			},
			getStandingsByCompetition() {
				try {
					if (!this.$store.getters['standings/loadedStandingsByCompetition'][this.selectedCompetition.slug]) {
						this.fetchStandingsByCompetition(this.selectedCompetition.slug)
					}
				} catch (error) {
					console.log('error: ', error)
				}
			},
			switchEvents() {
				this.eventsByDay = !this.eventsByDay
				this.eventsByRound = !this.eventsByRound
			},
			async getEventsByRound() {
				try {
					console.log('getResultsByRound')
					this.eventsByDay = false
					this.eventsByRound = true
					// if (!this.active_round_tab) {
					// this.active_round_tab = 4
					this.active_round_tab = this.loadedEventsByDateByCompetition[0]['roundShort']
					// }
					await this.$store.dispatch('competitions/fetchCompetition', this.selectedCompetition.slug)
					const competition = this.$store.getters['competitions/loadedCompetitions'][this.selectedCompetition.slug]
					console.log('competition2: ', competition)
					// this.selectedCompetition.rounds = competition.rounds
					this.selectedCompetition.rounds = 36
					this.changeRound()
				} catch (error) {
					console.log('error: ', error)
				}
			},
			convertToLocalTime(timestamp) {
				const utcDiff = new Date().getTimezoneOffset()
				console.log('utcDiff: ', utcDiff)
				// console.log('moment.unix(timestamp): ', moment.unix(timestamp))
				// return moment.unix(timestamp).format("HH:mm")
				if (utcDiff > 0) {
					return moment
						.unix(timestamp)
						.add(utcDiff, 'minutes')
						.format('HH:mm')
				} else {
					return moment
						.unix(timestamp)
						.subtract(utcDiff, 'minutes')
						.format('HH:mm')
				}
			},
			toggleEvents() {
				this.eventsByDay = !this.eventsByDay
			},
			goToEventPage(eventId) {
				console.log('Go to event page')
				// this.$router.push(`/event/${eventId}`)
			},
			selectEventsByDay() {
				this.eventsByRound = false
				this.eventsByDay = true
			},
			selectEventsByRound() {
				this.eventsByDay = false
				this.eventsByRound = true
				this.changeConfederation()
			},

			async changeConfederation() {
				console.log('changeConfederation')

				this.selectedConfederation = this.confederations[this.active_confederation_tab]
				if (!this.loadedCountriesByConfederation[this.selectedConfederation.slug]) {
					await this.fetchCountriesByConfederation(this.selectedConfederation.slug)
				}

				this.active_country_tab = 0
				this.selectedCountry = this.loadedCountriesByConfederation[this.selectedConfederation.slug][this.active_country_tab]

				if (!this.loadedCompetitionsByCountry[this.selectedCountry.slug]) {
					await this.fetchCompetitionsByCountry(this.selectedCountry.slug)
				}
				this.active_competition_tab = 0
				this.selectedCompetition = this.loadedCompetitionsByCountry[this.selectedCountry.slug][this.active_competition_tab]
			},
			async changeCountry() {
				console.log('changeCountry')
				if (this.loadedCountriesByConfederation[this.selectedConfederation.slug]) {
					this.selectedCountry = this.loadedCountriesByConfederation[this.selectedConfederation.slug][this.active_country_tab]
					if (this.selectedCountry && (!this.loadedCompetitionsByCountry[this.selectedCountry.slug] || this.loadedCompetitionsByCountry[this.selectedCountry.slug].length < 1)) {
						await this.fetchCompetitionsByCountry(this.selectedCountry.slug)
					}

					this.active_competition_tab = 0
					this.selectedCompetition = this.loadedCompetitionsByCountry[this.selectedCountry.slug][this.active_competition_tab]
				}
			},
			async changeCompetition() {
				console.log('changeCompetition')
				if (this.loadedCompetitionsByCountry[this.selectedCountry.slug]) {
					this.selectedCompetition = this.loadedCompetitionsByCountry[this.selectedCountry.slug][this.active_competition_tab]
					console.log('this.selectedCompetition.slug2: ', this.selectedCompetition.slug)
					console.log('this.active_round_tab2: ', this.active_round_tab)

					if (
						this.selectedCompetition &&
						(!this.loadedEventsByCompetitionByRound ||
							!this.loadedEventsByCompetitionByRound[this.selectedCompetition.slug] ||
							this.loadedEventsByCompetitionByRound[this.selectedCompetition.slug][this.active_round_tab].length < 1)
					) {
						await this.fetchEventsByCompetitionByRound({ competitionSlug: this.selectedCompetition.slug, round: this.active_round_tab + 1 })
					}
				}
			},
			async changeDay() {
				try {
					const date = moment()
						.add(this.days[this.active_day_tab], 'days')
						.format('YYYY-MM-DD')
					this.selectedDate = slugify(date)
					if (!this.$store.getters['competitions/loadedCompetitionsByDate'][slugify(date)]) {
						this.$store.dispatch('competitions/fetchCompetitionsByDate', slugify(date))
					}
				} catch (error) {
					console.log('error from changeDay(): ', error)
				}
			},
			async changeRound() {
				try {
					console.log('changeRound')
					this.fetchEventsByCompetitionByRound(this.selectedCompetition.slug, parseInt(this.active_round_tab) + 1)
					return []
				} catch (error) {
					console.log('error from changeRound(): ', error)
				}
			},
			async getEventsByDateByCompetition(date, competition) {
				try {
					console.log('getEventsByDateByCompetition: ', competition)
					this.selectedDate = date
					this.selectedCompetition = { name: competition.name, slug: competition.slug, rounds: competition.rounds }
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
			// async fetchEventsByDayByCompetition(date, competition) {
			// 	try {
			// 		console.log('fetchEventsByDayByCompetition: ', date, competition)
			// 		// await this.$store.dispatch('events/fetchEventsByDayByCompetition', { date, competition })
			// 	} catch (error) {
			// 		console.log('error: ', error)
			// 	}
			// },
			async fetchCountriesByConfederation(confederationSlug) {
				try {
					await this.$store.dispatch('countries/fetchCountriesByConfederation', confederationSlug)
					console.log('Done fetching countries by confederation. [fetchCountriesByConfederation]')
				} catch (error) {
					console.log('error: ', error)
				}
			},
			async fetchCompetitionsByCountry(countrySlug) {
				try {
					// console.log('countrySlug: ', countrySlug)
					await this.$store.dispatch('competitions/fetchCompetitionsByCountry', countrySlug)
					console.log('Done fetching competitions by country. [fetchCompetitionsByCountry]')
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
	.tableRow {
		height: 50px;
		/* border: 1px solid #000; */
	}
	.tableRow:hover {
		cursor: pointer;
		color: #fff;
		background: var(--v-primary-base);
	}
	.background-grey {
		background: #eeeeee;
	}
	.background-grey:hover {
		background: var(--v-primary-base);
	}
</style>