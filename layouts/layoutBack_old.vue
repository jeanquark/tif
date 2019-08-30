<template>
    <div>
        <v-app v-if="loadingPage">
			<div class="loader"></div>
            <!-- <main>
                <v-container fill-height>
                    <v-layout align-center justify-center>
                        <v-container fill-height>
                            <v-layout align-center justify-center>
                                <v-progress-circular indeterminate color="primary" :size="150"></v-progress-circular>
                            </v-layout>
                        </v-container>
                    </v-layout>
                </v-container>
            </main> -->
        </v-app>
        <v-app v-else>
            <v-navigation-drawer fixed :clipped="$vuetify.breakpoint.lgAndUp" app v-model="drawer">
                <v-list dense>
                    <template v-for="item in items">
                        <v-layout row v-if="item.heading" align-center :key="item.heading">
                            <v-flex xs6>
                                <v-subheader v-if="item.heading">
                                    {{ item.heading }}
                                </v-subheader>
                            </v-flex>
                            <v-flex xs6 class="text-xs-center">
                                <a href="#!" class="body-2 black--text">EDIT</a>
                            </v-flex>
                        </v-layout>
                        <v-list-group v-else-if="item.children" v-model="item.model" :key="item.text" :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
                            <v-list-tile slot="activator">
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ item.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile v-for="(child, index) in item.children" :key="index">
                                <v-list-tile-action v-if="child.icon">
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-tile-action>
                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        {{ child.text }}
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                        <v-list-tile v-else :key="item.text" :to="item.to" :exact="item.exact">
                            <v-list-tile-action>
                                <!-- <v-icon style="padding-bottom: 5px;">{{ item.icon }}</v-icon> -->
                                <font-awesome-icon :icon="['fas', item.icon ]" class="icon" />
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                    <!-- <nuxt-link class="" :to="item.to">{{ item.text }}</nuxt-link> -->
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </template>
                </v-list>
            </v-navigation-drawer>

            <v-toolbar color="primary" dark app :clipped-left="$vuetify.breakpoint.lgAndUp" fixed class="my-0 py-0">
                <v-toolbar-title style="width: 300px" class="ml-0 pl-0">
                    <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                    <!-- <span class="hidden-sm-and-down" @click="backToSite">Retour au site</span> -->
                    <v-btn color="success" class="hidden-sm-and-down" @click="backToSite">Back to site</v-btn>
                    <v-icon class="hidden-md-and-up" @click="backToSite">arrow_back</v-icon>
                    <!-- <nuxt-link class="hidden-sm-and-down" to="/" style="color: #fff;">Retour au site</nuxt-link> -->
                </v-toolbar-title>
                <!-- <v-text-field
				  flat
				  solo-inverted
				  prepend-icon="search"
				  label="Search"
				  class="hidden-sm-and-down"
				></v-text-field> -->
                <v-spacer></v-spacer>
                <span v-if="user">{{ user.email }}</span>
                <v-btn icon>
                    <v-icon>apps</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>notifications</v-icon>
                </v-btn>
                <v-btn color="info" @click="logout">Logout</v-btn>
                <v-btn icon large>
                    <v-avatar size="32px" tile>
                        <img src="https://vuetifyjs.com/apple-touch-icon-180x180.png" alt="Vuetify">
                    </v-avatar>
                </v-btn>
            </v-toolbar>
            <v-content>
                <nuxt />
            </v-content>
        </v-app>
    </div>
</template>

<script>
	export default {
		head: {
			meta: [{ name: 'robots', content: 'noindex' }],
			link: []
		},
		// middleware: ['admin-check'],
		middleware: ['auth-check'],
		created() {
			setTimeout(() => {
				this.loadingPage = false
			}, 1000)
		},
		// mounted() {
		// 	console.log(Notification.permission)
		// 	if (Notification.permission === 'granted') {
		// 	}
		// 	if ('serviceWorker' in navigator) {
		// 		window.addEventListener('load', function(registration) {
		// 			navigator.serviceWorker
		// 				.register('/sw.js')
		// 				.then(function() {
		// 					console.log(
		// 						'Service worker registered with scope: ',
		// 						registration.scope
		// 					)
		// 				})
		// 				.catch(function(err) {
		// 					console.log(err)
		// 				})
		// 		})
		// 	}
		// },
		data() {
			return {
				dialog: false,
				drawer: null,
				loadingPage: true,
				items: [
					{ icon: 'th', text: 'Dashboard', to: '/admin', exact: true },
					{
						icon: 'users',
						text: 'Users',
						to: '/admin/users',
						exact: false
					},
					{
						icon: 'list-ol',
						text: 'Competitions',
						to: '/admin/competitions',
						exact: false
					},
					{
						icon: 'flag',
						text: 'Teams',
						to: '/admin/teams',
						exact: false
					},
					{
						icon: 'user-plus',
						text: 'Players',
						to: '/admin/players',
						exact: false
					},
					{
						icon: 'building',
						text: 'Stadiums',
						to: '/admin/stadiums',
						exact: false
					},
					{
						icon: 'calendar',
						text: 'Events',
						to: '/admin/events',
						exact: false
					},
					{
						icon: 'language',
						text: 'Translation',
						to: '/admin/translations',
						exact: false
					},
					{
						icon: 'database',
						text: 'API',
						to: '/admin/api',
						exact: false
					}
				]
			}
		},
		computed: {
			user() {
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
	    animation: spin .5s linear infinite;
	}
	@keyframes spin {
	    0% { transform: rotate(0deg); }
	    100% { transform: rotate(360deg); }
	}
</style>

