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
};

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