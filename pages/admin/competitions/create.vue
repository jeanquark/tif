<template>
	<v-container>
	    <v-row>
			<v-breadcrumbs :items="items">
	            <template v-slot:item="props">
					<v-breadcrumbs-item
						:to="props.item.to"
						nuxt
						exact
						:disabled="props.item.disabled"
					>
	                	{{ props.item.text }}
					</v-breadcrumbs-item>
	            </template>
	            <template v-slot:divider>
	                <v-icon>mdi-chevron-right</v-icon>
	            </template>
	        </v-breadcrumbs>
		</v-row>
		<v-row>
			<v-col sm="6" offset-sm="3">
	            <v-card>
	                <v-form>
	                    <v-card-title class="primary-title">
	                        <v-card-text class="text-md-center">
	                            <h2>Add a new competition</h2>
	                        </v-card-text>
	                    </v-card-title>
	                    <v-row justify="center">
			        		<v-btn class="red ma-2 white--text" @click="fetchPredictions1">Fetch predictions 1</v-btn><br />
			        		<v-btn class="orange ma-2 white--text" @click="fetchPredictions2">Fetch predictions 2</v-btn><br />
			        		<v-btn class="yellow ma-2 white--text" @click="fetchPredictions3">Fetch predictions 3</v-btn><br />
			        		<v-btn class="blue ma-2 white--text" @click="fetchPredictions4">Fetch predictions 4</v-btn><br />
			        		<v-btn class="light-blue ma-2 white--text" @click="fetchPredictions5">Fetch predictions 5</v-btn><br />
			        		<v-btn class="cyan ma-2 white--text" @click="fetchPredictions6">Fetch predictions 6</v-btn><br />
			        		<v-btn class="teal ma-2 white--text" @click="fetchPredictions7">Fetch predictions 7</v-btn><br />
			        		<v-btn class="light-green ma-2 white--text" @click="fetchPredictions8">Fetch predictions 8</v-btn><br />
			        		<v-btn class="lime ma-2 white--text" @click="fetchPredictions9">Fetch predictions 9</v-btn><br />
			        		<v-btn class="amber ma-2 white--text" @click="fetchPredictions10">Fetch predictions 10</v-btn><br />
			        	</v-row>
	                    <v-container fluid v-if="loadedCategories != ''">
							<v-row>
								<v-col cols="6">
	                                <v-subheader class="text-xl-center">Activity</v-subheader>
								</v-col>
								<v-col cols="6" v-if="loadedActivities != ''">
	                                <v-autocomplete :items="loadedActivities" v-model="selectedActivity" label="Select an activity" item-text="name" item-value="slug" single-line :return-object="true"></v-autocomplete>
								</v-col>
								<v-col v-else>
	                                <v-progress-linear :indeterminate="true" height="2"></v-progress-linear>
								</v-col>

								<v-col cols="6">
	                                <v-subheader class="text-md-right">Category</v-subheader>
								</v-col>
								<v-col cols="6">
	                                <v-autocomplete :items="loadedCategories" v-model="selectedCategory" label="Select a category" item-text="name" item-value="slug" :autocomplete="true" single-line :disabled="selectedActivity.slug == ''" :return-object="true"></v-autocomplete>
	                            </v-col>
							</v-row>
	                    </v-container>
	                </v-form>
	            </v-card>

	            <football-competition :activity="selectedActivity" :category="selectedCategory" v-if="selectedCategory.slug === 'football'"></football-competition>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import axios from 'axios'
	import FootballCompetition from '~/components/football/CompetitionCreate'
	export default {
		layout: 'layoutBack',
		components: { FootballCompetition },
		created() {
		},
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
				selectedActivity: '',
				selectedCategory: ''
			}
		},
		computed: {
			loadedActivities() {
				return [
					{
						name: 'Sport',
						slug: 'sport'
					}
				]
			},
			loadedCategories() {
				return [
					{
						name: 'Football',
						slug: 'football'
					}
				]
			}
		},
		methods: {
			async fetchPredictions1 () {
				try {
					const predictions1 = await fetch("https://api-football-v1.p.rapidapi.com/v2/predictions/157462", {
						"method": "GET",
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions1: ', predictions1)
					console.log('predictions1: ', predictions1.body)
					console.log('predictions1: ', predictions1.api)
					console.log('predictions1: ', predictions1.data)
				} catch (error) {
					console.log('error predictions1: ', error)
				}
			},
			async fetchPredictions2 () {
				try {
					const predictions2 = await fetch(`/predictions`, {
						"method": "GET",
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions2: ', predictions2)
				} catch (error) {
					console.log('error predictions2: ', error)
				}
			},
			async fetchPredictions3 () {
				try {
					const predictions3 = await axios.get('https://api-football-v1.p.rapidapi.com/v2/predictions/157462', {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions3: ', predictions3)
				} catch (error) {
					console.log('error predictions3: ', error)
				}
			},
			async fetchPredictions4 () {
				try {
					const predictions4 = await axios.get(`/predictions`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions4: ', predictions4)
				} catch (error) {
					console.log('error predictions4: ', error)
				}
			},
			async fetchPredictions5 () {
				try {
					const predictions5 = await axios.get(`/apifootball/predictions/157462`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions5: ', predictions5)
				} catch (error) {
					console.log('error predictions5: ', error)
				}
			},
			async fetchPredictions6 () {
				try {
					const country = 'Switzerland'
					const season = '2019'
					const predictions6 = await axios.get(`/apifootball/leagues/country/${country}/${season}`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions6: ', predictions6)
				} catch (error) {
					console.log('error predictions6: ', error)
				}
			},
			async fetchPredictions7 () {
				try {
					const predictions7 = await axios.get(`/abc/predictions/157462`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions7: ', predictions7)
				} catch (error) {
					console.log('error predictions7: ', error)
				}
			},
			async fetchPredictions8 () {
				try {
					const predictions8 = await this.$axios.$get(`/apifootball/predictions/157462`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions8: ', predictions8)
				} catch (error) {
					console.log('error predictions8: ', error)
				}
			},
			async fetchPredictions9 () {
				try {
					const country = 'Switzerland'
					const season = '2019'
					const predictions9 = await this.$axios.$get(`/apifootball/leagues/country/${country}/${season}`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions9: ', predictions9)
				} catch (error) {
					console.log('error predictions9: ', error)
				}
			},
			async fetchPredictions10 () {
				try {
					const country = 'Switzerland'
					const season = '2019'
					const predictions10 = await this.$axios.$get(`/abc/leagues/country/${country}/${season}`, {
						"headers": {
							"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
							"x-rapidapi-key": process.env.APIFOOTBALL_KEY
						}
					})
					console.log('predictions10: ', predictions10)
				} catch (error) {
					console.log('error predictions10: ', error)
				}
			}
		}
	}
</script>

<style scoped>

</style>
