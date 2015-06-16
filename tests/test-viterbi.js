'use strict';

var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('../index.js'),
	model = new hmm.Model();

var states = ['Healthy', 'Fever'];

model.setStatesSize(states.length);

// ('Healthy': 0.6, 'Fever': 0.4)
model.setStartProbability([0.6, 0.4]);

// matrix A
model.setTransitionProbability([
	[0.7, 0.3], // healthy
	[0.4, 0.6], // fever
]);

// matrix B
model.setEmissionProbability([
	[0.5, 0.4, 0.1], //HEALTHY : {'normal': 0.5, 'cold': 0.4, 'dizzy': 0.1},
	[0.1, 0.3, 0.6]  //FEVER : {'normal': 0.1, 'cold': 0.3, 'dizzy': 0.6}
]);

exports.testViterbi = function (test) {
	var result = hmm.viterbi(model, [NORMAL, COLD, DIZZY]);
	test.deepEqual(result, [0, 0, 1]);
	result = result.map(function(r){return states[r]});
	test.deepEqual(result, ['Healthy','Healthy','Fever']);

	var result = hmm.viterbi(model, [DIZZY, COLD, NORMAL]);
	test.deepEqual(result, [1, 0, 0]);
	result = result.map(function(r){return states[r]});
	test.deepEqual(result, ['Fever', 'Healthy','Healthy']);
	test.done();
};
