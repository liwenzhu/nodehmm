'use strict';

var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('../index.js'),
	model = new hmm.Model();

var states = ['Sunny', 'Cloudy', 'Rainy'];

model.setStatesSize(states.length);

// ('sunny': 0.63, 'cloud': 0.17, 'rainy': 0.2)
model.setStartProbability([0.63, 0.17, 0.2]);

// matrix A
model.setTransitionProbability([
	[0.50, 0.375, 0.125], // sunny
	[0.25, 0.125, 0.625], // cloud
	[0.25, 0.375, 0.375]  // rainy
]);

// matrix B
model.setEmissionProbability([
	[0.60, 0.20, 0.15, 0.05], //sunny : {'dry': 0.6, 'dryish': 0.2, 'damp': 0.15, 'soggy': 0.05},
	[0.25, 0.25, 0.25, 0.25], //cloud : {'dry': 0.25, 'dryish': 0.25, 'damp': 0.25, 'soggy': 0.25},
	[0.05, 0.10, 0.35, 0.50]  //rainy : {'dry': 0.05, 'dryish': 0.10, 'damp': 0.35, 'soggy': 0.50}
]);

exports.testForward = function (test) {
	var result = hmm.forward(model, [0, 2, 3]);
	test.equal(result, 0.026901);
	test.done();
};