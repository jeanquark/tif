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
                loadedEventsByDateByCompetition: {{ loadedEventsByDateByCompetition }}<br /><br />
                <!-- loadedEventsByCompetitionByRound: {{ loadedEventsByCompetitionByRound }}<br /><br /> -->
                <!-- <v-btn small class="success" @click="toggleEvents">{{ eventsByDay ? 'Events by round' : 'Events by day' }}</v-btn> -->
                <!-- loadedActiveCompetitions: {{ loadedActiveCompetitions }}<br /><br /> -->
                <!-- loadedCompetitionsByDate: {{ loadedCompetitionsByDate }}<br /><br /> -->
				selectedDate: {{ selectedDate }}<br /><br />
				selectedCompetition: {{ selectedCompetition }}<br /><br />

                <!-- <div style="height: 200px;"></div> -->
                <!-- <v-row no-gutters style="border: 2px solid green;" v-if="eventsByDay"> -->
                <!-- <v-col> -->
                <v-tabs center-active color="yellow" slider-color="blue" @change="changeDay()" v-model="active_day_tab" style="max-width: 1017px;">
                    <v-tab v-for="(day, index) in days" :key="index" style="cursor: pointer;">
                        {{ displayDate(day) }}
                    </v-tab>
                    <v-tab-item v-for="(day, index) in days" :key="index" :transition="false" :reverse-transition="false">
                        <v-expansion-panels :accordion="true">
                            <v-expansion-panel v-for="competition in loadedCompetitionsByDate[getDate(day)]" :key="competition.id" @click="getEventsByDateByCompetition(getDate(day), competition )">
                                <v-expansion-panel-header>{{ competition.name }}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-row no-gutters align="center" v-for="(event, index) in loadedEventsByDateByCompetition" :key="index">
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
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <!-- <v-row no-gutters v-for="competition in loadedActiveCompetitions" :key="competition.id">
							competition
						</v-row> -->
                        <!--<v-data-table disable-pagination disable-sort hide-default-footer :items="loadedEventsByDayByCompetition" class="elevation-1">
                        <template v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="(item, index) in items" :key="index" :class="[index % 2 === 0 ? 'background-grey' : '']">
                                    <td class="text-left">{{ item.homeTeam_name }}</td>
									<td><v-img :src="`/images/teams/${props.item.homeTeam_slug}.png`" :lazy-src="`/images/teams/${props.item.homeTeam_slug}.png`" max-width="40"></v-img></td>
                                    <td class="text-center">
										{{ item.event_date | moment('LL') }}<br />
										{{ item.homeTeam_score }} - {{ item.awayTeam_score }}
									</td>
									<td><v-img :src="`/images/teams/${props.item.visitorTeam_slug}.png`" :lazy-src="`/images/teams/${props.item.visitorTeam_slug}.png`" max-width="40"></v-img></td>
									<td class="text-right">{{ item.awayTeam_name }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-data-table>-->
                    </v-tab-item>
                </v-tabs>
                <!-- </v-col> -->
                <!-- </v-row> -->

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
				days: ['-7', '-6', '-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4', '5', '6', '7'],
				active_day_tab: 2,
				active_confederation_tab: 0,
				active_country_tab: 0,
				active_competition_tab: 0,
				active_round_tab: 0,
				selectedConfederation: { name: 'UEFA', slug: 'uefa' },
				// selectedConfederation: {},
				selectedCountry: { name: 'Spain', slug: 'spain' },
				// selectedCountry: {},
				selectedCompetition: { name: 'Spanish Laliga', slug: 'spain_primera_division_2019_2020' },
				selectedDate: '',
				// selectedCompetition: {},
				// loading: true,
				eventsByDay: true,
				eventsByRound: false
				// rounds: [1, 2, 3, 4]
			}
		},
		computed: {
			loading() {
				return this.$store.getters['loading']
			},
			loadedUserTeams() {
				return this.$store.getters['userTeams/loadedUserTeams']
			},
			loadedActiveCompetitions() {
				return this.$store.getters['competitions/loadedCompetitions'].filter(competition => competition.active === true)
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

				// if (!this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug] || !this.$store.getters['events/loadedEventsByCompetitionByRound'] [this.selectedCompetition.slug][this.active_round_tab + 1]) {
				// 	this.fetchEventsByCompetitionByRound(this.selectedCompetition.slug, this.active_round_tab +1)
				// 	return []
				// }
				if (this.$store.getters['events/loadedEventsByCompetitionByRound'] && this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug]) {
					return this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug][this.active_round_tab + 1]
				}
				return []

				// if (this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug]) {
				// 	return this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug][this.active_round_tab + 1]
				// } else {
				// 	return []
				// }

				// if (this.$store.getters['events/loadedEventsByCompetitionByRound'] && this.selectedCompetition.slug) {
				// if (this.selectedCompetition.slug && (!this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug] ||  !this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug][this.active_round_tab])) {
				// 	this.$store.dispatch('events/fetchEventsByCompetitionByRound', { competitionSlug: this.selectedCompetition.slug, round: this.active_round_tab + 1 })
				// } else {
				// 	return this.$store.getters['events/loadedEventsByCompetitionByRound'][this.selectedCompetition.slug][this.active_round_tab + 1]
				// }
				// } else {
				// return []
				// }
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
					.format('ddd, MMMM DD')
			},
			getDate(day) {
				return slugify(
					moment()
						.add(day, 'days')
						.format('YYYY-MM-DD')
				)
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
					this.$store.dispatch('competitions/fetchCompetitionsByDate', slugify(date))
					// this.fetchEventsByDayByCompetition(day, 'switzerland_super_league_2019_2020')
				} catch (error) {
					console.log('error from changeDay(): ', error)
				}
			},
			async changeRound() {
				try {
					console.log('changeRound')
					this.fetchEventsByCompetitionByRound(this.selectedCompetition.slug, this.active_round_tab + 1)
					return []
				} catch (error) {
					console.log('error from changeRound(): ', error)
				}
			},
			async getEventsByDateByCompetition(date, competition) {
				try {
					this.selectedDate = date
					this.selectedCompetition = { name: competition.name, slug: competition.slug }
					await this.$store.dispatch('events/fetchEventsByDateByCompetition', { date, competition: competition.slug })
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