export default function enduranceGainFunction(enduranceGain, playedToday) {
	// return energyCost * playedToday
	let factor = 1
	if (playedToday > 1) {
		factor = 1.64872 * playedToday * Math.exp(-0.5 * playedToday)
	}
	return enduranceGain * factor
}