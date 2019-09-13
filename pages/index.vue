<template>
    <v-app v-cloak style="background-color: #000;">
        <!-- <v-content> -->
            <!-- <v-container grid-list > -->
           	<v-container>
                <div class="fullpage-container" >
                    <div class="fullpage-wp" v-fullpage="opts" ref="fullpage"  id="scroll-target">
                        <!-- <div class="page-1 page" v-touch="{ up: () => onSwipe('up'), down: () => onSwipe('down') }" v-if="page === 1" v-scroll:#scroll-target="onScroll" > -->
                        <div class="page-1 page" v-scroll:#scroll-target="onScroll" >
                            <!-- <v-layout row wrap justify-center align-center class="upperHalf"> -->
							<v-row no-gutters justify="center" align="center" class="upperHalf">
                                <div class="buttonsUpperHalf">
                                    <v-btn color="default" @click.stop="openLoginModal">Login</v-btn>
                                    <v-btn color="default" @click.stop="openRegisterModal">Register</v-btn>
                                </div>
                                <v-btn rounded large color="black" nuxt to="/scoremode" class="white--text" style="z-index: 100;">Score mode</v-btn>
                                <span class="tifUpperHalf" style="z-index: 1;">TIF</span>
							</v-row>
                            <!-- </v-layout> -->
                            <!-- <v-layout justify-center align-center class="lowerHalf"> -->
							<v-row no-gutters justify="center" align="center" class="lowerHalf">
                                <span class="tifLowerHalf transform">TIF</span>
                                <v-btn rounded large color="black" nuxt to="/gamemode" class="white--text" style="z-index: 100;">Game mode</v-btn>
                            <!-- </v-layout> -->
							</v-row>
                        </div>

                        <!-- <div class="page-2 page" v-touch="{ up: () => onSwipe('up'), down: () => onSwipe('down') }" v-if="page === 2"> -->
                        <div class="page-2 page">
                            <h2 class="part-2" v-animate="{value: 'bounceInRight'}">Page 2 - How it works</h2>

                            <!-- <v-layout justify-center align-center class="my-2"> -->
							<v-row justify="center" align="center" class="my-2">
                                <!-- <v-flex xs12> -->
								<v-col>
                                    <!-- <p>loadedUser: {{ loadedUser }}</p> -->
                                    Ici on peut placer des informations supplémentaires sur notre application.<br /><br />
                                    <u>Par exemple:</u><br /><br />
                                    
                                        Nombre de joueurs<br />
                                        Nombre de sports<br />
                                        Nombre d'équipes<br />
                                        Règles du jeu<br />

                                <!-- </v-flex> -->
								</v-col>
                            <!-- </v-layout> -->
							</v-row>
                        </div>

                        <!-- <div class="page-3 page" v-touch="{ up: () => onSwipe('up'), down: () => onSwipe('down') }" v-if="page === 3"> -->
                        <div class="page-3 page">
                            <h2 class v-animate="{value: 'bounceInTop'}">Page 3 - Contact us</h2>
                        </div>
                    </div>
                </div>
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
        <!-- </v-content> -->
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
		mounted() {
			// this.$store.commit('openLoginModal')
		},
		data() {
			return {
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
				forgotPasswordModal: false,
				page: 1
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
			onScroll (e) {
        this.offsetTop = e.target.scrollTop
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
		/* background: var(--v-primary-base); */
		/* background: yellow; */
		background: var(--v-primary-base);
	}
	.page-2 {
		padding-top: 50px;
		/* background: var(--v-primary-base); */
		background: #fff;
	}
	.page-3 {
		padding-top: 50px;
		/* background: var(--v-primary-base); */
		background: yellow;
	}
	.v-btn:before {
		z-index: 1000;
	}

	.buttonsUpperHalf {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 100;
	}
	.upperHalf {
		height: 50%;
		background: var(--v-primary-color);
		position: relative;
		/* z-index: 1; */
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
		z-index: 1000;
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