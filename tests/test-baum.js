'use strict';

var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('../index.js'),
	model = new hmm.Model();

var states = ['Healthy', 'Fever'];
var observations = ['Normal', 'Cold', 'Dizzy'];

model.setStatesSize(states.length);
model.setObservationsSize(observations.length);
// ('Healthy': 0.6, 'Fever': 0.4)
model.setStartProbability([0.6, 0.4]);

// matrix A
model.setTransitionProbability([
	[0.8, 0.2], // healthy
	[0.2, 0.8], // fever
]);

// matrix B
model.setEmissionProbability([
	[0.2, 0.4, 0.2], //HEALTHY : {'normal': 0.5, 'cold': 0.4, 'dizzy': 0.1},
	[0.2, 0.4, 0.2]  //FEVER : {'normal': 0.1, 'cold': 0.3, 'dizzy': 0.6}
]);

exports.testBaum = function (test) {
	var result = hmm.baumwelch(model, [0, 0, 1]);

	test.deepEqual(result, {
		statesSize: 2,
		observationsSize: 3,
		startProbability: [ 0.5005, 0.5005 ],
		transitionProbability: [
			[ 0.7996011988011988, 0.20139880119880121 ],
			[ 0.20139880119880121, 0.7996011988011988 ]
		],
		emissionProbability: [ [ 1, 0.5005, 0.001 ], [ 1, 0.5005, 0.001 ] ]
	});
	test.done();
};