"use strict"

import {
	createTrace,
	identity,
	trampoline,
} from './tools';
import { create } from 'domain';
import { is } from 'ramda';

export {
	runTest,
}

const trace = createTrace('ch8 #');

function runTest() {
	test1();
	test2();
	test3();
	test4();
	test5();
}

function test5() {
	const arr = [1, 2, 3, 4, 5];

	trace('test5', trampoline(sum)(...arr));

	function sum(num1: number, num2: number, ...nums: number[]) {
		num1 += num2;
		if (nums.length < 1) {
			return num1;
		}
		// @ts-ignore
		return () => sum(num1, ...nums);
	}
}

function test4() {

	trace('test4', fib(4));

	function fib(n: number, cb = identity): number {
		if (n <= 1) {
			return cb(n);
		}
		return fib(n - 2, (n2) => fib(n - 1, (n1) => cb(n1 + n2)));
	}
}

function test3() {
	var arr = [1, 10, 11, 3, 2];

	trace('test3-1', maxEven(...arr));
	// @ts-ignore
	trace('test3-2', maxEven2(...arr));
	// @ts-ignore
	trace('test3-3', maxEven3(...arr));
	trace('test3-4', maxEven4(...arr));
	// @ts-ignore
	trace('test3-5', maxEven5(...arr));

	function maxEven5(num1: number, num2: number, ...nums: number[]) {
		if (num2 === undefined) {
			return num1 % 2 === 0 ? num1 : undefined;
		}
		// @ts-ignore
		num1 = maxEven5(num1);
		// @ts-ignore
		num2 = maxEven5(num2);
		num1 = num1 || num2;
		num1 = num2 > num1 ? num2 : num1;
		// @ts-ignore
		return nums.length < 1 ? num1 : maxEven5(num1, ...nums);
	}

	function maxEven4(...nums: number[]) {
		return nums.filter(n => n % 2 === 0)
			.reduce((result, current) => current > result ? current : result);
	}

	function maxEven3(num1: number, num2: number, ...nums: number[]) {
		// @ts-ignore
		num1 =
			// @ts-ignore
			num1 % 2 == 0 && !(maxEven3(num2) > num1)
				? num1
				: num2 % 2 == 0
					? num2
					: undefined;
		// @ts-ignore
		return nums.length < 1 ? num1 : maxEven3(num1, ...nums);
	}

	function maxEven2(num1: number, ...nums: number[]) {
		// @ts-ignore
		const maxRest = nums.length > 0 ? maxEven2(...nums) : undefined;

		return num1 % 2 !== 0 || num1 < maxRest ? maxRest : num1;
	}

	function maxEven(...nums: number[]) {
		let maxNum = -Infinity;

		for (let num of nums) {
			if (num % 2 === 0 && num > maxNum) {
				maxNum = num;
			}
		}

		if (maxNum !== -Infinity) {
			return maxNum;
		}
	}
}

function test2() {
	const arr = [1, 2, 3, 4, 5];

	const sum3 = (function IIFE() {
		return function sum(...nums: number[]) {
			// @ts-ignore
			return sumRec(0, ...nums);
		};

		function sumRec(result: number, sum1: number, ...nums: number[]) {
			if (sum1) {
				result += sum1;
			}
			if (nums.length < 1) {
				return result;
			}
			// @ts-ignore
			return sumRec(result, ...nums);
		}
	})();

	// @ts-ignore
	trace('test2-1', sum(...arr));
	// @ts-ignore
	trace('test2-2', sum2(0, ...arr));
	// @ts-ignore
	trace('test2-3', sum3(...arr));
	// @ts-ignore
	trace('test2-4', sum4(...arr));

	function sum4(num1: number, numb2: number, ...nums: number[]) {
		num1 += numb2;
		if (nums.length < 1) {
			return num1;
		}
		// @ts-ignore
		return sum4(num1, ...nums);
	}

	function sum2(result: number, num1: number, ...nums: number[]) {
		if (num1) {
			result += num1;
		}
		if (nums.length < 1) {
			return result;
		}
		// @ts-ignore
		return sum2(result, ...nums);
	}

	function sum(sum1: number, ...nums: number[]) {
		if (nums.length < 1) {
			return sum1;
		}

		// @ts-ignore
		return sum1 + sum(...nums);
	}
}

function test1() {
	trace('test1-1 isOdd(10)', isOdd(10));
	trace('test1-2 isEven(15)', isEven(15));
	trace('test1-3 isEven(10)', isEven(10));
	trace('test1-4 isOdd(15)', isOdd(15));

	// trace('test1-5 isEven', isEven(30000)); // RangeError: Maximum call stack size exceeded

	function isOdd(n: number): boolean {
		if (n === 0) {
			return false;
		}

		return isEven(Math.abs(n) - 1);
	}

	function isEven(n: number): boolean {
		if (n === 0) {
			return true;
		}

		return isOdd(Math.abs(n) - 1);
	}
}