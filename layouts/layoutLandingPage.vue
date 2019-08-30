<template>
    <v-app>
        <v-content v-if="loadingPage">
            <div class="loader"></div>
        </v-content>
        <v-content v-else>
            <nuxt />

        </v-content>
    </v-app>
</template>

<script>
	export default {
		head: {
			title: 'Welcome - This Is Fan',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },

				// hid is used as unique identifier. Do not use `vmid` for it as it will not work
				{
					hid: 'description',
					name: 'description',
					content: 'An application for real fans - Get live results - Play the game - Support your team - Interact with other supporters - Become the ultimate fan'
				},
				{ name: 'robots', content: 'noindex' }
			]
		},
		// middleware: ['unauth-check'],
		created() {
			setTimeout(() => {
				this.loadingPage = false
			}, 100)
		},
		data() {
			return {
				loadingPage: true
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

