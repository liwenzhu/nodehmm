var uubench = require('uubench')
	;

hmm = require('../index');

//Setup
suite = new uubench.Suite({
    start: function() {
        console.log("\033[90mstarting...");
    },
    result: function(name, stats) {
        // console.log(name + ": " + stats.iterations/stats.elapsed);
        var persec = 1000 / stats.elapsed
          , ops = stats.iterations * persec;
        console.log('  \033[90m%s : \033[36m%s \033[90moperations/second\033[0m', name, ops | 0);
    },
    done: function() {
        console.log("\033[90mfinished");
    }
});

// training
model = new hmm.Model();

var states = ['Healthy', 'Fever'];

model.setStatesSize(states.length);

// ('Healthy': 0.6, 'Fever': 0.4)
model.setStartProbability([0.6, 0.4]);

// matrix A
model.setTransitionProbability([
    [0.7, 0.3], // healthy
    [0.4, 0.6] // fever
]);

// matrix B
model.setEmissionProbability([
    [0.5, 0.4, 0.1], //HEALTHY : {'normal': 0.5, 'cold': 0.4, 'dizzy': 0.1},
    [0.1, 0.3, 0.6]  //FEVER : {'normal': 0.1, 'cold': 0.3, 'dizzy': 0.6}
]);

alpha = [];
beta = [];

for (var i =0 ; i < states.length; i++) {
    alpha[i] = [];
    beta[i] = [];
}

require('./viterbi.js');
require('./forward.js');
require('./backward.js');

suite.run();