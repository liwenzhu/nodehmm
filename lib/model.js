'use strict';

module.exports = Model;

function Model () {
	this.statesSize = null;
	this.observationsSize = null;
	this.startProbability = null;
	this.transitionProbability = null;
	this.emissionProbability = null;
};

Model.prototype.setStatesSize = function (statesSize) {
	this.statesSize = statesSize;
};

Model.prototype.getStatesSize = function () {
	return this.statesSize;
};

Model.prototype.setObservationsSize = function (observationsSize) {
	this.observationsSize = observationsSize;
};

Model.prototype.getObservationsSize = function () {
	return this.observationsSize;
};

// startProbability: [0.6, 0.4]
Model.prototype.setStartProbability = function (startProbability) {
	this.startProbability = startProbability;
};

Model.prototype.getStartProbability = function () {
	return this.startProbability;
};

// transitionProbability : [
//	[0.7, 0.3],
//	[0.4, 0.6]
// ]
Model.prototype.setTransitionProbability = function (transitionProbability) {
	this.transitionProbability = transitionProbability;
};

Model.prototype.getTransitionProbability = function () {
	return this.transitionProbability;
};

// emissionProbability : [
// 	[0.1, 0.4, 0.5],
// 	[0.6, 0.3, 0.1]
// ]
Model.prototype.setEmissionProbability = function (emissionProbability) {
	this.emissionProbability = emissionProbability;
};

Model.prototype.getEmissionProbability = function () {
	return this.emissionProbability;
};
