#Tumber.js

A key/value data store built to support using plain objects as keys, with pattern matched retrieval.

##Usage

In Node or another CommonJS environment:

```js
var pinvault = require('pinvault');
var tstore = pinvault();
```

In an AMD environment such as RequireJS:

```js
require(['pinvault'], function (pinvault) {
	var tstore = pinvault();
});
```

Loaded directly on a webpage:

```js
var tstore = pinvault();
```

###pinvault.add(key, value)

```js
tstore.add({gender: 'F'}, 1.684);                              //matches any plain object with a "gender" property containing "F"
tstore.add({address: {zipcode: '95014'}}, 'Cupertino');        //matches any plain object with an "address" property containing a zipcode of 95014
tstore.add({active: true}, function () { isActive = true; });  //matches any plain object with an "active" property set to true
tstore.add(function () { var iDontKnowWhyIDidThis = 1; }, 10); //only matches on an identical function (string evaluation)
tstore.add('StringValue', 0);                                  //only matches on "StringValue"
tstore.add({foo: '*'}, true);                                  //matches any object containing a 'foo' property, regardless of value
```

- key (mixed) - What to store the value under.  Key is intended to be a plain object, but can be any data type in JavaScript.
- value (mixed) - What value to store and return upon matching. Can be anything.

Returns the collection object for chaining.

Multiple values may be stored under the same key by performing multiple adds.  Passing an asterisk as the value of a property will match against objects containing that property, but any value on that property.

###pinvault.remove(key[, value[, returnTotalRemoved]])

Removes the value from the data store using the passed key.  If `value` is omitted, all values stored under a pattern will be removed.

- key (mixed) - The exact key used to store the value.
- value (mixed, optional) - The value to be removed.  If omitted, all values stored under the pattern will be removed
- returnTotalRemoved (boolean, optional) - If truthy, `remove()` will return the total number of items removed from the collection.  Otherwise will return the collection object.

###pinvault.match(input)

Searches the collection for all entries whose key matches against the `input`, ordered by specificity descending (closest match first), index ascending (oldest values first).  Returns an array of match detail objects containing the stored `data`, the matched `pattern` used to store the data, `index` order of which it was added, and the `specificity` level of the match.

```js
var tstore = pinvault();
tstore.add({a:1}, 1);
tstore.add({a:1, b:2}, 2);
tstore.add({a:1, c:3}, 3);
tstore.add({a:4, c:3, d:5}, 4);

var result = tstore.match({a:1, b:2, c:3});
```

`result` will contain:

```js
[
	{
		data: 2,
    	specificity: 2,
    	index: 1,
    	pattern: '{"a":1,"b":2}'
    },
	{
		data: 3,
    	specificity: 2,
    	index: 2,
    	pattern: '{"a":1,"c":3}'
    },
	{
		data: 1,
		specificity: 1,
		index: 0,
		pattern: '{"a":1}'
	}
]
```

###pinvault.matchData(input)

Performs the same search as `.match(input)`, but returns an array of only the data values.

###pinvault.get(key[, all])

Returns only the values which exactly match the key (no pattern matching).

- key (mixed) - The exact key used to store the value.
- all (boolean, optional) - If truthy, pinvault will always return an array of all values found on the key (empty array if none found).  If falsy or omitted, `get()` will return the last value stored under that key, or `undefined` if no values were found.

##Running Unit Tests

From inside the repository root, run `npm install` to install the NodeUnit dependency.

Run `npm test` to execute the complete test suite.