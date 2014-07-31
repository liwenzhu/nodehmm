suite.bench("hmm backward", function(next){
	hmm.backward(model, [0,1,2], beta);
	next();
});