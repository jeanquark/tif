import * as firebase from "firebase/app";
import "firebase/database";
import Noty from 'noty'
import axios from 'axios'

export const state = () => ({
    loadedActions: {}
})

export const mutations = {
    setActions (state, payload) {
        console.log('setActions mutations: ', payload)
        // state.loadedActions = payload
        // state.loadedActions = Object.assign({}, state.loadedActions, payload)
        state.loadedActions = Object.assign({}, state.loadedActions, { [payload.theme]: payload.actions })
    }
}

export const actions = {
    // Load a set of actions
    async fetchActions ({ commit }, payload) {
        console.log('payload: ', payload)
        const snapshot = await firebase.database().ref('/actions').orderByChild('theme').equalTo(payload).once('value')

        const actionsArray = []
        snapshot.forEach((action) => {
            actionsArray.push({...action.val(), id: action.key}) 
        })
        // setTimeout(() => {
            commit('setActions', { theme: payload, actions: actionsArray })
        // }, 2000)
    }
}

export const getters = {
    loadedActions (state) {
        return state.loadedActions
    }
}