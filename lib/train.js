var fs = require('fs');
var readLine = require('readline');
var showMem = require('./showMemory');
showMem();

var count = 0;

var index = 0;
var tags = [];

var words = {};

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

var TRAIN_FILE_PATH = __dirname + "/../all.txt";
var OUTPUT_FILE_PATH = __dirname + "/out.txt";

var readStream = fs.createReadStream(TRAIN_FILE_PATH, readOptions);
var writeStream = fs.createWriteStream(OUTPUT_FILE_PATH, writeOptions);

var rl = readLine.createInterface({
	input: readStream,
	output: process.stdout,
	terminal: false
});

rl.on('line', function (line) {
	processLine(line);
	count++;
});

rl.on('close', function(){
	console.log('count:', count);
	console.log(Object.keys(words).length);
	console.log('start convert to json...');
	writeStream.write(JSON.stringify(words));
	console.log('finish convert.');
	writeStream.write(tags.join(',\n'));	
	// fs.writeFile('./out.txt', JSON.stringify(words), function(){});
});


function processLine (line) {
	if (count % 20000 === 0) {
		console.log('line: ', count);
	}
	var tokens = line.split(' ');
	var idx, i, j, word, tokenParts, len = tokens.length, len2;
	for (i = 0; i < len; i++) {
		tokenParts = tokens[i].split('\/');
		idx = words[tokenParts[0]];
		if(!idx) {
			idx = index++;
			words[tokenParts[0]] = idx;
			tags[idx] = [];
		} 
		len2 = tags[idx].length;
		for (j = 0; j < len2; j++) {
			if(tags[idx][j] === tokenParts[1])
				break;
		}
		if (j === len2)
			tags[idx].push(tokenParts[1]);
		// words[tokenParts[0]].push(tokenParts[1]);
	}
	// console.log('line:', line.split(' '));
	// 190136
};










