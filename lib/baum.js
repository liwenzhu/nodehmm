'use strict';

var DELTA = 0.001;
// Baum-Welch Algorithm
module.exports = function () {

};

// compute γ
// T is number of observation
// N is number of states
function computeGamma (T, N, alpha, beta) {
	var column, row, time, denominator;
	var gamma = [];
	for (time = 0; time < T; time++) {
		gamma[time] = [];
	}

	for (time = 0; time < T; time++) {
		denominator = 0;
		for (column = 0; column < N; column++) {
			gamma[time][column] = alpha[time][column] * beta[time][column];
			denominator +=  gamma[time][column];
		}

		for (column = 0; column < N; column++) {
			gamma[time][column] = gamma[time][column] / denominator;
		}
	}
	return gamma;
};

// compute ξ
function computeXi () {

};
