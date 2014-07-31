'use strict';

var DELTA = 0.001;
// Baum-Welch Algorithm
module.exports = function (hmmModel, observations) {

	// 1. initialization
	var pi = [];
	var transitionProbability = [];
	var emissionProbability = [];

	var N = hmmModel.getStatesSize();
	var T = observations.length;
	var row, column, time, denominatorA, denominatorB, numberatorA, numberatorB;
	var initPi = 1 / N;

	// 1.1 init pi
	for (column = 0; column < N; column++) {
		pi[column] = initPi;
		transitionProbability[column] = [];
		emissionProbability[column] = [];
	}

	// 1.2 init alpha
	var alpha = forward(hmmModel, observations);
	// 1.3 init beta
	var beta = backward(hmmModel, observations);

	var gamma = computeGamma(T, N, alpha, beta);
	var xi = computeXi(hmmModel, observations, alpha, beta);

	// 2. EM training induction until delta < DELTA
	do {
		// 2.1 compute pi
		for (column = 0; column < N; column++) {
			pi[column] = gamma[1][column];
		} 

		// 2.2 compute transition matrix and emission matrix
		for (row = 0; row < N; row++) {
			denominatorA = 0;
			for (time = 0; time < T-2; time++)
				denominatorA += gamma[time][row];

			for (column = 0; column <= N; column++) {
				numberatorA = 0;
				for (time = 0; time < T-2; time++)
					numberatorA += xi[time][row][column]
				transitionProbability[row][column] = numberatorA/denominatorA;
			}

			denominatorB = denominatorA + gamma[T-1][row];
			for (var k = 0; k <= T; k++) { 
				numberatorB = 0;
				for (time = 0; time <= T; time++) {
					if (observations[time] == k)
						numberatorB += gamma[time][row];
				}
				emissionProbability[row][k] = numberatorB / denominatorB;
			}
		}

		// 2.3 comput logfile


	} while (delta < DELTA);

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
	var columnI, columnJ, time;

	for (columnI = 0; columnI < N; columnI++) {
		xi[columnI] = [];
		for(columnJ = 0; columnJ < N; columnJ++) {
			xi[columnI][columnJ] = [];
		}
	}

	for (time = 0; time < T; time++) {
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

function forward (hmmModel, observations) {
	var row, column, time, prevColumn, sum;
	var alpha = [];
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
		alpha[0][column] = pi[observations[0]]*emissionProbability[column][observations[0]];
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
	// var result = 0;
	// for (column = 0; column < N; column++) {
	// 	result += alpha[T-1][column];
	// }
	return alpha;
};

function backward (hmmModel, observations) {
	var row, column, time, nextLineColumn, sum;
	var beta = [];
	var N = hmmModel.getStatesSize();
	var T = observations.length;
	var emissionProbability = hmmModel.getEmissionProbability();
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
				emissionProbability[nextLineColumn][observations[time+1]] *
				beta[time+1][nextLineColumn];
			}
			beta[time][column] = sum;
		}
	}

	// 3. Termination
	// var result = 0;
	// for (column = 0; column < N; column++) {
	// 	result += beta[1][column];
	// }
	return beta;
};
