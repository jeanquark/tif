import * as firebase from "firebase/app";
import "firebase/database";
import Noty from 'noty'
import axios from 'axios'

export const state = () => ({
    // loadedStandings: []
    loadedStandings: {}
    // loadedStandings: {
    //     english_premier_league_2018_2019: [], 
    //     spanish_la_liga_2018_2019: [],
    //     italian_serie_a_2018_2019: [],
    //     german_bundesliga_2018_2019: [],
    //     french_league1_2018_2019: [],
    //     swiss_super_league_2018_2019: []
    // }
    // loadedStandings: [
    //     {
    //         name: 'La Liga',
    //         slug: 'spanish_la_liga_2018_2019',
    //         standing: [
    //             {
    //                 rank: 1,
    //                 name: 'Barcelona'
    //             },
    //             {
    //                 rank: 2,
    //                 name: 'Real Madrid'
    //             }
    //         ]
    //     },
    //     {
    //         name: 'Premier League',
    //         slug: 'english_premier_league_2018_2019',
    //         standing: [
    //             {
    //                 rank: 1,
    //                 name: 'Manchester City'
    //             },
    //             {
    //                 rank: 2,
    //                 name: 'Liverpool'
    //             }
    //         ]
    //     }
    // ]
})

export const mutations = {
    setStandings (state, payload) {
        console.log('Call to setStanding mutation', payload)
        state.loadedStandings = Object.assign({}, state.loadedStandings, { [payload.slug]: payload })
    },
    clearStandings (state) {
        state.loadedStandings = {}
    }
}

export const actions = {
    // Load specific competition standing
    fetchCompetitionStanding ({commit}, payload) {
        console.log('Call to fetchCompetitionStanding action', payload)
        console.log('payload: ', payload) // spanish_la_liga_2018_2019
        // firebase.database().ref('/standings/' + payload.slug + '/standing').on('value', function (snapshot) {
        firebase.database().ref('/standings_new3/' + payload + '/standing').on('value', function (snapshot) {
            console.log('snapshot: ', snapshot.val())
            const standingArray = []
            for (const key in snapshot.val()) {
                standingArray.push({ ...snapshot.val()[key], id: key})
            }
            const abc2 = {slug: payload, standing: standingArray}
            console.log('abc2: ', abc2)
            commit('setStandings', abc2)
        })
    },

    // fetchCompetitionStanding2 ({commit}, payload) {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             firebase.database().ref('/standings/' + payload).on('value', function (snapshot) {
    //                 const standingArray = []
    //                 snapshot.forEach((team) => {
    //                     console.log('team: ', team)
    //                     standingArray.push({...team.val(), id: team.key})
    //                 })
    //                 commit('setStandings', {competition: payload, standing: standingArray})
    //                 resolve(standingArray)
    //             })
    //         } catch (error) {
    //             console.log(error)
    //             new Noty({
    //                 type: "error",
    //                 text: "Events not found",
    //                 timeout: 5000,
    //                 theme: "metroui"
    //             }).show()
    //             commit("setError", error, { root: true })
    //             commit("setLoading", false, { root: true })
    //             reject(error)
    //         }
    //     })
    // },

    
}

export const getters = {
    loadedStandings (state) {
        return state.loadedStandings
    }
}