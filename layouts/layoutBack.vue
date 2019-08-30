<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" app>
            <v-list dense>
                <v-list-item :to="item.to" :exact="item.exact" v-for="(item, index) in items" :key="index">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <!-- <v-toolbar-title>TIF</v-toolbar-title> -->
			<v-btn small color="success" nuxt to="/gamemode" class="ml-2">
				<v-icon class="mr-2">mdi-arrow-left</v-icon>
				To the site
			</v-btn>
            <v-spacer></v-spacer>
            <v-btn small color="primary" class="mr-2" @click="logout">Logout</v-btn>
            <v-btn icon large>
                <v-avatar size="32px" tile>
                    <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="Vuetify">
                </v-avatar>
            </v-btn>
        </v-app-bar>

        <v-content>
			<nuxt />
            <!-- <v-container class="fill-height" fluid>
                <v-row align="center" justify="center">
                    <v-col class="text-center">
                        
                    </v-col>
                </v-row>
            </v-container> -->
        </v-content>
        <v-footer color="indigo" app>
            <!-- <span class="white--text text-center">&copy; 2019</span> -->
			<v-row justify="center">
				<!-- <v-col cols="12"> -->
				<span class="white--text">&copy; TIF 2019</span>
				<!-- </v-col> -->
			</v-row>
        </v-footer>
    </v-app>
</template>

<script>
	export default {
		head: {
			meta: [{ name: 'robots', content: 'noindex' }],
			link: []
		},
		props: {
			source: String
		},
		// middleware: ['admin-check'],
		middleware: ['auth-check'],
		data() {
			return {
				drawer: null,
				items: [
					{
						icon: 'mdi-view-dashboard',
						text: 'Dashboard',
						to: '/admin',
						exact: true
					},
					{
						icon: 'mdi-account-group',
						text: 'Users',
						to: '/admin/users',
						exact: false
					},
					{
						icon: 'mdi-format-list-bulleted',
						text: 'Competitions',
						to: '/admin/competitions',
						exact: false
					},
					{
						icon: 'mdi-soccer',
						text: 'Teams',
						to: '/admin/teams',
						exact: false
					},
					{
						icon: 'mdi-stadium',
						text: 'Stadiums',
						to: '/admin/stadiums',
						exact: false
					},
					{
						icon: 'mdi-calendar',
						text: 'Events',
						to: '/admin/events',
						exact: false
					},
					{
						icon: 'mdi-translate',
						text: 'Translation',
						to: '/admin/translations',
						exact: false
					},
					{
						icon: 'mdi-database',
						text: 'API',
						to: '/admin/api',
						exact: false
					}
				]
			}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			}
		},
		methods: {
			backToSite() {
				this.$router.push('/gamemode')
			},
			async logout() {
				await this.$store.dispatch('firebase-auth/signOut')
				this.$router.push('/')
			}
		}
	}
</script>

<style scoped>
	.loader {
		position: fixed;
		border: 16px solid orangered;
		border-top: 16px solid #fff;
		border-radius: 50%;
		width: 120px;
		height: 120px;
		top: 50%;
		left: 50%;
		margin-top: -60px;
		margin-left: -60px;
		animation: spin 0.5s linear infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>