var fs = require('fs');
var readLine = require('readline');
var showMem = require('./showMemory');
var tagMap = require('./tag.json');
// showMem();

var count = 0;
var index = 0;
var tags = [];
var words = {};
var pi = [];
var matrixA = [];
var matrixB = [];

var TRAIN_FILE_PATH = __dirname + "/../all.txt";
var OUTPUT_FILE_PATH = __dirname + "/out.txt";
var STATES_SIZE = Object.keys(tagMap).length;
console.log(STATES_SIZE);

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
	// if (count === 1000000) {
	// 	rl.close();
	// }
});

rl.on('close', function(){
	trainPi(pi);
	console.log('count:', count);
	console.log('pi:', pi.toString());
	console.log(pi.length);
	// console.log(Object.keys(words).length);
	// console.log('start convert to json...');
	// writeStream.write(JSON.stringify(words));
	// console.log('finish convert.');
	// fs.writeFile(__dirname+"/tag.txt", tags.join(',\n'), function(){});
	// writeStream.write(tags.join(',\n'));	
	// fs.writeFile('./out.txt', JSON.stringify(words), function(){});
});

function init () {
	var i;
	for (i = 0; i < STATES_SIZE; i++) {
		pi[i] = 0;
	}
};

function processLine (line) {
	if (count % 20000 === 0) {
		console.log('line: ', count);
	}
	line = line.replace(/\[/g,'');
	line = line.replace(/\]\s/g,'');
	var tokens = line.split(' ').filter(Boolean);
	var idx, i, j, word, tokenParts, len = tokens.length, len2;
	for (i = 0; i < len; i++) {
		tokens[i] = tokens[i].split('\/')[1];
	}
	tokensToId(tokens);
	countPi(tokens);
	// for (i = 0; i < len; i++) {
	// 	tokenParts = tokens[i].split('\/');
	// 	idx = words[tokenParts[0]];
	// 	if(!idx) {
	// 		idx = index++;
	// 		words[tokenParts[0]] = idx;
	// 		tags[idx] = [];
	// 	} 
	// 	len2 = tags[idx].length;
	// 	for (j = 0; j < len2; j++) {
	// 		if(tags[idx][j] === tokenParts[1])
	// 			break;
	// 	}
	// 	if (j === len2)
	// 		tags[idx].push(tokenParts[1]);
	// }
};

function tokensToId (tokens) {
	var i, len = tokens.length;
	// console.log(tokens);
	for (i = 0; i < len; i++) {
		if(tokens[i] === 'mq') // old corpus use mq
			tokens[i] = 'r';
		if (tagMap[tokens[i]] || tagMap[tokens[i]] === 0)
			tokens[i] = tagMap[tokens[i]];
	}
};

function countPi (tokens) {
	// console.log("tokens:", tokens);
	var i, len = tokens.length;
	for (i = 0; i < len; i++) {
		pi[tokens[i]]++;
	}
};

function countMatrixA (lineParts) {

};

function countMatrixB (lineParts) {

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






