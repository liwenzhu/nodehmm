suite.bench("hmm viterbi", function(next){
	hmm.viterbi(model, [0,1,2]);
	next();
});