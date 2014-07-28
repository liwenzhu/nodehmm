'use strict';

var HMMModel = require('./hmmModel.js'),
	HMM = require('./index.js');

var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;


var hmmModel = new HMMModel();
hmmModel.setStates(['Healthy', 'Fever']);
// hmmModel.setObservations(['normal', 'cold', 'dizzy']);
// hmmModel.setStartProbability('Healthy': 0.6, 'Fever': 0.4}]);
hmmModel.setStartProbability([0.6, 0.4]);
hmmModel.setTransitionProbability([
	[0.7, 0.3], // healthy
	[0.4, 0.6], // fever
]);
hmmModel.setEmissionProbability([
	[0.5, 0.4, 0.1], //HEALTHY : {'normal': 0.5, 'cold': 0.4, 'dizzy': 0.1},
   	[0.1, 0.3, 0.6]  //FEVER : {'normal': 0.1, 'cold': 0.3, 'dizzy': 0.6}
]);

var hmm = new HMM();
// var observation = ['normal', 'cold', 'dizzy'];
var observation = [NORMAL, COLD, DIZZY];

// should be [0, 0, 1] means ['Healthy', 'Healthy', 'Fever']
console.log(hmm.viterbi(hmmModel, observation));

