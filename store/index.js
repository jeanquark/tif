import moment from "moment"
import * as firebase from "firebase/app"
import "firebase/database"

export const strict = false

export const state = () => ({
    loading: false,
    loadingPage: false,
    error: null,
    loginModal: false,
	registerModal: false,
	message: '',
    activeTab: 'date',
    activeDate: '',
    activeDateTab: 10,
    activeDatePanel: [],
    activeRoundTab: 0,
    activeCompetition: {}
})

export const mutations = {
    setLoading(state, payload) {
        state.loading = payload
    },
    setLoadingPage(state, payload) {
        state.loadingPage = payload
    },
    setError(state, payload) {
        console.log("setError mutation called")
        console.log(payload)
        state.error = payload
    },
    clearError(state) {
        state.error = null
    },
    openLoginModal (state) {
        state.loginModal = true
    },
    closeLoginModal (state) {
        state.loginModal = false
    },
    openRegisterModal (state) {
        state.registerModal = true
    },
    closeRegisterModal (state) {
        state.registerModal = false
	},
	setMessage (state, payload) {
		state.message = payload
	},
	clearMessage (state) {
		state.message = ''
	},
    // Set event active tab (by date/by round)
    setActiveTab (state, payload) {
        state.activeTab = payload
    },
    // Set active date
    setActiveDate (state, payload) {
        state.activeDate = payload
    },
    // Set active tab when scrolling through events by date
    setActiveDateTab (state, payload) {
        state.activeDateTab = payload
    },
    // Set active panel
    setActiveDatePanel(state, payload) {
        // console.log('setActiveDatePanel: ', payload)
        // state.activeDatePanel = 2
        state.activeDatePanel = payload
    },
    // Set active tab when scrolling throught eventy by round
    setActiveRoundTab (state, payload) {
        console.log('setActiveRoundTab mutation: ', payload)
        state.activeRoundTab = payload
    },
    // Set active competition for retieving events by round
    setActiveCompetition (state, payload) {
        // console.log('setActiveCompetition: ', payload)
        state.activeCompetition = payload
    }
}

export const actions = {
    // ORIGINAL nuxtServerInit function
    // nuxtServerInit ({commit}, {req}) {
    //     if (req.user) {
    //         console.log('Entering nuxtServerInit')
    //         console.log(req.user)
    //         commit('users/setUser', req.user, { root: true })
    //     }
    // },

    async nuxtServerInit({ commit, dispatch }, { req }) {
        console.log(
            'Entering nuxtServerInit',
            moment().format('DD-MM-YYYY HH:mm:ss')
        )
        if (req.user) {
            console.log('User is logged in from nuxtServerInit')
            const userId = req.user.uid
            console.log('userId from nuxtServerInit: ', userId)
            // console.log('req.user from nuxtServerInit: ', req.user)
            commit('users/setLoadedUser', req.user, { root: true })

            // await dispatch('users/loadedUser2', userId, { root: true})
            // await dispatch('users/fetchAuthenticatedUser2', req.user)
            // this.$router.push({ path: '/gamemode_jm' })

            // firebase.auth().onAuthStateChanged(user => {
            //     if (user) {
            //         const userId = user.uid

            //         firebase
            //             .database()
            //             .ref("users/" + userId)
            //             .on("value", function(snapshot) {
            //                 console.log("Call to firebase user node")
            //                 const userArray = []
            //                 for (const key in snapshot.val()) {
            //                     userArray.push({
            //                         ...snapshot.val()[key],
            //                         id: key
            //                     })
            //                 }
            //                 commit("setLoadedUser", snapshot.val())
            //             })
            //     } else {
            //         console.log("No user is signed in")
            //     }
            // })
        } else {
            console.log('User is not logged in from nuxtServerInit')
        }
    },
    nuxtClientInit({ commit, rootState, rootGetters }, context) { // Added package (not present in Nuxt by default)
        try {
            // console.log('nuxtClientInit')
            // const userId2 = rootState.users.loadedUser ? rootState.users.loadedUser.id : null
            const userId = rootGetters['users/loadedUser'] ? rootGetters['users/loadedUser']['uid'] : null
            console.log('userId from nuxtClientInit: ', userId)
            // const userId = 'AdGWmQi4aadNeVgQxkfRKZHQzvb2'
            if (userId) {
                firebase.database().ref(`/users/${userId}`).on('value', function(snapshot) {
                    // console.log('snapshot.val() from nuxtClientInit: ', snapshot.val())
                    commit('users/setLoadedUser', {...snapshot.val(), id: userId }, { root: true })
                })
            }
        } catch (error) {
            console.log('nuxtClientInit error: ', error)
        }
    },
    clearError({ commit }) {
        commit("clearError")
    }
}

export const getters = {
    loading(state) {
        return state.loading
    },
    loadingPage(state) {
        return state.loadingPage
    },
    loadedError(state) {
        return state.error
    },
    loginModal (state) {
        return state.loginModal
    },
    registerModal (state) {
        return state.registerModal
	},
	message(state) {
		return state.message
	},
    loadedActiveTab(state) {
        return state.activeTab
    },
    loadedActiveDate(state) {
        return state.activeDate
    },
    loadedActiveDateTab(state) {
        return state.activeDateTab
    },
    loadedActiveDatePanel(state) {
        return state.activeDatePanel
    },
    loadedActiveRoundTab(state) {
        return state.activeRoundTab
    },
    loadedActiveCompetition(state) {
        return state.activeCompetition
    }
}
