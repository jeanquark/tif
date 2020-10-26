<template>
    <div>
        <v-breadcrumbs :items="links">
            <template v-slot:item="props">
                <v-breadcrumbs-item :to="props.item.to" nuxt exact :disabled="props.item.disabled">
                    {{ props.item.text }}
                </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
                <v-icon>mdi-chevron-right</v-icon>
            </template>
        </v-breadcrumbs>

        <v-col sm="10" offset-sm="1" v-if="qrName">
            <v-card class="text-sm-center py-3">
                <v-card-title class="justify-center">
                    QR Code Image:
                </v-card-title>
                <v-card-text>
                    <vue-qr :bgSrc="bgSrc" :logoSrc="logoSrc" :text="qrLink" :whiteMargin="true" :size="300" :autoColor="false" :callback="generateBase64Image"></vue-qr>
                    <br />
                    <a :download="qrName" :href="qrBase64Image">Télécharger</a>
                </v-card-text>
            </v-card>
        </v-col>

        <v-col sm="10" offset-sm="1">
            <h1 class="text-center my-2">Teams</h1>

            <v-btn color="primary" dark slot="activator" class="mb-3 ml-0" to="/admin/teams/create">
                Add a new team
            </v-btn>
            <v-card>
                <v-card-title>
                    <div class="flex-grow-1"></div>
                    <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                </v-card-title>

                <template>
                    <v-data-table :headers="headers" :items="loadedTeams" :items-per-page="5" :search="search" class="elevation-1">
                        <template v-slot:body="{ items }">
                            <tbody>
                                <tr v-for="(item, index) in items" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td><router-link :to="`/teams/${item.slug}`">{{ item.name }}</router-link></td>
                                    <td>{{ item.slug }}</td>
                                    <td class="text-center" :value="item.active">
                                        <v-checkbox color="success" v-model="item.active" class="text-center" @change="toggleTeamActiveStatus(item)"></v-checkbox>
                                    </td>
                                    <td class="text-center" v-if="item.image">
                                        <img :src="`/images/teams/${item.image}`" height="40px" />
                                    </td>
                                    <td v-else>
                                        no-image
                                    </td>
                                    <td>{{ item._updated_at | moment('from', 'now') }}</td>
                                    <td justify="center">
                                        <v-layout align-center>
                                            <v-btn color="primary" small @click="generateQrCode(item)">QRCode</v-btn>
                                            <v-btn icon class="mx-0" :to="`/admin/teams/${item.id}`" :id="item.id">
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
                </template>
            </v-card>
        </v-col>

        <h2 class="text-md-center mt-5">Noeud "Teams" dans la base de données:</h2>
        <br />
        <v-col sm="10" offset-sm="1">
            <v-card>
                <json-editor :json="oldJSON" :onChange="onChange"></json-editor>
                <br />
                <div class="text-center">
                    <v-btn class="btn" :disabled="!changed || loading" @click="updateTeam" color="success"><i v-bind:class="{ 'fa fa-spinner fa-spin': loading }"></i>Sauver les changements</v-btn>
                </div>
                <br />
            </v-card>
        </v-col>

        <v-snackbar v-model="snackbar" :timeout="6000" :bottom="true">
            <span class="pa-2" style="font-size: 1.2em; line-height: 1.5em;">Are you sure you want to delete team {{ this.team.name }} ?</span>
            <v-btn color="pink" flat @click.stop="deleteTeam">
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
import VueQr from 'vue-qr'
export default {
    components: { VueQr },
    layout: 'layoutBack',
    created() {
        if (!this.$store.getters['teams/loadedTeams'] || this.$store.getters['teams/loadedTeams'].length < 1) {
            this.$store.dispatch('teams/fetchTeams')
        }
        // this.$store.dispatch('teams/fetchTeams')
    },
    data() {
        return {
            search: '',
            links: [
                {
                    text: 'Dashboard',
                    to: '/admin',
                    disabled: false
                },
                {
                    text: 'Teams',
                    to: '/admin/teams',
                    disabled: true
                }
            ],
            headers: [
                { text: 'N°', value: 'id', align: 'left', sortable: false },
                { text: 'Name', value: 'name', align: 'left' },
                { text: 'Slug', value: 'slug', align: 'left' },
                { text: 'Active', value: 'active', align: 'left' },
                { text: 'Image', value: 'image', align: 'left' },
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
            // loadingTeam: new Object(),
            team: {},
            snackbar: false,
            bgSrc: '',
            logoSrc: '',
            qrLink: '',
            qrBase64Image: '',
            qrName: ''
        }
    },
    computed: {
        loading() {
            return this.$store.getters['loading']
        },
        loadedTeams() {
            return this.$store.getters['teams/loadedTeams']
        },
        changed() {
            // console.log('changed!')
            if (this.newJSON && !_.isEqual(this.oldJSON, this.newJSON) ? true : false) {
                return true
            }
        },
        oldJSON() {
            // console.log(typeof this.loadedTeams)
            const arrayToObject = array =>
                array.reduce((obj, item) => {
                    obj[item.slug] = item
                    return obj
                }, {})
            if (this.loadedTeams) {
                const teamObject = arrayToObject(this.loadedTeams)
                // console.log(teamObject)
                return teamObject
            }
            return
        }
    },
    methods: {
        generateQrCode(team) {
            this.bgSrc = '/images/qrcode.jpg'
            this.logoSrc = `/images/teams/${team.image}`
            this.qrLink = `https://thisisfan.com/teams/${team.slug}`
            this.qrName = team.image
        },
        generateBase64Image(base64Image) {
            console.log('generateBase64Image: ', base64Image)
            this.qrBase64Image = base64Image
        },
        toggleAll() {
            if (this.selected.length) {
                this.selected = []
            } else {
                this.selected = this.loadedTeams.slice()
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
        requestDeleteConfirmation(team) {
            this.team = team
            this.snackbar = true
        },
        async deleteTeam() {
            try {
                this.snackbar = false
                await this.$store.dispatch('teams/deleteTeam', this.team)
                new Noty({
                    type: 'success',
                    text: 'Successfully deleted team &#128077;',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            } catch (error) {
                new Noty({
                    type: 'error',
                    text: 'Sorry, an error occured and the team could not be deleted.',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            }
        },
        onChange(newJson) {
            this.newJSON = newJson
        },
        async toggleTeamActiveStatus(team) {
            try {
                console.log('updateTeamActiveStatus: ', team)
                // return
                // await axios.post('/update-active-teams', team)
                console.log('this.loadedTeams: ', this.loadedTeams)
                // return
                await this.$store.dispatch('teams/toggleTeamActiveStatus', { team, teams: this.loadedTeams })
                new Noty({
                    type: 'success',
                    text: 'Team status updated successfully!',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            } catch (error) {
                console.log('error: ', error)
                new Noty({
                    type: 'error',
                    text: 'An error occured and the team status could not be updated.',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            }
        },
        updateTeam() {
            try {
                // // console.log('updateTeam called!')
                // commit('setLoading', true, { root: true })
                // const teamData = this.newJSON
                // this.$store.dispatch('teams/updateTeam', teamData)
                // commit('setLoading', false, { root: true })
                // return this.$router.push('/admin/teams')
            } catch (error) {
                // commit('setLoading', false, { root: true })
                // console.log('error: ', error)
            }
        }
    }
}
</script>
