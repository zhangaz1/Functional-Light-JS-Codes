import { runTest as runCh3Test } from './ch3';
import { runTest as runCh4Test } from './ch4';
import { runTest as runCh8Test } from './ch8';
import { runTest as runCh9Test } from './ch9';
import { runTest as runCh10Test } from './ch10';
import { runTest as runAppendixA } from './appendix-A';
import { runTest as runAppendixB } from './appendix-B';

; (function start() {
	console.log('hello world!');

	// runCh3Test();
	// runCh4Test();
	// runCh8Test();
	// runCh9Test();
	// runCh10Test();
	// runAppendixA();
	runAppendixB();

	// test1();
	// test2();

	/*-----------------------------------------------------------------------------
	 *  tests:
	 *---------------------------------------------------------------------------*/


	function test2() {

		const text = "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

		const filterWords =
			// return void(0);

			function words(str: string) {
				return String(str)
					.toLowerCase()
					.split(/\s|\b/)
					.filter(function alpha(v) {
						return /^[\w]+$/.test(v);
					});
			}

		function unique(list: string[]) {
			const uniqList = [];

			for (let v of list) {
				// 值在新的列表中不存在吗？
				if (uniqList.indexOf(v) === -1) {
					uniqList.push(v);
				}
			}

			return uniqList;
		}

		function skipShortWords(words: string[]) {
			var filteredWords = [];

			for (let word of words) {
				if (word.length > 4) {
					filteredWords.push(word);
				}
			}

			return filteredWords;
		}

		function skipLongWords(words: string[]) {
			return words.filter(w => w.length < 4);
		}

		function compose(...fns: Function[]) {
			return function composed(result: any) {
				// 拷贝函数的数组
				var list = fns.slice();

				while (list.length > 0) {
					// 从列表的最后取出最后一个函数
					// 并执行它
					const fn = list.pop();
					if (fn) {
						result = fn(result);
					}
				}

				return result;
			};
		}

	}

	function test1() {
		const togetherArgs = (fn: any) => (...args: any) => fn(args);
		const sum = (a: number, b: number) => a + b;
		const sumTwo = ([a, b]: number[]) => a + b;
		const total = [1, 2, 3, 4, 5].reduce(togetherArgs(sumTwo), 10);
		console.log(`total = ${total}`);
	}
})();