import {
	ajax,
	add,
	sum,
	createTrace,
	unary,
	identity,
	constant,
	partial,
	spreadArgs,
	gatherArgs,
	reverseArgs,
	partialRight,
	curry,
	curry2,
	curry3,
	uncurry,
	curryProps,
	partialProps,
	spreadArgProps,
	not,
	when,
} from './tools';
import { stringify } from 'querystring';

const arr = ['1', '2', '3'];
const numArr = [1, 2, 3, 4, 5];
const trace = createTrace('ch3 #');

export {
	runTest,
};

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
	test15();

}

function test15() {
	const msg1 = 'Hello';
	const msg2 = msg1 + ' World';
	const isLongEnough = not(isShortEnough);
	const printIf = uncurry(partialRight(when, output));

	printIf(isShortEnough, msg1);
	printIf(isLongEnough, msg2);

	function isShortEnough(str: string) {
		return str.length <= 5;
	}

	// function printIf(predicate: Function, msg: string) {
	// 	if (predicate(msg)) {
	// 		output(msg);
	// 	}
	// }

	function output(txt: any) {
		trace('test15', txt);
	}
}

function test14() {
	const pbar = spreadArgProps(bar);
	const cf = curryProps(pbar, 3);
	const pf = partialProps(pbar, { y: 2 });

	cf({ y: 2 })({ x: 1 })({ z: 3 });
	pf({ z: 3, x: 1 });

	function bar(x: any, y: any, z: any) {
		trace('test14', `x: ${x}, y: ${y}, z: ${z}`);
	}
}

function test13() {
	const f1 = curryProps(foo, 3);
	const f2 = partialProps(foo, { y: 2 });

	f1({ x: 1 })({ y: 2 })({ z: 3 });
	f2({ x: 1, z: 3 });

	function foo({ x, y, z }: { x: any, y: any, z: any }) {
		trace('test13', `{ x: ${x}, y: ${y}, z: ${z} }`);
	}
}

function test12() {
	const curriedSum = curry(sum, 5);
	const uncurriedSum = uncurry(curriedSum);

	trace('test12-1', curriedSum(1)(2)(3)(4)(5));
	trace('test12-2', uncurriedSum(1, 2, 3, 4, 5));
	trace('test12-3', uncurriedSum(1, 2)(3)(4, 5));
}

function test11() {
	const adder = curry(add);
	trace('test11', numArr.map(adder(3)));
	trace('test11', numArr.map(curry(add)(3)));
	testCurryAjax(ajax, curry);
	testCurryAjax(ajax, curry2);
	testCurryAjax(ajax, curry3);

	function testCurryAjax(ajax: Function, curry: Function) {
		const curriedAjax = curry(ajax);
		const personFetcher = curriedAjax('http://some.api/person');
		const getCurrentUser = personFetcher({ user: 'id_xxx' });
		getCurrentUser((data: any) => trace('test11', data));
	}
}

function test10() {
	partialRight(logArgs, 'c', 'd')('a', 'b');

	function logArgs(a: string, b: string, c: string, d: string) {
		trace('test10', a, b, c, d);
	}
}

function test9() {
	reverseArgs(logArgs)('a', 'b', 'c');

	function logArgs(a: string, b: string, c: string) {
		trace('test9', a, b, c);
	}
}

function test8() {
	trace('test8', numArr.map(partial(add, 3)));
}

function test7() {
	const result = numArr.reduce(gatherArgs(combineFirstTwo));
	trace('test7', result);

	function combineFirstTwo([v1, v2]: [number, number]) {
		return v1 + v2;
	}
}

function test6() {
	bar(foo);
	bar(spreadArgs(foo));

	function foo(x: number, y: number) {
		trace('test6', x + y);
	}

	function bar(fn: Function) {
		fn([3, 9]);
	}
}

function test5() {
	Promise.resolve()
		.then(constant(5))
		.then(partial(trace, 'test5'));
}

function test4() {
	output('Hello World');
	output('Hello World', upper);

	function output(msg: string, formatFn = identity) {
		msg = formatFn(msg);
		trace('test4', msg);
	}

	function upper(text: string) {
		return text.toUpperCase();
	}
}

function test3() {
	const words = "   Now is the time for all...  ".split(/\s+|\b/);
	trace('test3', words);
	trace('test3-2', words.filter(identity));
}

function test2() {
	trace('test2:', arr.map(unary(parseInt)));
}

function test1() {
	trace('test1:', arr.map(parseInt));
}