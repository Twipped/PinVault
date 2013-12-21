
(function (context, undefined) {
	'use strict';

	var tumbler = function tumbler() {

		var uniqueKeys = {
			string: '%[String]%',
			array:  '%[Array]%',
			object: '%[Object]%'
		};

		var mainRoot = {
			branches: {}
		};

		function store(pattern, data, root) {
			//if the pattern is not an object, cast it to a string and wrap it in an object under a unique key name
			if (typeof pattern !== 'object') {
				var wrapper = {};
				wrapper[uniqueKeys.string] = String(pattern);
				pattern = wrapper;
			}

			var keys = Object.keys(pattern).sort();
			var keyLast = keys.length - 1;
			var keyIndex = -1;

			var currentTrunk = root;

			function grabBranch(branch, leaf) { return branch.branches[leaf] || (branch.branches[leaf] = { branches: {} }); }

			function step() {
				if (++keyIndex > keyLast) {
					return;
				}

				var key = keys[keyIndex];
				var value = pattern[key];

				currentTrunk = grabBranch(currentTrunk, key);

				// if we find another object as the value, we need to create a new subtree 
				// under an [object Object] branch so that we can perform submatches
				if (typeof value === 'object') {
					currentTrunk = grabBranch(currentTrunk, uniqueKeys.object);
					currentTrunk.subtree = { branches: {} };
					store(value, data, currentTrunk.subtree);
				} else {
					currentTrunk = grabBranch(currentTrunk, value);
				}

				step();
			}

			//arrays get their own root leaf to distinguish from plain objects
			if (Array.isArray(pattern)) {
				currentTrunk = grabBranch(currentTrunk, uniqueKeys.array);
			}

			//kick off the recursion
			step();

			//once the recursion ends, currentTrunk should contain the destination of our stored data
			currentTrunk.data = data;

		}

		function match(pattern, root) {
			var matches = [];

			//if the pattern is not an object, cast it to a string and wrap it in an object under a unique key name
			if (typeof pattern !== 'object') {
				var wrapper = {};
				wrapper[uniqueKeys.string] = String(pattern);
				pattern = wrapper;
			}

			var keys = Object.keys(pattern).sort();

			var currentTrunk = root;

			//arrays get their own root leaf to distinguish from plain objects
			if (Array.isArray(pattern)) {
				if (currentTrunk.branches[uniqueKeys.array]) {
					currentTrunk = currentTrunk.branches[uniqueKeys.array];
				} else {
					//collection does not contain any arrays, we have no matches
					return matches;
				}
			}

			function descend(trunk, keys) {
				if (!keys.length) {
					return;
				}

				var key = keys[0];
				var value = pattern[key];

				//if the current trunk has a branch matching our current key with the value or a wildcard value, descend into that branch before moving on
				if (trunk.branches[key]) {
					var branch = trunk.branches[key];
					if ((branch = branch.branches[value] || branch.branches['*'])) {
						if (branch.data !== undefined) {
							matches.push(branch.data);
						}
						descend(branch, keys.slice(1));
					}
				}

				descend(trunk, keys.slice(1));
			}

			if (currentTrunk.data !== undefined) {
				matches.push(currentTrunk.data);
			}
			descend(currentTrunk, keys);

			return matches;
		}

		return {
			add: function (pattern, data) { store(pattern, data, mainRoot); return this; },
			remove: function () {return this;},
			get: function () {return this;},
			match: function (pattern) {return match(pattern, mainRoot);},
			dump: function () { return mainRoot; }
		};

	};


	if ( typeof module === 'object' && module && typeof module.exports === 'object' ) {
		//Running inside node
		module.exports = tumbler;

	} else if ( typeof define === 'function' && define.amd ) {
		//Running inside AMD
		define([], tumbler);
	} else {
		//Dunno where we are, add it to the global context with a noConflict

		var previous = context.tumbler;
		tumbler.noConflict = function () {
			context.tumbler = previous;
			return tumbler;
		};
		context.tumbler = tumbler;

	}

})(this);