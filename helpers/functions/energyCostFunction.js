export default function energyCostFunction(energyCost, playedToday) {
	// return energyCost * playedToday
	let factor = 1
	if (playedToday > 1) {
		factor = playedToday * Math.exp(playedToday / 12)
	}
	return energyCost * factor
}