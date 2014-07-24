'use strict';

function HMMModel () {
	this.states = null;
	this.observations = null;
	this.transitionProbability = null;
	this.emissionProbability = null;
};

// states : ['rainy', 'sunny']
HMMModel.prototype.setStates = function (states) {
	this.states = states;
};

// observations : ['walk', 'shop', 'clean'] 
HMMModel.prototype.setObservations = function (observations) {
	this.observations = observations;
};

// startProbability: {
// 	'rainy': 0.6,
// 	'sunny': 0.4	
// }
HMMModel.prototype.setStartProbability = function (startProbability) {
	this.startProbability = startProbability;
};

// transitionProbability : {
//	'rainy': {'rainy': 0.7, 'sunny': 0.3},
//	'sunny': {'rainy': 0.4, 'sunny': 0.6}
// }
HMMModel.prototype.setTransitionProbability = function (transitionProbability) {
	this.transitionProbability = transitionProbability;
};

// emissionProbability : {
// 	'rainy': {'walk': 0.1, 'shop': 0.4, 'clean': 0.5},
// 	'sunny': {'walk': 0.6, 'shop': 0.3, 'clean': 0.1}
// }
HMMModel.prototype.setEmissionProbability = function (emissionProbability) {
	this.emissionProbability = emissionProbability;
};