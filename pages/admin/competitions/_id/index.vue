<template>
	<div>
        <v-breadcrumbs :items="items">
            <template v-slot:item="props">
                <v-breadcrumbs-item :to="props.item.to" nuxt exact :disabled="props.item.disabled">
                    {{ props.item.text }}
                </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

		<v-flex xs12 sm8 offset-sm2>
			<v-card>
				<!-- loadedCompetition: {{ loadedCompetition }}<br /><br /> -->
				<!-- loadedTeamsByCompetition: {{ loadedTeamsByCompetition }}<br /><br /> -->
				<v-card-title>
					<v-row justify="center">
						<h3>Edit {{ loadedCompetition.name }}</h3>
					</v-row>
				</v-card-title>

				<v-card-text>
					<v-row justify="center">
						<v-col cols="12" class="text-center">
							<img :src="`/images/competitions/${loadedCompetition.image}`" width="300px" class="" v-if="loadedCompetition.image" />
							<span v-else>No image</span>
						</v-col>
						<v-col class="text-center">
							<h2 class="">Teams: {{ loadedTeamsByCompetition ? loadedTeamsByCompetition.length : 'No teams' }}</h2>
						</v-col>
					</v-row>
					<v-row justify="center">
						<v-col cols="6" sm="4" md="3" class="pa-4" v-for="team in loadedTeamsByCompetition" :key="team.id">
							<v-img :src="`/images/teams/${team.image}`"></v-img>
							<p class="text-center mt-2">{{ team.name }}</p>
						</v-col>
					</v-row>
				</v-card-text>

				<v-card-actions>
					<v-row justify="center">
						<v-btn color="success" :loading="loading" @click.stop="setTeamsByCompetition()">Set teams for this competition</v-btn>
					</v-row>
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
			await this.$store.dispatch('teams/fetchTeamsByCompetition', { competitionSlug: this.competition })
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
			async setTeamsByCompetition () {
				try {
					this.$store.commit('setLoading', true, { root: true })
					await this.$store.dispatch('competitions/setTeamsByCompetition', { leagueId: this.loadedCompetition.apifootball_id, competitionSlug: this.loadedCompetition.slug })
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