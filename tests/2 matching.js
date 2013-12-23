
var tumbler = require('../tumbler');


exports['Match empty object with empty object'] = function(test){

	var tumble = tumbler();

	tumble.add({}, 'DATA');

	var result = tumble.match({});

	test.deepEqual(result, ['DATA']);

	test.done();
};

exports['Match empty object with non-empty object'] = function(test){

	var tumble = tumbler();

	tumble.add({}, 'DATA1');

	var result = tumble.match({a:1});

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Match empty object and non-empty object with non-empty object'] = function(test){

	var tumble = tumbler();

	tumble.add({}, 'DATA1');
	tumble.add({a:1}, 'DATA2');

	var result = tumble.match({a:1});

	test.deepEqual(result, ['DATA1', 'DATA2']);

	test.done();
};


exports['Match non-empty object with empty object'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA2');

	var result = tumble.match({});

	test.deepEqual(result, []);

	test.done();
};

exports['Match simple object with simple object'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');

	var result = tumble.match({a:1});

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Match simple object with simple object, different values - part 1'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:2}, 'DATA2');

	var result = tumble.match({a:1});

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Match simple object with simple object, different values - part 2'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:2}, 'DATA2');

	var result = tumble.match({a:2});

	test.deepEqual(result, ['DATA2']);

	test.done();
};

exports['Match simple object with simple object, different keys - part 1'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({b:2}, 'DATA2');

	var result = tumble.match({a:1});

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Match simple object with simple object, different keys - part 2'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({b:2}, 'DATA2');

	var result = tumble.match({b:2});

	test.deepEqual(result, ['DATA2']);

	test.done();
};

exports['Match simple object with simple object, different keys - mismatched values'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({b:2}, 'DATA2');

	var result = tumble.match({b:1});

	test.deepEqual(result, []);

	test.done();
};

exports['Match multiple base keys on single large object'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({b:2}, 'DATA2');

	var result = tumble.match({a:1, b:2, c:3});

	test.deepEqual(result, ['DATA1','DATA2']);

	test.done();
};

exports['Match multiple base keys on single large object, multiple'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:1, b:2}, 'DATA2');
	tumble.add({a:1, c:3}, 'DATA3');
	tumble.add({a:4, c:3, d:5}, 'DATA4');

	var result = tumble.match({a:1, b:2, c:3});

	test.deepEqual(result, ['DATA1','DATA2','DATA3']);

	test.done();
};


exports['Match on array'] = function(test){

	var tumble = tumbler();

	tumble.add([1,2,3], 'DATA1');

	var result = tumble.match([1,2,3]);

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Match on multiple array'] = function(test){

	var tumble = tumbler();

	tumble.add([1,2], 'DATA1');
	tumble.add([1,2,3], 'DATA2');
	tumble.add([1,2,3,4], 'DATA2');

	var result = tumble.match([1,2,3]);

	test.deepEqual(result, ['DATA1', 'DATA2']);

	test.done();
};

exports['Match on multiple array, part 2'] = function(test){

	var tumble = tumbler();

	tumble.add([1,2,3,4], 'DATA2');
	tumble.add([1,2,3], 'DATA2');
	tumble.add([1,2], 'DATA1');

	var result = tumble.match([1,2,3]);

	test.deepEqual(result, ['DATA1', 'DATA2']);

	test.done();
};

exports['Match on string'] = function(test){

	var tumble = tumbler();

	tumble.add('STRING', 'DATA1');

	var result = tumble.match('STRING');

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Non-Match on string'] = function(test){

	var tumble = tumbler();

	tumble.add('STRING', 'DATA1');

	var result = tumble.match('STRINGS');

	test.deepEqual(result, []);

	test.done();
};

exports['Match on string mixed with objects'] = function(test){

	var tumble = tumbler();

	tumble.add('STRING', 'DATA1');
	tumble.add({a:1}, 'DATA2');

	var result = tumble.match('STRING');

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Match on string mixed with objects, part 2'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA2');
	tumble.add('STRING', 'DATA1');

	var result = tumble.match('STRING');

	test.deepEqual(result, ['DATA1']);

	test.done();
};

exports['Non-Match on string mixed with objects, with empty object'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA2');
	tumble.add('STRING', 'DATA1');

	var result = tumble.match({});

	test.deepEqual(result, []);

	test.done();
};

exports['Match on object with nested object'] = function(test){

	var tumble = tumbler();

	tumble.add({b: {a: 1}}, 'DATA1');

	var result = tumble.match({a:1, b: {a: 1}});

	test.deepEqual(result, ['DATA1']);

	test.done();
};


exports['Non-Match on object with nested object'] = function(test){

	var tumble = tumbler();

	tumble.add({b: {a: 1}}, 'DATA1');

	var result = tumble.match({a:1, b: {a: 2}});

	test.deepEqual(result, []);

	test.done();
};
