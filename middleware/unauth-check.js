export default function({ store, redirect, error }) {
    console.log('Entering unauth check')
    if (store.getters['users/loadedUser']) {
        console.log('Authenticated, redirect to homepage')
        return redirect('/gamemode')
    }
}
