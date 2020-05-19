import * as R from 'ramda';

import {
	createTrace,
	compose2,
	compose,
	partialRight,
	compose3,
	compose4,
	compose5,
	compose6,
	pipe,
	partial,
	ajax,
	prop,
	setProp,
	curry,
	makeObjProp,
} from './tools';

export { runTest };

const trace = createTrace('ch4 #');

const text = `To compose two functions together, pass the
output of the first function call as the input of the
second function call.`;

function runTest() {
	test1();
	test2();
	test3();
	test4();
	test5();
}

function test5() {
	const getOrder = partial(ajax, 'http://some.api/order', { id: -1, personId: 5 });
	const getPerson = partial(ajax, 'http://some.api/person');

	const extractOrderPersonId = prop('personId');
	const makePersonQueryData = setProp('id', { name: 'zhangsan4' });
	const showPerson = pipe(prop('name'), partial(trace, 'test5'));
	const processPerson = pipe(partialRight(getPerson, showPerson));
	const lookupPerson = pipe(extractOrderPersonId, makePersonQueryData, processPerson);

	getOrder(lookupPerson);
}

function test4() {
	partial(ajax, 'http://some.api/order', { id: -1, personId: 5 })(
		pipe(
			prop('personId'),
			setProp('id', { name: 'zhangsan3' }),
			partialRight(
				partial(ajax, 'http://some.api/person'),
				pipe(
					prop('name'),
					partial(trace, 'test4')
				)
			)
		)
	);
}

function test3() {
	partial(ajax, 'http://some.api/order', { id: -1, personId: 5 })(
		compose(
			partialRight(
				partial(ajax, 'http://some.api/person'),
				compose(
					curry(trace, 2)('test3'),
					prop('name')
				)
			),
			setProp('id', { name: 'zhangsan2' }),
			prop('personId')
		)
	);
}

function test2() {
	const getPerson = ajax('http://some.api/person');
	const getLastOrder = ajax('http://some.api/order', { id: -1, personId: 5 });

	const exractName = prop('name');
	const output = curry(trace, 2)('test2');
	const showPerson = compose(output, exractName);

	const extractOrderPersonId = prop('personId');
	const makePersonSearchData = setProp('id', { name: 'zhangsan' });
	const processPerson = partialRight(getPerson, showPerson);
	const lookupPerson = compose(processPerson, makePersonSearchData, extractOrderPersonId);

	getLastOrder(lookupPerson);
}

function test1() {

	const skipShortWords = (list: string[]) => list.filter(v => v.length > 4);
	const skipLongWords = R.filter(R.compose<string, number, boolean>(R.gt(4), R.prop('length')));

	test1();
	test2();

	function test2() {
		const biggerWords = pipe(words, unique, skipShortWords);
		trace('test1-2-1', biggerWords(text));

		const filterWords = partial(pipe, words, unique);
		trace('test1-2-2', filterWords(skipShortWords)(text));
	}

	function test1() {

		const wordsFound = words(text);
		trace('test1-1-1', wordsFound);

		const wordsUsed = unique(wordsFound);
		trace('test1-1-2', wordsUsed);

		const uniqueWords = compose2(unique, words);
		trace('test1-1-3', uniqueWords(text));

		const letters = compose2(words, unique);
		const chars = letters('How are you Henry?');
		trace('test1-1-4', chars);

		const biggerWords = compose(skipShortWords, unique, words);
		const usedBiggerWords = biggerWords(text);
		trace('test1-1-5', usedBiggerWords);

		const filterWords = partialRight(compose6, unique, words);
		const shorterWords = filterWords(skipLongWords);
		trace('test1-1-6', shorterWords(text));
		trace('test1-1-7', filterWords(skipShortWords)(text));
	}

	function words(str: string) {
		return String(str)
			.toLowerCase()
			.split(/\s|\b/)
			.filter(function alpha(v: string) {
				return /^[\w]+$/.test(v);
			});
	}

	function unique(list: string[]) {
		const uniqList = [];

		for (let v of list) {
			if (uniqList.indexOf(v) === -1) {
				uniqList.push(v);
			}
		}

		return uniqList;
	}
}