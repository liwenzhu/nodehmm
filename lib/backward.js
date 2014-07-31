'use strict';

var Mathjs = require('./math.js');
var math = new Mathjs();

module.exports = function (hmmModel, observations, beta) {
	var row, column, time, nextLineColumn, sum;
	var N = hmmModel.getStatesSize();
	var T = observations.length;
	var emmisionProbability = hmmModel.getEmissionProbability();
	var transitionProbability = hmmModel.getTransitionProbability();

	for (row = 0; row < T; row++) {
		beta[row] = [];
	}

	// 1. Initialization
	for (column = 0; column < N; column++) {
		beta[T-1][column] = 1;
	}

	// 2. Induction
	for (time = T - 2; time >=0; time--) {
		for (column = 0; column < N; column++) {
			sum = 0;
			for (nextLineColumn = 0; nextLineColumn < N; nextLineColumn++) {
				sum += transitionProbability[column][nextLineColumn] *
				emmisionProbability[nextLineColumn][observations[time+1]] *
				beta[time+1][nextLineColumn];
			}
			beta[time][column] = sum;
		}
	}

	// 3. Termination
	var result = 0;
	for (column = 0; column < N; column++) {
		result += beta[1][column];
	}
	return math.log2(result);
};