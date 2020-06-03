import { forEach } from "ramda";

export {
	ajax,
	add,
	sum,
	log,
	createTrace,
	unary,
	identity,
	partial,
	partialRight,
	constant,
	spreadArgs,
	gatherArgs,
	reverseArgs,
	curry,
	curry2,
	curry3,
	uncurry,
	partialProps,
	curryProps,
	spreadArgProps,
	not,
	when,
	compose2,
	compose,
	compose3,
	compose4,
	compose5,
	compose6,
	pipe,
	prop,
	setProp,
	makeObjProp,
	trampoline,
	map,
	filter,
	filterIn,
	filterOut,
	reduce,
	binary,
	reduceRight,
	unique,
	unique2,
	flatten,
	flatMap,
	zip,
	mergeList,
	partialThis,
	composeChainedMethods,
	unboundMethod,
	flattenReducer,
	guard,
	tree,
};

export interface IBinaryTree {
	parent?: IBinaryTree,
	left?: IBinaryTree,
	right?: IBinaryTree,
	value: any,
}

const tree = {
	forEach: treeForEach,
	map: treeMap,
	reduce: treeReduce,
	filter: treeFilter,
};

function treeFilter(predicateFn: Function, node?: IBinaryTree): IBinaryTree | undefined {
	if (!node) {
		return node;
	}

	let newLeft: IBinaryTree | undefined = node.left ? treeFilter(predicateFn, node.left) : undefined;
	let newRight: IBinaryTree | undefined = node.right ? treeFilter(predicateFn, node.right) : undefined;

	let newNode: IBinaryTree;
	if (predicateFn(node)) {
		newNode = {
			value: node.value,
			parent: node.parent,
			left: newLeft,
			right: newRight,
		};

		if (newLeft) {
			newLeft.parent = newNode;
		}
		if (newRight) {
			newRight.parent = newNode;
		}
	} else {
		if (!newLeft) {
			return newRight;
		}
		if (!newRight) {
			return newLeft;
		}

		newNode = {
			value: undefined,
			parent: node.parent,
			left: newLeft,
			right: newRight,
		};

		newLeft.parent = newRight.parent = newNode;

		if (!newRight.left) {
			newNode.value = newRight.value;
			newNode.right = newRight.right;
			if (newRight.right) {
				newRight.right.parent = newNode;
			}
		} else {
			let minRightNode = newRight;
			while (minRightNode.left) {
				minRightNode = minRightNode.left;
			}

			newNode.value = minRightNode.value;

			if (minRightNode.right) {
				minRightNode.right.parent = minRightNode.parent;
				if (minRightNode.parent) {
					minRightNode.parent.left = minRightNode.right;
				}
			} else {
				minRightNode.left = undefined;
			}

			minRightNode.parent = minRightNode.right = undefined;
		}
	}
	return newNode;
}

function treeReduce(reducerFn: Function, initialValue: any, node?: IBinaryTree): any {
	const ignoreInitialValue = arguments.length < 3;
	if (ignoreInitialValue) {
		node = initialValue;
	}

	if (!node) {
		return initialValue;
	}

	let result;

	if (ignoreInitialValue) {
		if (node.left) {
			// @ts-ignore
			result = treeReduce(reducerFn, node.left);
		} else {
			return node.right ? treeReduce(reducerFn, node, node.right) : node;
		}
	} else {
		result = node.left ? treeReduce(reducerFn, initialValue, node.left) : initialValue;
	}

	result = reducerFn(result, node);

	if (node.right) {
		result = treeReduce(reducerFn, result, node.right);
	}

	return result;
}

function treeMap(mapperFn: Function, node?: IBinaryTree) {
	if (node) {
		let newNode = mapperFn(node);
		newNode.parent = node.parent;

		if (node.left) {
			newNode.left = treeMap(mapperFn, node.left);
			if (newNode.left) {
				newNode.left.parent = newNode;
			}
		}

		if (node.right) {
			newNode.right = treeMap(mapperFn, node.right);
			if (newNode.right) {
				newNode.right.parent = newNode;
			}
		}

		return newNode;
	}
}

function treeForEach(visitFn: Function, node?: IBinaryTree) {
	if (node) {
		if (node.left) {
			treeForEach(visitFn, node.left);
		}
		visitFn(node);
		if (node.right) {
			treeForEach(visitFn, node.right);
		}
	}
}

function guard(fn: Function) {
	return function guard(arg: any) {
		return arg != null ? fn(arg) : arg;
	};
}

function flattenReducer(list: any[], current: any) {
	const flattendArr: any[] = Array.isArray(current) ?
		current.reduce(flattenReducer, [])
		: current;

	return list.concat(flattendArr);
}

function unboundMethod(methodName: string, argCount: number = 2) {
	return curry((...args: any[]) => {
		const obj = args.pop();
		return obj[methodName](...args);
	}, argCount);
}

function composeChainedMethods(...fns: Function[]) {
	return function composed(result: any) {
		return reduceRight((result: any, currentFn: Function) => currentFn.call(result), result, fns);
	};
}

function partialThis(fn: Function, ...presetArgs: any[]) {
	return function partiallyApplied(...laterArgs: any[]) {
		// @ts-ignore
		return fn.apply(this, [...presetArgs, ...laterArgs]);
	}
}

function mergeList(arr1: any[], arr2: any[]) {
	let merged = [];

	arr1 = arr1.slice();
	arr2 = arr2.slice();

	while (arr1.length > 0 || arr2.length > 0) {
		if (arr1.length > 0) {
			merged.push(arr1.shift());
		}

		if (arr2.length > 0) {
			merged.push(arr2.shift());
		}
	}

	return merged;
}

function zip(arr1: any[], arr2: any[]) {
	let zipped = [];
	arr1 = arr1.slice();
	arr2 = arr2.slice();

	while (arr1.length > 0 && arr2.length > 0) {
		zipped.push([arr1.shift(), arr2.shift()]);
	}

	return zipped;
}

function flatMap(mapperFn: Function, arr: any[]) {
	const concatReducer = (acc: any[], current: any) => acc.concat(mapperFn(current));
	return reduce(concatReducer, [], arr);
}

function flatten(arr: any[], deepth: number = Infinity) {
	const flattenItem = (item: any) => {
		if (deepth < 1) {
			return [item];
		} else if (Array.isArray(item)) {
			return flatten(item, deepth - 1);
		} else {
			return item;
		}
	};

	const concatFlattendItems = (acc: any[], current: any) => acc.concat(flattenItem(current));

	return reduce(concatFlattendItems, [], arr);
}

function unique2(arr: any[]) {
	return reduce((acc: any[], current: any) => {
		if (acc.indexOf(current) === -1) {
			acc.push(current);
		}
		return acc;
	}, [], arr);
}

function unique(arr: any[]) {
	const isFirst = (v: any, idx: number, ar: any[]) => ar.indexOf(v) === idx;
	return filterIn(isFirst, arr);
}

function reduceRight(reducerFn: Function, initialValue: any, arr: any[]) {
	const reverseArr = arr.slice(0).reverse();
	return reduce(reducerFn, initialValue, reverseArr);
}

function binary(fn: Function) {
	return function binaried(arg1: any, arg2: any) {
		return fn(arg1, arg2);
	}
}

function reduce(reducerFn: Function, initialValue: any, arr: any[]) {
	let acc: any;
	let startIndex: number;

	if (arguments.length === 3) {
		acc = initialValue;
		startIndex = 0;
	} else if (arr.length > 0) {
		acc = arr[0];
		startIndex = 1;
	} else {
		throw new Error('Must provide at least one value');
	}

	for (let idx = startIndex; idx < arr.length; idx++) {
		acc = reducerFn(acc, arr[idx], idx, arr);
	}

	return acc;
}

const filterIn = filter;

function filterOut(predicateFn: Function, arr: any[]) {
	return filterIn(not(predicateFn), arr);
}

function filter(predicateFn: Function, arr: any[]) {
	const newList = [];

	for (let [idx, v] of arr.entries()) {
		if (predicateFn(v, idx, arr)) {
			newList.push(v);
		}
	}

	return newList;
}

function map(mapperFn: Function, arr: any[]) {
	const newList = [];

	for (let [idx, v] of arr.entries()) {
		newList.push(mapperFn(v, idx, arr));
	}

	return newList;
}

function trampoline(fn: Function) {
	return function trampolined(...args: any[]) {
		let result = fn(...args);
		while (typeof result === 'function') {
			result = result();
		}
		return result;
	}
}

const makeObjProp = function makeObjProp(name: string, value: any) {
	return setProp(name, {}, value);
}

const setProp = curry(function setProp(name: string, obj: any, value: any) {
	const o = Object.assign({}, obj);
	o[name] = value;
	return o;
})

const prop = curry(function prop(name: string, obj: any) {
	return obj[name];
});

const pipe = reverseArgs(compose);

function compose6(...fns: Function[]): Function {
	const [fn1, fn2, ...rest] = fns.reverse();

	if (rest.length === 0) {
		return composed;
	} else {
		return compose6(...rest.reverse(), composed);
	}

	function composed(...args: any[]) {
		return fn2(fn1(...args));
	}
}

function compose5(fns: Function[]) {
	return fns.length <= 0
		? identity
		: function composed(...args: any[]) {
			compose5(fns.slice(0, -1))(fns[fns.length - 1](...args));
		};
}

function compose4(...fns: Function[]) {
	return fns.slice()
		.reverse()
		.reduce((fn1: Function, fn2: Function) => {
			return function composed(...args: any[]) {
				return fn2(fn1(...args));
			}
		});
}

function compose3(...fns: Function[]) {
	return function composed(result: any) {
		return fns.slice()
			.reverse()
			.reduce((result, fn) => fn(result), result);
	}
}

function compose(...fns: Function[]) {
	return function composed(result: any) {
		const fnsCopy = fns.slice();

		while (fnsCopy.length > 0) {
			const fn = (fnsCopy.pop()) as Function;
			result = fn(result);
		}

		return result;
	};
}

function compose2(fn2: Function, fn1: Function) {
	return function composed(origValue: any) {
		return fn2(fn1(origValue));
	}
}

function when(predicate: Function, fn: Function) {
	return function conditional(...args: any[]) {
		if (predicate(...args)) {
			return fn(...args);
		}
	}
}

function not(predicate: Function) {
	return function negated(...args: any[]) {
		return !predicate(...args);
	}
}

function spreadArgProps(
	fn: Function,
	propOrder: string[] = fn.toString()
		.replace(/^(?:(?:function.*\(([^]*?)\))|(?:([^\(\)]+?)\s*=>)|(?:\(([^]*?)\)\s*=>))[^]+$/, '$1$2$3')
		.split(/\s*,\s*/)
		.map(v => v.replace(/[=\s].*$/, ''))
) {
	return function spreadFn(argsObj: { [index: string]: any }) {
		return fn(...propOrder.map(v => argsObj[v]));
	}
}

function partialProps(fn: Function, presetArgsObj: object) {
	return function partiallyApplied(laterArgsObj: object) {
		return fn(Object.assign({}, presetArgsObj, laterArgsObj));
	}
}

function curryProps(fn: Function, arity: number = 1) {
	return (function nextCurried(prevArgsObj: object) {
		return function curried(nextArgsObj: object) {
			const argsObj = Object.assign({}, prevArgsObj, nextArgsObj);
			if (Object.keys(argsObj).length >= arity) {
				return fn(argsObj);
			} else {
				return nextCurried(argsObj);
			}
		};
	})({});
}

function uncurry(fn: Function) {
	return function uncurried(...args: any[]) {
		let ret = fn;
		for (let arg of args) {
			ret = ret(arg);
		}
		return ret;
	}
}

function curry3(fn: Function, preArgs: any[] = []) {
	return function curried(...laterArgs: any[]) {
		const args = [...preArgs, ...laterArgs];
		if (args.length >= fn.length) {
			return fn(...args);
		} else {
			return curry3(fn, args);
		}
	}
}

function curry(fn: Function, arity = fn.length) {
	return (function nextCurried(prevArgs: any[]) {
		return function curried(...nextArg: any) {
			const args = [...prevArgs, ...nextArg];

			if (args.length >= arity) {
				return fn(...args);
			} else {
				return nextCurried(args);
			}
		}
	})([]);
}

var curry2 =
	(fn: Function, arity = fn.length) => {
		var nextCurried = (prevArgs: any[]) =>
			(nextArg: any) => {
				var args = [...prevArgs, nextArg];

				if (args.length >= arity) {
					return fn(...args);
				}
				else {
					return nextCurried(args);
				}
			};
		return nextCurried([]);
	};

function reverseArgs(fn: Function) {
	return function argsReversed(...args: any[]) {
		return fn(...args.reverse());
	}
}

function gatherArgs(fn: Function) {
	return function gatherFn(...args: any[]) {
		return fn(args);
	}
}

function spreadArgs(fn: Function) {
	return function spreadFn(argsArr: any[]) {
		return fn(...argsArr);
	}
}

function constant(v: any) {
	return function value() {
		return v;
	}
}

function partialRight_2(fn: Function, ...presetArgsRight: any[]) {
	return reverseArgs(partial(reverseArgs(fn), ...presetArgsRight.reverse()));
}

function partialRight(fn: Function, ...presetArgs: any[]) {
	return function partialApplied(...laterArgs: any[]) {
		return fn(...laterArgs, ...presetArgs);
	}
}
function partial(fn: Function, ...presetArgs: any[]) {
	return function partiallyApplied(...laterArgs: any[]) {
		return fn(...presetArgs, ...laterArgs);
	}
}

function identity(v: any) {
	return v;
}


function unary(fn: Function) {
	return function onlyOnArg(arg: any) {
		return fn(arg);
	}
}

function createTrace(...presetArgs: any[]) {
	return function trace(...laterArgs: any[]) {
		// const methodName = trace.caller.name; // trace.caller.name;
		return log(...presetArgs,/*methodName,*/ ...laterArgs);
	}
}

function log(...args: any) {
	console.log(...args);
}

function add(x: number, y: number) {
	return x + y;
}

function sum(...args: any[]) {
	return args.reduce(add);
}

const ajax = curry(function ajax(url: string, data: object, cb: Function) {
	log(`ajax(url: ${url}, data: ${JSON.stringify(data)})`);
	cb(data);
});