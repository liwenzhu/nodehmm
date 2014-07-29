'use strict';

// calculate every node delta(i, t)
// then choose maxDelta(t)
// trance back to t=1, all value in path is the viterbi result
// observations is a token array
module.exports = function (hmmModel, observations) {
	var delta = []; // value
	var path = []; // path
	var result = [];
	var T = observations.length; // number of observations
	var N = hmmModel.getStatesSize(); // number of states
	var pi = hmmModel.getStartProbability();
	var emissionProbability = hmmModel.getEmissionProbability();
	var transitionProbability = hmmModel.getTransitionProbability();
	var row, column, prevRowColumn, time, maxVal, maxValPath, val;

	/* 1. Initialization */
	for (row = 0; row < T; row++) {
		path[row] = [];
		delta[row] = [];
		result[row] = -1;
	}

	for (column = 0; column < N; column++) {
		delta[0][column] = pi[observations[0]] * emissionProbability[column][observations[0]];
		path[0][column] = -1;
	}

	/* 2. Recursion */
	for (time = 1; time < T; time++) {
		for (column = 0; column < N; column++) {
			maxVal = 0;
			maxValPath = 0;
			for (prevRowColumn = 0; prevRowColumn < N; prevRowColumn++) {
				val = delta[time-1][prevRowColumn] * transitionProbability[prevRowColumn][column];
				if (val > maxVal) {
					maxVal = val;
					maxValPath = prevRowColumn;
				}
			}
			delta[time][column] = maxVal * emissionProbability[column][observations[time]];
			path[time][column] = maxValPath;
		}
	}

	/* 3. Termination */
	var probability = 0;
	for (column = 0; column < N; column++) {
		if (probability < delta[T-1][column]) {
			probability = delta[T-1][column];
			result[T-1] = column;
		}
	}

	/* 4. Path (state sequence backtracking) */
	for (time = T-2; time >= 0; time--) {
		result[time] = path[time+1][result[time+1]];
	}

	return result;
}