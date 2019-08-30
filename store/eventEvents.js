import * as firebase from 'firebase/app'
import 'firebase/database'

export const state = () => ({
    eventEvents: {}
})

export const mutations = {
    setEventsByEvent(state, payload) {
        console.log('Call to events/setEventsByEvent mutation', payload)
        // state.loadedEventsByDay = payload
        state.eventEvents = Object.assign({}, state.eventEvents, {
            [payload.eventId]: payload.events
		})
    }
}

export const actions = {
    fetchEventsByEvent({ commit }, payload) {
		console.log('fetchEventsByEvent action: ', payload)
		const eventId = payload
		return new Promise((resolve, reject) => {
			try {
				firebase
					.database()
					.ref(`/eventEvents/${eventId}`)
					// .orderByChild('elapsed')
					.on('value', function(snapshot) {
						const eventsArray = []
						snapshot.forEach(event => {
							eventsArray.push({ ...event.val(), id: event.key })
						})
						const sortedEventsArray = eventsArray.sort((a, b) => b.elapsed - a.elapsed)
						const events = { eventId, events: sortedEventsArray }
						console.log('events: ', events)
						commit('setEventsByEvent', events)
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
    loadedEventsByEvent(state) {
        return state.eventEvents
    }
}
