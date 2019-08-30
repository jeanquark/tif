import * as firebase from 'firebase/app'

export const state = () => ({
	loadedCountries: [],
	loadedCountriesByConfederation: []
})

export const mutations = {
	setLoadedCountries(state, payload) {
        state.loadedCountries = payload
	},
	setCountriesByConfederation (state, payload) {
		state.loadedCountriesByConfederation = Object.assign({}, state.loadedCountriesByConfederation, { [payload.confederation]: payload.countries })
	}
}

export const actions = {
	fetchCountriesByConfederation ({ commit }, payload) {
		return new Promise((resolve) => {
			firebase.database().ref('/countries').orderByChild('confederation/slug').equalTo(payload).on('value', function (snapshot) {
				const countriesArray = []
				for (const key in snapshot.val()) {
					countriesArray.push({
						...snapshot.val()[key],
						id: key
					})
				}
				const orderedCountries = countriesArray.sort((a, b) => a.ranking_confederation - b.ranking_confederation)
				// console.log('countriesArray: ', countriesArray)
				commit('setCountriesByConfederation', { confederation: payload, countries: orderedCountries })
				resolve()
			})
		})
	},
	// fetch all countries
	fetchCountries ({commit}) {
    	try {
			firebase.database().ref('/countries/').once('value').then(function (snapshot) {
				// console.log(snapshot.val())
				const countriesArray = []
				for (const key in snapshot.val()) {
					countriesArray.push({ ...snapshot.val()[key], id: key})
				}
				commit('setLoadedCountries', countriesArray)
			})
		} catch (error) {
			console.log('error: ', error)
			throw error
		}
  	}
}

export const getters = {
	loadedCountries(state) {
        return state.loadedCountries
	},
	loadedCountriesByConfederation(state) {
		return state.loadedCountriesByConfederation
	}
}