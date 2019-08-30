<template>
    <v-card class="elevation-12">
        <v-toolbar dark color="deep-orange">
            <h3 class="mr-2">Register</h3>
            <v-flex class="text-xs-right">
                <v-avatar color="white" class="subheading deep-orange--text" size="24" v-text="step"></v-avatar>
            </v-flex>
        </v-toolbar>

        <v-window v-model="step">
            <v-window-item :value="1">
                <v-card-text>
                    <v-text-field label="Email" name="email" v-validate="'required|email'" :error="errors.has('email')" :error-messages="errors.collect('email')" data-vv-as="Email" v-model="form.email"></v-text-field>
                    <span class="caption grey--text text--darken-1">
                        This is the email you will use to login to your ThisIsFan account
                    </span>
                </v-card-text>
            </v-window-item>

            <v-window-item :value="2">
                <v-alert type="error" :value="error" class="ma-4" v-if="error">
                    {{ $t(`auth-validation-rules.${error.code}`) }}
                </v-alert>
                <v-card-text>
                    <v-text-field label="Password" type="password" name="password" ref="password" v-validate="'required|min:6'" :error="errors.has('password')" :error-messages="errors.collect('password')" data-vv-as="Password" v-model="form.password"></v-text-field>

                    <v-text-field label="Repeat Password" type="password" name="password_confirm" v-validate="'required|confirmed:password'" :error="errors.has('password_confirm')" :error-messages="errors.collect('password_confirm')" data-vv-as="Repeat Password" v-model="form.password_confirm"></v-text-field>

                    <v-text-field label="Username" name="username" v-validate="'required|max:16'" :error="errors.has('username')" :error-messages="errors.collect('username')" data-vv-as="Username" v-model="form.username"></v-text-field>

                    <!-- <v-autocomplete
					    label="Select your birth year"
					    name="Birthyear"
					    :items="birthyears"
					    chips
					    color="blue-grey lighten-2"
					    item-text="value"
					    :return-object="true"
					    v-model="form.birthyear"
					></v-autocomplete> -->

                    <v-menu ref="menu" v-model="birthdayMenu" :close-on-content-click="false" :nudge-right="40" lazy transition="scale-transition" offset-y full-width min-width="290px">
                        <template v-slot:activator="{ on }">
                            <v-text-field v-model="form.birthday" label="Birthday date" readonly v-on="on"></v-text-field>
                        </template>
                        <v-date-picker ref="picker" v-model="form.birthday" :max="new Date().toISOString().substr(0, 10)" min="1920-01-01" @change="save"></v-date-picker>
                    </v-menu>

                    <v-autocomplete name="country" :items="loadedCountries" chips color="blue-grey lighten-2" label="Select your country" item-text="name" :return-object="true" v-validate="'required'" :error="errors.has('country')" :error-messages="errors.collect('country')" data-vv-as="Country" v-model="form.country">
                        <template slot="selection" slot-scope="data">
                            <v-chip :selected="data.selected" class="chip">
                                <v-avatar>
                                    <img :src="`/images/countries/${data.item.image}`">
                                </v-avatar>
                                {{ data.item.name }}
                            </v-chip>
                        </template>
                        <template slot="item" slot-scope="data">
                            <template v-if="typeof data.item !== 'object'">
                                <v-list-tile-content v-text="data.item"></v-list-tile-content>
                            </template>
                            <template v-else>
                                <v-list-tile-avatar>
                                    <img :src="`/images/countries/${data.item.image}`">
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                                </v-list-tile-content>
                            </template>
                        </template>
                    </v-autocomplete>

                </v-card-text>
            </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions>
            <!-- <v-layout row wrap justify-center> -->
			<v-row no-gutters justify="center">
                <!-- <v-flex xs12 text-xs-center> -->
				<v-col cols="12" class="text-center">
                    <v-btn text @click="step--" v-if="step !== 1">
                        Back
                    </v-btn>
                    <!-- <v-spacer></v-spacer> -->

                    <v-btn :disabled="errors.items.length > 0 || !form.password_confirm > 0 || !form.country > 0" :loading="loading" color="success" v-if="step === 2" @click.stop="signUserUp">
                        Register
                    </v-btn>

                    <v-btn color="success" @click="step++" v-if="step === 1">
                        Next
                    </v-btn>
                <!-- </v-flex> -->
				</v-col>
                <!-- <v-flex xs12 text-xs-center mt-3> -->
				<v-col cols="12" class="text-center mt-3">
					<v-btn text @click="switchToLogin" v-if="step === 1">
                        Switch to login
                    </v-btn>
                    <v-btn text color="primary" @click.stop="closeRegisterModal">
                        Cancel
                    </v-btn>
                <!-- </v-flex> -->
				</v-col>
			</v-row>
            <!-- </v-layout> -->
        </v-card-actions>
    </v-card>
</template>

<script>
	import firebase from 'firebase/app'
	import Noty from 'noty'
	export default {
		layout: 'layoutFront',
		created() {
			this.$store.commit('clearError')
			this.$store.dispatch('countries/fetchCountries')
		},
		async mounted() {},
		data: () => ({
			step: 1,
			form: {
				email: '',
				password: 'secret',
				password_confirm: 'secret',
				pseudo: 'jeanquark',
				birthday: '1984-02-28',
				country: null
			},
			// birthyears: [],
			// date: null,
			birthdayMenu: false
		}),
		computed: {
			loading() {
				return this.$store.getters['loading']
			},
			error() {
				return this.$store.getters['error']
			},
			currentTitle() {
				switch (this.step) {
					case 1:
						return 'Register'
					case 2:
						return 'Create a password'
					default:
						return 'Account created'
				}
			},
			loadedCountries() {
				return this.$store.getters['countries/loadedCountries']
			}
		},
		methods: {
			save(date) {
				this.$refs.menu.save(date)
			},
			async signUserUp() {
				try {
					console.log('signUserUp')
					console.log('this.form: ', this.form)
					this.$store.commit('setLoading', true, { root: true })
					// setTimeout(() => {
					// 	}, 2000)

					await this.$store.dispatch('firebase-auth/signUserUp', this.form)
					new Noty({
						type: 'success',
						text: 'Registration went successfully!',
						timeout: 5000,
						theme: 'metroui'
					}).show()
					this.$router.replace('/gamemode')
					this.$store.commit('setLoading', false, { root: true })
					this.$store.commit('closeRegisterModal')
				} catch (error) {
					console.log('error: ', error)
					this.$store.commit('setLoading', false, { root: true })
					new Noty({
						type: 'error',
						text: 'Sorry, an error occured and you could not register.',
						timeout: 5000,
						theme: 'metroui'
					}).show()
				}
			},
			switchToLogin() {
				this.$store.commit('closeRegisterModal')
				this.$store.commit('openLoginModal')
			},
			closeRegisterModal() {
				this.$store.commit('closeRegisterModal')
			}
		},
		watch: {
			birthdayMenu(val) {
				val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
			}
		}
	}
</script>

<style scoped>
</style>