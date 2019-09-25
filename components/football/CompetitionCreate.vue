<template>
    <v-card>
        <v-card-title class="primary-title">
            <v-card-text class="text-md-center">
                <h2>Football competition<i class="fa fa-futbol"></i></h2>
                <!-- selectedCountry: {{ selectedCountry }}<br /><br /> -->
            </v-card-text>
        </v-card-title>
        <v-container>
            <v-row>
                <v-col sm="6" offset-sm="3">
                    <v-radio-group row v-model="competitionScope" class="justify-center">
                        <v-radio color="primary" value="national" label="National"></v-radio>
                        <v-radio color="primary" value="international" label="International" @change="selectedCountry = { apifootball_name: 'world' }"></v-radio>
                    </v-radio-group>
                </v-col>

                <transition name="slide">
                    <v-col sm="6" offset-sm="3" v-if="competitionScope === 'national'">
                        <v-autocomplete :items="loadedCountries" label="Select a country" item-text="name" item-value="apifootball_name" single-line :return-object="true" v-model="selectedCountry" @change="fetchCompetitionsByCountryAndSeason"></v-autocomplete>
                    </v-col>
                </transition>

                <v-col sm="6" offset-sm="3">
                    <v-autocomplete :items="loadedSeasons" label="Select year of the starting season" item-text="name" item-value="slug" single-line :return-object="true" v-model="selectedSeason" @change="fetchCompetitionsByCountryAndSeason"></v-autocomplete>
                </v-col>

                <v-col sm="6" offset-sm="3">
                    <v-autocomplete :items="loadedCompetitions" label="Select a competition" item-text="name" item-value="slug" single-line :return-object="true" v-model="selectedCompetition"></v-autocomplete>
                </v-col>

                <!-- <v-col sm="6" offset-sm="3" v-if="selectedCompetition.type === 'League'">
                    <v-text-field v-model="selectedCompetition.rounds" type="number" label="Total rounds" hint="Typically 38 for a league with 20 teams" :persistent-hint="true"></v-text-field>
                </v-col> -->

                <v-col cols="12" class="text-center">
                    <v-btn color="primary" @click.stop="addCompetition" :disabled="!selectedCompetition" :loading="loading">
                        Add competition
                    </v-btn><br />
                    <v-row justify="center" align="center" v-if="loading">
                        <v-col>
                            <p class="text-center">
                                Insert into database<br />
                                <span class="grey--text">{{ loadedMessage }}</span>
                            </p>
                            <v-alert dense outlined prominent type="warning" icon="mdi-alert-outline">
                                This request will retrieve all matches for the competition as well as all events and all statistics for each match. So it will take <strong>some time</strong> to complete. Please be patient and wait until a message is returned back.
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script>
	import Noty from 'noty'
	import moment from 'moment'
	import axios from 'axios'
	export default {
		layout: 'layoutBack',
		props: ['activity', 'category'],
		created() {
			try {
				this.$store.dispatch('countries/fetchCountries')
				this.$store.commit('setLoading', false)
				this.$store.commit('clearMessage')
			} catch (error) {
				console.log('error: ', error)
			}
		},
		mounted() {},
		data() {
			return {
				items: [
					{
						text: 'Dashboard',
						disabled: false,
						to: '/admin'
					},
					{
						text: 'Competitions',
						disabled: false,
						to: '/admin/competitions'
					},
					{
						text: 'Create',
						disabled: true,
						to: '/admin/competitions/create'
					}
				],
				loadedCompetitions: [],
				selectedCountry: '',
				selectedSeason: '',
				selectedCompetition: '',
				competitionScope: 'national'
			}
		},
		computed: {
			loading() {
				return this.$store.getters['loading']
			},
			loadedCountries() {
				return this.$store.getters['countries/loadedCountries']
			},
			loadedSeasons() {
				const twoYearsAgo = parseInt(
					moment()
						.add('-2', 'year')
						.format('YYYY')
				)
				return [twoYearsAgo, twoYearsAgo + 1, twoYearsAgo + 2, twoYearsAgo + 3]
			},
			loadedMessage() {
				return this.$store.getters['message']
			}
		},
		methods: {
			async fetchCompetitionsByCountryAndSeason() {
				console.log('fetchCompetitionsByCountry', this.selectedCountry)

				fetch("https://api-football-v1.p.rapidapi.com/v2/predictions/157462", {
					"method": "GET",
					"headers": {
						"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
						"x-rapidapi-key": process.env.APIFOOTBALL_KEY + 'abc'
					}
				})
				.then(response => {
					console.log(response);
				})
				.catch(err => {
					console.log('err: ', err);
				});
				
				const fetchedCompetitions = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/leagues/country/${this.selectedCountry.apifootball_name}/${this.selectedSeason}`, {
					headers: {
						// Accept: 'application/json',
						"content-type":"application/octet-stream",
						"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
						'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
					}
				})
				console.log('fetchedCompetitions: ', fetchedCompetitions)
				this.loadedCompetitions = fetchedCompetitions.data.api.leagues

				
			},
			async TOBEDELETED_fetchCompetitionsByCountryAndSeason() {
				console.log('selectedCountry', this.selectedCountry)
				console.log('selectedSeason: ', this.selectedSeason)
				// return
				const fetchedCompetitions = await axios.get(`https://api-football-v1.p.rapidapi.com/v2/leagues/country/${this.selectedCountry.apifootball_name}/${this.selectedSeason}`, {
					headers: {
						// Accept: 'application/json',
						"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
						'X-RapidAPI-Key': process.env.APIFOOTBALL_KEY
					}
				})
				const response = await axios.post('/api/fetch-competitions-by-country-by-season', { country: this.selectedCountry.name, season: this.selectedSeason })
				console.log('response: ', response)
				this.loadedCompetitions = response.data
			},
			async addCompetition() {
				try {
					console.log('addCompetition: ', this.selectedCompetition)
					this.$store.commit('setLoading', true)
					await this.$store.dispatch('competitions/createCompetition', this.selectedCompetition)
					this.$store.commit('setLoading', false)
					this.$store.commit('clearMessage')
					this.$router.push('/admin/competitions')
					this.selectedCountry = ''
					this.selectedSeason = ''
					this.selectedCompetition = ''
					new Noty({
						type: 'success',
						text: 'Compétition créée avec succès!',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					console.log('error: ', error)
					this.$store.commit('setLoading', false)
					new Noty({
						type: 'error',
						text: "Une erreur est survenue et la compétition n'a pas pu être créee.",
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			}
		},
		watch: {}
	}
</script>

<style scoped>
	[v-cloak] > * {
		display: none;
	}
	.checkbox {
		padding-top: 12px;
	}
	.input-group__details {
		padding-top: 10px;
	}
	.slide-enter-active {
		-moz-transition-duration: 0.3s;
		-webkit-transition-duration: 0.3s;
		-o-transition-duration: 0.3s;
		transition-duration: 0.3s;
		-moz-transition-timing-function: ease-in;
		-webkit-transition-timing-function: ease-in;
		-o-transition-timing-function: ease-in;
		transition-timing-function: ease-in;
	}

	.slide-leave-active {
		-moz-transition-duration: 0.3s;
		-webkit-transition-duration: 0.3s;
		-o-transition-duration: 0.3s;
		transition-duration: 0.3s;
		-moz-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
		-webkit-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
		-o-transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
		transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
	}

	.slide-enter-to,
	.slide-leave {
		max-height: 100px;
		overflow: hidden;
	}

	.slide-enter,
	.slide-leave-to {
		overflow: hidden;
		max-height: 0;
	}
</style>