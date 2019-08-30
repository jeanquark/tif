<template>
    <v-toolbar dark color="blue">
        <!-- <v-toolbar-side-icon to="/"></v-toolbar-side-icon> -->
        <!-- <v-icon to="/" class="icon">home</v-icon> -->
        <v-btn text icon to="/gamemode">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
        GAMEMODE
        <v-spacer></v-spacer>
        <!-- loadedUser: {{ loadedUser }} -->
        <!-- <v-img :src="loadedUser.picture" max-width="20"></v-img> -->
		<v-btn small class="mx-1" color="primary" nuxt to="/competitions">Competitions</v-btn>
        <v-btn small class="mx-1" color="success" nuxt to="/teams">Teams</v-btn>
        <v-btn small class="mx-1" color="info" nuxt to="/user/events">Events</v-btn>
        <v-btn small class="mx-1" color="warning" nuxt to="/admin">Admin (resticted area)</v-btn>
        <v-btn small class="mx-1" color="error" @click="logout">Logout</v-btn>
        <v-btn icon class="mx-1" large nuxt to="/user/avatar" v-if="loadedUser">
            <v-avatar size="42px">
                <img :src="loadedUser.picture" alt="avatar picture">
            </v-avatar>
        </v-btn>
    </v-toolbar>
</template>

<script>
	import firebase from 'firebase/app'
	export default {
		data() {
			return {}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			}
		},
		methods: {
			async logout() {
				console.log('logout')
				await this.$store.dispatch('firebase-auth/signOut')
				this.$router.push('/')
			}
		}
	}
</script>

<style scoped>
</style>