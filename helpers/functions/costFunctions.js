export default function costFunctions(actionSlug, actionValue, playedToday) {
	console.log('Call to costFunctions')
	console.log('actionSlug: ', actionSlug)
	console.log('actionValue: ', actionValue)
	console.log('playedToday: ', playedToday)
	// let factor = 1
	// if (playedToday > 1) {
	// 	factor = playedToday * Math.exp(playedToday / 12)
	// }
	// return actionValue * factor

	switch (actionSlug) {
		case 'cost_energy': {
			let factor = 1
			if (playedToday > 1) {
				factor = playedToday * Math.exp(playedToday / 12)
			}
			return actionValue * factor
		}
		default: {
			return actionValue * playedToday
		}
	}
}