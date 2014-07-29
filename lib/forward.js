'use strict';

module.exports = function (hmmModel, observations) {
	var row, column, time, prevColumn, sum;
	var delta = [];
	var N = hmmModel.getStatesSize();
	var T = observations.length;
	var pi = hmmModel.getStartProbability();
	var emissionProbability = hmmModel.getEmissionProbability();
	var transitionProbability = hmmModel.getTransitionProbability();

	for (row = 0; row < T; row++) {
		delta[row] = [];
	}

	// 1. Initialization
	for (column = 0; column < N; column++) {
		delta[0][column] = pi[observations[0]]*emissionProbability[column][observations[0]];
		// console.log(delta);
	}

	// 2. Induction
	for (time = 1; time < T; time++) {
		for (column = 0; column < N; column++) {
			sum = 0;
			for (prevColumn = 0; prevColumn < N; prevColumn++) {
				sum += delta[time-1][prevColumn]*transitionProbability[prevColumn][column];
				// console.log('delta calculate: %s*%s=%s', delta[time-1][prevColumn], 
				// 	transitionProbability[prevColumn][column], delta[time-1][prevColumn]*transitionProbability[prevColumn][column]);
				// console.log('sum:', sum);
			}
			delta[time][column] = sum*emissionProbability[column][observations[time]];
		}
	}

	// 3. Termination
	var result = 0;
	for (column = 0; column < N; column++) {
		result += delta[T-1][column];
	}
	return result;
};