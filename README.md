nodehmm
=======

[![NPM](https://nodei.co/npm/nodehmm.png?stars&downloads)](https://nodei.co/npm/nodehmm/) [![NPM](https://nodei.co/npm-dl/nodehmm.png)](https://nodei.co/npm/nodehmm/)


Implementation of Forward, Backward, Viterbi, and Baum-Welch(Forward-Backward) algorithms.

You can use an open source train corpus for Chinese in: https://github.com/liwenzhu/corpusZh

Test
---

To run the unittest:

```bash
$ npm test
```

Benchmark
---

To get the benchmarks:

```bash
$ node benchmarks/index.js
```

Forward
---

Forward algorithm is to compute the probability of a sequence of given observation :

```javascript
var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('nodehmm'),
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

var alpha = [];

for (var i = 0; i < states.length; i++) {
	alpha[i] = [];
}

var result = hmm.forward(model, [0, 1, 2], alpha);
console.log(result) // -4.698248486593353

```

Backward
---
this is the same as forward algorithm:
```javascript
var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('nodehmm'),
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
var beta = [];

for (var i = 0; i < states.length; i++) {
	beta[i] = [];
}

exports.testBackword = function (test) {
	var result = hmm.backward(model, [0, 1, 2], beta);
	test.equal(result, -0.6214883767462701);
	test.done();
};
```

Viterbi
---
Get the most possible hidden sequence of the given observation: 
```javascript
var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('nodehmm'),
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

var result = hmm.viterbi(model, [NORMAL, COLD, DIZZY]);
console.log(result); // [0,0,1]
result = result.map(function(r){return states[r]});
console.log(result);  // ['Healthy','Healthy','Fever']
```



















