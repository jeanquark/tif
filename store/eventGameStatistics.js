import * as firebase from 'firebase/app'
import 'firebase/database'

export const state = () => ({
    eventGameStatistics: {}
})

export const mutations = {
    setGameStatisticsByEvent(state, payload) {
        console.log('Call to events/setGameStatisticsByEvent mutation', payload)
        // state.loadedEventsByDay = payload
        state.eventGameStatistics = Object.assign({}, state.eventGameStatistics, {
            [payload.eventId]: payload.statistics
		})
    }
}

export const actions = {
    fetchGameStatisticsByEvent({ commit }, payload) {
		console.log('fetchGameStatisticsByEvent action: ', payload)
		const eventId = payload
		return new Promise((resolve, reject) => {
			try {
				firebase
					.database()
					.ref(`/eventGameStatistics/${eventId}`)
					.on('value', function(snapshot) {
						// const statisticsArray = []
						const statisticsObject = {}
						snapshot.forEach(statistic => {
							// statisticsArray.push({ ...statistic.val(), id: statistic.key })
							statisticsObject[statistic.key] = { ...statistic.val(), id: statistic.key }
						})
						const statistics = { eventId, statistics: statisticsObject }
						console.log('statistics: ', statistics)
						commit('setGameStatisticsByEvent', statistics)
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
    loadedGameStatisticsByEvent(state) {
        return state.eventGameStatistics
    }
}
