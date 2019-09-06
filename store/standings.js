import * as firebase from "firebase/app"
import "firebase/database"

export const state = () => ({
    standingsByCompetition: {}
})

export const mutations = {
    setStandingsByCompetition (state, payload) {
        console.log('Call to setStanding mutation', payload)
        state.standingsByCompetition = Object.assign({}, state.standingsByCompetition, { [payload.competitionSlug]: payload.standings })
    },
    clearStandings (state) {
        state.standingsByCompeition = {}
    }
}

export const actions = {
    // Load specific competition standing
    fetchStandingsByCompetition ({commit}, payload) {
        console.log('Call to fetchStandingsByCompetition action', payload)
        // firebase.database().ref('/standings/' + payload.slug + '/standing').on('value', function (snapshot) {
        firebase.database().ref(`/standings/${payload}`).on('value', function (snapshot) {
            console.log('snapshot: ', snapshot.val())
            const standingsArray = []
            for (const key in snapshot.val()) {
                standingsArray.push({ ...snapshot.val()[key], id: key})
            }
            // const abc2 = { slug: payload, standing: standingArray }
            // console.log('abc2: ', abc2)
            commit('setStandingsByCompetition', { competitionSlug: payload, standings: standingsArray })
        })
    }
}

export const getters = {
    loadedStandingsByCompetition (state) {
        return state.standingsByCompetition
    }
}