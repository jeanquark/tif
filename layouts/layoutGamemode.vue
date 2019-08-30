<template>
	<v-app id="app">
		<v-content v-if="loadingPage">
			<div class="loader"></div>
		</v-content>

		<v-content v-else style="">
			<nuxt/>
		</v-content>
	</v-app>
</template>

<script>
	export default {
		head: {
			titleTemplate: '%s - This Is Fan',
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },

				// hid is used as unique identifier. Do not use `vmid` for it as it will not work
				{ hid: 'description', name: 'description', content: 'An application for real fans - Get live results - Play the game - Support your team - Interact with other supporters - Become the ultimate fan' },
				{ name: "robots", content: "noindex" },
			],
			link: [
				{ rel: 'manifest', href: '/manifest.json' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Acme' }
			]
		},
		middleware: ['auth-check'],
		created () {
			setTimeout(() => {
			  	this.loadingPage = false
			}, 100)
		},
		mounted() {
			// console.log(Notification.permission)
			// if (Notification.permission === 'granted') {
	
			// }
			// if ("serviceWorker" in navigator) {
			// 	window.addEventListener('load', function(registration) {
			// 		navigator.serviceWorker
			// 			.register("/sw.js")
			// 			.then(function() {
			// 				console.log("Service worker registered with scope: ", registration);
			// 			})
			// 			.catch(function(err) {
			// 				console.log(err);
			// 			});
			// 	})
			// }
		},
		data () {
			return {
				loadingPage: true,
			}
		},
		computed: {
			loadedUser() {
            	return this.$store.getters['users/loadedUser']
        	}
		}
	}
</script>

<style scoped>
	#app {
		font: normal 100%/1 "Acme", Helvetica, sans-serif;
	}
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

