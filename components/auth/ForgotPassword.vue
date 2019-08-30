<template>
	<v-card class="elevation-12">
		<v-toolbar
		    dark
		    color="primary"
		>
			<v-toolbar-title>Reset password</v-toolbar-title>
		</v-toolbar>
		<v-card-text>
			<v-form>
				<v-text-field
				    prepend-icon="person"
				    name="email"
				    label="Write your email"
				    type="text"
				    v-model="form.email"
				></v-text-field>
				<!-- <v-text-field id="password" prepend-icon="lock" name="password" label="Password" type="password"></v-text-field> -->
				<v-layout
				    justify-center
				    class="mb-2"
				>
					<v-btn
					    color="primary"
					    @click="resetPassword"
					>Reset</v-btn>
					<v-btn
					    color="secondary"
					    flat
					    nuxt
					    to="/"
					>Cancel</v-btn>
				</v-layout>
			</v-form>
		</v-card-text>
	</v-card>
</template>

<script>
	export default {
		created() {
			this.$store.commit('clearError')
			this.$store.commit('setLoading', false)
		},
		data() {
			return {
				form: {
					email: ''
				}
			}
		},
		computed: {},
		methods: {
			async resetPassword() {
				await this.$store.dispatch(
					'firebase-auth/resetPassword',
					this.form.email
				)
			}
		}
	}
</script>

<style scoped>
</style>