nodehmm
=======

Implementation of Forward, Backward, Viterbi, and Baum-Welch(Forward-Backward) algorithms.

	"n": 0, 	// 普通名词
	"nt": 1, 	// 时间名词
	"nd": 2, 	// 方位名词
	"nl": 3, 	// 处所名词
	"nh": 4, 	// 人名
	"nhf": 5, 	// 姓
	"nhs": 6, 	// 名
	"ns": 7, 	// 地名
	"nn": 8, 	// 族名
	"ni": 9, 	// 机构名
	"nz": 10, 	// 其他专名
	"v": 11, 	// 动词
	"vd": 12, 	// 趋向动词
	"vl": 13, 	// 联系动词
	"vu": 14, 	// 能愿动词
	"a": 15, 	// 形容词
	"f": 16, 	// 区别词
	"m": 17, 	// 数词
	"q": 18, 	// 量词
	"d": 19, 	// 副词
	"r": 20, 	// 代词
	"p": 21, 	// 介词
	"c": 22, 	// 连词
	"u": 23, 	// 助词
	"e": 24, 	// 叹词
	"o": 25, 	// 拟声词
	"i": 26, 	// 习用语
	"j": 27, 	// 缩略词
	"h": 28, 	// 前接成分
	"k": 29, 	// 后接成分
	"g": 30, 	// 语素字
	"x": 31, 	// 非语素字
	"w": 32, 	// 标点符号
	"ws": 33, 	// 非汉字字符串
	"wu": 34 	// 其他未知的符号

## Forward
---
```
var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('../index.js'),
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

## Backward
---
```
var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('../index.js'),
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

## Viterbi
---
```
var HEALTHY = 0,
	FEVER = 1,
	NORMAL = 0,
	COLD = 1,
	DIZZY = 2;

var hmm = require('../index.js'),
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



















