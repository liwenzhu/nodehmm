var fs = require('fs');
var readLine = require('readline');
var showMem = require('./showMemory');
var tagMap = require('./tag.json');
var wordIdMap = require('./wordId.json');
// showMem();

var count = 0;
var index = 0;
var tags = [];
var words = {};
var pi = [];
var matrixA = [];
var matrixB = [];
var tagCount = [];

var TRAIN_FILE_PATH = __dirname + "/../all.txt";
var OUTPUT_FILE_PATH = __dirname + "/out.txt";
var STATES_SIZE = Object.keys(tagMap).length;
var WORD_SIZE = Object.keys(wordIdMap).length;
// console.log(STATES_SIZE);

var readStream = fs.createReadStream(TRAIN_FILE_PATH, readOptions);
var writeStream = fs.createWriteStream(OUTPUT_FILE_PATH, writeOptions);

var readOptions = {
	flags: "r",
	encoding: null,
	fd: null,
	mode: 0666,
	autoClose: true
};

var writeOptions = {
	flags: "a+",
	encoding: null,
	mode: 0666
};

init();

var rl = readLine.createInterface({
	input: readStream,
	output: process.stdout,
	terminal: false
});

rl.on('line', function (line) {
	processLine(line);
	count++;
	// if (count === 1000) {
	// 	rl.close();
	// }
});

rl.on('close', function(){
	trainPi(pi);
	trainTransitionProbability(matrixA);
	trainEmissionProbability(matrixB);
	// console.log('pi:', JSON.stringify(pi));
	console.log(pi.length);
	// console.log(JSON.stringify(matrixA));
	// console.log(JSON.stringify(matrixB))
	writeStream.write('pi=' + JSON.stringify(pi) + '\n');
	writeStream.write('transitionProbability=' + JSON.stringify(matrixA) + '\n');
	writeStream.write('emissionProbability=' + JSON.stringify(matrixB) + '\n');
});

function init () {
	var i,j;
	for (i = 0; i < STATES_SIZE; i++) {
		pi[i] = 0;
		tagCount[i] = 1;
		matrixA[i] = [];
		matrixB[i] = [];
	}

	for (i = 0; i < STATES_SIZE; i++) {
		for (j = 0; j < STATES_SIZE; j++) {
			matrixA[i][j] = 0;
		}
		for (j = 0; j < WORD_SIZE; j++) {
			matrixB[i][j] = 0;
		}
	}
};

function processLine (line) {
	if (count % 20000 === 0) {
		console.log('line: ', count);
	}
	line = line.replace(/\[/g,'');
	line = line.replace(/\]\s/g,'');
	var tokens = line.split(' ');
	var tagTokens = [];
	var idx, i, j, word, tokenParts, len = tokens.length, len2;
	for (i = 0; i < len; i++) {
		tokenParts = tokens[i].split('\/');
		tagTokens[i] = tokenParts[1];
		tokens[i] = (tokens[i] == '') ? '' : tokenParts;

	}
	tagTokens = tagTokens.filter(Boolean);
	tokens = tokens.filter(Boolean);
	tagsToId(tagTokens);
	tokensToId(tokens);
	countPi(tagTokens);
	countMatrixA(tagTokens);
	countMatrixB(tokens);
};

function tagsToId (tokens) {
	var i, len = tokens.length;
	for (i = 0; i < len; i++) {
		if (tokens[i] === 'mq') // old corpus use mq
			tokens[i] = 'r';
		if (tagMap[tokens[i]] || tagMap[tokens[i]] === 0)
			tokens[i] = tagMap[tokens[i]];
	}
};

function tokensToId (tokens) {
	var i, token, len = tokens.length;
	for (i = 0; i < len; i++) {
		token = tokens[i];
		if (token[1] == 'mq')
			token[1] = 'r';
		if (wordIdMap[token[0]] || wordIdMap[token[0]] === 0)
			token[0] = wordIdMap[token[0]];
		if (tagMap[token[1]] || tagMap[token[1]] === 0)
			token[1] = tagMap[token[1]];
	}
};

function countPi (tokens) {
	var i, len = tokens.length;
	for (i = 0; i < len; i++) {
		pi[tokens[i]]++;
	}
};

function countMatrixA (tokens) {
	var i, len = tokens.length;
	for (i = 0; i < len - 1; i++) {
		tagCount[tokens[i]]++;
		try {
			matrixA[tokens[i]][tokens[i+1]]++;
		} catch (e) {
			console.log('training matrixA: ', e);
		}
	}
	tagMap[tokens[i]]++;
};

function countMatrixB (tokens) {
	// wordId 
	var i, token, len = tokens.length;
	for (i = 0; i < len; i++) {
		token = tokens[i];
		if (!isGoodToken(token))
			continue;
		try {
			matrixB[token[1]][token[0]]++;
		} catch (e) {
			console.log('training matrixB: ', e);
		}
	}
};

function isGoodToken (token) {
	if (token.length < 2)
		return false;
	if (!token[0] && token[0] !== 0)
		return false;
	if (!token[1] && token[1] !== 0)
		return false;
	return true;
};

function trainPi (piArray) {
	var i, sum = 0;
	for (i = 0; i < STATES_SIZE; i++) {
		sum += piArray[i];
	}
	for (i = 0; i < STATES_SIZE; i++) {
		piArray[i] = piArray[i] / sum;
	}
};

function trainTransitionProbability (matrix) {
	var i, j;
	for (i = 0; i < STATES_SIZE; i++) {
		for (j = 0; j < STATES_SIZE; j++) {
			matrix[i][j] = matrix[i][j] / tagCount[i];
		}
	}
};

function trainEmissionProbability (matrix) {
	var i, j;
	for (i = 0; i < STATES_SIZE; i++) {
		for (j = 0; j < WORD_SIZE; j++) {
			matrix[i][j] = matrix[i][j] / tagCount[i];
		}
	}
};





