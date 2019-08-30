<template>
    <v-card class="elevation-12">
        <v-card-title align-center justify-center class="card-title">
            <h2 class="white--text">Pick a team</h2>
            <!-- event.id: {{ event.id }} -->
			<!-- message: {{ message }} -->
        </v-card-title>
        <v-card-text class="">
			<v-layout justify-center mt-2 mb-3>
				<span class="">{{ message }}</span>
			</v-layout>
            <v-layout row wrap>
                <v-flex xs6 class="text-xs-center">
                    <!-- <v-img :src="`/images/teams/${event.homeTeam_slug}.png`" max-width="100" class="text-xs-center"></v-img> -->
					<img :src="`/images/teams/${event.homeTeam_slug}.png`" width="100" /><br /><br />
					<span class="">{{ event.homeTeam_name }}</span><br />
					<v-btn small color="primary" @click.stop="selectTeam(event.homeTeam_slug, isFanHomeTeam = true)">Select</v-btn>
                </v-flex>
                <v-flex xs6 class="text-xs-center">
                    <!-- <v-img :src="`/images/teams/${event.visitorTeam_slug}.png`" max-width="100"></v-img><br /> -->
					<img :src="`/images/teams/${event.visitorTeam_slug}.png`" width="100" /><br /><br />
					<span class="">{{ event.visitorTeam_name }}</span><br />
					<v-btn small color="primary" @click.stop="selectTeam(event.visitorTeam_slug, isFanHomeTeam = false)">Select</v-btn>
                </v-flex>
            </v-layout>
			<v-layout row wrap justify-center mt-2>
				<v-btn small flat nuxt color="warning" to="/user/events">Cancel</v-btn>
				</v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
	import Noty from 'noty'
	export default {
		props: ['event', 'message'],
		mounted() {},
		data() {
			return {}
		},
		computed: {},
		methods: {
			selectTeam(teamSlug, isFanHomeTeam) {
				console.log('selectTeam: ', teamSlug)
				// console.log('event.id: ', this.event.id)
				this.$emit('selectSide', { eventId: this.event.id, teamId: teamSlug, isFanHomeTeam })
				// this.$store.dispatch('events/addUserToEvent', { eventId: event.id, teamId: teamSlug })
			}
		}
	}
</script>

<style scoped>
	.card-title {
		background: var(--v-primary-base);
	}
	.individual {
		background: yellow;
	}
	.collective {
		background: green;
	}
</style>