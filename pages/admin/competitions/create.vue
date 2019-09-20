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
		methods: {}
	}
</script>

<style scoped>

</style>
