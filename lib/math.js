'use strict';

module.exports = Mathjs;

function Mathjs () {

};

Mathjs.prototype.log2 = function (val) {
	return Math.log(val) / Math.LN2;
};