
var tumbler = require('../tumbler');


exports['Delete empty object'] = function(test){

	var tumble = tumbler();

	tumble.add({}, 'DATA');

	var count = tumble.remove({}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, { branches: {} });

	test.done();
};

exports['Delete single item object'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA');

	var count = tumble.remove({a:1}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, { branches: {} });

	test.done();
};

exports['Delete single item object that was not added'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA');

	var count = tumble.remove({a:2}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 0);
	test.deepEqual(tree, {
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

exports['Delete single item object that was not added, part 2'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA');

	var count = tumble.remove({b:1}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 0);
	test.deepEqual(tree, {
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


exports['Delete single item on collection with multiple items'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:2}, 'DATA2');
	tumble.add({b:1}, 'DATA3');

	var count = tumble.remove({b:1}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, {
		branches: {
			a: {
				branches: {
					1: {
						data: [{data:'DATA1', index: 0}],
						pattern: '{"a":1}',
						branches: {}
					},
					2: {
						data: [{data:'DATA2', index: 1}],
						pattern: '{"a":2}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};


exports['Delete single item on collection with multiple items, part 2'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:2}, 'DATA2');
	tumble.add({b:1}, 'DATA3');

	var count = tumble.remove({a:1}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, {
		branches: {
			a: {
				branches: {
					2: {
						data: [{data:'DATA2', index: 1}],
						pattern: '{"a":2}',
						branches: {}
					}
				}
			},
			b: {
				branches: {
					1: {
						data: [{data:'DATA3', index: 2}],
						pattern: '{"b":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};


exports['Delete single item on collection with multiple items, part 3'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:2}, 'DATA2');
	tumble.add({b:1}, 'DATA3');

	var count = tumble.remove({a:2}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, {
		branches: {
			a: {
				branches: {
					1: {
						data: [{data:'DATA1', index: 0}],
						pattern: '{"a":1}',
						branches: {}
					}
				}
			},
			b: {
				branches: {
					1: {
						data: [{data:'DATA3', index: 2}],
						pattern: '{"b":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};

exports['Delete multiple items under same pattern'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({b:1}, 'DATA3');
	tumble.add({a:1}, 'DATA2');

	var count = tumble.remove({a:1}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 2);
	test.deepEqual(tree, {
		branches: {
			b: {
				branches: {
					1: {
						data: [{data:'DATA3', index: 1}],
						pattern: '{"b":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};

exports['Delete single item under multiple item pattern'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({b:1}, 'DATA3');
	tumble.add({a:1}, 'DATA2');

	var count = tumble.remove({a:1}, 'DATA2', true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, {
		branches: {
			a: {
				branches: {
					1: {
						data: [{data:'DATA1', index: 0}],
						pattern: '{"a":1}',
						branches: {}
					}
				}
			},
			b: {
				branches: {
					1: {
						data: [{data:'DATA3', index: 1}],
						pattern: '{"b":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};

exports['Delete complex key'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:1, c: {d: 10}, e:4}, 'DATA2');
	tumble.add({a:1}, 'DATA4');
	tumble.add({b:1}, 'DATA5');

	var count = tumble.remove({a:1, c: {d: 10}, e:4}, undefined, true);
	var tree = tumble.dump();

	test.strictEqual(count, 1);
	test.deepEqual(tree, {
		branches: {
			a: {
				branches: {
					1: {
						data: [{data:'DATA1', index: 0}, { data: 'DATA4', index: 2 }],
						pattern: '{"a":1}',
						branches: {	}
					}
				}
			},
			b: {
				branches: {
					1: {
						data: [{data:'DATA5', index: 3}],
						pattern: '{"b":1}',
						branches: {}
					}
				}
			}
		}
	});

	test.done();
};

exports['Delete one complex key from tree with multiple complex keys'] = function(test){

	var tumble = tumbler();

	tumble.add({a:1}, 'DATA1');
	tumble.add({a:1, c: {d: 10}}, 'DATA2');
	tumble.add({a:1, c: {d: 10}, e: 11}, 'DATA3');
	tumble.add({a:1, c: {e: 10}}, 'DATA4');
	tumble.add({a:1}, 'DATA5');
	tumble.add({b:1}, 'DATA6');

	var count = tumble.remove({a:1, c: {d: 10}}, undefined, true);
	var tree = tumble.dump();
	var expected = {
		branches: {
			a: {
				branches: {
					1: {
						branches: {
							'c': {
								branches: {
									'%[Object]%': {
										branches: {
											d: {
												branches: {
													'10': {
														branches: {
															'%[ObjectEnd]%': {
																branches: {
																	e: {
																		branches: {
																			'11': {
																				branches: {},
																				data: [{data:'DATA3', index: 2}],
																				pattern: '{"a":1,"c":{"d":10},"e":11}'
																			}
																		}
																	}
																}
															}
														}
													}
												}
											},
											e: {
												branches: {
													'10': {
														branches: {
															'%[ObjectEnd]%': {
																branches: {},
																data: [{data:'DATA4', index: 3}],
																pattern: '{"a":1,"c":{"e":10}}'
															}
														}
													}
												}
											}
										}
									}
								}
							}
						},
						data: [{data:'DATA1', index: 0}, { data: 'DATA5', index: 4 }],
						pattern: '{"a":1}'
					}
				}
			},
			b: {
				branches: {
					1: {
						branches: {},
						data: [{data:'DATA6', index: 5}],
						pattern: '{"b":1}'
					}
				}
			}
		}
	};

	test.strictEqual(count, 1);
	test.deepEqual(tree, expected);

	test.done();
};




