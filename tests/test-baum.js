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
		startProbability: [ 0.5365109117405777, 0.46448908825942237 ],
		transitionProbability: [
			[ 0.795035431455365, 0.20596456854463513 ],
			[ 0.19690964666545377, 0.8040903533345464 ]
		],
		emissionProbability: [
			[ 1.0329438524890906, 0.4691967763708572, 0.001 ],
			[ 0.9622045559778091, 0.5364132022213003, 0.001 ]
		]
	});
	test.done();
};
