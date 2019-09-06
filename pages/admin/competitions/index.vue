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
            <!-- <v-breadcrumbs-item v-for="link in links" :key="link.text" :disabled="link.disabled" :to="link.to" :exact="true">
                {{ link.text }}
            </v-breadcrumbs-item> -->
        </v-breadcrumbs>
        <!-- <v-breadcrumbs :items="items" divider=">"></v-breadcrumbs> -->

        <!-- <v-flex xs12 sm10 offset-sm1> -->
        <v-col sm="10" offset-sm="1">
            <br /><br />
            <h1 class="text-md-center">Competitions</h1>
            <!-- loadingCompetition: {{ loadingCompetition }}<br /> -->
            <br /><br />
            <v-btn color="primary" dark slot="activator" class="mb-3 ml-0" to="/admin/competitions/create">
                Add a new competition
            </v-btn>
            <v-card>
                <!-- <v-card-title>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-card-title> -->
                <v-card-title>
                    <div class="flex-grow-1"></div>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-card-title>

                <template>
                    <v-data-table :headers="headers" :items="loadedCompetitions" :items-per-page="5" :search="search" class="elevation-1">
                        <template v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="(item, index) in items" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>{{ item.slug }}</td>
                                    <td class="text-center" :value="item.active">
                                        <v-checkbox color="success" v-model="item.active" class="text-center" @change="toggleCompetitionActiveStatus(item)"></v-checkbox>
                                    </td>
                                    <td class="text-center" v-if="item.image">
                                        <img :src="`/images/competitions/${item.image}`" height="40px" />
                                    </td>
                                    <td v-else>
										no-image
                                    </td>
                                    <td>{{ item.season }}</td>
                                    <td>{{ item._updated_at | moment('from', 'now') }}</td>
                                    <td justify="center">
                                        <v-layout align-center>
                                            <v-btn icon class="mx-0" :to="`/admin/competitions/${item.id}`" :id="item.id">
                                                <v-icon color="teal">mdi-pencil</v-icon>
                                            </v-btn>
                                            <v-btn icon class="mx-0" @click="requestDeleteConfirmation(item)">
                                                <v-icon color="pink">mdi-delete</v-icon>
                                            </v-btn>
                                        </v-layout>
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-data-table>

                    <!--<v-data-table :headers="headers" :items="loadedCompetitions" :show-select="false" class="elevation-1" :search="search">
                        <template v-slot:items="props">
                            <tr>
                                <td>{{ props.index + 1 }}</td>
                                <td class="text-xs-left">{{ props.item.name }}</td>
                                <td class="text-xs-left">{{ props.item.active }}</td>
                                <td class="text-xs-right" :value="props.item.active">
                                    <v-checkbox primary v-model="props.item.active" class="text-xs-right" @change="toggleCompetitionActiveStatus(props.item)"></v-checkbox>
                                </td>
                                <td class="text-xs-center" v-if="props.item.image"><img :src="'/images/competitions/' + props.item.image" height="40px" /></td>
                                <td v-else></td>
                                <td class="text-xs-left">{{ props.item.season }}</td>
                                <td class="text-xs-left">{{ props.item._updated_at | moment('from', 'now') }}</td>
                                <td class="justify-center px-0">
                                    <v-layout align-center>
                                        <v-btn icon class="mx-0" :to="`/admin/competitions/${props.item.id}`" :id="props.item.id">
                                            <v-icon color="teal">edit</v-icon>
                                        </v-btn>
                                        <v-btn icon class="mx-0" @click="requestDeleteConfirmation(props.item)">
                                            <v-icon color="pink">delete</v-icon>
                                        </v-btn>
                                    </v-layout>
                                </td>
                            </tr>
                        </template>
                        <template v-slot:no-results>
                            <v-alert :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                            </v-alert>
                        </template>
                    </v-data-table>-->
                </template>
            </v-card>
        </v-col>
        <!-- </v-flex> -->

        <h2 class="text-md-center mt-5">Noeud "Competitions" dans la base de données:</h2>
        <br />
        <!-- <v-flex xs12 sm10 offset-sm1> -->
        <v-col sm="10" offset-sm="1">
            <v-card>
                <json-editor :json="oldJSON" :onChange="onChange"></json-editor>
                <br />
                <div class="text-center">
                    <v-btn class="btn" :disabled="!changed || loading" @click="updateCompetition" color="success"><i v-bind:class="{'fa fa-spinner fa-spin' : loading}"></i>Sauver les changements</v-btn>
                </div>
                <br />
            </v-card>
            <!-- </v-flex> -->
        </v-col>

        <v-snackbar v-model="snackbar" :timeout="6000" :bottom="true">
            <span class="pa-2" style="font-size: 1.2em; line-height: 1.5em;">Are you sure you want to delete competition {{ this.competition.name }} ?</span>
            <v-btn color="pink" flat @click.stop="deleteCompetition">
                <span style="font-size: 1.3em;">Yes</span>
            </v-btn>
            <v-btn color="secondary" flat @click.stop="snackbar = false">
                <span style="font-size: 1.3em;">No</span>
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
	import '~/static/css/jsoneditor-tree.css'
	import Noty from 'noty'
	export default {
		layout: 'layoutBack',
		created() {
			this.$store.dispatch('competitions/fetchAllCompetitions')
			this.$store.dispatch('teams/fetchTeams')
		},
		data() {
			return {
				search: '',
				items: [
					{
						text: 'Dashboard',
						to: '/admin',
						disabled: false
					},
					{
						text: 'Competitions',
						to: '/admin/competitions',
						disabled: true
					}
				],
				headers: [
					{ text: 'N°', value: 'id', align: 'left', sortable: false },
					{ text: 'Name', value: 'name', align: 'left' },
					{ text: 'Slug', value: 'slug', align: 'left' },
					// { text: 'Countries', value: 'countries', align: 'left' },
					{ text: 'Active', value: 'active', align: 'left' },
					{ text: 'Image', value: 'image', align: 'left' },
					{ text: 'Season', value: 'season', align: 'left' },
					{
						text: 'Dernière modification',
						value: '_updated_at',
						align: 'left'
					},
					{ text: 'Actions', value: 'actions', sortable: false }
				],
				events: '',
				pagination: {
					sortBy: 'date',
					descending: true,
					rowsPerPage: 10
				},
				newJSON: '',
				// loadingCompetition: new Object(),
				competition: {},
				snackbar: false
			}
		},
		computed: {
			loading() {
				return this.$store.getters['loading']
			},
			loadedCompetitions() {
				return this.$store.getters['competitions/loadedAllCompetitions']
			},
			changed() {
				// console.log('changed!')
				if (this.newJSON && !_.isEqual(this.oldJSON, this.newJSON) ? true : false) {
					return true
				}
			},
			oldJSON() {
				// console.log(typeof this.loadedCompetitions)
				const arrayToObject = array =>
					array.reduce((obj, item) => {
						obj[item.slug] = item
						return obj
					}, {})
				const competitionObject = arrayToObject(this.loadedCompetitions)
				// console.log(competitionObject)
				return competitionObject
			}
		},
		methods: {
			toggleAll() {
				if (this.selected.length) {
					this.selected = []
				} else {
					this.selected = this.loadedCompetitions.slice()
				}
			},
			changeSort(column) {
				if (this.pagination.sortBy === column) {
					this.pagination.descending = !this.pagination.descending
				} else {
					this.pagination.sortBy = column
					this.pagination.descending = false
				}
			},
			requestDeleteConfirmation(competition) {
				this.competition = competition
				this.snackbar = true
			},
			async deleteCompetition() {
				try {
					this.snackbar = false
					await this.$store.dispatch('competitions/deleteCompetition', this.competition)
					new Noty({
						type: 'success',
						text: 'Successfully deleted competition &#128077;',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and the competition could not be deleted.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			onChange(newJson) {
				this.newJSON = newJson
			},
			toggleCompetitionActiveStatus(competition) {
				try {
					console.log('updateCompetitionActiveStatus: ', competition)
					this.$store.dispatch('competitions/toggleCompetitionActiveStatus', competition)
					new Noty({
						type: 'success',
						text: 'Competition status updated successfully!',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				} catch (error) {
					console.log('error: ', error)
					new Noty({
						type: 'error',
						text: 'An error occured and the competition status could not be updated.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			updateCompetition() {
				try {
					// console.log('updateCompetition called!')
					commit('setLoading', true, { root: true })
					const competitionData = this.newJSON
					this.$store.dispatch('competitions/updateCompetition', competitionData)
					commit('setLoading', false, { root: true })
					return this.$router.push('/admin/competitions')
				} catch (error) {
					commit('setLoading', false, { root: true })
					console.log('error: ', error)
				}
			}
		}
	}
</script>