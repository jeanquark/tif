<template>
    <v-card class="elevation-12">
        <v-card-title justify="center" align="center" class="primary white--text mb-4">
			Login
        </v-card-title>
        <v-card-text class="card-text">
            <v-form>
                <v-alert
			      prominent
			      type="error"
			      v-if="loadedError"
			    >
			    	{{ $t(`auth-validation-rules.${loadedError.code}`) }}
			    </v-alert>

                <v-text-field prepend-icon="mdi-account" name="email" label="Email" type="email" v-model="form.email"></v-text-field>
                <v-text-field prepend-icon="mdi-lock" id="password" name="password" label="Password" type="password" v-model="form.password"></v-text-field>
            </v-form>
        </v-card-text>
        <v-card-actions class="card-actions">
			<v-row no-gutters justify="center">
				<v-col cols="12" class="text-center mb-3">
                    <v-btn color="success" :loading="loadingSignIn" @click="signUserIn">Login</v-btn>
				</v-col>
				<v-col cols="12" sm="6" class="text-center pa-2">
                    <v-btn block color="#df4a32" class="white--text" :loading="loadingGoogle" @click="signInWithGoogle">Login with Google&nbsp;
                        <font-awesome-icon :icon="['fab', 'google']" />
                    </v-btn>
				</v-col>
				<v-col cols="12" sm="6" class="text-center pa-2">
                    <v-btn block color="#3c5a99" class="white--text" :loading="loadingFacebook" @click="signInWithFacebook">Login with Facebook&nbsp;
                        <font-awesome-icon :icon="['fab', 'facebook-f']" />
                    </v-btn>
				</v-col>

                <v-btn text color="primary" class="mt-3" @click.stop="switchToRegister">
                    Switch to register
                </v-btn>

                <v-btn text color="default" class="mt-3" @click.stop="closeLoginModal">Cancel</v-btn>

			</v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
	import Noty from 'noty'
	export default {
		mounted() {
			this.$store.commit('clearError')
		},
		data() {
			return {
				form: {
					email: '',
					password: ''
				},
				loadingSignIn: false,
				loadingGoogle: false,
				loadingFacebook: false
			}
		},
		computed: {
			loadedError() {
				return this.$store.getters['loadedError']
			}
		},
		methods: {
			async signUserIn() {
				try {
					this.loadingSignIn = true
					await this.$store.dispatch('firebase-auth/signUserIn', this.form)
					this.$router.replace('/gamemode')
					this.$store.commit('closeLoginModal')
				} catch (error) {
					this.loadingSignIn = false
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and you could not log in.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			async signInWithGoogle() {
				try {
					this.loadingGoogle = true
					await this.$store.dispatch('firebase-auth/signInWithGooglePopup')
					this.$router.replace('/gamemode')
					this.$store.commit('closeLoginModal')
				} catch (error) {
					this.loadingGoogle = false
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and you could not log in.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			async signInWithFacebook() {
				try {
					this.loadingFacebook = true
					await this.$store.dispatch('firebase-auth/signInWithFacebookPopup')
					this.$router.replace('/gamemode')
					this.$store.commit('closeLoginModal')
				} catch (error) {
					this.loadingFacebook = false
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and you could not log in.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			closeLoginModal() {
				return this.$store.commit('closeLoginModal')
			},
			switchToRegister() {
				this.$store.commit('closeLoginModal')
				this.$store.commit('openRegisterModal')
			}
		}
	}
</script>

<style scoped>
	.card-title {
		background: var(--v-primary-base);
		color: #fff;
	}
</style>