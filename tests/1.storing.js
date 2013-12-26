
var tumbler = require('../tumbler');


exports['Tumbler initialization'] = function(test){
    test.expect(7);

    test.strictEqual(typeof tumbler, 'function', 'tumbler is a function');

    var tumble = tumbler();

    test.strictEqual(typeof tumble, 'object', 'Generated tumble is an object');
    test.ok(tumble.add, 'Tumble has add function');
    test.ok(tumble.remove, 'Tumble has remove function');
    test.ok(tumble.get, 'Tumble has get function');
    test.ok(tumble.match, 'Tumble has match function');
    test.deepEqual(tumble.dump(), { branches: {} }, 'Tumble has no data stored yet');
    test.done();
};

exports['Store empty pattern'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({}, 'DATA');

	test.deepEqual(tumble.dump(), {
		data: [{data:'DATA', index: 0}],
		pattern: '{}',
		branches: {

		}
	});

	test.done();
};

exports['Store single item pattern'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({a:1}, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			a: {
				branches: {
					1: {
						data: [{data:'DATA', index: 0}],
						pattern: '{"a":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};

exports['Store empty pattern and non-empty pattern'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({}, 'DATA');
	tumble.add({a:1}, 'DATA');

	test.deepEqual(tumble.dump(), {
		data: [{data:'DATA', index: 0}],
		pattern: '{}',
		branches: {
			a: {
				branches: {
					1: {
						data: [{data:'DATA', index: 1}],
						pattern: '{"a":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};

exports['Store multiple item pattern'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({a:1, b:'foo'}, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			a: {
				branches: {
					1: {
						branches: {
							b: {
								branches: {
									foo: {
										data: [{data:'DATA', index: 0}],
										pattern: '{"a":1,"b":"foo"}',
										branches: {}
									}
								}
							}
						}
					}
				}
			}
		}
	});

	test.done();
};

exports['Store multiple patterns'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({a:1}, 'DATA1');
	tumble.add({a:1, b:2}, 'DATA2');
	tumble.add({b:2}, 'DATA3');

	test.deepEqual(tumble.dump(), {
		branches: {
			a: {
				branches: {
					'1': {
						branches: {
							b: {
								branches: {
									'2': {
										branches: {},
										data: [{data:'DATA2', index: 1}],
										pattern: '{"a":1,"b":2}'
									}
								}
							}
						},
						data: [{data:'DATA1', index: 0}],
						pattern: '{"a":1}'
					}
				}
			},
			b: {
				branches: {
					'2': {
						branches: {},
						data: [{data:'DATA3', index: 2}],
						pattern: '{"b":2}'
					}
				}
			}
		}
	});

	test.done();
};

exports['Store pattern with a function'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({
		a: function () {return 10;}
	}, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			a: {
				branches: {
					'function () {return 10;}': {
						data: [{data:'DATA', index: 0}],
						branches: {},
						pattern: '{}'
					}
				}
			}
		}
	});

	test.done();
};

exports['Store pattern with an object'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({
		a: {
			key: 1,
			value: 10
		}
	}, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			a: {
				branches: {
					'%[Object]%': {
						branches: {
							key: {
								branches: {
									1: {
										branches: {
											value: {
												branches: {
													10: {
														branches: {
															'%[ObjectEnd]%': {
																branches: {},
																data: [{data:'DATA', index: 0}],
																pattern: '{"a":{"key":1,"value":10}}'
															}
														},
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

	test.done();
};

exports['Store multiple patterns with an object'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({a: { key: 1 }}, 'DATA1');
	tumble.add({a: { key: 2 }}, 'DATA2');

	test.deepEqual(tumble.dump(), {
		branches: {
			a: {
				branches: {
					'%[Object]%': {

						branches: {
							key: {
								branches: {
									1: {
										branches: {
											'%[ObjectEnd]%': {
												branches: {},
												data: [{data:'DATA1', index: 0}],
												pattern: '{"a":{"key":1}}'
											}
										}
									},
									2: {
										branches: {
											'%[ObjectEnd]%': {
												branches: {},
												data: [{data:'DATA2', index: 1}],
												pattern: '{"a":{"key":2}}'
											}
										}
									}
								}
							}
						}

					}
				}
			}
		}
	});

	test.done();
};

exports['Store pattern with an object, part 2'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add({a: { key: 1 }, b:2}, 'DATA1');

	test.deepEqual(tumble.dump(), {
		branches: {
					a: {
						branches: {
							'%[Object]%': {
								branches: {
									key: {
										branches: {
											1: {
												branches: {
													'%[ObjectEnd]%': {
														branches: {
															b: {
																branches: {
																	2: {
																		branches: {},
																		data: [{data:'DATA1', index: 0}],
																		pattern: '{"a":{"key":1},"b":2}'
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
	});

	test.done();
};

exports['Store with string'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add('STRING', 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			'%[String]%': {
				branches: {
					'STRING': {
						data: [{data:'DATA', index: 0}],
						branches: {},
						pattern: '"STRING"'
					}
				}
			}
		}
	});

	test.done();
};

exports['Store with integer'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add(15, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			'%[String]%': {
				branches: {
					'15': {
						data: [{data:'DATA', index: 0}],
						branches: {},
						pattern: '15'
					}
				}
			}
		}
	});

	test.done();
};

exports['Store with float'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add(1.5, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			'%[String]%': {
				branches: {
					'1.5': {
						data: [{data:'DATA', index: 0}],
						branches: {},
						pattern: '1.5'
					}
				}
			}
		}
	});

	test.done();
};

exports['Store with function'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add(function () {}, 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			'%[String]%': {
				branches: {
					'function () {}': {
						data: [{data:'DATA', index: 0}],
						branches: {},
						pattern: 'function () {}'
					}
				}
			}
		}
	});

	test.done();
};

exports['Store with array'] = function (test) {
	test.expect(1);
	var tumble = tumbler();
	tumble.add([1,2], 'DATA');

	test.deepEqual(tumble.dump(), {
		branches: {
			'%[Array]%': {
				branches: {
					0: {
						branches: {
							1: {
								branches: {
									1: {
										branches: {
											2: {
												data: [{data:'DATA', index: 0}],
												pattern: '[1,2]',
												branches: {}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

	test.done();
};



