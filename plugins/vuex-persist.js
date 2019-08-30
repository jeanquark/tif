import VuexPersistence from "vuex-persist";

export default ({ store }) => {
  window.onNuxtReady(() => {
    new VuexPersistence({
		reducer: state => ({
			// users: state.loadedUser,
			userTeams: state.userTeams
		})
    }).plugin(store);
  });
};
