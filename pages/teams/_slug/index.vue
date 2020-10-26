<template>
    <v-container style="padding: 0px; max-width: 1017px;">
        <v-row no-gutters>
            <v-col cols="12" style="background: #EEEEEE;">
                <scoremode-header />
                <v-row no-gutters class="mt-5">
                    <h2 class="">{{ team.name }}</h2>
                    {{ team }}
                </v-row>
        	</v-col>
        </v-row>
    </v-container>
</template>

<script>
	import ScoremodeHeader from '~/components/ScoremodeHeader'
	export default {
        components: { ScoremodeHeader },
		layout: 'layoutScoreMode',
		async created() {
            console.log('slug: ', this.$route.params.slug)
            const abc = await this.$store.dispatch('teams/fetchTeam', this.$route.params.slug)
            console.log('abc: ', abc)
		},
		data() {
			return {
			}
		},
		computed: {
            team () {
                return this.$store.getters['teams/loadedTeam']
            }
		},
		methods: {

		}
	}
</script>

<style scoped>
	.hover {
		border: 2px solid var(--v-primary-base);
		cursor: pointer;
	}
	.selected {
		background: var(--v-primary-lighten4);
	}
</style>
