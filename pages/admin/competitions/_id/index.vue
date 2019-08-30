<template>
	<div>
		<v-breadcrumbs divider="/">
            <v-breadcrumbs-item v-for="item in items" :to="item.to" :key="item.text" :exact="true" :disabled="item.disabled">
                {{ item.text }}
            </v-breadcrumbs-item>
        </v-breadcrumbs>

		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<!-- loadedCompetition: {{ loadedCompetition }}<br /><br /> -->
				<!-- loadedTeamsByCompetition: {{ loadedTeamsByCompetition }}<br /><br /> -->
				<v-card-title>
					<v-layout justify-center>
						<h2>Edit {{ loadedCompetition.name }}</h2>
					</v-layout>
				</v-card-title>

				<v-card-text>
					<v-layout row wrap justify-center>
						<v-flex xs12 class="text-xs-center">
							<!-- <v-img :src="`/images/competitions/${loadedCompetition.image}`" max-width="300" class="justify-center text-xs-center"></v-img> -->
							<img :src="`/images/competitions/${loadedCompetition.image}`" width="300px" class="" v-if="loadedCompetition.image" />
							<span v-else>No image</span>
						</v-flex>
						<v-flex xs12 class="text-xs-center mt-3">
							<h2>Teams: {{ loadedTeamsByCompetition ? loadedTeamsByCompetition.length : 'No teams' }}</h2>
						</v-flex>
					</v-layout>
					<v-layout row wrap justify-center>
						<v-flex xs6 sm4 md3 class="pa-4" v-for="team in loadedTeamsByCompetition" :key="team.id">
							<v-img :src="`/images/teams/${team.image}`" v-if="team.image"></v-img>
							<v-img src="/images/no_image.png" v-else></v-img>
							<p class="text-xs-center mt-2">{{ team.name }}</p>
						</v-flex>
					</v-layout>
				</v-card-text>

				<v-card-actions>
					<v-layout justify-center>
						<v-btn color="success" :loading="loading" @click.stop="fetchTeamsByCompetition()">Get 	teams</v-btn>
					</v-layout>
				</v-card-actions>
			</v-card>
		</v-flex>
	</div>
</template>

<script>
	import Noty from 'noty'
	export default {
		layout: 'layoutBack',
		async created () {
			console.log(this.$route.params.id)
        	this.competition = this.$route.params.id
			await this.$store.dispatch('competitions/fetchCompetitions')
			await this.$store.dispatch('teams/fetchTeamsByCompetition', this.competition)
		},
		data () {
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
						text: 'Edit',
						disabled: true,
						to: '/admin/competitions/edit'
					}
				],
				competition: ''
			}
		},
		computed: {
			loading () {
				return this.$store.getters['loading']
			},
			loadedCompetition () {
				return this.$store.getters['competitions/loadedCompetitions'].find(competition => competition.id === this.competition)
			},
			loadedTeamsByCompetition () {
				return this.$store.getters['teams/loadedTeamsByCompetition'][this.competition]
			}
		},
		methods: {
			async fetchTeamsByCompetition () {
				try {
					this.$store.commit('setLoading', true, { root: true })
					await this.$store.dispatch('competitions/fetchTeamsByCompetition', this.loadedCompetition)
					new Noty({
						type: 'success',
						text: 'Teams retrieved successfully!',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					console.log('error: ', error)
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and the teams could not be retrieved.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} finally {
					this.$store.commit('setLoading', false, { root: true })
				}
 			}
		}
	}
</script>

<style scoped>

</style>