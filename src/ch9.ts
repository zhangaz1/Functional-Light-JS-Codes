import {
	createTrace,
	not,
	filterIn,
	filterOut,
	pipe,
	unique,
	unique2,
	flatten,
	flatMap,
	zip,
	mergeList,
	map,
	reduce,
	compose,
	composeChainedMethods,
	partialThis,
	partialRight,
	curry,
	unboundMethod,
	flattenReducer,
	partial,
	prop,
	guard,
	IBinaryTree,
	tree,
} from './tools'; import { binary, values } from 'ramda';

export {
	runTest,
}

const {
	forEach: treeForEach,
	map: treeMap,
	reduce: treeReduce,
	filter: treeFilter,
} = tree;

const trace = createTrace('ch9 #');

const isOdd = (n: number) => n % 2 === 1;
const isEven = not(isOdd);
const double = (n: number) => n * 2;
const sum = (a: number, b: number) => a + b;

class BinaryTree implements IBinaryTree {
	constructor(
		public value: any,
		public parent?: BinaryTree,
		public left?: BinaryTree,
		public right?: BinaryTree
	) { }
}

function runTest() {
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
	test13();
	test14();
}

function test14() {
	const banana = createTree();

	test1();
	test2();
	test3();
	test4();

	function test4() {
		const vagatables = ['asparagus', 'avocado', 'broccoli', 'carrot', 'celery', 'corn', 'cucumber', 'lettuce', 'potato', 'squash', 'zucchini'];

		const whatToBuy = treeFilter((node: IBinaryTree) => vagatables.indexOf(node.value) != -1, banana);

		const result = treeReduce(
			(acc: string[], currentNode: IBinaryTree) => [...acc, currentNode.value],
			[],
			whatToBuy
		);

		trace('test14-4', result);
	}

	function test3() {
		const result = treeReduce((acc: any[], currentNode: IBinaryTree) => [...acc, currentNode.value], [], banana);
		trace('test14-3', result);
	}

	function test2() {
		const treeVisitor = createTreeVisitor();
		const BANANA = treeMap((node: IBinaryTree) => new BinaryTree(node.value.toUpperCase()), banana);
		treeForEach(treeVisitor.collectValue, BANANA);
		trace('test14-2', treeVisitor.getValues());
	}

	function test1() {
		const treeVisitor = createTreeVisitor();
		treeForEach(treeVisitor.collectValue, banana);
		trace('test14-1', treeVisitor.getValues());
	}

	function createTreeVisitor() {
		const values: any[] = [];
		return {
			collectValue,
			getValues,
		};

		function collectValue(tree: IBinaryTree) {
			values.push(tree.value);
		}

		function getValues() {
			return values.slice();
		}
	}

	function createTree() {
		const banana = new BinaryTree('banana');
		const apple = banana.left = new BinaryTree('apple', banana);
		const cherry = banana.right = new BinaryTree('cherry', banana);
		const apricot = apple.right = new BinaryTree('apricot', apple);
		const avocado = apricot.right = new BinaryTree('avocado', apricot);
		const cantelope = cherry.left = new BinaryTree('cantelope', cherry);
		const cucumber = cherry.right = new BinaryTree('cucumber', cherry);
		const grape = cucumber.right = new BinaryTree('grape', cucumber);
		return banana;
	}
}

function test13() {
	const words = `Mr. Jones isn't responsible for this disaster!`
		.split(/\s/);
	const removeInvalidChars = (str: string) => str.replace(/[^\w]*/g, '');
	const upper = (str: string) => str.toUpperCase();
	const elide = (str: string) => str.length > 10 ?
		str.slice(0, 7) + '...' :
		str;

	test1();
	test2();

	function test2() {
		const result = words.map(pipe(removeInvalidChars, upper, elide));
		trace('test13-2', result);
	}

	function test1() {
		const result = words.map(removeInvalidChars)
			.map(upper)
			.map(elide);
		trace('test13-1', result);
	}
}

function test12() {
	const getSessionId = partial(prop, 'sessionId');
	const getUserId = partial(prop, 'userId');

	test1();
	test2();
	test3();

	function test3() {
		mergeList(
			['sessionId', 'userId']
				.map((propName: string) => partial(prop, propName)),
			[lookupUser, lookupOrders, processOrders]
		).map(guard)
			.reduce(
				(result: any, nextFn: Function) => nextFn(result),
				getCurrentSession()
			);

		function processOrders(orders: any[]) {
			trace('test12-3', orders);
		}
	}

	function test2() {
		[getSessionId, lookupUser, getUserId, lookupOrders, processOrders]
			.map(guard)
			.reduce(
				(result: any, nextFn: Function) => nextFn(result),
				getCurrentSession()
			);

		function processOrders(orders: any[]) {
			trace('test12-2', orders);
		}
	}

	function test1() {

		let session, sessionId, user, userId, orders;

		session = getCurrentSession();
		if (session != null) {
			sessionId = getSessionId(session);
		}
		if (sessionId != null) {
			user = lookupUser(sessionId);
		}
		if (user != null) {
			userId = getUserId(user);
		}
		if (userId != null) {
			orders = lookupOrders(userId);
		}
		if (orders != null) {
			processOrders(orders);
		}

		function processOrders(orders: any[]) {
			trace('test12-1', orders);
		}
	}

	function lookupOrders(userId: string) {
		return [{
			orderId: 'orderId:xxx',
			userId: userId,
		}]
	}

	function lookupUser(sessionId: string) {
		return {
			userId: 'userId:xxx',
			sessionId: sessionId,
		};
	}

	function getCurrentSession() {
		return {
			sessionId: 'sid:xxx',
		};
	}
}

function test11() {
	const arr = [[1, 2, 3], 4, 5, [6, [7, 8]]];
	trace('test11-1', arr.reduce(flattenReducer, []));
}

function test10() {
	const arr = [1, 2, 3, 4, 5];

	test1();
	test2();
	test3();
	test4();

	function test4() {
		// @ts-ignore
		const filter = unboundMethod('filter');
		// @ts-ignore
		const map = unboundMethod('map');
		// @ts-ignore
		const reduce = unboundMethod('reduce', 3);

		const fn = compose(
			reduce(sum)(0),
			map(double),
			filter(isOdd)
		);

		trace('test10-4', fn(arr));
	}

	function test3() {
		// @ts-ignore
		const filter = curry((predicateFn: Function, arr: any[]) => arr.filter(predicateFn));
		// @ts-ignore
		const map = curry((mapper: Function, arr: any[]) => arr.map(mapper));
		// @ts-ignore
		const reduce = curry((reducer: Function, initialValue: any, arr: any[]) => arr.reduce(reducer, initialValue, arr));

		const fn = compose(
			reduce(sum)(0),
			map(double),
			filter(isOdd)
		);

		trace('test10-3', fn(arr));
	}

	function test1() {
		const fn = composeChainedMethods(
			partialThis(Array.prototype.reduce, sum, 0),
			partialThis(Array.prototype.map, double),
			partialThis(Array.prototype.filter, isOdd)
		);

		trace('test10-1', fn(arr));
	}

	function test2() {
		// @ts-ignore
		const filter = (arr: any[], predicateFn: Function) => arr.filter(predicateFn);

		// @ts-ignore
		const map = (arr: any[], mapperFn: Function) => arr.map(mapperFn);

		const reduce = (arr: any[], reducerFn: Function, initialValue: any) =>
			// @ts-ignore
			arr.reduce(reducerFn, initialValue);

		const fn2 = compose(
			partialRight(reduce, sum, 0),
			partialRight(map, double),
			partialRight(filter, isOdd)
		);

		trace('test10-2', fn2(arr));
	}
}

function test9() {
	const arr = [1, 2, 3, 4, 5];

	const result1 = arr.filter(isOdd)
		.map(double)
		.reduce(sum, 0);
	trace('test9-1', result1);

	const result2 = reduce(
		sum, 0,
		map(
			double,
			filterIn(isOdd, arr)
		)
	);
	trace('test9-2', result2);
}

function test8() {
	trace('test8-1', mergeList([1, 3, 5, 7, 9], [2, 4, 6, 8, 10, 12, 14]));
}

function test7() {
	trace('test7-1', zip([1, 3, 5, 7, 9], [2, 4, 6, 8, 10, 12, 14]));
}

function test6() {
	interface IName { name: string, variations: string[] };

	const firstNames: IName[] = [
		{ name: "Jonathan", variations: ["John", "Jon", "Jonny"] },
		{ name: "Stephanie", variations: ["Steph", "Stephy"] },
		{ name: "Frederick", variations: ["Fred", "Freddy"] }
	];

	const toNameArrMapper = (no: IName) => [no.name].concat(no.variations);

	trace('test6-1', flatMap(toNameArrMapper, firstNames));
}

function test5() {
	const arr = [[0, 1], 2, 3, [4, [5, 6, 7], [8, [9, [10, [11, 12], 13]]]]];

	trace('test5-1', flatten(arr));

	trace('test5-2', flatten(arr, 0));
	trace('test5-3', flatten(arr, 1));
	trace('test5-4', flatten(arr, 2));
	trace('test5-5', flatten(arr, 3));
	trace('test5-6', flatten(arr, 4));
	trace('test5-7', flatten(arr, 5));
	trace('test5-8', flatten(arr, 6));
}

function test4() {
	const arr = [1, 2, 2, 3, 1, 4, 5];

	trace('test4-1', unique(arr));
	trace('test4-2', unique2(arr));
}

function test3() {
	const hyphenate = (str: string, char: string) => str + '-' + char;

	trace('test3-1', ['a', 'b', 'c'].reduce(hyphenate));
	trace('test3-2', ['a', 'b', 'c'].reduceRight(hyphenate));
}

function test2() {
	// const pipeReducer = (composedFn: Function, fn: Function) => pipe(composedFn, fn);
	const pipeReducer = binary(pipe);

	const fn = [3, 17, 6, 4]
		.map(v => (n: number) => v * n)
		.reduce(pipeReducer);

	trace('test2-1', fn(9));
	trace('test2-2', fn(10));
}

function test1() {
	trace('test1-1', filterIn(isOdd, [1, 2, 3, 4, 5]));
	trace('test1-2', filterOut(isEven, [1, 2, 3, 4, 5]));
}