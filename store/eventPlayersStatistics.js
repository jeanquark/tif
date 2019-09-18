import * as firebase from 'firebase/app'
import 'firebase/database'

export const state = () => ({
    // eventPlayersStatistics: {}
    eventPlayersStatistics: []
})

export const mutations = {
    setPlayersStatisticsByEvent(state, payload) {
        console.log('Call to events/setPlayersStatisticsByEvent mutation', payload)
        state.eventPlayersStatistics = payload
  //       state.eventPlayersStatistics = Object.assign({}, state.eventPlayersStatistics, {
  //           [payload.eventId]: payload.statistics
		// })
    }
}

export const actions = {
    fetchPlayersStatisticsByEvent({ commit }, payload) {
		return new Promise((resolve, reject) => {
			try {
				console.log('fetchPlayersStatisticsByEvent action: ', payload)
				const eventId = payload
				firebase
					.database()
					.ref(`/eventPlayersStatistics/${eventId}`)
					.on('value', function(snapshot) {
						const statisticsArray = []
						// const statisticsObject = {}
						snapshot.forEach(statistic => {
							statisticsArray.push({ ...statistic.val(), id: statistic.key })
							// statisticsObject[statistic.key] = { ...statistic.val(), id: statistic.key }
						})
						// const statistics = { eventId, statistics: statisticsObject }
						// console.log('statistics: ', statistics)
						// commit('setPlayersStatisticsByEvent', statistics)
						commit('setPlayersStatisticsByEvent', statisticsArray)
						resolve()
					})
			} catch (error) {
				console.log('error: ', error)
				reject(error)
			}
		})
	}
}

export const getters = {
    loadedPlayersStatisticsByEvent(state) {
        return state.eventPlayersStatistics
    }
}
