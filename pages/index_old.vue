<template>
    <v-app v-cloak style="background-color: #000;">
        <v-content>
            <v-container fluid class="fill-height" style="background: yellow;" v-if="page === 1">
                <v-row no-gutters justify="center" align="center" class="white--text" style="border: 1px dashed #000; height: 100%;" v-touch="{ up: () => onSwipe('up'), down: () => onSwipe('down') }">
                    Page 1
					<v-btn rounded color="black" class="white--text" nuxt to="/scoremode">Scoremode</v-btn>
                </v-row>
            </v-container>
            <v-container fluid class="fill-height" style="background: pink;" v-if="page === 2">
                <v-row no-gutters justify="center" align="center" class="white--text" style="border: 1px dashed #000; height: 100%;" v-touch="{ up: () => onSwipe('up'), down: () => onSwipe('down') }">
                    Page 2
                </v-row>
            </v-container>
            <v-container fluid class="fill-height" style="background: orangered;" v-if="page === 3">
                <v-row no-gutters justify="center" align="center" class="white--text" style="border: 1px dashed #000; height: 100%;" v-touch="{ up: () => onSwipe('up'), down: () => onSwipe('down') }">
                    Page 3
                </v-row>
            </v-container>

            <!-- Login Modal -->
            <v-dialog :value="loginModal" width="500" :persistent="true">
                <Login />
            </v-dialog>

            <!-- Register Modal -->
            <v-dialog v-model="registerModal" width="750" :persistent="true">
                <Register />
            </v-dialog>

            <!-- Forgot Password Modal -->
            <v-dialog v-model="forgotPasswordModal" width="750">
                <ForgotPassword />
            </v-dialog>
        </v-content>
    </v-app>
</template>

<script>
	import Noty from 'noty'
	import Login from '~/components/auth/Login'
	import Register from '~/components/auth/Register'
	import ForgotPassword from '~/components/auth/ForgotPassword'
	export default {
		$_veeValidate: {
			validator: 'new' // Provide new validator scope.
		},
		components: { Login, Register, ForgotPassword },
		beforeMount () {
  window.addEventListener('scroll', this.onScroll);
},
beforeDestroy () {
  window.removeEventListener('scroll', this.onScroll);
},
		mounted() {
			// this.$store.commit('openLoginModal')
			new Noty({
				type: 'success',
				text: 'Welcome!',
				timeout: 5000,
				theme: 'metroui'
			}).show()
		},
		data() {
			return {
				page: 1,
				opts: {
					start: 0,
					dir: 'v',
					loop: false,
					duration: 300,
					beforeChange: function(ele, current, next) {
						this.index = next
					},
					afterChange: function(ele, current) {
						this.index = current
					}
				},
				forgotPasswordModal: false
			}
		},
		computed: {
			loadedUser() {
				return this.$store.getters['users/loadedUser']
			},
			loginModal() {
				return this.$store.getters['loginModal']
			},
			registerModal() {
				return this.$store.getters['registerModal']
			}
		},
		methods: {
			onScroll() {
				console.log('onScroll!')
			},
			onSwipe(direction) {
				console.log('direction: ', direction)
				// this.swipeDirection = direction
				if (direction === 'down' && this.page > 1) {
					this.page -= 1
				} else if (direction === 'up' && this.page < 3) {
					this.page += 1
				}
			},
			openLoginModal() {
				this.$validator.reset() // Clear validator errors
				this.$store.commit('clearError')
				this.$store.commit('setLoading', false)
				this.$store.commit('openLoginModal')
			},
			closeLoginModal() {
				this.$store.commit('closeLoginModal')
			},
			openRegisterModal() {
				this.$validator.reset() // Clear validator errors
				this.$store.commit('clearError')
				this.$store.commit('setLoading', false)
				this.$store.commit('openRegisterModal')
			},
			closeRegisterModal() {
				this.$store.commit('closeRegisterModal')
			},
			switchToForgotPassword() {
				this.$store.commit('closeLoginModal')
				this.forgotPasswordModal = true
			}
		}
	}
</script>

<style scoped>
	[v-cloak] {
		display: none;
	}
	body {
		margin: 0;
	}
	.fullpage-container {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
	.page {
		display: block;
		max-width: 1000px;
		text-align: center;
		font-size: 14px;
		color: #000;
	}
	.page-1 {
		background: var(--v-primary-base);
	}
	.page-2 {
		padding-top: 50px;
		/* background: var(--v-primary-base); */
		background: #fff;
	}
	.page-3 {
		padding-top: 50px;
		background: var(--v-primary-base);
	}

	.buttonsUpperHalf {
		position: absolute;
		top: 10px;
		left: 10px;
	}
	.upperHalf {
		height: 50%;
		background: var(--v-primary-color);
		position: relative;
	}
	.lowerHalf {
		height: 50%;
		background: #fff;
		position: relative;
	}
	.tifUpperHalf {
		position: absolute;
		bottom: 0;
		margin-bottom: -46px;
		padding: 0px;
		width: 100%;
		font-family: 'Acme';
		font-size: 8em;
		font-weight: 700;
		color: #000;
		letter-spacing: 3px;
	}
	.tifLowerHalf {
		position: absolute;
		top: 0;
		margin-top: -46px;
		padding: 0px;
		width: 100%;
		font-family: 'Acme';
		font-size: 8em;
		font-weight: 700;
		letter-spacing: 3px;
		color: #000;
	}
	.transform {
		transform: scaleY(-1);
		-moz-transform: scaleY(-1);
		-o-transform: scaleY(-1);
		-webkit-transform: scaleY(-1);
		-webkit-mask-image: -webkit-gradient(linear, right top, right bottom, from(transparent), color-stop(20%, transparent), to(rgba(230, 81, 0, 0.3)));
	}
</style>
