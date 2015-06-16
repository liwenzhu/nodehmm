'use strict';

var Mathjs = require('./math.js');
var math = new Mathjs();

module.exports = function (hmmModel, observations, alpha) {
	var row, column, time, prevColumn, sum;
	var N = hmmModel.getStatesSize();
	var T = observations.length;
	var pi = hmmModel.getStartProbability();
	var emissionProbability = hmmModel.getEmissionProbability();
	var transitionProbability = hmmModel.getTransitionProbability();

	for (row = 0; row < T; row++) {
		alpha[row] = [];
	}

	// 1. Initialization
	for (column = 0; column < N; column++) {
		alpha[0][column] = pi[column]*emissionProbability[column][observations[0]];
	}

	// 2. Induction
	for (time = 1; time < T; time++) {
		for (column = 0; column < N; column++) {
			sum = 0;
			for (prevColumn = 0; prevColumn < N; prevColumn++) {
				sum += alpha[time-1][prevColumn]*transitionProbability[prevColumn][column];
			}
			alpha[time][column] = sum*emissionProbability[column][observations[time]];
		}
	}

	// 3. Termination
	var result = 0;
	for (column = 0; column < N; column++) {
		result += alpha[T-1][column];
	}
	return math.log2(result);
};
