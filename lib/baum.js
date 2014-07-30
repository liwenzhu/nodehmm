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
