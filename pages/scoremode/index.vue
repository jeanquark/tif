<template>
    <!-- <v-container fluid fill-height style="padding: 0px; max-width: 1017px;"> -->
    <v-container style="padding: 0px; max-width: 1017px;">
        <v-row no-gutters>
            <v-col cols="12" style="background: #EEEEEE;">
                <scoremode-header />

                <!-- loadedAllEventsByDay: {{ loadedAllEventsByDay }}<br /><br /> -->
                <!-- loading: {{ loading }}<br /><br /> -->
                <!-- eventsByDay: {{ eventsByDay }}<br /><br /> -->
                <!-- loadedCompetitionsByCountry: {{ loadedCompetitionsByCountry }}<br /><br /> -->
                <!-- selectedConfederation: {{ selectedConfederation }}<br /><br /> -->
                <!-- selectedCountry: {{ selectedCountry }}<br /><br /> -->
                <!-- selectedCompetition.slug: {{ selectedCompetition.slug }}<br /><br /> -->
                <!-- active_round_tab: {{ active_round_tab }}<br /><br /> -->
                <!-- loadedEventsByDateByCompetition: {{ loadedEventsByDateByCompetition }}<br /><br /> -->
                <!-- loadedEventsByCompetitionByRound: {{ loadedEventsByCompetitionByRound }}<br /><br /> -->
                <!-- <v-btn small class="success" @click="toggleEvents">{{ eventsByDay ? 'Events by round' : 'Events by day' }}</v-btn> -->
                <!-- loadedActiveCompetitions: {{ loadedActiveCompetitions }}<br /><br /> -->
                <!-- loadedCompetitionsByDate: {{ loadedCompetitionsByDate }}<br /><br /> -->
                <!-- loadedCompetitions: {{ loadedCompetitions }}<br /><br /> -->
                <!-- selectedDate: {{ selectedDate }}<br /><br /> -->
                <!-- selectedCompetition: {{ selectedCompetition }}<br /><br /> -->
                <!-- expandedPanel: {{ expandedPanel }}<br /><br /> -->
                <!-- loadedEventsByDateByCompetition: {{ loadedEventsByDateByCompetition }}<br /><br /> -->

                <!-- <div style="height: 200px;"></div> -->
                <!-- <v-row no-gutters style="border: 2px solid green;" v-if="eventsByDay"> -->
                <!-- <v-col> -->

                <v-row no-gutters class="mt-5">
                    <v-col cols="12" class="my-2">
                        <h3 class="text-center" v-if="eventsByDate">Events by day</h3>
                        <h3 class="text-center" v-if="eventsByRound">Events by round</h3>
                    </v-col>
                    <events-by-date @switchToRound="onSwitchToRound" v-if="eventsByDate" />
                    <events-by-round @switchToDate="onSwitchToDate" v-if="eventsByRound" />
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import moment from 'moment'
import ScoremodeHeader from '~/components/ScoremodeHeader'
import EventsByDate from '~/components/events/EventsByDate'
import EventsByRound from '~/components/events/EventsByRound'
import { ContentLoader } from 'vue-content-loader'
import slugify from '~/helpers/slugify'

export default {
    components: { ScoremodeHeader, EventsByDate, EventsByRound, ContentLoader },
    layout: 'layoutScoreMode',
    async created() {
        this.eventsByDate = this.$store.getters['loadedActiveTab'] === 'date'
        this.eventsByRound = this.$store.getters['loadedActiveTab'] === 'round'
    },
    data() {
        return {
            eventsByDate: true,
            eventsByRound: false
        }
    },
    computed: {
        loading() {
            return this.$store.getters['loading']
        },
        loadedUserTeams() {
            return this.$store.getters['userTeams/loadedUserTeams']
        },
        loadedCompetitions() {
            // return this.$store.getters['competitions/loadedCompetitions'].filter(competition => competition.active === true)
            return this.$store.getters['competitions/loadedCompetitions']
        }
    },
    methods: {
        onSwitchToRound(competition) {
            console.log('onSwitchToRound: ', competition)
            this.eventsByDate = false
            this.eventsByRound = true
            // this.selectedCompetition = competition
            this.$store.commit('setActiveTab', 'round')
            // this.$store.commit('setActiveRoundTab', 2)
            this.$store.commit('setActiveCompetition', competition)
        },
        onSwitchToDate() {
            console.log('onSwitchToDate')
            this.eventsByRound = false
            this.eventsByDate = true
            this.$store.commit('setActiveTab', 'date')
        }
    }
}
</script>

<style scoped></style>
