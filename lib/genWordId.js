var fs = require('fs');
var readLine = require('readline');

var readOptions = {
	flags: 'r',
	encoding: null,
	fd: null,
	mode: 0666,
	autoClose: true
};

var readStream = fs.createReadStream(__dirname + '/../all.txt', readOptions);

var rl = readLine.createInterface({
	input: readStream,
	output: process.stdout,
	terminal: false
});

var words = {};

var id = 0;
var count = 0;

rl.on('line', function (line) {
	count++;
	if (count % 20000 === 0) {
		console.log('line: ', count);
	}
	line = line.replace(/\[/g,'');
	line = line.replace(/\]\s/g,'');
	var tokens = line.split(' ');
	var idx, i, j, word, tokenParts, len = tokens.length, len2;
	// console.log(tokens)
	for (i = 0; i < len; i++) {
		tokens[i] = tokens[i].split('\/')[0];
	}
	giveWordId(tokens);
});

rl.on('close', function () {
	console.log('finished.');
	fs.writeFile('./wordId.json', JSON.stringify(words), function(){});
});

function giveWordId (tokens) {
	var i, len = tokens.length;
	for (i = 0; i < len; i++) {
		if(!words[tokens[i]]) 
			words[tokens[i]] = id++;
	}
};




