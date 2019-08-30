import * as firebase from 'firebase/app'
import 'firebase/database'
import axios from 'axios'
import Noty from 'noty'

axios.defaults.headers.post['Content-Type'] = 'multipart/form-data'

export const state = () => ({
    loadedTeam: {},
    loadedTeams: [],
    loadedTeamsByCompetition: []
})

export const mutations = {
    setTeam(state, payload) {
        state.loadedTeam = payload
    },
    setTeamsByCompetition(state, payload) {
        // console.log('payload2: ', payload)
        // state.loadedTeams.payload.competition] = payload.teams
        state.loadedTeamsByCompetition = Object.assign({}, state.loadedTeamsByCompetition, {
            [payload.competition]: payload.teams
        })
    },
    setTeams(state, payload) {
        state.loadedTeams = payload
    },
    createTeam(state, payload) {
        state.loadedTeams.push(payload)
    },
    deleteTeam(state, teamId) {
        const loadedTeams = state.loadedTeams
        state.loadedTeams.splice(loadedTeams.findIndex(team => team.id === teamId), 1)
    }
}

export const actions = {
    // Get a particular team
    async fetchTeam({ commit }, payload) {
        // console.log('payload: ', payload)
        const team = await firebase
            .database()
            .ref('/teams')
            .child(payload)
            .once('value')
        console.log('team.val(): ', team.val())
        commit('setTeam', team.val())
        // return team
    },
    // Fetch teams by competition
    fetchTeamsByCompetition({ commit }, payload) {
        return new Promise(resolve => {
            // console.log('fetchTeamsByCompetition: ', payload)
            firebase
                .database()
                .ref('/teams/')
                .orderByChild(`competitions/${payload}`)
                .equalTo(true)
                .on('value', function(snapshot) {
                    const teamsArray = []
                    // for (const key in snapshot.val()) {
                    //     teamsArray.push({
                    //         ...snapshot.val()[key],
                    //         id: key
                    //     })
					// }
					snapshot.forEach(team => {
						teamsArray.push({
							...team.val(),
							id: team.key
						})
					})
                    // console.log('teamsArray: ', teamsArray)
                    // const orderedTeams = teamsArray.sort(
                    //     (a, b) => parseInt(b.usersCount || 0) - parseInt(a.usersCount || 0)
					// )
					// console.log('orderedTeams: ', orderedTeams)
                    commit('setTeamsByCompetition', {
                        competition: payload,
						// teams: orderedTeams
						teams: teamsArray
                    })
                    resolve()
                })
        })
    },
    // Fetch all teams
    fetchTeams({ commit }) {
        firebase
            .database()
            .ref('/teams/')
            .orderByChild('slug')
            .once('value')
            .then(function(snapshot) {
                // console.log(snapshot.val())
                const teamsArray = []
                for (const key in snapshot.val()) {
                    teamsArray.push({ ...snapshot.val()[key], id: key })
                }
                // console.log(postsArray)
                commit('setTeams', teamsArray)
            })
    },

    // Create a new team
    createTeam({ commit, getters }, payload) {
        console.log(payload)
        commit('setLoading', true, { root: true })

        // Define key from competition slug
        const newTeamKey = payload.slug

        let updates = {}
        updates['/teams/' + newTeamKey] = payload

        // Update teams in competitions node
        for (let competition in payload.competitions) {
            const teamObj = {
                draws: 0,
                wins: 0,
                losses: 0,
                goals_scored: 0,
                goals_conceded: 0,
                points: 0,
                name: payload.name,
                slug: payload.slug
            }
            console.log(teamObj)
            console.log(competition)
            updates['/competitions/' + competition + '/teams/' + newTeamKey] = teamObj
        }
        // return

        firebase
            .database()
            .ref()
            .update(updates)
            .then(() => {
                commit('setLoading', false, { root: true })
                new Noty({
                    type: 'success',
                    text: 'Équipe ' + payload.name + ' enregistrée avec succès!',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            })
            .catch(error => {
                console.log(error)
                commit('setLoading', false, { root: true })
                commit('setError', error, { root: true })
                new Noty({
                    type: 'error',
                    text: 'Équipe non enregistrée. Erreur: ' + error,
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            })
    },

    // Update a team
    updateTeam({ commit, dispatch }, payload) {
        commit('setLoading', true, { root: true })
        // console.log(payload)
        let updates = {}
        updates['/teams/'] = payload

        firebase
            .database()
            .ref()
            .update(updates)
            .then(() => {
                dispatch('loadedTeams')
                commit('setLoading', false, { root: true })
                new Noty({
                    type: 'success',
                    text: 'Changements dans le noeud "teams" effectués avec succès!',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            })
            .catch(error => {
                console.log(error)
                commit('setLoading', false, { root: true })
                commit('setError', error, { root: true })
                new Noty({
                    type: 'error',
                    text: 'Changements non effectués. Erreur: ' + error,
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            })
    },

    // Delete a team
    deleteTeam({ commit }, teamId) {
        commit('setLoading', true, { root: true })
        firebase
            .database()
            .ref('/teams/' + teamId)
            .remove()
            .then(() => {
                commit('deleteTeam', teamId)
                commit('setLoading', false, { root: true })
                new Noty({
                    type: 'success',
                    text: 'Équipe supprimée avec succès!',
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            })
            .catch(error => {
                console.log(error)
                new Noty({
                    type: 'error',
                    text: "Erreur lors de la suppression de l'équipe. " + error,
                    timeout: 5000,
                    theme: 'metroui'
                }).show()
            })
    }
}

export const getters = {
    loadedTeam(state) {
        return state.loadedTeam
    },
    loadedTeams(state) {
        return state.loadedTeams
    },
    loadedTeamsByCompetition(state) {
        return state.loadedTeamsByCompetition
    }
}
