import {
	createTrace,
	curry,
	compose,
	transduce,
} from './tools';

export {
	runTest,
}

const trace = createTrace('appendix-A #');

const words = 'You have written something very interesting'.split(/\s+/g);

function runTest() {
	test1();
}

function test1() {
	test1();
	test2();
	test3();
	test4();
	test5();
	test6();
	test7();
	test8();
	test9();
	test10();
	test11();
	test12();

	function test12() {
		const transduceMap = curry(mapReducer);
		const transduceFilter = curry(filterReducer);

		const strUppercaseReducer = transduceMap(strUppercase);
		const strLongEnoughReducer = transduceFilter(isLongEnough);
		const strShortEnoughReducer = transduceFilter(isShortEnough);

		const transducer = compose(
			strUppercaseReducer,
			strLongEnoughReducer,
			strShortEnoughReducer
		);

		const result1 = transduce(transducer, listCombin, [], words);
		trace('test1-12-1', result1);

		const result2 = transduce(transducer, strConcat, '', words);
		trace('test1-12-2', result2);

		function filterReducer(predicateFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? listCombin(list, val)
					: list;
			}
		}

		function mapReducer(mapperFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return listCombin(list, mapperFn(val));
			}
		}

		function listCombin(list: any[], val: any) {
			list.push(val);
			return list;
		}
	}

	function test11() {
		const transduceMap = curry(mapReducer);
		const transduceFilter = curry(filterReducer);

		const strUppercaseReducer = transduceMap(strUppercase);
		const strLongEnoughReducer = transduceFilter(isLongEnough);
		const strShortEnoughReducer = transduceFilter(isShortEnough);

		const transducer = compose(
			strUppercaseReducer,
			strLongEnoughReducer,
			strShortEnoughReducer
		);

		// const result = words.reduce(transducer(listCombin), [])
		// 	.reduce(strConcat, '');

		const result = words.reduce(transducer(strConcat), '');

		trace('test1-11', result);

		function filterReducer(predicateFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? listCombin(list, val)
					: list;
			}
		}

		function mapReducer(mapperFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return listCombin(list, mapperFn(val));
			}
		}

		function listCombin(list: any[], val: any) {
			list.push(val);
			return list;
		}
	}

	function test10() {
		const curriedMapReducer = curry(mapReducer);
		const curriedFilterReducer = curry(filterReducer);

		const strUppercaseReducer = curriedMapReducer(strUppercase);
		const strLongEnoughReducer = curriedFilterReducer(isLongEnough);
		const strShortEnoughReducer = curriedFilterReducer(isShortEnough);

		const transducer = compose(
			strUppercaseReducer,
			strLongEnoughReducer,
			strShortEnoughReducer
		);

		// const result = words.reduce(transducer(listCombin), [])
		// 	.reduce(strConcat, '');

		const result = words.reduce(transducer(strConcat), '');

		trace('test1-10', result);

		function filterReducer(predicateFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? listCombin(list, val)
					: list;
			}
		}

		function mapReducer(mapperFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return listCombin(list, mapperFn(val));
			}
		}

		function listCombin(list: any[], val: any) {
			list.push(val);
			return list;
		}
	}

	function test9() {
		const curriedMapReducer = curry(mapReducer);
		const curriedFilterReducer = curry(filterReducer);

		const strUppercaseReducer = curriedMapReducer(strUppercase);
		const strLongEnoughReducer = curriedFilterReducer(isLongEnough);
		const strShortEnoughReducer = curriedFilterReducer(isShortEnough);

		const result = words.reduce(
			strUppercaseReducer(strLongEnoughReducer(strShortEnoughReducer(listCombin))), [])
			.reduce(strConcat, '');

		trace('test1-9', result);

		function filterReducer(predicateFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? listCombin(list, val)
					: list;
			}
		}

		function mapReducer(mapperFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return listCombin(list, mapperFn(val));
			}
		}

		function listCombin(list: any[], val: any) {
			return [...list, val];
		}
	}

	function test8() {
		const curriedMapReducer = curry(mapReducer);
		const curriedFilterReducer = curry(filterReducer);

		const strUppercaseReducer = curriedMapReducer(strUppercase)(listCombin);
		const strLongEnoughReducer = curriedFilterReducer(isLongEnough)(listCombin);
		const strShortEnoughReducer = curriedFilterReducer(isShortEnough)(listCombin);

		const result = words.reduce(strUppercaseReducer, [])
			.reduce(strLongEnoughReducer, [])
			.reduce(strShortEnoughReducer, [])
			.reduce(strConcat, '');

		trace('test1-8', result);

		function filterReducer(predicateFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? listCombin(list, val)
					: list;
			}
		}

		function mapReducer(mapperFn: Function, listCombin: Function) {
			return function reducer(list: any[], val: any) {
				return listCombin(list, mapperFn(val));
			}
		}

		function listCombin(list: any[], val: any) {
			return [...list, val];
		}
	}

	function test7() {
		const strUppercaseReducer = mapReducer(strUppercase);
		const strLongEnoughReducer = filterReducer(isLongEnough);
		const strShortEnoughReducer = filterReducer(isShortEnough);

		const result = words.reduce(strUppercaseReducer, [])
			.reduce(strLongEnoughReducer, [])
			.reduce(strShortEnoughReducer, [])
			.reduce(strConcat, '');

		trace('test1-7', result);

		function filterReducer(predicateFn: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? listCombin(list, val)
					: list;
			}
		}

		function mapReducer(mapperFn: Function) {
			return function reducer(list: any[], val: any) {
				return listCombin(list, mapperFn(val));
			}
		}

		function listCombin(list: any[], val: any) {
			return [...list, val];
		}
	}

	function test6() {
		const strUppercaseReducer = mapReducer(strUppercase);
		const strLongEnoughReducer = filterReducer(isLongEnough);
		const strShortEnoughReducer = filterReducer(isShortEnough);

		const result = words.reduce(strUppercaseReducer, [])
			.reduce(strLongEnoughReducer, [])
			.reduce(strShortEnoughReducer, [])
			.reduce(strConcat, '');

		trace('test1-6', result);

		function filterReducer(predicateFn: Function) {
			return function reducer(list: any[], val: any) {
				return predicateFn(val)
					? [...list, val]
					: list;
			}
		}

		function mapReducer(mapperFn: Function) {
			return function reducer(list: any[], val: any) {
				return [...list, mapperFn(val)];
			}
		}
	}

	function test5() {
		// @ts-ignore
		const result = words.reduce(strUppercaseReducer, [])
			.reduce(isLongEnoughReducer, [])
			.reduce(isShortEnoughReducer, [])
			.reduce(strConcat, '');
		trace('test1-5', result);

		function strUppercaseReducer(list: string[], str: string) {
			return [...list, strUppercase(str)];
		}

		function isLongEnoughReducer(list: string[], str: string) {
			return isLongEnough(str)
				? [...list, str]
				: list;
		}

		function isShortEnoughReducer(list: string[], str: string) {
			return isShortEnough(str)
				? [...list, str]
				: list;
		}
	}

	function test4() {
		// @ts-ignore
		const result = words.reduce(strUppercaseReducer, [])
			.reduce(isLongEnoughReducer, [])
			.reduce(isShortEnoughReducer, [])
			.reduce(strConcat, '');
		trace('test1-4', result);

		function strUppercaseReducer(list: string[], str: string) {
			list.push(strUppercase(str));
			return list;
		}

		function isLongEnoughReducer(list: string[], str: string) {
			if (isLongEnough(str)) {
				list.push(str);
			}
			return list;
		}

		function isShortEnoughReducer(list: string[], str: string) {
			if (isShortEnough(str)) {
				list.push(str);
			}
			return list;
		}
	}

	function test3() {
		const result = words.map(strUppercase)
			.filter(isLongEnough)
			.filter(isShortEnough)
			.reduce(strConcat);

		trace('test1-3', result);
	}

	function test2() {
		const result = words.filter(isCorrectLength);
		trace('test1-2', result);

		function isCorrectLength(str: string) {
			return isLongEnough(str) && isShortEnough(str);
		}
	}

	function test1() {
		const result = words.filter(isLongEnough)
			.filter(isShortEnough);

		trace('test1-1', result);
	}

	function isLongEnough(str: string) {
		return str.length >= 5;
	}

	function isShortEnough(str: string) {
		return str.length <= 10;
	}
}

function strUppercase(str: string) {
	return str.toUpperCase();
}

function strConcat(str1: string, str2: string) {
	return str1 + str2;
}
