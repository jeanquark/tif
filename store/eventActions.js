import * as firebase from 'firebase/app'
import 'firebase/database'

export const state = () => ({
    loadedEventActions: []
})

export const mutations = {
    setEventActions(state, payload) {
        state.loadedEventActions = payload
        // state.loadedActions = Object.assign({}, state.loadedActions, payload)
        // state.loadedActions = Object.assign({}, state.loadedActions, {
        //     [payload.theme]: payload.actions
        // })
    }
}

export const actions = {
    async fetchEventActions({ commit }, payload) {
		return new Promise((resolve, reject) => {
			try {
				firebase.database().ref('/eventActions').on('value', function(snapshot) {
					const actionsArray = []
					for (const key in snapshot.val()) {
						actionsArray.push({
							...snapshot.val()[key],
							id: key
						})
					}
					commit('setEventActions', actionsArray)
					resolve()
				})
			} catch (error) {
				reject(error)
			}
		})
	},
}

export const getters = {
    loadedEventActions(state) {
        return state.loadedEventActions
    }
}
