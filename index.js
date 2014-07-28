'use strict';

module.exports = HMM;

function HMM () {

};

// supervisor train
HMM.prototype.learn = function (fileName, matrixAFile, matrixBFile) {

};

// n-supervisor train
HMM.prototype.hyperLearn = function (fileName, matrixAFile, matrixBFile) {

};

// calculate every node delta(i, t)
// then choose maxDelta(t)
// trance back to t=1, all value in path is the viterbi result
// observations is a token array
HMM.prototype.viterbi = function (hmmModel, observations) {
	var delta = []; // value
	var path = []; // path
	var T = observations.length;
	var N = hmmModel.getStatesSize();
	var pi = hmmModel.getStartProbability();
	var emissionProbability = hmmModel.getEmissionProbability();
	var row, column, time;

	/* 1. Initialization */
	for (row = 0; row < T; row++) {
		path[row] = [];
		delta[row] = [];
	}

	for (column = 0; column < N; column++) {
		// delta[1][column] = [pi[observations[0]] * emissionProbability[column][observations[0]]];
		delta[0][column] = pi[observations[0]] * emissionProbability[column][observations[0]];
		path[0][column] = -1;
	}

	return 0;
	/* 2. Recursion */
	/* 3. Termination */
	/* 4. Path (state sequence backtracking) */
};

