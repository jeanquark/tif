import { Auth, GoogleAuthProvider, FacebookAuthProvider } from '~/plugins/firebase-client-init.js'
import * as firebase from 'firebase/app'
import 'firebase/database'
import axios from 'axios'

// Authentification actions require manually building promises (new Promise) because calling the listener function (on) returns a callback, not a promise.

export const state = () => ({})

export const mutations = {}

export const actions = {
    async signUserIn({ commit }, payload) {
        // Promise is necessary so that redirection does not occur when user is not already loaded in vuex state
        return new Promise((resolve, reject) => {
            Auth.signInWithEmailAndPassword(payload.email, payload.password)
                .then(authData => {
                    const userId = authData.user ? authData.user.uid : null
                    firebase
                        .database()
                        .ref(`users/${userId}`)
                        .on('value', function(snapshot) {
                            const data = {
                                ...snapshot.val(),
                                id: snapshot.key
                            }
                            commit('users/setLoadedUser', data, { root: true })
                            resolve()
                        })
                })
                .catch(error => {
                    commit('setError', error, { root: true })
                    reject(error)
                })
        })
    },

    async signUserUp({ commit, dispatch }, payload) {
        // Promise is necessary so that redirection does not occur when user is not already loaded in vuex state
        return new Promise((resolve, reject) => {
            Auth.createUserWithEmailAndPassword(payload.email, payload.password)
                .then(authData => {
                    const userId = authData.user ? authData.user.uid : null

                    // Add user id to payload
                    payload['id'] = userId
                    return axios
                        .post('/register-new-user', {
                            type: 'form',
                            data: payload
                        })
                        .then(newUser => {
                            commit('users/setLoadedUser', newUser.data, {
                                root: true
                            })
                            resolve()
                        })
                        .catch(error => {
                            reject(error)
                        })
                })
                .catch(error => {
                    commit('setError', error, { root: true })
                    reject(error)
                })
        })
    },

    async signInWithGooglePopup({ commit }) {
        // Promise is necessary so that redirection does not occur when user is not already loaded in state
        return new Promise((resolve, reject) => {
            // 1) First sign in with Google
            Auth.signInWithPopup(GoogleAuthProvider)
                .then(authData => {
                    const userId = authData.user ? authData.user.uid : null
                    // 2) Then update users state
                    firebase
                        .database()
                        .ref(`users/${userId}`)
                        .on('value', function(snapshot) {
                            const registeredUser = {
                                ...snapshot.val(),
                                id: snapshot.key
                            }

                            // If user does not exists, save user data in database at the users node
                            if (!registeredUser.level) {
                                return axios
                                    .post('/register-new-user', {
                                        type: 'oauth',
                                        data: authData.user
                                    })
                                    .then(response => {
										// console.log('OK commit user: ', response.data)
                                        commit('users/setLoadedUser', response.data, { root: true })
                                        resolve()
                                    })
                                    .catch(function(error) {
                                        reject(error)
                                    })
                            } else {
                                commit('users/setLoadedUser', registeredUser, {
                                    root: true
                                })
                                resolve()
                            }
                        })
                })
                .catch(error => {
                    commit('setError', error, { root: true })
                    reject(error)
                })
        })
    },

    async signInWithFacebookPopup({ commit }) {
        // Promise is necessary so that redirection does not occur when user is not already loaded in state
        return new Promise((resolve, reject) => {
            // 1) First sign in with Facebook
            Auth.signInWithPopup(FacebookAuthProvider)
                .then(authData => {
                    const userId = authData.user ? authData.user.uid : null
                    // 2) Then update users state
                    firebase
                        .database()
                        .ref(`users/${userId}`)
                        .on('value', function(snapshot) {
                            const registeredUser = {
                                ...snapshot.val(),
                                id: snapshot.key
                            }

                            // If user does not exists, save user data in database at the users node
                            if (!registeredUser.level) {
                                return axios
                                    .post('/register-new-user', {
                                        type: 'oauth',
                                        data: authData.user
                                    })
                                    .then(response => {
                                        commit('users/setLoadedUser', response.data, { root: true })
                                        resolve()
                                    })
                                    .catch(function(error) {
                                        reject(error)
                                    })
                            } else {
                                commit('users/setLoadedUser', registeredUser, {
                                    root: true
                                })
                                resolve()
                            }
                        })
                })
                .catch(error => {
                    commit('setError', error, { root: true })
                    reject(error)
                })
        })
    },

    async signOut({ commit }) {
        commit('setLoading', true, { root: true })
        await Auth.signOut()
        commit('users/setLoadedUser', null, { root: true })
        commit('setLoading', false, { root: true })
    }
}

export const getters = {}
