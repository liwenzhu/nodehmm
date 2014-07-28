'use strict';

module.exports = HMM;

function HMM () {

};

// supervisor train
HMM.prototype.learn = function (fileName， matrixAFile, matrixBFile) {

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
	var psi = []; // path
	var T = observations.length;
	var N = hmmModel.getStatesSize();
	var pi = hmmModel.getStartProbability();
	var i, j, t;

	/* 1. Initialization */

	for (i = 1; i <= N; i++) {
		delta[i] 
	}

	/* 2. Recursion */
	/* 3. Termination */
	/* 4. Path (state sequence backtracking) */
};

