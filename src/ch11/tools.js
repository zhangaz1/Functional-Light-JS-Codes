export { ajax, add, sum, log, createTrace, unary, identity, partial, partialRight, constant, spreadArgs, gatherArgs, reverseArgs, curry, curry2, curry3, uncurry, partialProps, curryProps, spreadArgProps, not, when, compose2, compose, compose3, compose4, compose5, compose6, pipe, prop, setProp, makeObjProp, trampoline, map, filter, filterIn, filterOut, reduce, binary, reduceRight, unique, unique2, flatten, flatMap, zip, mergeList, partialThis, composeChainedMethods, unboundMethod, flattenReducer, guard, tree, listify, first, last, };
function last(list) {
    list = listify(list);
    return list[list.length - 1];
}
function first(list) {
    return listify(list)[0];
}
function listify(itemOrList) {
    return Array.isArray(itemOrList)
        ? itemOrList
        : [itemOrList];
}
const tree = {
    forEach: treeForEach,
    map: treeMap,
    reduce: treeReduce,
    filter: treeFilter,
};
function treeFilter(predicateFn, node) {
    if (!node) {
        return node;
    }
    let newLeft = node.left ? treeFilter(predicateFn, node.left) : undefined;
    let newRight = node.right ? treeFilter(predicateFn, node.right) : undefined;
    let newNode;
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
    }
    else {
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
        }
        else {
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
            }
            else {
                minRightNode.left = undefined;
            }
            minRightNode.parent = minRightNode.right = undefined;
        }
    }
    return newNode;
}
function treeReduce(reducerFn, initialValue, node) {
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
        }
        else {
            return node.right ? treeReduce(reducerFn, node, node.right) : node;
        }
    }
    else {
        result = node.left ? treeReduce(reducerFn, initialValue, node.left) : initialValue;
    }
    result = reducerFn(result, node);
    if (node.right) {
        result = treeReduce(reducerFn, result, node.right);
    }
    return result;
}
function treeMap(mapperFn, node) {
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
function treeForEach(visitFn, node) {
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
function guard(fn) {
    return function guard(arg) {
        return arg != null ? fn(arg) : arg;
    };
}
function flattenReducer(list, current) {
    const flattendArr = Array.isArray(current) ?
        current.reduce(flattenReducer, [])
        : current;
    return list.concat(flattendArr);
}
function unboundMethod(methodName, argCount = 2) {
    return curry((...args) => {
        const obj = args.pop();
        return obj[methodName](...args);
    }, argCount);
}
function composeChainedMethods(...fns) {
    return function composed(result) {
        return reduceRight((result, currentFn) => currentFn.call(result), result, fns);
    };
}
function partialThis(fn, ...presetArgs) {
    return function partiallyApplied(...laterArgs) {
        // @ts-ignore
        return fn.apply(this, [...presetArgs, ...laterArgs]);
    };
}
function mergeList(arr1, arr2) {
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
function zip(arr1, arr2) {
    let zipped = [];
    arr1 = arr1.slice();
    arr2 = arr2.slice();
    while (arr1.length > 0 && arr2.length > 0) {
        zipped.push([arr1.shift(), arr2.shift()]);
    }
    return zipped;
}
function flatMap(mapperFn, arr) {
    const concatReducer = (acc, current) => acc.concat(mapperFn(current));
    return reduce(concatReducer, [], arr);
}
function flatten(arr, deepth = Infinity) {
    const flattenItem = (item) => {
        if (deepth < 1) {
            return [item];
        }
        else if (Array.isArray(item)) {
            return flatten(item, deepth - 1);
        }
        else {
            return item;
        }
    };
    const concatFlattendItems = (acc, current) => acc.concat(flattenItem(current));
    return reduce(concatFlattendItems, [], arr);
}
function unique2(arr) {
    return reduce((acc, current) => {
        if (acc.indexOf(current) === -1) {
            acc.push(current);
        }
        return acc;
    }, [], arr);
}
function unique(arr) {
    const isFirst = (v, idx, ar) => ar.indexOf(v) === idx;
    return filterIn(isFirst, arr);
}
function reduceRight(reducerFn, initialValue, arr) {
    const reverseArr = arr.slice(0).reverse();
    return reduce(reducerFn, initialValue, reverseArr);
}
function binary(fn) {
    return function binaried(arg1, arg2) {
        return fn(arg1, arg2);
    };
}
function reduce(reducerFn, initialValue, arr) {
    let acc;
    let startIndex;
    if (arguments.length === 3) {
        acc = initialValue;
        startIndex = 0;
    }
    else if (arr.length > 0) {
        acc = arr[0];
        startIndex = 1;
    }
    else {
        throw new Error('Must provide at least one value');
    }
    for (let idx = startIndex; idx < arr.length; idx++) {
        acc = reducerFn(acc, arr[idx], idx, arr);
    }
    return acc;
}
const filterIn = filter;
function filterOut(predicateFn, arr) {
    return filterIn(not(predicateFn), arr);
}
function filter(predicateFn, arr) {
    const newList = [];
    for (let [idx, v] of arr.entries()) {
        if (predicateFn(v, idx, arr)) {
            newList.push(v);
        }
    }
    return newList;
}
function map(mapperFn, arr) {
    const newList = [];
    for (let [idx, v] of arr.entries()) {
        newList.push(mapperFn(v, idx, arr));
    }
    return newList;
}
function trampoline(fn) {
    return function trampolined(...args) {
        let result = fn(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
}
const makeObjProp = function makeObjProp(name, value) {
    return setProp(name, {}, value);
};
const setProp = curry(function setProp(name, obj, value) {
    const o = Object.assign({}, obj);
    o[name] = value;
    return o;
});
const prop = curry(function prop(name, obj) {
    return obj[name];
});
const pipe = reverseArgs(compose);
function compose6(...fns) {
    const [fn1, fn2, ...rest] = fns.reverse();
    if (rest.length === 0) {
        return composed;
    }
    else {
        return compose6(...rest.reverse(), composed);
    }
    function composed(...args) {
        return fn2(fn1(...args));
    }
}
function compose5(fns) {
    return fns.length <= 0
        ? identity
        : function composed(...args) {
            compose5(fns.slice(0, -1))(fns[fns.length - 1](...args));
        };
}
function compose4(...fns) {
    return fns.slice()
        .reverse()
        .reduce((fn1, fn2) => {
            return function composed(...args) {
                return fn2(fn1(...args));
            };
        });
}
function compose3(...fns) {
    return function composed(result) {
        return fns.slice()
            .reverse()
            .reduce((result, fn) => fn(result), result);
    };
}
function compose(...fns) {
    return function composed(result) {
        const fnsCopy = fns.slice();
        while (fnsCopy.length > 0) {
            const fn = (fnsCopy.pop());
            result = fn(result);
        }
        return result;
    };
}
function compose2(fn2, fn1) {
    return function composed(origValue) {
        return fn2(fn1(origValue));
    };
}
function when(predicate, fn) {
    return function conditional(...args) {
        if (predicate(...args)) {
            return fn(...args);
        }
    };
}
function not(predicate) {
    return function negated(...args) {
        return !predicate(...args);
    };
}
function spreadArgProps(fn, propOrder = fn.toString()
    .replace(/^(?:(?:function.*\(([^]*?)\))|(?:([^\(\)]+?)\s*=>)|(?:\(([^]*?)\)\s*=>))[^]+$/, '$1$2$3')
    .split(/\s*,\s*/)
    .map(v => v.replace(/[=\s].*$/, ''))) {
    return function spreadFn(argsObj) {
        return fn(...propOrder.map(v => argsObj[v]));
    };
}
function partialProps(fn, presetArgsObj) {
    return function partiallyApplied(laterArgsObj) {
        return fn(Object.assign({}, presetArgsObj, laterArgsObj));
    };
}
function curryProps(fn, arity = 1) {
    return (function nextCurried(prevArgsObj) {
        return function curried(nextArgsObj) {
            const argsObj = Object.assign({}, prevArgsObj, nextArgsObj);
            if (Object.keys(argsObj).length >= arity) {
                return fn(argsObj);
            }
            else {
                return nextCurried(argsObj);
            }
        };
    })({});
}
function uncurry(fn) {
    return function uncurried(...args) {
        let ret = fn;
        for (let arg of args) {
            ret = ret(arg);
        }
        return ret;
    };
}
function curry3(fn, preArgs = []) {
    return function curried(...laterArgs) {
        const args = [...preArgs, ...laterArgs];
        if (args.length >= fn.length) {
            return fn(...args);
        }
        else {
            return curry3(fn, args);
        }
    };
}
function curry(fn, arity = fn.length) {
    return (function nextCurried(prevArgs) {
        return function curried(...nextArg) {
            const args = [...prevArgs, ...nextArg];
            if (args.length >= arity) {
                return fn(...args);
            }
            else {
                return nextCurried(args);
            }
        };
    })([]);
}
var curry2 = (fn, arity = fn.length) => {
    var nextCurried = (prevArgs) => (nextArg) => {
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
function reverseArgs(fn) {
    return function argsReversed(...args) {
        return fn(...args.reverse());
    };
}
function gatherArgs(fn) {
    return function gatherFn(...args) {
        return fn(args);
    };
}
function spreadArgs(fn) {
    return function spreadFn(argsArr) {
        return fn(...argsArr);
    };
}
function constant(v) {
    return function value() {
        return v;
    };
}
function partialRight_2(fn, ...presetArgsRight) {
    return reverseArgs(partial(reverseArgs(fn), ...presetArgsRight.reverse()));
}
function partialRight(fn, ...presetArgs) {
    return function partialApplied(...laterArgs) {
        return fn(...laterArgs, ...presetArgs);
    };
}
function partial(fn, ...presetArgs) {
    return function partiallyApplied(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}
function identity(v) {
    return v;
}
function unary(fn) {
    return function onlyOnArg(arg) {
        return fn(arg);
    };
}
function createTrace(...presetArgs) {
    return function trace(...laterArgs) {
        // const methodName = trace.caller.name; // trace.caller.name;
        return log(...presetArgs, /*methodName,*/ ...laterArgs);
    };
}
function log(...args) {
    console.log(...args);
    return args[args.length - 1];
}
function add(x, y) {
    return x + y;
}
function sum(...args) {
    return args.reduce(add);
}
const ajax = curry(function ajax(url, data, cb) {
    log(`ajax(url: ${url}, data: ${JSON.stringify(data)})`);
    cb(data);
});
