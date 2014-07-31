suite.bench("hmm forward", function(next){
	hmm.forward(model, [0,1,2], alpha);
	next();
});