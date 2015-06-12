'use strict';

var forward = require('./forward');
var backward = require('./backward');

var DELTA = 0.1;
// Baum-Welch Algorithm
module.exports = function (hmmModel, observations) {

	// 1. initialization
	var pi = [];
	var alpha = [];
	var beta = [];
	var transitionProbability = [];
	var emissionProbability = [];

	var N = hmmModel.getStatesSize();
	var M = hmmModel.getObservationsSize();
	var T = observations.length;
	var row, column, time, denominatorA, denominatorB, numberatorA, numberatorB, logProbPrev, delta;
	var initPi = 1 / N;

	// 1.1 init pi
	for (column = 0; column < N; column++) {
		pi[column] = initPi;
		transitionProbability[column] = [];
		emissionProbability[column] = [];
		alpha[column] = [];
		beta[column] = [];
	}

	// 1.2 init alpha
	var logprobf = forward(hmmModel, observations, alpha);
	// 1.3 init beta
	var logprobb = backward(hmmModel, observations, beta);

	var gamma = computeGamma(T, N, alpha, beta);
	var xi = computeXi(hmmModel, observations, alpha, beta);

	logProbPrev = logprobf;
	delta = 1;

	// 2. EM training induction until delta < DELTA
	// do {
	while (delta > DELTA) {
		// 2.1 compute pi
		for (column = 0; column < N; column++) {
			pi[column] = 0.001 + 0.999*gamma[1][column];
		} 

		// 2.2 compute transition matrix and emission matrix
		for (row = 0; row < N; row++) {
			denominatorA = 0;
			for (time = 0; time < T-2; time++)
				denominatorA += gamma[time][row];

			for (column = 0; column < N; column++) {
				numberatorA = 0;
				for (time = 0; time < T-2; time++)
					numberatorA += xi[time][row][column]
				transitionProbability[row][column] = 0.001 + 0.999*numberatorA/denominatorA;
			}

			denominatorB = denominatorA + gamma[T-1][row];
			for (var k = 0; k < M; k++) {
				numberatorB = 0;
				for (time = 0; time < T; time++) {
					if (observations[time] == k)
						numberatorB += gamma[time][row];
				}
				emissionProbability[row][k] = 0.001 + 0.999 * numberatorB / denominatorB;
			}
		}

		hmmModel.setStartProbability(pi);
		hmmModel.setTransitionProbability(transitionProbability);
		hmmModel.setEmissionProbability(emissionProbability);

		// 2.3 comput logfile
		logprobf = forward(hmmModel, observations, alpha);
		logprobb = backward(hmmModel, observations, beta);
		gamma = computeGamma(T, N, alpha, beta);
		xi = computeXi(hmmModel, observations, alpha, beta);

		delta = Math.abs(logprobf - logProbPrev);
		logProbPrev = logprobf;

	} // while (delta > DELTA);
	return hmmModel;
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
function computeXi (hmmModel, observation, alpha, beta) {
	var xi = [];
	var T = observation.length;
	var N = hmmModel.getStatesSize();
	var transitionProbability = hmmModel.getTransitionProbability();
	var emissionProbability = hmmModel.getEmissionProbability();
	var columnI, columnJ, time, sum;
	for (time = 0; time < T; time++) {
		xi[time] = [];
		for (columnI = 0; columnI < N; columnI++) {
			xi[time][columnI] = [];
			for(columnJ = 0; columnJ < N; columnJ++) {
				xi[time][columnI][columnJ] = [];
			}
		}
	}

	for (time = 0; time < T - 1; time++) {
		sum = 0;
		for (columnI = 0; columnI < N; columnI++) {
			for (columnJ = 0; columnJ < N; columnJ++) {
				xi[time][columnI][columnJ] = alpha[time][columnI] 
				  * beta[time+1][columnJ]
				  * transitionProbability[columnI][columnJ] 
				  * emissionProbability[columnJ][observation[time+1]];
				sum += xi[time][columnI][columnJ];
			}
		}

		for (columnI = 0; columnI < N; columnI++) {
			for (columnJ = 0; columnJ < N; columnJ++) {
				xi[time][columnI][columnJ] = xi[time][columnI][columnJ] / sum;
			}
		}
	}


	return xi;
};

