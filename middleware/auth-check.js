export default function({ store, redirect, error }) {
	console.log('Entering auth-check')
	// if (process.client) {
		if (!store.getters['users/loadedUser']) {
			console.log('Unauthenticated, redirect to login')
			store.commit('openLoginModal')
			return redirect('/')
		} else {
			console.log('Authenticated, continue!')
		}
	// }
}
