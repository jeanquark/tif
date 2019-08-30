export default function gainFunctions(actionSlug, actionValue, playedToday) {
	console.log('Call to gainFunctions')
	console.log('actionSlug: ', actionSlug)
	console.log('actionValue: ', actionValue)
	console.log('playedToday: ', playedToday)
	switch (actionSlug) {
		case 'gain_endurance': {
			let factor = 1
			if (playedToday > 1) {
				factor = 1.64872 * playedToday * Math.exp(-0.5 * playedToday)
			}
			return actionValue * factor
		}
		case 'gain_strength': {
			let factor = 1
			if (playedToday > 1) {
				factor = 1.64872 * playedToday * Math.exp(-0.5 * playedToday)
			}
			return actionValue * factor
		}
		case 'gain_smooth_talk': {
			let factor = 1
			if (playedToday > 1) {
				factor = 1.64872 * playedToday * Math.exp(-0.5 * playedToday)
			}
			return actionValue * factor
		}
		case 'gain_creativity': {
			let factor = 1
			if (playedToday > 1) {
				factor = 1.64872 * playedToday * Math.exp(-0.5 * playedToday)
			}
			return actionValue * factor
		}
		case 'gain_social': {
			let factor = 1
			if (playedToday > 1) {
				factor = 1.64872 * playedToday * Math.exp(-0.5 * playedToday)
			}
			return actionValue * factor
		}
		default: {
			return actionValue * playedToday
		}
	}
}